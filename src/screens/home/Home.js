import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Alert,
  useColorScheme,
  Platform,

  Button
} from 'react-native';
import FastImage from 'react-native-fast-image';

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {Root, Popup} from 'popup-ui';
import Modal from 'react-native-modal';
import { RNCamera } from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobalStyle from '../../reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import {EssContext} from '../../../Context/EssContext';
import {PermissionsAndroid} from 'react-native';
import useApi from '../../../api/useApi';
import attendence from '../../../api/attendence';
import GetLocation from 'react-native-get-location';
import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import useApi2 from '../../../api/useApi2';
import PullToRefresh from '../../reusable/PullToRefresh';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg';
// import { s3 } from './aws-config';
import AWS ,{Rekognition, S3,} from 'aws-sdk';
const {width} = Dimensions.get('window');
// import messaging from '@react-native-firebas e/messaging';
import Empty from '../../reusable/Empty';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import Themes from '../../Theme/Theme';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {SocketContext} from '../../tracking/SocketContext';
// import { Punch_In } from '../../../APINetwork/ComponentApi';
import {Bucket_Name,accessKey_Id,secretAccess_Key,region} from "@env"

const Home = ({navigation}) => {
  const theme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const punchInApi = useApi2(attendence.punchIn);
  const punchOutApi = useApi2(attendence.punchOut);
  const todayAtendenceApi = useApi2(attendence.todayAttendence);
  const getActiveLocationApi = useApi2(attendence.getActiveLocation);
  const {sendLocation} = useContext(SocketContext);
  const [showCamera,setShowCamera]=useState(false)
  const {setuser} = useContext(EssContext);
  const [news, setnews] = useState([]);
  const [user, setuser1] = useState(null);
  const [inTime, setinTime] = useState(null);
  const [outTime, setoutTime] = useState(null);
  const [punchIn, setpunchIn] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [announcements, setannouncements] = useState([]);
  const [fullTime, setfullTime] = useState(null);
  const [officetiming, setOfficeTiming] = useState('');
  const [firstImage,setFirstImage]=useState(false)
  const [show, setShow] = useState(true);
  const [menu_access,setMenuaccess]=useState()
  const [faceModal,setFaceModal]=useState(false)
  const [faceNotModal,setFaceNotModal]=useState(false)

  const [kYCModal,setKYCModal]=useState(false)
  const [activeLocation, setactiveLocation] = useState({
    latitude: '',
    longitude: '',
    location_id: '',
  });
  const [activityTime, setactivityTime] = useState(null);

  const [currentLocation, setcurrentLocation] = useState({
    long: '',
    lat: '',
  });

  const [locationOut, setlocationOut] = useState(null);
  const [timerOn, settimerOn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apirecentlog, setGetApiRecenLog] = useState([]);
  const [faces, setFaces] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [face_kyc_img,setFace_kyc_img]=useState()
 
  const s3 = new S3({
    accessKeyId:accessKey_Id,
    secretAccessKey:secretAccess_Key,
    region: region
  }); 
  
  const rekognition = new Rekognition({
    accessKeyId:accessKey_Id,
    secretAccessKey:secretAccess_Key,
    region: region
  });
  const cameraRef = useRef(null);

    useEffect(async()=>{
          const response=JSON.parse(await AsyncStorage.getItem('FaceDetect'));
          setMenuaccess(response[0]?.name)
    },[])


  const handleFacesDetected = ({ faces }) => {
    setFaces(faces);
  };
  const [capturedImage, setCapturedImage] = useState(null);
  const [blob,setBlob]=useState()
  const UpdateProfile = async (key) => {
    const token = await AsyncStorage.getItem('Token');
    let data = new FormData();
data.append('face_kyc', '1');
data.append('face_kyc_img',key);
 

    fetch(`${apiUrl}/SecondPhaseApi/update_face_kyc`, {
      method: 'POST',
      headers: {
        'Token': token,
        Accept: 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        console.log(response,'response')
        setKYCModal(true)
        setFirstImage(false)
        setShowCamera(false)
        setIsModalVisible(false)
        // getUserFace()
      })
      .catch(err => {
        setloading(false);
       
        if(err.response.status=='401')
        {
    
     
        }
      });
  }
  const takePicture = async () => {
    if (cameraRef.current && showCamera) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setBlob(data)
      setCapturedImage(data.uri);
      if(firstImage){
        const response=await FirstTimeUploadImage(data.uri)
        const key=response?.key
        if (key){
            UpdateProfile(key)
        }
      }
      else {
        const uploadResult = await uploadTmpimage(data.uri);
      
        const s3ObjectKey = uploadResult.Key;
                const tt=await compareFaces(s3ObjectKey)       
      }
     
    }
    
  };
  const FirstTimeUploadImage=async(uri)=>{
    const date = new Date();
    const day = date.getDate();
    const response = await fetch(uri);
    const blob = await response.blob();
    const params = {
      Bucket:Bucket_Name, // replace with your bucket name
      Key: `images/user/${day}.jpg`,
      Body: blob,
      ContentType: 'image/jpeg',
    };
    return s3.upload(params).promise();
  }
  const getUserFace=async()=>{
    console.log("first")
      const token=await AsyncStorage.getItem('Token');
      fetch(`${apiUrl}/SecondPhaseApi/get_user_face_kyc`, {
        method: 'GET',
        headers: {
          'Token': token,
          Accept: 'application/json',
        },
      })
        .then(response => response.json())
        .then(response => {
          console.log(response,'response')
            if(response?.data?.face_kyc==1){
              setFace_kyc_img(response?.data?.face_kyc_img)
            }
            else {
              setIsModalVisible(true)
            }

        })
        .catch(err => {
          setloading(false);
         
          if(err.response.status=='401')
          {
      
              console.log(err.response)
          }
        });

  }


  const uploadTmpimage = async (uri) => {
    const date = new Date();
    const monthIndex = date.getMonth();
    const day = date.getDate();
    const months = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];
    const monthName = months[monthIndex];
    const response = await fetch(uri);
    const blob = await response.blob();

    const params = {
      Bucket:Bucket_Name, // replace with your bucket name
      Key: `tmp/${monthName}/${day}.jpg`,
      Body: blob,
      ContentType: 'image/jpeg',
    };
    return s3.upload(params).promise();
  };
  const compareFaces = async (s3ObjectKey) => {
    setIsModalVisible(false)
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    const params = {
      SourceImage: {
        S3Object: {
          Bucket:Bucket_Name,
          Name:s3ObjectKey  // The image you want to compare with
        },
      },
      TargetImage: {
        S3Object: {
          Bucket:Bucket_Name,
          Name:face_kyc_img, // The uploaded image
        },
      },
      SimilarityThreshold: 90,
    };
  
    rekognition.compareFaces(params, (err, data) => {
      if (err) {
        console.error('Error comparing faces: ', err);
      } else if(data?.UnmatchedFaces.length!=0) {
        setShowCamera(false)
        setFaceNotModal(true)
      }
      else {
        setShowCamera(false)
        setFaceModal(true)
                const userInfo = JSON.parse(userData);

                const config = {
                  headers: {Token: token},
                };
                const body = {
                  email: userInfo.email,
                  location_id: activeLocation.location_id,
                  latitude: currentLocation?.lat,
                  longitude: currentLocation?.long,
                  login_type: 'mobile',
                };

                axios
                  .post(
                    `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                    body,
                    config,
                  )
                  .then(function (response) {
                    if (response.data.status == 1) {
                      check_punchIn();
                    } else {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: response.data.message,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()],
                      });

                      setloading(false);
                    }
                  })
                  .catch(function (error) {
                    setloading(false);

                    if (error.response.status == '401') {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: error.response.data.msg,
                        buttonText: 'Ok',
                        callback: () => [
                          Popup.hide(),
                          AsyncStorage.removeItem('Token'),
                          AsyncStorage.removeItem('UserData'),
                          AsyncStorage.removeItem('UserLocation'),
                          navigation.navigate('Login'),
                        ],
                      });
                    }
                  });


       
      }
    });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      takePicture();
    }, 3000); // Automatically take a picture after 5 seconds

    return () => clearTimeout(timer);
  }, [showCamera]);

  useEffect(()=>{
    if(kYCModal==true){
      setTimeout(()=>{
        setKYCModal(false)
      },8000)
    }
    else if (faceModal==true){
      setTimeout(()=>{
        setFaceModal(false)
      },8000)
    }
    else if(faceNotModal==true){
      setTimeout(()=>{
        setFaceNotModal(false)
      },8000)
    }
  },[kYCModal,faceModal,faceNotModal])
  const [Userdata, setUserdata] = useState({
    image: '',
    name: '',
  });

  const monthNames = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const d = new Date();
  var mon = d.getMonth() + 1 <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;

  var day = d.getDate() <= 9 ? '0' + d.getDate() : d.getDate();

  const datetime = d.getFullYear() + '-' + mon + '-' + day;
  const hours =
    d.getHours() < 10
      ? `0${d.getHours()}`
      : d.getHours() + ':' + d.getMinutes();
  useEffect(() => {
    const getData = async () => {
      AsyncStorage.getItem('UserData').then(res => {
        setuser1(JSON.parse(res));
        setuser(JSON.parse(res));
        setOfficeTiming(JSON.parse(res));
      });
    };
    getData();
  }, []);

  useEffect(() => {
    if (getActiveLocationApi.data != null) {
      let activeLocation = getActiveLocationApi?.data?.data?.map(i => {
        if (i.active_status == 1) {
          setactiveLocation({
            latitude: i.latitude,
            longitude: i.longitude,
            location_id: i.location_id,
          });
        }
      });
    }
  }, [getActiveLocationApi.loading]);

  useFocusEffect(
    React.useCallback(() => {
      getActiveLocation();
      check_punchIn();
      ProfileDetails();
      get_month_logs();
      if(menu_access=="Face Recognition")
      {
        getUserFace()
      }
   
    }, [menu_access]),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    getActiveLocation();
    check_punchIn();
    get_month_logs();
    ProfileDetails();
  };

  const getActiveLocation = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    const body = {};
    getActiveLocationApi.request(body, config);
  };

  const options = [
    {
      id: 0,
      name: 'Post',
      location: require('../../images/like2.jpeg'),
      moveTo: 'Post',
    },
    {
      id: 1,
      name: 'Attendance',
      location: require('../../images/attendence.jpeg'),
      moveTo: 'Select Attendance',
    },
    {
      id: 2,
      name: 'News',
      location: require('../../images/news.png'),
      moveTo: 'News',
    },
    {
      id: 3,
      name: 'Policies',
      location: require('../../images/policies.jpeg'),
      moveTo: 'Policies',
    },
    {
      id: 4,
      name: 'Services',
      location: require('../../images/services.png'),
      moveTo: 'Services',
    },
    {
      id: 5,
      name: 'Support',
      location: require('../../images/support.jpeg'),
      moveTo: 'Support',
    },
    {
      id: 7,
      name: 'Notifications',
      location: require('../../images/notifications.webp'),
      moveTo: 'Notifications',
    },
    {
      id: 8,
      name: 'Account',
      location: require('../../images/account.jpeg'),
      moveTo: 'Profile',
    },
  ];

  useEffect(() => {
    let interval = null;

    if (timerOn == true && inTime != null) {
      // console.log('timer is on************');
      interval = setInterval(() => {
        var timeEnd1 = parseInt(new Date().getTime());
        const startDate = moment(inTime);
        const timeEnd = moment(timeEnd1);
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);
        var days = diffDuration.days();
        var hours = diffDuration.hours();
        var minutes = diffDuration.minutes();
        var seconds = diffDuration.seconds();
        var time =
          (hours < 10 ? '0' + hours : hours) +
          ':' +
          (minutes < 10 ? '0' + minutes : minutes) +
          ':' +
          (seconds < 10 ? '0' + seconds : seconds);
        setactivityTime(time);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timerOn]);

  const check_punchIn = async () => {
    // setloading(true)
    get_month_logs();
    setModalVisible(true);
    settimerOn(false);
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    const UserLocation = await AsyncStorage.getItem('UserLocation');
    setuser(JSON.parse(userData));
    // setlocation(JSON.parse(UserLocation));
    const config = {
      headers: {Token: token},
    };

    const body = {};
    axios
      .post(`${apiUrl}/api/today_attendance`, body, config)
      .then(function (response) {
        if (response.data.status == 1) {
          const data = response.data.data;
          if (data.in_time != '' && data.out_location_id == null) {
            setpunchIn(true);
            setinTime(data.in_time);
            setlocationOut(data.out_location_id);
            settimerOn(true);
            setloading(false);
            setModalVisible(false);
          } else {
            if (data.in_time != '' && data.out_location_id != '') {
              // after punch out
              setloading(false);
              setpunchIn(false);
              setModalVisible(false);

              setinTime(data.in_time);
              setlocationOut(data.out_location_id);
              settimerOn(false);
              var timeEnd1 = moment(data.out_time);
              const startDate = moment(data.in_time);
              const timeEnd = moment(timeEnd1);
              const diff = timeEnd.diff(startDate);
              const diffDuration = moment.duration(diff);
              var days = diffDuration.days();
              var hours = diffDuration.hours();
              var minutes = diffDuration.minutes();
              var seconds = diffDuration.seconds();
              var time =
                (hours < 10 ? '0' + hours : hours) +
                ':' +
                (minutes < 10 ? '0' + minutes : minutes) +
                ':' +
                (seconds < 10 ? '0' + seconds : seconds);
              setfullTime(time);
            }
          }
        } else {
          setloading(false);
          setinTime(null);
          setModalVisible(false);
          setlocationOut(null);
          setactivityTime(null);
          setloading(false);
        }
      })
      .catch(function (error) {
        setloading(false);

        if (error.response.status == '401') {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [
              Popup.hide(),
              AsyncStorage.removeItem('Token'),
              AsyncStorage.removeItem('UserData'),
              AsyncStorage.removeItem('UserLocation'),
              navigation.navigate('Login'),
            ],
          });

          setModalVisible(false);
        }
      });
  };

  const showAlert = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to punch out?',
      [
        {
          text: 'Cancel',
          // onPress: handleCancelButtonPress,
          style: 'cancel',
        },
        {text: 'OK', onPress: () => punch_out()},
      ],
      {cancelable: false},
    );
  };

  const punch_out = async () => {
    setloading(true);
    get_month_logs();
    const userData = await AsyncStorage.getItem('UserData');
    const userInfo = JSON.parse(userData);
    let company_id = userInfo?.company_id;
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(async location => {
        var lat = parseFloat(location.latitude);
        var long = parseFloat(location.longitude);
        // console.log('loc-->', lat, long);
        setcurrentLocation({
          long: long,
          lat: lat,
        });

        var dis = getDistance(
          {latitude: lat, longitude: long},
          {
            latitude: activeLocation.latitude,
            longitude: activeLocation.longitude,
          },
        );

        if (company_id == 56 || company_id == 89 || company_id == 92) {
          const token = await AsyncStorage.getItem('Token');
          const config = {
            headers: {Token: token},
          };
          const body = {
            user_id: user.userid,
            employee_number: user.employee_number,
            email: user.email,
            location_id: activeLocation.location_id,
            latitude: lat,
            longitude: long,
          };
         
          axios
            .post(`${apiUrl}/secondPhaseApi/mark_attendance_out`, body, config)
            .then(function (response) {
              if (response.data.status == 1) {
                check_punchIn();
              } else {
                setloading(false);
              }
            })
            .catch(function (error) {
              if (error.response.status == '401') {
                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody: error.response.data.msg,
                  buttonText: 'Ok',
                  callback: () => [
                    Popup.hide(),
                    AsyncStorage.removeItem('Token'),
                    AsyncStorage.removeItem('UserData'),
                    AsyncStorage.removeItem('UserLocation'),
                    navigation.navigate('Login'),
                  ],
                });
              }
            });
        } else {
          //console.log('dis=-----',dis);
          if (lat == null || lat == '') {
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'Location not find',
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });

            setloading(false);
            return;
          } else if (long == null || long == '') {
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'Location not find',
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });
            setloading(false);
            return;
          } else if (
            activeLocation.latitude == null ||
            activeLocation.latitude == ''
          ) {
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'Please set active location',
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });

            setloading(false);
            return;
          } else if (
            activeLocation.longitude == null ||
            activeLocation.longitude == ''
          ) {
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'Please set active location',
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });
            setloading(false);
            return;
          }
          if (dis <= 4000) {
            const token = await AsyncStorage.getItem('Token');
            const config = {
              headers: {Token: token},
            };
            // const body = {
            //   user_id: user.userid,
            //   employee_number: user.employee_number,
            //   email: user.email,
            //   location_id: activeLocation.location_id,
            //   latitude: lat,
            //   longitude: long,
            // };
            // axios
            //   .post(
            //     `${apiUrl}/secondPhaseApi/mark_attendance_out`,
            //     body,
            //     config,
            //   )
            //   .then(function (response) {
            //     if (response.data.status == 1) {
            //       check_punchIn();
            //     } else {
            //       setloading(false);
            //     }
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //     if (error.response.status == '401') {
            //       Popup.show({
            //         type: 'Warning',
            //         title: 'Warning',
            //         button: true,
            //         textBody: error.response.data.msg,
            //         buttonText: 'Ok',
            //         callback: () => [
            //           Popup.hide(),
            //           AsyncStorage.removeItem('Token'),
            //           AsyncStorage.removeItem('UserData'),
            //           AsyncStorage.removeItem('UserLocation'),
            //           navigation.navigate('Login'),
            //         ],
            //       });
            //     }
            //   });
          } else {
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'You are not in the radius',
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });

            setloading(false);
          }
        }
      })
      .catch(error => {
        setloading(false);
        const {code, message} = error;
        Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: message,
          buttonText: 'Ok',
          callback: () => [Popup.hide()],
        });
      });
  };
  const punch_in = async () => {
    setloading(true);

    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          GetLocation.getCurrentPosition({});
          const userData = await AsyncStorage.getItem('UserData');
          const userInfo = JSON.parse(userData);
          let company_id = userInfo?.company_id;

          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(async location => {
              setloading(false);
              var lat = parseFloat(location.latitude);
              var long = parseFloat(location.longitude);
              sendLocation({
                userId: userInfo?.userid,
                location: {
                  longitude: long,
                  latitude: lat,
                },
              });
              setcurrentLocation({
                long: long,
                lat: lat,
              });

              var dis = getDistance(
                {latitude: lat, longitude: long},
                {
                  latitude: activeLocation.latitude,
                  longitude: activeLocation.longitude,
                },
              );

              if (company_id == 56 || company_id == 89 || company_id == 92) {
                const token = await AsyncStorage.getItem('Token');
                const userData = await AsyncStorage.getItem('UserData');
                const userInfo = JSON.parse(userData);

                const config = {
                  headers: {Token: token},
                };
                const body = {
                  email: userInfo.email,
                  location_id: activeLocation.location_id,
                  latitude: lat,
                  longitude: long,
                  login_type: 'mobile',
                };

                axios
                  .post(
                    `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                    body,
                    config,
                  )
                  .then(function (response) {
                    if (response.data.status == 1) {
                      check_punchIn();
                      setloading(false);
                    } else {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: response.data.message,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()],
                      });

                      setloading(false);
                    }
                  })
                  .catch(function (error) {
                    setloading(false);
                    if (error.response.status == '401') {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: error.response.data.msg,
                        buttonText: 'Ok',
                        callback: () => [
                          Popup.hide(),
                          AsyncStorage.removeItem('Token'),
                          AsyncStorage.removeItem('UserData'),
                          AsyncStorage.removeItem('UserLocation'),
                          navigation.navigate('Login'),
                        ],
                      });
                    }
                  });
              } else {

                if (lat == null || lat == '') {
                  Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: 'Location not find',
                    buttonText: 'Ok',
                    callback: () => [Popup.hide()],
                  });

                  setloading(false);
                  return;
                } else if (long == null || long == '') {
                  Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: 'Location not find',
                    buttonText: 'Ok',
                    callback: () => [Popup.hide()],
                  });
                  setloading(false);
                  return;
                } else if (
                  activeLocation.latitude == null ||
                  activeLocation.latitude == ''
                ) {
                  Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: 'Please set active location',
                    buttonText: 'Ok',
                    callback: () => [Popup.hide()],
                  });
                  setloading(false);
                  return;
                } else if (
                  activeLocation.longitude == null ||
                  activeLocation.longitude == ''
                ) {
                  Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: 'Please set active location',
                    buttonText: 'Ok',
                    callback: () => [Popup.hide()],
                  });
                  setloading(false);
                  return;
                }

                if (dis <= 4000) {
                        if(menu_access=='Face Recognition'){
                          setShowCamera(true)
                        }
                        else {
                          const token = await AsyncStorage.getItem('Token');
                          const userData = await AsyncStorage.getItem('UserData');
                          const userInfo = JSON.parse(userData);
        
                          const config = {
                            headers: {Token: token},
                          };
                          const body = {
                            email: userInfo.email,
                            location_id: activeLocation.location_id,
                            latitude: lat,
                            longitude: long,
                            login_type: 'mobile',
                          };
                       
                          axios
                            .post(
                              `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                              body,
                              config,
                            )
                            .then(function (response) {
                              if (response.data.status == 1) {
                                check_punchIn();
                                setloading(false);
                              } else {
                                Popup.show({
                                  type: 'Warning',
                                  title: 'Warning',
                                  button: true,
                                  textBody: response.data.message,
                                  buttonText: 'Ok',
                                  callback: () => [Popup.hide()],
                                });
        
                                setloading(false);
                              }
                            })
                            .catch(function (error) {
                              setloading(false);
        
                              if (error.response.status == '401') {
                                Popup.show({
                                  type: 'Warning',
                                  title: 'Warning',
                                  button: true,
                                  textBody: error.response.data.msg,
                                  buttonText: 'Ok',
                                  callback: () => [
                                    Popup.hide(),
                                    AsyncStorage.removeItem('Token'),
                                    AsyncStorage.removeItem('UserData'),
                                    AsyncStorage.removeItem('UserLocation'),
                                    navigation.navigate('Login'),
                                  ],
                                });
                              }
                            });

                        }
               
                 
                } else {
                  Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: 'You are not in the radius',
                    buttonText: 'Ok',
                    callback: () => [Popup.hide()],
                  });

                  setloading(false);
                }
              }
            })
            .catch(error => {
              const {code, message} = error;

              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: message,
                buttonText: 'Ok',
                callback: () => [Popup.hide()],
              });
              setloading(false);
            });
        } else {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: 'Location permission denied',
            buttonText: 'Ok',
            callback: () => [Popup.hide()],
          });

          setloading(false);
        }
      } catch (err) {
        setloading(false);
        console.warn(err);
      }
    } else {
      try {
        GetLocation.getCurrentPosition({});
        const userData = await AsyncStorage.getItem('UserData');
        const userInfo = JSON.parse(userData);
        let company_id = userInfo?.company_id;

        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(async location => {
            setloading(false);
            var lat = parseFloat(location.latitude);
            var long = parseFloat(location.longitude);
            sendLocation({
              userId: userInfo?.userid,
              location: {
                longitude: long,
                latitude: lat,
              },
            });
            setcurrentLocation({
              long: long,
              lat: lat,
            });

            var dis = getDistance(
              {latitude: lat, longitude: long},
              {
                latitude: activeLocation.latitude,
                longitude: activeLocation.longitude,
              },
            );

            if (company_id == 56 || company_id == 89 || company_id == 92) {
              const token = await AsyncStorage.getItem('Token');
              const userData = await AsyncStorage.getItem('UserData');
              const userInfo = JSON.parse(userData);

              const config = {
                headers: {Token: token},
              };
              const body = {
                email: userInfo.email,
                location_id: activeLocation.location_id,
                latitude: lat,
                longitude: long,
                login_type: 'mobile',
              };

              axios
                .post(
                  `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                  body,
                  config,
                )
                .then(function (response) {
                  if (response.data.status == 1) {
                    check_punchIn();
                  } else {
                    Popup.show({
                      type: 'Warning',
                      title: 'Warning',
                      button: true,
                      textBody: response.data.message,
                      buttonText: 'Ok',
                      callback: () => [Popup.hide()],
                    });

                    setloading(false);
                  }
                })
                .catch(function (error) {
                  setloading(false);

                  if (error.response.status == '401') {
                    Popup.show({
                      type: 'Warning',
                      title: 'Warning',
                      button: true,
                      textBody: error.response.data.msg,
                      buttonText: 'Ok',
                      callback: () => [
                        Popup.hide(),
                        AsyncStorage.removeItem('Token'),
                        AsyncStorage.removeItem('UserData'),
                        AsyncStorage.removeItem('UserLocation'),
                        navigation.navigate('Login'),
                      ],
                    });
                  }
                });
            } else {
              if (lat == null || lat == '') {
                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody: 'Location not find',
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()],
                });

                setloading(false);
                return;
              } else if (long == null || long == '') {
                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody: 'Location not find',
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()],
                });
                setloading(false);
                return;
              } else if (
                activeLocation.latitude == null ||
                activeLocation.latitude == ''
              ) {
                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody: 'Please set active location',
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()],
                });

                setloading(false);
                return;
              } else if (
                activeLocation.longitude == null ||
                activeLocation.longitude == ''
              ) {
                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody: 'Please set active location',
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()],
                });
                setloading(false);
                return;
              }

              if (dis <= 4000) {
                            if(menu_access=='Face Recognition')
                            {
                         setShowCamera(true)

                            }
                            else {
                              const token = await AsyncStorage.getItem('Token');
                              const userData = await AsyncStorage.getItem('UserData');
                              const userInfo = JSON.parse(userData);
                              const config = {
                                headers: {Token: token},
                              };
                              const body = {
                                email: userInfo.email,
                                location_id: activeLocation.location_id,
                                latitude:lat,
                                longitude:long,
                                login_type: 'mobile',
                              };
              
                              axios
                                .post(
                                  `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                  body,
                                  config,
                                )
                                .then(function (response) {
                                  if (response.data.status == 1) {
                                    check_punchIn();
                                  } else {
                                    Popup.show({
                                      type: 'Warning',
                                      title: 'Warning',
                                      button: true,
                                      textBody: response.data.message,
                                      buttonText: 'Ok',
                                      callback: () => [Popup.hide()],
                                    });
              
                                    setloading(false);
                                  }
                                })
                                .catch(function (error) {
                                  setloading(false);
              
                                  if (error.response.status == '401') {
                                    Popup.show({
                                      type: 'Warning',
                                      title: 'Warning',
                                      button: true,
                                      textBody: error.response.data.msg,
                                      buttonText: 'Ok',
                                      callback: () => [
                                        Popup.hide(),
                                        AsyncStorage.removeItem('Token'),
                                        AsyncStorage.removeItem('UserData'),
                                        AsyncStorage.removeItem('UserLocation'),
                                        navigation.navigate('Login'),
                                      ],
                                    });
                                  }
                                });
              
                            }

              } else {
                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody: 'You are not in the radius',
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()],
                });

                setloading(false);
              }
            }
          })
          .catch(error => {
            const {code, message} = error;
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: message,
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });

            setloading(false);
          });
      } catch (err) {
        setloading(false);
        console.warn(err);
      }
    }
  };

  const sendLocationUpdate = (position, userId = 1) => {
    const locationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

   

    sendLocation({userId, location: locationData});
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;

    return R * 2 * Math.asin(Math.sqrt(a));
  };

  //  This is used send location socketContext page Starting ..................................

  const [currentPosition, setCurrentPosition] = useState(null);
  const [previousPosition, setPreviousPosition] = useState(null);
  const distanceThreshold = 0.001;

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        // Save current position as previous position before updating
        if (previousPosition) {
          const distance = calculateDistance(
            previousPosition.coords.latitude,
            previousPosition.coords.longitude,
            position.coords.latitude,
            position.coords.longitude,
          );

          if (distance >= distanceThreshold) {
            sendLocationUpdate(position);
            setPreviousPosition(currentPosition);
          }
        } else {
          sendLocationUpdate(position);
          setPreviousPosition(currentPosition);
        }
        setCurrentPosition(position);
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 1, interval: 5000},
    );

    // Clean up the watchPosition when the component unmounts
    return () => Geolocation.clearWatch(watchId);
  }, [currentPosition]);

  //  This is used send location socketContext page Ending ..................................

  const renderItem = ({item}) =>
    // console.log("A.......", item)
    // let x = item?.id;
    // console.log(x);

    item?.id === 0 ||
    item?.id === 8 || (
      <TouchableOpacity
        onPress={() =>
          item.id == 0
            ? navigation.navigate('Post', {screen: 'Post'})
            : navigation.navigate(item.moveTo)
        }>
        <ImageBackground
          style={styles.options1}
          source={item?.location}
          imageStyle={{borderRadius: 5}}>
          <LinearGradient
            colors={['#00000000', '#000000']}
            style={{
              height: 160,
              width: 130,
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: 'white',
                position: 'absolute',
                bottom: 5,
                fontSize: 17,
                fontWeight: '600',
                alignSelf: 'center',
              }}>
              {item?.name}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );

  const ProfileDetails = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    axios
      .post(`${apiUrl}/api/get_employee_detail`, {}, config)
      .then(response => {
        if (response.data.status === 1) {
          try {
            setUserdata({
              name: response.data.data.FULL_NAME,
              image: response.data.data.image,
            });
            // get_employee_detail();
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {
        if (error.response.status == '401') {
          console.log('first');
        }
      });
  };

  const getAtendenceApi = useApi(attendence.getAttendance);

  const [locationStatus, setLocationStatus] = useState('');
  const [location, setlocation] = useState();
  const [recentLogs, setrecentLogs] = useState([]);

  useEffect(() => {
    if (punchInApi.data != null) {
      // console.log('punchInApi.data--->', punchInApi.data);
      check_punchIn();
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: punchInApi.data.message,
        buttonText: 'Ok',
        callback: () => [Popup.hide()],
      });
    }
  }, [punchInApi.loading]);

  useEffect(() => {
    if (punchOutApi.data != null) {
      // console.log('punchOutApi.data--->', punchOutApi.data);
      check_punchIn();
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: punchOutApi.data.message,
        buttonText: 'Ok',
        callback: () => [Popup.hide()],
      });
    }
  }, [punchOutApi.loading]);

  useEffect(() => {
    let interval = null;

    if (timerOn == true && inTime != null) {
      // console.log('timer is on************');
      interval = setInterval(() => {
        var timeEnd1 = parseInt(new Date().getTime());
        const startDate = moment(inTime);
        const timeEnd = moment(timeEnd1);
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);
        var days = diffDuration.days();
        var hours = diffDuration.hours();
        var minutes = diffDuration.minutes();
        var seconds = diffDuration.seconds();
        var time =
          (hours < 10 ? '0' + hours : hours) +
          ':' +
          (minutes < 10 ? '0' + minutes : minutes) +
          ':' +
          (seconds < 10 ? '0' + seconds : seconds);
        setactivityTime(time);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timerOn]);

  useEffect(() => {
    setTimeout(function () {
      if (todayAtendenceApi.data != null) {
        if (todayAtendenceApi.data.status == 1) {
          const data = todayAtendenceApi.data.data;
          if (data.in_time != '' && data.out_location_id == null) {
            ///after punch in
            setpunchIn(true);
            setinTime(data.in_time);
            settimerOn(true);
            // console.log('today attendence');
            setloading(false);
            // setInterval(() => {
            //   var timeEnd1 = parseInt(new Date().getTime());
            //   const startDate = moment(data.in_time);
            //   const timeEnd = moment(timeEnd1);
            //   const diff = timeEnd.diff(startDate);
            //   const diffDuration = moment.duration(diff);
            //   var days = diffDuration.days();
            //   var hours = diffDuration.hours();
            //   var minutes = diffDuration.minutes();
            //   var seconds = diffDuration.seconds();
            //   var time =
            //     (hours < 10 ? '0' + hours : hours) +
            //     ':' +
            //     (minutes < 10 ? '0' + minutes : minutes) +
            //     ':' +
            //     (seconds < 10 ? '0' + seconds : seconds);
            //   setactivityTime(time);
            // }, 1000);
          } else {
            if (data.in_time != '' && data.out_location_id != '') {
              // after punch out
              setinTime(data.in_time);
              setloading(false);
              setpunchIn(false);
              settimerOn(false);
              var timeEnd1 = moment(data.out_time);
              const startDate = moment(data.in_time);
              const timeEnd = moment(timeEnd1);
              const diff = timeEnd.diff(startDate);
              const diffDuration = moment.duration(diff);
              var days = diffDuration.days();
              var hours = diffDuration.hours();
              var minutes = diffDuration.minutes();
              var seconds = diffDuration.seconds();
              var time =
                (hours < 10 ? '0' + hours : hours) +
                ':' +
                (minutes < 10 ? '0' + minutes : minutes) +
                ':' +
                (seconds < 10 ? '0' + seconds : seconds);
              setfullTime(time);
            }
          }
        } else {
          setloading(false);
          setpunchIn(false);
          setinTime(null);
        }
      }
    }, 1000);
  }, [todayAtendenceApi.loading]);

  useEffect(() => {
    setTimeout(function () {
      if (getActiveLocationApi.data != null) {
        // console.log('getActiveLocationApi.data--->', getActiveLocationApi.data);
        let activeLocation = getActiveLocationApi?.data?.data?.map(i => {
          if (i.active_status == 1) {
            setactiveLocation({
              latitude: i.latitude,
              longitude: i.longitude,
              address: i.address1,
              location_id: i.location_id,
            });
          }
        });
      }
    }, 1500);
  }, [getActiveLocationApi.loading]);

  const get_month_logs = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    var startOfWeek = moment().startOf('month').toDate();
    var endOfWeek = moment().endOf('month').toDate();
   
    const body = {
      start_date: startOfWeek,
      end_date: endOfWeek,
    };
   
    axios
      .post(`${apiUrl}/Api/attendance`, body, config)
      .then(response => {
        // console.log('response', response.data);
        if (response.data.status == 1) {
          try {
          
            setrecentLogs(response.data.content);
          } catch (e) {}
        } else {
        }
      })
      .catch(error => {
        setloading(false);
        if (error.response.status == '401') {
        }
      });
  };


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#e3eefb'}}>
     {
      showCamera?
<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
   <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          onFacesDetected={handleFacesDetected}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
          faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
          faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
          captureAudio={false}
        />
              {faces.length > 0 && (
          <View style={styles.facesContainer}>
            {faces.map(face => (
              // <View key={face.faceID} style={[styles.faceBox,{borderColor:done==true?'#008000':'red'}]}>
               
              
              // </View>
              <AnimatedCircularProgress
  size={230}
  width={10}
  fill={100}
  tintColor="#0043ae"
  backgroundColor="#0043ae"
  duration={5000}
  padding={10}
  renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="#fff" delayPressOut={2} />}
  />
            ))}
          </View>
        )}
  

  </View>

      :
      <Root>
      <PullToRefresh onRefresh={handleRefresh}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
              }}>
              <Image
                style={styles.tinyLogo}
                // source={require('../../images/profile_pic.webp')}
                source={
                  Userdata?.image
                    ? {uri: Userdata.image}
                    : require('../../images/profile_pic.webp')
                }
              />
              <Text
                numberOfLines={1}
                style={[
                  {fontSize: 18, fontWeight: 'bold', marginLeft: 2},
                  {color: Themes == 'dark' ? '#000' : '#000'},
                ]}>
                Hi,{user?.FULL_NAME}!
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={{}}>
              <Ionicons
                name="notifications-outline"
                style={{
                  fontSize: 35,
                  color: '#000',
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{}}>
            <FlatList
              horizontal
              data={options}
              renderItem={renderItem}
              keyExtractor={item => item?.id}
            />
          </View>
          <View style={{padding: 15, marginTop: 5}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  {fontSize: 18, fontWeight: '700'},
                  {color: Themes == 'dark' ? '#000' : '#000'},
                ]}>
                E-Attendance
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Select Attendance')}>
                <Text
                  style={[
                    styles.purple_txt,
                    {color: Themes == 'dark' ? '#000' : '#000'},
                  ]}>
                  View History
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 15, borderRadius: 15}}>
              <View
              // style={{ width: '100%', borderRadius: 15, overflow: 'hidden', }}
              // source={require('../../images/gradient.gif')}
              // imageStyle={{ borderRadius: 15,  }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    margin: 8,
                    padding: 15,
                    borderRadius: 20,
                    flexDirection: 'row',
                    borderWidth: 12,
                    borderColor: '#172B85',
                  }}>
                  <View
                    style={{
                      width: '35%',
                      // backgroundColor: 'pink',
                      borderRightWidth: 0.5,
                      borderRightColor: 'grey',
                      alignItems: 'center',
                    }}>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          color: 'grey',
                          fontSize: 15,
                          fontWeight: '500',
                        }}>
                        {days[d.getDay()]}
                      </Text>
                      <Text
                        style={[
                          {fontSize: 18, fontWeight: '600'},
                          {color: Themes == 'dark' ? '#818181' : '#818181'},
                        ]}>
                        {d.getDate() + ' ' + monthNames[d.getMonth()]}
                      </Text>
                      <Text
                        style={{
                          color: 'grey',
                          fontSize: 15,
                          fontWeight: '500',
                        }}>
                        {d.getFullYear()}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '65%',
                      alignItems: 'center',
                    }}>
                    {inTime && !locationOut && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <AntDesign
                            name="rightcircle"
                            style={{
                              fontSize: 23,
                              color: '#0e664e',
                              marginRight: 10,
                            }}
                          />
                          <Text
                            style={{
                              color: Themes == 'dark' ? '#000' : '#000',
                            }}>
                            {activityTime}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={showAlert}
                          style={{
                            padding: 10,
                            paddingHorizontal: 20,
                            backgroundColor: '#0043ae',
                            marginTop: 10,
                            borderRadius: 5,
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '600',
                              color: 'white',
                              marginRight: 10,
                            }}>
                            Punch Out
                          </Text>
                          {loading ? (
                            <ActivityIndicator color="white" />
                          ) : null}
                        </TouchableOpacity>
                      </>
                    )}

                    {!inTime && !locationOut && (
                      <TouchableOpacity
                        onPress={() =>punch_in()}
                        style={{
                          padding: 10,
                          paddingHorizontal: 20,
                          backgroundColor: '#0043ae',
                          marginTop: 10,
                          borderRadius: 5,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white',
                            marginRight: 10,
                          }}>
                          Punch In
                        </Text>
                        {loading ? <ActivityIndicator color="white" /> : null}
                      </TouchableOpacity>
                    )}
                    {inTime && locationOut && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <AntDesign
                            name="rightcircle"
                            style={{
                              fontSize: 23,
                              color: '#0e664e',
                              marginRight: 10,
                            }}
                          />
                          <Text style={styles.purple_txt}>{fullTime}</Text>
                        </View>
                        <Text style={{color: 'red', marginTop: 10}}>
                          Total Time Elapsed
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{marginTop: 10, marginHorizontal: 10}}>
            <Text
              style={[
                {fontSize: 18, fontWeight: '600'},
                {color: Themes == 'dark' ? '#000' : '#000'},
              ]}>
              Recent Logs
            </Text>

            {recentLogs.length > 0 ? (
              recentLogs.map((i, index) => {
                const time = new Date(i?.punch_in_time);
                const getTime = time.toLocaleTimeString();
                // console.log(getTime)
                return (
                  <View key={index} style={styles.recent_log_box}>
                    <View>
                      <Text style={styles.weekDay}>
                        {days[new Date(i.TR_DATE).getDay()]}
                      </Text>
                      <Text
                        style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                        {i.TR_DATE}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.weekDay}>Punch In Time</Text>
                      <Text
                        style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                        {getTime}
                      </Text>
                    </View>

                    <View style={{alignItems: 'center'}}>
                      <AntDesign
                        name="clockcircleo"
                        size={20}
                        style={[
                          {marginBottom: 5},
                          {color: Themes == 'dark' ? '#000' : '#000'},
                        ]}
                      />
                      {/* <Text>{datetime}, {i.TR_DATE}, {i.location_id ? 'yes' : 'no'}, {i.PRESENT_HOURS}, {hours}, {hours >= '19:00' ? 'yes' : 'no'}</Text> */}
                      {(datetime == i.TR_DATE && i.location_id) ||
                      datetime > i.TR_DATE ? (
                        <Text
                          style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                          {i.PRESENT_HOURS}
                        </Text>
                      ) : hours >= '19:00' ? (
                        <Text
                          style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                          {i.PRESENT_HOURS}
                        </Text>
                      ) : (
                        <Text
                          style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                          NA
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  color: Themes == 'dark' ? '#000' : '#000',
                }}>
                No found data
              </Text>
            )}
          </View>

          {/* <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
          {news.length == 0 && loading == false ? (
            <Empty onPress={() => navigation.navigate('home')} />
          ) : loading === false ? (
            <PullToRefresh onRefresh={handleRefresh}>
              <View>
                <Text style={{ fontSize: 13, color: 'grey' }}>
                  {days[d.getDay()] +
                    ', ' +
                    d.getDate() +
                    ' ' +
                    monthNames[d.getMonth()]}
                </Text>
              </View>
              <View style={{ marginTop: 0 }}>
                <Text style={{ fontSize: 22, fontWeight: '600' }}>Latest news</Text>
                <View style={{flexDirection:"row"}}>
                  {news.map((i, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigation.navigate('News Detail', {
                          userId: user.userid,
                          newsId: i.id,
                        })
                      }
                      style={{
                        marginTop: 0,
                      }}>
                      <Text style={{ marginHorizontal:10, marginBottom:5, fontSize: 18, fontWeight: '500', marginTop: 5, color: "blue" }}>
                        {i.title}
                      </Text>
                      <Image
                        style={styles.tinynews}
                        // source={require('../../../images/meta.jpeg')}
                        source={
                          i.attacnment
                            ? { uri: i.attacnment }
                            : require('../../images/meta.jpeg')
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
            </PullToRefresh>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#388aeb" />
            </View>
          )}
        </View> */}

          {/* <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // marginTop: 15,
              padding: 15,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Announcements
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('List')}>
              <Text style={styles.purple_txt}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={announcements}
            renderItem={renderAnnouncements}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={{ marginBottom: 30 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // marginTop: 15,
              padding: 15,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>Training</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Training', { screen: 'training' })
              }>
              <Text style={styles.purple_txt}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={training}
            renderItem={renderTraining}
            keyExtractor={item => item.create_date}
          />
        </View> */}
        </View>
      </PullToRefresh>
      {modalVisible && (
        <View
          style={{
            width: '100%',
            height: '100%',
            zIndex: 99,
            backgroundColor:'rgba(255,255,255,0.8)',
            position: 'absolute',
            flex: 1,
          }}></View>
      )}
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 10,
            alignSelf: 'center',
            marginTop: responsiveHeight(50),
          }}>
          <ActivityIndicator size="large" color="#0528A5" />
        </View>
      </Modal>

      {/* <Button title="Show Modal" onPress={toggleModal} /> */}
      <Modal
        isVisible={isModalVisible}
        // onBackdropPress={toggleModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.modalContent}>
          <Image
          source={require('../../images/kycicon.png')}
          style={{width:responsiveWidth(90),height:responsiveHeight(28),resizeMode:'contain',alignSelf:'center'}}
          />
          <Text style={{color:'#000',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>Please complete your
           KYC.</Text>
           <TouchableOpacity style={{width:responsiveWidth(30),height:responsiveHeight(5),backgroundColor:'#0043ae',borderRadius:10,justifyContent:'center',alignItems:'center',marginTop:responsiveHeight(1)}}
           onPress={()=>[setShowCamera(true),setFirstImage(true)]}
           >
            <Text style={{color:'#fff',fontWeight:'bold',fontSize:responsiveFontSize(1.7)}}>Camera</Text>
           </TouchableOpacity>
          {/* <Button title="Camera Scaner" onPress={()=>[setShowCamera(true),setFirstImage(true)]}  /> */}

          {/* <Button title="Hide Modal" onPress={toggleModal} /> */}

           
        </View>
      </Modal>
      <Modal
        isVisible={kYCModal}
        // onBackdropPress={toggleModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.modalContent}>
          <Image
          source={require('../../images/kycsuccess.png')}
          style={{width:responsiveWidth(90),height:responsiveHeight(20),resizeMode:'contain',alignSelf:'center'}}
          />
          <Text style={{color:'#000',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>Your KYC has been</Text>
          <Text style={{color:'#000',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>successfully completed.</Text>
          <Text style={{color:'#0043ae',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>Thank you!</Text>

           {/* <TouchableOpacity style={{width:responsiveWidth(30),height:responsiveHeight(5),backgroundColor:'#0043ae',borderRadius:10,justifyContent:'center',alignItems:'center',marginTop:responsiveHeight(1)}}
           onPress={()=>setKYCModal(false)}
           >
            <Text style={{color:'#fff',fontWeight:'bold',fontSize:responsiveFontSize(1.7)}}>Hide</Text>
           </TouchableOpacity> */}
        </View>
      </Modal>
      <Modal
        isVisible={faceModal}
        // onBackdropPress={toggleModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.modalContent}>
          <Image
          source={require('../../images/kycsuccess.png')}
          style={{width:responsiveWidth(90),height:responsiveHeight(20),resizeMode:'contain',alignSelf:'center'}}
          />
          <Text style={{color:'#000',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>Face match detected!</Text>
          <Text style={{color:'#0043ae',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>Thank you!</Text>
        </View>
      </Modal>
      <Modal
        isVisible={faceNotModal}
        // onBackdropPress={toggleModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.modalContent}>
          <Image
          source={require('../../images/11.png')}
          style={{width:responsiveWidth(90),height:responsiveHeight(20),resizeMode:'contain',alignSelf:'center'}}
          />
          <Text style={{color:'#000',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>Face does not match!</Text>
          <Text style={{color:'#0043ae',fontSize:responsiveFontSize(2),fontWeight:'bold',marginTop:responsiveHeight(1)}}>Please try again.</Text>

        </View>
      </Modal>

    </Root>
     }
    </SafeAreaView>
);

};

export default Home;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 60,
    height: 60,
    borderRadius: 100,
    // marginRight: 20,
    borderWidth: 1,
    borderColor: 'white',
    // backgroundColor: 'pink',
  },
  tinynews: {
    width: 180,
    height: 100,
    borderRadius: 10,
    resizeMode: 'contain',
    // marginRight: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 5,
    // backgroundColor: 'pink',
  },
  options: {
    width: 130,
    height: 160,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'cover',
  },
  options1: {
    width: 130,
    height: 160,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'cover',
    marginHorizontal: 2,
    borderRadius: 10,
  },
  tinyLogo: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  profileFont: {
    color: 'white',
  },
  options: {
    width: 65,
    height: 65,
  },
  loader: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skill: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dashed',
    borderRadius: 5,
    backgroundColor: '#d3e3fd30',
    borderColor: '#0c57d0',
  },
  heading: {fontWeight: '700', fontSize: 16},
  heading_grey: {fontSize: 14, color: 'grey', fontWeight: '300'},
  add_txt: {fontSize: 14, color: '#efad37', fontWeight: '600'},
  view_txt: {color: '#702963', fontWeight: 'bold'},
  weekDay: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 5,
    color: Themes == 'dark' ? '#000' : '#000',
  },
  recent_log_box: {
    width: responsiveWidth(96),
    marginTop: 15,
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: GlobalStyle.blueDark,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    color: Themes == 'dark' ? '#000' : '#000',
  },
  emptyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '600',
    color: Themes == 'dark' ? '#000' : '#000',
  },
  display_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
    color: Themes == 'dark' ? '#000' : '#000',
  },
  btn_style: {
    marginTop: 30,
    backgroundColor: GlobalStyle.blueDark,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  capturedImage: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },

  facesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // width:200
  },
  faceBox: {
    padding: 10,
    borderWidth: 2,
    borderRadius:150,
    width:300,
    height:300
   
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

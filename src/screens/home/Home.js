import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Alert,
  useColorScheme,
  Platform,
  StatusBar,
  Button, TextInput
} from 'react-native';
import React, {
  useState,
  useContext,
  useEffect, createContext, useRef
} from 'react';
import { Root, Popup } from 'popup-ui';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackgroundService from 'react-native-background-actions';
import GlobalStyle from '../../reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import { EssContext } from '../../../Context/EssContext';
import { PermissionsAndroid } from 'react-native';
import useApi from '../../../api/useApi';
import attendence from '../../../api/attendence';
import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import useApi2 from '../../../api/useApi2';
import PullToRefresh from '../../reusable/PullToRefresh';
import io from 'socket.io-client';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
export const LiveTrackingContext = createContext();
const { width } = Dimensions.get('window');
// import messaging from '@react-native-firebas e/messaging';
import Empty from '../../reusable/Empty';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import Themes from '../../Theme/Theme';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NotificationController from '../PushNotification/NotificationController';
import { SocketContext } from '../../tracking/SocketContext';
import HomeSkeleton from '../Skeleton/HomeSkeleton';
import { checkIfConfigIsValid } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';
import Modal from "react-native-modal";
import AWS, { Rekognition, S3, } from 'aws-sdk';
import { RNCamera } from 'react-native-camera';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { useRoute } from '@react-navigation/native';
import * as Progress from 'react-native-progress'; // Import Progress from react-native-progress
import { accessKeyId, secretAccessKey, region } from "@env"
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have react-native-vector-icons installed
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";




const Home = ({ navigation }) => {
  const theme = useColorScheme();
  const route = useRoute();
  const kycmodalback = route?.params?.success
  const [modalVisible, setModalVisible] = useState(false);
  const [faceModal, setFaceModal] = useState(false)
  const [faceNotModal, setFaceNotModal] = useState(false)
  const [faceLoader, setFaceLoader] = useState(false)
  const [detecting, setDetecting] = useState(false);
  const [kYCModal, setKYCModal] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(false);
  const punchInApi = useApi2(attendence.punchIn);
  const punchOutApi = useApi2(attendence.punchOut);
  const todayAtendenceApi = useApi2(attendence.todayAttendence);
  const getActiveLocationApi = useApi2(attendence.getActiveLocation);
  const { setuser } = useContext(EssContext);
  const [user, setuser1] = useState(null);
  const [inTime, setinTime] = useState(null);
  const [homeskelton, setHomeSkeleton] = useState(null)
  const [punchIn, setpunchIn] = useState(false);
  const [loading, setloading] = useState(false);
  const [firsttimepasswordloader, setFirstTimePasswordLoader] = useState(false);
  const [fullTime, setfullTime] = useState(null);
  const [officetiming, setOfficeTiming] = useState('');
  const { activeinactivetracking, updatedlivetrackingaccess, livetrackingaccess, getList, locationblock, ManuAccessdetails_Socket, setStartBackgroundTracking, radius, updatedfacereconization, employeeNumber } = useContext(SocketContext);
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
  const [location, setLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [timerOn, settimerOn] = useState(false);
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

  // console.log("livetrackingaccess......", livetrackingaccess?.length)

  const d = new Date();
  var mon = d.getMonth() + 1 <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;

  var day = d.getDate() <= 9 ? '0' + d.getDate() : d.getDate();

  const datetime = d.getFullYear() + '-' + mon + '-' + day;
  const hours =
    d.getHours() < 10
      ? `0${d.getHours()}`
      : d.getHours() + ':' + d.getMinutes();

  const [menuAccessData1, setMenuAccessData] = useState();
  const [punchin_radius, setPunchin_radius] = useState();

  const ManuAccessdetails = async () => {
    const token = await AsyncStorage.getItem('Token');

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://app.hrjee.com/SecondPhaseApi/employee_config_details',
      headers: {
        Token: token,
        Cookie: 'ci_session=fu0slk2fsljjjsm9s7m28i9pugh0f2ik',
      },
    };

    axios
      .request(config)
      .then(response => {
        setMenuAccessData(response?.data?.menu_access);
        setPunchin_radius(response?.data);
        setHomeSkeleton(response?.data)
        setUserdata({
          name: response.data.users.FULL_NAME,
          image: response.data.users.image,
        });

      })
      .catch(error => {
        console.log(error);
      });
  };

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
      getList()
      getActiveLocation();
      check_punchIn();
      // ProfileDetails();
      get_month_logs();
      ManuAccessdetails();
      ManuAccessdetails_Socket();
    }, []),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    getList()
    getActiveLocation();
    check_punchIn();
    get_month_logs();
    ManuAccessdetails_Socket();
    ManuAccessdetails();
    getUserFace()
  };

  const getActiveLocation = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
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

    setModalVisible(true);
    settimerOn(false);
    shouldTrackLocation.current = false;
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    const UserLocation = await AsyncStorage.getItem('UserLocation');
    setuser(JSON.parse(userData));
    // setlocation(JSON.parse(UserLocation));
    const config = {
      headers: { Token: token },
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
            setlocationOut(data?.out_location_id);
            settimerOn(true);
            shouldTrackLocation.current = true;
            setloading(false);
            setModalVisible(false);
          } else {
            if (data.in_time != '' && data.out_location_id != '') {
              setloading(false);
              setpunchIn(false);
              setModalVisible(false);
              setHomeSkeleton(response.data)
              setinTime(data.in_time);
              setlocationOut(data.out_location_id);
              settimerOn(false);
              shouldTrackLocation.current = false;
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

        if (error?.response?.status == '401') {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [
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


  // face dedection start...........................................
  const [firstImage, setFirstImage] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [menu_access, setMenuaccess] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [face_kyc_img, setFace_kyc_img] = useState()
  const [faces, setFaces] = useState([]);
  const [progress, setProgress] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const [suggestion, setSuggestion] = useState(false)
  const [showkyc, setShowKyc] = useState(false)
  const [modalkycpermissions, setModalKycPermission] = useState(false)


  const s3 = new S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
  });

  const rekognition = new Rekognition({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
  });
  const cameraRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [blob, setBlob] = useState()
  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setDetecting(true);
      // Simulate progress
      let progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 1) {
            clearInterval(progressInterval);
            return 1;
          }
          return prevProgress + 0.1;
        });
      }, 1000); // Adjust the interval as needed
    } else {
      setDetecting(false);
      setProgress(0);
    }
  };



  const takePicture = async () => {

    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setBlob(data)
      setCapturedImage(data.uri);
      console.log(data.uri, 'hello')
      const uploadResult = await uploadTmpimage(data.uri);
      console.log(uploadResult, 'uploadResult')
      const s3ObjectKey = uploadResult.Key;
      console.log("S3 object data ------------->", s3ObjectKey)
      const ss = await compareFaces(s3ObjectKey)


    }

  };
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
      Bucket: 'face-recoginition', // replace with your bucket name
      Key: `face_detection_punch_in/${employeeNumber}.jpg`, // Use empId in the file path
      Body: blob,
      ContentType: 'image/jpeg',
    };
    console.log("params during punch_in face deduction-----------------", params)
    return s3.upload(params).promise();
  };


  const getUserFace = async () => {
    const token = await AsyncStorage.getItem('Token');
    fetch(`${apiUrl}/SecondPhaseApi/get_user_face_kyc`, {
      method: 'GET',
      headers: {
        'Token': token,
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {

        setModalKycPermission(response?.data?.face_kyc)
        if (response?.data?.face_kyc == 1) {
          setFace_kyc_img(response?.data?.face_kyc_img)
          setShowKyc(false)
        }
        else {
          setIsModalVisible(true)
          setShowKyc(false)
        }

      })
      .catch(err => {
        setloading(false);
      });

  }

  useEffect(() => {
    getUserFace()
  }, [kycmodalback, route])

  // end kyc check api

  const compareFaces = async (s3ObjectKey) => {
    // setIsModalVisible(false)
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    const params = {
      SourceImage: {
        S3Object: {
          Bucket: 'face-recoginition',
          Name: s3ObjectKey  // The image you want to compare with
        },
      },
      TargetImage: {
        S3Object: {
          Bucket: 'face-recoginition',
          Name: face_kyc_img, // The uploaded image
        },
      },
      SimilarityThreshold: 90,
    };

    rekognition.compareFaces(params, (err, data) => {
      if (err) {
        if (err.message === 'Requested image should either contain bytes or s3 object.') {
          setShowKyc(false)
          setIsModalVisible(true); // Show the modal
        } else {
          // Show the popup with the error message for other errors
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: err.message, // Display the actual error message
            buttonText: 'Ok',
            callback: () => Popup.hide()
          });
          setShowKyc(false)
        }
      }
      else if (data?.UnmatchedFaces.length > 0) {
        Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: 'Faces do not match',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        });
        setShowKyc(false)
      }
      else {
        setShowCamera(false)
        setFaceModal(true)
        setloading(false);
        punch_in()
      }
    });
  };

  useEffect(() => {
    if (kYCModal == true) {
      setKYCModal(false)
    }
  }, [kYCModal, faceModal, faceNotModal])

  // face dedection end.............................................

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
        { text: 'OK', onPress: () => punch_out() },
      ],
      { cancelable: false },
    );
  };

  const punch_out = async () => {
    setloading(true);
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
        const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
        const address = await axios.get(urlAddress)
        // console.log(address.data?.results[0].formatted_address, 'address.data?.results[0].formatted_address')
        setcurrentLocation({
          long: long,
          lat: lat,
        });
        let locations = { userId: userInfo?.userid, location: { longitude: long, latitude: lat } }
        var dis = getDistance(
          { latitude: lat, longitude: long },
          {
            latitude: activeLocation.latitude,
            longitude: activeLocation.longitude,
          },
        );

        if (radius <= 0) {
          const token = await AsyncStorage.getItem('Token');
          const config = {
            headers: { Token: token },
          };
          const body = {
            user_id: user.userid,
            employee_number: user.employee_number,
            email: user.email,
            location_id: activeLocation.location_id,
            latitude: lat,
            longitude: long,
            current_address: address.data?.results[0]?.formatted_address,
          };
          // console.log("current address............................punch out...........................", body)
          axios
            .post(`${apiUrl}/secondPhaseApi/mark_attendance_out`, body, config)
            .then(function (response) {
              if (response.data.status == 1) {
                check_punchIn();
                get_month_logs();
                EndBackgroundService()
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
                    AsyncStorage.removeItem('Token'),
                    AsyncStorage.removeItem('UserData'),
                    AsyncStorage.removeItem('UserLocation'),
                    navigation.navigate('Login'),
                  ],
                });
              }
            });
        }
        else if (radius > 0) {
          if (radius >= dis) {
            const token = await AsyncStorage.getItem('Token');
            const config = {
              headers: { Token: token },
            };
            const body = {
              user_id: user.userid,
              employee_number: user.employee_number,
              email: user.email,
              location_id: activeLocation.location_id,
              latitude: lat,
              longitude: long,
              current_address: address.data?.results[0]?.formatted_address,
            };
            // console.log("current address............................punch out...........................", body)
            axios
              .post(`${apiUrl}/secondPhaseApi/mark_attendance_out`, body, config)
              .then(function (response) {
                if (response.data.status == 1) {
                  check_punchIn();
                  get_month_logs();
                  EndBackgroundService()
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
            if (radius >= dis) {
              const token = await AsyncStorage.getItem('Token');
              const config = {
                headers: { Token: token },
              };
              const body = {
                user_id: user.userid,
                employee_number: user.employee_number,
                email: user.email,
                location_id: activeLocation.location_id,
                latitude: lat,
                longitude: long,
                current_address: address.data?.results[0].formatted_address,
              };
              axios
                .post(
                  `${apiUrl}/secondPhaseApi/mark_attendance_out`,
                  body,
                  config,
                )
                .then(function (response) {
                  if (response.data.status == 1) {
                    check_punchIn();
                    get_month_logs();
                    EndBackgroundService()
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
                        AsyncStorage.removeItem('Token'),
                        AsyncStorage.removeItem('UserData'),
                        AsyncStorage.removeItem('UserLocation'),
                        navigation.navigate('Login'),
                      ],
                    });
                  }
                });
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
        }
        else {
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
            setDisabledBtn(false)
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
            setDisabledBtn(false)
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
            setDisabledBtn(false)
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
            setDisabledBtn(false)
            return;
          }

          if (radius <= 0) {
            const token = await AsyncStorage.getItem('Token');
            const userData = await AsyncStorage.getItem('UserData');
            const userInfo = JSON.parse(userData);

            const config = {
              headers: { Token: token },
            };
            const body = {
              email: userInfo.email,
              location_id: activeLocation.location_id,
              latitude: lat,
              longitude: long,
              login_type: 'mobile',
              current_address: address.data?.results[0].formatted_address,
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
                  setDisabledBtn(false)
                  get_month_logs()
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
                  setDisabledBtn(false)
                }
              })
              .catch(function (error) {
                setloading(false);
                setDisabledBtn(false)
                if (error.response.status == '401') {
                  Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: error.response.data.msg,
                    buttonText: 'Ok',
                    callback: () => [
                      AsyncStorage.removeItem('Token'),
                      AsyncStorage.removeItem('UserData'),
                      AsyncStorage.removeItem('UserLocation'),
                      navigation.navigate('Login'),
                    ],
                  });
                }
              });
          }
          else if (radius > 0) {
            if (radius >= dis) {
              const token = await AsyncStorage.getItem('Token');
              const userData = await AsyncStorage.getItem('UserData');
              const userInfo = JSON.parse(userData);

              const config = {
                headers: { Token: token },
              };
              const body = {
                email: userInfo.email,
                location_id: activeLocation.location_id,
                latitude: lat,
                longitude: long,
                login_type: 'mobile',
                current_address: address.data?.results[0].formatted_address,
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
                    setDisabledBtn(false)
                    get_month_logs()
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
                    setDisabledBtn(false)
                  }
                })
                .catch(function (error) {
                  setloading(false);
                  setDisabledBtn(false)
                  if (error.response.status == '401') {
                    Popup.show({
                      type: 'Warning',
                      title: 'Warning',
                      button: true,
                      textBody: error.response.data.msg,
                      buttonText: 'Ok',
                      callback: () => [
                        AsyncStorage.removeItem('Token'),
                        AsyncStorage.removeItem('UserData'),
                        AsyncStorage.removeItem('UserLocation'),
                        navigation.navigate('Login'),
                      ],
                    });
                  }
                });
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
              setDisabledBtn(false)
            }
          }
          else {
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
              setDisabledBtn(false)
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
              setDisabledBtn(false)
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
              setDisabledBtn(false)
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
              setDisabledBtn(false)
              return;
            }

            if (radius >= dis) {
              const token = await AsyncStorage.getItem('Token');
              const userData = await AsyncStorage.getItem('UserData');
              const userInfo = JSON.parse(userData);

              const config = {
                headers: { Token: token },
              };
              const body = {
                email: userInfo.email,
                location_id: activeLocation.location_id,
                latitude: lat,
                longitude: long,
                login_type: 'mobile',
                current_address: address.data?.results[0].formatted_address,
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
                    setDisabledBtn(false)
                    get_month_logs()
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
                    setDisabledBtn(false)
                  }
                })
                .catch(function (error) {
                  setloading(false);
                  setDisabledBtn(false)
                  if (error.response.status == '401') {
                    Popup.show({
                      type: 'Warning',
                      title: 'Warning',
                      button: true,
                      textBody: error.response.data.msg,
                      buttonText: 'Ok',
                      callback: () => [
                        AsyncStorage.removeItem('Token'),
                        AsyncStorage.removeItem('UserData'),
                        AsyncStorage.removeItem('UserLocation'),
                        navigation.navigate('Login'),
                      ],
                    });
                  }
                });
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
              setDisabledBtn(false)
            }
          }
        }
      })
      .catch(error => {
        setloading(false);
        const { code, message } = error;
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
    setDisabledBtn(true)
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
              console.log("location>>>>>>>>>>>>>", location)
              setloading(false);
              var lat = parseFloat(location.latitude);
              var long = parseFloat(location.longitude);
              const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
              const address = await axios.get(urlAddress)
              // { Live tracking starting}
              // sendLocation({
              //   userId: userInfo?.userid,
              //   location: {
              //     longitude: long,
              //     latitude: lat,
              //   },
              // });
              // { Live tracking ending }
              // console.log(address.data?.results[0]?.formatted_address)

              setcurrentLocation({
                long: long,
                lat: lat,
              });

              var dis = getDistance(
                { latitude: lat, longitude: long },
                {
                  latitude: activeLocation.latitude,
                  longitude: activeLocation.longitude,
                },
              );

              if (radius <= 0) {
                const token = await AsyncStorage.getItem('Token');
                const userData = await AsyncStorage.getItem('UserData');
                const userInfo = JSON.parse(userData);

                const config = {
                  headers: { Token: token },
                };
                const body = {
                  email: userInfo.email,
                  location_id: activeLocation.location_id,
                  latitude: lat,
                  longitude: long,
                  login_type: 'mobile',
                  current_address: address.data?.results[0]?.formatted_address,

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
                      Popup.show({
                        type: 'Success',
                        title: 'Success',
                        button: true,
                        textBody: response.data.message,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()]
                      });
                      setShowKyc(false)
                      setloading(false);
                      setDisabledBtn(false)
                      get_month_logs()
                    } else {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: response.data.message,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()]
                      });
                      setShowKyc(false)
                      setloading(false);
                      setDisabledBtn(false)

                    }
                  })
                  .catch(function (error) {
                    setloading(false);
                    setDisabledBtn(false)
                    if (error.response.status == '401') {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: error.response.data.msg,
                        buttonText: 'Ok',
                        callback: () => [
                          AsyncStorage.removeItem('Token'),
                          AsyncStorage.removeItem('UserData'),
                          AsyncStorage.removeItem('UserLocation'),
                          navigation.navigate('Login'),
                        ],
                      });
                    }
                  });
              }
              else if (radius > 0) {
                if (radius >= dis) {
                  if (updatedfacereconization?.length > 0) {
                    setShowCamera(true)
                    setFirstImage(false)
                  }
                  else {
                    const token = await AsyncStorage.getItem('Token');
                    const userData = await AsyncStorage.getItem('UserData');
                    const userInfo = JSON.parse(userData);

                    const config = {
                      headers: { Token: token },
                    };
                    const body = {
                      email: userInfo.email,
                      location_id: activeLocation.location_id,
                      latitude: lat,
                      longitude: long,
                      login_type: 'mobile',
                      current_address: address.data?.results[0]?.formatted_address,

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
                          Popup.show({
                            type: 'Success',
                            title: 'Success',
                            button: true,
                            textBody: response.data.message,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()]
                          });
                          setShowKyc(false)
                          setloading(false);
                          setDisabledBtn(false)
                          get_month_logs()


                        } else {
                          setloading(false);
                          setloading(false);
                          setDisabledBtn(false)
                          Popup.show({
                            type: 'Success',
                            title: 'Success',
                            button: true,
                            textBody: response.data.message,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()]
                          });
                          setShowKyc(false)

                        }
                      })
                      .catch(function (error) {
                        setloading(false);
                        setDisabledBtn(false)
                        if (error.response.status == '401') {
                          Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: error.response.data.msg,
                            buttonText: 'Ok',
                            callback: () => [
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
                    setDisabledBtn(false)
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
                    setDisabledBtn(false)
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
                    setDisabledBtn(false)
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
                    setDisabledBtn(false)
                    return;
                  }

                  if (radius >= dis) {
                    const token = await AsyncStorage.getItem('Token');
                    const userData = await AsyncStorage.getItem('UserData');
                    const userInfo = JSON.parse(userData);

                    const config = {
                      headers: { Token: token },
                    };
                    const body = {
                      email: userInfo.email,
                      location_id: activeLocation.location_id,
                      latitude: lat,
                      longitude: long,
                      login_type: 'mobile',
                      current_address: address.data?.results[0].formatted_address,
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
                          Popup.show({
                            type: 'Success',
                            title: 'Success',
                            button: true,
                            textBody: response.data.message,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()]
                          });
                          setShowKyc(false)
                          setloading(false);
                          setDisabledBtn(false)
                          get_month_logs()
                        } else {
                          Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: response.data.message,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()]
                          });
                          setShowKyc(false)
                          setloading(false);
                          setDisabledBtn(false)
                        }
                      })
                      .catch(function (error) {
                        setloading(false);
                        setDisabledBtn(false)
                        if (error.response.status == '401') {
                          Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: error.response.data.msg,
                            buttonText: 'Ok',
                            callback: () => [
                              AsyncStorage.removeItem('Token'),
                              AsyncStorage.removeItem('UserData'),
                              AsyncStorage.removeItem('UserLocation'),
                              navigation.navigate('Login'),
                            ],
                          });
                        }
                      });
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
                    setDisabledBtn(false)
                  }
                }
              }
            })
            .catch(error => {
              const { code, message } = error;
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: message,
                buttonText: 'Ok',
                callback: () => [Popup.hide()],
              });
              setloading(false);
              setDisabledBtn(false)
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
          setDisabledBtn(false)
        }
      } catch (err) {
        setloading(false);
        setDisabledBtn(false)
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
            const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
            const address = await axios.get(urlAddress)
            // { Live tracking starting}
            // sendLocation({
            //   userId: userInfo?.userid,
            //   location: {
            //     longitude: long,
            //     latitude: lat,
            //   },
            // });
            // { Live tracking starting}

            setcurrentLocation({
              long: long,
              lat: lat,
            });

            var dis = getDistance(
              { latitude: lat, longitude: long },
              {
                latitude: activeLocation.latitude,
                longitude: activeLocation.longitude,
              },
            );


            if (radius <= 0) {
              const token = await AsyncStorage.getItem('Token');
              const userData = await AsyncStorage.getItem('UserData');
              const userInfo = JSON.parse(userData);

              const config = {
                headers: { Token: token },
              };
              const body = {
                email: userInfo.email,
                location_id: activeLocation.location_id,
                latitude: lat,
                longitude: long,
                login_type: 'mobile',
                current_address: address.data?.results[0].formatted_address,
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
                    Popup.show({
                      type: 'Success',
                      title: 'Success',
                      button: true,
                      textBody: response.data.message,
                      buttonText: 'Ok',
                      callback: () => [Popup.hide()]
                    });
                    setShowKyc(false)
                    setDisabledBtn(false)
                    setloading(false);
                    get_month_logs()
                  } else {
                    Popup.show({
                      type: 'Warning',
                      title: 'Warning',
                      button: true,
                      textBody: response.data.message,
                      buttonText: 'Ok',
                      callback: () => [Popup.hide()]
                    });
                    setShowKyc(false)

                    setloading(false);
                    setDisabledBtn(false)
                  }
                })
                .catch(function (error) {
                  setloading(false);
                  setDisabledBtn(false)
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
            else if (radius > 0) {
              if (radius >= dis) {
                const token = await AsyncStorage.getItem('Token');
                const userData = await AsyncStorage.getItem('UserData');
                const userInfo = JSON.parse(userData);

                const config = {
                  headers: { Token: token },
                };
                const body = {
                  email: userInfo.email,
                  location_id: activeLocation.location_id,
                  latitude: lat,
                  longitude: long,
                  login_type: 'mobile',
                  current_address: address.data?.results[0].formatted_address,
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
                      Popup.show({
                        type: 'Success',
                        title: 'Success',
                        button: true,
                        textBody: response.data.message,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()]
                      });
                      setShowKyc(false)
                      setDisabledBtn(false)
                      setloading(false);
                      get_month_logs()
                    } else {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: response.data.message,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()]
                      });
                      setShowKyc(false)
                      setloading(false);
                      setDisabledBtn(false)
                    }
                  })
                  .catch(function (error) {
                    setloading(false);
                    setDisabledBtn(false)
                    if (error.response.status == '401') {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: error.response.data.msg,
                        buttonText: 'Ok',
                        callback: () => [
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
                  setDisabledBtn(false)
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
                  setDisabledBtn(false)
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
                  setDisabledBtn(false)
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
                  setDisabledBtn(false)
                  return;
                }

                if (radius >= dis) {
                  const token = await AsyncStorage.getItem('Token');
                  const userData = await AsyncStorage.getItem('UserData');
                  const userInfo = JSON.parse(userData);

                  const config = {
                    headers: { Token: token },
                  };
                  const body = {
                    email: userInfo.email,
                    location_id: activeLocation.location_id,
                    latitude: lat,
                    longitude: long,
                    login_type: 'mobile',
                    current_address: address.data?.results[0].formatted_address,
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
                        Popup.show({
                          type: 'Success',
                          title: 'Success',
                          button: true,
                          textBody: response.data.message,
                          buttonText: 'Ok',
                          callback: () => [Popup.hide()]
                        });
                        setShowKyc(false)
                        setDisabledBtn(false)
                        setloading(false);
                        get_month_logs()
                      } else {
                        Popup.show({
                          type: 'Warning',
                          title: 'Warning',
                          button: true,
                          textBody: response.data.message,
                          buttonText: 'Ok',
                          callback: () => [Popup.hide()]
                        });
                        setShowKyc(false)

                        setloading(false);
                        setDisabledBtn(false)
                      }
                    })
                    .catch(function (error) {
                      setloading(false);
                      setDisabledBtn(false)

                      if (error.response.status == '401') {
                        Popup.show({
                          type: 'Warning',
                          title: 'Warning',
                          button: true,
                          textBody: error.response.data.msg,
                          buttonText: 'Ok',
                          callback: () => [
                            AsyncStorage.removeItem('Token'),
                            AsyncStorage.removeItem('UserData'),
                            AsyncStorage.removeItem('UserLocation'),
                            navigation.navigate('Login'),
                          ],
                        });
                      }
                    });
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
                  setDisabledBtn(false)
                }
              }
            }
          })
          .catch(error => {
            const { code, message } = error;
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: message,
              buttonText: 'Ok',
              callback: () => [Popup.hide()],
            });

            setloading(false);
            setDisabledBtn(false)
          });
      } catch (err) {
        setloading(false);
        setDisabledBtn(false)
        // console.warn(err);
      }
    }
  };

  /*

  //  This is used send live tracking location socketContext page Starting ..................................

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
          }).then(async location => {
            setloading(false);
            var lat = parseFloat(location.latitude);
            var long = parseFloat(location.longitude);

            // { Live tracking starting}
            // sendLocation({
            //   userId: userInfo?.userid,
            //   location: {
            //     longitude: long,
            //     latitude: lat,
            //   },
            // });
            // { Live tracking ending }

            setcurrentLocation({
              long: long,
              lat: lat,
            });
          });
        }
      } catch (err) {
        setloading(false);
        console.warn(err);
      }
    }
  };

  const [currentPosition, setCurrentPosition] = useState(null);
  const [previousPosition, setPreviousPosition] = useState(null);

  const distanceThreshold = 0.001;

  const sendLocationUpdate = async (position, user_id) => {
    console.log(user_id, 'user_id');
    sendLocation({
      userId: user_id,

      location: {
        longitude: position?.coords?.longitude,
        latitude: position?.coords?.latitude,
      },
    });
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

  const doSomething = async () => {
    const userData = await AsyncStorage.getItem('UserData');
    const userInfo = JSON.parse(userData);
    const user_id = userInfo?.userid;
    const watchId = Geolocation.watchPosition(
      position => {
        // Save current position as previous position before updating
        console.log(currentPosition, 'currentPosition')

        if (previousPosition) {
          const distance = calculateDistance(
            previousPosition?.coords?.latitude,
            previousPosition?.coords?.longitude,
            position?.coords?.latitude,
            position?.coords?.longitude,
          );

          if (distance >= distanceThreshold) {
            sendLocationUpdate(position, user_id);
            setPreviousPosition(currentPosition);

          }
        } else {
          sendLocationUpdate(position, user_id);
          setPreviousPosition(currentPosition);
        }
        setCurrentPosition(position);
      },
      error => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 1, interval: 5000 },
    );

    // Clean up the watchPosition when the component unmounts
    return () => Geolocation.clearWatch(watchId);
  };
  const map = {
    taskName: 'Example',
    taskTitle: 'ExampleTask map',
    taskDesc: 'ExampleTask map',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async taskDataArguments => {
    const { delay } = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        await sleep(delay);
        // doSomething();
      }
    });
  };

  // useEffect(async() => {

  //     await BackgroundService.start(veryIntensiveTask,map);
  //     doSomething();



  // }, [currentPosition]);

  //  This is used send live tracking location socketContext page Ending ..................................
*/

  const renderItem = ({ item }) =>
    // console.log("A.......", item)
    // let x = item?.id;
    // console.log(x);

    item?.id === 0 ||
    item?.id === 8 || (
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          onPress={() =>
            item.id == 0
              ? navigation.navigate('Post', { screen: 'Post' })
              : navigation.navigate(item.moveTo)
          }>
          <ImageBackground
            style={styles.options1}
            source={item?.location}
            imageStyle={{ borderRadius: 10 }}>
            <Text
              style={{
                color: '#000',
                position: 'absolute',
                bottom: 0,
                fontSize: 10,
                fontWeight: '600',
                alignSelf: 'center',
              }}>
              {item?.name}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

    );

  // const ProfileDetails = async () => {
  //   const token = await AsyncStorage.getItem('Token');
  //   const config = {
  //     headers: { Token: token },
  //   };
  //   axios
  //     .post(`${apiUrl}/api/get_employee_detail`, {}, config)
  //     .then(response => {
  //       if (response.data.status === 1) {
  //         try {
  //           setUserdata({
  //             name: response.data.data.FULL_NAME,
  //             image: response.data.data.image,
  //           });
  //           // get_employee_detail();
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       } else {
  //         console.log('some error occured');
  //       }
  //     })
  //     .catch(error => {
  //       if (error.response.status == '401') {
  //       }
  //     });
  // };

  // const getAtendenceApi = useApi(attendence.getAttendance);

  // const [locationStatus, setLocationStatus] = useState('');
  // const [location, setlocation] = useState();
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
  }, [punchInApi.loading,]);

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
            shouldTrackLocation.current = true;
            setloading(false);
          } else {
            if (data.in_time != '' && data.out_location_id != '') {
              // after punch out
              setinTime(data.in_time);
              setloading(false);
              setpunchIn(false);
              settimerOn(false);
              shouldTrackLocation.current = false;
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
  }, [todayAtendenceApi.loading,]);

  useEffect(() => {
    setTimeout(function () {
      if (getActiveLocationApi.data != null) {
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
      headers: { Token: token },
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
          } catch (e) { }
        } else {
        }
      })
      .catch(error => {
        setloading(false);
        if (error.response.status == '401') {
        }
      });
  };

  const filterLastSevenDays = (logs) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return logs.filter((log) => {
      const logDate = new Date(log.TR_DATE);
      return logDate >= sevenDaysAgo;
    });
  };

  const lastSevenDaysLogs = filterLastSevenDays(recentLogs);

  // location..................tracking..................................

  const [locationArray, setLocationArray] = useState([]);

  const storeLocation = async (location) => {
    if (timerOn && updatedlivetrackingaccess?.length > 0 && locationblock == 1 && activeinactivetracking == 1 && shouldTrackLocation.current) {
      try {
        console.log("5 sec ......")
        setLocationArray((prevLocations) => {
          const updatedLocations = [...prevLocations, location];
          AsyncStorage.setItem('CurrentLocation', JSON.stringify(updatedLocations));
          return updatedLocations;
        });
      } catch (error) {
        console.error('Error storing location:', error);
      }
    } else {
      console.log('Location Tracking Blocked for this user');
    }
  };

  const sendStoredLocation = async () => {
    // console.log("1 mint........")
    if (timerOn && updatedlivetrackingaccess?.length > 0 && locationblock == 1 && activeinactivetracking == 1 && shouldTrackLocation.current) {
      try {
        const token = await AsyncStorage.getItem('Token');
        const config = {
          headers: { Token: token },
        };
        const userData = await AsyncStorage.getItem('UserData');
        const userInfo = JSON.parse(userData);
        const storedLocation = await AsyncStorage.getItem('CurrentLocation');
        // console.log("json location........", storedLocation)
        if (storedLocation) {
          const locations = JSON.parse(storedLocation).map((loc) => ({
            latitude: loc.latitude.toString(),
            longitude: loc.longitude.toString()
          }));
          const payload = {
            user_id: userInfo?.userid,
            locations
          };
          const response = await axios.post(
            `${apiUrl}/secondPhaseApi/send_locations`,
            payload, config
          );
          // console.error('Response from server:', response?.data);
          await AsyncStorage.removeItem('CurrentLocation');
          setLocationArray([]);
        } else {
          // console.error('No stored location found.')
          await AsyncStorage.removeItem('CurrentLocation');
          setLocationArray([]);
        }
      } catch (error) {
        // console.error('Error sending stored location:', error);
        await AsyncStorage.removeItem('CurrentLocation');
        setLocationArray([]);
      }
    } else {
      console.log('Location Tracking Blocked for this user');
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return new Promise((resolve, reject) => {
        Geolocation.requestAuthorization('always')
          .then((result) => {
            // Handle the result or status if needed
            resolve(result);
          })
          .catch((error) => {
            // Handle any errors that might occur
            reject(error);
            return false;
          });
      });
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "We need access to your location " +
              "so we can provide location-based services.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Background location permission denied');
          return false;
        }

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };

  const previousLocationRef = useRef(null);

  startLocationTracking = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to fetch location.');
      setTracking(false);
      return;
    }

    watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };

        // console.log('position', position);

        // Calculate distance from previous location
        if (previousLocationRef.current) {
          const distance = getDistance(previousLocationRef.current, newLocation);
          if (distance > 10) {
            console.log('distance is greater than 20 - new location', newLocation, distance);
            console.log('distance is greater than 20 - previous location', previousLocationRef.current, distance);
            previousLocationRef.current = newLocation;
            setLocation(newLocation);
            storeLocation(newLocation);
          } else {
            console.log('distance is less than 20 - new location', newLocation, distance);
            console.log('distance is less than 20 - previous location', previousLocationRef.current, distance);
          }
        } else {
          // console.log('setting previous locations....');
          previousLocationRef.current = newLocation;
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 2,
        interval: 1000,
        maximumAge: 0,
        showLocationDialog: true,
      }
    );
  }

  const getDistance = (loc1, loc2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Radius of Earth in meters

    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);
    const deltaLat = toRad(loc2.latitude - loc1.latitude);
    const deltaLon = toRad(loc2.longitude - loc1.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    return distance;
  };

  const shouldTrackLocation = useRef(false)

  useEffect(() => {
    setStartBackgroundTracking(() => startBackgroundService);
  }, [setStartBackgroundTracking]);

  useEffect(() => {
    async function fetchMyAPI() {
      const token = await AsyncStorage.getItem('Token');

      if (token && updatedlivetrackingaccess?.length > 0 && locationblock == 1 && activeinactivetracking == 1 && shouldTrackLocation.current) {
        startBackgroundService()
      } else {
        EndBackgroundService()
      }
    }
    fetchMyAPI()
  }, [timerOn, updatedlivetrackingaccess?.length, locationblock, activeinactivetracking])

  const EndBackgroundService = async () => {
    Geolocation.stopObserving()
    BackgroundService.on('expiration', () => { console.log('Background service is being closed :('); });
    await BackgroundService.stop()
  }

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const startBackgroundService = async () => {
    const veryIntensiveTask = async (taskDataArguments) => {
      const { delay } = taskDataArguments;

      const cleanup = () => {
        // Clear watch and intervals
        if (watchId !== null) {
          Geolocation.clearWatch(watchId);
        }
        if (sendInterval !== null) {
          clearInterval(sendInterval);
        }
      };

      let sendInterval = null;
      let watchId = null;

      while (BackgroundService.isRunning(veryIntensiveTask)) {
        console.log("Running task...");

        if (timerOn) {
          // Start location tracking
          watchId = startLocationTracking();

          // Send stored location periodically
          sendInterval = setInterval(() => {
            sendStoredLocation();
          }, 60000);

          // Wait for the specified delay before the next iteration
          await sleep(delay);
        } else {
          // Cleanup if timer is turned off
          cleanup();
          break; // Exit the loop if timer is turned off
        }
      }

      // Cleanup when the task is done
      cleanup();
    };

    const options = {
      taskName: 'HRJee Track Your Locations',
      taskTitle: 'HRJee Track Your Locations',
      taskDesc: 'Tracking started',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane',
      parameters: {
        delay: 5000, // Delay in milliseconds
      },
    };

    try {
      await BackgroundService.start(veryIntensiveTask, options);
    } catch (e) {
      console.error('Error starting background service:', e);
    }
  };

  const renderItemLogs = ({ item, index }) => {
    const time = new Date(item?.punch_in_time);
    const getTime = time.toLocaleTimeString();

    return (
      <View key={index} style={styles.recent_log_box}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.weekDay}>
            {days[new Date(item.TR_DATE).getDay()]}
          </Text>
          <Text
            style={{
              color: Themes === 'dark' ? '#000' : '#000',
              fontWeight: '600',
            }}>
            {item.TR_DATE}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.weekDay}>Punch In Time</Text>
          <Text
            style={{
              color: Themes === 'dark' ? '#000' : '#000',
              fontWeight: '600',
            }}>
            {getTime}
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <AntDesign
            name="clockcircleo"
            size={20}
            style={[
              { marginBottom: 5 },
              { color: Themes === 'dark' ? '#000' : '#000' },
            ]}
          />
          {(datetime === item.TR_DATE && item.location_id) ||
            datetime > item.TR_DATE ? (
            <Text
              style={{
                color: Themes === 'dark' ? '#000' : '#000',
                fontWeight: '600',
              }}>
              {item.PRESENT_HOURS}
            </Text>
          ) : hours >= '19:00' ? (
            <Text
              style={{
                color: Themes === 'dark' ? '#000' : '#000',
                fontWeight: '600',
              }}>
              {item.PRESENT_HOURS}
            </Text>
          ) : (
            <Text
              style={{
                color: Themes === 'dark' ? '#000' : '#000',
                fontWeight: '600',
              }}>
              NA
            </Text>
          )}
        </View>
      </View>
    );
  }

  if (homeskelton == null) {
    return <HomeSkeleton />
  }


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#e3eefb" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e3eefb' }}>
        {
          showkyc ?
            <>
              <Root>
                <RNCamera
                  ref={cameraRef}
                  style={styles.preview}
                  type={RNCamera.Constants.Type.front}
                  captureAudio={false}
                  onFacesDetected={handleFacesDetected}
                  onCameraReady={takePicture}
                  faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                >
                  {/* <Progress.Circle size={30} progress={progress} width={200} /> */}
                  <Progress.Circle
                    size={100}
                    progress={progress}
                    showsText={true}
                    formatText={(progress) => `${Math.round(progress * 100)}%`}
                    color={'#e3eefb'}
                    style={{ marginVertical: 20 }}
                  />

                </RNCamera>
              </Root>
            </>
            :
            <Root>
              <PullToRefresh onRefresh={handleRefresh}>
                <NotificationController />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 10,
                        }}>
                        <Image
                          style={styles.tinyLogo}
                          // source={require('../../images/profile_pic.webp')}
                          source={
                            Userdata?.image
                              ? { uri: Userdata.image }
                              : require('../../images/profile_pic.webp')
                          }
                        />
                        <Text
                          numberOfLines={1}
                          style={[
                            { fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
                            { color: Themes == 'dark' ? '#000' : '#000' },
                          ]}>
                          {user?.FULL_NAME}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      {
                        livetrackingaccess && livetrackingaccess?.length > 0 &&
                        <TouchableOpacity
                          onPress={() => navigation.navigate('UserList')}
                          style={{}}
                        >
                          <FontAwesome
                            name="users"
                            style={{
                              fontSize: 25,
                              color: '#000',
                              marginRight: 10,
                            }}
                          />
                        </TouchableOpacity>
                      }

                      <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                        style={{}}>
                        <Ionicons
                          name="notifications-outline"
                          style={{
                            fontSize: 30,
                            color: '#000',
                            marginRight: 10,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{}}>
                    <FlatList showsHorizontalScrollIndicator={false}
                      horizontal
                      data={options}
                      renderItem={renderItem}
                      keyExtractor={item => item?.id}
                    />
                  </View>
                  <View style={{ padding: 15, marginTop: 0 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          { fontSize: 18, fontWeight: '700' },
                          { color: Themes == 'dark' ? '#000' : '#000' },
                        ]}>
                        E-Attendance
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Select Attendance')}>
                        <Text
                          style={[
                            styles.purple_txt,
                            {
                              color: Themes == 'dark' ? '#000' : '#000',
                              fontWeight: 'bold',
                            },
                          ]}>
                          View History
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 5, borderRadius: 15 }}>
                      <View
                        style={{
                          backgroundColor: 'white',
                          margin: 8,
                          padding: 15,
                          borderRadius: 20,
                          flexDirection: 'row',
                          // borderWidth: 1,
                          borderColor: '#172B85',
                        }}>
                        <View
                          style={{
                            width: '35%',
                            // backgroundColor: 'pink',
                            borderRightWidth: 0.5,
                            borderRightColor: 'grey',
                            alignItems: 'center', alignSelf: "center"
                          }}>
                          <View style={{ alignItems: 'center' }}>
                            <Text
                              style={{
                                color: '#000',
                                fontSize: 15,
                                fontWeight: '800',
                              }}>
                              {days[d.getDay()]}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={[
                                  {
                                    color: '#000',
                                    fontSize: 15,
                                    fontWeight: '800',
                                  },
                                  { color: Themes == 'dark' ? '#000' : '#000' },
                                ]}>
                                {d.getDate() + ' ' + monthNames[d.getMonth()]}
                              </Text>
                              <Text
                                style={{
                                  color: '#000',
                                  fontSize: 15,
                                  fontWeight: '800', marginLeft: 5
                                }}>
                                {d.getFullYear()}
                              </Text>
                            </View>
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
                                    fontSize: 15,
                                    fontWeight: 'bold',
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
                              disabled={disabledBtn == true ? true : false}
                              onPress={() => {
                                if (updatedfacereconization?.length > 0) {
                                  if (modalkycpermissions == 0) {
                                    setIsModalVisible(true)
                                  } else {
                                    setShowKyc(true)
                                  }

                                } else {
                                  punch_in();
                                  setShowKyc(false);
                                }
                              }}
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
                                <Text style={{
                                  color: Themes == 'dark' ? '#000' : '#000',
                                  fontSize: 15,
                                  fontWeight: 'bold',
                                }}>{fullTime}</Text>
                              </View>
                              <Text style={{ color: 'red', marginTop: 10 }}>
                                Total Time Elapsed
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 0, marginHorizontal: 10 }}>
                    <Text
                      style={[
                        { fontSize: 18, fontWeight: '600' },
                        { color: Themes == 'dark' ? '#000' : '#000' },
                      ]}>
                      Recent Logs
                    </Text>

                    <FlatList
                      data={lastSevenDaysLogs}
                      renderItem={renderItemLogs}
                      keyExtractor={item => item?.id}
                      ListEmptyComponent={
                        <Text
                          style={{
                            textAlign: 'center',
                            color: Themes === 'dark' ? '#000' : '#000',
                          }}>
                          No found data
                        </Text>
                      }
                    />

                  </View>
                </View>

              </PullToRefresh>
              {/* <Button title="Show Modal" onPress={toggleModal} />   */}

              {
                updatedfacereconization?.length > 0 && modalkycpermissions == 0 ?
                  <Modal
                    isVisible={isModalVisible}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                  >
                    <View style={styles.modalContent}>
                      <View style={{ alignSelf: "flex-end" }}>
                        <AntDesign
                          name="close"
                          size={22}
                          style={{
                            marginBottom: 5
                          }}
                          color="red"
                          onPress={() => setIsModalVisible(!isModalVisible)}
                        />
                      </View>
                      <Image
                        source={require('../../images/kycicon.png')}
                        style={{ width: responsiveWidth(90), height: responsiveHeight(28), resizeMode: 'contain', alignSelf: 'center' }}
                      />
                      <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>Please complete your
                        KYC.</Text>
                      <TouchableOpacity style={{ width: responsiveWidth(30), height: responsiveHeight(5), backgroundColor: '#0043ae', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(1) }}
                        onPress={() => [navigation.navigate('Face detection'), setShowCamera(true), setFirstImage(true), setSuggestion(true), setIsModalVisible(false)]}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: responsiveFontSize(1.7) }}>Camera</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                  :
                  null
              }

              <Modal
                isVisible={kYCModal}

                animationIn="zoomIn"
                animationOut="zoomOut"
              >
                <View style={styles.modalContent}>
                  <Image
                    source={require('../../images/kycsuccess.png')}
                    style={{ width: responsiveWidth(90), height: responsiveHeight(20), resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>Your KYC has been</Text>
                  <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>successfully completed.</Text>
                  <Text style={{ color: '#0043ae', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>Thank you!</Text>
                </View>
              </Modal>
              {/* <Modal
                isVisible={faceModal}

                animationOut="zoomOut"
              >
                <View style={styles.modalContent}>
                  <Image
                    source={require('../../images/kycsuccess.png')}
                    style={{ width: responsiveWidth(90), height: responsiveHeight(20), resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>Face match detected!</Text>
                  <TouchableOpacity onPress={() => setFaceModal(!faceModal)}>
                    <Text style={{ color: '#0043ae', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>Thank you!</Text>
                  </TouchableOpacity>
                </View>
              </Modal> */}
              <Modal
                isVisible={faceNotModal}
                // onBackdropPress={toggleModal}
                animationIn="zoomIn"
                animationOut="zoomOut"
              >
                <View style={styles.modalContent}>
                  <Image
                    source={require('../../images/11.png')}
                    style={{ width: responsiveWidth(90), height: responsiveHeight(20), resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>Face does not match!</Text>
                  <Text style={{ color: '#0043ae', fontSize: responsiveFontSize(2), fontWeight: 'bold', marginTop: responsiveHeight(1) }}>Please try again.</Text>

                </View>
              </Modal>
              {modalVisible && (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 99,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    position: 'absolute',
                    flex: 1,
                  }}>

                </View>
              )}
              <Modal animationType="none" transparent={true} visible={modalVisible}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#0528A5" />
                </View>
              </Modal>
            </Root>
        }
      </SafeAreaView>
    </>

  );

};

export default Home;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
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
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
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
  heading: { fontWeight: '700', fontSize: 16 },
  heading_grey: { fontSize: 14, color: 'grey', fontWeight: '300' },
  add_txt: { fontSize: 14, color: '#efad37', fontWeight: '600' },
  view_txt: { color: '#702963', fontWeight: 'bold' },
  weekDay: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: Themes == 'dark' ? '#000' : '#000',
  },
  recent_log_box: {
    width: responsiveWidth(92),
    marginTop: 15,
    alignSelf: 'center',
    padding: 10,
    // borderWidth: 1,
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
    borderRadius: 150,
    width: 300,
    height: 300

  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '80%',
  },
  captureButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton: {
    fontSize: 14,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 20,
  },
  capturedImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  container1: {
    padding: 15,
    backgroundColor: '#fff', borderRadius: 15, marginHorizontal: 10
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 25,
    textAlign: 'center',
  },
  userId: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15, marginHorizontal: 10
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  changeButton: {
    backgroundColor: '#0F3E87',
    padding: 12,
    borderRadius: 5, marginHorizontal: 10,
    alignItems: 'center', marginBottom: 5
  },
  changeButtonText: {
    color: 'white',
    fontSize: 16,
  },

  cancelButton: {
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#0E0E64',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  strengthContainer: {
    marginTop: 5,
  },
  strengthBar: {
    height: 5,
    borderRadius: 2.5,
    width: '100%',
    backgroundColor: '#ccc',
  },
  weak: {
    backgroundColor: 'red',
    width: '33%',
  },
  medium: {
    backgroundColor: 'orange',
    width: '66%',
  },
  strong: {
    backgroundColor: 'green',
    width: '100%',
  },
  feedbackText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  validationText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});



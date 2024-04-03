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
  useColorScheme
} from 'react-native';
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import { getDistance } from 'geolib';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import useApi2 from '../../../api/useApi2';
import PullToRefresh from '../../reusable/PullToRefresh';
const { width } = Dimensions.get('window');
// import messaging from '@react-native-firebas e/messaging';
import Empty from '../../reusable/Empty';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import Themes from '../../Theme/Theme';


const Home = ({ navigation }) => {
  const theme = useColorScheme();

  const punchInApi = useApi2(attendence.punchIn);
  const punchOutApi = useApi2(attendence.punchOut);
  const todayAtendenceApi = useApi2(attendence.todayAttendence);
  const getActiveLocationApi = useApi2(attendence.getActiveLocation);

  const { setuser } = useContext(EssContext);
  const [news, setnews] = useState([]);
  const [user, setuser1] = useState(null);
  const [inTime, setinTime] = useState(null);
  const [outTime, setoutTime] = useState(null);
  const [punchIn, setpunchIn] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [training, settraining] = useState([]);
  const [announcements, setannouncements] = useState([]);
  const [fullTime, setfullTime] = useState(null);
  const [officetiming, setOfficeTiming] = useState('');
  const [show, setShow] = useState(true)
  // console.log("timing-----------------------------------------------", officetiming?.office_timing)
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
  var mon = ((d.getMonth() + 1) <= 9) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1);

  var day = (d.getDate() <= 9) ? ('0' + d.getDate()) : d.getDate();

  const datetime = d.getFullYear() + '-' + mon + '-' + day;
  const hours = d.getHours() + ":" + d.getMinutes();

  useEffect(() => {
    const getData = async () => {
      AsyncStorage.getItem('UserData').then(res => {
        setuser1(JSON.parse(res));
        setuser(JSON.parse(res));
        setOfficeTiming(JSON.parse(res))
      });
    };
    getData();
  }, []);

  useEffect(() => {
    if (getActiveLocationApi.data != null) {
      // console.log('getActiveLocationApi.data--->', getActiveLocationApi.data);
      let activeLocation = getActiveLocationApi.data.data.map(i => {
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

  // useEffect(() => {
  //   // Register listeners for incoming messages
  //   messaging().onMessage(async remoteMessage => {
  //     console.log(
  //       'Received a notification while app is in foreground:',
  //       remoteMessage,
  //     );
  //     // Display the notification in the app or handle it in some other way
  //   });

  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log(
  //       'Received a notification while app is in background:',
  //       remoteMessage,
  //     );
  //     // Display a notification in the system tray or the notification center
  //   });

  //   messaging().onNotificationOpenedApp(async remoteMessage => {
  //     console.log('User opened the app from a notification:', remoteMessage);
  //     navigation.jumpTo('Post');
  //   });
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getActiveLocation();
      check_punchIn();
      get_training();
      get_announcement();
      ProfileDetails();
    }, []),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    getActiveLocation();
    check_punchIn();
    get_training();
    get_announcement();
    get_news();
    get_month_logs();
  };

  const getActiveLocation = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const body = {};
    getActiveLocationApi.request(body, config);
  };

  const get_training = async () => {
    // setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/api/download`, body, config)
      .then(response => {
        // console.log('response', response.data);
        if (response.data.status == 1) {
          setloading(false);
          try {
            // console.log(response.data.content);
            settraining(response.data.content);
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
  };

  const get_announcement = async () => {
    // setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/api/announcement`, body, config)
      .then(response => {
        // console.log('response', response.data);
        if (response.data.status == 1) {
          setloading(false);
          try {
            // console.log(response.data.content);
            setannouncements(response.data.content);
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
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
      id: 6,
      name: 'Training',
      location: require('../../images/training.png'),
      moveTo: 'Training',
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
    settimerOn(false);
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    const UserLocation = await AsyncStorage.getItem('UserLocation');
    setuser(JSON.parse(userData));
    // setlocation(JSON.parse(UserLocation));
    const config = {
      headers: { Token: token },
    };
    get_recent_logs();
    const body = {};
    axios
      .post(`${apiUrl}/api/today_attendance`, body, config)
      .then(function (response) {
        setloading(false);
        if (response.data.status == 1) {
          const data = response.data.data;
          if (data.in_time != '' && data.out_location_id == null) {
            setpunchIn(true);
            setinTime(data.in_time);
            setlocationOut(data.out_location_id);
            settimerOn(true);
            setloading(false);
          } else {
            if (data.in_time != '' && data.out_location_id != '') {
              // after punch out
              setloading(false);
              setpunchIn(false);
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
          setlocationOut(null);
          setactivityTime(null);
        }
      })
      .catch(function (error) {
        console.log("some-------------", error);
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
        { text: 'OK', onPress: punch_out },
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
        console.log("distance=>", dis, user.userid, user.email)

        if (company_id == 56 || company_id == 89 || company_id == 92) {
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
          };
          console.log("body=>", body)
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
              console.log(error);
            });
        } else {
          //console.log('dis=-----',dis);
          if (lat == null || lat == '') {
            setloading(false);
            alert('Location not find');
            return;
          } else if (long == null || long == '') {
            setloading(false);
            alert('Location not find');
            return;
          } else if (
            activeLocation.latitude == null ||
            activeLocation.latitude == ''
          ) {
            setloading(false);
            alert('Please set active location');
            return;
          } else if (
            activeLocation.longitude == null ||
            activeLocation.longitude == ''
          ) {
            setloading(false);
            alert('Please set active location');
            return;
          }
          if (dis <= 4000) {
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
            };
            console.log("body=>", body)
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
                console.log(error);
              });
          } else {
            setloading(false);
            alert('You are not in the radius');
          }
        }
        get_recent_logs();

      })
      .catch(error => {
        setloading(false);
        const { code, message } = error;
        console.warn(code, message);
      });
  };

  // console.log("night.............",  (officetiming?.office_timing + `${d.getHours()}:${d.getMinutes()} AM`))


  const punch_in = async () => {

    // alert(officetiming?.office_timing + `${d.getHours()}:${d.getMinutes()} AM`);
    // if (`${d.getHours()}:${d.getMinutes()} AM` >= officetiming?.office_timing) {
    setloading(true);

    //console.log('sdvsdvgsfg---');
    // GetLocation.getCurrentPosition({})
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
        //alert('dsfsdf',long);
        console.log('loc1-->', location);
        console.log('loc2-->', lat);
        console.log('loc3-->', long);
        setcurrentLocation({
          long: long,
          lat: lat,
        });


        console.log('fasdfdf-', activeLocation.latitude);
        var dis = getDistance(
          { latitude: lat, longitude: long },
          {
            latitude: activeLocation.latitude,
            longitude: activeLocation.longitude,
          },
        );


        console.log('dis-->', dis);
        console.log(
          'act loc->',
          activeLocation.latitude,
          activeLocation.longitude,
        );
        console.log('curr loc->', lat, long);

        if (company_id == 56 || company_id == 89 || company_id == 92) {
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
          };

          //alert('asdFAsfasf-----', body);

          axios
            .post(`${apiUrl}/secondPhaseApi/mark_attendance_in`, body, config)
            .then(function (response) {
              //alert('punch in', response.data);
              if (response.data.status == 1) {
                check_punchIn();
              } else {
                alert(response.data.message);
                setloading(false);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {

          if (lat == null || lat == '') {
            setloading(false);
            alert('Location not find');
            return;
          } else if (long == null || long == '') {
            setloading(false);
            alert('Location not find');
            return;
          } else if (
            activeLocation.latitude == null ||
            activeLocation.latitude == ''
          ) {
            setloading(false);
            alert('Please set active location');
            return;
          } else if (
            activeLocation.longitude == null ||
            activeLocation.longitude == ''
          ) {
            setloading(false);
            alert('Please set active location');
            return;
          }

          if (dis <= 4000) {
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
            };
            console.log('logitute-----', body)
            axios
              .post(`${apiUrl}/secondPhaseApi/mark_attendance_in`, body, config)
              .then(function (response) {
                console.log('punch in', response.data);
                if (response.data.status == 1) {
                  check_punchIn();
                } else {
                  alert(response.data.message)
                  setloading(false);
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {

            setloading(false);
            alert('You are not in the radius');
          }
        }
        get_recent_logs();
      })
      .catch(error => {
        setloading(false);
        const { code, message } = error;
        //alert('fadsfsdaf');
        console.warn(code, message);
      });


    // } else {
    //   Alert.alert('At the moment, you do not have the eligibility to clock in.')
    // }
  };

  const renderItem = ({ item }) =>
    // console.log("A.......", item.id)
    // let x = item?.id;
    // console.log(x);
    item?.id === 0 ||
    item?.id === 6 || (
      <TouchableOpacity
        onPress={() =>
          item.id == 0
            ? navigation.navigate('Post', { screen: 'Post' })
            : navigation.navigate(item.moveTo)
        }>
        <ImageBackground
          style={styles.options1}
          source={item.location}
          imageStyle={{ borderRadius: 5 }}>
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
                alignSelf: "center",
              }}>
              {item.name}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  // for (let i = x; i < x; i++) {
  //   x += i + "<br>";
  //   console.log( "skipt data........",x)
  // }

  const navigateTo = item => {
    const url = item.download_video;
    let urlSplitArr = item.download_video.split('.');
    let extension = urlSplitArr[2];

    if (
      url.indexOf('pdf') !== -1 ||
      url.indexOf('doc') !== -1 ||
      url.indexOf('docx') !== -1 ||
      url.indexOf('jpg') !== -1 ||
      url.indexOf('jpeg') !== -1 ||
      url.indexOf('png') !== -1 ||
      url.indexOf('gif') !== -1
    ) {
      navigation.navigate('Doc Details', {
        type: 'pdf',
        photo: item.download_icon,
        title: item.title,
        long_description: item.description,
        url: item.download_video,
      });
    } else if (
      url.indexOf('mp4') !== -1 ||
      url.indexOf('avi') !== -1 ||
      url.indexOf('mov') !== -1 ||
      url.indexOf('wmv') !== -1 ||
      url.indexOf('flv') !== -1
    ) {
      navigation.navigate('Video', {
        type: 'video',
        thumbnail: item.download_icon,
        title: item.title,
        long_description: item.description,
        url: item.download_video,
        training: training.filter(item => {
          let urlSplitArr = item.download_video.split('.');
          let extension = urlSplitArr[2];
          return extension == 'mp4';
        }),
      });
    } else if (
      url.indexOf('youtube.com') !== -1 ||
      url.indexOf('youtu.be') !== -1
    ) {
      navigation.navigate('Doc Details', {
        type: 'youtube',
        photo: item.download_icon,
        title: item.title,
        long_description: item.description,
        url: item.download_video,
      });
    } else if (
      url.indexOf(
        'https://xoniertechnologies.com/ess_portal/assets/uploads/announcement/attacnment/0',
      ) !== -1
    ) {
      alert('file does not exist!');
    }
  };

  const announcementNavigate = item => {
    const url = item.attacnment;
    let urlSplitArr = item.attacnment.split('.');
    let extension = urlSplitArr[2];

    if (
      url.indexOf('pdf') !== -1 ||
      url.indexOf('doc') !== -1 ||
      url.indexOf('docx') !== -1 ||
      url.indexOf('jpg') !== -1 ||
      url.indexOf('jpeg') !== -1 ||
      url.indexOf('png') !== -1 ||
      url.indexOf('gif') !== -1
    ) {
      navigation.navigate('Doc Details', {
        type: 'pdf',
        photo: item.filename,
        title: item.title,
        short_description: item.short_description,
        long_description: item.long_description,
        url: item.attacnment,
      });
    } else if (
      url.indexOf('mp4') !== -1 ||
      url.indexOf('avi') !== -1 ||
      url.indexOf('mov') !== -1 ||
      url.indexOf('wmv') !== -1 ||
      url.indexOf('flv') !== -1
    ) {
      navigation.navigate('Video', {
        type: 'video',
        thumbnail: item.filename,
        title: item.title,
        short_description: item.short_description,
        long_description: item.long_description,
        url: item.attacnment,
        announcement: announcements.filter(item => {
          let urlSplitArr = item.attacnment.split('.');
          let extension = urlSplitArr[2];
          return extension == 'mp4';
        }),
      });
    } else if (
      url.indexOf('youtube.com') !== -1 ||
      url.indexOf('youtu.be') !== -1
    ) {
      navigation.navigate('Doc Details', {
        type: 'youtube',
        photo: item.filename,
        title: item.title,
        short_description: item.short_description,
        long_description: item.long_description,
        url: item.attacnment,
      });
    } else if (url.indexOf('uploads/announcement/attacnment/0') !== -1) {
      alert('file does not exist!');
    }
  };

  const renderTraining = ({ item }) => (
    <TouchableOpacity onPress={() => navigateTo(item)}>
      <ImageBackground
        style={styles.options1}
        source={{ uri: item.download_icon }}
        imageStyle={{ borderRadius: 5 }}>
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
              bottom: 10,
              left: 10,
              fontSize: 17,
              fontWeight: '600',
            }}>
            {item.title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderAnnouncements = ({ item }) => (
    <TouchableOpacity onPress={() => announcementNavigate(item)}>
      <ImageBackground
        style={styles.options}
        source={{ uri: item.filename }}
        imageStyle={{ borderRadius: 5 }}>
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
              bottom: 10,
              left: 5,
              right: 5,
              fontSize: 15,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {item.title.slice(0, 15)}..
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const ProfileDetails = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
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
            get_employee_detail();
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_news();
        // setUserdata({...Userdata, location: JSON.parse(location)});
      })();
    }, []),
  );

  const get_news = async () => {
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    // const u = JSON.parse(userData);

    setuser(JSON.parse(userData));
    // console.log('userData-->', u.userid);
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/api/newit`, {}, config)
      .then(response => {
        if (response.data.status == 1) {
          try {
            setloading(false);
            setnews(response.data.content);
          } catch (e) {
            setloading(false);
            console.log(e);
          }
        } else {
          setloading(false);

          console.log(response.data.msg);
        }
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
  };

  // Recent Login Data start
  const getAtendenceApi = useApi(attendence.getAttendance);


  const [locationStatus, setLocationStatus] = useState('');
  const [location, setlocation] = useState();
  const [recentLogs, setrecentLogs] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getActiveLocation();
      check_punchIn();
      get_recent_logs();

    }, []),
  );



  useEffect(() => {
    if (punchInApi.data != null) {
      // console.log('punchInApi.data--->', punchInApi.data);
      check_punchIn();
      alert(punchInApi.data.message);
    }
    get_recent_logs()
  }, [punchInApi.loading]);

  useEffect(() => {
    if (punchOutApi.data != null) {
      // console.log('punchOutApi.data--->', punchOutApi.data);
      check_punchIn();
      alert(punchOutApi.data.message);
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
  }, [timerOn,]);

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
        let activeLocation = getActiveLocationApi.data.data.map(i => {
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

  // console.log('activity timer-->', activityTime);
  // const get_recent_logs = async () => {
  //   const token = await AsyncStorage.getItem('Token');
  //   const config = {
  //     headers: { Token: token },
  //   };
  //   const date = new Date();
  //   // console.log('****', days[date.getDay()]);
  //   const body = {
  //     start_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 7
  //       }`,
  //     end_date: `${date.getFullYear()}-${date.getMonth() + 1
  //       }-${date.getDate()}`,
  //   };
  //   // console.log('body-->', body);
  //   getAtendenceApi?.request(body, config);

  // }

  const get_recent_logs = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const date = new Date('2022-12-08');
    console.log('****', days[date.getDay()]);
    const body = {
      start_date: `${startDate.getFullYear()}-${startDate.getMonth() + 1
        }-${startDate.getDate()}`,

      end_date: `${endDate.getFullYear()}-${endDate.getMonth() + 1
        }-${endDate.getDate()}`,
    };
    console.log("body=>", body)

    if (`${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}` > `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`) {
      setloading(false);
      alert('Till date should muast be greater than the From date ')
    } else {
      axios
        .post(`${apiUrl}/Api/attendance`, body, config)
        .then(response => {
          console.log('addtendance response......................................', response.data);
          if (response.data.status == 1) {
            setloading(false);

            try {
              setrecentLogs(response.data.content);
            } catch (e) {
              alert(e);
            }
          } else {
            setloading(false);
            setrecentLogs([]);
            alert('attendence not found');
          }
        })
        .catch(error => {
          setloading(false);
          alert(error);
        });
    }
  };

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
    console.log('body1mon----->', startOfWeek, endOfWeek);
    axios
      .post(`${apiUrl}/Api/attendance`, body, config)
      .then(response => {
        console.log('response', response.data);
        if (response.data.status == 1) {
          try {
            console.log(response.data.content);
            setrecentLogs(response.data.content);
          } catch (e) {
            alert(e);
          }
        } else {
          // alert(response.data.message);
        }
      })
      .catch(error => {
        alert(error);
      });
  };

  //Recent Login Data end

  // console.log("data--------------", getAtendenceApi?.data?.content)




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e3eefb' }}>
      <PullToRefresh onRefresh={handleRefresh}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between" }}>
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
                    ? { uri: Userdata.image }
                    : require('../../images/profile_pic.webp')
                }
              />
              <Text numberOfLines={1} style={[{ fontSize: 18, fontWeight: 'bold', marginLeft: 2 }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                Hi,{user?.FULL_NAME}!
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}
              style={{
              }}>
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
              keyExtractor={item => item.id}
            />
          </View>
          <View style={{ padding: 15, marginTop: 5 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[{ fontSize: 18, fontWeight: '700' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                E-Attendance
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Select Attendance')}>
                <Text style={[styles.purple_txt, { color: Themes == 'dark' ? '#000' : '#000' }]}>View History</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15, borderRadius: 15 }}>
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
                    borderColor: "#172B85"
                  }}>
                  <View
                    style={{
                      width: '35%',
                      // backgroundColor: 'pink',
                      borderRightWidth: 0.5,
                      borderRightColor: 'grey',
                      alignItems: 'center',
                    }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          color: 'grey',
                          fontSize: 15,
                          fontWeight: '500',
                        }}>
                        {days[d.getDay()]}
                      </Text>
                      <Text style={[{ fontSize: 18, fontWeight: '600' }, { color: Themes == 'dark' ? '#818181' : '#818181' }]}>
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
                          <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{activityTime}</Text>
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
                          {loading ? <ActivityIndicator color="white" /> : null}
                        </TouchableOpacity>
                      </>
                    )}

                    {!inTime && !locationOut && (
                      <TouchableOpacity
                        onPress={punch_in}
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
                        <Text style={{ color: 'red', marginTop: 10 }}>
                          Total time elapsed
                        </Text>
                      </>
                    )}
                  </View>
                </View>


              </View>
            </View>
          </View>

            <View style={{ marginTop: 10, marginHorizontal: 10 }}>
              <Text style={[{ fontSize: 18, fontWeight: '600' }, {color: Themes == 'dark' ? '#000' : '#000'}]}>Recent Logs</Text>
              {recentLogs
                ? recentLogs.map((i, index) => (
                  <View key={index} style={styles.recent_log_box}>
                    <View>
                      <Text style={styles.weekDay}>
                        {days[new Date(i.TR_DATE).getDay()]}
                      </Text>
                      <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>{i.TR_DATE}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <AntDesign
                        name="clockcircleo"
                        size={20}
                        style={[{ marginBottom: 5 }, {color: Themes == 'dark' ? '#000' : '#000'}]}
                      />
                      {
                        (datetime == i.TR_DATE && i.location_id != null) ?
                          <Text >{i.PRESENT_HOURS}</Text>
                          : (datetime > i.TR_DATE) ? <Text >{i.PRESENT_HOURS}</Text> : (hours >= '19:00') ? <Text>{i.PRESENT_HOURS}</Text> : <Text >NA</Text>
                      }
                      {/* <Text >{i.PRESENT_HOURS}</Text> */}
                    </View>
                  </View>
                ))
                :  <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>No found data</Text>
              }
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
    resizeMode: "contain",
    // marginRight: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 5
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
    borderRadius: 10
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
  heading: { fontWeight: '700', fontSize: 16 },
  heading_grey: { fontSize: 14, color: 'grey', fontWeight: '300' },
  add_txt: { fontSize: 14, color: '#efad37', fontWeight: '600' },
  view_txt: { color: '#702963', fontWeight: 'bold' },
  weekDay: { fontSize: 19, fontWeight: '600', marginBottom: 5, color: Themes == 'dark' ? '#000' : '#000' },
  recent_log_box: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: GlobalStyle.blueDark,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white', color: Themes == 'dark' ? '#000' : '#000'
  },
  emptyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 16, marginVertical: 10, fontWeight: '600', color: Themes == 'dark' ? '#000' : '#000' },
  display_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  heading: {
    fontSize: 17, fontWeight: '600', color: Themes == 'dark' ? '#000' : '#000'
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
});



import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../reusable/GlobalStyle';
// import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import GetLocation from 'react-native-get-location';
import {getDistance} from 'geolib';
import attendence from '../../../../api/attendence';
import useApi from '../../../../api/useApi';
import {EssContext} from '../../../../Context/EssContext';
import moment from 'moment';
import useApi2 from '../../../../api/useApi2';
import PullToRefresh from '../../../reusable/PullToRefresh';

const Attendence = () => {
  const punchInApi = useApi2(attendence.punchIn);
  const punchOutApi = useApi2(attendence.punchOut);
  const todayAtendenceApi = useApi(attendence.todayAttendence);
  const getAtendenceApi = useApi(attendence.getAttendance);
  const getActiveLocationApi = useApi(attendence.getActiveLocation);

  const [punchIn, setpunchIn] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  const [user, setuser] = useState();
  const [location, setlocation] = useState();
  const [loading, setloading] = useState(false);
  const [inTime, setinTime] = useState();
  const [recentLogs, setrecentLogs] = useState([]);

  const [currentLocation, setcurrentLocation] = useState({
    long: '',
    lat: '',
  });
  const [activityTime, setactivityTime] = useState(null);
  const [fullTime, setfullTime] = useState(null);
  const [timerOn, settimerOn] = useState(false);

  const [activeLocation, setactiveLocation] = useState({
    latitude: '',
    longitude: '',
    address: '',
    location_id: '',
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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

  useFocusEffect(
    React.useCallback(() => {
      getActiveLocation();
      check_punchIn();
      get_recent_logs();
    }, []),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    getActiveLocation();
    check_punchIn();
    get_recent_logs();
  };

  useEffect(() => {
    if (punchInApi.data != null) {
      // console.log('punchInApi.data--->', punchInApi.data);
      check_punchIn();
      alert(punchInApi.data.message);
    }
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

  const getActiveLocation = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    const body = {};
    getActiveLocationApi.request(body, config);
  };

  const check_punchIn = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    const UserLocation = await AsyncStorage.getItem('UserLocation');
    setuser(JSON.parse(userData));
    setlocation(JSON.parse(UserLocation));
    const config = {
      headers: {Token: token},
    };
    const body = {};
    todayAtendenceApi.request(body, config);
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
        {text: 'OK', onPress: punch_out},
      ],
      {cancelable: false},
    );
  };

  const punch_out = async () => {
    setloading(true);

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
        if (lat == null || lat == '') {
          setloading(false);
          // alert('Location not find');
          return;
        } else if (long == null || long == '') {
          setloading(false);
          // alert('Location not find');
          return;
        } else if (
          activeLocation.latitude == null ||
          activeLocation.latitude == ''
        ) {
          setloading(false);
          // alert('Please set active location');
          return;
        } else if (
          activeLocation.longitude == null ||
          activeLocation.longitude == ''
        ) {
          setloading(false);
          // alert('Please set active location');
          return;
        }
        var dis = getDistance(
          {latitude: lat, longitude: long},
          {
            latitude: activeLocation.latitude,
            longitude: activeLocation.longitude,
          },
        );
        if (dis) {
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
          console.log('bodyout-->', body);
          punchOutApi.request(body, config);
        } else {
          setloading(false);
          // alert('You are not in the radius');
        }
      })
      .catch(error => {
        setloading(false);
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  const punch_in = async () => {
    setloading(true);

    // GetLocation.getCurrentPosition({})

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
        if (lat == null || lat == '') {
          setloading(false);
          // alert('Location not find');
          return;
        } else if (long == null || long == '') {
          setloading(false);
          // alert('Location not find');
          return;
        } else if (
          activeLocation.latitude == null ||
          activeLocation.latitude == ''
        ) {
          setloading(false);
          // alert('Please set active location');
          return;
        } else if (
          activeLocation.longitude == null ||
          activeLocation.longitude == ''
        ) {
          setloading(false);
          // alert('Please set active location');
          return;
        }
        var dis = getDistance(
          {latitude: lat, longitude: long},
          {
            latitude: activeLocation.latitude,
            longitude: activeLocation.longitude,
          },
        );
        if (dis) {
          console.log('it is running');
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
          };
          console.log('bodyin-->', body);
          punchInApi.request(body, config);
        } else {
          setloading(false);
          // alert('You are not in the radius');
        }
      })
      .catch(error => {
        setloading(false);
        const {code, message} = error;
        console.warn(code, message);
      });
  };
  // console.log('activity timer-->', activityTime);
  const get_recent_logs = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    const date = new Date();
    // console.log('****', days[date.getDay()]);
    const body = {
      start_date: `${date.getFullYear()}-${date.getMonth() + 1}-${
        date.getDate() - 7
      }`,
      end_date: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`,
    };
    // console.log('body-->', body);
    getAtendenceApi.request(body, config);
  };

  // console.log('getAtendenceApi-->', getAtendenceApi.data);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: GlobalStyle.blueLight}}>
      <PullToRefresh onRefresh={handleRefresh}>
        <View style={{padding: 10}}>
          <View style={{backgroundColor: 'white', borderRadius: 5}}>
            <View
              style={{
                padding: 10,
                backgroundColor: GlobalStyle.blueDark,
                borderRadius: 5,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.tinyLogo}
                    source={
                      user?.image
                        ? {uri: user.image}
                        : require('../../../images/profile_pic.webp')
                    }
                  />
                  <View>
                    <Text
                      style={[
                        styles.profileFont,
                        {fontSize: 20, fontWeight: 'bold'},
                      ]}>
                      {user ? user.name : null}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <AntDesign
                        name="calendar"
                        size={17}
                        color="white"
                        style={{marginRight: 5}}
                      />
                      <Text style={styles.profileFont}>
                        {days[d.getDay()] +
                          ', ' +
                          d.getDate() +
                          ' ' +
                          monthNames[d.getMonth()]}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {punchIn ? (
            <View>
              <View
                style={{
                  marginTop: 20,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: GlobalStyle.blueDark,
                  backgroundColor: 'white',
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 21, fontWeight: '600'}}>
                  Activity in Progress
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: 3,
                  }}>
                  <Text>{activeLocation.address}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                    alignItems: 'center',
                  }}>
                  <Image
                    style={[
                      styles.tinyLogo,
                      {borderRadius: 0, width: 130, height: 130},
                    ]}
                    source={require('../../../images/punchInClock.gif')}
                  />
                  <View
                    style={{
                      alignItems: 'center',
                      padding: 20,
                      // backgroundColor: 'pink',
                    }}>
                    {activityTime ? (
                      <Text style={{fontSize: 25, fontWeight: 'bold'}}>
                        {activityTime}
                      </Text>
                    ) : (
                      <ActivityIndicator size="small" color="#388aeb" />
                    )}
                    <Text style={{color: 'red'}}>Time Elapsed</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={showAlert}
                // onPress={() => setpunchIn(false)}
                style={{
                  marginTop: 30,
                  backgroundColor: GlobalStyle.blueDark,
                  padding: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 15,
                    marginRight: 10,
                  }}>
                  Punch Out
                </Text>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : null}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {fullTime && (
                <View
                  style={{
                    marginTop: 20,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: GlobalStyle.blueDark,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 21, fontWeight: '600'}}>
                    Total Working Hours
                  </Text>
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 3,
                    }}>
                    <Text style={{textAlign: 'center'}}>
                      {activeLocation.address}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 15,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={[
                        styles.tinyLogo,
                        {borderRadius: 0, width: 130, height: 130},
                      ]}
                      source={require('../../../images/punchInClock.gif')}
                    />
                    <View
                      style={{
                        alignItems: 'center',
                        padding: 20,
                        // backgroundColor: 'pink',
                      }}>
                      {fullTime ? (
                        <Text style={{fontSize: 25, fontWeight: 'bold'}}>
                          {fullTime}
                        </Text>
                      ) : (
                        <ActivityIndicator size="small" color="#388aeb" />
                      )}
                      <Text style={{color: 'red'}}>Total time elapsed</Text>
                    </View>
                  </View>
                </View>
              )}
              <TouchableOpacity
                // onPress={() => setpunchIn(true)}
                onPress={punch_in}
                style={{
                  marginTop: 30,
                  backgroundColor: GlobalStyle.blueDark,
                  padding: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 15,
                    marginRight: 10,
                  }}>
                  Punch In
                </Text>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : null}
              </TouchableOpacity>
            </View>
          )}

          <View style={{marginTop: 15}}>
            <Text style={{fontSize: 18, fontWeight: '600'}}>Recent Logs</Text>
            {getAtendenceApi.data?.content?.map((i, index) => (
              <View key={index} style={styles.recent_log_box}>
                <View>
                  <Text style={styles.weekDay}>
                    {days[new Date(i.TR_DATE).getDay()]}
                  </Text>
                  <Text>{i.TR_DATE}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <AntDesign
                    name="clockcircleo"
                    size={20}
                    style={{marginBottom: 5}}
                  />
                  <Text>{i.PRESENT_HOURS}</Text>
                </View>
              </View>
            ))}
            {getAtendenceApi.data?.status == 0 && (
              <View
                style={{
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>No recent logs found!</Text>
              </View>
            )}
            {getAtendenceApi.loading && (
              <View style={styles.loader}>
                <ActivityIndicator size="small" color="#388aeb" />
              </View>
            )}
            {getAtendenceApi.error && alert(getAtendenceApi.error)}
          </View>
        </View>
      </PullToRefresh>
    </SafeAreaView>
  );
};

export default Attendence;

const styles = StyleSheet.create({
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
  weekDay: {fontSize: 19, fontWeight: '600', marginBottom: 5},
  recent_log_box: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: GlobalStyle.blueDark,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

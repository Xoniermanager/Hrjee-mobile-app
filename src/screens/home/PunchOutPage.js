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
  useEffect, createContext, useRef, Pressable
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import { Root, Popup } from 'popup-ui';
import { SocketContext } from '../../tracking/SocketContext';
import { getDistance } from 'geolib';
import useApi2 from '../../../api/useApi2';
import attendence from '../../../api/attendence';
import { EssContext } from '../../../Context/EssContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';


const PunchOutPage = () => {
  const navigation = useNavigation()
  const [loading, setloading] = useState(false);
  const { radius, } = useContext(SocketContext);
  const getActiveLocationApi = useApi2(attendence.getActiveLocation);
  const [activeLocation, setactiveLocation] = useState({
    latitude: '',
    longitude: '',
    location_id: '',
  });
  const [currentLocation, setcurrentLocation] = useState({
    long: '',
    lat: '',
  });
  const [user, setuser1] = useState(null);
  const { setuser, setIsPunchedOut, isPunchedOut } = useContext(EssContext);
  const [officetiming, setOfficeTiming] = useState('');

  const [logs, setLogs] = useState({
    user_id: '',
    employee_number: '',
    email: '',
    location_id: '',
    longitude: '',
    latitude: '',
    current_address: '',
  })

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

  const handlePopupCallback = () => {
    Popup.hide();
    setIsPunchedOut(true);
    setTimeout(() => {
      navigation.navigate('Main');
    }, 300);
  };

  useFocusEffect(
    React.useCallback(() => {
      getActiveLocation();
    }, []),
  );

  const getActiveLocation = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const body = {};
    getActiveLocationApi.request(body, config);
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
        const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
        const address = await axios.get(urlAddress)

        let activeLocation = null;
        getActiveLocationApi?.data?.data?.map(i => {
          if (i.active_status == 1) {
            setactiveLocation({
              latitude: i.latitude,
              longitude: i.longitude,
              address: i.address1,
              location_id: i.location_id,
            });

            activeLocation = {
              latitude: i.latitude,
              longitude: i.longitude,
              address: i.address1,
              location_id: i.location_id,
            }
          }
        });

        if (activeLocation) {
          setcurrentLocation({
            long: long,
            lat: lat,
          });
        } else {
          console.log('still no active location');
        }


        var dis = getDistance(
          { latitude: lat, longitude: long },
          {
            latitude: activeLocation.latitude,
            longitude: activeLocation.longitude,
          },
        );


        if (radius <= 0) {
          console.log("radius <= 0")
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
          console.log("punch out payload------------->", body)
          setLogs({
            user_id: user.userid,
            employee_number: user?.employee_number,
            email: user?.email,
            location_id: activeLocation.location_id,
            latitude: lat,
            longitude: long,
            address: address.data?.results[0]?.formatted_address
          })
          axios
            .post(`${apiUrl}/secondPhaseApi/mark_attendance_out`, body, config)
            .then(function (response) {
              if (response.data.status == 1) {
                Popup.show({
                  type: 'Success',
                  title: 'Success',
                  button: true,
                  textBody: response.data.message,
                  buttonText: 'Ok',
                  callback: handlePopupCallback
                });
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
                    LogsMaintane(error.response.data.msg),
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
          console.log("radius <= 0")
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
            setLogs({
              user_id: user.userid,
              employee_number: user?.employee_number,
              email: user?.email,
              location_id: activeLocation.location_id,
              latitude: lat,
              longitude: long,
              address: address.data?.results[0]?.formatted_address
            })
            axios
              .post(`${apiUrl}/secondPhaseApi/mark_attendance_out`, body, config)
              .then(function (response) {
                if (response.data.status == 1) {
                  Popup.show({
                    type: 'Success',
                    title: 'Success',
                    button: true,
                    textBody: response.data.message,
                    buttonText: 'Ok',
                    callback: () => [Popup.hide(),]
                  });
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
                      LogsMaintane(error.response.data.msg),
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
                callback: () => [Popup.hide(), LogsMaintane('Location not find'), setShowKyc(false)],
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
                callback: () => [Popup.hide(), LogsMaintane('Location not find'), setShowKyc(false)],
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
                callback: () => [Popup.hide(), LogsMaintane('Please set active location'), setShowKyc(false)],
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
                callback: () => [Popup.hide(), LogsMaintane('Please set active location'), setShowKyc(false)],
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
                    Popup.show({
                      type: 'Success',
                      title: 'Success',
                      button: true,
                      textBody: response.data.message,
                      buttonText: 'Ok',
                      callback: () => [Popup.hide()]
                    });
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
                        LogsMaintane(error.response.data.msg),
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
                callback: () => [Popup.hide(), LogsMaintane('You are not in the radius'), setShowKyc(false)],
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
              callback: () => [Popup.hide(), LogsMaintane('Location not find'), setShowKyc(false)],
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
              callback: () => [Popup.hide(), LogsMaintane('Location not find'), setShowKyc(false)],
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
              callback: () => [Popup.hide(), LogsMaintane('Please set active location'), setShowKyc(false)],
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
              callback: () => [Popup.hide(), LogsMaintane('Please set active location'), setShowKyc(false)],
            });
            setloading(false);
            setDisabledBtn(false)
            return;
          }

          // if (radius <= 0) {
          //   const token = await AsyncStorage.getItem('Token');
          //   const userData = await AsyncStorage.getItem('UserData');
          //   const userInfo = JSON.parse(userData);

          //   const config = {
          //     headers: { Token: token },
          //   };
          //   const body = {
          //     email: userInfo.email,
          //     location_id: activeLocation.location_id,
          //     latitude: lat,
          //     longitude: long,
          //     login_type: 'mobile',
          //     current_address: address.data?.results[0].formatted_address,
          //   };
          //   axios
          //     .post(
          //       `${apiUrl}/secondPhaseApi/mark_attendance_in`,
          //       body,
          //       config,
          //     )
          //     .then(function (response) {
          //       if (response.data.status == 1) {
          //         check_punchIn();
          //         setloading(false);
          //         setDisabledBtn(false)
          //         get_month_logs()
          //       } else {
          //         Popup.show({
          //           type: 'Warning',
          //           title: 'Warning',
          //           button: true,
          //           textBody: response.data.message,
          //           buttonText: 'Ok',
          //           callback: () => [Popup.hide(), setShowKyc(false)],
          //         });

          //         setloading(false);
          //         setDisabledBtn(false)
          //       }
          //     })
          //     .catch(function (error) {
          //       setloading(false);
          //       setDisabledBtn(false)
          //       if (error.response.status == '401') {
          //         Popup.show({
          //           type: 'Warning',
          //           title: 'Warning',
          //           button: true,
          //           textBody: error.response.data.msg,
          //           buttonText: 'Ok',
          //           callback: () => [
          //             AsyncStorage.removeItem('Token'),
          //             AsyncStorage.removeItem('UserData'),
          //             AsyncStorage.removeItem('UserLocation'),
          //             navigation.navigate('Login'),
          //           ],
          //         });
          //       }
          //     });
          // }
          // else if (radius > 0) {
          //   if (radius >= dis) {
          //     const token = await AsyncStorage.getItem('Token');
          //     const userData = await AsyncStorage.getItem('UserData');
          //     const userInfo = JSON.parse(userData);

          //     const config = {
          //       headers: { Token: token },
          //     };
          //     const body = {
          //       email: userInfo.email,
          //       location_id: activeLocation.location_id,
          //       latitude: lat,
          //       longitude: long,
          //       login_type: 'mobile',
          //       current_address: address.data?.results[0].formatted_address,
          //     };
          //     axios
          //       .post(
          //         `${apiUrl}/secondPhaseApi/mark_attendance_in`,
          //         body,
          //         config,
          //       )
          //       .then(function (response) {
          //         if (response.data.status == 1) {
          //           check_punchIn();
          //           setloading(false);
          //           setDisabledBtn(false)
          //           get_month_logs()
          //         } else {
          //           Popup.show({
          //             type: 'Warning',
          //             title: 'Warning',
          //             button: true,
          //             textBody: response.data.message,
          //             buttonText: 'Ok',
          //             callback: () => [Popup.hide(), setShowKyc(false)],
          //           });

          //           setloading(false);
          //           setDisabledBtn(false)
          //         }
          //       })
          //       .catch(function (error) {
          //         setloading(false);
          //         setDisabledBtn(false)
          //         if (error.response.status == '401') {
          //           Popup.show({
          //             type: 'Warning',
          //             title: 'Warning',
          //             button: true,
          //             textBody: error.response.data.msg,
          //             buttonText: 'Ok',
          //             callback: () => [
          //               AsyncStorage.removeItem('Token'),
          //               AsyncStorage.removeItem('UserData'),
          //               AsyncStorage.removeItem('UserLocation'),
          //               navigation.navigate('Login'),
          //             ],
          //           });
          //         }
          //       });
          //   } else {
          //     Popup.show({
          //       type: 'Warning',
          //       title: 'Warning',
          //       button: true,
          //       textBody: 'You are not in the radius',
          //       buttonText: 'Ok',
          //       callback: () => [Popup.hide(), setShowKyc(false)],
          //     });
          //     setloading(false);
          //     setDisabledBtn(false)
          //   }
          // }
          // else {
          //   if (lat == null || lat == '') {
          //     Popup.show({
          //       type: 'Warning',
          //       title: 'Warning',
          //       button: true,
          //       textBody: 'Location not find',
          //       buttonText: 'Ok',
          //       callback: () => [Popup.hide(), setShowKyc(false)],
          //     });

          //     setloading(false);
          //     setDisabledBtn(false)
          //     return;
          //   } else if (long == null || long == '') {
          //     Popup.show({
          //       type: 'Warning',
          //       title: 'Warning',
          //       button: true,
          //       textBody: 'Location not find',
          //       buttonText: 'Ok',
          //       callback: () => [Popup.hide(), setShowKyc(false)],
          //     });
          //     setloading(false);
          //     setDisabledBtn(false)
          //     return;
          //   } else if (
          //     activeLocation.latitude == null ||
          //     activeLocation.latitude == ''
          //   ) {
          //     Popup.show({
          //       type: 'Warning',
          //       title: 'Warning',
          //       button: true,
          //       textBody: 'Please set active location',
          //       buttonText: 'Ok',
          //       callback: () => [Popup.hide(), setShowKyc(false)],
          //     });
          //     setloading(false);
          //     setDisabledBtn(false)
          //     return;
          //   } else if (
          //     activeLocation.longitude == null ||
          //     activeLocation.longitude == ''
          //   ) {
          //     Popup.show({
          //       type: 'Warning',
          //       title: 'Warning',
          //       button: true,
          //       textBody: 'Please set active location',
          //       buttonText: 'Ok',
          //       callback: () => [Popup.hide(), setShowKyc(false)],
          //     });
          //     setloading(false);
          //     setDisabledBtn(false)
          //     return;
          //   }

          //   if (radius >= dis) {
          //     const token = await AsyncStorage.getItem('Token');
          //     const userData = await AsyncStorage.getItem('UserData');
          //     const userInfo = JSON.parse(userData);

          //     const config = {
          //       headers: { Token: token },
          //     };
          //     const body = {
          //       email: userInfo.email,
          //       location_id: activeLocation.location_id,
          //       latitude: lat,
          //       longitude: long,
          //       login_type: 'mobile',
          //       current_address: address.data?.results[0].formatted_address,
          //     };
          //     axios
          //       .post(
          //         `${apiUrl}/secondPhaseApi/mark_attendance_in`,
          //         body,
          //         config,
          //       )
          //       .then(function (response) {
          //         if (response.data.status == 1) {
          //           check_punchIn();
          //           setloading(false);
          //           setDisabledBtn(false)
          //           get_month_logs()
          //         } else {
          //           Popup.show({
          //             type: 'Warning',
          //             title: 'Warning',
          //             button: true,
          //             textBody: response.data.message,
          //             buttonText: 'Ok',
          //             callback: () => [Popup.hide(), setShowKyc(false)],
          //           });

          //           setloading(false);
          //           setDisabledBtn(false)
          //         }
          //       })
          //       .catch(function (error) {
          //         setloading(false);
          //         setDisabledBtn(false)
          //         if (error.response.status == '401') {
          //           Popup.show({
          //             type: 'Warning',
          //             title: 'Warning',
          //             button: true,
          //             textBody: error.response.data.msg,
          //             buttonText: 'Ok',
          //             callback: () => [
          //               AsyncStorage.removeItem('Token'),
          //               AsyncStorage.removeItem('UserData'),
          //               AsyncStorage.removeItem('UserLocation'),
          //               navigation.navigate('Login'),
          //             ],
          //           });
          //         }
          //       });
          //   } else {
          //     Popup.show({
          //       type: 'Warning',
          //       title: 'Warning',
          //       button: true,
          //       textBody: 'You are not in the radius',
          //       buttonText: 'Ok',
          //       callback: () => [Popup.hide(), setShowKyc(false)],
          //     });

          //     setloading(false);
          //     setDisabledBtn(false)
          //   }
          // }
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
          callback: () => [Popup.hide(), LogsMaintane(message)],
        });
      });
  };

  const LogsMaintane = async (mes) => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const payload = {
      reason: mes,
      url: `${apiUrl}/secondPhaseApi/mark_attendance_out`,
      payload: {
        user_id: logs?.user_id,
        employee_number: logs.employee_number,
        email: logs.email,
        location_id: logs.location_id,
        latitude: logs?.lat,
        longitude: logs?.long,
        current_address: logs?.current_address,
      }
    };
    console.log(payload, "202")
    axios
      .post(`${apiUrl}/SecondPhaseApi/save_log`, payload, config)
      .then(response => {
        console.log("res================", response.data)
      })
      .catch(error => {
        console.log(error)
      });
  }



  return (
    <>
      <Root>
        <TouchableOpacity style={{ backgroundColor: "#e3eefb", }} onPress={() => setIsPunchedOut(true)}>
          <AntDesign
            name="close"
            size={22}
            color="red"

            style={{ alignSelf: "flex-end", marginRight: 20, marginTop: 10 }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, backgroundColor: "#e3eefb", justifyContent: "center", }}>
          <View style={{ alignSelf: "center", alignItems: "center" }}>
            <Text style={{ textAlign: "center", color: "#172B85", fontWeight: "500", fontSize: 15, marginBottom: 15 }}>Click on the button to make your attendance</Text>
            {/* Outer Circle */}
            <View style={styles.outerCircle}>
              {/* Middle Circle */}
              <View style={styles.middleCircle}>
                {/* Inner Circle with Gradient */}
                <TouchableOpacity onPress={showAlert}
                >
                  <LinearGradient
                    colors={['#022190', '#022190', '#072BAF']} // Gradient colors
                    style={styles.innerCircle}
                  >
                    <Text style={styles.buttonTextPUnchInPopup}>Punch Out</Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </View>
      </Root>

    </>
  )
}

export default PunchOutPage

const styles = StyleSheet.create({
  containerpunchinmodal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0052CC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  outerCircle: {
    width: responsiveWidth(90),
    height: responsiveWidth(90),
    borderRadius: responsiveHeight(100),
    backgroundColor: '#D3D3D3', // Light gray (Outermost border)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  middleCircle: {
    width: responsiveWidth(85),
    height: responsiveWidth(85),
    borderRadius: responsiveHeight(100),
    backgroundColor: '#FFFFFF', // White (Second border)
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: responsiveHeight(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextPUnchInPopup: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for the button
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
})


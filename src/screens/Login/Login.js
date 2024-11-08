import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  useColorScheme, Linking, Platform, Alert, StatusBar
} from 'react-native';
import { Root, Popup } from 'popup-ui'
import React, { useState, useContext, useEffect, createContext } from 'react';
import GlobalStyle from '../../reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import { EssContext } from '../../../Context/EssContext';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Themes from '../../Theme/Theme';
import { useNavigation } from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import messaging from '@react-native-firebase/messaging';
import CheckBox from 'react-native-check-box';



const Login = ({ children }) => {
  const theme = useColorScheme();
  const navigation = useNavigation()
  const { setuser, setlocation } = useContext(EssContext);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setloading] = useState(false);
  const [fcmtoken, setfcmtoken] = useState();
  const [addrequest, setAddRequest] = useState();
  const [locationtracking, setLocationTracking] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);

  };

  const toggleShowPassword = ({ children }) => {
    setShowPassword(!showPassword);
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFCMToken()
    }
  }

  async function getFCMToken() {
    // console.log("yashu")
    const token = await messaging().getToken();
    // console.log(token, 'fcm token');
    setfcmtoken(token);
  }

  useEffect(() => {
    requestUserPermission();
  }, [])



  const login = () => {

    // console.log("isChecked......", isChecked)

    if (email.trim() === '' || password.trim() === '') {

      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Please enter employee/email and password',
        buttonText: 'Ok',
        callback: () => [Popup.hide(),],
      });
    } else if (password.length < 6) {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Password must be at least 6 characters',
        buttonText: 'Ok',
        callback: () => [Popup.hide(),],
      });
    }
    else if (isChecked == false) {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Please checked Terms and Condition',
        buttonText: 'Ok',
        callback: () => [Popup.hide(),],
      });
      return;
    }
    else {
      setDisabledBtn(true)
      setloading(true);
      axios
        .post(`${apiUrl}/users/login`, {
          email: email,
          password: password,
          device_id: fcmtoken,
        })
        .then(response => {
          if (response?.data?.status == 1) {
            if (response?.data?.data?.login_type === 'web') {
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'You are not authorized to use mobile application. Kindly contact admin!',
                buttonText: 'Ok',
                callback: () => [Popup.hide(),],
              });
              setloading(false);
              setDisabledBtn(false)
            }
            else if (response?.data?.data?.login_type === null) {
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'You are not authorized to use mobile application. Kindly contact admin!',
                buttonText: 'Ok',
                callback: () => [Popup.hide(),],
              });
              // alert('You are not authorized to use mobile application. Kindly contact admin!')
              setloading(false);
              setDisabledBtn(false)
            }
            else if (response?.data?.data?.block == 1) {
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'You are not authorized to use mobile application. Kindly contact admin!',
                buttonText: 'Ok',
                callback: () => [Popup.hide(),],
              });
              // alert('You have been blocked, Please contact your admin department!')
              setloading(false);
              setDisabledBtn(false)
            }
            else {
              try {
                setloading(false);
                setDisabledBtn(false)
                AsyncStorage.setItem('Token', response.data.token);
                AsyncStorage.setItem(
                  'UserData',
                  JSON.stringify(response.data.data),
                );
                setuser(response.data.data);
                const filteredData = response?.data?.menu_access?.filter(item => item.menu_name == "Address Request");
                // setLiveTrackingPermission(response?.data?.menu_access?.filter(item => item.menu_name == "Location Tracking"));

                AsyncStorage.setItem(
                  'UserLocation',
                  JSON.stringify(response.data.location),
                );
                setlocation(response.data.location);
                // AsyncStorage.setItem(
                //   'PRMData', (response.data.data?.prm_assign),
                // );
                let options = []
                response?.data?.menu_access?.map((item) => {
                  if (item.menu_name.includes("News Management")) {

                    options.push({
                      id: 2,
                      name: 'News',
                      location: require('../../images/news.png'),
                      moveTo: 'News',
                    })
                  } else if (item.menu_name.includes("Training Management")) {

                    options.push({
                      id: 6,
                      name: 'Training',
                      location: require('../../images/training.png'),
                      moveTo: 'Training',
                    })
                  }
                  return item;
                })

                setAddRequest(filteredData);
                AsyncStorage.setItem(
                  'AddRequest', JSON.stringify(filteredData[0]?.menu_name),
                );
                // AsyncStorage.setItem(
                //   'LOCATIONTRACKING', JSON.stringify(filteredDataLocationAccess),
                // );
                AsyncStorage.setItem(
                  'menu', JSON.stringify(options),
                );
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
              } catch (e) {
                setloading(false);
                alert(e);
              }
            }

          } else {
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'Please enter correct credentials!',
              buttonText: 'Ok',
              callback: () => [Popup.hide(),],
            });
            // alert('Please enter correct credentials');
            setloading(false);
            setDisabledBtn(false)
          }
        })
        .catch(error => {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.message,
            buttonText: 'Ok',
            callback: () => [Popup.hide()]
          })

          setloading(false)
          setDisabledBtn(false)
        });
    }

  };





  const phoneNumber = '8989777878';

  const openPdf = () => {
    navigation.navigate('PdfViewer', {
      url: 'https://hrjee.com/assets/img/terms_conditions_hrjee.pdf',
    });
  };


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#e3eefb" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e3eefb' }}>
      <Root>

        <ScrollView>

          <Image
            style={{
              alignSelf: 'center',
              marginTop: 30,
              height: responsiveHeight(25), width: responsiveWidth(45), resizeMode: "contain"
            }}
            source={require('../../images/logo.png')}
          />
          <Text style={{
            textAlign: 'center',
            color: '#000',
            fontSize: responsiveFontSize(3),
            fontWeight: '600',
            marginTop: 10,
          }}>
            Login to your Account
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Employee Email/Id</Text>

            <View style={{
              width: responsiveWidth(79),
              borderRadius: 20,
              alignSelf: 'center',
              backgroundColor: '#fff',
              marginTop: 7,
              padding: Platform.OS === 'ios' ? 12 : 2,
              color: '#000',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <TextInput
                style={styles.input}
                placeholder="username@gmail.com"
                placeholderTextColor={theme == 'dark' ? '#8e8e8e' : '#8e8e8e'}
                onChangeText={text => setemail(text.toLowerCase())}
              />
              <Image
                source={require('../../images/user.png')}
                style={{ width: 25, height: 25, marginRight: 10 }}
              />
            </View>
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Password</Text>
            <View style={{
              width: responsiveWidth(79),
              borderRadius: 20,
              alignSelf: 'center',
              backgroundColor: '#fff',
              marginTop: 7,
              padding: Platform.OS === 'ios' ? 12 : 2,
              color: '#000',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                placeholder="**********"
                placeholderTextColor={theme == 'dark' ? '#8e8e8e' : '#8e8e8e'}
                onChangeText={text => setpassword(text.toLowerCase())}
              />
              <MaterialCommunityIcons
                name={!showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#000"
                style={{ alignSelf: 'center' }}
                onPress={toggleShowPassword}
              />
            </View>
          </View>
          <View style={{ marginLeft: 40, flexDirection: "row", width: "100%", alignItems: "center", marginTop: 10 }}>
            <CheckBox
              isChecked={isChecked}
              onClick={handleCheckboxChange}
              checkBoxColor="#000" />
            <TouchableOpacity onPress={openPdf}>
              <Text style={{ marginLeft: 5, color: "#000", fontSize: 12 }}>Terms and Condition</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.btn_style]} onPress={() => login()} disabled={disabledBtn == true ? true : false}>

            {loading ? <ActivityIndicator size={'small'} color={"#fff"} /> : <Text
              style={{
                color: '#fff',
                fontSize: responsiveFontSize(2.1),
                fontWeight: '500',
              }}>
              Login
            </Text>}
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Forgot Password')}>
              <Text style={styles.text}>Forgot Password?</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
                <Text style={styles.text}>Contact HR for any login issue</Text>
              </TouchableOpacity> */}
          </View>
        </ScrollView>
        </Root>

      </SafeAreaView>
    </>

  );




};

export default Login;

const styles = StyleSheet.create({
  text: {
    fontSize: responsiveFontSize(1.5), marginRight: 50,
    textAlign: 'right',
    fontWeight: '400',
    color: '#000',
    textDecorationLine: 'underline', color: Themes == 'dark' ? '#000' : '#000'
  },
  tinyLogo: {
    width: 45,
    height: 45,
    marginRight: 0,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'contain',
  },
  input_title: {
    color: '#000',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '400',
    marginHorizontal: 40,
    marginTop: 10,
  },
  input_top_margin: { marginTop: 20 },
  input: {
    width: responsiveWidth(68),
    color: Themes == 'dark' ? '#000' : '#000',
  },
  btn_style: {
    width: responsiveWidth(79),
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#0433DA',
    marginTop: responsiveHeight(5),
    height: responsiveHeight(6.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

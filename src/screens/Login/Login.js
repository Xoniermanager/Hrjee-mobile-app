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
  useColorScheme, Linking, Platform, Alert
} from 'react-native';
import { Root, Popup } from 'popup-ui'
import React, { useState, useContext, useEffect } from 'react';
import GlobalStyle from '../../reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import { EssContext } from '../../../Context/EssContext';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Themes from '../../Theme/Theme';
import { useNavigation } from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import messaging from '@react-native-firebase/messaging';
const Login = () => {
  const theme = useColorScheme();
  const navigation = useNavigation()
  const { setuser, setlocation } = useContext(EssContext);

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setloading] = useState(false);
  const [fcmtoken, setfcmtoken] = useState();
  const [addrequest, setAddRequest] = useState();
  const [showPassword, setShowPassword] = useState(false);


  const toggleShowPassword = () => {
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
    const token = await messaging().getToken();
    console.log(token,'fcm token');
    setfcmtoken(token);
  }

useEffect(()=>{
  requestUserPermission();
},[])

  const login = () => {
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
    else {
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
            }

            else {
              try {
                setloading(false);
                  
                AsyncStorage.setItem('Token', response.data.token);
                AsyncStorage.setItem(
                  'UserData',
                  JSON.stringify(response.data.data),
                );
                setuser(response.data.data);
                AsyncStorage.setItem(
                  'UserLocation',
                  JSON.stringify(response.data.location),
                );
                setlocation(response.data.location);
                AsyncStorage.setItem(
                  'PRMData', (response.data.data?.prm_assign),
                );
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
                });

                const filteredData = response?.data?.menu_access?.filter(item => item.menu_name == "Address Request");
                  setAddRequest(filteredData);

                  AsyncStorage.setItem(
                    'AddRequest', JSON.stringify(filteredData[0]?.menu_name),
                  );
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
        });
    }

  };





  const phoneNumber = '8989777878';
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Root>
        <ScrollView>
          <View style={{ padding: 30 }}>
            <View style={{ marginTop: 5 }}>
              {/* <Text style={{fontSize: 22, fontWeight: '700'}}>Sign In</Text>
            <Text style={{fontSize: 14, marginTop: 5}}>
              Hi there! Nice to see you again.
            </Text> */}
              <Image
                style={{
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  height: responsiveHeight(35),
                  width: responsiveWidth(55),
                  marginTop: responsiveHeight(0)

                }}
                source={require('../../images/logo.png')}
              />

              <View style={styles.input_top_margin}>
                <Text style={styles.input_title}>Employee Email/Id</Text>
                <View style={{
                  flexDirection: "row", borderBottomWidth: 1,
                  justifyContent: "space-between"
                }}>
                  <TextInput
                    style={styles.input}
                    placeholder="username@gmail.com"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    onChangeText={text => setemail(text.toLowerCase())}
                  />

                </View>

              </View>
              <View style={styles.input_top_margin}>
                <Text style={styles.input_title}>Password</Text>
                <View style={{
                  flexDirection: "row", borderBottomWidth: 1,
                  justifyContent: "space-between"
                }}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    placeholder="**********"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
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
              <TouchableOpacity style={[styles.btn_style]} onPress={() => login()}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 15,
                    marginRight: 10,
                  }}>
                  Login
                </Text>
                {loading ? <ActivityIndicator size={'large'} color={"#fff"} /> : null}
              </TouchableOpacity>
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Forgot Password')}>
                  <Text style={styles.text}>Forgot Password?</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
                <Text style={styles.text}>Contact HR for any login issue</Text>
              </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </ScrollView>
      </Root>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  text: {
    fontSize: 13, marginTop: 10, color: Themes == 'dark' ? '#000' : '#000'
  },
  tinyLogo: {
    width: 45,
    height: 45,
    marginRight: 0,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'contain',
  },
  input_title: { marginBottom: 3, fontSize: 18, fontWeight: '600', color: "#000" },
  input_top_margin: { marginTop: 20 },
  input: {
    height: 50,
    backgroundColor: 'white',
    padding: 10,
    borderBottomColor: 'grey',
    color: Themes == 'dark' ? '#000' : '#000',
    flex: 1
  },
  btn_style: {
    width: '100%',
    marginTop: 30,
    backgroundColor: GlobalStyle.blueDark,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

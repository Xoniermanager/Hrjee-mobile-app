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
import React, { useState, useContext, useEffect } from 'react';
import GlobalStyle from '../../reusable/GlobalStyle';
// import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import { EssContext } from '../../../Context/EssContext';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Themes from '../../Theme/Theme';
import { useNavigation } from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import messaging from '@react-native-firebase/messaging';

const Login = () => {
  const theme = useColorScheme();
  const navigation = useNavigation()
  const { setuser, setlocation } = useContext(EssContext);

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setloading] = useState(false);
  const [fcmtoken, setfcmtoken] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const login = () => {
    setloading(true);
    axios
      .post(`${apiUrl}/users/login`, {
        email: email,
        password: password,
        device_id: fcmtoken,
      })
      .then(response => {
        console.log(response?.data, 'lfknjkll')
        if (response?.data?.status == 1) {
          if (response?.data?.data?.login_type === 'web') {
            alert('You are not authorized to use mobile application. Kindly contact admin!')
            setloading(false);
          }
          else if (response?.data?.data?.block == 1) {
            alert('You have been blocked, Please contact your admin department!')
            setloading(false);
          }
          else {
            try {
              setloading(false);
              // console.log('token####>', response.data.token);
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
                  console.log("news is ")
                  options.push({
                    id: 2,
                    name: 'News',
                    location: require('../../images/news.png'),
                    moveTo: 'News',
                  })
                } else if (item.menu_name.includes("Training Management")) {
                  console.log("training is ")
                  options.push({
                    id: 6,
                    name: 'Training',
                    location: require('../../images/training.png'),
                    moveTo: 'Training',
                  })
                }
                return item;
              });
              // console.log(options,'option')
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
          alert('Please enter correct credentials');
          setloading(false);
        }
      })
      .catch(error => {
        alert(error.response.data.message);
        setloading(false)
      });
  };

  // async function getFCMToken() {
  //   const token = await messaging().getToken();
  //   // console.log(token);
  //   setfcmtoken(token);
  // }

  // getFCMToken();



  const phoneNumber = '8989777878';
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
              <Text style={styles.input_title}>Employee Id</Text>
              <View style={{
                flexDirection: "row", borderBottomWidth: 1,
                justifyContent: "space-between"
              }}>
                <TextInput
                  style={styles.input}
                  placeholder="xyz@gmail.com"
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
                Sign In
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

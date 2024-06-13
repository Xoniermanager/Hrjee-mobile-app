import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TextInput,
    ScrollView,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import Entypo from 'react-native-vector-icons/Entypo';
  import GlobalStyle from '../../reusable/GlobalStyle';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import apiUrl from '../../reusable/apiUrl';
  import axios from 'axios';
  import { useNavigation } from '@react-navigation/native';
  import { Root, Popup } from 'popup-ui'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
  
  const ResetPassword = ({route}) => {
  const navigation=useNavigation()
  const [resendloader, setResendLoader] = useState(false);
  const [loader,setLoader]=useState(false)
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [otp,setOTP]=useState('')
  const [loading, setloading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const {email}=route.params;
  console.log(email,'email')
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
 
    const reset_Password=async()=>{
        setLoader(true)
        const data={
            email:email,
            new_password:password,
            otp:otp
          }
        const token = await AsyncStorage.getItem('Token');
        if (password.trim() === '' || confirmPassword.trim() === '' || otp.trim()=== '') {
            setLoader(false)
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'Password and OTP Fields are mendatory ',
              buttonText: 'Ok',
              callback: () => [Popup.hide(),],
            });
          
        }
        else if (password!=confirmPassword){
            setLoader(false)

            Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'Password Mismatched',
                buttonText: 'Ok',
                callback: () => [Popup.hide(),],
              });
        }
        else {
            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url:'https://app.hrjee.com/users/change_password',
              headers: { 
                'Content-Type': 'application/json', 
                'Cookie': 'ci_session=ngc399claf516efh767kho1ldnmsf952'
              },
              data : data
            };
            
            axios.request(config)
            .then((response) => {
              if (response.data.status== 1) {
                setLoader(false)
                Popup.show({
                  type: 'Success',
                  title: 'Success',
                  button: true,
                  textBody:response.data.message,
                  buttonText: 'Ok',
                  callback: () => [Popup.hide(), navigation.navigate('Login')]
                })
              }
              else if (response.data.status== 0){
                setloading(false)
                setLoader(false)

                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody:response.data.message,
                  buttonText: 'Ok',
                  callback: () => [Popup.hide(),]
                })
              }
             
            })
            .catch((error) => {
                setLoader(false)

              console.log(error);
               Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody:error.response.data.message,
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()]
                })
                console.log(error)
                setloading(false)
            });
        }
    }
    const resendOTP=async()=>{
        setResendLoader(true)
        const data={
            email:email,
          }
            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url:'https://app.hrjee.com/users/forgot_password',
              headers: { 
                'Content-Type': 'application/json', 
                'Cookie': 'ci_session=ngc399claf516efh767kho1ldnmsf952'
              },
              data : data
            };
            
            axios.request(config)
            .then((response) => {
                setResendLoader(false)
              if (response.data.status== 1) {
                Popup.show({
                  type: 'Success',
                  title: 'Success',
                  button: true,
                  textBody:response.data.message,
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()]
                })
              }
              else if (response.data.status== 0){
                setloading(false)
                setResendLoader(false)

                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody:response.data.message,
                  buttonText: 'Ok',
                  callback: () => [Popup.hide(),]
                })
              }
             
            })
            .catch((error) => {
              console.log(error);
              setResendLoader(false)

               Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody:error.response.data.message,
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()]
                })
                console.log(error)
                setloading(false)
            });
           
          }

    
   
  
    return (
      <View style={{flex: 1, backgroundColor: 'white',}}>
        <Root>
  
        <ScrollView >
          <View style={{marginVertical: 10,marginHorizontal:20}}>
         
            <TextInput
              style={styles.input}
              placeholder="Password"
              autoCapitalize="none"
              value={password}
              onChangeText={text =>
                // setpassword({...password, currentPassword: text})
                setPassword(text)
              }
            />
          </View>
          <View style={{marginVertical: 10,marginHorizontal:20}}>
        
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={text =>setConfirmPassword(text)}
            />
          </View>
          <View style={{marginVertical: 10,marginHorizontal:20}}>
 
            <TextInput
              style={styles.input}
              placeholder="OTP"
              autoCapitalize="none"
              keyboardType='number-pad'
              maxLength={4}
              value={otp}
              onChangeText={text =>
                setOTP(text)
              }
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity
            style={{
              width: responsiveWidth(40),
              borderRadius:30,
              alignSelf: 'center',
            //   backgroundColor: GlobalStyle.blueDark,
              marginTop: responsiveHeight(7.5),
              height: responsiveHeight(6.25),
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth:1,
              borderColor:GlobalStyle.blueDark,
            }}
            onPress={() => resendOTP()}>
            {resendloader ? (
              <ActivityIndicator size="small" color={GlobalStyle.blueDark} />
            ) : (
              <Text style={{    color:GlobalStyle.blueDark,
              fontSize: responsiveFontSize(2.1),
              fontWeight: '500',}}>resend</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: responsiveWidth(40),
              borderRadius:30,
              alignSelf: 'center',
              backgroundColor: GlobalStyle.blueDark,
              marginTop: responsiveHeight(7.5),
              height: responsiveHeight(6.25),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => reset_Password()}>
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{    color: '#fff',
              fontSize: responsiveFontSize(2.1),
              fontWeight: '500',}}>submit</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: responsiveFontSize(2),
            color: '#000',
            marginTop: responsiveHeight(5),
          }}>
          This OTP is valid for 5 minutes.
        </Text>
        </ScrollView>
        </Root>
  
      </View>
    );
  };
  
  export default ResetPassword;
  
  const styles = StyleSheet.create({
    tinyLogo: {
      width: 75,
      height: 75,
      borderRadius: 100,
      marginRight: 20,
      borderWidth: 1,
      borderColor: 'white',
      // backgroundColor: 'pink',
    },
    input: {
      marginTop: 5,
      height: 50,
      borderWidth: 1,
      padding: 10,
      borderRadius:20,
      borderColor: '#000',
    },
  });
  
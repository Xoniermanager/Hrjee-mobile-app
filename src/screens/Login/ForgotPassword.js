import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, { useState } from 'react';
import GlobalStyle from '../../reusable/GlobalStyle';
import axios from 'axios';
import apiUrl from '../../reusable/apiUrl';
import Themes from '../../Theme/Theme';
import { Root, Popup } from 'popup-ui'


const ForgotPassword = ({ navigation }) => {
  const theme = useColorScheme();

  const [email, setemail] = useState('');
  const [emailError, setEmailError] = useState()
  const [loading, setloading] = useState(false);

  const resetPassword = () => {
    setloading(true);
    const data={
      email:email
    }
    if ((email == '')) {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Please enter some text',
        buttonText: 'Ok',
        callback: () => [Popup.hide(),],
      });
      setloading(false);
    } else if ((!email.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ))) {
      setloading(false);
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Invalid email address',
        buttonText: 'Ok',
        callback: () => [Popup.hide()],
      });
    }
    else {
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
        setloading(false);
        if (response.data.status== 1) {
          Popup.show({
            type: 'Success',
            title: 'Success',
            button: true,
            textBody:response.data.message,
            buttonText: 'Ok',
            callback: () => [Popup.hide(), navigation.navigate('Enter your Pin',{email:email})]
          })
          setemail('')
        }
        else if (response.data.status== 0){
          setloading(false)
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
        // console.log(error);
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
      // axios
      //   .post(`${apiUrl}users/reset_password`, {
      //     data,
      //   })
      //   .then(response => {
      //     console.log(response,'response')
      //     setloading(false);
      //     if (response.data.status== 1) {
          //     Popup.show({
          //   type: 'Success',
          //   title: 'Success',
          //   button: true,
          //   textBody:error.response.data.message,
          //   buttonText: 'Ok',
          //   callback: () => [Popup.hide(), navigation.navigate('Login')]
          // })
           
      //     }
      //     else {
      //       alert(response?.data?.message)
      //     }
      //   })
      //   .catch(error => {
          // // Popup.show({
          // //   type: 'Warning',
          // //   title: 'Warning',
          // //   button: true,
          // //   textBody:error.response.data.message,
          // //   buttonText: 'Ok',
          // //   callback: () => [Popup.hide()]
          // // })
          // console.log(error)
          // setloading(false)
      //   });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white',  }}>
      <Root>
      
      <View style={{ padding: 25 }}>
        <View style={{ marginTop: 0 }}>
          <Text style={[{ fontSize: 22, fontWeight: '600' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
            Type your E-mail Address
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: 'grey',
              marginTop: 5,
            }}>
           Help us to reset your password
          </Text>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={[
                styles.tinyLogo,
                { height: 250, width: 270, marginTop: 20 },
              ]}
              source={require('../../images/forgotPassword_photo.png')}
            />
          </View>
          <View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="username@gmail.com"
                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                onChangeText={text => setemail(text.toLowerCase())}
                onChange={() => setEmailError(null)}
              />
              {emailError ? (
                <Text style={{
                  color: 'red',
                  marginBottom: 8,
                  textAlign: 'center', fontSize: 13, marginTop: 5
                }}>{emailError}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() =>resetPassword()}
              style={[styles.btn_style]}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 15,
                  marginRight: 10,
                }}>
                Send
              </Text>
              {loading ? <ActivityIndicator size={'small'} color={"#fff"} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginTop: 20, alignItems: 'flex-end' }}>
              <Text style={{
                color: Themes == 'dark' ? '#000' : '#000'
              }}>Login ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
        
      </Root>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  input_title: {
    marginBottom: 3, fontSize: 14, fontWeight: '500', color: Themes == 'dark' ? '#000' : '#000'
  },
  input_top_margin: { marginTop: 20 },
  input: {
    height: 50,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    color: Themes == 'dark' ? '#000' : '#000'
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
  tinyLogo: {
    width: 45,
    height: 45,
    marginRight: 0,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'contain',
  },
});

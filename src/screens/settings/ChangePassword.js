import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import GlobalStyle from '../../reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Root, Popup } from 'popup-ui'

const ChangePassword = () => {
  const navigation=useNavigation()
  const [password, setpassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setloading] = useState(false);
  const changePassword = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');

    password.newPassword == password.confirmPassword
      ? axios
          .post(
            `${apiUrl}/api/updatepassword`,
            {
              old_password: password.currentPassword,
              password: password.confirmPassword,
            },
            {headers: {Token: token}},
          )
          .then(response => {
            if (response.data.status === 1) {
              try {
                setloading(false);
              
                setpassword({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              } catch (e) {
                setloading(false);
              
              }
            } else {
              setloading(false);
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody:'your current password is invalid',
                buttonText: 'Ok',
                callback: () => [Popup.hide()]
              })
            
            }
          })
          .catch(error => {
         
            setloading(false)
            if(error.response.status=='401')
            {
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody:error.response.data.msg,
                buttonText: 'Ok',
                callback: () => [Popup.hide(),AsyncStorage.removeItem('Token'),
                AsyncStorage.removeItem('UserData'),
                AsyncStorage.removeItem('UserLocation'),
               navigation.navigate('Login')]
              });
            }
          })
      :  Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody:'Your password did not match',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      })
     
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      <Root>

      <ScrollView>
        <View style={{marginVertical: 10}}>
          <Text>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            autoCapitalize="none"
            value={password.currentPassword}
            onChangeText={text =>
              setpassword({...password, currentPassword: text})
            }
          />
        </View>
        <View style={{marginVertical: 10}}>
          <Text>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            autoCapitalize="none"
            value={password.newPassword}
            onChangeText={text => setpassword({...password, newPassword: text})}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <Text>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            autoCapitalize="none"
            value={password.confirmPassword}
            onChangeText={text =>
              setpassword({...password, confirmPassword: text})
            }
          />
        </View>
        <TouchableOpacity
          onPress={changePassword}
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
            Change Password
          </Text>
          {loading ? <ActivityIndicator /> : null}
        </TouchableOpacity>
      </ScrollView>
      </Root>

    </View>
  );
};

export default ChangePassword;

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
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: 'grey',
  },
});

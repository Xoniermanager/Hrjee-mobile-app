import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, { useState, useContext } from 'react';
import GlobalStyle from '../../../reusable/GlobalStyle';
import { EssContext } from '../../../../Context/EssContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import Themes from '../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'
import { SafeAreaView } from 'react-native-safe-area-context';

const TalkToUs = ({ navigation }) => {
  const theme = useColorScheme();

  const { location, user } = useContext(EssContext);
  const [subject, setsubject] = useState('');
  const [comment, setcomment] = useState('');
  const [loading, setloading] = useState(false);

  const add_complain = async () => {
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    const UserLocation = await AsyncStorage.getItem('UserLocation');

    const config = {
      headers: { Token: token },
    };

    const body = {
      mall_name: JSON.parse(UserLocation).address1,
      email_address: JSON.parse(userData).useremail,
      region: JSON.parse(userData).REGION,
      phone_no: JSON.parse(userData).phone_no,
      subject: subject,
      comment: comment,
    };
    console.log('body1mon----->', body);
    if (subject && comment) {
      setloading(true);
      axios
        .post(`${apiUrl}/api/addcomplain`, body, config)
        .then(response => {
          console.log('response', response.data);
          if (response.data.status == 1) {
            try {
              setloading(false);
              Popup.show({
                type: 'Success',
                title: 'Success',
                button: true,
                textBody:response.data.msg,
                buttonText: 'Ok',
                callback: () => [Popup.hide(), navigation.goBack()]
              });
            } catch (e) {
              setloading(false);
              console.log(e);
            }
          } else {
            setloading(false);
            console.log(response.data);
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
        });
    } else if (subject == '') {
      
    
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody:'Please enter some text',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      });
    } else if (comment == '') {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody:'Please enter some text',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      });
    
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: GlobalStyle.blueLight,
        // padding: 20,
      }}>
        <Root>
      <View
        style={{
          padding: 15,
          backgroundColor: 'white',
          borderRadius: 5,
          width: '95%',
          margin: 10,
        }}>
        <View style={{}}>
          <Text style={styles.input_title}>Subject</Text>
          <TextInput
            style={styles.input}
            onChangeText={setsubject}
            placeholder="Please enter subject"
            placeholderTextColor={theme == 'dark' ? '#000' : '#000'}

          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Comment</Text>
          <TextInput
            onChangeText={setcomment}
            multiline
            style={[
              styles.input,
              {
                borderWidth: 1,
                borderRadius: 5,
                borderColor: 'grey',
                height: 150,
              },
            ]}
            placeholder="Put your comment here....."
            placeholderTextColor={theme == 'dark' ? '#000' : '#000'}

          />
        </View>
        <Text style={[{ marginVertical: 20 }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
          * You will get an email after submission
        </Text>
        <TouchableOpacity
          onPress={add_complain}
          style={{
            padding: 15,
            backgroundColor: GlobalStyle.blueDark,
            borderRadius: 5,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text style={{ color: 'white', fontWeight: '700', marginRight: 5 }}>
            Done
          </Text>
          {loading ? <ActivityIndicator color="white" /> : null}
        </TouchableOpacity>
      </View>
      </Root>
    </SafeAreaView>
  );
};

export default TalkToUs;

const styles = StyleSheet.create({
  input_title: { marginBottom: 10, fontSize: 14, fontWeight: '500', color: Themes == 'dark' ? '#000' : '#000' },

  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey', color: Themes == 'dark' ? '#000' : '#000'
  },
  input_top_margin: { marginTop: 30 },
});

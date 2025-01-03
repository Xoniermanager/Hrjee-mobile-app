import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../../reusable/Button';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import Empty from '../../../reusable/Empty';
import { Root, Popup } from 'popup-ui'

const Policies = ({navigation}) => {
  const [loading, setloading] = useState(true);
  const [policies, setpolicies] = useState([]);
  const [user, setuser] = useState();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_policies();
      })();
    }, []),
  );

  const get_policies = async () => {
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    setuser(JSON.parse(userData));
    const config = {
      headers: {Token: token},
    };
    axios
      .post(`${apiUrl}/api/policycategory`, {}, config)
      .then(response => {
        if (response.data.status === 1) {
          try {
            setloading(false);
            setpolicies(response.data.content);
          } catch (e) {
            setloading(false);
            console.log(e);
          }
        } else {
          setloading(false);
          // console.log('some error occured');
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
  };

  return (
    <View style={{flex: 1, padding: 15, backgroundColor: 'white'}}>
      <Root>
     
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      ) : (
        policies.map((i, index) => (
          <Button
            key={index}
            label={i.title}
            onPress={() =>
              navigation.navigate('LeavePolicy', {
                policy_id: i.id,
                userid: user.userid,
              })
            }
          />
        ))
      )}
      {policies.length == 0 && loading == false && <Empty />}
         
      </Root>
    </View>
  );
};

export default Policies;

const styles = StyleSheet.create({});

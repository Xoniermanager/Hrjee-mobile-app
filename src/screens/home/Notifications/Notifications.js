import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import GlobalStyle from '../../../reusable/GlobalStyle';
import {useFocusEffect} from '@react-navigation/native';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PullToRefresh from '../../../reusable/PullToRefresh';
import Themes from '../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'


const Notifications = ({navigation}) => {
  const theme = useColorScheme();
 
  const [empty, setempty] = useState(false);
  const [notifications, setnotifications] = useState();



  const get_notifications = async () => {
    setempty(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/api/notification_list`, body, config)
      .then(response => {
        console.log('Notification.....',response?.data)
        if (response.data.status == 1) {
          try {
            setempty(false)
            setnotifications(response.data.data);
            
            
          } catch (e) {
   
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody:e,
              buttonText: 'Ok',
              callback: () => [Popup.hide()]
            });
          
          }
        } else {
         console.log("first")
         
        }
      })
      .catch(error => {
        
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
  useFocusEffect(
    React.useCallback(() => {
      get_notifications();
    }, []),
  );
  const handleRefresh = async () => {
    // Do something to refresh the data
    get_notifications();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Root>

    
      {empty ? (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={styles.tinyLogo}
            source={require('../../../images/nothingToShow.gif')}
          />
        </View>
      ) : (
        <View style={{flex: 1, padding: 15, paddingTop: 0}}>
        
        <Text style={{color:theme == 'dark' ? '#000' : '#000'}}>You have <Text style={{color:'#2260FF'}}>{notifications?.length} Notification</Text>  today.</Text>
          <PullToRefresh onRefresh={handleRefresh}>
            {notifications ? (
              notifications.map((i, index) => (
                <View
                  key={index}
                  style={[
                    styles.card,
                    {
                      marginTop: 20,
                      marginBottom: index == notifications.length - 1 ? 80 : 0,
                    },
                  ]}
                  >
                  <View style={styles.separator}>
                    <Text style={styles.heading}>Title:</Text>
                    <Text style={styles.value}>{i.title}</Text>
                  </View>
                  <View style={styles.separator}>
                    <Text style={styles.heading}>Message:</Text>
                    <Text style={styles.value}> {i.message}</Text>
                  </View>
                  <View style={styles.separator}>
                    <Text style={styles.heading}>Created Date:</Text>
                    <Text style={styles.value}>{i.created_date}</Text>
                  </View>
                </View>
              ))
            ) : (
              <ActivityIndicator size="small" color="#388aeb" />
            )}
          </PullToRefresh>
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 15,
          backgroundColor: 'white',
        }}>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('home')}
          style={{
            padding: 15,
            backgroundColor: GlobalStyle.blueDark,
            borderRadius: 5,
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: '700'}}>
            Back to dashboard
          </Text>
        </TouchableOpacity> */}
      </View>
      </Root>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  separator: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
  },
  heading: {fontWeight: '700', marginRight: 10, color:Themes=='dark'?'#000':'#000'},
  card: {
    padding: 10,
    backgroundColor: '#e3eefb',
    borderRadius: 5,
  },
  value: {
    width: '85%', color:Themes=='dark'?'#000':'#000'
  },
});


import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, { useState } from 'react';
import Empty from '../../../reusable/Empty';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../src/reusable/apiUrl';
import axios from 'axios';
import PullToRefresh from '../../../reusable/PullToRefresh';
import Themes from '../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'


const News = ({ navigation }) => {
  const theme = useColorScheme();

  const [empty, setempty] = useState(false);
  const [loading, setloading] = useState(true);
  const [news, setnews] = useState([]);
  const [user, setuser] = useState();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const d = new Date();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_news();

        // setUserdata({...Userdata, location: JSON.parse(location)});
      })();
    }, []),
  );

  const get_news = async () => {
    const token = await AsyncStorage.getItem('Token');
    const userData = await AsyncStorage.getItem('UserData');
    // const u = JSON.parse(userData);

    setuser(JSON.parse(userData));
    // console.log('userData-->', u.userid);
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/api/newit`, {}, config)
      .then(response => {
        if (response.data.status == 1) {
          try {
            setloading(false);
            setnews(response.data.content);
          } catch (e) {
            setloading(false);
            console.log(e);
          }
        } else {
          setloading(false);

          console.log(response.data.msg);
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

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_news();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
      <Root>
    
      {news.length == 0 && loading == false ? (
        <Empty onPress={() => navigation.navigate('home')} />
      ) : loading === false ? (
        <PullToRefresh onRefresh={handleRefresh}>
          <View>
            <Text style={{ fontSize: 13, color: 'grey' }}>
              {days[d.getDay()] +
                ', ' +
                d.getDate() +
                ' ' +
                monthNames[d.getMonth()]}
            </Text>
          </View>
          <View style={{ marginTop: 15 }}>
            <Text style={[{ fontSize: 22, fontWeight: '600' }, {color:Themes=='dark'?'#000':'#000'}]}>Latest news</Text>
            {news.map((i, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate('News Detail', {
                    userId: user.userid,
                    newsId: i.id,
                  })
                }
                style={{
                  marginTop: 15,
                }}>
                <Text style={[{ fontSize: 18, fontWeight: '500', marginTop: 10 }, {color:Themes=='dark'?'#000':'#000'}]}>
                  {i.title}
                </Text>
                <Image
                  style={styles.tinyLogo}
                  // source={require('../../../images/meta.jpeg')}
                  source={
                    i.attacnment
                      ? { uri: i.attacnment }
                      : require('../../../images/image.png')
                  }
                />
                {/* <Text style={{fontSize: 16, fontWeight: '400', marginTop: 5}}>
                  {i.short_description}
                </Text> */}
              </TouchableOpacity>
            ))}
          </View>
        </PullToRefresh>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      )}
          
          </Root>
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  tinyLogo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

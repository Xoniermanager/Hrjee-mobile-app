import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../src/reusable/apiUrl';
import axios from 'axios';
import PullToRefresh from '../../../reusable/PullToRefresh';
import Themes from '../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'

const NewsDetails = ({navigation, route}) => {
  const theme = useColorScheme();
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
  const [loading, setloading] = useState(true);
  const [newsDetail, setnewsDetail] = useState();

  const d = new Date();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        news_details();

        // setUserdata({...Userdata, location: JSON.parse(location)});
      })();
    }, []),
  );

  const news_details = async () => {
    const token = await AsyncStorage.getItem('Token');

    const config = {
      headers: {Token: token},
    };
    axios
      .post(
        `${apiUrl}/api/get_news_detail_by_id`,
        {
          news_id: route.params.newsId,
          userid: route.params.userId,
        },
        config,
      )
      .then(response => {
        if (response.data.status === 1) {
          try {
            setloading(false);
            setnewsDetail(response.data.data);
          } catch (e) {
            setloading(false);
           
          }
        } else {
          setloading(false);
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody:'some error occured',
            buttonText: 'Ok',
            callback: () => [Popup.hide()]
          });
      
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
    news_details();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      <Root>
   
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      ) : newsDetail ? (
        <PullToRefresh onRefresh={handleRefresh}>
           <Text style={[{fontSize: 19, fontWeight: '600'}, {color:Themes=='dark'?'#000':'#000'}]}>
              {newsDetail.title}
            </Text>
          <Image
            style={styles.tinyLogo}
            source={
              newsDetail
                ? {uri: newsDetail.filename}
                : require('../../../images/meta.jpeg')
            }
            // source={require('../../../images/meta.jpeg')}
          />
          <View style={{marginTop: 10}}>
          <Text style={{ color:"#000", fontWeight:"bold" }}>Publish Date</Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <AntDesign
                name="calendar"
                size={17}
                color="#0321a4"
                style={{marginRight: 5}}
              />
              <Text style={[{fontSize: 13}, {color:Themes=='dark'?'#000':'#000'}]}>{newsDetail.publish_date}</Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={[{color:"#000", fontWeight:"bold" }]}>Short Description</Text>
              <Text style={{color:Themes=='dark'?'#000':'#000'}}>{newsDetail.short_description}</Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{color:"#000", fontWeight:"bold" }}>Long Description</Text>
              <Text style={{color:Themes=='dark'?'#000':'#000'}}>{newsDetail.long_description}</Text>
            </View>
          
          </View>
        </PullToRefresh>
      ) : (
        <Text>No data found</Text>
      )}
           
           </Root>
    </View>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  tinyLogo: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
});

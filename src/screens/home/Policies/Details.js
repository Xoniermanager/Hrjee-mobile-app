import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
let {width} = Dimensions.get('window');
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import GlobalStyle from '../../../reusable/GlobalStyle';
import PullToRefresh from '../../../reusable/PullToRefresh';
import { Root, Popup } from 'popup-ui'

const Details = ({navigation, route}) => {
  const [loading, setloading] = useState(true);
  const [policyDetail, setpolicyDetail] = useState({});
  console.log("route.params.policy_id.....", policyDetail)

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
        get_policy_detail_by_id();
      })();
    }, []),
  );

  const get_policy_detail_by_id = async () => {
    const token = await AsyncStorage.getItem('Token');

    const config = {
      headers: {Token: token},
    };
    axios
      .post(
        `${apiUrl}/api/get_policy_detail_by_id`,
        {
          policy_id: route.params.policy_id,
          userid: route.params.userid,
        },
        config,
      )
      .then(response => {
        if (response.data.status === 1) {
          try {
            setloading(false);
            setpolicyDetail(response.data.data);
          } catch (e) {
            setloading(false);
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
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody:'some error occured',
            buttonText: 'Ok',
            callback: () => [Popup.hide()]
          });
          setloading(false);
       
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

  const navigateTo = () => {
    let urlSplitArr = policyDetail.attacnment.split('.');
    let extension = urlSplitArr[2];
    if (extension == 'mp4') {
      navigation.navigate('Video Details', {
        url: policyDetail.attacnment,
        thumbnail: policyDetail.filename,
      });
    } else if (
      extension == 'pdf' ||
      extension == 'doc' ||
      extension == 'docx' ||
      extension == 'jpg' ||
      extension == 'jpeg' ||
      extension == 'png' ||
      extension == 'gif'
    ) {
      navigation.navigate('Doc', {
        url: policyDetail.attacnment,
        thumbnail: policyDetail.filename,
      });
    } else {
      policyDetail.attacnment.includes('https')
        ? Linking.openURL(policyDetail.attacnment)
        :     Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody:'empty url',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        });
    }
  };

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_policy_detail_by_id();
  };

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
      <Root>
    
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      ) : policyDetail ? (
        <>
          <PullToRefresh onRefresh={handleRefresh}>
            <Image
              style={styles.tinyLogo}
              source={
                policyDetail
                  ? {uri: policyDetail.filename}
                  : require('../../../images/profile_pic.webp')
              }
              // source={require('../../../images/profile_pic.webp')}
            />
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: 19, fontWeight: '600'}}>
                {policyDetail.title}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <AntDesign
                  name="calendar"
                  size={17}
                  color="#0321a4"
                  style={{marginRight: 5}}
                />
                <Text style={{fontSize: 13}}>{policyDetail.publish_date}</Text>
              </View>
              <View style={{marginTop: 20}}>
                <Text>{policyDetail.long_description}</Text>
              </View>
            </View>
          </PullToRefresh>

          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 15,
              backgroundColor: 'white',
            }}>
            <TouchableOpacity
              onPress={navigateTo}
              style={{
                padding: 15,
                backgroundColor: GlobalStyle.blueDark,
                borderRadius: 5,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: '700'}}>Open</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>No data found</Text>
      )}
          
          </Root>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  tinyLogo: {
    width: '100%',
    height: width / 1.5,
    borderRadius: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
});

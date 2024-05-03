import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
let {width} = Dimensions.get('window');
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import PullToRefresh from '../../../reusable/PullToRefresh';
import Themes from '../../../Theme/Theme';


const LeavePolicy = ({navigation, route}) => {
  const theme = useColorScheme();

  const [loading, setloading] = useState(true);
  const [policyDetail, setpolicyDetail] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_policy_detail_by_id();

        // setUserdata({...Userdata, location: JSON.parse(location)});
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
        `${apiUrl}/api/policy`,
        {
          catid: route.params.policy_id,
        },
        config,
      )
      .then(response => {
        if (response.data.status === 1) {
          try {
            setloading(false);
            setpolicyDetail(response.data.content);
          } catch (e) {
            setloading(false);
            alert(e);
          }
        } else {
          alert(response.data.msg);
          setloading(false)
        }
      })
      .catch(error => {
        // alert(error.request._response);
        setloading(false)
        if(error.response.status=='401')
        {
      alert(error.response.data.msg)
        AsyncStorage.removeItem('Token');
        AsyncStorage.removeItem('UserData');
        AsyncStorage.removeItem('UserLocation');
       navigation.navigate('Login');
        }
      });
  };

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_policy_detail_by_id();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      ) : policyDetail.length > 0 ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {policyDetail.map((i, index) => (
            <TouchableOpacity
              key={index}
              style={[
                {flexDirection: 'row', marginTop: index == 0 ? null : 20},
                styles.card,
              ]}
              onPress={() =>
                navigation.navigate('Details', {
                  policy_id: i.id,
                  userid: route.params.userid,
                })
              }>
              <Image
                style={styles.tinyLogo}
                source={
                  i.filename
                    ? {uri: i.filename}
                    : require('../../../images/profile_pic.webp')
                }
                // source={require('../../../images/profile_pic.webp')}
              />
              <View style={{padding: 5}}>
                <Text style={[{fontSize: 16, fontWeight: '500'}, {color:Themes=='dark'?'#000':'#000'}]}>{i.title}</Text>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <AntDesign
                    name="calendar"
                    size={17}
                    color="#0321a4"
                    style={{marginRight: 5}}
                  />
                  <Text style={[{fontSize: 13}, {color:Themes=='dark'?'#000':'#000'}]}>{i.publish_date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </PullToRefresh>
      ) : (
        <Text>No data found</Text>
      )}
    </View>
  );
};

export default LeavePolicy;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 120,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  card: {
    // padding: 10,
    // marginTop: 10,
    borderRadius: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

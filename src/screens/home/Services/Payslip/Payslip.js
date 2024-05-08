import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import PullToRefresh from '../../../../reusable/PullToRefresh';
import Empty from '../../../../reusable/Empty';
import Themes from '../../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'

const Payslip = ({navigation}) => {
  const theme = useColorScheme();

  const [empty, setempty] = useState(false);
  const [loading, setloading] = useState(true);
  const [payslip, setpayslip] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_payslip();
      })();
    }, []),
  );

  const monthNames = [
    'Jan',
    'Febr',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const get_payslip = async () => {
    const token = await AsyncStorage.getItem('Token');

    const config = {
      headers: {Token: token},
    };
    axios
      .post(`${apiUrl}/api/payslip`, {}, config)
      .then(response => {
        if (response.data.status == 1) {
          try {
            setloading(false);
            console.log('---->', response.data.content);
            setpayslip(response.data.content);
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
  };

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_payslip();
  };
console.log(payslip,'payslip')
  return (
    <>
    <Root>

    
      {payslip && payslip?.length == 0 && !loading && <Empty />}

      {payslip?.length > 0 && (
        <View style={{flex: 1, backgroundColor: '#e3eefb', padding: 15}}>
          <PullToRefresh onRefresh={handleRefresh}>
            {payslip?.map((i, index) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Doc', {url: i.slip_url})}
                
                key={index}
                style={[
                  {
                    marginTop: index > 0 ? 20 : 0,
                    padding: 15,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                  GlobalStyle.card,
                ]}>
                <Text style={[{fontWeight: '600', fontSize: 16},{color: Themes == 'dark' ? '#000' : '#000' }]}>
                  {monthNames[+i.month - 1] + ' ' + i.year}
                </Text>
                <AntDesign
                  name="rightcircle"
                  size={28}
                  color="#0043ae"
                  style={{marginRight: 5}}
                />
              </TouchableOpacity>
            ))}
          </PullToRefresh>
        </View>
      )}

      {loading && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      )}
      </Root>
    </>
  );
};

export default Payslip;

const styles = StyleSheet.create({
  btn_style: {
    width: '100%',
    marginTop: 30,
    backgroundColor: '#0321a4',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
});

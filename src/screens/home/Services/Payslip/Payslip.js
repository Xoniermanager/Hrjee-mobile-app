import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  useColorScheme,
  Dimensions
} from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import PullToRefresh from '../../../../reusable/PullToRefresh';
import Empty from '../../../../reusable/Empty';
import Themes from '../../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'
import NotificationListSkeleton from '../../../Skeleton/NotificationListSkeleton';
import CardSkeleton from '../../../Skeleton/CardSkeleton';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import HomePayslipSkeleton from '../../../Skeleton/HomePayslipSkeleton';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const { height } = Dimensions.get('window');
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Payslip = ({ navigation }) => {
  const theme = useColorScheme();
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12]
  const [empty, setempty] = useState(false);
  const [loading, setloading] = useState(true);
  const [payslip, setpayslip] = useState(null);

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, backgroundColor: '#e3eefb' }}>
        <ShimmerPlaceHolder
          height={60}
          style={{ width: "100%" , alignSelf:"center"}}
          autoRun={true}
        />
    </View>
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
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/api/payslip`, {}, config)
      .then(response => {
        console.log(response.data, 'dbfbdfkbk')
        if (response.data.status == 1) {
          try {
            setloading(false);
            setpayslip(response.data.content);
            console.log(response.data.content, 'vvvvv')
          } catch (e) {
            setloading(false);
          }
        } else {
          setloading(false);
          setpayslip([])
        }
      })
      .catch(error => {


        setloading(false)
        if (error.response.status == '401') {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [Popup.hide(), AsyncStorage.removeItem('Token'),
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
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_payslip();
      })();
    }, []),
  );

  if (payslip == null) {
    return (
      <View>
        <FlatList showsVerticalScrollIndicator={false}
          data={arr}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
        />
      </View>

    )
  }

  return (
    <>
      <Root>

        {/* {payslip && payslip?.length == 0 && !loading && <Empty />} */}

        {payslip?.length != 0 ?

          <View style={{ flex: 1, backgroundColor: '#e3eefb', padding: 15 }}>
            <PullToRefresh onRefresh={handleRefresh}>
              {payslip?.map((i, index) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Doc', { url: i.doc })}

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
                  <Text style={[{ fontWeight: '600', fontSize: 16 }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                    {monthNames[+i.month - 1] + ' ' + i.year}
                  </Text>
                  <AntDesign
                    name="rightcircle"
                    size={28}
                    color="#0043ae"
                    style={{ marginRight: 5 }}
                  />
                </TouchableOpacity>
              )
              )}
            </PullToRefresh>
          </View>
          :
          <Empty />
        }

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

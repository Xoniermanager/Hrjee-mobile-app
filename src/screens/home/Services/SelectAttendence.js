import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  useColorScheme
} from 'react-native';
import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PullToRefresh from '../../../reusable/PullToRefresh';
import Themes from '../../../Theme/Theme';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Root, Popup } from 'popup-ui'

const SelectAttendence = () => {
  const theme = useColorScheme();
  const navigation=useNavigation()

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [endopen, setendopen] = useState(false);
  const [endDate, setEndDate] = useState(
    new Date(Date.UTC(2024, startDate.getUTCMonth() + 1, 1)),
  );

  const [recentLogs, setrecentLogs] = useState([]);

  console.log(recentLogs, "202")

  const [loading, setloading] = useState(false);

  console.log('date------>', startDate, endDate);

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  useFocusEffect(
    React.useCallback(() => {
      get_month_logs();
    }, []),
  );

  const d = new Date();

  var mon = ((d.getMonth() + 1) <= 9) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1);

  var day = (d.getDate() <= 9) ? ('0' + d.getDate()) : d.getDate();

  const datetime = d.getFullYear() + '-' + mon + '-' + day;
  const hours = d.getHours() + ":" + d.getMinutes();

  const get_recent_logs = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const date = new Date('2022-12-08');
    console.log('****', days[date.getDay()]);
    const body = {
      start_date: `${startDate.getFullYear()}-${startDate.getMonth() + 1
        }-${startDate.getDate()}`,

      end_date: `${endDate.getFullYear()}-${endDate.getMonth() + 1
        }-${endDate.getDate()}`,
    };
    console.log("body=>", body)

    if (`${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}` > `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`) {
      setloading(false);
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody:'Till date should muast be greater than the From date ',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      })
     
    } else {
      axios
        .post(`${apiUrl}/Api/attendance`, body, config)
        .then(response => {
          console.log('addtendance response......................................', response.data);
          if (response.data.status == 1) {
            setloading(false);

            try {
              setrecentLogs(response.data.content);
            } catch (e) {
            
            }
          } else {
            setloading(false);
            setrecentLogs([]);
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody:'attendence not found',
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
        });
    }
  };

  const get_month_logs = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    var startOfWeek = moment().startOf('month').toDate();
    var endOfWeek = moment().endOf('month').toDate();

    const body = {
      start_date: startOfWeek,
      end_date: endOfWeek,
    };
    console.log('body1mon----->', startOfWeek, endOfWeek);
    axios
      .post(`${apiUrl}/Api/attendance`, body, config)
      .then(response => {
        console.log('response', response.data);
        if (response.data.status == 1) {
          try {
            console.log(response.data.content);
            setrecentLogs(response.data.content);
          } catch (e) {
           
          }
        } else {
         
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
    get_month_logs();
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: 'white' }}>
      <Root>
      <PullToRefresh onRefresh={handleRefresh}>
        <View>
          <Text style={styles.title}>Start Date</Text>
          <TouchableOpacity
            onPress={() => setstartopen(true)} //
            style={styles.calender}>
            <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{new Date(startDate).toLocaleDateString('en-GB')}</Text>
            <AntDesign
              name="calendar"
              size={20}
              style={styles.radio_icon}
              color="#0321a4"
            />
          </TouchableOpacity>
          <DatePicker
            modal
            textColor="#000000"
            backgroundColor="#FFFFFF"
            open={startopen}
            date={startDate}
            theme='light'
            mode="date"
            onConfirm={date => {
              setstartopen(false);
              setStartDate(date);
              setEndDate(new Date(Date.UTC(2023, date.getUTCMonth() + 1, 1)));
            }}
            onCancel={() => {
              setstartopen(false);
            }}
          />
        </View>
        <View>
          <Text style={[styles.title, { marginTop: 20 }]}>End Date</Text>
          <TouchableOpacity
            onPress={() => setendopen(true)} //
            style={styles.calender}>
            <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{new Date(endDate).toLocaleDateString('en-GB')}</Text>
            <AntDesign
              name="calendar"
              size={20}
              style={styles.radio_icon}
              color="#0321a4"
            />
          </TouchableOpacity>
          <DatePicker
            modal
            textColor="#000000"
            backgroundColor="#FFFFFF"
            open={endopen}
            date={endDate}
            theme='light'
            mode="date"
            onConfirm={date => {
              setendopen(false);
              setEndDate(date);
            }}
            onCancel={() => {
              setendopen(false);
            }}
          />
        </View>
        <TouchableOpacity
          style={[styles.btn_style, { flexDirection: 'row' }]}
          onPress={get_recent_logs}>
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 15,
              marginRight: 10,
            }}>
            Get Attendance
          </Text>
          {loading ? <ActivityIndicator /> : null}
        </TouchableOpacity>
        <View>
          <Text style={[{ marginVertical: 20, fontSize: 19, fontWeight: 'bold' }, {
            color: Themes == 'dark' ? '#000' : '#000'
          }]}>
            Attendence Logs
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'grey',
              borderRadius: 5,
        

            }}>
            <View
              style={[
                styles.display_row,
                { backgroundColor: GlobalStyle.blueLight },
              ]}>
              <Text style={styles.heading}>Date</Text>
              <Text style={styles.heading}>No. of Hours</Text>
            </View>
            {recentLogs
              ? recentLogs.map((i, index) => (
                <View
                  key={index}
                  style={[
                    styles.display_row,
                    { borderTopWidth: 1, borderTopColor: 'grey' },
                  ]}>
                  <Text style={{color: Themes == 'dark' ? '#000' : '#000',fontSize:responsiveFontSize(1.5) }}>{i.TR_DATE}</Text>
                  {
                    (datetime != i.TR_DATE) ? <Text style={{ color: Themes == 'dark' ? '#000' : '#000',fontSize:responsiveFontSize(1.5),marginRight:15 }}> {i.PRESENT_HOURS}</Text> : (i.location_id == null) ? <Text style={{ color: Themes == 'dark' ? '#000' : '#000',fontSize:responsiveFontSize(1.5),marginRight:15 }}>NA</Text> : <Text style={{ color: Themes == 'dark' ? '#000' : '#000' ,fontSize:responsiveFontSize(1.5),marginRight:15}}> {i.PRESENT_HOURS} </Text>
                  }
                </View>
              ))
              : null}
          </View>
        </View>
      </PullToRefresh>
      </Root>
    </View>
  );
};

export default SelectAttendence;

const styles = StyleSheet.create({
  title: { fontSize: 16, marginVertical: 10, fontWeight: '600', color: Themes == 'dark' ? '#000' : '#000' },
  display_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    width:responsiveWidth(92),
    alignSelf:'center'
  },
  heading: {
    fontSize: 17, fontWeight: '600', color: Themes == 'dark' ? '#000' : '#000'
  },
  btn_style: {
    marginTop: 30,
    backgroundColor: GlobalStyle.blueDark,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
});

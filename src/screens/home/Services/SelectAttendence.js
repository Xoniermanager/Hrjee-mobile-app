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
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { Root, Popup } from 'popup-ui'
import CardSkeleton from '../../Skeleton/CardSkeleton';


const SelectAttendence = () => {
  const theme = useColorScheme();
  const navigation = useNavigation()
  const arr = [1, 2, 3, 4, 5, 6, 7, 8]
  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [endopen, setendopen] = useState(false);
  const [endDate, setEndDate] = useState(
    new Date(Date.UTC(2024, startDate.getUTCMonth() + 1, 1)),
  );

  const [recentLogs, setrecentLogs] = useState([]);
  const [loading, setloading] = useState(false);

  console.log("startDate-----------", startDate)
  console.log("endDate-----------", endDate)


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
    const date = new Date();
    const body = {
      start_date: `${startDate.getFullYear()}-${startDate.getMonth() + 1
        }-${startDate.getDate()}`,

      end_date: `${endDate.getFullYear()}-${endDate.getMonth() + 1
        }-${endDate.getDate()}`,
    };
    if (startDate > endDate) {
      setloading(false);
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Till date should must be greater than the From date ',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      })

    } else {
      axios
        .post(`${apiUrl}/Api/attendance`, body, config)
        .then(response => {
          if (response.data.status == 1) {
            setloading(false);
            setrecentLogs(response.data.content);
          } else {
            setloading(false);
            setrecentLogs([]);
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: 'attendence not found',
              buttonText: 'Ok',
              callback: () => [Popup.hide()]
            })

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
    axios
      .post(`${apiUrl}/Api/attendance`, body, config)
      .then(response => {
        if (response.data.status == 1) {
          try {
            setrecentLogs(response.data.content);
          } catch (e) {

          }
        } else {

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
    get_month_logs();
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#e3eefb' }}>
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
                setEndDate(new Date(Date.UTC(2024, date.getUTCMonth() + 1, 1)));
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
            {loading ? <ActivityIndicator color={"#fff"} /> : null}
          </TouchableOpacity>
          <View>
            <Text style={[{ marginVertical: 20, fontSize: 19, fontWeight: 'bold' }, {
              color: Themes == 'dark' ? '#000' : '#000'
            }]}>
              Attendence Logs
            </Text>
            <View style={styles.container1}>
              <View style={[styles.display_row, { backgroundColor: GlobalStyle.blueLight }]}>
                <Text style={styles.heading}>Date      </Text>
                <Text style={styles.heading}>Punch In  </Text>
                <Text style={styles.heading}>Hours</Text>
              </View>
              {recentLogs ? (
                recentLogs.length > 0 ? (
                  recentLogs.map((i, index) => {
                    const time = new Date(i?.punch_in_time);
                    const getTime = time.toLocaleTimeString();
                    return (
                      <View key={index} style={[styles.display_row, styles.logRow]}>
                        <Text style={[styles.text, { color: Themes === 'dark' ? '#fff' : '#000' }]}>
                          {i.TR_DATE}
                        </Text>
                        <Text style={[styles.text, { color: Themes === 'dark' ? '#fff' : '#000' }]}>
                          {getTime}
                        </Text>
                        <Text style={[styles.text, { color: Themes === 'dark' ? '#fff' : '#000' }]}>
                          {datetime !== i.TR_DATE ? i.PRESENT_HOURS : i.location_id === null ? '00:00' : i.PRESENT_HOURS}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  arr.map((val, index) => (
                    <View key={index} style={styles.skeletonContainer}>
                      <CardSkeleton height={responsiveHeight(5)} width={responsiveWidth(95)} />
                    </View>
                  ))
                )
              ) : null}
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
  container1: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: responsiveWidth(2),
    marginBottom: responsiveHeight(2),
  },
  display_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: responsiveHeight(1),
  },
  heading: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#000',
  },
  logRow: {
    borderTopWidth: 1,
    borderTopColor: 'grey',
  },
  text: {
    fontSize: responsiveFontSize(1.5),
    marginRight: responsiveWidth(2),
  },
  skeletonContainer: {
    marginVertical: responsiveHeight(0.5),
    borderWidth: 1,
    borderColor: 'gray',
    alignSelf: 'center',
  },
});

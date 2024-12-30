import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Root, Popup } from 'popup-ui'
import Themes from '../../../../Theme/Theme';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apiUrl from '../../../../reusable/apiUrl'


const Add_Attendence = ({ navigation }) => {
  const theme = useColorScheme();
  const [loading, setloading] = useState(false);
  const [reason, setReason] = useState('');
  const [startdate, setStartDate] = useState(new Date());
  const [startpunchintime, setStartPunchInTime] = useState(new Date());
  const [startpunchouttime, setStartPunchOutTime] = useState(new Date());
  const [startopenpunchintime, setOpenStartPunchInTime] = useState(false);
  const [startopenpunchouttime, setOpenStartPunchOutTime] = useState(false);
  const [openstartdate, setOpenStartDate] = useState(false);


  const validateForm = () => {
    // Check if the required fields are filled
    if (!reason.trim()) {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Please provide a reason for the attendance.',
        buttonText: 'Ok',
        callback: () => Popup.hide(),
      });
      return false;
    }
    if (!startdate) {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Please select a date.',
        buttonText: 'Ok',
        callback: () => Popup.hide(),
      });
      return false;
    }
    if (!startpunchintime) {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Please select Punch In time.',
        buttonText: 'Ok',
        callback: () => Popup.hide(),
      });
      return false;
    }
    if (!startpunchouttime) {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'Please select Punch Out time.',
        buttonText: 'Ok',
        callback: () => Popup.hide(),
      });
      return false;
    }

    return true;
  };

  const addAttendenceRequest = async () => {
    if (!validateForm()) return;
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {
        Token: token,
        'Content-Type': 'multipart/form-data'
      },
    }

    let data = new FormData();
    data.append('date', startdate.toISOString().split('T')[0]);
    data.append('punch_in_time', startdate.toISOString().split('T')[1].split('.')[0]);
    data.append('punch_out_time', startdate.toISOString().split('T')[1].split('.')[0]);
    data.append('reason', reason);

    axios
      .post(`${apiUrl}/SecondPhaseApi/saveAttendanceRequest`, data, config)
      .then(response => {
        setloading(false)
        if (response?.data?.status == 200) {
          Popup.show({
            type: 'Success',
            title: 'Success',
            button: true,
            textBody: response?.data?.message,
            buttonText: 'Ok',
            callback: () => [Popup.hide(), navigation.goBack()],
          });
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



  return (
    <SafeAreaView style={
      styles.container
    }>
      <Root>
        <ScrollView >
          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' },
            ]}>
            Date
          </Text>
          <View style={styles.Date_box}>
            <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{startdate?.toISOString().split('T')[0]}</Text>
            <TouchableOpacity onPress={() => setOpenStartDate(true)}>
              <EvilIcons
                name="calendar"
                style={{
                  fontSize: 25,
                  color: Themes == 'dark' ? '#000' : '#000',
                  alignSelf: "center"
                }}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' },
            ]}>
            Punch In Time
          </Text>
          <View style={styles.Date_box}>
            <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{startpunchintime?.toISOString().split('T')[1].slice(0, 5)}</Text>
            <TouchableOpacity onPress={() => setOpenStartPunchInTime(true)}>
              <EvilIcons
                name="calendar"
                style={{
                  fontSize: 25,
                  color: Themes == 'dark' ? '#000' : '#000',
                  alignSelf: "center"
                }}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' },
            ]}>
            Punch Out Time
          </Text>
          <View style={styles.Date_box}>
            <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{startpunchouttime?.toISOString().split('T')[1].slice(0, 5)}</Text>
            <TouchableOpacity onPress={() => setOpenStartPunchOutTime(true)}>
              <EvilIcons
                name="calendar"
                style={{
                  fontSize: 25,
                  color: Themes == 'dark' ? '#000' : '#000',
                  alignSelf: "center"
                }}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' }

            ]}>
            Reason
          </Text>
          <TextInput
            multiline={true}
            value={reason}
            placeholder="Comments"
            placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
            style={styles.input_Text}
            onChangeText={prev => setReason(prev)}
          />
          <TouchableOpacity
            style={{
              width: 150,
              height: 40,
              backgroundColor: '#0043ae',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 10,
            }}
            onPress={() => addAttendenceRequest()}>
            {
              loading ? <ActivityIndicator size="small" color="#fff" /> :
                <Text style={{ color: '#fff' }}>Submit</Text>}
          </TouchableOpacity>
          <DatePicker
            modal
            open={openstartdate}
            date={startdate}
            theme='light'
            mode="date"
            onConfirm={startdate => {
              setOpenStartDate(false);
              setStartDate(startdate);

            }}
            onCancel={() => {
              setOpenStartDate(false);
            }}
          />
          <DatePicker
            modal
            open={startopenpunchintime}
            date={startpunchintime}
            theme='light'
            mode="time"
            onConfirm={startpunchintime => {
              setOpenStartPunchInTime(false);
              setStartPunchInTime(startpunchintime);

            }}
            onCancel={() => {
              setOpenStartPunchInTime(false);
            }}
          />
          <DatePicker
            modal
            open={startopenpunchouttime}
            date={startpunchouttime}
            theme='light'
            mode="time"
            onConfirm={startpunchouttime => {
              setOpenStartPunchOutTime(false);
              setStartPunchOutTime(startpunchouttime);

            }}
            onCancel={() => {
              setOpenStartPunchOutTime(false);
            }}
          />
        </ScrollView>
      </Root>
    </SafeAreaView>
  );
};
export default Add_Attendence;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3eefb"
  },
  Dashboard_Text: {
    fontSize: responsiveFontSize(2),
    marginHorizontal: 20,
    fontWeight: '700',
    marginVertical: 10,
  },
  check_box: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    backgroundColor: '#50C878',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Person_card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginHorizontal: 5,
  },
  card: {
    borderRadius: 10,
    // borderColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    // height: 92,
    // width: 90,
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
    color: '#000',
  },
  reportType: {
    color: '#37496E',
    marginHorizontal: 20,
    fontSize: responsiveFontSize(1.9),
    fontWeight: '500',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center'
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: responsiveFontSize(1.7),
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(1.9),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  input_Text: {
    height: 100, // Increased height for multiline input
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10, // Added padding for better readability
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center',
    color: Themes === 'dark' ? '#FFF' : '#000', // Updated text color for dark mode
    backgroundColor: Themes === 'dark' ? '#333' : '#e3eefb', // Set background color based on theme
    textAlignVertical: 'top', // Align text to top for better text input behavior
  },
  document_pick_text: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center', justifyContent: "center",
    color: Themes == 'dark' ? '#000' : '#000'
  },
  Date_box: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 15,
    height: 50,
    marginBottom: 5,
    width: responsiveWidth(90),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  addimage: {
    width: responsiveWidth(30),
    height: responsiveHeight(6),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image_show: {
    width: responsiveWidth(58),
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  qtn_box: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center',
    // alignItems:"center",
    justifyContent: 'center'
  },
  takepictext: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Themes == 'dark' ? '#000' : '#000'
  },
});





























// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   TextInput,
//   ScrollView,
//   useColorScheme,
//   ActivityIndicator,
//   SafeAreaView,
//   Alert
// } from 'react-native';
// import DatePicker from 'react-native-date-picker';
// import React, { useState } from 'react';
// import { Root, Popup } from 'popup-ui'
// import Themes from '../../../../Theme/Theme';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import apiUrl from '../../../../reusable/apiUrl'


// const Add_Attendence = ({ navigation }) => {
//   const theme = useColorScheme();
//   const [loading, setloading] = useState(false);
//   const [reason, setReason] = useState('');
//   const [startdate, setStartDate] = useState(new Date());
//   const [startpunchintime, setStartPunchInTime] = useState(new Date());
//   const [startpunchouttime, setStartPunchOutTime] = useState(new Date());
//   const [startopenpunchintime, setOpenStartPunchInTime] = useState(false);
//   const [startopenpunchouttime, setOpenStartPunchOutTime] = useState(false);
//   const [openstartdate, setOpenStartDate] = useState(false);

//   const validateForm = () => {
//     // Check if the required fields are filled
//     if (!reason.trim()) {
//       Popup.show({
//         type: 'Warning',
//         title: 'Warning',
//         button: true,
//         textBody: 'Please provide a reason for the attendance.',
//         buttonText: 'Ok',
//         callback: () => Popup.hide(),
//       });
//       return false;
//     }
//     if (!startdate) {
//       Popup.show({
//         type: 'Warning',
//         title: 'Warning',
//         button: true,
//         textBody: 'Please select a date.',
//         buttonText: 'Ok',
//         callback: () => Popup.hide(),
//       });
//       return false;
//     }
//     if (!startpunchintime) {
//       Popup.show({
//         type: 'Warning',
//         title: 'Warning',
//         button: true,
//         textBody: 'Please select Punch In time.',
//         buttonText: 'Ok',
//         callback: () => Popup.hide(),
//       });
//       return false;
//     }
//     if (!startpunchouttime) {
//       Popup.show({
//         type: 'Warning',
//         title: 'Warning',
//         button: true,
//         textBody: 'Please select Punch Out time.',
//         buttonText: 'Ok',
//         callback: () => Popup.hide(),
//       });
//       return false;
//     }

//     return true;
//   };

//   const addAttendenceRequest = async () => {
//     // Validate the form before making the request
//     if (!validateForm()) return;

//     setloading(true);
//     const token = await AsyncStorage.getItem('Token');
//     const config = {
//       headers: {
//         Token: token,
//         'Content-Type': 'multipart/form-data'
//       },
//     }

//     let data = new FormData();
//     data.append('date', startdate.toISOString().split('T')[0]);
//     data.append('punch_in_time', startdate.toISOString().split('T')[1].split('.')[0]);
//     data.append('punch_out_time', startdate.toISOString().split('T')[1].split('.')[0]);
//     data.append('reason', reason);

//     axios
//       .post(`${apiUrl}/SecondPhaseApi/saveAttendanceRequest`, data, config)
//       .then(response => {
//         setloading(false);
//         if (response?.data?.status == 200) {
//           Popup.show({
//             type: 'Warning',
//             title: 'Success',
//             button: true,
//             textBody: response?.data?.message,
//             buttonText: 'Ok',
//             callback: () => [Popup.hide()],
//           });
//         }
//       })
//       .catch(error => {
//         setloading(false);
//         if (error.response.status == '401') {
//           Popup.show({
//             type: 'Warning',
//             title: 'Warning',
//             button: true,
//             textBody: error.response.data.msg,
//             buttonText: 'Ok',
//             callback: () => [Popup.hide(), AsyncStorage.removeItem('Token'),
//               AsyncStorage.removeItem('UserData'),
//               AsyncStorage.removeItem('UserLocation'),
//               navigation.navigate('Login')]
//           });
//         }
//       });

//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Root>
//         <ScrollView>
//           <Text
//             style={[
//               styles.reportType,
//               { color: Themes == 'dark' ? '#000' : '#000' },
//             ]}>
//             Date
//           </Text>
//           <View style={styles.Date_box}>
//             <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{startdate?.toISOString().split('T')[0]}</Text>
//             <TouchableOpacity onPress={() => setOpenStartDate(true)}>
//               <EvilIcons
//                 name="calendar"
//                 style={{
//                   fontSize: 25,
//                   color: Themes == 'dark' ? '#000' : '#000',
//                   alignSelf: "center"
//                 }}
//               />
//             </TouchableOpacity>
//           </View>
          
//           {/* Punch In and Punch Out Time */}
//           <Text
//             style={[
//               styles.reportType,
//               { color: Themes == 'dark' ? '#000' : '#000' },
//             ]}>
//             Punch In Time
//           </Text>
//           <View style={styles.Date_box}>
//             <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{startpunchintime?.toISOString().split('T')[1].split('.')[0]}</Text>
//             <TouchableOpacity onPress={() => setOpenStartPunchInTime(true)}>
//               <EvilIcons
//                 name="calendar"
//                 style={{
//                   fontSize: 25,
//                   color: Themes == 'dark' ? '#000' : '#000',
//                   alignSelf: "center"
//                 }}
//               />
//             </TouchableOpacity>
//           </View>

//           <Text
//             style={[
//               styles.reportType,
//               { color: Themes == 'dark' ? '#000' : '#000' },
//             ]}>
//             Punch Out Time
//           </Text>
//           <View style={styles.Date_box}>
//             <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{startpunchouttime?.toISOString().split('T')[1].split('.')[0]}</Text>
//             <TouchableOpacity onPress={() => setOpenStartPunchOutTime(true)}>
//               <EvilIcons
//                 name="calendar"
//                 style={{
//                   fontSize: 25,
//                   color: Themes == 'dark' ? '#000' : '#000',
//                   alignSelf: "center"
//                 }}
//               />
//             </TouchableOpacity>
//           </View>

//           <Text
//             style={[
//               styles.reportType,
//               { color: Themes == 'dark' ? '#000' : '#000' }
//             ]}>
//             Remark
//           </Text>
//           <TextInput
//             multiline={true}
//             value={reason}
//             placeholder="Comments"
//             placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
//             style={styles.input_Text}
//             onChangeText={prev => setReason(prev)}
//           />
          
//           <TouchableOpacity
//             style={{
//               width: 150,
//               height: 40,
//               backgroundColor: '#0043ae',
//               borderRadius: 10,
//               justifyContent: 'center',
//               alignItems: 'center',
//               alignSelf: 'center',
//               marginVertical: 10,
//             }}
//             onPress={() => addAttendenceRequest()}>
//             {
//               loading ? <ActivityIndicator size="small" color="#fff" /> :
//                 <Text style={{ color: '#fff' }}>Submit</Text>
//             }
//           </TouchableOpacity>

//           {/* Date Pickers */}
//           <DatePicker
//             modal
//             open={openstartdate}
//             date={startdate}
//             theme='light'
//             mode="date"
//             onConfirm={startdate => {
//               setOpenStartDate(false);
//               setStartDate(startdate);
//             }}
//             onCancel={() => setOpenStartDate(false)}
//           />
//           <DatePicker
//             modal
//             open={startopenpunchintime}
//             date={startpunchintime}
//             theme='light'
//             mode="time"
//             onConfirm={startpunchintime => {
//               setOpenStartPunchInTime(false);
//               setStartPunchInTime(startpunchintime);
//             }}
//             onCancel={() => setOpenStartPunchInTime(false)}
//           />
//           <DatePicker
//             modal
//             open={startopenpunchouttime}
//             date={startpunchouttime}
//             theme='light'
//             mode="time"
//             onConfirm={startpunchouttime => {
//               setOpenStartPunchOutTime(false);
//               setStartPunchOutTime(startpunchouttime);
//             }}
//             onCancel={() => setOpenStartPunchOutTime(false)}
//           />
//         </ScrollView>
//       </Root>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   reportType: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   Date_box: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   input_Text: {
//     height: 100,
//     width: '90%',
//     borderRadius: 8,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingLeft: 10,
//     textAlignVertical: 'top',
//   },
// });

// export default Add_Attendence;






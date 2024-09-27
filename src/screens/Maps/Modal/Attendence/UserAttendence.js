// import { useRoute } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import apiUrl from '../../../../reusable/apiUrl'
// import Reload from '../../../../../Reload';

// const UserAttendence = () => {

// const route = useRoute();
// const user_id = route?.params?.userId;

// const [profileData, setProfileData] = useState([]);
// const [searchQuery, setSearchQuery] = useState('');
// const [filteredData, setFilteredData] = useState([]);

// useEffect(() => {
//   const fetchProfileDetails = async () => {
//     try {
//       const token = await AsyncStorage.getItem('Token');
//       const config = {
//         headers: { Token: token },
//       };
//       const response = await axios.get(
//         `${apiUrl}/SecondPhaseApi/getUserProfile/${user_id}`,
//         config
//       );

//       if (response.data.status === 1) {
//         setProfileData(response.data.data.monthlyAttendance);
//         setFilteredData(response.data.data.monthlyAttendance);
//       } else {
//         console.log("Unexpected status:", response.data.status);
//       }
//     } catch (error) {
//       console.log("Error fetching profile details:", error.response?.data);
//     }
//   };

//   fetchProfileDetails();
// }, [user_id]);

//   // Filter attendance based on search query
//   useEffect(() => {
//     const filtered = profileData.filter((item) => {
//       const searchStr = searchQuery.toLowerCase();
//       return (
//         item?.date.toLowerCase().includes(searchStr) || 
//         item?.leaveStatus.toLowerCase().includes(searchStr)
//       );
//     });
//     setFilteredData(filtered);
//   }, [searchQuery, profileData]);

//   const renderItem = ({ item }) => {
//     let statusIcon;
//     let statusColor;

//     switch (item.leaveStatus) {
//       case 'Present':
//         statusIcon = 'check-circle';
//         statusColor = 'green';
//         break;
//       case 'Absent':
//         statusIcon = 'cancel';
//         statusColor = 'red';
//         break;
//       case 'Weekend':
//         statusIcon = 'remove-circle';
//         statusColor = 'gray';
//         break;
//       default:
//         statusIcon = 'cancel';
//         statusColor = 'red';
//         break;
//     }

//     return (
//       <View style={styles.itemContainer}>
//         <View style={styles.dateContainer}>
//           <Text style={styles.dateText}>{item?.date}</Text>
//           <Text style={styles.dateText}>Working hours <Text style={{color:"blue"}}>{item?.totalWorkingHours ? item?.totalWorkingHours : 'N/A'}</Text></Text>
//         </View>
//         <View style={styles.statusContainer}>
//           <Icon name={statusIcon} size={24} color={statusColor} />
//           <Text style={[styles.statusText, { color: statusColor }]}>
//             {item.leaveStatus}
//           </Text>
//           {item.leaveStatus === 'Present' && (
//             <Text style={styles.timeText}>
//               {item.inTime} - {item.outTime}
//             </Text>
//           )}
//         </View>
//       </View>
//     );
//   };

//   if (profileData.length === 0) {
//     return <Reload />
//   }

//   return (
//     <View style={styles.container}>
//       {/* Search Input */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by date or status"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />

//       <FlatList
//         data={filteredData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 10,
//     paddingVertical: 20,
//   },
//   searchBar: {
//     height: 40,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//   },
//   dateContainer: {
//     flex: 1,
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   statusContainer: {
//     alignItems: 'flex-end',
//     flex: 1,
//   },
//   statusText: {
//     fontSize: 16,
//     marginTop: 5,
//   },
//   timeText: {
//     fontSize: 14,
//     color: '#666',
//   },
// });

// export default UserAttendence;


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import apiUrl from '../../../../reusable/apiUrl'
// import Reload from '../../../../../Reload';
// import { useRoute } from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {
//   responsiveFontSize, responsiveHeight, responsiveWidth
// } from 'react-native-responsive-dimensions';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';



// const UserAttendence = () => {
//   const route = useRoute();
//   const user_id = route?.params?.userId;
//   const [selectedMonth, setSelectedMonth] = useState('September');
//   const [selectedYear, setSelectedYear] = useState('2024');
//   const [date, setDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);

//   const [profileData, setProfileData] = useState([]);
//   const [attendencedata, setAttendenceData] = useState([]);

//   const months = [
//     { label: 'January', value: 'January' },
//     { label: 'February', value: 'February' },
//     { label: 'March', value: 'March' },
//     { label: 'April', value: 'April' },
//     { label: 'May', value: 'May' },
//     { label: 'June', value: 'June' },
//     { label: 'July', value: 'July' },
//     { label: 'August', value: 'August' },
//     { label: 'September', value: 'September' },
//     { label: 'October', value: 'October' },
//     { label: 'November', value: 'November' },
//     { label: 'December', value: 'December' },
//   ];

//   const years = Array.from({ length: 35 }, (_, i) => (1990 + i).toString());

//   useEffect(() => {
//     const fetchProfileDetails = async () => {
//       try {
//         const token = await AsyncStorage.getItem('Token');
//         const config = {
//           headers: { Token: token },
//         };
//         const response = await axios.get(
//           `${apiUrl}/SecondPhaseApi/getUserProfile/${user_id}`,
//           config
//         );
//         if (response.data.status === 1) {
//           setProfileData(response.data.data.leaveDetails);
//           setAttendenceData(response.data.data.userAttendance);
//         } else {
//           console.log("Unexpected status:", response.data.status);
//         }
//       } catch (error) {
//         console.log("Error fetching profile details:", error.response?.data);
//       }
//     };
//     fetchProfileDetails();
//   }, [user_id]);

//   const handleDateChange = (event, selectedDate) => {
//     setShowPicker(false);
//     if (selectedDate) setDate(selectedDate);
//   };

//   if (attendencedata == '') {
//     return <Reload />
//   }

//   const renderLeaveCard = (item, index) => (
//     <View style={[styles.leaveCard, { backgroundColor: ((index % 4 == 0 ? "#007bff" : (index % 3 == 0 ? "#f0ad4e" : (index % 2 == 0 ? "#ff5a5f" : "#28a745")))) }]}>
//       <Text style={styles.leaveText}>{item.leave_type}</Text>
//       <View style={{ backgroundColor: "#fff", width: 50, borderRadius: 10, marginTop: 5, padding: 2 }}>
//         <Text style={styles.leaveCount}>{item.taken_leave}/{item.balance_leave}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.leaveContainer}>
//         <FlatList
//           data={profileData}
//           horizontal
//           renderItem={({ item, index }) => renderLeaveCard(item, index)}
//           keyExtractor={(item) => item.id}
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>
//       {/* Dropdown Section */}
//       <View style={styles.filterContainer}>
//         <TouchableOpacity style={styles.filterButton}>
//           <Picker
//             mode='dropdown'
//             dropdownIconColor="#007bff"
//             selectedValue={selectedMonth}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedMonth(itemValue)}
//           >
//             {months.map((month) => (
//               <Picker.Item key={month.value} label={month.label} value={month.value} />
//             ))}
//           </Picker>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.filterButton}>
//           <Picker
//             mode='dropdown'
//             dropdownIconColor="#007bff"
//             selectedValue={selectedYear}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedYear(itemValue)}
//           >
//             {years.map((year) => (
//               <Picker.Item key={year} label={year} value={year} />
//             ))}
//           </Picker>
//         </TouchableOpacity>
//       </View>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {
//           attendencedata?.map((elements, index) => {
//             return (
//               <View key={index} style={{
//                 width: responsiveWidth(90), backgroundColor: '#fff', alignSelf: 'center', marginTop: Platform.OS == "ios" ? responsiveHeight(3) : responsiveHeight(1.5), borderRadius: 20, borderColor: "#25D1FF", borderWidth: 1,
//                 shadowRadius: 10,
//                 shadowOpacity: 0.6,
//                 elevation: 8,
//                 shadowOffset: {
//                   width: 0,
//                   height: 4
//                 }
//               }}>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 15 }}>
//                   <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(20), textAlign: "center" }}>Date</Text>
//                   <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(15), textAlign: "center" }}>In Time</Text>
//                   <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(25), textAlign: "center" }}>Working H.</Text>

//                 </View>
//                 <View style={{ width: '100%', borderWidth: 0.8, borderColor: '#000', }}>

//                 </View>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 15 }}>
//                   <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(20), textAlign: "center" }}>{elements?.date}</Text>
//                   <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(15), textAlign: "center" }}>{elements?.in_time}</Text>
//                   <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(25), textAlign: "center" }}>{elements?.time_diff}</Text>
//                 </View>
//               </View>

//             )
//           })
//         }
//       </ScrollView>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   leaveContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: "#0D2BD3", padding: 15, borderRadius: 20, borderColor: "#25D1FF", borderWidth: 1

//   },
//   leaveCard: {
//     width: 80,
//     height: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignItems: "center",
//     marginHorizontal: 5,
//     borderRadius: 10,
//   },
//   leaveText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: "center",
//     width: 50
//   },
//   leaveCount: {
//     color: '#000',
//     fontSize: 12, textAlign: "center"
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   filterButton: {
//     padding: 0,
//     borderWidth: 1,
//     borderRadius: 5, borderColor: "#25D1FF", flexDirection: "row"
//   },
//   workHourCard: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   dayText: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   detailText: {
//     color: '#555',
//   },
//   container1: {
//     padding: 20,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   picker: {
//     height: 50,
//     width: 150,
//   },
//   tableContainer: {
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: '#00bfff',
//     borderRadius: 10,
//     padding: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     borderBottomWidth: 1,
//     borderColor: '#000',
//   },
//   header: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   cell: {
//     padding: 10,
//     fontSize: 14,
//   },
// });

// export default UserAttendence;



// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import apiUrl from '../../../../reusable/apiUrl';
// import Reload from '../../../../../Reload';
// import { useRoute } from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {
//   responsiveFontSize, responsiveHeight, responsiveWidth
// } from 'react-native-responsive-dimensions';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';

// const UserAttendence = () => {
//   const route = useRoute();
//   const user_id = route?.params?.userId;

//   // Get current month and year
//   const currentDate = new Date();
//   const monthsList = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
//   const currentMonth = monthsList[currentDate.getMonth()];
//   const currentYear = currentDate.getFullYear().toString();

//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [date, setDate] = useState(new Date());
//   const [profileData, setProfileData] = useState([]);
//   const [attendencedata, setAttendenceData] = useState([]);

//   console.log("attendencedata...........", attendencedata)

//   const months = monthsList.map(month => ({ label: month, value: month }));
//   const years = Array.from({ length: 35 }, (_, i) => (1990 + i).toString());

//   useEffect(() => {
//     const fetchProfileDetails = async () => {
//       try {
//         const token = await AsyncStorage.getItem('Token');
//         const config = {
//           headers: { Token: token },
//         };

//         const response = await axios.get(
//           `${apiUrl}/SecondPhaseApi/getUserProfile/${user_id}?selectedMonth=${selectedMonth}&selectedYear=${selectedYear}`,
//           config
//         );
//         if (response.data.status === 1) {
//           setProfileData(response.data.data.leaveDetails);
//           setAttendenceData(response.data.data.userAttendance);
//         } else {
//           console.log("Unexpected status:", response.data.status);
//         }
//       } catch (error) {
//         console.log("Error fetching profile details:", error.response?.data);
//       }
//     };
//     fetchProfileDetails();
//   }, [user_id, selectedMonth, selectedYear]);


//   if (attendencedata.length === 0) {
//     return <Reload />
//   }

//   const renderLeaveCard = (item, index) => (
//     <View style={[styles.leaveCard, { backgroundColor: ((index % 4 === 0 ? "#007bff" : (index % 3 === 0 ? "#f0ad4e" : (index % 2 === 0 ? "#ff5a5f" : "#28a745")))) }]}>
//       <Text style={styles.leaveText}>{item.leave_type}</Text>
//       <View style={{ backgroundColor: "#fff", width: 50, borderRadius: 10, marginTop: 5, padding: 2 }}>
//         <Text style={styles.leaveCount}>{item.taken_leave}/{item.balance_leave}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.leaveContainer}>
//         <FlatList
//           data={profileData}
//           horizontal
//           renderItem={({ item, index }) => renderLeaveCard(item, index)}
//           keyExtractor={(item) => item.id}
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>
//       {/* Dropdown Section */}
//       <View style={styles.filterContainer}>
//         <TouchableOpacity style={styles.filterButton}>
//           <Picker
//             mode='dropdown'
//             dropdownIconColor="#007bff"
//             selectedValue={selectedMonth}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedMonth(itemValue)}
//           >
//             {months.map((month) => (
//               <Picker.Item key={month.value} label={month.label} value={month.value} />
//             ))}
//           </Picker>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.filterButton}>
//           <Picker
//             mode='dropdown'
//             dropdownIconColor="#007bff"
//             selectedValue={selectedYear}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedYear(itemValue)}
//           >
//             {years.map((year) => (
//               <Picker.Item key={year} label={year} value={year} />
//             ))}
//           </Picker>
//         </TouchableOpacity>
//       </View>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {
//           attendencedata.map((elements, index) => (
//             <View key={index} style={{
//               width: responsiveWidth(90), backgroundColor: '#fff', alignSelf: 'center', marginTop: Platform.OS === "ios" ? responsiveHeight(3) : responsiveHeight(1.5), borderRadius: 20, borderColor: "#25D1FF", borderWidth: 1,
//               shadowRadius: 10,
//               shadowOpacity: 0.6,
//               elevation: 8,
//               shadowOffset: {
//                 width: 0,
//                 height: 4
//               }
//             }}>
//               <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 15 }}>
//                 <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(20), textAlign: "center" }}>Date</Text>
//                 <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(15), textAlign: "center" }}>In Time</Text>
//                 <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(25), textAlign: "center" }}>Working H.</Text>
//               </View>
//               <View style={{ width: '100%', borderWidth: 0.8, borderColor: '#000' }} />
//               <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 15 }}>
//                 <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(20), textAlign: "center" }}>{elements?.date}</Text>
//                 <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(15), textAlign: "center" }}>{elements?.in_time}</Text>
//                 <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(25), textAlign: "center" }}>{elements?.time_diff}</Text>
//               </View>
//             </View>
//           ))
//         }
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   leaveContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: "#0D2BD3", padding: 15, borderRadius: 20, borderColor: "#25D1FF", borderWidth: 1
//   },
//   leaveCard: {
//     width: 80,
//     height: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     borderRadius: 10,
//   },
//   leaveText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: "center",
//     width: 50
//   },
//   leaveCount: {
//     color: '#000',
//     fontSize: 12, textAlign: "center"
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   filterButton: {
//     padding: 0,
//     borderWidth: 1,
//     borderRadius: 5, borderColor: "#25D1FF", flexDirection: "row"
//   },
//   picker: {
//     height: 50,
//     width: 150,
//   },
// });

// export default UserAttendence;



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl';
import Reload from '../../../../../Reload';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';


const UserAttendence = () => {
  const route = useRoute();
  const user_id = route?.params?.userId;
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [profileData, setProfileData] = useState([]);
  const [attendencedata, setAttendenceData] = useState([]);

  console.log("attendencedata........", attendencedata)
  console.log("attendencedata........", selectedMonth)
  console.log("selectedYear........", selectedYear)

  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  const years = Array.from({ length: 35 }, (_, i) => (1990 + i).toString());

  // Mapping of month names to their respective numbers
  const monthMapping = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };

  const monthAsDigit = monthMapping[selectedMonth];
  console.log("monthAsDigit.....", monthAsDigit)

  const fetchProfileDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('Token');
      const config = {
        headers: { Token: token },
      };
      const response = await axios.get(
        `${apiUrl}/SecondPhaseApi/getUserProfile/${user_id}?year=${selectedYear}&month=${monthAsDigit}`,
        config
      );
      if (response.data.status === 1) {
        setProfileData(response.data.data.leaveDetails);
        setAttendenceData(response.data.data.userAttendance);
      } else {
        console.log("Unexpected status:", response.data.status);
      }
    } catch (error) {
      console.log("Error fetching profile details:", error.response?.data);
    }
  };

  useEffect(() => {
    fetchProfileDetails(); // Initial fetch on component mount
  }, [user_id, selectedMonth, selectedYear]); // Empty dependency array

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  if (attendencedata.length === 0) {
    return <Reload />;
  }

  const renderLeaveCard = (item, index) => (
    <View style={[styles.leaveCard, { backgroundColor: ((index % 4 == 0 ? "#007bff" : (index % 3 == 0 ? "#f0ad4e" : (index % 2 == 0 ? "#ff5a5f" : "#28a745")))) }]}>
      <Text style={styles.leaveText}>{item.leave_type}</Text>
      <View style={{ backgroundColor: "#fff", width: 50, borderRadius: 10, marginTop: 5, padding: 2 }}>
        <Text style={styles.leaveCount}>{item.taken_leave}/{item.balance_leave}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.leaveContainer}>
        <FlatList
          data={profileData}
          horizontal
          renderItem={({ item, index }) => renderLeaveCard(item, index)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Dropdown Section */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedMonth(value);
              fetchProfileDetails(); // Fetch new data based on month
            }}
            items={months.map((month) => ({
              label: month.label,
              value: month.value,
            }))}
            value={selectedMonth}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            Icon={() => {
              return <Ionicons name="arrow-down" size={24} color="#007bff" />;
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedYear(value);
              fetchProfileDetails(); // Fetch new data based on year
            }}
            items={years.map((year) => ({
              label: year,
              value: year,
            }))}
            value={selectedYear}
            style={{
              inputIOS: styles.picker,
              inputAndroid: styles.picker,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            Icon={() => {
              return <Ionicons name="arrow-down" size={24} color="#007bff" />;
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {
          attendencedata.map((elements, index) => (
            <View key={index} style={{
              width: responsiveWidth(90), backgroundColor: '#fff', alignSelf: 'center', marginTop: Platform.OS === "ios" ? responsiveHeight(3) : responsiveHeight(1.5), borderRadius: 20, borderColor: "#25D1FF", borderWidth: 1,
              shadowRadius: 10,
              shadowOpacity: 0.6,
              elevation: 8,
              shadowOffset: {
                width: 0,
                height: 4
              }
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 15 }}>
                <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(20), textAlign: "center" }}>Date</Text>
                <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(15), textAlign: "center" }}>In Time</Text>
                <Text style={{ color: '#000', fontSize: responsiveFontSize(2), width: responsiveWidth(25), textAlign: "center" }}>Working H.</Text>
              </View>
              <View style={{ width: '100%', borderWidth: 0.8, borderColor: '#000' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 15 }}>
                <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(20), textAlign: "center" }}>{elements?.date}</Text>
                <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(15), textAlign: "center" }}>{elements?.in_time}</Text>
                <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6), width: responsiveWidth(25), textAlign: "center" }}>{elements?.time_diff}</Text>
              </View>
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  leaveContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: "#0D2BD3", padding: 15, borderRadius: 20, borderColor: "#25D1FF", borderWidth: 1
  },
  leaveCard: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  leaveText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: "center",
    width: 50
  },
  leaveCount: {
    color: '#000',
    fontSize: 12, textAlign: "center"
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#25D1FF",
    flexDirection: "row"
  },
  picker: {
    width: 150,
    height: 50,
    
  },
  
});

export default UserAttendence;

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


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl'
import Reload from '../../../../../Reload';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';


const UserAttendence = () => {
  const route = useRoute();
  const user_id = route?.params?.userId;

  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('Token');
        const config = {
          headers: { Token: token },
        };
        const response = await axios.get(
          `${apiUrl}/SecondPhaseApi/getUserProfile/${user_id}`,
          config
        );

        if (response.data.status === 1) {
          setProfileData(response.data.data.leaveDetails);
        } else {
          console.log("Unexpected status:", response.data.status);
        }
      } catch (error) {
        console.log("Error fetching profile details:", error.response?.data);
      }
    };

    fetchProfileDetails();
  }, [user_id]);


if(profileData == '') {
  return <Reload/>
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
          <Text>Filter by Month     </Text>
          <AntDesign name="down" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text>Filter by Year     </Text>
          <AntDesign name="down" size={20} />
        </TouchableOpacity>
      </View>

      {/* <View style={{
        width: responsiveWidth(90),  backgroundColor: '#fff', alignSelf: 'center', marginTop: Platform.OS == "ios" ? responsiveHeight(3) : responsiveHeight(1.5), borderRadius: 20,  borderColor: "#25D1FF", borderWidth: 1,
        shadowRadius: 10,
        shadowOpacity: 0.6,
        elevation: 8,
        shadowOffset: {
          width: 0,
          height: 4
        }
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' , marginVertical:15 }}>
          <Text style={{ color: '#000', fontSize: responsiveFontSize(2), }}>Monday</Text>
          <Text style={{ color: '#000', fontSize: responsiveFontSize(2) }}>In Time</Text>
          <Text style={{ color: '#000', fontSize: responsiveFontSize(2) }}>Working Hours</Text>

        </View>
        <View style={{ width: '100%', borderWidth: 0.8, borderColor: '#000',  }}>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' , marginVertical:15}}>
          <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6) }}>16 Sep 2024</Text>
          <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6) }}>09:00 AM</Text>
          <Text style={{ color: '#000', fontSize: responsiveFontSize(1.6) }}>09H-03M</Text>
        </View>
      </View> */}
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
    alignItems: "center",
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 5, borderColor: "#25D1FF", flexDirection: "row"
  },
  workHourCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    color: '#555',
  },
});

export default UserAttendence;

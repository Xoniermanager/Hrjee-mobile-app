
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl';
import Reload from '../../../../../Reload';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import RNPickerSelect from 'react-native-picker-select';
import Themes from '../../../../Theme/Theme';


const UserAttendence = () => {
  const theme = useColorScheme();
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
      console.log("response.....................", response?.data)
      if (response.data.status === 1) {
        setProfileData(response?.data?.data?.leaveDetails);
        setAttendenceData(response?.data?.data?.userAttendance);
      } else {
        console.log("Unexpected status:", response.data.status);
      }
    } catch (error) {
      if (error.response) {
        console.log("Error fetching profile details:", error.response.data);
      } else {
        console.log("Error fetching profile details:", error.message);
      }
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
        <Text style={styles.leaveCount}>{item.taken_leave.toFixed(1)}/{item.balance_leave.toFixed(1)}</Text>
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
        <View style={styles.filterButton}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedMonth(value);
              fetchProfileDetails(); // Fetch new data based on month
            }}
            items={months.map((month) => ({
              label: month.label,
              value: month.value,
              color: Themes == 'dark' ? '#000' : '#000'
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
        </View>

        <View style={styles.filterButton}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedYear(value);
              fetchProfileDetails(); // Fetch new data based on year
            }}
            items={years.map((year) => ({
              label: year,
              value: year,
              color: Themes == 'dark' ? '#000' : '#000'
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
        </View>
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
    backgroundColor:"#e3eefb"
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

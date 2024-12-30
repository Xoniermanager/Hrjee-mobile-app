import { useRoute } from '@react-navigation/native';
import React, { useFocusEffect, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl'
import Reload from '../../../../../Reload';

const LeaveItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{item.leave_type}</Text>
    <View style={styles.leaveDetails}>
      <View>
        <Text style={styles.label}>Closing</Text>
        <Text style={styles.value}>{item.taken_leave}</Text>
      </View>
      <View>
        <Text style={styles.label}>Availed</Text>
        <Text style={styles.value}>{item.balance_leave}</Text>
      </View>
    </View>
    {/* <TouchableOpacity style={styles.applyButton}>
      <Text style={styles.applyText}>Apply</Text>
    </TouchableOpacity> */}
  </View>
);


const UserLeave = () => {
  const route = useRoute();
  const user_id = route?.params?.userId;
  const [leaveData, setLeaveData] = useState([]);

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
          setLeaveData(response.data.data.leaveDetails); // Assuming `monthlyAttendance` is the key for leave data
        } else {
          console.log("Unexpected status:", response.data.status);
        }
      } catch (error) {
        console.log("Error fetching profile details:", error.response?.data);
      }
    };

    fetchProfileDetails();
  }, [user_id]);


  if (leaveData == "") {
    return <Reload />
  }


  return (
    <View style={{ flex: 1, backgroundColor: "#e3eefb" }}>
      <FlatList
        data={leaveData}
        renderItem={({ item }) => <LeaveItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  leaveDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f76c6c',
  },
  applyButton: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 10,
    borderRadius: 5,
  },
  applyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserLeave;

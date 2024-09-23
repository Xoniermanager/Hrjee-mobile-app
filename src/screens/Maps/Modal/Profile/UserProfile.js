import { useRoute } from '@react-navigation/native';
import React, { useFocusEffect, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl'
import Reload from '../../../../../Reload';

const UserProfile = () => {
  const route = useRoute();
  const user_id = route?.params?.userId
  const [profileuser, setProfileUser] = useState('')

  useEffect(() => {
    const fetchPolicyDetails = async () => {
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
          setProfileUser(response.data.data.profile)
        } else {
          console.log("Unexpected status:", response.data.status);
        }
      } catch (error) {
        console.log("Error fetching policy details:", error.response?.data);
      }
    };

    fetchPolicyDetails();
  }, [user_id]); 

  if(profileuser == "") {
    return <Reload/>
  }

  console.log("profileuser?.image.................", profileuser?.image)

  return (
    <View style={styles.container}>
      {/* Profile Picture and Name */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: profileuser?.image || `https://i.postimg.cc/Dzc182v8/profileimage.jpg`,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profileuser?.FULL_NAME}</Text>
        <Text style={styles.designation}>{profileuser?.job_deg}</Text>
        {/* <Text style={styles.designation}>{profileuser?.EMPLOYEE_NUMBER}</Text> */}
      </View>

      {/* Leave and Payslip Info */}
      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.infoItem}>
          <Icon name="flight" size={30} color="#ff5a5f" />
          <Text style={styles.infoText}>2 Taken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem}>
          <Icon name="description" size={30} color="#ff5a5f" />
          <Text style={styles.infoText}>3 Available</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info */}
      <View style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <Octicons name="person" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.EMPLOYEE_NUMBER}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="email" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.email}</Text>
        </View>

        <View style={styles.contactItem}>
          <Icon name="phone" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.mobile_no}</Text>
        </View>

        <View style={styles.contactItem}>
          <Icon name="location-on" size={25} color="#666" />
          <Text style={styles.contactText}>
            {profileuser?.permanent_address}
          </Text>
        </View>

        <View style={styles.contactItem}>
          <Icon name="chat" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.comment ? profileuser?.comment : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  profileHeader: {
    backgroundColor: '#0528A5',
    paddingVertical: 30,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode:"contain"
  },
  name: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  designation: {
    fontSize: 16,
    color: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginTop: -20,
    elevation: 2,
    borderRadius: 10,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  contactContainer: {
    padding: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default UserProfile;


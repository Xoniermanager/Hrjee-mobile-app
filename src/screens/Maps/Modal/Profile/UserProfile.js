import { useRoute } from '@react-navigation/native';
import React, { useFocusEffect, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl'
import Reload from '../../../../../Reload';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';


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

  if (profileuser == "") {
    return <Reload />
  }


  return (
    <View style={styles.container}>
      {/* Profile Picture and Name */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: profileuser?.image || 'https://i.postimg.cc/2yhHnyQy/profile-pic.webp',
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
          <Octicons name="person" size={30} color="#ff5a5f" />
          <Text style={styles.infoText}>{profileuser?.EMPLOYEE_NUMBER}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem}>
          <Ionicons name="timer" size={30} color="#ff5a5f" />
          <Text style={styles.infoText}>{profileuser?.office_timing}</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info */}
      <View style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <Icon name="email" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Entypo name="flow-branch" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.branch_name? profileuser?.branch_name : 'N/A'}</Text>
        </View>

        <View style={styles.contactItem}>
          <Icon name="phone" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.mobile_no}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="phone" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.family_contact_no ? profileuser?.family_contact_no : 'N/A'}</Text>
        </View>
        <View style={styles.contactItem}>
          <FontAwesome name="transgender-alt" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.SEX ? profileuser?.SEX : 'N/A'}</Text>
        </View>

        <View style={styles.contactItem}>
          <Icon name="location-on" size={25} color="#666" />
          <Text style={styles.contactText}>
            {profileuser?.permanent_address}
          </Text>
        </View>

        {/* <View style={styles.contactItem}>
          <Icon name="chat" size={25} color="#666" />
          <Text style={styles.contactText}>{profileuser?.comment ? profileuser?.comment : 'N/A'}</Text>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3eefb',
  },
  profileHeader: {
    backgroundColor: '#0528A5',
    paddingVertical: 30,
    alignItems: 'center',
  },
  profileImage: {
    width: responsiveHeight(10), height: responsiveHeight(10), borderRadius: 100, resizeMode: "cover"

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


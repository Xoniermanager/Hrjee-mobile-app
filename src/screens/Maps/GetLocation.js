import { useNavigation, ActivityIndicator } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reload from '../../../Reload';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const GetLocation_id = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const userId = route?.params?.userId

  const [loading, setloading] = useState(false);


  // const userId=43800011

  // const navigation = useNavigation()

  // const { setContextState, contextState } = useContext(SocketContext)
  // useEffect(() => {
  //   const socket = io('https://websocket.hrjee.com:6370/');

  //   // Function to handle subscription to a user's location updates
  //   const subscribeToUser = (userId) => {
  //     socket.emit('subscribeToUser', userId); // ---
  //     socket.emit('requestLocationData', userId); //first time data
  //     console.log(`Subscribed to updates for user: ${userId}`);
  //   };

  //   // Listen for location updates from the server
  //   socket.on('locationData', (data) => {
  //     console.log(data, 'yashu')
  //     if (data?.firstLocation == null) {
  //       alert("Location not Allow")
  //     }
  //     else {
  //       setContextState(data)
  //       console.log(data, 'yashu')
  //       navigation.navigate('Maps')
  //     }

  //   });

  //   // Handle connection errors
  //   socket.on('connect_error', (err) => {
  //     console.error(`Connection error: ${err.message}`);
  //   });

  //   subscribeToUser(userId ? userId : 1)
  // }, [])

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .get(`${apiUrl}/secondPhaseApi/get_locations?user_id=${userId}`, config)
      .then(response => {
        // console.log("respone==============", response?.data?.data)
        if (response.data.status == 1) {
          setloading(false);
          try {
            console.log("res---------", response?.data)
          } catch (e) {
            console.log(e);
          }
        } else {
          setloading(false);
        }
      })
      .catch(error => {
        console.log("erro.....", error?.response?.data)
        setloading(false)
        if (error.response.status == '401') {
          AsyncStorage.removeItem('UserData'),
            AsyncStorage.removeItem('UserLocation'),
            navigation.navigate('Login')
        }
      });
  };



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../images/1.webp')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default GetLocation_id
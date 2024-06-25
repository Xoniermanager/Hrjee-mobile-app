import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import io from 'socket.io-client';
import { SocketContext } from '../../tracking/SocketContext';

const GetLocation_id = ({route}) => {
  const navigation=useNavigation()
    const userId = 4572;
    const {setContextState}=useContext(SocketContext)

    useEffect(()=>{
        const socket = io('https://app.hrjee.com:6370');
    
        // Function to handle subscription to a user's location updates
        const subscribeToUser = (userId) => {
            socket.emit('subscribeToUser', userId); // ---
            socket.emit('requestLocationData', userId); //first time data
            console.log(`Subscribed to updates for user: ${userId}`);
        };
    
        // Listen for location updates from the server
        socket.on('locationData', (data) => {
          setContextState(data)
          console.log(data,'yashu')
          navigation.navigate('Maps')
        });
    
        // Handle connection errors
        socket.on('connect_error', (err) => {
            console.error(`Connection error: ${err.message}`);
        });
    
        subscribeToUser(userId ? userId : 4572)
    },[])
  

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
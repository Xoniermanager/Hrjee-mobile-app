import { useNavigation,ActivityIndicator } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import io from 'socket.io-client';
import { SocketContext } from '../../tracking/SocketContext';
import Reload from '../../../Reload';

const GetLocation_id = ({route}) => {
  const {userId}=route?.params;
  // const userId=43800011

  const navigation=useNavigation()

    const {setContextState,contextState}=useContext(SocketContext)
    useEffect(()=>{
        const socket = io('https://websocket.hrjee.com:6370/');
    
        // Function to handle subscription to a user's location updates
        const subscribeToUser = (userId) => {
            socket.emit('subscribeToUser', userId); // ---
            socket.emit('requestLocationData', userId); //first time data
            console.log(`Subscribed to updates for user: ${userId}`);
        };
    
        // Listen for location updates from the server
        socket.on('locationData', (data) => {
          console.log(data,'yashu')
          if(data?.firstLocation==null){
            alert("Location not Allow")
          }
          else{
            setContextState(data)
            console.log(data,'yashu')
            navigation.navigate('Maps')
          }
         
        });
    
        // Handle connection errors
        socket.on('connect_error', (err) => {
            console.error(`Connection error: ${err.message}`);
        });
    
        subscribeToUser(userId ? userId : 1)
    },[])

   
      return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
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
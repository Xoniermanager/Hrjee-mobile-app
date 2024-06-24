import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Text,
  } from 'react-native';
import { SocketContext } from '../../tracking/SocketContext';
import io from 'socket.io-client';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const GetLocation_id = ({route}) => {
    const [origin,setOrigin]=useState({latitude: 28.6252665, longitude: 77.2960197 })
    const [destination,setDestination]=useState({ latitude: 28.5704429, longitude: 77.239417})
    const { sendLocation } = useContext(SocketContext);
    const userId = 1;

    useEffect(()=>{
        const socket = io('https://app.hrjee.com:6370');
           const closeConnection = (userId) => {
            socket.emit('closeConnection', userId);
            console.log(`Close connection for: ${userId}`);
        };
    
    
    
        // Function to handle subscription to a user's location updates
        const subscribeToUser = (userId) => {
            socket.emit('subscribeToUser', userId); // ---
            socket.emit('requestLocationData', userId); //first time data
            console.log(`Subscribed to updates for user: ${userId}`);
        };
    
        // Function to update the location data on the page
        const updateLocationData = (data) => {
            console.log(data);
            const { userId, firstLocation, currentLocation } = data;
            var startPoint = [firstLocation?.latitude, firstLocation?.longitude];
            var waypoints = [startPoint];
            const newEndPoint = [currentLocation?.latitude, currentLocation?.longitude];
            const lastEndPoint = waypoints[waypoints.length - 1];
            console.log('lastEndPoint',newEndPoint ,lastEndPoint);
        // return   <Maps lastEndPoint={lastEndPoint} newEndPoint= {newEndPoint} />
     setOrigin({latitude: lastEndPoint[0], longitude:lastEndPoint[1] }); // Origin coordinates
        setDestination( { latitude: newEndPoint[0], longitude: newEndPoint[1]});
        };
    
        // Listen for location updates from the server
        socket.on('locationData', (data) => {
            updateLocationData(data);
        });
    
        // Handle connection errors
        socket.on('connect_error', (err) => {
            console.error(`Connection error: ${err.message}`);
        });
    
        subscribeToUser(userId ? userId : 1)
    },[])
    console.log(origin,'origin')
 return (
    <View style={styles.container}>
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: (origin?.latitude + destination?.latitude) / 2,
        longitude: (origin?.longitude + destination?.longitude) / 2,
        latitudeDelta: Math.abs(origin?.latitude - destination?.latitude) * 2,
        longitudeDelta: Math.abs(origin?.longitude - destination?.longitude) * 2,
      }}
    >
      <Marker coordinate={origin} title="Origin" />
      <Marker coordinate={destination} title="Destination" />
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey="AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg" // Replace with your API key
        strokeWidth={3}
        strokeColor="blue"
      />
    </MapView>
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
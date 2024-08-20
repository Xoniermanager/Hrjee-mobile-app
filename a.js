import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import apiUrl from '../../reusable/apiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Maps = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDistance, setTotalDistance] = useState(0);
  const mapRef = useRef(null);

  const userId = 4572;

useEffect(() => {
  fetchLocations();
  const intervalId = setInterval(fetchLocations, 60000);
  return () => clearInterval(intervalId);
}, []);

const fetchLocations = async () => {
  try {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const response = await axios.get(`${apiUrl}/secondPhaseApi/get_new_locations?user_id=${userId}`, config);
    const newLocations = response.data.data;

    console.log("Fetched locations:", newLocations);

    if (Array.isArray(newLocations)) {
      setLocations(prevLocations => [...prevLocations, ...newLocations]);
      calculateTotalDistance([...locations, ...newLocations]);
    } else {
      console.error('Fetched data is not an array:', newLocations);
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
  } finally {
    setLoading(false);
  }
};

  const calculateTotalDistance = (points) => {
    if (!Array.isArray(points) || points.length < 2) return;

    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += getDistance(
        { latitude: points[i].latitude, longitude: points[i].longitude },
        { latitude: points[i + 1].latitude, longitude: points[i + 1].longitude }
      );
    }
    setTotalDistance(totalDistance / 1000);
  };

  const getDistance = (pointA, pointB) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters

    const lat1 = toRad(pointA.latitude);
    const lat2 = toRad(pointB.latitude);
    const deltaLat = toRad(pointB.latitude - pointA.latitude);
    const deltaLon = toRad(pointB.longitude - pointA.longitude);

    const a = Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 28.65553,
              longitude: 77.23165,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {locations.length > 0 && locations.map((loc, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                title={index === 0 ? 'Start Location' : 'Current Location'}
                pinColor={index === 0 ? 'blue' : 'red'}
              />
            ))}
            {locations.length > 1 && (
              <Polyline
                coordinates={locations.map(loc => ({
                  latitude: loc.latitude,
                  longitude: loc.longitude
                }))}
                strokeColor="#000"
                strokeWidth={3}
              />
            )}
          </MapView>
          <View style={{ padding: 10 }}>
            <Text>Total Distance: {totalDistance.toFixed(2)} km</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default Maps;
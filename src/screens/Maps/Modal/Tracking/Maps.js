
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import apiUrl from '../../../../reusable/apiUrl';
import haversine from 'haversine'; // Import haversine
import { Card } from 'react-native-paper';


const { width, height } = Dimensions.get('window');

const Maps = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user_id = route?.params?.userId
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapDataApi, setMapDataApi] = useState([]);
  const [isPunchedOut, setIsPunchedOut] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0); // State for total distance
  const mapDataApiRef = useRef(mapDataApi);
  mapDataApiRef.current = mapDataApi;

  const GOOGLEMAPKEY = "AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg"


  useEffect(() => {
    getFirstLocation();
  }, []);

  useEffect(() => {
    if (mapDataApi.length > 0) {
      const lastLocation = mapDataApi[mapDataApi.length - 1];
      if (lastLocation && lastLocation.latitude && lastLocation.longitude) {
        setRegion({
          latitude: parseFloat(mapDataApi[mapDataApi.length - 1].latitude),
          longitude: parseFloat(mapDataApi[mapDataApi.length - 1].longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        if (mapDataApi.length > 1) {
          setOrigin(mapDataApi[0]);
          setDestination(lastLocation);
          calculateTotalDistance(mapDataApi); // Calculate the distance
        }
      }
    } else {
      setRegion({
        latitude: 28.6139,
        longitude: 77.2090,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    }
  }, [mapDataApi]);

  const getFirstLocation = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    axios
      .get(`${apiUrl}/secondPhaseApi/get_locations?user_id=${user_id}`, config)
      .then(response => {
        setLoading(false);
        if (response.data.status === 1) {
          const responseData = response?.data?.data;
          const finalCoordinates = [];

          // Add punch_in location
          if (responseData?.punch_in_details) {
            finalCoordinates.push({
              latitude: parseFloat(responseData?.punch_in_details?.latitude),
              longitude: parseFloat(responseData?.punch_in_details?.longitude),
              type: 'punch_in'
            });
          }

          // Add recorded locations
          responseData?.locations?.forEach(element => {
            finalCoordinates.push({
              latitude: parseFloat(element?.latitude),
              longitude: parseFloat(element?.longitude),
              type: 'location'
            });
          });

          // Add punch_out location
          if (responseData?.punch_out_details) {
            finalCoordinates.push({
              latitude: parseFloat(responseData?.punch_out_details?.latitude),
              longitude: parseFloat(responseData?.punch_out_details?.longitude),
              type: 'punch_out'
            });
            setIsPunchedOut(true);
          }

          setMapDataApi(finalCoordinates);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        alert(error?.response?.data?.message)
      });
  };

  useEffect(() => {
    let interval;
    if (!isPunchedOut) {
      interval = setInterval(() => {
        getNewLocation();
      }, 30000); // Fetch new location every minute
    }
    return () => clearInterval(interval);
  }, [isPunchedOut]);


  const getNewLocation = async () => {
    if (isPunchedOut) return; // Stop fetching if punched out

    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    axios
      .get(`${apiUrl}/secondPhaseApi/get_new_locations?user_id=${user_id}`, config)
      .then(response => {
        if (response.data.status === 1) {
          const responseData = response?.data?.data;
          const finalNewCoordinates = [...mapDataApiRef.current];
          responseData.forEach(element => {
            finalNewCoordinates.push({
              latitude: parseFloat(element?.latitude),
              longitude: parseFloat(element?.longitude),
              type: 'location'
            });
          });

          setMapDataApi(finalNewCoordinates);
        }
      })
      .catch(error => {
        console.log("new location error.....", error?.response?.data?.message)
      });
  };

  useEffect(() => {
    if (mapDataApi.length > 1) {
      setOrigin(mapDataApi[0])
      setDestination(mapDataApi[mapDataApi.length - 1])
    }
  }, [mapDataApi])



  const calculateTotalDistance = (coordinates) => {
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = {
        latitude: coordinates[i].latitude,
        longitude: coordinates[i].longitude,
      };
      const end = {
        latitude: coordinates[i + 1].latitude,
        longitude: coordinates[i + 1].longitude,
      };
      totalDistance += haversine(start, end, { unit: 'meter' });
    }
    setTotalDistance(totalDistance);
  };


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loaderText}>Fetching location data...</Text>
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.mapContainer}
        initialRegion={{
          latitude: 28.6139,
          longitude: 77.2090,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={region}
        tappable
      >
        {
          mapDataApi?.length > 0 ?
            mapDataApi.length == 1 ?
              <Marker
                key={`api-marker-${0}`}
                coordinate={mapDataApi[0]}
                title={mapDataApi[0]?.type === 'punch_in' ? 'Punch In' : mapDataApi[0]?.type === 'punch_out' ? 'Punch Out' : `Current Location`}
                pinColor={mapDataApi[0]?.type === 'punch_in' ? 'blue' : mapDataApi[0]?.type === 'punch_out' ? 'red' : 'green'}
              />
              :
              <>
                <Marker
                  key={`api-marker-${0}`}
                  coordinate={mapDataApi[0]}
                  title={mapDataApi[0]?.type === 'punch_in' ? 'Punch In' : mapDataApi[0]?.type === 'punch_out' ? 'Punch Out' : `Current Location`}
                  pinColor={mapDataApi[0]?.type === 'punch_in' ? 'blue' : mapDataApi[0]?.type === 'punch_out' ? 'red' : 'green'}
                />
                <Marker
                  key={`api-marker-${mapDataApi.length - 1}`}
                  coordinate={mapDataApi[mapDataApi.length - 1]}
                  title={mapDataApi[mapDataApi.length - 1]?.type === 'punch_in' ? 'Punch In' : mapDataApi[mapDataApi.length - 1]?.type === 'punch_out' ? 'Punch Out' : `Current Location`}
                  pinColor={mapDataApi[mapDataApi.length - 1]?.type === 'punch_in' ? 'blue' : mapDataApi[mapDataApi.length - 1]?.type === 'punch_out' ? 'red' : 'green'}
                />
              </>
            : null
        }

        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLEMAPKEY}
            optimizeWaypoints={true}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
      </MapView>
      <Card style={styles.infoCard}>
        <Text style={styles.infoText}>
          {origin && destination
            ? `Total Distance: ${(totalDistance / 1000).toFixed(2)} km`
            : 'No route data available'}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
});

export default Maps;


//-------------------------------------------------------------------------------------------------------------------------------------------------------

// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View, ActivityIndicator, Dimensions, Text } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import apiUrl from '../../reusable/apiUrl';

// const { width, height } = Dimensions.get('window');

// const Maps = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const user_id = route?.params?.userId
//   const mapRef = useRef(null);
//   const [region, setRegion] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [mapDataApi, setMapDataApi] = useState([]);
//   const [mapDataNewApi, setMapNewDataApi] = useState([]);
//   const [isPunchedOut, setIsPunchedOut] = useState(false);
//   const [totalDistance, setTotalDistance] = useState(0);
//   const [locations, setLocations] = useState([]);


//   useEffect(() => {
//     getFirstLocation();
//   }, []);

//   useEffect(() => {
//     if (mapDataApi.length > 0) {
//       setRegion({
//         latitude: parseFloat(mapDataApi[mapDataApi.length - 1].latitude),
//         longitude: parseFloat(mapDataApi[mapDataApi.length - 1].longitude),
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       });
//     }
//   }, [mapDataApi]);

//   const getFirstLocation = async () => {
//     setLoading(true);
//     const token = await AsyncStorage.getItem('Token');
//     const config = {
//       headers: { Token: token },
//     };

//     axios
//       .get(`${apiUrl}/secondPhaseApi/get_locations?user_id=${user_id}`, config)
//       .then(response => {
//         if (response.data.status === 1) {
//           const responseData = response?.data?.data;
//           const finalCoordinates = [];

//           // Add punch_in location
//           if (responseData?.punch_in_details) {
//             finalCoordinates.push({
//               latitude: parseFloat(responseData?.punch_in_details?.latitude),
//               longitude: parseFloat(responseData?.punch_in_details?.longitude),
//               type: 'punch_in'
//             });
//           }

//           // Add recorded locations
//           responseData?.locations?.forEach(element => {
//             finalCoordinates.push({
//               latitude: parseFloat(element?.latitude),
//               longitude: parseFloat(element?.longitude),
//               type: 'location'
//             });
//           });

//           // Add punch_out location
//           if (responseData?.punch_out_details) {
//             finalCoordinates.push({
//               latitude: parseFloat(responseData?.punch_out_details?.latitude),
//               longitude: parseFloat(responseData?.punch_out_details?.longitude),
//               type: 'punch_out'
//             });
//             setIsPunchedOut(true);
//           }

//           setMapDataApi(finalCoordinates);
//         }
//         setLoading(false);
//       })
//       .catch(error => {
//         alert(error?.response?.data?.message);
//         setLoading(false);
//         if (error.response.status === 401) {
//           AsyncStorage.removeItem('UserData');
//           AsyncStorage.removeItem('UserLocation');
//           navigation.navigate('Login');
//         }
//       });
//   };

//   useEffect(() => {
//     let interval;
//     if (!isPunchedOut) {
//       interval = setInterval(() => {
//         getNewLocation();
//       }, 60000); // Fetch new location every minute
//     }
//     return () => clearInterval(interval);
//   }, [isPunchedOut]);

//   const getNewLocation = async () => {
//     if (isPunchedOut) return; // Stop fetching if punched out

//     const token = await AsyncStorage.getItem('Token');
//     const config = {
//       headers: { Token: token },
//     };

//     axios
//       .get(`${apiUrl}/secondPhaseApi/get_new_locations?user_id=${user_id}`, config)
//       .then(response => {
//         if (response.data.status === 1) {
//           const responseData = response?.data?.data;
//           const finalNewCoordinates = [...mapDataApi]; // Start with existing coordinates

//           if (Array.isArray(responseData)) {
//             setLocations(prevLocations => [...prevLocations, ...responseData]);
//             calculateTotalDistance([...locations, ...responseData]);
//           } else {
//             console.error('Fetched data is not an array:', responseData);
//           }

//           if (responseData?.punch_out_details) {
//             finalNewCoordinates.push({
//               latitude: parseFloat(responseData?.punch_out_details?.latitude),
//               longitude: parseFloat(responseData?.punch_out_details?.longitude),
//               type: 'punch_out'
//             });
//             setIsPunchedOut(true);
//           }

//           setMapNewDataApi(finalNewCoordinates);
//         }
//       })
//       .catch(error => {
//         console.log("error.....", error?.response?.data);
//         if (error.response.status === 401) {
//           AsyncStorage.removeItem('UserData');
//           AsyncStorage.removeItem('UserLocation');
//           navigation.navigate('Login');
//         }
//       });
//   };

//   const calculateTotalDistance = (points) => {
//     if (!Array.isArray(points) || points.length < 2) return;

//     let totalDistance = 0;
//     for (let i = 0; i < points.length - 1; i++) {
//       totalDistance += getDistance(
//         { latitude: points[i].latitude, longitude: points[i].longitude },
//         { latitude: points[i + 1].latitude, longitude: points[i + 1].longitude }
//       );
//     }
//     setTotalDistance(totalDistance / 1000);
//   };

//   const getDistance = (pointA, pointB) => {
//     const toRad = (x) => (x * Math.PI) / 180;
//     const R = 6371e3; // Earth's radius in meters

//     const lat1 = toRad(pointA.latitude);
//     const lat2 = toRad(pointB.latitude);
//     const deltaLat = toRad(pointB.latitude - pointA.latitude);
//     const deltaLon = toRad(pointB.longitude - pointA.longitude);

//     const a = Math.sin(deltaLat / 2) ** 2 +
//       Math.cos(lat1) * Math.cos(lat2) *
//       Math.sin(deltaLon / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

//   if (loading) {
//     return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" />;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         ref={mapRef}
//         style={styles.mapcontainer}
//         initialRegion={{
//           latitude: 34.0522,
//           longitude: -118.2437,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//         region={region}
//       >
//         {mapDataApi.map((coordinate, index) => (
//           <Marker
//             key={`api-marker-${index}`}
//             coordinate={coordinate}
//             title={coordinate.type === 'punch_in' ? 'Punch In' : coordinate.type === 'punch_out' ? 'Punch Out' : `Location ${index + 1}`}
//             pinColor={coordinate.type === 'punch_in' ? 'blue' : coordinate.type === 'punch_out' ? 'red' : 'green'}
//           />
//         ))}

//         {locations.length > 0 && locations.map((loc, index) => (
//           <Marker
//             key={index}
//             coordinate={{ latitude: parseFloat(loc.latitude), longitude: parseFloat(loc.longitude )}}
//             title={index === 0 ? 'Current Location' : `Location ${index + 1}`}
//             pinColor="red"
//           />
//         ))}


//         {locations.length > 1 && (
//           <Polyline
//             coordinates={locations.map(loc => ({
//               latitude: parseFloat(loc.latitude),
//               longitude: parseFloat(loc.longitude)
//             }))}
//             strokeColor="#000"
//             strokeWidth={3}
//           />
//         )}

//         {mapDataApi.length > 1 && mapDataApi.map((_, index) => {
//           if (index < mapDataApi.length - 1) {
//             return (
//               <MapViewDirections
//                 key={index}
//                 origin={mapDataApi[index]}
//                 destination={mapDataApi[index + 1]}
//                 apikey={"AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg"}
//                 strokeWidth={3}
//                 strokeColor="blue"
//               />
//             );
//           }
//           return null;
//         })}

// {mapDataNewApi.length > 1 && mapDataNewApi.map((_, index) => {
//   if (index < mapDataNewApi.length - 1) {
//     return (
//       <MapViewDirections
//         key={`new-api-direction-${index}`}
//         origin={mapDataNewApi[index]}
//         destination={mapDataNewApi[index + 1]}
//         apikey={"AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg"}
//         strokeWidth={3}
//         strokeColor="blue"
//       />
//     );
//   }
//   return null;
// })}
//       </MapView>
//       <View style={{ padding: 10 }}>
//         <Text>Total Distance: {totalDistance} km</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mapcontainer: {
//     flex: 1,
//     width: width,
//     height: height,
//   },
// });

// export default Maps;

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import apiUrl from '../../reusable/apiUrl';
const { width, height } = Dimensions.get('window');
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
const Maps = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user_id = route?.params?.userId;
  console.log("user_id", user_id)
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapDataApi, setMapDataApi] = useState([]);
  const [isPunchedOut, setIsPunchedOut] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [lastRecordedLocation, setLastRecordedLocation] = useState(null); // Track the last recorded location
  useEffect(() => {
    getFirstLocation();
  }, []);
  useEffect(() => {
    if (mapDataApi.length > 0) {
      setRegion({
        latitude: parseFloat(mapDataApi[mapDataApi.length - 1].latitude),
        longitude: parseFloat(mapDataApi[mapDataApi.length - 1].longitude),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      let distance = 0;
      for (let i = 0; i < mapDataApi.length - 1; i++) {
        const point1 = mapDataApi[i];
        const point2 = mapDataApi[i + 1];
        distance += getDistance(
          parseFloat(point1.latitude),
          parseFloat(point1.longitude),
          parseFloat(point2.latitude),
          parseFloat(point2.longitude)
        );
      }
      setTotalDistance(distance);
    }
  }, [mapDataApi]);
  const getFirstLocation = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    try {
      const response = await axios.get(`${apiUrl}/secondPhaseApi/get_locations?user_id=${user_id}`, config);
      console.log("response--------------", response?.data?.data?.punch_in_details)
      if (response.data.status === 1) {
        const responseData = response?.data?.data;
        const finalCoordinates = [];
        if (responseData?.punch_in_details) {
          finalCoordinates.push({
            latitude: parseFloat(responseData?.punch_in_details?.latitude),
            longitude: parseFloat(responseData?.punch_in_details?.longitude),
            type: 'punch_in',
          });
        }
        if (responseData?.punch_out_details) {
          finalCoordinates.push({
            latitude: parseFloat(responseData?.punch_out_details?.latitude),
            longitude: parseFloat(responseData?.punch_out_details?.longitude),
            type: 'punch_out',
          });
          setIsPunchedOut(true);
        } else if (responseData?.locations?.length > 0) {
          const lastLocation = responseData.locations[responseData.locations.length - 1];
          finalCoordinates.push({
            latitude: parseFloat(lastLocation?.latitude),
            longitude: parseFloat(lastLocation?.longitude),
            type: 'last_location',
          });
        }
        setMapDataApi(finalCoordinates);
        setLastRecordedLocation(finalCoordinates[finalCoordinates.length - 1]); // Initialize the last recorded location
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response?.data?.message);
      setLoading(false);
      if (error.response.status === 401) {
        AsyncStorage.removeItem('UserData');
        AsyncStorage.removeItem('UserLocation');
        navigation.navigate('Login');
      }
    }
  };
  useEffect(() => {
    // Watch the user's location and send data if distance exceeds 200 meters
    const watchId = Geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (lastRecordedLocation) {
          const distance = getDistance(
            lastRecordedLocation.latitude,
            lastRecordedLocation.longitude,
            latitude,
            longitude
          );
          if (distance >= 0) { // 200 meters in kilometers
            try {
              // Send location data to backend
              const token = await AsyncStorage.getItem('Token');
              const config = {
                headers: { Token: token },
              };
              await axios.post(
                `${apiUrl}/yourApiEndpoint`,
                { latitude, longitude },
                config
              );
              setLastRecordedLocation({ latitude, longitude }); // Update the last recorded location
            } catch (error) {
              // Alert.alert("Error", "Failed to send location data.");
            }
          }
        }
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, distanceFilter: 10 } // Adjust distanceFilter as needed
    );
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [lastRecordedLocation]);
  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" />;
  }
  console.log("mapDataApi......", mapDataApi)
  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.mapcontainer}
        initialRegion={{
          latitude: 34.0522,
          longitude: -118.2437,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={region}
      >
        {mapDataApi.map((coordinate, index) => (
          <Marker
            key={`api-marker-${index}`}
            coordinate={coordinate}
            title={
              coordinate.type === 'punch_in'
                ? 'Punch In'
                : coordinate.type === 'punch_out'
                  ? 'Punch Out'
                  : 'Last Recorded Location'
            }
            pinColor={coordinate.type === 'punch_in' ? 'blue' : 'red'}
          />
        ))}
        {mapDataApi.length > 1 && mapDataApi.map((_, index) => {
          if (index < mapDataApi.length - 1) {
            return (
              <MapViewDirections
                key={`new-api-direction-${index}`}
                origin={mapDataApi[index]}
                destination={mapDataApi[index + 1]}
                apikey={"AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg"}
                strokeWidth={3}
                strokeColor="blue"
              />
            );
          }
          return null;
        })}
      </MapView>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>Total Distance: {totalDistance.toFixed(2)} km</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mapcontainer: {
    flex: 1,
    width: width,
    height: height,
  },
  distanceContainer: {
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
});
export default Maps;










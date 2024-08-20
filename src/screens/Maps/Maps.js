// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View, ActivityIndicator, Dimensions, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker
// import apiUrl from '../../reusable/apiUrl';
// import MapViewDirections from 'react-native-maps-directions';
// import { useRoute } from '@react-navigation/native';

// var { width, height } = Dimensions.get('window')

// const Maps = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const user_id = route?.params?.userId
//   const mapRef = useRef(null);
//   const [region, setRegion] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [mapDataApi, setMapDataApi] = useState('');
//   const [mapDataNewApi, setMapNewDataApi] = useState('');

//   Alert.alert('New Location',JSON.stringify(mapDataNewApi))


//   useEffect(() => {
//     getFirstLocation();
//     getNewLocation()
//   }, []);

//   useEffect(() => {
//     if (mapDataApi.length > 0) {
//       setRegion({
//         latitude: parseFloat(mapDataApi[mapDataApi.length - 1].latitude),
//         longitude: parseFloat(mapDataApi[mapDataApi.length - 1].longitude),
//         latitudeDelta: 5,
//         longitudeDelta: 5,
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
//       .get(`${apiUrl}/secondPhaseApi/get_locations?user_id=4572`, config)
//       .then(response => {
//         if (response.data.status === 1) {
//           response = response?.data?.data;
//           let finalCoordinates = [
//             {
//               latitude: parseFloat(response?.punch_in_details?.latitude),
//               longitude: parseFloat(response?.punch_in_details?.longitude),
//             }
//           ]

//           response?.locations?.forEach(element => {
//             finalCoordinates.push({
//               latitude: parseFloat(element?.latitude),
//               longitude: parseFloat(element?.longitude),
//             })
//           });

//           if (response?.punch_out_details) {
//             finalCoordinates.push({
//               latitude: parseFloat(response?.punch_out_details?.latitude),
//               longitude: parseFloat(response?.punch_out_details?.longitude),
//             })
//           }

//           // finalCoordinates.push({ latitude: 34.0522, longitude: -118.2437 })

//           setMapDataApi(finalCoordinates)

//           // // Delay the state update by 1 minute (60000 milliseconds)
//           // setTimeout(() => {
//           //   setMapDataApi(finalCoordinates);
//           // }, 60000);

//         }
//         setLoading(false);
//       })
//       .catch(error => {
//         console.log("error.....", error?.response?.data);
//         setLoading(false);
//         if (error.response.status === 401) {
//           AsyncStorage.removeItem('UserData');
//           AsyncStorage.removeItem('UserLocation');
//           navigation.navigate('Login');
//         }
//       });
//   };

//   const getNewLocation = async () => {
//     setLoading(true);
//     const token = await AsyncStorage.getItem('Token');
//     const config = {
//       headers: { Token: token },
//     };

//     axios
//       // .get(`${apiUrl}/secondPhaseApi/get_locations?user_id=${user_id}`, config)
//       .get(`${apiUrl}/secondPhaseApi/get_locations?user_id=4572`, config)
//       .then(response => {
//         if (response.data.status === 1) {
//           response = response?.data?.data;
//           let finalNewCoordinates = [
//             {
//               latitude: parseFloat(response?.punch_in_details?.latitude),
//               longitude: parseFloat(response?.punch_in_details?.longitude),
//             }
//           ]

//           response?.locations?.forEach(element => {
//             finalNewCoordinates.push({
//               latitude: parseFloat(element?.latitude),
//               longitude: parseFloat(element?.longitude),
//             })
//           });

//           if (response?.punch_out_details) {
//             finalNewCoordinates.push({
//               latitude: parseFloat(response?.punch_out_details?.latitude),
//               longitude: parseFloat(response?.punch_out_details?.longitude),
//             })
//           }

//           // finalCoordinates.push({ latitude: 34.0522, longitude: -118.2437 })

//           setMapNewDataApi(finalNewCoordinates)

//           // // Delay the state update by 1 minute (60000 milliseconds)
//           // setTimeout(() => {
//           //   setMapDataApi(finalCoordinates);
//           // }, 60000);

//         }
//         setLoading(false);
//       })
//       .catch(error => {
//         console.log("error.....", error?.response?.data);
//         setLoading(false);
//         if (error.response.status === 401) {
//           AsyncStorage.removeItem('UserData');
//           AsyncStorage.removeItem('UserLocation');
//           navigation.navigate('Login');
//         }
//       });
//   };

//   if (loading) {
//     return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" />;
//   }

//   console.log(mapDataApi[0]);

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         ref={mapRef}
//         style={styles.mapcontainer}
//         initialRegion={{
//           latitude: 34.0522,
//           longitude: -118.2437,
//           latitudeDelta: 5,
//           longitudeDelta: 5,
//         }}
//         region={region}
//       >
//         {/* Render markers based on mapDataApi */}
//         {mapDataApi &&
//           <>
//             <Marker
//               coordinate={mapDataApi[0]}
//               title={"start"}
//             />
//             <Marker
//               coordinate={mapDataApi[mapDataApi.length - 1]}
//               title={"end"}
//             />
//           </>
//         }
//         {mapDataApi && mapDataApi.map((_, index) => {
//           if (index < mapDataApi.length - 1) {
//             return (
//               <MapViewDirections
//                 key={index}
//                 origin={mapDataApi[index]}
//                 destination={mapDataApi[index + 1]}
//                 apikey={"AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg"}
//                 strokeWidth={3}
//                 strokeColor="hotpink"
//               />
//             );
//           }
//           return null;
//         })}

//       </MapView>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   mapcontainer: {
//     flex: 1,
//     width: width,
//     height: height,
//   },
//   map: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   }
// });

// export default Maps;

// // import React, { useEffect, useState } from 'react';
// // import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
// // import io from 'socket.io-client';

// // const Maps = () => {
// //   const [message, setMessage] = useState('');
// //   const [receivedMessage, setReceivedMessage] = useState('');

// //   useEffect(() => {
// //     // Connect to the Socket.io server
// //     const socket = io('ws://websocket.hrjee.com:6370');

// //     // Set up Socket.io event handlers
// //     socket.on('connect', () => {
// //       console.log('Socket.io connection opened');
// //     });

// //     socket.on('message', (data) => {
// //       console.log('Message received:', data);
// //       setReceivedMessage(data);
// //     });

// //     socket.on('disconnect', () => {
// //       console.log('Socket.io connection closed');
// //     });

// //     // Clean up the Socket.io connection when the component unmounts
// //     return () => {
// //       socket.disconnect();
// //     };
// //   }, []);

// //   const sendMessage = () => {
// //     const socket = io('https://your-socketio-server-url');
// //     socket.emit('message', message);
// //     console.log('Message sent:', message);
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text>Received Message: {receivedMessage}</Text>
// //       <TextInput
// //         style={styles.input}
// //         value={message}
// //         onChangeText={setMessage}
// //         placeholder="Type your message here"
// //       />
// //       <Button title="Send Message" onPress={sendMessage} />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   input: {
// //     height: 40,
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     width: '80%',
// //     marginBottom: 10,
// //     paddingHorizontal: 8,
// //   },
// // });

// // export default Maps;




//sidhsrt
/*

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import apiUrl from '../../reusable/apiUrl';

const { width, height } = Dimensions.get('window');

const Maps = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user_id = 4585;
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapDataApi, setMapDataApi] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    getFirstLocation();
    const intervalId = setInterval(getNewLocation, 60000); // Fetch new locations every minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (mapDataApi.length > 0) {
      setRegion({
        latitude: parseFloat(mapDataApi[mapDataApi.length - 1].latitude),
        longitude: parseFloat(mapDataApi[mapDataApi.length - 1].longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      updateRoute(mapDataApi);
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
      if (response.data.status === 1) {
        const data = response?.data?.data;
        let coordinates = [
          {
            latitude: parseFloat(data?.punch_in_details?.latitude),
            longitude: parseFloat(data?.punch_in_details?.longitude),
          }
        ];

        data?.locations?.forEach(element => {
          coordinates.push({
            latitude: parseFloat(element?.latitude),
            longitude: parseFloat(element?.longitude),
          });
        });

        if (data?.punch_out_details) {
          coordinates.push({
            latitude: parseFloat(data?.punch_out_details?.latitude),
            longitude: parseFloat(data?.punch_out_details?.longitude),
          });
        }

        setMapDataApi(coordinates);
      } else {
        setError('No Attendance Found!');
      }
    } catch (error) {
      console.log("error.....", error?.response?.data);
      setError('Failed to fetch data, please contact admin.');
      if (error.response.status === 401) {
        AsyncStorage.removeItem('UserData');
        AsyncStorage.removeItem('UserLocation');
        navigation.navigate('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getNewLocation = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    try {
      const response = await axios.get(`${apiUrl}/secondPhaseApi/get_locations?user_id=${user_id}`, config);
      if (response.data.status === 1) {
        const data = response?.data?.data;
        let newCoordinates = [
          {
            latitude: parseFloat(data?.punch_in_details?.latitude),
            longitude: parseFloat(data?.punch_in_details?.longitude),
          }
        ];

        data?.locations?.forEach(element => {
          newCoordinates.push({
            latitude: parseFloat(element?.latitude),
            longitude: parseFloat(element?.longitude),
          });
        });

        if (data?.punch_out_details) {
          newCoordinates.push({
            latitude: parseFloat(data?.punch_out_details?.latitude),
            longitude: parseFloat(data?.punch_out_details?.longitude),
          });
        }

        setMapDataApi(prevCoordinates => [...prevCoordinates, ...newCoordinates]);
      }
    } catch (error) {
      console.log("error.....", error?.response?.data);
      setError('Failed to fetch data, please contact admin.');
      if (error.response.status === 401) {
        AsyncStorage.removeItem('UserData');
        AsyncStorage.removeItem('UserLocation');
        navigation.navigate('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRoute = (points) => {
    const maxWaypoints = 23; // Google Maps API allows a maximum of 23 waypoints
    const numChunks = Math.ceil(points.length / maxWaypoints);
    let combinedResults = [];

    const chunkPromises = Array.from({ length: numChunks }, (_, i) => {
      const chunk = points.slice(i * maxWaypoints, (i + 1) * maxWaypoints + 1);
      const origin = chunk[0];
      const destination = chunk[chunk.length - 1];
      const waypoints = chunk.slice(1, -1).map(point => ({
        latitude: point.latitude,
        longitude: point.longitude
      }));

      return new Promise((resolve, reject) => {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            combinedResults.push(result);
            resolve();
          } else {
            reject(status);
          }
        });
      });
    });

    Promise.all(chunkPromises).then(() => {
      let allRoutePoints = [];
      combinedResults.forEach((result) => {
        allRoutePoints = [...allRoutePoints, ...result.routes[0].overview_path.map(path => ({
          latitude: path.lat(),
          longitude: path.lng()
        }))];
      });

      setMapDataApi(allRoutePoints);

      const distance = calculateTotalDistance(allRoutePoints);
      setTotalDistance(distance);

      const lastPoint = points[points.length - 1];
      mapRef.current.animateToRegion({
        latitude: lastPoint.latitude,
        longitude: lastPoint.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }).catch((status) => {
      setError('Failed to fetch directions, please contact admin.');
    });
  };

  const calculateTotalDistance = (points) => {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += haversineDistance(points[i], points[i + 1]);
    }
    return totalDistance;
  };

  const haversineDistance = (point1, point2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.mapcontainer}
        initialRegion={{
          latitude: 34.0522,
          longitude: -118.2437,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={region}
      >
        {mapDataApi.map((coordinate, index) => (
          <Marker
            key={`api-marker-${index}`}
            coordinate={coordinate}
            title={`API Marker ${index + 1}`}
            pinColor="red"
          />
        ))}

        <Polyline
          coordinates={mapDataApi}
          strokeColor="#000"
          strokeWidth={3}
        />
      </MapView>
      <Text style={styles.distanceText}>Total Distance: {totalDistance.toFixed(2)} km</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mapcontainer: {
    flex: 1,
    width: width,
    height: height,
  },
  distanceText: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    position: 'absolute',
    top: 60,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    color: 'white',
  },
});

export default Maps;

*/

//ankur


import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import apiUrl from '../../reusable/apiUrl';

const { width, height } = Dimensions.get('window');

const Maps = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user_id = route?.params?.userId
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapDataApi, setMapDataApi] = useState([]);
  const [mapDataNewApi, setMapNewDataApi] = useState([]);
  const [isPunchedOut, setIsPunchedOut] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [locations, setLocations] = useState([]);

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
        alert(error?.response?.data?.message);
        setLoading(false);
        if (error.response.status === 401) {
          AsyncStorage.removeItem('UserData');
          AsyncStorage.removeItem('UserLocation');
          navigation.navigate('Login');
        }
      });
  };

  useEffect(() => {
    let interval;
    if (!isPunchedOut) {
      interval = setInterval(() => {
        getNewLocation();
      }, 60000); // Fetch new location every minute
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
          const finalNewCoordinates = [...mapDataApi]; // Start with existing coordinates

          if (Array.isArray(responseData)) {
            setLocations(prevLocations => [...prevLocations, ...responseData]);
            calculateTotalDistance([...locations, ...responseData]);
          } else {
            console.error('Fetched data is not an array:', responseData);
          }

          if (responseData?.punch_out_details) {
            finalNewCoordinates.push({
              latitude: parseFloat(responseData?.punch_out_details?.latitude),
              longitude: parseFloat(responseData?.punch_out_details?.longitude),
              type: 'punch_out'
            });
            setIsPunchedOut(true);
          }

          setMapNewDataApi(finalNewCoordinates);
        }
      })
      .catch(error => {
        console.log("error.....", error?.response?.data);
        if (error.response.status === 401) {
          AsyncStorage.removeItem('UserData');
          AsyncStorage.removeItem('UserLocation');
          navigation.navigate('Login');
        }
      });
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

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} size="large" />;
  }

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
            title={coordinate.type === 'punch_in' ? 'Punch In' : coordinate.type === 'punch_out' ? 'Punch Out' : `Location ${index + 1}`}
            pinColor={coordinate.type === 'punch_in' ? 'blue' : coordinate.type === 'punch_out' ? 'green' : 'red'}
          />
        ))}

        {locations.length > 0 && locations.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: parseFloat(loc.latitude), longitude: parseFloat(loc.longitude )}}
            title={index === 0 ? 'Current Location' : `Location ${index + 1}`}
            pinColor="red"
          />
        ))}

        {mapDataApi.length > 1 && (
          <Polyline
            coordinates={mapDataApi.map(coord => ({ latitude: parseFloat(coord.latitude), longitude: parseFloat(coord.longitude )}))}
            strokeColor="hotpink"
            strokeWidth={3}
          />
        )}

        {locations.length > 1 && (
          <Polyline
            coordinates={locations.map(loc => ({
              latitude: parseFloat(loc.latitude),
              longitude: parseFloat(loc.longitude)
            }))}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}

        {mapDataApi.length > 1 && mapDataApi.map((_, index) => {
          if (index < mapDataApi.length - 1) {
            return (
              <MapViewDirections
                key={index}
                origin={mapDataApi[index]}
                destination={mapDataApi[index + 1]}
                apikey={"AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg"}
                strokeWidth={3}
                strokeColor="hotpink"
              />
            );
          }
          return null;
        })}

        {mapDataNewApi.length > 1 && mapDataNewApi.map((_, index) => {
          if (index < mapDataNewApi.length - 1) {
            return (
              <MapViewDirections
                key={`new-api-direction-${index}`}
                origin={mapDataNewApi[index]}
                destination={mapDataNewApi[index + 1]}
                apikey={"AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg"}
                strokeWidth={3}
                strokeColor="blue"
              />
            );
          }
          return null;
        })}
      </MapView>
      <View style={{ padding: 10 }}>
        <Text>Total Distance: {totalDistance.toFixed(2)} km</Text>
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
});

export default Maps;














// App.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import axios from 'axios';
// import apiUrl from '../../reusable/apiUrl';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width, height } = Dimensions.get('window');

// const Maps = () => {
//   const [locations, setLocations] = useState([]);
//   const [totalDistance, setTotalDistance] = useState(0);
//   const [origin, setOrigin] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const user_id = 4572;
//   const GOOGLE_MAPS_APIKEY = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg';

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const fetchLocations = async () => {
//     try {
//       const token = await AsyncStorage.getItem('Token');
//       const config = {
//         headers: { Token: token },
//       };
//       const response = await axios.get(`${apiUrl}/secondPhaseApi/get_locations?user_id=${user_id}`, config);
//       const data = response.data.data.locations;
//       const coordinates = data.map(location => ({
//         latitude: parseFloat(location.latitude),
//         longitude: parseFloat(location.longitude)
//       }));
//       setLocations(coordinates);
//       if (coordinates.length > 1) {
//         setOrigin(coordinates[0]);
//         setDestination(coordinates[coordinates.length - 1]);
//       }
//     } catch (error) {
//       console.error('Error fetching locations:', error?.response?.data);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: 28.65553,
//           longitude: 77.23165,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         }}
//       >
//         {locations.map((loc, index) => (
//           <Marker
//             key={index}
//             coordinate={loc}
//             title={index === 0 ? 'Start Location' : 'Current Location'}
//             description={index === 0 ? 'Start' : 'Current'}
//           />
//         ))}
//         {origin && destination && (
//           <MapViewDirections
//             origin={origin}
//             destination={destination}
//             apikey={GOOGLE_MAPS_APIKEY}
//             strokeWidth={3}
//             strokeColor="hotpink"
//             onReady={(result) => setTotalDistance(result.distance)}
//           />
//         )}
//       </MapView>
//       <View style={styles.infoContainer}>
//         <Text>Total Distance: {totalDistance.toFixed(2)} km</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: width,
//     height: height - 50,
//   },
//   infoContainer: {
//     padding: 10,
//     backgroundColor: 'white',
//     alignItems: 'center',
//   },
// });

// export default Maps;






// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import axios from 'axios';
// import apiUrl from '../../reusable/apiUrl';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Maps = () => {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalDistance, setTotalDistance] = useState(0);
//   const mapRef = useRef(null);

//   const userId = 4572;
//   const googleMapsApiKey = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg';

//   useEffect(() => {
//     fetchLocations();
//     const intervalId = setInterval(fetchLocations, 60000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchLocations = async () => {
//     try {
//       const token = await AsyncStorage.getItem('Token');
//       const config = {
//         headers: { Token: token },
//       };
//       const response = await axios.get(`${apiUrl}/secondPhaseApi/get_new_locations?user_id=${userId}`, config);
//       const newLocations = response.data.data;

//       console.log("Fetched locations:", newLocations);

//       if (Array.isArray(newLocations)) {
//         // Convert coordinates to numbers
//         const formattedLocations = newLocations.map(loc => ({
//           latitude: parseFloat(loc.latitude),
//           longitude: parseFloat(loc.longitude)
//         }));
//         setLocations(prevLocations => [...prevLocations, ...formattedLocations]);
//         calculateTotalDistance([...locations, ...formattedLocations]);
//       } else {
//         console.error('Fetched data is not an array:', newLocations);
//       }
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     } finally {
//       setLoading(false);
//     }
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

//   return (
//     <View style={{ flex: 1 }}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <MapView
//             ref={mapRef}
//             style={{ flex: 1 }}
//             initialRegion={{
//               latitude: 28.65553,
//               longitude: 77.23165,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}
//           >
//             {locations.length > 0 && locations.map((loc, index) => (
//               <Marker
//                 key={index}
//                 coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
//                 title={index === 0 ? 'Start Location' : 'Current Location'}
//                 pinColor={index === 0 ? 'blue' : 'red'}
//               />
//             ))}
//             {locations.length > 1 && (
//               <MapViewDirections
//                 origin={locations[0]}
//                 destination={locations[locations.length - 1]}
//                 apikey={googleMapsApiKey}
//                 strokeWidth={3}
//                 strokeColor="#000"
//                 optimizeWaypoints={true}
//               />
//             )}
//           </MapView>
//           <View style={{ padding: 10 }}>
//             <Text>Total Distance: {totalDistance.toFixed(2)} km</Text>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// export default Maps;


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import axios from 'axios';
// import apiUrl from '../../reusable/apiUrl';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const GOOGLE_MAPS_APIKEY = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg'; // Replace with your API key

// const Maps = ({  }) => {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [coordinates, setCoordinates] = useState([]);
//   const [totalDistance, setTotalDistance] = useState(0);
//   const userId = 4572;

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const token = await AsyncStorage.getItem('Token');
//         const config = {
//           headers: { Token: token },
//         };
//         const response = await axios.get(`${apiUrl}/secondPhaseApi/get_new_locations?user_id=${userId}`, config)
//         const data = response.data.data;
//         console.log("data.....", data)
//         if (data.length) {
//           setLocations(data);
//           const coords = data.map(loc => ({
//             latitude: parseFloat(loc.latitude),
//             longitude: parseFloat(loc.longitude)
//           }));
//           setCoordinates(coords);
//           // Calculate distance
//           const total = coords.reduce((acc, curr, index, arr) => {
//             if (index === 0) return acc;
//             const prev = arr[index - 1];
//             return acc + getDistance(prev, curr);
//           }, 0);
//           setTotalDistance(total);
//         }
//       } catch (err) {
//         setError('Failed to fetch directions, please contact admin.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocations();

//     // Poll for new locations every minute
//     const intervalId = setInterval(fetchLocations, 60000);
//     return () => clearInterval(intervalId);
//   }, [userId]);

//   const getDistance = (point1, point2) => {
//     const rad = (x) => (x * Math.PI) / 180;
//     const R = 6371; // Radius of the earth in km
//     const dLat = rad(point2.latitude - point1.latitude);
//     const dLon = rad(point2.longitude - point1.longitude);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(rad(point1.latitude)) * Math.cos(rad(point2.latitude)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (error) {
//     return <Text>{error}</Text>;
//   }

//   return (
//     <View style={styles.container}>
// <MapView
//   style={styles.map}
//   initialRegion={{
//     latitude: coordinates[0]?.latitude || 28.65553,
//     longitude: coordinates[0]?.longitude || 77.23165,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   }}
// >
//   {coordinates.map((coordinate, index) => (
//     <Marker
//       key={index}
//       coordinate={coordinate}
//       title={index === 0 ? 'Start Location' : 'Current Location'}
//       description={index === 0 ? 'Start' : 'Current'}
//     />
//   ))}

//   {coordinates.length > 1 && (
//     <Polyline
//       coordinates={coordinates}
//       strokeColor="#000"
//       strokeColors={['#7F0000', '#000000']}
//       strokeWidth={6}
//     />
//   )}

//   {coordinates.length > 1 && (
//     <MapViewDirections
//       origin={coordinates[0]}
//       destination={coordinates[coordinates.length - 1]}
//       waypoints={coordinates.slice(1, -1)}
//       apikey={GOOGLE_MAPS_APIKEY}
//       strokeWidth={3}
//       strokeColor="hotpink"
//       optimizeWaypoints={true}
//     />
//   )}
// </MapView>
//       <View style={styles.info}>
//         <Text>First Location: {coordinates[0]?.latitude}, {coordinates[0]?.longitude}</Text>
//         <Text>Current Location: {coordinates[coordinates.length - 1]?.latitude}, {coordinates[coordinates.length - 1]?.longitude}</Text>
//         <Text>Total Distance: {totalDistance.toFixed(2)} km</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   info: {
//     padding: 10,
//     backgroundColor: 'white',
//   },
// });

// export default Maps;



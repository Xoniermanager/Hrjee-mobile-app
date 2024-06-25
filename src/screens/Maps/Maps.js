import React, {useEffect, useState,useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SocketContext } from '../../tracking/SocketContext';

const Maps = ({route}) => {
  const {setContextState,contextState}=useContext(SocketContext)
  console.log(contextState, 'yash');
  const origin = {latitude: 28.6252665, longitude: 77.2960197}; // Origin coordinates
  const destination = {latitude: 28.6209434, longitude: 77.3643691}; // Destination coordinates
  const [locations, setLocations] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
 

  useEffect(() => {
    // let timer = setTimeout(() => {
    //   if (data.length > count) {
    //     setLocations([...locations, data[count]]);
    //     setWaypoints([...waypoints, locations.slice(1, locations.length - 1).map(point => point.coordinates)])
    //     setCount(prev => prev + 1);
    //   }
    // }, 4000);
    // return () => clearTimeout(timer);

    if(locations.length){
      setLocations([...locations, {
        title: 'Current Point',
        coordinates: contextState.currentLocation,
      }])
    }else{
      setLocations([...locations, {
        title: 'Start Point',
        coordinates: contextState.firstLocation,
      }])
    }

    setWaypoints([...waypoints, locations.slice(1, locations.length - 1).map(point => point.coordinates)])
  }, [contextState]);


  
  return (
    <View style={styles.container}>
      {locations.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 2,
            longitudeDelta:
              Math.abs(origin.longitude - destination.longitude) * 2,
          }}>
          {/* <Marker coordinate={origin} title="Origin" /> */}
          {/* <Marker coordinate={destination} title="Destination" /> */}
          {locations.map(marker => {
            return (
              <Marker coordinate={marker.coordinates} title={marker.title} />
            );
          })}
          <MapViewDirections
            origin={locations[0].coordinates}
            destination={locations[locations.length - 1].coordinates}
            waypoints={waypoints}
            apikey="AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg" // Replace with your API key
            strokeWidth={3}
            strokeColor="blue"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Maps;

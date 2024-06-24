import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const Maps = ({route}) => {
  console.log(route.params, 'yash');
  const origin = {latitude: 28.6252665, longitude: 77.2960197}; // Origin coordinates
  const destination = {latitude: 28.6209434, longitude: 77.3643691}; // Destination coordinates
  const [apiData, setApiData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (data.length > count) {
        setLocations([...locations, data[count]]);
        setWaypoints([...waypoints, locations.slice(1, locations.length - 1).map(point => point.coordinates)])
        setCount(prev => prev + 1);
      }
    }, 4000);

  }, [locations]);

  const data = [
    {
      title: 'first',
      coordinates: {
        latitude: 28.6216009,
        longitude: 77.3778445,
      },
    },
    {
      title: 'second',
      coordinates: {
        latitude: 28.6211885,
        longitude: 77.3683049,
      },
    },
    {
      title: 'third',
      coordinates: {
        latitude: 28.6209434,
        longitude: 77.2960197,
      },
    },
 
  ];
  
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

// MarkerComponent.js
import React from 'react';
import { Marker } from 'react-native-maps';

const MarkerComponent = React.memo(({ location }) => (
    // console.log("location.......", location)
  <Marker
    coordinate={{
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    }}
    title={location.title}
    description={location.description}
    pinColor={"red"}
  />
));

export default MarkerComponent;

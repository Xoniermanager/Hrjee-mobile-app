import React, { useContext, useEffect, useState } from 'react';
import {
    Text,
  } from 'react-native';
import { SocketContext } from './SocketContext';

const LocationSender = () => {
    const { sendLocation } = useContext(SocketContext);
    
    const [previousPosition, setPreviousPosition] = useState(null);
    const distanceThreshold = 0.1; // Distance threshold in kilometers (e.g., 100 meters)

    const sendLocationUpdate = (position, userId=1) => {
        const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };


        sendLocation({userId, location: locationData});
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            0.5 - Math.cos(dLat) / 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            (1 - Math.cos(dLon)) / 2;

        return R * 2 * Math.asin(Math.sqrt(a));
    };

    const handlePositionChange = (position) => {
        if (previousPosition) {
            const distance = calculateDistance(
                previousPosition.coords.latitude,
                previousPosition.coords.longitude,
                position.coords.latitude,
                position.coords.longitude
            );


            if (distance >= distanceThreshold) {
                sendLocationUpdate(position);
                setPreviousPosition(position);
            }
        } else {
            // First position update
            sendLocationUpdate(position);
            setPreviousPosition(position);
        }
    };

    const handleError = (error) => {
        console.error("Geolocation error:", error);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(handlePositionChange, handleError, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    return <Text>Sending location data...</Text>;
};

export default LocationSender;

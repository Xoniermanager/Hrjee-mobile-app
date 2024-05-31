import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io('http://app.hrjee.com:6370');

const SocketProvider = ({ children }) => {
    // const [locationData, setLocationData] = useState({});

    // useEffect(() => {
    //     socket.on('locationData', (data) => {
    //         console.log('requestLocationData', data);
    //         setLocationData(data);
    //     });

    //     return () => {
    //         socket.off('locationData');
    //     };
    // }, []);

    const sendLocation = (location) => {
        alert('Hit emit function')
        console.log("location......", location)
        socket.emit('sendLocation', location);
    };

    // const requestLocationData = (userId) => {
    //     socket.emit('requestLocationData', userId);
    // };

    return (
        <SocketContext.Provider value={{ sendLocation }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };

import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io('https://app.hrjee.com:6370');

const SocketProvider = ({ children }) => {
    const [contextState,setContextState]=useState()
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
        socket.emit('sendLocation', location);
        console.log(location,'location')
    };

    // const requestLocationData = (userId) => {
    //     socket.emit('requestLocationData', userId);
    // };

    return (
        <SocketContext.Provider value={{ sendLocation ,contextState,setContextState}}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };

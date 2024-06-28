import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io('https://app.hrjee.com:6370');

const SocketProvider = ({ children }) => {
    const [contextState,setContextState]=useState([])
    const [list,setList]=useState()
    const [prm,setPrm]=useState()
    const [radius,setRadius]=useState()
    const ManuAccessdetails = async () => {
        const token = await AsyncStorage.getItem('Token');
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://app.hrjee.com/SecondPhaseApi/employee_config_details',
          headers: {
            Token: token,
            Cookie: 'ci_session=fu0slk2fsljjjsm9s7m28i9pugh0f2ik',
          },
        };
    
        axios
          .request(config)
          .then(response => {
          
            setList(response?.data?.menu_access);
            setRadius(response?.data?.config?.punchin_radius);
            setPrm(response?.data?.users?.prm_assign);

          })
          .catch(error => {
            console.log(error);
          });
      };
      useEffect(()=>{
        ManuAccessdetails()
      },[])
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
        <SocketContext.Provider value={{ sendLocation ,contextState,setContextState,list,prm,radius}}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };

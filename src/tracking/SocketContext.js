import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import apiUrl from '../reusable/apiUrl';

import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';

const SocketContext = createContext();

const socket = io('https://websocket.hrjee.com:6370/');

const SocketProvider = ({ children }) => {
  const [contextState, setContextState] = useState([])
  const [list, setList] = useState()
  const [prm, setPrm] = useState()
  const [radius, setRadius] = useState()
  const [taskmaxradious, setTaskMaxRadious] = useState()
  const [livetrackingaccess, setLiveTrackingAccess] = useState()
  const [updatedlivetrackingaccess, setUpdateLiveTrackingAccess] = useState()
  const [manualusertackingaccess, setManualUserTrackingAccess] = useState()
  const [locationblock, setLocationBlock] = useState()
  const [activeinactivetracking, setActiveInactiveTracking] = useState()
  const [managerdetils, setManagerDetils] = useState()
  const [updatelocationmanagement, setUpdateLocationManagement] = useState()
  const [prmassignpermissions, setPRMAssignPermissions] = useState()
  const [diggitalidcard, setDigitalIDCardPermissions] = useState()
  const [updatedfacereconization, setUpdatedFaceReconizationPermission] = useState()
  const [casevisitpermission, setCaseVisitPermission] = useState()
  const [startBackgroundTracking, setStartBackgroundTracking] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [firsttimelogin, setFirstTimeLogin] = useState('');

  const ManuAccessdetails_Socket = async () => {
    const token = await AsyncStorage.getItem('Token');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/SecondPhaseApi/employee_config_details`,
      headers: {
        Token: token,
        Cookie: 'ci_session=fu0slk2fsljjjsm9s7m28i9pugh0f2ik',
      },
    };

    axios
      .request(config)
      .then(response => { 
        setEmployeeNumber(response?.data?.users?.EMPLOYEE_NUMBER);
        setList(response?.data?.menu_access);
        setRadius(response?.data?.config?.punchin_radius);
        setTaskMaxRadious(response?.data?.config?.task_maximum_radius);
        setPrm(response?.data?.users?.prm_assign);
        setActiveInactiveTracking(response?.data?.users?.is_location_tracking_active);
        setFirstTimeLogin(response?.data?.users?.first_time_login);
        setManagerDetils(response?.data?.users?.managerDetails);
        setLocationBlock(response?.data?.users?.track_location);
        const updatelocationpermissions = response?.data?.menu_access?.filter(item => item?.menu_name === "Location Tracking")
        const locationmanagement = response?.data?.menu_access?.filter(item => item?.menu_name === "Location Management")
        const prmassign = response?.data?.menu_access?.filter(item => item?.menu_name === "PRM Assign")
        const digital_id_card = response?.data?.menu_access?.filter(item => item?.menu_name === "Digital ID Card")
        const facereconization = response?.data?.menu_access?.filter(item => item?.menu_name === "Face Recognition")
        const caseVisit = response?.data?.menu_access?.filter(item => item?.menu_name === "Case Visit")
        setUpdateLiveTrackingAccess(updatelocationpermissions)
        setUpdateLocationManagement(locationmanagement)
        setPRMAssignPermissions(prmassign)
        setDigitalIDCardPermissions(digital_id_card)
        setUpdatedFaceReconizationPermission(facereconization)
        setCaseVisitPermission(caseVisit)
      })
      .catch(error => {
        console.log(error);
      });
  };
  const getList = async () => {
    const token = await AsyncStorage.getItem('Token');
    // console.log(token, 'token')
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/api/get_employee_list`,
      headers: {
        'Token': token,
        'Cookie': 'ci_session=0bdnfjlm1c2i26gao0ocvmvld6sllmdk'
      }
    };

    axios.request(config)
      .then((response) => {
        setLiveTrackingAccess(response?.data?.data)
        setManualUserTrackingAccess(response?.data?.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    ManuAccessdetails_Socket()
    getList()
  }, [])

  const triggerBackgroundService = () => {
    if (startBackgroundTracking) {
      startBackgroundTracking();
    }
  };

  useEffect(() => {
    if (activeinactivetracking == 0) {
      EndBackgroundService()
      console.log('end...');
    }else{
      triggerBackgroundService()
    }
  }, [activeinactivetracking])

  const EndBackgroundService = async () => {
    Geolocation.stopObserving()
    BackgroundService.on('expiration', () => { console.log('Background service is being closed :('); });
    await BackgroundService.stop()
  }

 

  return (
    <SocketContext.Provider value={{ contextState, setContextState, list, prm, radius, taskmaxradious, activeinactivetracking, setActiveInactiveTracking, updatedlivetrackingaccess, livetrackingaccess, ManuAccessdetails_Socket, getList, manualusertackingaccess, locationblock, setStartBackgroundTracking, updatelocationmanagement, prmassignpermissions, diggitalidcard, managerdetils, updatedfacereconization, casevisitpermission, employeeNumber, firsttimelogin }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };

import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GlobalStyle from '../src/reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Stacks
import HomeNavigator from './HomeNavigator';
import ExpenseNavigator from './ExpenseNavigator';
import ProfileNavigator from './ProfileNavigator';
import TrainingNavigator from './TrainingNavigator';
import PostNavigator from './PostNavigator';
import SharePostNavigator from './SharePostNavigator';
import { EssContext } from '../Context/EssContext';
import ProfileDrawer from './ProfileDrawer';
import Payslip from '../src/screens/home/Services/Payslip/Payslip';
import Attendence from '../src/screens/home/Attendence/Attendence';
import Services from '../src/screens/home/Services/Services';
import LocationList from '../src/screens/Location/LocationList';
import Home from '../src/screens/home/Home';
import PRM from '../src/screens/PRM/PRM';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { SocketContext } from '../src/tracking/SocketContext';
import { Platform } from 'react-native';


const Tab = createBottomTabNavigator();
const DUMMY_MENUS = [
  {
    "created_date": "2021-07-19 13:53:09",
    "icon": "fa fa-dashboard",
    "menu_id": "1",
    "menu_link": "admin/dashboard",
    "menu_name": "Dashboard",
    "modified_date": "2021-07-19 13:54:47",
    "order_no": "1",
    "parent_menu": "0",
    "status": "1"
  },
  {
    "created_date": "2021-07-19 13:53:09",
    "icon": "fa fa-clock-o",
    "menu_id": "3",
    "menu_link": "admin/attendance",
    "menu_name": "Attendance",
    "modified_date": "2024-03-18 17:31:44",
    "order_no": "7",
    "parent_menu": "0",
    "status": "1"
  },
]

const Main = () => {
  const { list, prm } = useContext(SocketContext)
  const [companyid, setCompany_id] = useState('');
  const [prmData, setPrmData] = useState();
  const { updatelocationmanagement, prmassignpermissions, ManuAccessdetails_Socket } = useContext(SocketContext);

  const company_id = async () => {
    const userData = await AsyncStorage.getItem('UserData');
    const userInfo = JSON.parse(userData);
    let company_id = userInfo?.company_id;
    setCompany_id(company_id);
  };
  useEffect(() => {
    company_id();
    ManuAccessdetails_Socket()
  }, []);





  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: GlobalStyle.blueDark,
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        options={({ route }) => ({
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="home" style={{ fontSize: 23, color: color }} />
          ),
        })}
        name="Home"
        component={Home}
      />

      {
        updatelocationmanagement?.length > 0 ?
          <Tab.Screen
            options={{
              unmountOnBlur: true,
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <MaterialIcons
                  name="add-task"
                  style={{ fontSize: 23, color: color }}
                />
              ),
            }}
            name="Location"
            component={LocationList}
          />
          :
          null
      }

      <Tab.Screen
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="appstore-o" style={{ fontSize: 23, color: color }} />
          ),
        }}
        name="Services"
        component={Services}
      />

      {prmassignpermissions?.length > 0 ?
        <Tab.Screen
          options={{
            unmountOnBlur: true,
            headerShown: false, 
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              marginLeft: Platform.OS == 'ios' ? 0 : responsiveWidth(40),
            },
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name="rupee"
                style={{ fontSize: 23, color: color }}
              />
            ),
          }}
          name="PRM"
          component={PRM}
        />
        :
        null
      }

      <Tab.Screen
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" style={{ fontSize: 23, color: color }} />
          ),
        }}
        name="Profile"
        component={ProfileDrawer}
      />
    </Tab.Navigator>
  );
};

export default Main;

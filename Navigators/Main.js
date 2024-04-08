import React, { useContext } from 'react';
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
import PRM from '../src/screens/PRM/PRM';
import Home from '../src/screens/home/Home';

const Tab = createBottomTabNavigator();

const Main = () => {
  const getRouteName = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName?.includes('Login') ||
      routeName?.includes('Forgot Password') || 

      routeName === undefined
    ) {
      return 'none';
    }
    return 'flex';
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: GlobalStyle.blueDark,
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        options={({ route }) => ({
          unmountOnBlur: true,
          // tabBarStyle: { display: getRouteName(route) },
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="home" style={{ fontSize: 23, color: color }} />
          ),
        })}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="rupee"
              style={{ fontSize: 23, color: color }}
            />
          ),
        }}
        name="Payslip"
        component={Payslip}
      />
      <Tab.Screen
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="appstore-o"
              style={{ fontSize: 23, color: color }}
            />
          ),
        }}
        name="Services"
        component={Services}
      />
       <Tab.Screen
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="location-pin" style={{ fontSize: 23, color: color }} />
          ),
        }}
        name="LocationList"
        component={LocationList}
      />
       <Tab.Screen
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="payment" style={{ fontSize: 23, color: color }} />
          ),
        }}
        name="PRM"
        component={PRM}
      />
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

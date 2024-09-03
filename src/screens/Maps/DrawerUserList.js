import { createDrawerNavigator } from '@react-navigation/drawer';
import TrackingScreen from './TrackingScreen';
import AttendanceScreen from './AttendanceScreen';
import { Text } from 'react-native-paper';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    
    <Text>hii</Text>
  }

function DrawerUserList() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Tracking" component={TrackingScreen} />
            <Drawer.Screen name="Attendance" component={AttendanceScreen} />
        </Drawer.Navigator>
    );
}

// export default MyDrawer

export default function MyDrawer() {
  return <MyStack />;
}


// import React, {useContext} from 'react';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import TrackingScreen from './TrackingScreen';
// import AttendanceScreen from './AttendanceScreen';
// const Stack = createNativeStackNavigator();

// function MyStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         options={{headerShown: false}}
//         name="TrackingScreen"
//         component={TrackingScreen}
//       />
//       <Stack.Screen
//         name="AttendanceScreen"
//         options={{headerShown: true}}
//         component={AttendanceScreen}
//       />
//     </Stack.Navigator>
//   );
// }

// export default function ProfileNavigator() {
//   return <MyStack />;
// }


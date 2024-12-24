// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Pending from './PendingTask/Pending';
// import Processing from './ProcessingTask/Processing';
// import Done from './DoneTask/Done';


// const Tab = createMaterialTopTabNavigator();


// const LocationList = () => {
//     const tabBarOptions = {
//         style: {
//             backgroundColor: '#0043ae',
//         },
//         activeTintColor: '#000',
//         inactiveTintColor: '#fff',
//         indicatorStyle: { backgroundColor: '#fff', height: '100%' },
//         pressOpacity: 1,       
//     }
//     return (
//         <Tab.Navigator tabBarOptions={tabBarOptions}  screenOptions={{
//             swipeEnabled: false,  // Disable swipe gestures
//         }}>
//             <Tab.Screen name="Pending" component={Pending} />
//             <Tab.Screen name="Processing" component={Processing} />
//             <Tab.Screen name="Done" component={Done} />
//         </Tab.Navigator>
//     )
// }

// export default LocationList

// const styles = StyleSheet.create({})





import { StyleSheet, Text, View, Button, TouchableOpacity, Platform, StatusBar } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pending from './PendingTask/Pending';
import Processing from './ProcessingTask/Processing';
import Done from './DoneTask/Done';
import { SocketContext } from '../../tracking/SocketContext';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();



const LocationListTabs = () => {
    const tabBarOptions = {
        style: {
            backgroundColor: '#0043ae',
        },
        activeTintColor: '#000',
        inactiveTintColor: '#fff',
        indicatorStyle: { backgroundColor: '#fff', height: '100%' },
        pressOpacity: 1,
    };

    return (
        <Tab.Navigator
            tabBarOptions={tabBarOptions}
            screenOptions={{
                swipeEnabled: false, // Disable swipe gestures
            }}
        >
            <Tab.Screen name="Pending" component={Pending} />
            <Tab.Screen name="Processing" component={Processing} />
            <Tab.Screen name="Done" component={Done} />
        </Tab.Navigator>
    );
};

const LocationList = ({ navigation }) => {
    const { casevisitpermission, ManuAccessdetails_Socket } = useContext(SocketContext);

    useEffect(() => {
        ManuAccessdetails_Socket()
    }, [])

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#e3eefb" />

            <Stack.Navigator>
                <Stack.Screen
                    name="LocationList"
                    component={LocationListTabs}
                    // options={({ navigation }) => ({
                    //     title: ' ',
                    //     headerStyle: { backgroundColor: '#e3eefb' },
                    //     headerTintColor: '#fff',
                    //     headerRight: () => (
                    //         casevisitpermission?.length > 0 ? (  
                    //             <TouchableOpacity
                    //                 onPress={() => navigation.navigate('AddTask')}
                    //                 style={{ backgroundColor: "#0043ae", borderRadius: 5, marginTop: Platform.OS === 'ios' ? 0 : 0 }}
                    //             >
                    //                 <Text style={{ color: '#fff', padding: 10, borderRadius: 5, textAlign: "center", marginHorizontal: 8 }}>Add Task</Text>
                    //             </TouchableOpacity>
                    //         ) : null 
                    //     ),
                    // })}
                />
            </Stack.Navigator>


        </>

    );
};

export default LocationList;

const styles = StyleSheet.create({});

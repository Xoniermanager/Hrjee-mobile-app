import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pending from './PendingTask/Pending';
import Processing from './ProcessingTask/Processing';
import Done from './DoneTask/Done';


const Tab = createMaterialTopTabNavigator();


const LocationList = () => {
    const tabBarOptions = {
        style: {
            backgroundColor: '#0043ae',
        },
        activeTintColor: '#000',
        inactiveTintColor: '#fff',
        indicatorStyle: { backgroundColor: '#fff', height: '100%' },
        pressOpacity: 1,
    }
    return (
        <Tab.Navigator tabBarOptions={tabBarOptions}>
            <Tab.Screen name="Pending" component={Pending} />
            <Tab.Screen name="Processing" component={Processing} />
            <Tab.Screen name="Done" component={Done} />
        </Tab.Navigator>
    )
}

export default LocationList

const styles = StyleSheet.create({})
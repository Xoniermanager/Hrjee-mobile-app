import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import expenseTrack from '../src/screens/ExpenseTracker/ExpenseTrack';
import expenseTrackListings from '../src/screens/ExpenseTracker/Listings';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="expense Track Listings"
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen name="expenseTrack" component={expenseTrack} />
      <Stack.Screen
        name="expense Track Listings"
        component={expenseTrackListings}
      />
    </Stack.Navigator>
  );
}

export default function ExpenseNavigator() {
  return <MyStack />;
}

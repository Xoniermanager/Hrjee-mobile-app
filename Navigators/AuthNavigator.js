import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../src/screens/Login/Login';
import ForgotPassword from '../src/screens/Login/ForgotPassword';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Forgot Password"
        component={ForgotPassword}
      />
    </Stack.Navigator>
  );
}

export default function ProfileNavigator() {
  return <MyStack />;
}

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SharePost from '../src/screens/sharePost/SharePost';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Share Post" component={SharePost} />
    </Stack.Navigator>
  );
}

export default function SharePostNavigator() {
  return <MyStack />;
}

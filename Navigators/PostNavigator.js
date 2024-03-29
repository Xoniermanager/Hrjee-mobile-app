import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Post from '../src/screens/Post/Post';
import SinglePost from '../src/screens/Post/SinglePost';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Post" component={Post} />
      <Stack.Screen name="Single Post" component={SinglePost} />
    </Stack.Navigator>
  );
}

export default function PostNavigator() {
  return <MyStack />;
}

import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ChangePassword from '../src/screens/settings/ChangePassword';
import Profile from '../src/screens/profile/Profile';
import SinglePost from '../src/screens/profile/SinglePost';
import {useRoute} from '@react-navigation/native';
import ProfileDrawer from './ProfileDrawer';
import {useNavigation} from '@react-navigation/native';
import {EssContext} from '../Context/EssContext';
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="profile"
        component={Profile}
      />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen
        name="SinglePost"
        options={{headerShown: true}}
        component={SinglePost}
      />
    </Stack.Navigator>
  );
}

export default function ProfileNavigator() {
  return <MyStack />;
}

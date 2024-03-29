import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Training from '../src/screens/training/Training';
import TrainingDetails from '../src/screens/training/TrainingDetails';
import OpenPdf from '../src/reusable/doc/OpenPdf';
import OpenVideo from '../src/reusable/doc/OpenVideo';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen name="training" component={Training} />
      <Stack.Screen name="Training Details" component={TrainingDetails} />
      <Stack.Screen name="Document Details" component={OpenPdf} />
      <Stack.Screen name="Video Details" component={OpenVideo} />
    </Stack.Navigator>
  );
}

export default function TrainingNavigator() {
  return <MyStack />;
}

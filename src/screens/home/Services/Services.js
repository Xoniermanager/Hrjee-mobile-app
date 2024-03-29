import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../../reusable/Button';

const Services = ({navigation}) => {
  return (

    <View style={{flex: 1, padding: 15, backgroundColor: '#e3eefb'}}>
      <Button
        label={'Attendance'}
        onPress={() => navigation.navigate('Select Attendance')}
      />
      <Button
        label={'Leave'}
        onPress={() => navigation.navigate('Applied Leaves')}
      />
      <Button
        label={'Holidays'}
        onPress={() => navigation.navigate('Holidays')}
      />
      <Button
        label={'Payslip'}
        onPress={() => navigation.navigate('Payslip')}
      />
      <Button
        label={'Document'}
        onPress={() => navigation.navigate('Document')}
      />
      <Button label={'Forms'} onPress={() => navigation.navigate('Forms')} />
      <Button label={'Resign'} onPress={() => navigation.navigate('Resign')} />

    </View>
  );
};

export default Services;

const styles = StyleSheet.create({});

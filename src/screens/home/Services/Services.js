import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import React, { useContext, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../../reusable/Button';
import { useNavigation } from '@react-navigation/native';
import { SocketContext } from '../../../tracking/SocketContext';

const Services = () => {
  const navigation = useNavigation()
  const { updatedfacereconization, ManuAccessdetails_Socket } = useContext(SocketContext);

  useEffect(() => {
    ManuAccessdetails_Socket();
  }, [])

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#e3eefb" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e3eefb' }}>
        <ScrollView style={{ marginHorizontal: 8 }}>
          <Button
            label={'Attendance'}
            onPress={() => navigation.navigate('Select Attendance')}
          />
          <Button
            label={'Leave'}
            onPress={() => navigation.navigate('Leave Applied List')}
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
          {/* <Button label={'Forms'} onPress={() => navigation.navigate('Forms')} /> */}
          <Button label={'Resign'} onPress={() => navigation.navigate('Resign Content')} />
          <Button label={'Team'} onPress={() => navigation.navigate('UserList')} />
          {/* {
            updatedfacereconization?.length > 0 ?
              <Button label={'KYC'} onPress={() => navigation.navigate('Face detection')} />
              :
              null
          } */}
        </ScrollView >
      </SafeAreaView>
    </>

  );
};

export default Services;

const styles = StyleSheet.create({});


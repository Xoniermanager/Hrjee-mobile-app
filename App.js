import { StyleSheet, Text, View, Modal, Image } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { EssProvider, EssContext } from './Context/EssContext';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';


import Main from './Navigators/Main';

const App = ({ navigation }) => {

  useEffect(() => {

    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);


  const [isConnected, setIsConnected] = useState("")
  const [isModalVisiblebeneficial, setModalVisiblebeneficial] = useState(false);

  const ModalOpen = () => {
    setModalVisiblebeneficial(!isModalVisiblebeneficial)
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ? "true" : "false")
      //  alert(state.isConnected)
      if (state.isConnected == false) {
        ModalOpen()
        return;
      }

    });
    return () => {
      unsubscribe();
    }
  }, [])

  return (

    <>
      {
        isConnected == "true" &&

        <>
          <EssProvider>
            <NavigationContainer>
              <Main />
            </NavigationContainer>
          </EssProvider>
        </>
      }

      {
        isConnected == "false" &&
        <Modal isVisible={isModalVisiblebeneficial}
          animationType="slide"
        >
          <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#0D2BD3", textAlign: "center", }}>Please check your internet connection </Text>
            <Image
              style={{ width: 80, height: 80, alignSelf: "center", margin: 5 }}
              source={require('../HRjee/src/images/internet.jpeg')}
            />
          </View>
        </Modal>
      }

    </>








  );
};

export default App;

const styles = StyleSheet.create({});



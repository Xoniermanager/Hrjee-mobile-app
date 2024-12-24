import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  Linking,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { EssProvider, EssContext } from './Context/EssContext';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import VersionCheck from 'react-native-version-check';
import RNExitApp from 'react-native-exit-app';
import Main, { H } from './Navigators/Main';
import HomeNavigator from './Navigators/HomeNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketProvider } from './src/tracking/SocketContext';


const App = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  const update = async () => {
    Linking.openURL(
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/in/app/hrjee/id6478102468'
        : 'https://play.google.com/store/apps/details?id=com.HRjee',
    );
    // await AsyncStorage.removeItem('Token');
    // await AsyncStorage.removeItem('UserData');
    // await AsyncStorage.removeItem('UserLocation');
  };

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName: Platform.OS === 'ios' ? 'com.appHRjee' : 'com.HRjee', // Replace with your app's package name
          ignoreErrors: true,
        })
        const currentVersion = VersionCheck.getCurrentVersion();
        if (latestVersion > currentVersion) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  update();
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          // App is up-to-date, proceed with the app
        }
      } catch (error) {
        // Handle error while checking app version
        console.error('Error checking app version:', error);
      }
    };

    checkAppVersion();
  }, []);

  const [isConnected, setIsConnected] = useState('');
  const [isModalVisiblebeneficial, setModalVisiblebeneficial] = useState(false);

  const ModalOpen = () => {
    setModalVisiblebeneficial(!isModalVisiblebeneficial);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ? 'true' : 'false');
      //  alert(state.isConnected)
      if (state.isConnected == false) {
        ModalOpen();
        return;
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {isConnected == 'true' && (
        <>
          <SocketProvider>
            <EssProvider>
              <NavigationContainer>
                <HomeNavigator />
              </NavigationContainer>
            </EssProvider>
          </SocketProvider>
        </>
      )}

      {isConnected == 'false' && (
        <Modal isVisible={isModalVisiblebeneficial} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <Image
              style={{ width: 80, height: 80, alignSelf: 'center', margin: 5 }}
              source={require('./src/images/no-signal.png')}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#172B85',
                textAlign: 'center',
              }}>
              Please check your internet connection{' '}
            </Text>
          </View>
        </Modal>
      )}
    </>

  );
};

export default App;

const styles = StyleSheet.create({});


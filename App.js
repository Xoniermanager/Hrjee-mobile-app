import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  Linking,
  Platform,
  Alert,
  BackHandler,
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
                  color: '#0D2BD3',
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

// import React, { useEffect } from 'react';
// import { Linking, Platform, Alert } from 'react-native'; // Import Alert from 'react-native'

// import VersionCheck from 'react-native-version-check';

// const App = () => {
// useEffect(() => {
//   const checkAppVersion = async () => {
//     try {
//       const latestVersion = await VersionCheck.getLatestVersion({
//         packageName: Platform.OS === 'ios' ? 'com.appHRjee' : 'com.HRjee', // Replace with your app's package name
//         ignoreErrors: true,
//       });

//       const currentVersion = VersionCheck.getCurrentVersion();
//       console.log(currentVersion, latestVersion, 'currentVersion')

//       if (latestVersion >= currentVersion) {
//         Alert.alert(
//           'Update Required',
//           'A new version of the app is available. Please update to continue using the app.',
//           [
//             {
//               text: 'Update Now',
//               onPress: () => {
//                 Linking.openURL(
//                   Platform.OS === 'ios'
//                     ? 'http://itunes.apple.com/lookup?bundleId=com.appHRjee'
//                     : 'https://play.google.com/store/apps/details?id=com.HRjee'
//                 );
//               },
//             },

//           ],
//           { cancelable: false }
//         );
//       } else {
//         // App is up-to-date, proceed with the app
//       }
//     } catch (error) {
//       // Handle error while checking app version
//       console.error('Error checking app version:', error);
//     }
//   };

//   checkAppVersion();
// }, []);

//   // Render your app components here
// };

// export default App;


// import { StyleSheet, Text, View } from 'react-native';
// import React, { useEffect } from 'react';
// import BackgroundService from 'react-native-background-actions';

// const App = () => {
//   const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

//   const veryIntensiveTask = async (taskDataArguments) => {
//     const { delay } = taskDataArguments;
//     await new Promise(async (resolve) => {
//       for (let i = 0; BackgroundService.isRunning(); i++) {
//         console.log(i);
//         await sleep(delay);
//       }
//     });
//   };

//   const options = {
//     taskName: 'Example',
//     taskTitle: 'ExampleTask title',
//     taskDesc: 'ExampleTask description',
//     taskIcon: {
//       name: 'ic_launcher',
//       type: 'mipmap',
//     },
//     color: '#ff00ff',
//     linkingURI: 'yourSchemeHere://chat/jane',
//     parameters: {
//       delay: 1000,
//     },
//     notification: {
//       id: 'example-notification',
//       title: 'Example Background Service',
//       message: 'Running background task...',
//     },
//   };

//   const startBackgroundService = async () => {
//     await BackgroundService.start(veryIntensiveTask, options);
//     // Optionally, you can update the notification or perform other actions
//     // await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
//     // Avoid stopping immediately
//     // await BackgroundService.stop();
//   };

//   useEffect(() => {
//     startBackgroundService();
//   }, []);

//   return (
//     <View>
//       <Text>App</Text>
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});



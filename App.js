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


// import { AppConfig } from 'aws-sdk';
// import React from 'react';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // Import Linear Gradient
// import AntDesign from 'react-native-vector-icons/AntDesign';


// const App = () => {
//   return (
//     <View style={styles.container}>
//       <View style={{borderRadius:15, backgroundColor: "#fff", width: "70%", justifyContent: "center", alignSelf: "center", alignItems: "center", padding:15 }}>
//         <TouchableOpacity style={{  alignSelf:"flex-end", marginRight:20, marginBottom:10}}>
//           <AntDesign
//             name="close"
//             size={22}
//             color="red"
//           />
//         </TouchableOpacity>
//         <Text style={{ textAlign: "center", color: "#172B85", fontWeight: "500", fontSize: 15, marginBottom: 15 }}>Click on the button to make your attendance</Text>
//         {/* Outer Circle */}
//         <View style={styles.outerCircle}>
//           {/* Middle Circle */}
//           <View style={styles.middleCircle}>
//             {/* Inner Circle with Gradient */}
//             <TouchableOpacity>
//               <LinearGradient
//                 colors={['#FF5200', '#FF8F00', '#FF6700']} // Gradient colors
//                 style={styles.innerCircle}
//               >
//                 <Text style={styles.buttonText}>Punch In</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>


//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'red',
//   },
//   outerCircle: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: '#D3D3D3', // Light gray (Outermost border)
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom:15
//   },
//   middleCircle: {
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     backgroundColor: '#FFFFFF', // White (Second border)
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerCircle: {
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF', // White text for the button
//   },
// });

// export default App;

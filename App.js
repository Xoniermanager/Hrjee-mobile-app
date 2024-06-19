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
import React, {useEffect, useContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {EssProvider, EssContext} from './Context/EssContext';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import VersionCheck from 'react-native-version-check';
import RNExitApp from 'react-native-exit-app';
import Main, {H} from './Navigators/Main';
import HomeNavigator from './Navigators/HomeNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketProvider } from './src/tracking/SocketContext';

const App = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  const update = async () => {
    Linking.openURL(
      Platform.OS === 'ios'
        ? 'http://itunes.apple.com/lookup?bundleId=com.appHRjee'
        : 'https://play.google.com/store/apps/details?id=com.HRjee',
    );
    await AsyncStorage.removeItem('Token');
    await AsyncStorage.removeItem('UserData');
    await AsyncStorage.removeItem('UserLocation');
    RNExitApp.exitApp();
  };

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName: Platform.OS === 'ios' ? 'com.appHRjee' : 'com.HRjee', // Replace with your app's package name
          ignoreErrors: true,
        });
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
            {cancelable: false},
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
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#0D2BD3',
                textAlign: 'center',
              }}>
              Please check your internet connection{' '}
            </Text>
            <Image
              style={{width: 80, height: 80, alignSelf: 'center', margin: 5}}
              source={require('./src/images/internet.jpeg')}
            />
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
// import React from 'react';
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';


// const App = () => {
//   return (
//     <TouchableOpacity style={styles.buttonContainer}>
//     <LinearGradient
//       colors={['#EC6192', '#FDB76D']} // Colors for the gradient
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 0 }}
//       style={styles.gradient}
//     >
//       <Text style={styles.text}>Log In</Text>
//     </LinearGradient>
//   </TouchableOpacity>
//   )
// }

// export default App

// const styles = StyleSheet.create({
//   buttonContainer: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     width: '80%', // Adjust as needed
//     alignSelf: 'center', // Centers the button on the screen
//   },
//   gradient: {
//     paddingVertical: 15,
//     paddingHorizontal: 45,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//   },
// })

// import React, { useState } from 'react';
// import { View, Button, Alert } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import { PDFDocument } from 'pdf-lib';
// import ExcelJS from 'exceljs';
// import RNFS from 'react-native-fs';
// import FilePickerManager from 'react-native-file-picker';

// const App = () => {
//   const [pdfPath, setPdfPath] = useState(null);

//   const handleUpload = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.pdf],
//       });
//       setPdfPath(res[0].uri);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to pick a PDF file');
//     }
//   };

//   const convertPDFtoExcel = async () => {
//     if (!pdfPath) {
//       Alert.alert('Error', 'Please upload a PDF file first');
//       return;
//     }

//     try {
//       // Read the PDF file as base64
//       const pdfBytes = await RNFS.readFile(pdfPath, 'base64');
      
//       // Load the PDF document
//       const pdfDoc = await PDFDocument.load(pdfBytes);
      
//       // Initialize an array to store text content
//       const textContent = [];
      
//       // Iterate through each page and extract text
//       const numPages = pdfDoc.getPageCount();
//       for (let i = 0; i < numPages; i++) {
//           const pdfPage = await pdfDoc.getPage(i);
//           console.log(pdfPage,'pdfPage')
//           const pageText = await pdfPage.text;
//           textContent.push(pageText);
//       }
      
//       // Initialize Excel workbook and worksheet
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Sheet1');
      
//       // Set headers and add rows to the worksheet
//       worksheet.columns = [{ header: 'Content', key: 'content' }];
//       textContent.forEach(text => {
//           worksheet.addRow({ content: text });
//       });
      
//       // Save the workbook to a file
//       const excelFilePath = `${RNFS.DocumentDirectoryPath}/output.xlsx`;
//       await workbook.xlsx.writeFile(excelFilePath);
      
//       // Show success message
//       Alert.alert('Success', 'PDF converted to Excel successfully');
//   } catch (err) {
//       // Show error message if conversion fails
//       Alert.alert('Error', 'Failed to convert PDF to Excel');
//       console.error(err);
//   }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button title="Upload PDF" onPress={handleUpload} />
//       <Button title="Convert to Excel" onPress={convertPDFtoExcel} />
//     </View>
//   );
// };

// export default App;





// /////a nkur


// import { StyleSheet, Text, View } from 'react-native'
// import React, { useState } from 'react'
// import UploadPDF from './UploadPDF'
// import ExportExcel from './ExportExcel'

// const App = () => {
//   const [dataToExport, setDataToExport] = useState([])

//   const handleUpload = (file) => {
//     // Handle uploaded PDF (e.g., extract data for export)
//     setDataToExport(processDataFromPDF(file));
//   };
//   return (
//     <View>
//      <UploadPDF onUpload={handleUpload} />
//       <ExportExcel data={dataToExport} />
//     </View>
//   )
// }

// export default App

// const styles = StyleSheet.create({})
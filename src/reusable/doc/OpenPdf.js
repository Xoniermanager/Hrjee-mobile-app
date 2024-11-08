import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator, Alert, Platform, SafeAreaView
} from 'react-native';
import React, { useState } from 'react';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import GlobalStyle from '../GlobalStyle';
import { useFocusEffect } from '@react-navigation/native';
import { Root, Popup } from 'popup-ui'
import RNFetchBlob from 'rn-fetch-blob';

const OpenPdf = ({ route }) => {
  const item = route?.params?.url
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);

  const historyDownload = () => {
    if (item != null) {
      setShow(true)
      if (Platform.OS === 'ios' || Platform.OS == 'android') {
        downloadHistory(item);
      } else {
        try {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'storage title',
              message: 'storage_permission',
            },
          ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // console.log('Storage Permission Granted.');
              setShow(false)

              downloadHistory(item);
            } else {
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'storage_permission',
                buttonText: 'Ok',
                callback: () => [Popup.hide()]
              });
              setShow(false)

            }
          });
        } catch (err) {
          //To handle permission related issue
          console.log('error', err);
          setloading(false)

        }
      }
    }
    else {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'No record found!',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      });
      setShow(false)
    }


  };
  const downloadHistory = async (item) => {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/Report_Download' +
          Math.floor(date.getTime() + date.getSeconds() / 2),
        description: 'Risk Report Download',
      },
    };
    config(options)
      .fetch('GET', item)
      .then(res => {
        //Showing alert after successful downloading
        // console.log('res -> ', JSON.stringify(res));
        Popup.show({
          type: 'Success',
          title: 'Success',
          button: true,
          textBody: 'Report Downloaded Successfully.',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        });
        setShow(false)

      });
  };
  return (
    <Root>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => historyDownload()}
          style={{
            padding: 15,
            backgroundColor: GlobalStyle.blueDark,
            borderRadius: 5,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{ color: 'white', fontWeight: '700', marginRight: 10 }}>
            Download Pay slip
          </Text>
          {show ? <ActivityIndicator size="small" color="white" /> : null}
        </TouchableOpacity>
      </SafeAreaView>
    </Root>
  );
};

export default OpenPdf;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3eefb',
  },
});
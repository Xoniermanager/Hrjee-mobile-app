import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
// import Pdf from 'react-native-pdf';
import FileViewer from 'react-native-file-viewer';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import {useFocusEffect} from '@react-navigation/native';

const DocumentDetails = ({route}) => {
  console.log('doc-->', route.params.doc);

  const [loading, setloading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      openDoc();
    }, []),
  );

  const openDoc = () => {
    setloading(true);
    const url = route.params.doc;
    console.log(url);

    // this will split the whole url.
    const f2 = url.split('/');

    // then get the file name with extention.
    const fileName = f2[f2.length - 1];
    // const fileExtention = url.split(".")[3];

    // create a local file path from url
    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const options = {
      fromUrl: url,
      toFile: localFile,
    };

    // last step it will download open it with fileviewer.
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        setloading(false);
        // success
        // Here you can perform any of your completion tasks
      })
      .catch(error => {
        setloading(false);
        // error
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => openDoc()}
        style={{
          padding: 15,
          backgroundColor: GlobalStyle.blueDark,
          borderRadius: 5,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text style={{color: 'white', fontWeight: '700', marginRight: 10}}>
          Open
        </Text>
        {loading ? <ActivityIndicator size="small" color="white" /> : null}
      </TouchableOpacity>
    </View>
  );
};

export default DocumentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

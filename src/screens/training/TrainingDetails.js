import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../reusable/GlobalStyle';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const TrainingDetails = ({navigation, route}) => {
  const [loading, setloading] = useState(false);
  const [showMore, setshowMore] = useState(true);

  const type = route.params.type;
  console.log('type', type);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const d = new Date();

  const handleRefresh = async () => {
    // Do something to refresh the data
  };

  const navigateTo = () => {
    if (type == 'video') {
      navigation.navigate('Video Details', {
        url: route.params.url,
        thumbnail: route.params.photo,
        title: item.title,
      });
    } else if (type == 'pdf') {
      openDoc();
    } else {
      Linking.openURL(route.params.url);
    }
  };

  const openDoc = () => {
    setloading(true);
    const url = route.params.url;
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
    <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      <ScrollView>
        <Image style={styles.tinyLogo} source={{uri: route.params.photo}} />
        <View style={{marginTop: 10, marginBottom: 100}}>
          <Text style={{fontSize: 19, fontWeight: '600'}}>
            {route.params.title}
          </Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <AntDesign
              name="calendar"
              size={17}
              color="#0321a4"
              style={{marginRight: 5}}
            />
            <Text style={{fontSize: 13}}>
              {days[d.getDay()] +
                ', ' +
                d.getDate() +
                ' ' +
                monthNames[d.getMonth()]}
            </Text>
          </View>
          {showMore ? (
            <Text style={{marginTop: 10, fontSize: 18}}>
              {route.params.description.slice(0, 20)}...
            </Text>
          ) : (
            <Text style={{marginTop: 10, fontSize: 18}}>
              {route.params.description}
            </Text>
          )}

          {showMore ? (
            <TouchableOpacity
              onPress={() => setshowMore(!showMore)}
              style={{marginTop: 10}}>
              <Text style={styles.txt_color}>show more</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setshowMore(!showMore)}
              style={{marginTop: 10}}>
              <Text style={styles.txt_color}>show less</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 15,
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={navigateTo}
          style={{
            padding: 15,
            backgroundColor: GlobalStyle.blueDark,
            borderRadius: 5,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: '700', marginRight: 10}}>
            Open
          </Text>
          {loading ? <ActivityIndicator size="small" color="white" /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrainingDetails;

const styles = StyleSheet.create({
  tinyLogo: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  txt_color: {color: '#008080', fontSize: 15, fontWeight: '600'},
});

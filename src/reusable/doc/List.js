import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import GlobalStyle from '../GlobalStyle';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../apiUrl';
import axios from 'axios';
import {EssContext} from '../../../Context/EssContext';
import ProgressiveImage from '../ProgressiveImage';
import PullToRefresh from '../PullToRefresh';

const List = ({navigation}) => {
  const [empty, setempty] = useState(false);
  const [loading, setloading] = useState(false);
  const [announcement, setannouncement] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      get_announcement();
    }, []),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_announcement();
  };

  const get_announcement = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/api/announcement`, body, config)
      .then(response => {
        // console.log('response', response.data);
        if (response.data.status == 1) {
          setloading(false);
          try {
            console.log(response.data.content);
            setannouncement(response.data.content);
            setempty(false);
            response.data.content.length < 1 ? setempty(true) : setempty(false);
          } catch (e) {
            alert(e);
          }
        } else {
          setempty(true);
          alert(response.data.message);
        }
      })
      .catch(error => {
        setloading(false);
        alert(error);
      });
  };

  const arr = announcement.filter(item => {
    let urlSplitArr = item.attacnment.split('.');
    let extension = urlSplitArr[2];
    // if (extension == 'mp4') {
    //   return item;
    // }
    return extension == 'mp4';
  });

  const renderAnnouncement = (item, index) => {
    const url = item.attacnment;
    let urlSplitArr = item.attacnment.split('.');
    let extension = urlSplitArr[2];
    if (url.indexOf('/assets/uploads/announcement') !== -1) {
      return (
        <TouchableOpacity
          onPress={() => alert('file does not exist!')}
          key={index}
          style={[
            {
              marginTop: 20,
              marginBottom: index == announcement.length - 1 ? 100 : null,
              backgroundColor: 'white',
              width: '99%',
            },
            GlobalStyle.card,
          ]}>
          {/* <Image style={styles.tinyImage} source={{uri: item.filename}} /> */}
          <ProgressiveImage
            defaultImageSource={require('../../images/default-img.png')}
            source={{uri: item.filename}}
            style={styles.tinyImage}
            resizeMode="cover"
          />
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '600', fontSize: 20}}>{item.title}</Text>
            <Text style={{fontSize: 13, color: 'grey'}}>
              {item.publish_date}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (
      url.indexOf('pdf') !== -1 ||
      url.indexOf('doc') !== -1 ||
      url.indexOf('docx') !== -1 ||
      url.indexOf('jpg') !== -1 ||
      url.indexOf('jpeg') !== -1 ||
      url.indexOf('png') !== -1 ||
      url.indexOf('gif') !== -1
    ) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Doc Details', {
              type: 'pdf',
              photo: item.filename,
              title: item.title,
              short_description: item.short_description,
              long_description: item.long_description,
              url: item.attacnment,
            })
          }
          key={index}
          style={[
            {
              marginTop: 20,
              marginBottom: index == announcement.length - 1 ? 100 : null,
              backgroundColor: 'white',
              width: '99%',
            },
            GlobalStyle.card,
          ]}>
          {/* <Image style={styles.tinyImage} source={{uri: item.filename}} /> */}
          <ProgressiveImage
            defaultImageSource={require('../../images/default-img.png')}
            source={{uri: item.filename}}
            style={styles.tinyImage}
            resizeMode="cover"
          />
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '600', fontSize: 20}}>{item.title}</Text>
            <Text style={{fontSize: 13, color: 'grey'}}>
              {item.publish_date}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (
      url.indexOf('mp4') !== -1 ||
      url.indexOf('avi') !== -1 ||
      url.indexOf('mov') !== -1 ||
      url.indexOf('wmv') !== -1 ||
      url.indexOf('flv') !== -1
    ) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Video', {
              type: 'video',
              thumbnail: item.filename,
              title: item.title,
              short_description: item.short_description,
              long_description: item.long_description,
              url: item.attacnment,
              announcement: announcement.filter(item => {
                let urlSplitArr = item.attacnment.split('.');
                let extension = urlSplitArr[2];
                // if (extension == 'mp4') {
                //   return item;
                // }
                return extension == 'mp4';
              }),
            })
          }
          key={index}
          style={[
            {
              marginTop: 20,
              marginBottom: index == announcement.length - 1 ? 100 : null,
              backgroundColor: 'white',
              width: '99%',
            },
            GlobalStyle.card,
          ]}>
          {/* <Image style={styles.tinyImage} source={{uri: item.filename}} /> */}
          <ProgressiveImage
            defaultImageSource={require('../../images/default-img.png')}
            source={{uri: item.filename}}
            style={styles.tinyImage}
            resizeMode="cover"
          />
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '600', fontSize: 20}}>{item.title}</Text>
            <Text style={{fontSize: 13, color: 'grey'}}>
              {item.publish_date}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (
      url.indexOf('youtube.com') !== -1 ||
      url.indexOf('youtu.be') !== -1
    ) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Doc Details', {
              type: 'youtube',
              photo: item.filename,
              title: item.title,
              short_description: item.short_description,
              long_description: item.long_description,
              url: item.attacnment,
            })
          }
          key={index}
          style={[
            {
              marginTop: 20,
              marginBottom: index == announcement.length - 1 ? 100 : null,
              backgroundColor: 'white',
              width: '99%',
            },
            GlobalStyle.card,
          ]}>
          {/* <Image style={styles.tinyImage} source={{uri: item.filename}} /> */}
          <ProgressiveImage
            defaultImageSource={require('../../images/default-img.png')}
            source={{uri: item.filename}}
            style={styles.tinyImage}
            resizeMode="cover"
          />
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '600', fontSize: 20}}>{item.title}</Text>
            <Text style={{fontSize: 13, color: 'grey'}}>
              {item.publish_date}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {empty && (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={styles.tinyLogo}
            source={require('../../images/nothingToShow.gif')}
          />
        </View>
      )}
      {loading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      )}

      {!loading && (
        <View
          style={{flex: 1, backgroundColor: '#e3eefb', paddingHorizontal: 15}}>
          <PullToRefresh onRefresh={handleRefresh}>
            {announcement
              ? announcement.map((i, index) => renderAnnouncement(i, index))
              : null}
          </PullToRefresh>
        </View>
      )}

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
          onPress={() => navigation.navigate('home')}
          style={{
            padding: 15,
            backgroundColor: GlobalStyle.blueDark,
            borderRadius: 5,
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: '700'}}>
            Back To Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  btn_style: {
    width: '100%',
    marginTop: 30,
    backgroundColor: '#0321a4',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  tinyImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    resizeMode: 'cover',
  },
});

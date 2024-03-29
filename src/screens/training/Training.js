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
import GlobalStyle from '../../reusable/GlobalStyle';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import {EssContext} from '../../../Context/EssContext';
import PullToRefresh from '../../reusable/PullToRefresh';

const Training = ({navigation}) => {
  const [empty, setempty] = useState(false);
  const [loading, setloading] = useState(false);
  const [training, settraining] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      get_training();
    }, []),
  );

  const get_training = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/api/download`, body, config)
      .then(response => {
        // console.log('response', response.data);
        if (response.data.status == 1) {
          setloading(false);
          try {
            // console.log(response.data.content);
            settraining(response.data.content);
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

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_training();
  };

  const renderTraining = (item, index) => {
    const url = item.download_video;
    let urlSplitArr = item.download_video.split('.');
    let extension = urlSplitArr[2];

    if (
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
            navigation.navigate('Training Details', {
              type: 'pdf',
              photo: item.download_icon,
              title: item.title,
              description: item.description,
              url: item.download_video,
            })
          }
          key={index}
          style={[
            {
              marginTop: 20,
              marginBottom: index == training.length - 1 ? 200 : null,
              backgroundColor: 'white',
              width: '99%',
            },
            GlobalStyle.card,
          ]}>
          <Image style={styles.tinyImage} source={{uri: item.download_icon}} />
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '600', fontSize: 18, width: '70%'}}>
              {item.title}
            </Text>
            <Text style={{fontSize: 13, color: 'grey'}}>
              {item.create_date.split(' ')[0]}
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
            navigation.navigate('Video Details', {
              type: 'video',
              thumbnail: item.download_icon,
              title: item.title,
              long_description: item.description,
              url: item.download_video,
              training: training.filter(item => {
                let urlSplitArr = item.download_video.split('.');
                let extension = urlSplitArr[2];
                return extension == 'mp4';
              }),
            })
          }
          key={index}
          style={[
            {
              marginTop: 20,
              marginBottom: index == training.length - 1 ? 100 : null,
              backgroundColor: 'white',
              width: '99%',
            },
            GlobalStyle.card,
          ]}>
          <Image style={styles.tinyImage} source={{uri: item.download_icon}} />
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '600', fontSize: 18, width: '70%'}}>
              {item.title}
            </Text>
            <Text style={{fontSize: 13, color: 'grey'}}>
              {item.create_date.split(' ')[0]}
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
            navigation.navigate('Training Details', {
              type: 'youtube',
              photo: item.download_icon,
              title: item.title,
              description: item.description,
              url: item.download_video,
            })
          }
          key={index}
          style={[
            {
              marginTop: 20,
              marginBottom: index == training.length - 1 ? 100 : null,
              backgroundColor: 'white',
              width: '99%',
            },
            GlobalStyle.card,
          ]}>
          <Image style={styles.tinyImage} source={{uri: item.download_icon}} />
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '600', fontSize: 18, width: '70%'}}>
              {item.title}
            </Text>
            <Text style={{fontSize: 13, color: 'grey'}}>
              {item.create_date.split(' ')[0]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (url.indexOf('uploads/announcement/attacnment/0') !== -1) {
      return (
        <TouchableOpacity
          onPress={() => alert('file does not exist!')}
          key={index}
          style={[
            {
              padding: 15,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: index == training.length - 1 ? 100 : null,
              marginTop: 20,
              width: '99.5%',
            },
            GlobalStyle.card,
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AntDesign
              name="questioncircle"
              size={28}
              color="red"
              style={{marginRight: 10}}
            />
            <Text style={{fontWeight: '600', fontSize: 16}}>{item.title}</Text>
          </View>
          <AntDesign
            name="rightcircle"
            size={28}
            color="#0043ae"
            style={{marginRight: 5}}
          />
        </TouchableOpacity>
      );
    }
  };

  // console.log('training - ', training);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {empty ? (
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
      ) : loading == false ? (
        <View
          style={{flex: 1, backgroundColor: '#e3eefb', paddingHorizontal: 15}}>
          <PullToRefresh onRefresh={handleRefresh}>
            {training
              ? training.map((i, index) => renderTraining(i, index))
              : null}
          </PullToRefresh>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#388aeb" />
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

export default Training;

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

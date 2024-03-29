import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import VideoPlayer from 'react-native-video-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../reusable/GlobalStyle';
import LinearGradient from 'react-native-linear-gradient';

const OpenVideo = ({route, navigation}) => {
  const url = route.params.url;
  const [showMore, setshowMore] = useState(true);
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

  const announcementNavigate = item => {
    let urlSplitArr = item.attacnment.split('.');
    let extension = urlSplitArr[2];

    if (
      extension == 'pdf' ||
      extension == 'doc' ||
      extension == 'docx' ||
      extension == 'jpg' ||
      extension == 'jpeg' ||
      extension == 'png' ||
      extension == 'gif'
    ) {
      navigation.navigate('Doc Details', {
        type: 'pdf',
        photo: item.filename,
        title: item.title,
        short_description: item.short_description,
        long_description: item.long_description,
        url: item.attacnment,
      });
    } else if (extension == 'mp4') {
      navigation.navigate('Video', {
        type: 'video',
        thumbnail: item.filename,
        title: item.title,
        short_description: item.short_description,
        long_description: item.long_description,
        url: item.attacnment,
        announcement: route.params.announcement,
      });
    } else if (extension == undefined && urlSplitArr[0] != 'https://youtu') {
      alert('file does not exist!');
    } else if (urlSplitArr[0] == 'https://youtu') {
      navigation.navigate('Doc Details', {
        type: 'youtube',
        photo: item.filename,
        title: item.title,
        short_description: item.short_description,
        long_description: item.long_description,
        url: item.attacnment,
      });
    }
  };

  const renderAnnouncements = ({item}) => (
    <TouchableOpacity onPress={() => announcementNavigate(item)}>
      <ImageBackground
        style={styles.options}
        source={{uri: item.filename}}
        imageStyle={{borderRadius: 5}}>
        <LinearGradient
          colors={['#00000000', '#000000']}
          style={{
            height: 160,
            width: 130,
            borderRadius: 5,
          }}>
          <Text
            style={{
              color: 'white',
              position: 'absolute',
              bottom: 10,
              left: 10,
              fontSize: 17,
              fontWeight: '600',
            }}>
            {item.title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const navigateTo = item => {
    let urlSplitArr = item.download_video.split('.');
    let extension = urlSplitArr[2];

    if (
      extension == 'pdf' ||
      extension == 'doc' ||
      extension == 'docx' ||
      extension == 'jpg' ||
      extension == 'jpeg' ||
      extension == 'png' ||
      extension == 'gif'
    ) {
      navigation.navigate('Training Details', {
        type: 'pdf',
        photo: item.download_icon,
        title: item.title,
        description: item.description,
        url: item.download_video,
      });
    } else if (extension == 'mp4') {
      navigation.navigate('Video', {
        type: 'video',
        thumbnail: item.download_icon,
        title: item.title,
        long_description: item.description,
        url: item.download_video,
        training: route.params.training,
      });
    } else if (extension == undefined && urlSplitArr[0] != 'https://youtu') {
      alert('file does not exist!');
    } else if (urlSplitArr[0] == 'https://youtu') {
      navigation.navigate('Training Details', {
        type: 'youtube',
        photo: item.download_icon,
        title: item.title,
        description: item.description,
        url: item.download_video,
      });
    }
  };

  const renderTraining = ({item}) => (
    <TouchableOpacity onPress={() => navigateTo(item)}>
      <ImageBackground
        style={styles.options}
        source={{uri: item.download_icon}}
        imageStyle={{borderRadius: 5}}>
        <LinearGradient
          colors={['#00000000', '#000000']}
          style={{
            height: 160,
            width: 130,
            borderRadius: 5,
          }}>
          <Text
            style={{
              color: 'white',
              position: 'absolute',
              bottom: 10,
              left: 10,
              fontSize: 17,
              fontWeight: '600',
            }}>
            {item.title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <VideoPlayer
          video={{
            uri: url,
          }}
          resizeMode="cover"
          videoWidth={1600}
          videoHeight={900}
          thumbnail={{uri: route.params.thumbnail}}
          showDuration={true}
          disableFullscreen={true}
        />
        <View style={{padding: 15, marginBottom: 100}}>
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
          <View style={{marginTop: 10}}>
            {route.params.short_description && (
              <Text style={{color: 'grey', fontSize: 16}}>
                {route.params.short_description}
              </Text>
            )}
            {showMore ? (
              <Text style={{marginTop: 3, fontSize: 18}}>
                {route.params.long_description.slice(0, 20)}...
              </Text>
            ) : (
              <Text style={{marginTop: 3, fontSize: 18}}>
                {route.params.long_description}
              </Text>
            )}
          </View>
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
          <View style={{marginHorizontal: -15}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
                padding: 15,
              }}>
              <Text style={{fontSize: 18, fontWeight: '700'}}>More Videos</Text>
            </View>
            {route.params.announcement ? (
              <FlatList
                horizontal
                data={route.params.announcement}
                renderItem={renderAnnouncements}
                keyExtractor={item => item.id}
              />
            ) : (
              <FlatList
                horizontal
                data={route.params.training}
                renderItem={renderTraining}
                keyExtractor={item => item.id}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OpenVideo;

const styles = StyleSheet.create({
  purple_txt: {fontSize: 14, fontWeight: '700', color: GlobalStyle.blueDark},
  options: {
    width: 130,
    height: 160,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'cover',
    // backgroundColor: 'red',
  },
  txt_color: {color: '#008080', fontSize: 15, fontWeight: '600'},
});

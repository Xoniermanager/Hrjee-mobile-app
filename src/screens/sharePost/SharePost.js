import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import {EssContext} from '../../../Context/EssContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import apiUrl from '../../reusable/apiUrl';
import post from '../../../api/post';
import useApi from '../../../api/useApi';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ProgressiveImage from '../../reusable/ProgressiveImage';
import useApi2 from '../../../api/useApi2';

// import {ScrollView} from 'react-native-gesture-handler';
// import {Camera} from 'expo-camera';
// import {Video} from 'expo-av';

const WINDOW_WIDTH = Dimensions.get('window').width;
// if(WINDOW_WIDTH >)

const SharePost = ({navigation, route}) => {
  const {post_id, user_id, setpost_id, setuser_id} = useContext(EssContext);

  const get_post_details_api = useApi(post.get_post_details);
  const add_user_repost_api = useApi2(post.add_user_repost);

  const isFocused = useIsFocused();

  const [user, setuser] = useState();
  const [singleFile, setSingleFile] = useState();
  const [caption, setcaption] = useState('');
  const [loading, setloading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        AsyncStorage.getItem('UserData').then(res => {
          setuser(JSON.parse(res));
        });
      };
      getData();
      post_id && get_post_details();
    }, [post_id]),
  );

  useEffect(() => {
    if (isFocused == false) {
      setpost_id();
      setuser_id();
      setcaption('');
      console.log('leave');
    }
  }, [isFocused]);

  const get_post_details = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    get_post_details_api.request(
      {
        user_id: user_id,
        post_id: post_id,
      },
      config,
    );
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res--->', res);
      setSingleFile(res);
      // setModalVisibleImgUp(!modalVisibleImgUp);
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const uploadPost = async () => {
    console.log('uploadPost');
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    // Check if any file is selected or not
    if (singleFile != null) {
      // If file selected then create FormData
      const fileToUpload = singleFile;
      // console.log('fileToUpload->', fileToUpload[0]);
      const data = new FormData();
      data.append('user_id', user.userid);
      data.append('post', fileToUpload[0]);
      data.append('title', caption);
      data.append('cmp_id', user.company_id);
      // Please change file upload URL
      let res = await fetch(`${apiUrl}/api/add_user_post`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Token: token,
        },
      });

      let responseJson = await res;
      // console.log('POST--->', responseJson);
      if (responseJson.status == 200) {
        setloading(false);
        alert('Uploaded Successfully');
        setSingleFile(null);
        setcaption('');
        navigation.navigate('Post', {screen: 'Post'});
      } else {
        setloading(false);
        // alert(responseJson.message);
      }
    } else {
      setloading(false);
      // If no file selected the show alert
      alert('Add image');
    }
  };

  const uploadPostRepost = async () => {
    console.log('uploadPostRepost');
    setloading(true);

    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {
      user_id: user.userid,
      cmp_id: user.company_id,
      post_id: post_id,
      msg: caption,
    };
    add_user_repost_api.request(body, config);
  };

  useEffect(() => {
    setTimeout(function () {
      if (add_user_repost_api.data != null) {
        if (add_user_repost_api.data.status == 1) {
          setloading(false);
          alert(add_user_repost_api.data.msg);

          setcaption('');
          navigation.navigate('Post', {screen: 'Post'});
        } else {
        }
      }
      add_user_repost_api.error && alert(add_user_repost_api.error);
    }, 200);
  }, [add_user_repost_api.data]);

  console.log('WINDOW_WIDTH--->', WINDOW_WIDTH);

  return (
    <>
      {!loading ? (
        <View
          style={{
            flex: 1,

            backgroundColor: 'white',
          }}>
          <ScrollView
            style={{
              flex: 1,
              // padding: 15,
            }}>
            <View
              style={{
                padding: 15,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={styles.tinyLogo}
                  source={
                    user?.image
                      ? {uri: user.image}
                      : require('../../images/profile_pic.webp')
                  }
                />
                <Text style={{fontWeight: '600', fontSize: 16}}>
                  {user?.name}
                </Text>
              </View>
              <TextInput
                onChangeText={text => setcaption(text)}
                value={caption}
                textAlignVertical={'top'}
                multiline
                placeholder="What do you want to talk about?"
                style={{
                  height: post_id ? WINDOW_WIDTH / 1.7 : WINDOW_WIDTH * 1.42,
                  flex: 1,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />
              {get_post_details_api.data && post_id && (
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: 'grey',
                    borderRadius: 5,
                    marginBottom: 30,
                    // backgroundColor: 'pink',
                  }}>
                  <View style={{padding: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={styles.tinyLogo}
                        source={
                          get_post_details_api.data
                            ? {
                                uri: get_post_details_api.data?.data
                                  ?.profile_image,
                              }
                            : require('../../images/profile_pic.webp')
                        }
                      />
                      <View>
                        <Text style={{fontSize: 15, fontWeight: '600'}}>
                          {get_post_details_api.data?.data?.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: 'grey',
                            fontWeight: '500',
                          }}>
                          {
                            get_post_details_api.data?.data?.created_at.split(
                              ' ',
                            )[0]
                          }
                        </Text>
                      </View>
                    </View>
                    <Text style={{marginVertical: 5}}>
                      {get_post_details_api.data?.data?.title}
                    </Text>
                  </View>
                  <View>
                    {/* <Image
                      style={styles.post}
                      source={
                        get_post_details_api.data?.data?.post
                          ?.split('.')
                          .reverse()[0] == 'MP4'
                          ? require('../../images/movie-player.png')
                          : {uri: get_post_details_api.data?.data?.post}
                      }
                    /> */}
                    <ProgressiveImage
                      defaultImageSource={require('../../images/default-img.png')}
                      source={{uri: get_post_details_api.data?.data?.post}}
                      style={styles.post}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              )}
              {singleFile && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    marginTop: -30,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text>{singleFile ? singleFile[0]?.name : null}</Text>
                    <Feather
                      name="delete"
                      style={{fontSize: 20, color: 'red', marginLeft: 10}}
                      onPress={() => {
                        setSingleFile(null);
                      }}
                    />
                  </View>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {!post_id ? (
                    <>
                      <AntDesign
                        onPress={selectFile}
                        name="camera"
                        style={{fontSize: 23, color: 'grey', marginRight: 20}}
                      />
                      <Entypo
                        onPress={selectFile}
                        name="video-camera"
                        style={{fontSize: 23, color: 'grey', marginRight: 20}}
                      />
                    </>
                  ) : (
                    <>
                      <AntDesign
                        name="camera"
                        style={{
                          fontSize: 23,
                          color: '#00000040',
                          marginRight: 20,
                        }}
                      />
                      <Entypo
                        name="video-camera"
                        style={{
                          fontSize: 23,
                          color: '#00000040',
                          marginRight: 20,
                        }}
                      />
                    </>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    !post_id ? uploadPost() : uploadPostRepost();
                  }}>
                  <Text
                    style={{color: '#0043ae', fontWeight: '600', fontSize: 16}}>
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color="#0043ae" />
        </View>
      )}
    </>
  );
};

export default SharePost;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 10,
  },
  post: {
    height: 200,
    width: null,
    resizeMode: 'cover',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

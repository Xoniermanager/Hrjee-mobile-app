import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useContext,
} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useApi from '../../../api/useApi';

import post from '../../../api/post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EssContext} from '../../../Context/EssContext';
import apiUrl from '../../reusable/apiUrl';
import VideoPlayer from 'react-native-video-player';
import useApi2 from '../../../api/useApi2';
import ProgressiveImage from '../../reusable/ProgressiveImage';
import Skeleton from '../../reusable/Skeleton';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import PullToRefresh from '../../reusable/PullToRefresh';
import Empty from '../../reusable/Empty';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Post = ({navigation}) => {
  const {user, setpost_id, post_id, setuser_id} = useContext(EssContext);
  const get_cmp_post = useApi(post.get_cmp_post);
  const delete_post_api = useApi(post.delete_post);
  const like_post_api = useApi(post.like_post);
  const dislike_post_api = useApi(post.dislike_post);
  const update_user_repost_api = useApi2(post.update_user_repost);
  const add_user_repost_api = useApi2(post.add_user_repost);

  useFocusEffect(
    React.useCallback(() => {
      get_all_cmp_post();
    }, [
      delete_post_api.loading,
      like_post_api.loading,
      dislike_post_api.loading,
      // get_cmp_post.loading,
    ]),
  );

  const [like, setlike] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [modalVisibleImgUp, setModalVisibleImgUp] = useState(false);
  const [uploading, setuploading] = useState(false);
  const [showUpdate, setshowUpdate] = useState(true);
  const [postid, setpostid] = useState('');
  const [loading, setloading] = useState(false);
  const [caption, setcaption] = useState('');
  const [repost, setrepost] = useState(false);
  const [editRepost, seteditRepost] = useState(false);
  const [repostId, setrepostId] = useState(null);
  const [posts, setposts] = useState([]);
  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res--->', res);
      setSingleFile(res);
      setshowUpdate(false);
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
  const get_all_cmp_post = async () => {
    setloading(false);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    get_cmp_post.request(
      {
        user_id: user.userid,
        cmp_id: user.company_id,
      },
      config,
    );
  };

  const renderPlaceholder = () => {
    return (
      <View style={{height: height, padding: 20, backgroundColor: 'white'}}>
        {[1, 2, 3].map(item => (
          <View key={item} style={{marginBottom: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ShimmerPlaceHolder
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  marginRight: 15,
                }}
                autoRun={true}
              />
              <ShimmerPlaceHolder
                height={30}
                style={{width: '80%'}}
                autoRun={true}
              />
            </View>

            <ShimmerPlaceHolder
              autoRun={true}
              style={{marginTop: 10, marginHorizontal: -20, width: width}}
              // width={300}
              height={200}
            />
            <ShimmerPlaceHolder
              autoRun={true}
              style={{marginTop: 10}}
              width={200}
              height={20}
            />
          </View>
        ))}
      </View>
    );
  };
  const delete_post = async () => {
    console.log('first');
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    delete_post_api.request(
      {
        post_id: postid,
      },
      config,
    );
    // get_all_cmp_post();
    handleClosePress();
  };
  const like_post = async id => {
    console.log('first');
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    like_post_api.request(
      {
        post_id: id,
        user_id: user.userid,
      },
      config,
    );
  };
  const dislike_post = async id => {
    console.log('first');
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    dislike_post_api.request(
      {
        post_id: id,
        user_id: user.userid,
      },
      config,
    );
  };
  const updatePost = async id => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    // Check if any file is selected or not
    if (singleFile != null) {
      // If file selected then create FormData
      const fileToUpload = singleFile;
      // console.log('fileToUpload->', fileToUpload[0]);
      const data = new FormData();
      data.append('post_id', id);
      data.append('post', fileToUpload[0]);
      data.append('title', caption);
      // Please change file upload URL
      let res = await fetch(`${apiUrl}/api/update_user_post`, {
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
        alert('Updated Successfully');
        setModalVisibleImgUp(false);
        setSingleFile(null);
        setcaption('');
        get_all_cmp_post();
        handleClosePress();
      } else {
        setloading(false);
        // alert(responseJson.message);
      }
    } else {
      setloading(false);
      // If no file selected the show alert
      alert('add image');
    }
  };

  const updateRepost = async () => {
    console.log('updateRepost');
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {
      post_id: postid,
      msg: caption,
      repost_id: repostId,
    };
    update_user_repost_api.request(body, config);
  };

  useEffect(() => {
    setTimeout(function () {
      if (update_user_repost_api.data != null) {
        if (update_user_repost_api.data.status == 1) {
          alert(update_user_repost_api.data.msg);
          setloading(false);
          setcaption('');
          handleClosePress();
          setModalVisibleImgUp(!modalVisibleImgUp);
          get_all_cmp_post();
        } else {
          setloading(false);
        }
      }
      update_user_repost_api.error && alert(update_user_repost_api.error);
    }, 1000);
  }, [update_user_repost_api.data]);

  const uploadPostRepost = async () => {
    // console.log('uploadPostRepost');
    let user = await AsyncStorage.getItem('UserData');
    user = JSON.parse(user);
    // AsyncStorage.getItem('UserData').then(res => {
    //   user = JSON.parse(res);
    // });
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {
      user_id: user.userid,
      cmp_id: user.company_id,
      post_id: post_id,
      msg: '',
    };
    console.log('body---->', body);
    add_user_repost_api.request(body, config);
  };

  useEffect(() => {
    if (add_user_repost_api.data != null) {
      if (add_user_repost_api.data.status == 1) {
        alert(add_user_repost_api.data.msg);
        handleClosePress();
        get_all_cmp_post();
      }
    }
  }, [add_user_repost_api.data]);

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_all_cmp_post();
  };

  // ref
  const bottomSheetRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ['1%', '25%'], []);
  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleClosePress = () => bottomSheetRef.current.close();
  const handleExpandPress = () => bottomSheetRef.current.expand();

  console.log('post==>', get_cmp_post.data);

  return (
    <View style={{flex: 1}}>
      {get_cmp_post.error && alert(get_cmp_post.error)}
      {!get_cmp_post.data && get_cmp_post.loading && renderPlaceholder()}
      {get_cmp_post.data?.data.length == 0 && !get_cmp_post.loading && (
        <View
          style={{
            height: '100%',
            backgroundColor: 'white',
            alignItems: 'center',
          }}>
          <Empty onPress={() => navigation.goBack()} />
        </View>
      )}
      {get_cmp_post.data && (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleImgUp}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{alignItems: 'flex-end'}}>
                  <AntDesign
                    name="close"
                    style={{fontSize: 20, color: 'red'}}
                    onPress={() => setModalVisibleImgUp(!modalVisibleImgUp)}
                  />
                </View>
                {!editRepost &&
                  (singleFile ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
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
                            setshowUpdate(true);
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={selectFile}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 20,
                      }}>
                      <AntDesign
                        name="cloudupload"
                        style={{fontSize: 20, marginRight: 10}}
                      />
                      <Text>Upload</Text>
                    </TouchableOpacity>
                  ))}
                <TextInput
                  multiline
                  style={styles.input}
                  placeholder="write a caption..."
                  onChangeText={text => setcaption(text)}
                  value={caption}
                />
                {!editRepost ? (
                  <TouchableOpacity
                    onPress={() => updatePost(postid)}
                    style={[styles.button, styles.buttonClose]}>
                    {loading ? (
                      <Text style={styles.textStyle}>Updating...</Text>
                    ) : (
                      <Text style={styles.textStyle}>Update</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => updateRepost()}
                    style={[styles.button, styles.buttonClose]}>
                    {loading ? (
                      <Text style={styles.textStyle}>Updating...</Text>
                    ) : (
                      <Text style={styles.textStyle}>Update</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>

          <PullToRefresh onRefresh={handleRefresh}>
            {get_cmp_post.data?.data?.map((i, index) =>
              !i.repost_by ? (
                <View
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    marginTop: index == 0 ? 0 : 10,
                  }}>
                  <View style={{padding: 10}}>
                    <View style={styles.separator}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          style={styles.tinyLogo}
                          source={
                            i.profile_image
                              ? {uri: i.profile_image}
                              : require('../../images/profile_pic.webp')
                          }
                        />
                        <View style={{marginLeft: 10}}>
                          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                            {i.name}
                          </Text>
                          <Text style={styles.lightTxt}>
                            {i.created_at.split(' ')[0]}
                          </Text>
                        </View>
                      </View>
                      {/* {i.user_id == user.userid && (
                    <Feather
                      name="more-vertical"
                      size={17}
                      color="#0321a4"
                      onPress={() => {
                        seteditRepost(false);
                        setrepost(false);
                        handleExpandPress(),
                          setpostid(i.id),
                          setcaption(i.title),
                          setSingleFile([
                            {
                              name: i.post.split('/').reverse()[0],
                            },
                          ]);
                      }}
                    />
                  )} */}
                    </View>
                    <Text style={{marginTop: 10}}>{i.title}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Single Post', {
                        post_id: i.id,
                        user_id: i.user_id,
                        cmp_id: i.cmp_id,
                      })
                    }>
                    {i.post.split('.').reverse()[0] == 'MP4' ? (
                      <VideoPlayer
                        video={{
                          uri: i.post,
                        }}
                        resizeMode="cover"
                        videoWidth={1600}
                        videoHeight={900}
                        showDuration={true}
                        disableFullscreen={true}
                      />
                    ) : (
                      // <Image
                      //   style={styles.post}
                      //   source={
                      //     i.post
                      //       ? {uri: i.post}
                      //       : require('../../images/image_error.png')
                      //   }
                      // />
                      <ProgressiveImage
                        defaultImageSource={require('../../images/default-img.png')}
                        source={{uri: i.post}}
                        style={styles.post}
                        resizeMode="cover"
                      />
                    )}
                  </TouchableOpacity>
                  <View style={{padding: 10}}>
                    <View
                      style={[
                        styles.separator,
                        {
                          paddingBottom: 10,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <AntDesign
                          name="like1"
                          size={15}
                          color="#388aebff"
                          style={{marginRight: 5}}
                        />
                        <Text style={styles.lightTxt}>{i.post_like} Like</Text>
                      </View>
                      <Text style={styles.lightTxt}>
                        {i.total_comment} Comments
                      </Text>
                    </View>
                    <View
                      style={[
                        {
                          borderTopWidth: 0.3,
                          borderTopColor: 'grey',
                          paddingTop: 10,
                          paddingHorizontal: 20,
                        },
                        styles.separator,
                      ]}>
                      {i.like_status > 0 ? (
                        <TouchableOpacity
                          onPress={() => dislike_post(i.id)}
                          style={styles.likeCom}>
                          <AntDesign
                            name="like1"
                            size={15}
                            color="#388aebff"
                            style={{marginRight: 5}}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => like_post(i.id)}
                          style={styles.likeCom}>
                          <AntDesign
                            name="like2"
                            size={15}
                            style={{marginRight: 5}}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      )}

                      {/* <TouchableOpacity
                    onPress={() => {
                      setrepost(true);
                      handleExpandPress();
                      setpost_id(i.id);
                      setuser_id(i.user_id);
                    }}
                    style={styles.likeCom}>
                    <AntDesign name="sync" size={15} style={{marginRight: 5}} />
                    <Text style={styles.likeTxt}>Repost</Text>
                  </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Single Post', {
                            post_id: i.id,
                            user_id: i.user_id,
                            cmp_id: i.cmp_id,
                          })
                        }
                        style={styles.likeCom}>
                        <MaterialCommunityIcons
                          name="comment-outline"
                          size={15}
                          style={{marginRight: 5}}
                        />
                        <Text style={styles.likeTxt}>Comment</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: 'white',
                    marginTop: index == 0 ? 0 : 10,
                  }}>
                  <View style={{padding: 10}}>
                    <View style={styles.separator}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          style={styles.tinyLogo}
                          source={
                            i.repost_user
                              ? {uri: i.repost_user.image}
                              : require('../../images/profile_pic.webp')
                          }
                        />
                        <View style={{marginLeft: 10}}>
                          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                            {i.repost_user.name}
                          </Text>
                          <Text style={styles.lightTxt}>
                            {i.repost_date?.split(' ')[0]}
                          </Text>
                        </View>
                      </View>
                      {i.repost_by == user.userid && (
                        <Feather
                          name="more-vertical"
                          size={17}
                          color="#0321a4"
                          onPress={() => {
                            setrepost(false);
                            handleExpandPress(),
                              setpostid(i.id),
                              setcaption(i.repost_msg);
                            seteditRepost(true);
                            setrepostId(i.repost_by);
                          }}
                        />
                      )}
                    </View>
                    {i.repost_msg && (
                      <Text style={{marginTop: 10}}>{i.repost_msg}</Text>
                    )}
                  </View>
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: 'grey',
                      borderRadius: 5,
                      marginTop: 0,
                      margin: 10,
                    }}>
                    <View style={{padding: 10}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          style={[styles.tinyLogo, {marginRight: 5}]}
                          source={
                            i.profile_image
                              ? {uri: i.profile_image}
                              : require('../../images/profile_pic.webp')
                          }
                        />
                        <View>
                          <Text style={{fontSize: 15, fontWeight: '600'}}>
                            {i.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'grey',
                              fontWeight: '500',
                            }}>
                            {i?.created_at.split(' ')[0]}
                          </Text>
                        </View>
                      </View>
                      <Text style={{marginVertical: 5}}>{i?.title}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Single Post', {
                          post_id: i.id,
                          user_id: i.user_id,
                          cmp_id: i.cmp_id,
                        })
                      }>
                      {i.post.split('.').reverse()[0] == 'MP4' ? (
                        <VideoPlayer
                          video={{
                            uri: i.post,
                          }}
                          resizeMode="cover"
                          videoWidth={1600}
                          videoHeight={900}
                          showDuration={true}
                          disableFullscreen={true}
                        />
                      ) : (
                        // <Image
                        //   style={styles.post}
                        //   source={
                        //     i.post
                        //       ? {uri: i.post}
                        //       : require('../../images/image_error.png')
                        //   }
                        // />
                        <ProgressiveImage
                          defaultImageSource={require('../../images/default-img.png')}
                          source={{uri: i.post}}
                          style={styles.post}
                          resizeMode="cover"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={{padding: 10}}>
                    <View
                      style={[
                        styles.separator,
                        {
                          paddingBottom: 10,
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <AntDesign
                          name="like1"
                          size={15}
                          color="#388aebff"
                          style={{marginRight: 5}}
                        />
                        <Text style={styles.lightTxt}>{i.post_like} Like</Text>
                      </View>
                      <Text style={styles.lightTxt}>
                        {i.total_comment} Comments
                      </Text>
                    </View>
                    <View
                      style={[
                        {
                          borderTopWidth: 0.3,
                          borderTopColor: 'grey',
                          paddingTop: 10,
                          paddingHorizontal: 20,
                        },
                        styles.separator,
                      ]}>
                      {i.like_status > 0 ? (
                        <TouchableOpacity
                          onPress={() => dislike_post(i.id)}
                          style={styles.likeCom}>
                          <AntDesign
                            name="like1"
                            size={15}
                            color="#388aebff"
                            style={{marginRight: 5}}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => like_post(i.id)}
                          style={styles.likeCom}>
                          <AntDesign
                            name="like2"
                            size={15}
                            style={{marginRight: 5}}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      )}

                      {/* <TouchableOpacity
                    onPress={() => {
                      setrepost(true);
                      handleExpandPress();
                      setpost_id(i.id);
                      setuser_id(i.user_id);
                    }}
                    style={styles.likeCom}>
                    <AntDesign name="sync" size={15} style={{marginRight: 5}} />
                    <Text style={styles.likeTxt}>Repost</Text>
                  </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Single Post', {
                            post_id: i.id,
                            user_id: i.user_id,
                            cmp_id: i.cmp_id,
                          })
                        }
                        style={styles.likeCom}>
                        <MaterialCommunityIcons
                          name="comment-outline"
                          size={15}
                          style={{marginRight: 5}}
                        />
                        <Text style={styles.likeTxt}>Comment</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ),
            )}
          </PullToRefresh>

          <BottomSheet
            style={{
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 1,
              shadowRadius: 4,
              elevation: 5,
            }}
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={handleSheetChanges}>
            <View style={[styles.contentContainer]}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <AntDesign
                  name="close"
                  style={{
                    fontSize: 25,
                    color: 'red',
                  }}
                  onPress={() => handleClosePress()}
                />
              </View>
              {!repost ? (
                <View>
                  <TouchableOpacity
                    onPress={() => setModalVisibleImgUp(!modalVisibleImgUp)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="edit"
                      style={{fontSize: 20, marginRight: 15}}
                    />
                    <View>
                      <Text style={{fontSize: 18}}>Edit</Text>
                      <Text style={{fontSize: 12, color: 'grey'}}>
                        Edit your post
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => delete_post()}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <AntDesign
                      name="delete"
                      style={{fontSize: 20, marginRight: 15, color: 'red'}}
                    />
                    <View>
                      <Text style={{fontSize: 18, color: 'red'}}>Delete</Text>
                      <Text style={{fontSize: 12, color: 'red'}}>
                        Delete your post
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Share Post', {
                        screen: 'Share Post',
                      });
                      handleClosePress();
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Feather
                      name="edit"
                      style={{fontSize: 20, marginRight: 15}}
                    />
                    <View>
                      <Text style={{fontSize: 18}}>
                        Repost with your thoughts
                      </Text>
                      <Text style={{fontSize: 12, color: 'grey'}}>
                        Create a new post with hrjee's post attached
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => uploadPostRepost()}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <AntDesign
                      name="sharealt"
                      style={{fontSize: 20, marginRight: 15}}
                    />
                    <View>
                      <Text style={{fontSize: 18}}>Repost</Text>
                      <Text style={{fontSize: 12, color: 'grey'}}>
                        Instantly bring hrjee's post to other's feeds
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </BottomSheet>
        </>
      )}
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 47,
    height: 47,
    borderRadius: 100,
  },
  post: {
    height: 300,
    flex: 1,
    width: null,
    resizeMode: 'cover',
  },
  lightTxt: {fontSize: 13, color: 'grey'},
  likeTxt: {fontSize: 14},
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeCom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#00000010',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000070',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,

    width: width / 1.1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    // width: '80%',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  loader: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

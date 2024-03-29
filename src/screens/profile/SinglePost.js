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
} from 'react-native';
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useContext,
} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useApi from '../../../api/useApi';
import { useNavigation } from '@react-navigation/native';
import post from '../../../api/post';
import { EssContext } from '../../../Context/EssContext';
const { width } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import apiUrl from '../../reusable/apiUrl';
import VideoPlayer from 'react-native-video-player';
import useApi2 from '../../../api/useApi2';
import PullToRefresh from '../../reusable/PullToRefresh';

const SinglePost = ({ navigation, route }) => {
  const { user, setShowDrawerHeader } = useContext(EssContext);
  setShowDrawerHeader(false);
  const post_id = route.params.post_id;
  const get_post_details_api = useApi(post.get_post_details);
  const delete_post_api = useApi(post.delete_post);
  const like_post_api = useApi(post.like_post);
  const dislike_post_api = useApi(post.dislike_post);
  const like_comment_api = useApi(post.like_comment);
  const dislike_comment_api = useApi(post.dislike_comment);
  const add_comment_api = useApi(post.add_comment);
  const delete_comment_api = useApi(post.delete_comment);
  const update_user_repost_api = useApi2(post.update_user_repost);

  const [like, setlike] = useState(false);
  const [postid, setpostid] = useState('');
  const [modalVisibleImgUp, setModalVisibleImgUp] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [showUpdate, setshowUpdate] = useState(true);
  const [caption, setcaption] = useState('');
  const [comment, setcomment] = useState('');
  const [loading, setloading] = useState(false);
  const [bottomSheetCmnt, setbottomSheetCmnt] = useState(false);
  const [commentindex, setcommentindex] = useState('');
  const [editRepost, seteditRepost] = useState(false);
  const [repostId, setrepostId] = useState(null);

  const [commentinfo, setcommentinfo] = useState({
    id: 0,
    index: 0,
  });

  const navig = useNavigation();

  useEffect(() => {
    const unsubscribe = navig.addListener('beforeRemove', () => {
      // Your custom logic here
      setShowDrawerHeader(true);
    });

    return unsubscribe;
  }, [navig]);

  useFocusEffect(
    React.useCallback(() => {
      get_post_details();
    }, [
      delete_post_api.loading,
      like_post_api.loading,
      dislike_post_api.loading,
      add_comment_api.loading,
      delete_comment_api.loading,
      like_comment_api.loading,
      dislike_comment_api.loading,
    ]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (get_post_details_api.data?.repost_msg == null) {
        setcaption(get_post_details_api.data?.data?.title);
        setSingleFile([
          { name: get_post_details_api.data?.data?.post.split('/').reverse()[0] },
        ]);
      } else {
        setcaption(get_post_details_api.data?.data?.repost_msg);
      }
      // console.log('caption->', get_post_details_api.data?.data?.repost_msg);
    }, [get_post_details_api.loading]),
  );

  const get_post_details = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    get_post_details_api.request(
      {
        user_id: user.userid,
        post_id: post_id,
      },
      config,
    );
  };

  const like_post = async id => {
    console.log('first');
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
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
      headers: { Token: token },
    };
    dislike_post_api.request(
      {
        post_id: id,
        user_id: user.userid,
      },
      config,
    );
  };

  const like_comment = async id => {
    // console.log('comment info--->', user.userid, commentinfo.id, id);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    like_comment_api.request(
      {
        user_id: user.userid,
        comment_id: commentinfo.id,
        post_id: id,
      },
      config,
    );
    handleClosePress();
  };

  const dislike_comment = async id => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    dislike_comment_api.request(
      {
        user_id: user.userid,
        comment_id: commentinfo.id,
        post_id: id,
      },
      config,
    );
    handleClosePress();
  };

  const add_comment = async id => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    comment
      ? add_comment_api.request(
        {
          user_id: route.params.user_id,
          cmp_id: route.params.cmp_id,
          post_id: route.params.post_id,
          comment: comment,
          created_by: user.userid,
        },
        config,
      )
      : alert('write a comment!');
    setcomment('');
  };

  const delete_post = async id => {
    console.log('first');
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    delete_post_api.request(
      {
        post_id: id,
      },
      config,
    );
    navigation.goBack();
  };

  const delete_comment = async id => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    delete_comment_api.request(
      {
        comment_id: id,
      },
      config,
    );
    handleClosePress();
    get_post_details();
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
      console.log('POST edit--->', responseJson);
      if (responseJson.status == 200) {
        setloading(false);
        alert('Updated Successfully');
        setModalVisibleImgUp(false);
        setSingleFile(null);
        setcaption('');
        handleClosePress();
        get_post_details();
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
      headers: { Token: token },
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
          get_post_details();
        } else {
          setloading(false);
        }
      }
      update_user_repost_api.error && alert(update_user_repost_api.error);
    }, 1000);
  }, [update_user_repost_api.data]);

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

  // ref
  const bottomSheetRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ['1%', '65%'], []);
  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleClosePress = () => bottomSheetRef.current.close();
  const handleExpandPress = () => bottomSheetRef.current.expand();

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_post_details();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleImgUp}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ alignItems: 'flex-end' }}>
              <AntDesign
                name="close"
                style={{ fontSize: 20, color: 'red' }}
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
                      style={{ fontSize: 20, color: 'red', marginLeft: 10 }}
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
                    style={{ fontSize: 20, marginRight: 10 }}
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
        {get_post_details_api.error && alert(get_post_details_api.error)}
        {get_post_details_api.data?.data && (
          <View>
            <View>
              {get_post_details_api.data?.data?.repost_by == null ? (
                <View>
                  <View style={{ padding: 10 }}>
                    <View style={styles.separator}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          style={styles.tinyLogo}
                          source={{
                            uri: get_post_details_api.data?.data?.profile_image,
                          }}
                        />
                        <View style={{ marginLeft: 10 }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            {get_post_details_api.data?.data?.name}
                          </Text>
                          <Text style={styles.lightTxt}>
                            {
                              get_post_details_api.data?.data?.created_at.split(
                                ' ',
                              )[0]
                            }
                          </Text>
                        </View>
                      </View>
                      {/* {get_post_details_api.data?.data?.user_id ==
                        user.userid && (
                        <Feather
                          name="more-vertical"
                          size={17}
                          color="#0321a4"
                          onPress={() => {
                            setbottomSheetCmnt(false);
                            handleExpandPress(),
                              setpostid(get_post_details_api.data?.data?.id);
                            seteditRepost(false);
                          }}
                        />
                      )} */}
                    </View>
                    {get_post_details_api.data?.data?.title && (
                      <Text style={{ marginTop: 10 }}>
                        {get_post_details_api.data?.data?.title}
                      </Text>
                    )}
                  </View>
                  {get_post_details_api.data?.data?.post
                    .split('.')
                    .reverse()[0] == 'MP4' ? (
                    <VideoPlayer
                      video={{
                        uri: get_post_details_api.data?.data?.post,
                      }}
                      resizeMode="cover"
                      videoWidth={1600}
                      videoHeight={900}
                      // thumbnail={{uri: route.params.thumbnail}}
                      showDuration={true}
                      disableFullscreen={true}
                    />
                  ) : (
                    <Image
                      style={styles.post}
                      source={{ uri: get_post_details_api.data?.data?.post }}
                    />
                  )}
                  <View style={{ padding: 10 }}>
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
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.lightTxt}>
                          {get_post_details_api.data?.data?.post_like} Likes
                        </Text>
                      </View>
                      <Text style={styles.lightTxt}>
                        {get_post_details_api.data?.data?.total_comment}{' '}
                        Comments
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
                      {get_post_details_api.data?.data?.like_status == 1 ? (
                        <TouchableOpacity
                          onPress={() =>
                            dislike_post(get_post_details_api.data?.data?.id)
                          }
                          style={styles.likeCom}>
                          <AntDesign
                            name="like1"
                            size={20}
                            color="#388aebff"
                            style={{ marginRight: 5 }}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            like_post(get_post_details_api.data?.data?.id)
                          }
                          style={styles.likeCom}>
                          <AntDesign
                            name="like2"
                            size={20}
                            style={{ marginRight: 5 }}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity style={styles.likeCom}>
                        <MaterialCommunityIcons
                          name="comment-outline"
                          size={20}
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.likeTxt}>Comment</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={{}}>
                  <View style={{ padding: 10 }}>
                    <View style={styles.separator}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          style={styles.tinyLogo}
                          source={{
                            uri: get_post_details_api.data?.data?.repost_user
                              ?.image,
                          }}
                        />
                        <View style={{ marginLeft: 10 }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            {get_post_details_api.data?.data?.repost_user?.name}
                          </Text>
                          <Text style={styles.lightTxt}>
                            {
                              get_post_details_api.data?.data?.repost_date?.split(
                                ' ',
                              )[0]
                            }
                          </Text>
                        </View>
                      </View>
                      {/* {get_post_details_api.data?.data?.repost_by ==
                        user.userid && (
                        <Feather
                          name="more-vertical"
                          size={17}
                          color="#0321a4"
                          onPress={() => {
                            setbottomSheetCmnt(false);
                            handleExpandPress(),
                              setpostid(get_post_details_api.data?.data?.id);
                            setcaption(
                              get_post_details_api.data?.data?.repost_msg,
                            );
                            seteditRepost(true);
                            setrepostId(
                              get_post_details_api.data?.data?.repost_by,
                            );
                          }}
                        />
                      )} */}
                    </View>
                    {get_post_details_api.data?.data?.repost_msg && (
                      <Text style={{ marginTop: 10 }}>
                        {get_post_details_api.data?.data?.repost_msg}
                      </Text>
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
                    <View style={{ padding: 10 }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          style={[styles.tinyLogo, { marginRight: 5 }]}
                          source={
                            get_post_details_api.data?.data?.profile_image
                              ? {
                                uri: get_post_details_api.data?.data
                                  ?.profile_image,
                              }
                              : require('../../images/profile_pic.webp')
                          }
                        />
                        <View>
                          <Text style={{ fontSize: 15, fontWeight: '600' }}>
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
                      <Text style={{ marginVertical: 5 }}>
                        {get_post_details_api.data?.data?.title}
                      </Text>
                    </View>
                    <View>
                      {get_post_details_api.data?.data?.post
                        .split('.')
                        .reverse()[0] == 'MP4' ? (
                        <VideoPlayer
                          video={{
                            uri: get_post_details_api.data?.data?.post,
                          }}
                          resizeMode="cover"
                          videoWidth={1600}
                          videoHeight={900}
                          showDuration={true}
                          disableFullscreen={true}
                        />
                      ) : (
                        <Image
                          style={styles.post}
                          source={
                            get_post_details_api.data?.data?.post
                              ? { uri: get_post_details_api.data?.data?.post }
                              : require('../../images/image_error.png')
                          }
                        />
                      )}
                    </View>
                  </View>
                  <View style={{ padding: 10 }}>
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
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.lightTxt}>
                          {get_post_details_api.data?.data?.post_like} Likes
                        </Text>
                      </View>
                      <Text style={styles.lightTxt}>
                        {get_post_details_api.data?.data?.total_comment}{' '}
                        Comments
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
                      {get_post_details_api.data?.data?.like_status == 1 ? (
                        <TouchableOpacity
                          onPress={() =>
                            dislike_post(get_post_details_api.data?.data?.id)
                          }
                          style={styles.likeCom}>
                          <AntDesign
                            name="like1"
                            size={20}
                            color="#388aebff"
                            style={{ marginRight: 5 }}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            like_post(get_post_details_api.data?.data?.id)
                          }
                          style={styles.likeCom}>
                          <AntDesign
                            name="like2"
                            size={20}
                            style={{ marginRight: 5 }}
                          />
                          <Text style={styles.likeTxt}>Like</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity style={styles.likeCom}>
                        <MaterialCommunityIcons
                          name="comment-outline"
                          size={20}
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.likeTxt}>Comment</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              <View style={{ padding: 10, marginBottom: 100 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>comments</Text>
                  <AntDesign name="down" size={15} style={{ marginLeft: 5 }} />
                </View>
                {get_post_details_api.data?.data?.comment &&
                  get_post_details_api.data?.data?.comment.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        marginTop: 0,
                        marginBottom:
                          index ==
                            get_post_details_api.data?.data?.comment.length - 1
                            ? 70
                            : 0,
                      }}>
                      <TouchableOpacity
                        onLongPress={() => {
                          setcommentinfo({ id: i.id, index: index });
                          setbottomSheetCmnt(true);
                          handleExpandPress();
                        }}
                        style={{
                          flexDirection: 'row',
                          marginTop: 20,
                          justifyContent: 'space-between',
                          paddingHorizontal: 5,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Image
                            style={[
                              styles.tinyLogo,
                              { width: 35, height: 35, marginRight: 10 },
                            ]}
                            source={{ uri: i.profile_image }}
                          />
                          <View>
                            <View style={styles.commentTag}>
                              <Text style={styles.commentText}>
                                {i.FULL_NAME}
                              </Text>
                              <Text>{i.comment}</Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 6,
                                marginLeft: 10,
                              }}>
                              {i.comment_like_status == 1 ? (
                                <AntDesign
                                  name="like1"
                                  size={15}
                                  style={{ marginRight: 5, color: '#388aebff' }}
                                />
                              ) : (
                                <AntDesign
                                  name="like1"
                                  size={15}
                                  style={{ marginRight: 5, color: '#00000050' }}
                                />
                              )}
                              <Text>{i.like_comment}</Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                {get_post_details_api.data?.data?.comment.length == 0 && (
                  <View
                    style={{
                      marginTop: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 17, fontWeight: '500' }}>
                      No comments yet
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </PullToRefresh>

      <BottomSheet
        style={{
          shadowColor: '#000',
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
        enablePanDownToClose={false}
        onChange={handleSheetChanges}>
        <View style={[styles.contentContainer]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <AntDesign
              name="close"
              style={{
                fontSize: 25,
                color: 'red',
              }}
              onPress={() => handleClosePress()}
            />
          </View>
          {!bottomSheetCmnt ? (
            <>
              <TouchableOpacity
                onPress={() => setModalVisibleImgUp(!modalVisibleImgUp)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <AntDesign
                  name="edit"
                  style={{ fontSize: 20, marginRight: 15 }}
                />
                <Text style={{ fontSize: 18 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => delete_post(postid)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <AntDesign
                  name="delete"
                  style={{ fontSize: 20, marginRight: 15, color: 'red' }}
                />
                <Text style={{ fontSize: 18, color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : get_post_details_api.data?.data?.comment[commentinfo?.index]
            ?.comment_by == user.userid ||
            get_post_details_api.data?.data?.id == user.userid ? (
            <>
              {get_post_details_api.data?.data?.comment[commentinfo?.index] &&
                get_post_details_api.data?.data?.comment[commentinfo?.index]
                  .comment_like_status == 1 && (
                  <TouchableOpacity
                    onPress={() =>
                      dislike_comment(get_post_details_api.data?.data?.id)
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="like1"
                      size={20}
                      color="#388aebff"
                      style={{ marginRight: 15 }}
                    />
                    <Text style={{ fontSize: 18 }}>Dislike</Text>
                  </TouchableOpacity>
                )}

              {get_post_details_api.data?.data?.comment[commentinfo?.index] &&
                get_post_details_api.data?.data?.comment[commentinfo?.index]
                  .comment_like_status == 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      like_comment(get_post_details_api.data?.data?.id)
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="like2"
                      size={20}
                      style={{ marginRight: 15 }}
                    />
                    <Text style={{ fontSize: 18 }}>Like</Text>
                  </TouchableOpacity>
                )}


              <TouchableOpacity
                onPress={() => delete_comment(commentinfo.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <AntDesign
                  name="delete"
                  style={{ fontSize: 20, marginRight: 15, color: 'red' }}
                />
                <Text style={{ fontSize: 18, color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {get_post_details_api.data?.data?.comment[commentinfo?.index] &&
                get_post_details_api.data?.data?.comment[commentinfo?.index]
                  .comment_like_status == 1 && (
                  <TouchableOpacity
                    onPress={() =>
                      dislike_comment(get_post_details_api.data?.data?.id)
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="like1"
                      size={20}
                      color="#388aebff"
                      style={{ marginRight: 15 }}
                    />
                    <Text style={{ fontSize: 18 }}>Dislike</Text>
                  </TouchableOpacity>
                )}

              {get_post_details_api.data?.data?.comment[commentinfo?.index] &&
                get_post_details_api.data?.data?.comment[commentinfo?.index]
                  .comment_like_status == 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      like_comment(get_post_details_api.data?.data?.id)
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="like2"
                      size={20}
                      style={{ marginRight: 15 }}
                    />
                    <Text style={{ fontSize: 18 }}>Like</Text>
                  </TouchableOpacity>
                )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <AntDesign
                  name="delete"
                  style={{ fontSize: 20, marginRight: 15, color: '#F5C2C1' }}
                />
                <Text style={{ fontSize: 18, color: '#F5C2C1' }}>Delete</Text>
              </View>
            </>
          )}
        </View>
      </BottomSheet>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          padding: 10,
          width: '100%',
          borderTopWidth: 0.7,
          borderTopColor: '#00000030',
          backgroundColor: 'white',
        }}>
        <TextInput
          multiline
          style={styles.comment}
          placeholder="write a comment..."
          onChangeText={text => setcomment(text)}
          value={comment}
        />
        <FontAwesome
          name="paper-plane"
          style={{
            fontSize: 20,
            color: '#388aebff',
            position: 'absolute',
            right: 30,
            top: 22,
          }}
          onPress={() => add_comment()}
        />
      </View>
    </View>
  );
};

export default SinglePost;

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
  lightTxt: { fontSize: 13, color: 'grey' },
  likeTxt: { fontSize: 14 },
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
  commentTag: {
    padding: 10,
    backgroundColor: '#00000010',
    borderRadius: 20,
    // width: '80%',
  },
  commentText: { fontWeight: 'bold', fontSize: 13 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width / 1.1,
  },
  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    // width: '80%',
  },
  comment: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#00000030',
    borderRadius: 20,
    backgroundColor: '#D3D3D320',
    // width: '100%',
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
});

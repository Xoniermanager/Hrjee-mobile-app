import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
  FlatList,
  useColorScheme
} from 'react-native';
// import React, {useState, useContext} from 'react';
import React, { useState, useContext, useCallback, useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import { EssContext } from '../../../Context/EssContext';
import GetLocation from 'react-native-get-location';
import LinearGradient from 'react-native-linear-gradient';
import GlobalStyle from '../../reusable/GlobalStyle';
import DocumentPicker from 'react-native-document-picker';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import useApi from '../../../api/useApi';
import post from '../../../api/post';
import ProgressiveImage from '../../reusable/ProgressiveImage';
import PullToRefresh from '../../reusable/PullToRefresh';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Themes from '../../Theme/Theme';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const Drawer = createDrawerNavigator();

const Profile = ({ navigation }) => {
  const theme = useColorScheme();

  const { user, setShowDrawerHeader } = useContext(EssContext);
  const get_user_post_api = useApi(post.get_user_post);

  const [singleFile, setSingleFile] = useState(null);
  const [modalVisibleImgUp, setModalVisibleImgUp] = useState(false);
  const [uploading, setuploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [show, setshow] = useState('');
  const [Userdata, setUserdata] = useState({
    employee_id: '',
    name: '',
    email: '',
    phone: '',
    atWorkfor: '',
    attendence: '',
    leave: '',
    awards: '',
    fatherName: '',
    dob: '',
    gender: '',
    image: '',
    permanentAddress: '',
    department: '',
    joining_date: '',
    status: '',
    salary: '',
    location: {},
  });
  const [loading, setloading] = useState(false);
  const [location, setlocation] = useState();
  const [showInput, setshowInput] = useState(false);
  const [addressTitle, setaddressTitle] = useState('');
  const [address, setaddress] = useState('');
  const [showUpdate, setshowUpdate] = useState(false);
  const [updateId, setupdateId] = useState('');
  const [currentAddress, setcurrentAddress] = useState(null);
  const [showUpdateModal, setshowUpdateModal] = useState(false);
  const [caption, setcaption] = useState('');
  const [leavedata, setLeaveData] = useState([]);
  const [photoPath, setPhotoPath] = useState(null);



  const handleRefresh = async () => {
    get_employee_leave()
    get_employee_detail();
    get_address();
    get_user_post();
  };
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_employee_leave()
        get_employee_detail();
        get_address();
      })();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      get_user_post();
    }, []),
  );


  const get_employee_leave = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/secondPhaseApi/balance_leave`, {}, config)
      .then(response => {
        console.log("leave------------------------------", response?.data?.data)
        if (response.data.status === "1") {
          console.log("responsedata>>>>>>>>>>>>>>>>>>>>>>>", response?.data?.data)
          try {
            setLeaveData(response?.data?.data)
            get_employee_detail();
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {
        console.log("error-------------------", error);
      });
  };


  const get_employee_detail = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/api/get_employee_detail`, {}, config)
      .then(response => {
        if (response.data.status === 1) {
          try {
            setUserdata({
              employee_id: response.data.data.EMP_ID,
              name: response.data.data.FULL_NAME,
              email: response.data.data.email,
              phone: response.data.data.mobile_no,
              atWorkfor: response.data.data.at_work_for,
              attendence: response.data.data.attendence,
              leave: response.data.data.leave,
              awards: response.data.data.awards,
              fatherName: response.data.data.father_name,
              dob: response.data.data.dob,
              gender: response.data.data.SEX,
              permanentAddress: response.data.data.permanent_address,
              image: response.data.data.image,
              department: response.data.data.department,
              joining_date: response.data.data.joining_date,
              status: response.data.data.status,
              salary: `${response.data.data.total_salary}`,
            });
            get_employee_detail();
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const get_address = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/api/get_location_list`, {}, config)
      .then(response => {
        if (response.data.status === 1) {
          try {
            console.log(response.data.data);
            setlocation(response.data.data);
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const get_user_post = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    get_user_post_api.request(
      {
        cmp_id: user.company_id,
        user_id: user.userid,
      },
      config,
    );
  };

  function New({ navigation }) {
    return (
      <View style={{ flex: 1, backgroundColor: '#e3eefb' }}>
        {get_user_post_api.data && (
          <FlatList
            numColumns={3}
            data={get_user_post_api.data?.data}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SinglePost', {
                    post_id: item.id,
                    user_id: item.user_id,
                    cmp_id: item.cmp_id,
                  })
                }
                style={{
                  borderWidth: 1,
                  // borderLeftWidth: index % 2 == 0 && 0,
                  borderColor: 'white',
                }}>
                {item.post.split('.').reverse()[0] == 'MP4' ? (
                  <Image
                    style={{
                      width: width / 3,
                      height: width / 3,
                      resizeMode: 'stretch',
                    }}
                    source={require('../../images/movie-player.png')}
                  />
                ) : (
                  // <Image
                  //   style={{
                  //     width: width / 3,
                  //     height: width / 3,
                  //   }}
                  //   source={{uri: item.post}}
                  // />

                  <ProgressiveImage
                    defaultImageSource={require('../../images/default-img.png')}
                    source={{ uri: item.post }}
                    style={{
                      width: width / 3,
                      height: width / 3,
                    }}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        )}
        {get_user_post_api.data?.data.length == 0 && (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="camera" size={50} />
              <Text style={{ marginTop: 0, fontSize: 16 }}>No post to show</Text>
            </View>
          </View>
        )}
        {/* {get_user_post_api.loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#388aeb" />
          </View>
        )} */}
      </View>
    );
  }

  function All({ navigation }) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {get_user_post_api.data && (
          <FlatList
            numColumns={3}
            data={get_user_post_api.data?.data}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SinglePost', {
                    post_id: item.id,
                    user_id: item.user_id,
                    cmp_id: item.cmp_id,
                  })
                }
                style={{
                  borderWidth: 1,
                  // borderLeftWidth: index % 2 == 0 && 0,
                  borderColor: 'white',
                }}>
                {item.post.split('.').reverse()[0] == 'MP4' ? (
                  <Image
                    style={{
                      width: width / 3,
                      height: width / 3,
                      resizeMode: 'stretch',
                    }}
                    source={require('../../images/movie-player.png')}
                  />
                ) : (
                  // <Image
                  //   style={{
                  //     width: width / 3,
                  //     height: width / 3,
                  //   }}
                  //   source={{uri: item.post}}
                  // />
                  <ProgressiveImage
                    defaultImageSource={require('../../images/default-img.png')}
                    source={{ uri: item.post }}
                    style={{
                      width: width / 3,
                      height: width / 3,
                    }}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        )}
        {get_user_post_api.data?.data.length == 0 && (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="camera" size={50} />
              <Text style={{ marginTop: 0, fontSize: 16 }}>No post to show</Text>
            </View>
          </View>
        )}
        {/* {get_user_post_api.loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#388aeb" />
          </View>
        )} */}
      </View>
    );
  }

  function Videos({ navigation }) {
    let arrVid = [];

    get_user_post_api.data?.data.map(i => {
      if (i.post.split('.').reverse()[0] == 'MP4') {
        arrVid.push(i.post);
      }
    });

    return (
      <View style={{ flex: 1, backgroundColor: '#e3eefb' }}>
        {get_user_post_api.data && (
          <FlatList
            numColumns={3}
            data={get_user_post_api.data?.data}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SinglePost', {
                    post_id: item.id,
                    user_id: item.user_id,
                    cmp_id: item.cmp_id,
                  })
                }
                style={{
                  borderWidth: 1,
                  // borderLeftWidth: index % 2 == 0 ? 0 : 0,
                  borderColor: 'white',
                }}>
                {item.post.split('.').reverse()[0] == 'MP4' && (
                  <Image
                    style={{
                      width: width / 3,
                      height: width / 3,
                      resizeMode: 'stretch',
                    }}
                    source={require('../../images/movie-player.png')}
                  />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        )}
        {arrVid.length == 0 && get_user_post_api.data?.data.length > 0 && (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather
                name="video"
                size={50}
                onPress={() => handleExpandPress()}
              />
              <Text style={{ marginTop: 0, fontSize: 16 }}>
                No Videos to show
              </Text>
            </View>
          </View>
        )}
        {get_user_post_api.data?.data.length == 0 && (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="camera" size={50} />
              <Text style={{ marginTop: 0, fontSize: 16 }}>No post to show</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  const renderPlaceholder = () => {
    return (
      <View style={{ height: height, padding: 20, backgroundColor: '#e3eefb' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ShimmerPlaceHolder
            style={{
              height: 60,
              width: 60,
              borderRadius: 50,
              marginRight: 15,
            }}
            autoRun={true}
          />
          <View>
            <ShimmerPlaceHolder
              height={20}
              style={{ width: '70%' }}
              autoRun={true}
            />
            <ShimmerPlaceHolder
              height={20}
              style={{ width: '70%', marginTop: 10 }}
              autoRun={true}
            />
            <ShimmerPlaceHolder
              height={20}
              style={{ width: '70%', marginTop: 10 }}
              autoRun={true}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          height={30}
          style={{ width: '100%', marginTop: 50 }}
          autoRun={true}
        />
        <View
          style={{
            marginTop: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
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
              height={20}
              width={60}
              style={{ marginTop: 10 }}
              autoRun={true}
            />
          </View>
          <View>
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
              height={20}
              width={60}
              style={{ marginTop: 10 }}
              autoRun={true}
            />
          </View>
          <View>
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
              height={20}
              width={60}
              style={{ marginTop: 10 }}
              autoRun={true}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          style={{ width: '100%', marginTop: 50, height: '35%' }}
          autoRun={true}
        />
      </View>
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
      setshowUpdateModal(false);
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
    setuploading(true);
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
        setuploading(false);
        alert('Uploaded Successfully');
        setModalVisibleImgUp(false);
        setSingleFile(null);
        setcaption('');
        handleClosePress();
        navigation.navigate('Post', { screen: 'Post' });
      } else {
        setuploading(false);
        // alert(responseJson.message);
      }
    } else {
      setuploading(false);
      // If no file selected the show alert
      alert('add image');
    }
  };

  return (
    <>
      {/* <Modal
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
            {singleFile ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 30,
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
                      setshowUpdateModal(true);
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
                  marginBottom: 30,
                }}>
                <AntDesign
                  name="cloudupload"
                  style={{fontSize: 20, marginRight: 10}}
                />
                <Text>Upload</Text>
              </TouchableOpacity>
            )}
            <TextInput
              multiline
              style={styles.input}
              placeholder="write a caption..."
              onChangeText={text => setcaption(text)}
              value={caption}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={uploadPost}>
              {uploading ? (
                <Text style={styles.textStyle}>Uploading...</Text>
              ) : (
                <Text style={styles.textStyle}>Upload</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      {loading && renderPlaceholder()}
      {!loading && (
        <PullToRefresh
          onRefresh={handleRefresh}
          style={{ flex: 1, backgroundColor: '#e3eefb' }}>
          <View
            style={{
              padding: 15,
              backgroundColor: GlobalStyle.blueDark,
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                {/* <Image
                  style={styles.tinyLogo}
                  source={
                    Userdata.image
                      ? { uri: Userdata.image }
                      : require('../../images/profile_pic.webp')
                  }
                /> */}
                {
                  photoPath ?
                    <Image
                      source={{ uri: photoPath }}
                      style={styles.tinyLogo}
                    />
                    :
                    <Image
                      source={{ uri: `https://i.postimg.cc/0y72NN2K/user.png` }}
                      style={styles.tinyLogo}
                    />
                }
                <View>
                  <Text
                    style={[
                      styles.profileFont,
                      { fontSize: 20, fontWeight: 'bold' },
                    ]}>
                    {Userdata.name}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Entypo
                      name="location-pin"
                      size={17}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.profileFont}>
                      {Userdata.permanentAddress}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Entypo
                      name="phone"
                      size={17}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.profileFont}>{Userdata.phone}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Zocial
                      name="email"
                      size={17}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.profileFont}>{Userdata.email}</Text>
                  </View>
                </View>
              </View>
              {/* <Feather
                name="menu"
                size={25}
                color="white"
                onPress={() => handleExpandPress()}
              /> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 0.5,
                borderColor: 'white',
              }}>
              <Text style={[styles.profileFont, { fontWeight: '600' }]}>
                At work for: {Userdata.atWorkfor}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 0.5,
                borderColor: 'white',
              }}>
              <View style={{ alignItems: 'center' }}>
                <ImageBackground
                  style={styles.options}
                  source={require('../../images/attendence.jpeg')}
                  imageStyle={{ borderRadius: 50 }}>
                  <View
                    style={{
                      height: 65,
                      width: 65,
                      borderRadius: 50,
                      backgroundColor: '#ffffff95',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 20, fontWeight: '600' }}>
                      {Userdata.attendence}
                    </Text>
                  </View>
                </ImageBackground>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 14,
                    fontWeight: '600',
                    color: 'white',
                  }}>
                  Attendence
                </Text>
              </View>

              {
                leavedata?.map((elements, index) => {
                  const total = parseInt(elements.taken_leave) + parseInt(elements.balance_leave);

                  return (
                    <View key={index} style={{ alignItems: 'center' }}>
                      <ImageBackground
                        style={styles.options}
                        source={require('../../images/job_leave.jpeg')}
                        imageStyle={{ borderRadius: 50 }}>
                        <View
                          style={{
                            height: 65,
                            width: 65,
                            borderRadius: 50,
                            backgroundColor: '#ffffff95',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: "row"
                          }}>
                          <Text style={[{ fontSize: 20, fontWeight: '600' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                            {elements.balance_leave}
                          </Text>
                          <Text style={[{ fontSize: 20, fontWeight: '600' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                            /
                          </Text>
                          <Text style={[{ fontSize: 20, fontWeight: '600' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                            {total}
                          </Text>
                        </View>
                      </ImageBackground>
                      <Text
                        style={{
                          marginTop: 5,
                          fontSize: 14,
                          fontWeight: '600',
                          color: 'white',
                        }}>
                        Leave
                      </Text>
                    </View>
                  )
                })
              }
              <View style={{ alignItems: 'center' }}>
                <ImageBackground
                  style={styles.options}
                  source={require('../../images/awards.jpeg')}
                  imageStyle={{ borderRadius: 50 }}>
                  <View
                    style={{
                      height: 65,
                      width: 65,
                      borderRadius: 50,
                      backgroundColor: '#ffffff95',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 20, fontWeight: '600' }}>
                      {Userdata.awards}
                    </Text>
                  </View>
                </ImageBackground>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 14,
                    fontWeight: '600',
                    color: 'white',
                  }}>
                  Awards
                </Text>
              </View>
            </View>
          </View>
        </PullToRefresh>
      )}

      {/* {!loading && (
        <View style={{flex: 1, marginTop: -150}}>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: {fontSize: 11},
              tabBarItemStyle: {width: 128},
              // tabBarStyle: {backgroundColor: 'powderblue'},
            }}>
            <Tab.Screen name="New" component={New} />
            <Tab.Screen name="All" component={All} />
            <Tab.Screen name="Videos" component={Videos} />
          </Tab.Navigator>
        </View>
      )} */}
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  tinyLogo: {
    width: responsiveWidth(25),
    height: responsiveHeight(13),
    borderRadius:50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  profileFont: {
    color: 'white',
  },
  options: {
    width: 65,
    height: 65,

    // borderWidth: 1,
    // borderColor: 'white',
  },
  skill: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dashed',
    borderRadius: 5,
    backgroundColor: '#d3e3fd30',
    borderColor: '#0c57d0',
  },
  heading: { fontWeight: '500', fontSize: 15 },
  heading_grey: { fontSize: 14, color: 'grey', fontWeight: '300' },
  add_txt: { fontSize: 14, color: '#efad37', fontWeight: '600' },
  view_txt: { color: GlobalStyle.blueDark, fontWeight: 'bold' },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000085',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 16,
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
    marginTop: 5,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: 'grey',
  },
  heading_modal: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnStyle: {
    width: '40%',
    backgroundColor: GlobalStyle.blueDark,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input_title: { marginBottom: 3, fontSize: 14, fontWeight: '500' },
  input_top_margin: { marginTop: 15 },
  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomsheetTxt: { fontSize: 17 },
  bottomsheetLogo: { fontSize: 22, marginRight: 15 },
  bottomsheetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

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
import { Root, Popup } from 'popup-ui'

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
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Reload from '../../../Reload';
import { SocketContext } from '../../tracking/SocketContext';

const Drawer = createDrawerNavigator();

const Profile = ({ navigation }) => {
  const theme = useColorScheme();

  const { user, setShowDrawerHeader } = useContext(EssContext);
  const get_user_post_api = useApi(post.get_user_post);

  const [singleFile, setSingleFile] = useState(null);
  const [modalVisibleImgUp, setModalVisibleImgUp] = useState(false);
  const [uploading, setuploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { diggitalidcard } = useContext(SocketContext);
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
    emergency: '',
    Job_department: '',
    blood_group: '',
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
        if (response?.data?.status == "1") {
          setLeaveData(response?.data?.data)
          // get_employee_detail();
        }
      })
      .catch(error => {

        setloading(false)
        if (error.response.status == '401') {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [Popup.hide(), AsyncStorage.removeItem('Token'),
            AsyncStorage.removeItem('UserData'),
            AsyncStorage.removeItem('UserLocation'),
            navigation.navigate('Login')]
          });
        }
      });
  };


  const get_employee_detail = async () => {
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/api/get_employee_detail`, {}, config)
      .then(response => {
        setloading(false)
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
              emergency: response.data.data.family_contact_no,
              Job_department: response.data.data.JOB_NAME,
              blood_group: response.data.data.blood_group,
              salary: `${response.data.data.total_salary}`,
            });
            // get_employee_detail();
          } catch (e) {
            setloading(false)
          }
        } else {
          setloading(false)
        }
      })
      .catch(error => {
        // alert(error.request._response);
        setloading(false)
        if (error.response.status == '401') {

        }
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
            setlocation(response.data.data);
          } catch (e) {
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {
        // alert(error.request._response);
        setloading(false)
        if (error.response.status == '401') {

        }
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




  if (Userdata == null) {
    return <Reload />
  }

  return (
    <>
      <Root>
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
                  <Image
                    style={styles.tinyLogo}
                    source={
                      Userdata.image
                        ? { uri: Userdata.image }
                        : require('../../images/profile_pic.webp')
                    }
                  />
                  {/* {
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
                } */}
                  <View>
                    <Text
                      style={[
                        styles.profileFont,
                        { fontSize: 20, fontWeight: 'bold', },
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
                      <>
                        {
                          Userdata?.permanentAddress == "null" ?
                            <Text style={styles.profileFont}>
                              {Userdata?.permanentAddress == "null" ? 'N/A' : Userdata.permanentAddress}
                            </Text>
                            :
                            <Text style={styles.profileFont}>
                              {Userdata?.permanentAddress == "" ? 'N/A' : Userdata.permanentAddress}
                            </Text>
                        }
                      </>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Entypo
                        name="phone"
                        size={17}
                        color="white"
                        style={{ marginRight: 5 }}
                      />
                      <>
                        {
                          Userdata.phone == "null" ?
                            <Text style={styles.profileFont}>{Userdata.phone == "null" ? 'N/A' : Userdata.phone}</Text>
                            :
                            <Text style={styles.profileFont}>{Userdata.phone == "" ? 'N/A' : Userdata.phone}</Text>
                        }
                      </>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Zocial
                        name="email"
                        size={17}
                        color="white"
                        style={{ marginRight: 5 }}
                      />
                      {
                        <>
                          {
                            Userdata.email == "null" ?
                              <Text style={styles.profileFont}>{Userdata.email == "null" ? 'N/A' : Userdata.email}</Text>
                              :
                              <Text style={styles.profileFont}>{Userdata.email ? Userdata.email : 'N/p'}</Text>
                          }
                        </>
                      }

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


                <View style={{ alignItems: 'center' }}>
                  <ImageBackground
                    style={styles.options}
                    source={require('../../images/job_leave.jpeg')}
                    imageStyle={{ borderRadius: 50 }}>
                    {
                      // console.log("object", leavedata)
                      leavedata?.length != 0 ? leavedata?.map((elements, index) => {
                        const total = parseInt(elements.taken_leave) + parseInt(elements.balance_leave);
                        return (
                          <View key={index}
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
                        )
                      }) :
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
                            {'0'}
                          </Text>
                          <Text style={[{ fontSize: 20, fontWeight: '600' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                            /
                          </Text>
                          <Text style={[{ fontSize: 20, fontWeight: '600' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                            {'0'}
                          </Text>
                        </View>
                    }
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

            {
              diggitalidcard?.length > 0 ?
                <>
                  <View style={{ padding: 0 }}>
                    <Text style={{ color: "#000", textAlign: 'center', fontSize: responsiveFontSize(2), marginTop: responsiveHeight(1.5), fontWeight: 'bold', textDecorationLine: 'underline' }}>ID Card</Text>
                  </View>
                  <View style={styles.container2}>
                    <View style={styles.header}>
                      <Image
                        source={require('../../images/idcardlogo.png')} // Add HBS logo here
                        style={styles.logo}
                      />
                    </View>

                    <View style={styles.profileImageContainer}>
                      <Image
                        source={
                          Userdata.image
                            ? { uri: Userdata.image }
                            : require('../../images/profile_pic.webp')
                        } style={styles.profileImage}
                      />
                    </View>

                    <Text style={styles.name}>{Userdata.name}</Text>
                    <Text style={styles.position}>Executive</Text>

                    <View style={styles.infoContainer}>
                      <View style={{ width: "50%" }}>
                        <View style={styles.infoRow}>
                          <FontAwesome name="mobile-phone" color="#fff" size={20} />
                          <Text style={styles.infoText}>{Userdata.phone}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Fontisto name="email" color="#fff" size={20} />
                          <Text style={styles.infoText}>{Userdata.email}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <AntDesign name="user" color="#fff" size={20} />
                          <Text style={styles.infoText}>{Userdata?.employee_id}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Feather name="briefcase" color="#fff" size={20} />
                          <Text style={styles.infoText}>{Userdata?.Job_department ? Userdata?.Job_department : 'N/A'}</Text>
                        </View>
                      </View>
                      <View style={{ width: "50%" }}>
                        <View style={styles.infoRow}>
                          <Feather name="map-pin" color="#fff" size={20} />
                          <Text style={styles.infoText}>{Userdata.permanentAddress}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Feather name="droplet" color="#fff" size={20} />
                          <Text style={styles.infoText}>{Userdata?.blood_group ? Userdata?.blood_group : 'N/A'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <AntDesign name="phone" color="#fff" size={20} />
                          <Text style={styles.infoText}>{Userdata?.emergency ? emergency : 'N/A'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
                :
                null
            }



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
      </Root>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  tinyLogo: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    resizeMode: "cover",
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  profileFont: {
    color: 'white', width: responsiveWidth(55)
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
  container2: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#172B85',
    borderWidth: 2, borderColor: "#2196F3", borderRadius: 20, width: "80%", alignSelf: "center",
    padding: 10
  },
  header: {
    width: '100%',
  },
  logo: {
    width: 80,
    height: 30,
    resizeMode: 'contain', tintColor: "#fff", marginLeft: 10, marginTop: 5
  },
  profileImageContainer: {
    marginVertical: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  position: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row", alignSelf: "center", justifyContent: "center", width: "95%"
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#fff',
  },
});


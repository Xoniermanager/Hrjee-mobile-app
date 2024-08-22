import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
  Linking, Pressable, useColorScheme, BackHandler

} from 'react-native';
import { Root, Popup } from 'popup-ui'

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useIsDrawerActive,
} from '@react-navigation/drawer';
import Profile from '../src/screens/profile/Profile';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { IconButton, MD3Colors } from 'react-native-paper';
import {
  useFocusEffect,
  useRoute,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const Drawer = createDrawerNavigator();
import GlobalStyle from '../src/reusable/GlobalStyle';
import apiUrl from '../src/reusable/apiUrl';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GetLocation from 'react-native-get-location';
import ProfileNavigator from './ProfileNavigator';
import { EssContext } from '../Context/EssContext';
import Zocial from 'react-native-vector-icons/Zocial';
import ImagePicker from 'react-native-image-crop-picker';
import { moderateScale } from 'react-native-size-matters';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Toast from 'react-native-simple-toast';
import DatePicker from 'react-native-date-picker';
import { RadioButton } from 'react-native-paper';
import Themes from '../src/Theme/Theme';
import Modal from "react-native-modal";
import PullToRefresh from '../src/reusable/PullToRefresh';
function CustomDrawerContent(props) {
  const theme = useColorScheme();
  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [dateTxt, setdateTxt] = useState({
    txt1: 'select date',
  });
  const [checked, setChecked] = useState('male');
  const [isModalVisible, setIsModalVisible] = useState(false); // state to control modal visibility
  const [Userdata, setUserdata] = useState({
    EMPLOYEE_NUMBER: '',
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
  const [location, setlocation] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [show, setshow] = useState('');
  const [showInput, setshowInput] = useState(false);
  const [addressTitle, setaddressTitle] = useState('');
  const [addressTitleError, setaddressTitleError] = useState('');
  const [loading, setloading] = useState(false);
  const [showUpdate, setshowUpdate] = useState(false);
  const [updateId, setupdateId] = useState('');
  const [activeItem, setActiveItem] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [image, setImage] = useState('')
  const [mimez, setMimez] = useState(false)
  const [cameramodal, setCameramodal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [contectdata, setContectData] = useState([]);
  const [addrequest, setAddressRequest] = useState([]);
  const [address, setaddress] = useState('');
  const [manuallylocation, setManuallyLocation] = useState(null);
  const [error, setError] = useState(null);
  const [showModal,setShowModal]=useState(false)
  useEffect(() => {
    handleGetLocation()
  }, [address])

  const handleGetLocation = () => {



    const apiKey = 'AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg'; // Replace with your Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    axios.get(url)
      .then(response => {
        if (response.data.status === 'OK') {
          const { lat, lng } = response.data.results[0].geometry.location;
          setManuallyLocation({ latitude: lat, longitude: lng });
          setError(null);
        } else {
          setError('Location not found');
          setManuallyLocation(null);
        }
      })
      .catch(err => {
        setError('Error fetching location');
        setManuallyLocation(null);
      });
   
  };

  AsyncStorage.getItem("AddRequest").then(res => {
    setAddressRequest(JSON.parse(res));
  });

  // choose from front camera  for profile Images////////
  // console.log("object", addrequest)

  // choose from front camera  for profile Images////////

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setPhoto(image);
      setPhotoPath(image?.path);
      setCameramodal(!cameramodal);
      setModalVisible1(!modalVisible1);
    }).catch((err) => { console.log(err); })
  }

  // choose from library for Profile  choosePhotoFromLibrary

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,

    }).then(image => {
      // setImage(image.path)
      // setMimez(image?.mime)
      setModalVisible1(!modalVisible1);
      setPhoto(image);
      setPhotoPath(image?.path);

      // setStore(`data:${image.mime};base64,${image.data}`)  //convert image base 64

      setCameramodal(!cameramodal);

    }).catch((err) => { console.log(err); });
  }

  const handleItemPress = item => {
    setModalVisible(!modalVisible);
    setshow(item);
    setActiveItem(item);
  };

  const isItemActive = item => {
    return item === activeItem;
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        get_employee_detail();
        get_address();
        aboutUs()
      })();
    }, []),
  );

  function WrapperComponent() {
    return (
      <View>
        <Modal>
          <View style={{ flex: 1 }}>
          <ActivityIndicator />
          </View>
        </Modal>
      </View>
    );
  }
  const get_employee_detail = async () => {




    setloading(true)
    const token = await AsyncStorage.getItem('Token');

    const config = {
      headers: { Token: token },
    };
    body = {}
    axios
      .post(`${apiUrl}/api/get_employee_detail`, body, config)
      .then(response => {
        if (response.data.status === 1) {
          setloading(false)
          try {

            setUserdata({
              EMPLOYEE_NUMBER: response.data.data.EMPLOYEE_NUMBER,
              name: response.data.data.FULL_NAME,
              email: response.data.data.email,
              phone: response.data.data.mobile_no,
              atWorkfor: response.data.data.at_work_for,
              attendence: response.data.data.attendence,
              leave: response.data.data.leave,
              awards: response.data.data.awards,
              fatherName: response.data.data.father_name,
              // image: response.data.data.image,
              dob: response?.data?.data?.dob,
              gender: response.data.data.SEX,
              permanentAddress: response.data.data.permanent_address,
              image: response.data.data.image,
              department: response.data.data.department,
              joining_date: response.data.data.joining_date,
              status: response.data.data.status,
              salary: `${response.data.data.total_salary}`,
            });



            var profilePath = response?.data?.data?.image;
            setPhotoPath(profilePath);
          } catch (e) {
            setloading(false)
          }
        } else {
          setloading(false)
        }
      })
      .catch(error => {

        setloading(false)
      });
  };
  const UpdateProfile = async () => {
    setloading(true);

    const token = await AsyncStorage.getItem('Token');

    const formData = new FormData();
    formData.append('father_name', Userdata?.fatherName);
    formData.append('dob', dateTxt?.txt1);
    formData.append('SEX', Userdata?.gender)
    formData.append('email', Userdata?.email)
    formData.append('mobile_no', Userdata?.phone);
    formData.append('permanent_address', Userdata?.permanentAddress)
    if (photo) {
      // var photoFormData = ;
      formData.append('image', {
        uri: photo?.path,
        type: photo?.mime,
        name: photo?.modificationDate + '.' + 'jpg',
        // name: photo?.modificationDate
      });
    }


    fetch(`${apiUrl}/SecondPhaseApi/update_employee_data`, {
      method: 'POST',
      headers: {
        'Token': token,
        Accept: 'application/json',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        setloading(false);
        setModalVisible(!modalVisible);
        get_employee_detail();

        Popup.show({
          type: 'Success',
          title: 'Success',
          button: true,
          textBody: response?.msg,
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        });
      })
      .catch(err => {
        setloading(false);

        if (err.response.status == '401') {


        }
      });
  }

  const get_address = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    body = {}
    axios
      .post(`${apiUrl}/api/get_location_list`, body, config)
      .then(response => {
        if (response.data.status === 1) {
          try {
              // console.log(response.data.data,'response.data.data')
            setlocation(response.data.data);
          } catch (e) {
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {
      });
  };
  const add_address = async () => {
      if(addressTitle.trim()==='' || address.trim()===''){
        Toast.show('Please Enter some text')
      }
      else {
        setloading(true);
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(async location => {
            var lat = parseFloat(manuallylocation.latitude);
            var long = parseFloat(manuallylocation.longitude);
            setloading(true);
            const token = await AsyncStorage.getItem('Token');
            const config = {
              headers: { Token: token },
            };
            const body = {
              location_name: addressTitle,
              address1: address,
              latitude: lat,
              longitude: long,
            };
            axios
              .post(`${apiUrl}/api/add_user_location`, body, config)
              .then(response => {
                Toast.show(response?.data?.msg);
                setloading(false);
                if (response.data.status == 1) {
                  try {
                    setaddressTitle('');
                    setaddress('');
                    get_address();
                    setshowInput(false);
                    Toast.show('Address added successfully, wait for admin approval');
                  } catch (error) {
                    console.log(error.request._response)
                  }
                } else if (response.data.status == 2) {
                  setloading(false);
                  Toast.show(response.data.msg)
               
    
                } else {
                  Toast.show(response.data.msg)

                
                }
              })
              .catch(error => {
                setloading(false)
                Toast.show(error.request._response)
              });
          })
          .catch(error => {
            const { code, message } = error;
            Toast.show(message)
            setloading(false)
          });
      }
    
  };

  const delete_address = async id => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const body = {
      location_id: id,
    };

    axios
      .post(`${apiUrl}/api/delete_location`, body, config)
      .then(response => {
        if (response.data.status == 1) {
          setloading(false);
          try {
            alert(response.data.msg);
            get_address();
          } catch (e) {
            alert(e);
          }
        } else if (response.data.status == 2) {
          setloading(false);
          alert(response.data.msg);
        } else {
          alert(response.data.msg);
        }
      })
      .catch(error => {
        setloading(false);
        alert(error);
      });
  };

  const update_address = async id => {
    setloading(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(async location => {
        var lat = parseFloat(manuallylocation.latitude);
        var long = parseFloat(manuallylocation.longitude);
        setloading(true);
        const token = await AsyncStorage.getItem('Token');
        const config = {
          headers: { Token: token },
        };
        const body = {
          location_id: id,
          location_name: addressTitle,
          address1: address,
          latitude: lat,
          longitude: long,
        };
        axios
          .post(`${apiUrl}/api/update_user_location`, body, config)
          .then(response => {
            setloading(false);
            Toast.show(response?.data?.msg);
            if (response.data.status == 1) {
              setloading(false);
              try {
                setaddressTitle('');
                setaddress('');
                Toast.show(response.data.msg)
                get_address();
                setshowInput(false);
              } catch (error) {
                console.log(error.request._response)
              }
            } else if (response.data.status == 2) {
              setloading(false);
              Toast.show(response.data.msg)
              
            } else {
              Toast.show(response.data.msg)
              
            }
          })
          .catch(error => {
            setloading(false)
            if (error.response.status == '401') {


            }
          });
      })
      .catch(error => {
        setloading(false);
        const { code, message } = error;
        Toast.show(message)
        
      });
  };

  const makeActive = async id => {
  setShowModal(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    const body = {
      location_id: id,
    };

    axios
      .post(`${apiUrl}/api/active_user_location_request`, body, config)
      .then(response => {
        if (response.data.status == 1) {
          try {
            setShowModal(false)
            Toast.show(response.data.msg)
           
            get_address();
          } catch (e) {

          }
        } else if (response.data.status == 2) {
         setShowModal(false)

          Toast.show(response.data.msg)
        } else {
         setShowModal(false)
          Toast.show(response.data.msg)

        }
      })
      .catch(error => {
        setShowModal(false)

        if (error.response.status == '401') {


        }
      });
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const aboutUs = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/secondPhaseApi/get_service_contact`, {}, config)
      .then(response => {
        if (response.data.status === 1) {
          try {
            setContectData(response?.data?.data)
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log('some error occured');
        }
      })
      .catch(error => {

        console.log(error)
      });
  };

  const renderDetails = show => {
    if (show == 'PersonalDetails') {
      return (
        <>

          <View style={{ marginHorizontal: 10 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'relative' }} >
                <>
                  {
                    photoPath ?
                      <Image
                        source={{ uri: photoPath }}
                        style={{ width: 150, height: 150, borderRadius: 150 / 2, overflow: "hidden", borderWidth: 2, borderColor: "green" }}
                      />
                      :
                      <Image
                        source={{ uri: `https://i.postimg.cc/0y72NN2K/user.png` }}
                        style={{ width: 150, height: 150, borderRadius: 150 / 2, overflow: "hidden", borderWidth: 2, borderColor: "green" }}
                      />
                  }

                </>
                <View style={{ position: 'absolute', right: 7, bottom: 7, }}>
                  <View style={{ width: 30, height: 30, backgroundColor: 'black', borderRadius: 30 / 2, justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton
                      icon="camera"
                      iconColor={MD3Colors.neutral100}
                      size={20}
                      onPress={() => setModalVisible1(true)}
                    />
                  </View>
                </View>
              </View>

            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading_modal}>Father's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Father's Name"
                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                selectTextOnFocus={false}
                onChangeText={(text) => setUserdata({ ...Userdata, fatherName: text })}
                value={Userdata.fatherName}
              />
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading_modal}>DOB</Text>
              {/* <TextInput
                style={styles.input}
                placeholder="Date Of Birth"
                placeholderTextColor={theme=='dark'?'#000':'#000'}
                selectTextOnFocus={false}
                onChangeText={(text) => setUserdata({ ...Userdata, dob: text })}
                value={Userdata.dob}
              /> */}
              <TouchableOpacity
                onPress={() => setstartopen(true)} //
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                  borderRadius: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'grey',
                }}>
                <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                  {dateTxt.txt1 != 'select date'
                    ? new Date(dateTxt.txt1).toLocaleDateString('en-GB')
                    : Userdata.dob}
                </Text>

                <AntDesign
                  name="calendar"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              </TouchableOpacity>
              <DatePicker
                textColor="#000000"
                backgroundColor="#FFFFFF"
                theme='light'
                modal
                open={startopen}
                date={startDate}
                mode="date"
                onConfirm={date => {
                  setstartopen(false);
                  setStartDate(date);
                  setdateTxt({
                    ...dateTxt,
                    txt1: date.toISOString().substring(0, 10),
                  });
                }}
                onCancel={() => {
                  setstartopen(false);
                }}
              />
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading_modal}>Gender</Text>
              {/* <TextInput
                style={styles.input}
                placeholder="Gender"
                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                selectTextOnFocus={false}
                onChangeText={(text) => setUserdata({ ...Userdata, gender: text })}
                value={Userdata.gender}
              /> */}
              <RadioButton.Group onValueChange={newValue => setUserdata({ ...Userdata, gender: newValue })} value={Userdata.gender}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="male" />
                  <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Male</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="female" />
                  <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Female</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="other" />
                  <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Other</Text>
                </View>
              </RadioButton.Group>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading_modal}>Email ID</Text>
              <TextInput
                style={styles.input}
                placeholder="email address"
                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}

                selectTextOnFocus={false}
                onChangeText={(text) => setUserdata({ ...Userdata, email: text })}
                value={Userdata.email}
              />
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading_modal}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}

                selectTextOnFocus={false}
                onChangeText={(text) => setUserdata({ ...Userdata, phone: text })}
                value={Userdata.phone}
              />
            </View>
            {/* <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading_modal}>Local Address</Text>
              <TextInput
                multiline
                style={[styles.input, { height: 60 }]}
                placeholder="Local Address"
                selectTextOnFocus={false}
                onChangeText={(text)=> setUserdata({...Userdata, location: text})}
                value={Userdata.location}
              />
            </View> */}
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.heading_modal}>Permanent Address</Text>
              <TextInput
                multiline
                style={[styles.input, { height: 60 }]}
                placeholder="Permanent Address"
                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}

                selectTextOnFocus={false}
                onChangeText={(text) => setUserdata({ ...Userdata, permanentAddress: text })}
                value={Userdata.permanentAddress}
              />
            </View>
          </View>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible1}
              onRequestClose={() => {
                Alert.alert('screen has been closed.');
                setModalVisible1(!modalVisible1);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView1}>
                  <View style={{ marginVertical: responsiveHeight(2), alignSelf: "center" }}>
                    <View style={{ marginBottom: 10, alignItems: "flex-end" }}>
                      <AntDesign
                        name="close"
                        size={22}
                        color="red"
                        onPress={() => setModalVisible1(!modalVisible1)}
                      // onPress={() => setModalVisible(!modalVisible)}
                      />
                    </View>
                    <View style={styles.takepic}>
                      <TouchableOpacity onPress={takePhotoFromCamera}>
                        <Text style={styles.takepictext}>PICK FROM CAMERA</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.takepic1}>
                      <TouchableOpacity onPress={choosePhotoFromLibrary}>
                        <Text style={styles.takepictext}>PICK FROM GALLERY</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              </View>
            </Modal>
          </View>
          <TouchableOpacity onPress={() => UpdateProfile()} style={{ flex: 1, backgroundColor: "blue", padding: 10, borderRadius: 5, marginBottom: 10, flexDirection: "row", marginHorizontal: responsiveWidth(25), alignSelf: "center", alignItems: "center", alignContent: "center" }}>
            <Text style={{ textAlign: "center", color: "#fff" }}>Submit</Text>
            {loading ? <ActivityIndicator size="small" color="#388aeb" /> : null}
          </TouchableOpacity>
        </>
      );
    } else if (show == 'CompanyDetails') {
      return (
        <View style={{ padding: 10 }}>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.heading_modal}>Employee Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Employee Number"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              editable={false}
              selectTextOnFocus={false}
              value={Userdata.EMPLOYEE_NUMBER}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.heading_modal}>Department</Text>
            <TextInput
              style={styles.input}
              placeholder="Department"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              editable={false}
              selectTextOnFocus={false}
              value={Userdata.department}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.heading_modal}>Date of Joining</Text>
            <TextInput
              style={styles.input}
              placeholder="Date of Joining"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              editable={false}
              selectTextOnFocus={false}
              value={Userdata.joining_date}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.heading_modal}>Status</Text>
            <TextInput
              style={styles.input}
              placeholder="Status"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              editable={false}
              selectTextOnFocus={false}
              value={Userdata.status ? 'active' : 'inactive'}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.heading_modal}>Salary</Text>
            <TextInput
              style={styles.input}
              placeholder="Salary"
              placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
              editable={false}
              selectTextOnFocus={false}
              value={Userdata.salary}
            />
          </View>
        </View>
      );
    } else if (show == 'OfficeAddress') {
      return (
        <PullToRefresh onRefresh={()=>get_address()}>
        <View style={{marginHorizontal: 15}}>
          
          {location
            ? location.map(
              (i, index) =>
                i.location_id != 209 && (
                  <TouchableOpacity
                    Key={index}
                    onPress={() =>i.active_status==1?null:
                      makeActive(i.location_id, i.location_name, i.address1)
                    }
                    style={{
                      marginTop: index > 0 ? 20 : 10,
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: 'grey',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Entypo
                          name="location-pin"
                          size={18}
                          style={{ marginRight: 3, color: '#cd181f' }}
                        />
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: '500' }}>
                            {i.location_name}
                          </Text>
                          <Text
                            style={{
                              marginTop: 3,
                              color: 'grey',
                              width: width / 1.5,
                            }}>
                            {i.address1}
                          </Text>
                          {
                            addrequest && addrequest == "Address Request" ?
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginTop: 15,
                                }}>
                            {i.active_status==1?null:<TouchableOpacity
                                  style={{ marginRight: 20 }}
                                  onPress={() => 
                                    Alert.alert(
                                      '',
                                      'Are you sure you want to delete address?',
                                      [
                                        {
                                          text: 'Cancel',
                                          onPress: () => console.log('Cancel Pressed'),
                                          style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => delete_address(i.location_id) },
                                      ],
                                    )
                                  
                                  }>
                                  <Text
                                    style={{
                                      color: GlobalStyle.blueDark,
                                      fontWeight: 'bold',
                                      fontSize: 16,
                                    }}>
                                    Delete
                                  </Text>
                                </TouchableOpacity>}
                                {/* <TouchableOpacity
                                  style={{}}
                                  onPress={() => {
                                    setshowInput(true),
                                      setshowUpdate(true),
                                      setupdateId(i.location_id);
                                    setaddressTitle(i.location_name);
                                    setaddress(i.address1);
                                  }}>
                                  <Text
                                    style={{
                                      color: GlobalStyle.blueDark,
                                      fontWeight: 'bold',
                                      fontSize: 16,
                                    }}>
                                    Edit
                                  </Text>
                                </TouchableOpacity> */}
                              </View>
                              :
                              null
                          }


                        </View>
                      </View>
                      {i.active_status == 1 ? (
                        <Fontisto
                          name="checkbox-active"
                          size={17}
                          style={{ marginRight: 3, color: '#0e664e' }}
                        />
                      ) : (
                        <Fontisto
                          onPress={() =>
                            makeActive(
                              i.location_id,
                              i.location_name,
                              i.address1,
                            )
                          }
                          name="checkbox-passive"
                          size={17}
                          style={{
                            marginRight: 3,
                            color: '#cd181f',
                            // position: 'absolute',
                            // left: 0,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ),
            )
            : null}
          {showInput ? (
            <View style={{ marginTop: 20 }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>
                  Add / Update Address
                </Text>
                <AntDesign
                  onPress={() => {
                    setshowInput(false), setshowUpdate(false);
                  }}
                  name="closecircle"
                  size={18}
                  style={{ marginRight: 3, color: 'red' }}
                />
              </View>

              <View style={styles.input_top_margin}>
                <Text style={styles.input_title}>Home / Office / Other</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setaddressTitle}
                  value={addressTitle}
                />
              </View>
              <View style={styles.input_top_margin}>
                <Text style={styles.input_title}>Location</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setaddress}
                  value={address}
                />
                {manuallylocation && (
                  <Text style={styles.locationText}>
                    Latitude: {manuallylocation.latitude}, Longitude: {manuallylocation.longitude}
                  </Text>
                )}
                {error && (
                  <Text style={styles.errorText}>
                    {error}
                  </Text>
                )}
              </View>
            </View>
          ) : null}
          {showInput ? (
            showUpdate ? (
              <TouchableOpacity
                onPress={() => update_address(updateId)}
                style={[styles.btnStyle, { width: '100%', marginTop: 20 }]}>
                <Text
                  style={{ color: 'white', fontWeight: 'bold', marginRight: 5 }}>
                  Update
                </Text>
                {loading ? <ActivityIndicator color="white" /> : null}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={()=> add_address()}
                style={[styles.btnStyle, { width: '100%', marginTop: 20 }]}>
                <Text
                  style={{ color: 'white', fontWeight: 'bold', marginRight: 5 }}>
                  Submit
                </Text>
                {loading ? <ActivityIndicator color="white" /> : null}
              </TouchableOpacity>
            )
          ) :
            (
              <>
                {
                  addrequest && addrequest == "Address Request" ?
                    <TouchableOpacity
                      onPress={() => {
                        setshowInput(true),
                          setshowUpdate(false),
                          setaddressTitle(''),
                          setaddress('');
                      }}
                      style={[styles.btnStyle, { width: '100%', marginTop: 20 }]}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        Add new address
                      </Text>
                    </TouchableOpacity>
                    :
                    null
                }

              </>

            )}
            <Modal
        isVisible={showModal}
        // onBackdropPress={toggleModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
      
      <ActivityIndicator size="large" color="#00ff00" />
     
      </Modal>
        </View>
        </PullToRefresh>
      );
    }
    else if (show == 'Aboutus') {
      const phoneNumber = '8989777878';
      return (
        <>
          {
            contectdata?.map((element, indx) => {
              return (
                <View key={indx} style={{ marginHorizontal: 10, marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.heading_modal}>{element?.designation}</Text>
                    <Text style={styles.heading_modal}>{element?.name}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
                      <Text style={styles.heading_modal}>{element?.contact}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )

            })
          }
        </>

      );


    }
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('Token');
    await AsyncStorage.removeItem('UserData');
    await AsyncStorage.removeItem('UserLocation');
    await AsyncStorage.removeItem('AddRequest');
    await AsyncStorage.removeItem('LOCATIONTRACKING');
    props.navigation.closeDrawer();
    props.navigation.navigate('Login');




  };


  return (
    <View style={{ flex: 1, }}>
      <Root>

        <DrawerContentScrollView {...props}>
          <ImageBackground
            source={require('../src/images/drawer-bg-img.webp')}
            style={{ padding: 10, marginBottom: 8 }}>
            <Image
              source={
                Userdata.image
                  ? { uri: Userdata.image }
                  : require('../src/images/profile_pic.webp')
              }
              resizeMode="cover"
              style={{
                height: 80,
                width: 80,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: 'white',
              }}
            />
            <View style={{ marginTop: 5 }}>
              <Text
                style={[styles.profileFont, { fontSize: 20, fontWeight: 'bold' }]}>
                {Userdata.name}
              </Text>

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
          </ImageBackground>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Personal Details"
            icon={color => (
              <MaterialCommunityIcons
                name="card-account-details-star-outline"
                size={18}
                color="#000"
              />
            )}
            onPress={() => handleItemPress('PersonalDetails')}
            style={
              isItemActive('PersonalDetails')
                ? { backgroundColor: '#F5F5F5' }
                : null
            }
            activeTintColor={'red'}
          />
          <DrawerItem
            label="Company Details"
            icon={color => (
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={18}
                color="#000"
              />
            )}
            onPress={() => handleItemPress('CompanyDetails')}
            style={
              isItemActive('CompanyDetails') ? { backgroundColor: '#F5F5F5' } : null
            }
            activeTintColor={'red'}
          />

          <DrawerItem
            label="Office Address"
            icon={color => <Feather name="map-pin" size={18} color="#000"
            />}
            onPress={() => handleItemPress('OfficeAddress')}
            style={
              isItemActive('OfficeAddress') ? { backgroundColor: '#F5F5F5' } : null
            }
            activeTintColor={'red'}
          />
          <DrawerItem
            label="Contact us"
            icon={color => (
              <MaterialCommunityIcons
                name="information-outline"
                size={25}
                color="#000"
              />
            )}
            onPress={() => handleItemPress('Aboutus')}
            style={
              isItemActive('Aboutus') ? { backgroundColor: '#F5F5F5' } : null
            }
            activeTintColor={'red'}
          />
          <DrawerItem
            label="Logout"
            icon={color => <AntDesign name="logout" size={18} color="#000"
            />}
            onPress={() => {
              setActiveItem('Logout');
              Alert.alert('', 'Are you sure you want to logout?', [
                {
                  text: 'Cancel',
                  onPress: () => setActiveItem(''),
                  style: 'cancel',
                },
                { text: 'OK', onPress: () => logout() },
              ]);
            }}
            style={isItemActive('Logout') ? { backgroundColor: '#F5F5F5' } : null}
          />
        </DrawerContentScrollView>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={handleModalClose}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
            <Text>This is a modal!</Text>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={{ color: 'red', marginTop: 16 }}>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView]}>
              <View style={{ alignItems: 'flex-end' }}>
                <AntDesign
                  name="close"
                  size={22}
                  style={{
                    marginTop: location?.length > 5 ? 20 : 10,
                    marginRight: 10
                  }}
                  color="red"
                  onPress={() => handleItemPress('')}
                // onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>{renderDetails(show)}</ScrollView>
            </View>
          </View>
        </Modal>
      </Root>

    </View>
  );
}

function ProfileDrawer() {
  const { showDrawerHeader } = useContext(EssContext);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        options={{
          headerShown: showDrawerHeader,
          drawerIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ), // set the icon component
        }}
        name="Profile"
        component={ProfileNavigator}
      />
    </Drawer.Navigator>
  );
}

export default ProfileDrawer;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  profileFont: {
    color: Themes == 'dark' ? '#fff' : '#fff'
  },
  options: {
    width: 65,
    height: 65,
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
    marginBottom: 5,
    color: "blue"
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
    marginHorizontal: 50
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginBottom: 25
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
    borderBottomColor: 'grey', color: Themes == 'dark' ? '#000' : '#000'

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
  modalView: {
    borderRadius: 15,
    shadowRadius: 4,
    backgroundColor: "#fff",
    elevation: 7,
    borderWidth: 1,
    borderColor: "#e2ddfe",
    width: responsiveWidth(95),
    height: responsiveHeight(75)
  },
  modalView1: {
    borderRadius: 15,
    shadowRadius: 4,
    backgroundColor: "#fff",
    elevation: 7,
    borderWidth: 1,
    borderColor: "#e2ddfe",
    width: responsiveWidth(55),
    height: responsiveHeight(25)
  },
  takepic: {
    width: 160,
    height: 40,
    backgroundColor: '#75CFC5',
    opacity: 3,
    elevation: 2,
    justifyContent: 'center',
    borderRadius: 8,
  },
  takepictext: {
    fontSize: 13,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  takepic1: {
    width: 160,
    height: 40,
    backgroundColor: '#75CFC5',
    opacity: 3,
    elevation: 2,
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  locationText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: 'red',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

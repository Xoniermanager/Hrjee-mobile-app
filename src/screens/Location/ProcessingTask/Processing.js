import { FlatList, StyleSheet, TextInput, Text, TouchableOpacity, View, Alert, Dimensions, useColorScheme, Modal, Pressable } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import GlobalStyle from '../../../reusable/GlobalStyle'
import { responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions'
import Themes from '../PendingTask/Pending';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl'
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker'
import GetLocation from 'react-native-get-location';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const Processing = () => {
  const theme = useColorScheme();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [cameramodal, setCameramodal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // state to control modal visibility
  const [fileResponse, setFileResponse] = useState([]);
  const [currentLocation, setCurrentLocation] = useState()
  const [address, setAddress] = useState()
  const [remark, setRemart] = useState()

  const [show, setShow] = useState('2')
  const [showMore, setShowMore] = useState(false);
  const [currentDisplayedTask, setCurrentDisplayedTask] = useState(null);

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
      console.log(image)
      setPhoto(image);
      setPhotoPath(image?.path);

      setStore(`data:${image.mime};base64,${image.data}`)  //convert image base 64
      console.log("file ", image?.data?.mime);
      setCameramodal(!cameramodal);

    }).catch((err) => { console.log(err); });
  }

  // choose from library for Profile  chooseDocumentLibrary

  const chooseDocumentLibrary = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);
      console.log(response)
    } catch (err) {
      console.warn(err);
    }
  }, []);
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(async location => {
        var lat = parseFloat(location.latitude);
        var long = parseFloat(location.longitude);
        setCurrentLocation({
          long: long,
          lat: lat,
        });
      })
  }, [])
  const latitude = currentLocation?.lat;
  const longitude = currentLocation?.long;

  const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
  const getAddress = async () => {
    axios.get(urlAddress).then(res => {
      console.log(res.data?.results[0].formatted_address, 'res.data?.results[0].formatted_address')
      setAddress(res.data?.results[0].formatted_address)
    })
  }


  const [Userdata, setUserdata] = useState();

  const get_employee_detail = async () => {
    // Alert.alert('hii')
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    axios
      .get(`${apiUrl}/SecondPhaseApi/get_user_task`, config)
      .then(response => {
        if (response?.data?.status == 1) {
          setUserdata(response?.data?.data);
          get_employee_detail();
        }
      })
      .catch(error => {
        alert(error.request._response);
      });
  };

  const tast_status_update = async (item) => {

    const updatedStatus = (parseInt(item?.status) + parseInt(1));
    const token = await AsyncStorage.getItem('Token');
    let data = new FormData();
    data.append('task_id', item?.task_id);
    data.append('remark', remark);
    data.append('latitude', latitude);
    data.append('longitude', longitude);

    data.append('image', fileResponse?.uri);
    data.append('status', updatedStatus);
    var selfie_image = {
      uri: photo?.path,
      type: photo?.mime,
      name: photo?.modificationDate + '.' + 'jpg',
    };
    data.append('selfie_image', selfie_image);
    data.append('lat_long_address', address);
    const config = {
      headers: {
        Token: token,
        'Content-Type': 'multipart/form-data'
      },
    };

    console.log("body = > ", data)
    axios
      .post(`${apiUrl}/SecondPhaseApi/update_task_status`, data, config)
      .then(response => {
        console.log("response statsu ---------", response?.data)
        get_employee_detail()
        setModalVisible1(false)
        setRemart('')
      })
      .catch(error => {
        alert(error.request._response);
      });
  };
  useEffect(() => {
    get_employee_detail()

  }, [])

  const update_show_hide = async (task_id, show) => {
    console.log(" task_id, show => ", task_id, show)
    if (task_id == currentDisplayedTask) {
      setCurrentDisplayedTask(null);
      setShowMore(false);
    } else {
      setCurrentDisplayedTask(task_id);
      setShowMore(true);
    }
  }

  const data = Userdata && Userdata.filter((item, index) => {
    return item.status == 1
  })

  return (
    <View style={styles.container}>
      {data?.length != 0 ? null :
        <View style={{ flex: 1, justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>No Data Found</Text>
        </View>
      }
      <FlatList
        data={data}
        renderItem={({ item, index }) =>
          <>
            <View activeOpacity={0.2} style={styles.maincard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => tast_status_update(item)} style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: Themes == 'dark' ? '#0043ae' : '#0043ae', fontWeight: "bold", fontSize: 18 }}>Task</Text>
                  <View>
                    <FontAwesome5
                      name="edit"
                      size={20}
                      color="#000"
                      marginLeft={5}
                      onPress={() => [setModalVisible1(true), getAddress()]}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => update_show_hide(item?.task_id, true)} style={{ flexDirection: "row", alignItems: "center" }}>

                  <View >
                    <Text style={{ color: Themes == 'dark' ? '#0043ae' : '#0043ae', fontWeight: "bold", fontSize: 18, marginRight: 5 }}>
                      {currentDisplayedTask != item.task_id ? 'More' : 'Hide'}
                    </Text>
                  </View>
                  <View>
                    <AntDesign
                      name="down"
                      size={30}
                      color="#000"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {
                currentDisplayedTask && currentDisplayedTask == item?.task_id ?
                  <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Task id</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.task_id}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Customer_name</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.customer_name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Mobile Number</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.mobile_no}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Approved_by</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.approved_by}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Status</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.status}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Remark:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.remark}</Text>
                    </View>
                  </>

                  :
                  <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Task id</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.task_id}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Customer_name {showMore}</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.customer_name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Mobile Number</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.mobile_no}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Approved_by</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.approved_by}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Status</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.status}</Text>
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
                          <View style={styles.modalView}>
                            <View style={{ padding: 10 }}>
                              <Text style={[{ fontSize: 16, fontWeight: "bold" }, { color: Themes == 'dark' ? '#2196F3' : '#2196F3' }]}>Remark</Text>
                              <TextInput
                                placeholder='Notes'
                                value={remark}
                                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                                style={{ color: Themes == 'dark' ? '#000' : '#000' }}
                                onChangeText={(text) => setRemart(text)}
                              />
                            </View>
                            <View style={{ margin: 20, alignSelf: "center" }}>
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
                              <View style={styles.takepic1}>
                                <TouchableOpacity onPress={chooseDocumentLibrary}>
                                  <Text style={styles.takepictext}>PICK Document</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View style={{ flexDirection: "row", alignSelf: "center" }}>
                              <Pressable
                                style={[styles.button, styles.buttonSubmit]}
                                onPress={() => tast_status_update(item)}
                              >
                                <Text style={[{ textAlign: "center", }, { color: Themes == 'dark' ? '#fff' : '#fff' }]}>Submit</Text>
                              </Pressable>
                              <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible1(!modalVisible1)}
                              >
                                <Text style={[{ textAlign: "center", }, { color: Themes == 'dark' ? '#fff' : '#fff' }]}>Cancel</Text>
                              </Pressable>
                            </View>

                          </View>
                        </View>
                      </Modal>
                    </View>
                  </>

              }


            </View>
          </>

        }
      />

    </View>
  )
}

export default Processing

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maincard: {
    // flexDirection:"row", justifyContent:"space-between", marginHorizontal: responsiveScreenWidth(2),
    borderRadius: 10, padding: 10, marginTop: 5, opacity: 1,
    elevation: 20,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: responsiveScreenWidth(3),
    marginVertical: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
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
  modalView: {
    margin: 10,
    borderRadius: 15,
    // padding: 35,
    // alignItems: 'center',
    marginHorizontal: 25,
    shadowRadius: 4,
    backgroundColor: "#fff",
    elevation: 7,
    borderWidth: 1,
    borderColor: "#e2ddfe"
  },
  takepic: {
    width: responsiveWidth(75),
    height: responsiveHeight(7),
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
    width: responsiveWidth(75),
    height: responsiveHeight(7),
    backgroundColor: '#75CFC5',
    opacity: 3,
    elevation: 2,
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    width: responsiveWidth(30),
    height: responsiveHeight(6),
    padding: 10,
    elevation: 2,
    marginTop: 0,
    marginHorizontal: 5,
    justifyContent: "center"
  },
  buttonClose: {
    backgroundColor: 'red',
    marginBottom: 25
  },
  buttonSubmit: {
    backgroundColor: 'green',
    marginBottom: 25
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
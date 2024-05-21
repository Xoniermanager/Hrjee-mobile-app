import { FlatList, StyleSheet, ActivityIndicator, TextInput, Text, PermissionsAndroid, TouchableOpacity, View, Alert, Dimensions, useColorScheme, Modal, Pressable, Platform } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import GlobalStyle from '../../../reusable/GlobalStyle';
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
import Reload from '../../../../Reload';
import { useNavigation } from '@react-navigation/native';
import { Root, Popup } from 'popup-ui'
import Toast from 'react-native-simple-toast';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const Processing = () => {
  const navigation = useNavigation()
  const theme = useColorScheme();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [cameramodal, setCameramodal] = useState(false);
  const [cameramodal1, setCameramodal1] = useState(false);
  const [docmodal, setDocmodal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // state to control modal visibility
  const [fileResponse, setFileResponse] = useState([]);
  const [currentLocation, setCurrentLocation] = useState()
  const [address, setAddress] = useState()
  const [remark, setRemart] = useState('')
  const [iD, setID] = useState()
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [remarkError, setRemarkError] = useState()
  const [photoError, setPhotoError] = useState()
  const [documentError, setDocumentError] = useState()
  const [location, setLocation] = useState(1)
  const [show, setShow] = useState('2')
  const [showMore, setShowMore] = useState(false);
  const [currentDisplayedTask, setCurrentDisplayedTask] = useState(null);
  const [showAddress, setShowAddress] = useState(0)
  const [filterData,setFilterData]=useState()
  const [searchItem,setSearchItem]=useState()

  // choose from front camera  for profile Images////////

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setPhotoError(null)
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
      setPhotoError(null)
      // console.log(image)
      setPhoto(image);
      setPhotoPath(image?.path);
      setCameramodal1(!cameramodal1);
      //convert image base 64
      // console.log("file ", image?.data?.mime);


    }).catch((err) => { console.log(err); });
  }

  // choose from library for Profile  chooseDocumentLibrary

  const chooseDocumentLibrary = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.pdf], // Specify the file types you want to pick
      });
      setFileResponse(response);
      setDocumentError(null)
      setDocmodal(!docmodal);
      // console.log(response)
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
  }, [showAddress])
  const latitude = currentLocation?.lat;
  const longitude = currentLocation?.long;
  const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
  const getAddress = async () => {
    axios.get(urlAddress).then(res => {

      setAddress(res.data?.results[0].formatted_address)
    })
  }


  const [Userdata, setUserdata] = useState();

  // console.log(Userdata, "processing")

  const get_employee_detail = async () => {
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    axios
      .get(`${apiUrl}/SecondPhaseApi/get_user_task`, config)
      .then(response => {
        setloading(false)
        if (response?.data?.status == 200) {
          setUserdata(response?.data?.data);
        }
      })
      .catch(error => {
      
        setloading(false)
      //   if(error.response.status=='401')
      //   {
    
      //   AsyncStorage.removeItem('Token');
      //   AsyncStorage.removeItem('UserData');
      //   AsyncStorage.removeItem('UserLocation');
      //  navigation.navigate('Login');
      //   }
      });
  };
  // console.log(fileResponse,'123')
  const tast_status_update = async (item) => {
    setloading1(true);
    setShowAddress(showAddress + 1)
    if (Platform.OS == 'android') {
      try {

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION

        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          GetLocation.getCurrentPosition({})
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(async location => {
              setloading1(false);

              const updatedStatus = (parseInt(item?.status) + parseInt(1));
              const token = await AsyncStorage.getItem('Token');
              const config = {
                headers: {
                  Token: token,
                  'Content-Type': 'multipart/form-data'
                },
              };
              let data = new FormData();
              data.append('task_id', iD?.task_id);
              data.append('remark', remark);
              data.append('latitude', latitude);
              data.append('longitude', longitude);

              data.append('image', fileResponse[0]);
              data.append('status', updatedStatus);
              var selfie_image = {
                uri: photo?.path,
                type: photo?.mime,
                name: photo?.modificationDate + '.' + 'jpg',
              };
              data.append('selfie_image', selfie_image);
              data.append('lat_long_address', address);

              if (remark.trim() === '') {
                setRemarkError('Please enter some text');

              } else if (photo == null) {
                setPhotoError('Please Upload the Image');
              }
             else {
                axios
                  .post(`${apiUrl}/SecondPhaseApi/update_task_status`, data, config)
                  .then(response => {
                    console.log(response?.data?.status,'response?.data?.status')
                    if (response?.data?.status == 1) {
                      setModalVisible1(false),
                      Toast.show(response?.data?.message);

                      get_employee_detail(),
                         
                      setRemart(''),
                      setCameramodal(''),
                      setCameramodal1('')

                    }
                    else {
                      // console.log(response?.data, 'yashu')
                      setModalVisible1(false)
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody:response?.data?.message,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()]
                      })
                 
                    }

                  })
                  .catch(error => {
                  console.log(error.response.data)
                    setloading1(false)
                    if (error.response.status == '401') {
                      Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody:error.response.data.msg,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide(),AsyncStorage.removeItem('Token'),
                        AsyncStorage.removeItem('UserData'),
                        AsyncStorage.removeItem('UserLocation'),
                       navigation.navigate('Login')]
                      });
                    }
                  });
              }
            })

            .catch(error => {
              const { code, message } = error;
              console.log(message,'message')
              Alert.alert(code, message);
              setModalVisible1(!modalVisible1)
              setRemart('')
              setCameramodal('')
              setCameramodal1('')
              setDocmodal('')
              setloading1(false);
            });
        } else {
          setModalVisible1(!modalVisible1)
          setRemart('')
          setCameramodal('')
          setCameramodal1('')
          setDocmodal('')
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody:'Location permission denied',
            buttonText: 'Ok',
            callback: () => [Popup.hide()]
          })
         
          setloading1(false);

        }

      }
      catch (error) {
       
        setloading1(false);
        // if (error.response.status == '401') {
        //   Popup.show({
        //     type: 'Warning',
        //     title: 'Warning',
        //     button: true,
        //     textBody:error.response.data.msg,
        //     buttonText: 'Ok',
        //     callback: () => [Popup.hide(),AsyncStorage.removeItem('Token'),
        //     AsyncStorage.removeItem('UserData'),
        //     AsyncStorage.removeItem('UserLocation'),
        //    navigation.navigate('Login')]
        //   });
        // }
      }
    }
    else {
      try {
        setloading1(false);
        const updatedStatus = (parseInt(item?.status) + parseInt(1));
        const token = await AsyncStorage.getItem('Token');
        const config = {
          headers: {
            Token: token,
            'Content-Type': 'multipart/form-data'
          },
        };
        let data = new FormData();
        data.append('task_id', item?.task_id);
        data.append('remark', remark);
        data.append('latitude', latitude);
        data.append('longitude', longitude);

        data.append('image', fileResponse[0]);
        data.append('status', updatedStatus);
        var selfie_image = {
          uri: photo?.path,
          type: photo?.mime,
          name: photo?.modificationDate + '.' + 'jpg',
        };
        data.append('selfie_image', selfie_image);
        data.append('lat_long_address', address);

        // console.log("body = > ", data)
        if (remark.trim() === '') {
          setRemarkError('Please enter some text');

        } else if (photo == null) {
          setPhotoError('Please Upload the Image');
        }
       else {
          setloading1(true);
          axios
            .post(`${apiUrl}/SecondPhaseApi/update_task_status`, data, config)
            .then(response => {

              if (response?.data?.status == 1) {
                Toast.show(response?.data?.message)
                get_employee_detail(),
                setModalVisible1(false),
                setRemart(''),
                setCameramodal(''),
                setCameramodal1('')
                // console.log("response statsu ---------", response?.data)
              }
              else {
                // console.log(response?.data, 'yashu')
                setModalVisible1(false)
                Popup.show({
                  type: 'Warning',
                  title: 'Warning',
                  button: true,
                  textBody:response?.data?.message,
                  buttonText: 'Ok',
                  callback: () => [Popup.hide()]
                })
             
              }

            })
            .catch(error => {
             
              setloading1(false)
              // if (error.response.status == '401') {
              //   Popup.show({
              //     type: 'Warning',
              //     title: 'Warning',
              //     button: true,
              //     textBody:error.response.data.msg,
              //     buttonText: 'Ok',
              //     callback: () => [Popup.hide(),AsyncStorage.removeItem('Token'),
              //     AsyncStorage.removeItem('UserData'),
              //     AsyncStorage.removeItem('UserLocation'),
              //    navigation.navigate('Login')]
              //   });
              // }
            });
        }
      }
      catch (error) {
      
        setloading1(false);
        // if (error.response.status == '401') {
        //   Popup.show({
        //     type: 'Warning',
        //     title: 'Warning',
        //     button: true,
        //     textBody:error.response.data.msg,
        //     buttonText: 'Ok',
        //     callback: () => [Popup.hide(),AsyncStorage.removeItem('Token'),
        //     AsyncStorage.removeItem('UserData'),
        //     AsyncStorage.removeItem('UserLocation'),
        //    navigation.navigate('Login')]
        //   });
        // }
      }
    }



  };
  useEffect(() => {
    getAddress()
  }, [location])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      get_employee_detail()
    });

    return unsubscribe;


  }, [])

  const update_show_hide = async (task_id, show) => {
    // console.log(" task_id, show => ", task_id, show)
    if (task_id == currentDisplayedTask) {
      setCurrentDisplayedTask(null);
      setShowMore(false);
    } else {
      setCurrentDisplayedTask(task_id);
      setShowMore(true);
      setShowMore(false);
    }
  }

  const data = Userdata && Userdata.filter((item, index) => {
    return item.status == 1
  })
  if (data == null) {
    return <Reload />
  }
  const onSearchList = async (prev) => {
    const filtered = data?.filter(item =>
      item.mobile_no.toLowerCase().includes(prev.toLowerCase()),
    );
    if (prev === '') {
      setFilterData('')
      return setUserdata(data);
    }
    setFilterData(filtered);
};
  return (
    <View style={styles.container}>
      <Root>
      <View style={{width:responsiveScreenWidth(96),height:responsiveHeight(5),borderRadius:10,borderWidth:0.5,shadowColor: '#000',alignSelf:'center',marginVertical:10}
    }>
  <TextInput
  placeholder='Search by pin code...'
  value={searchItem}
  onChangeText={(prev)=>onSearchList(prev)}
 
  />
</View>
      {data?.length > 0 ? null :
        <View style={{ justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
          <Text style={{ marginTop: responsiveHeight(30), textAlign: 'center', fontSize: 20, color: Themes == 'dark' ? '#000' : '#000' }}>No Data Found</Text>
        </View>
      }

      <FlatList
        data={filterData?filterData:data}
        renderItem={({ item, index }) =>
          <>
            <View activeOpacity={0.2} style={styles.maincard}>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ backgroundColor: "#0043ae", borderRadius: 10 }} onPress={() => [setModalVisible1(true), setShowAddress(showAddress + 1), setID(item)]}>
                  <Text style={{ color: Themes == 'dark' ? '#fff' : '#fff', fontWeight: "bold", fontSize: 16, padding: 5 }}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => update_show_hide(item?.task_id, true)} style={{ flexDirection: "row", alignItems: "center" }}>
                  <View >
                    <Text style={{ color: Themes == 'dark' ? '#0043ae' : '#0043ae', fontWeight: "bold", fontSize: 16, marginRight: 5 }}>
                      {currentDisplayedTask != item.task_id ? 'More' : 'Hide'}
                    </Text>
                  </View>
                  <View>
                    <AntDesign
                      name="down"
                      size={20}
                      color="#000"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {
                currentDisplayedTask && currentDisplayedTask == item?.task_id ?
                <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Task id:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.task_id}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Dept id:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.dept_id}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Customer name:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.customer_name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Mobile Number:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.mobile_no}
                  </Text>
                </View>

            

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Loan no:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.loan_no}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Visit Address:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.risk_address}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Total Amount:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.total_amount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Principal:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.principle}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Emi amount:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.emi_amount}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Builder name:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.builder_name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Banker name:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.banker_name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    Loan center:
                  </Text>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#000' : '#000',
                      textAlign: 'center',
                    }}>
                    {item?.loan_center}
                  </Text>
                </View>
              

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Proparty address:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.proparty_address}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Alternate no:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.alternate_no}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Legal status:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.legal_status}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Created Date:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.create_at}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Asign:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.assign}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Assign by:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.assign_by}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    update_at:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.update_at}
                  </Text>
                </View>
             
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Manager remark:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.description}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Location coordinates:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.location_coordinates}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Home address:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.home_address}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    pos amount:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.pos_amount}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Product:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.product}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    Process name:
                  </Text>
                  <Text
                    style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                    {item?.process_name}
                  </Text>
                </View>
              </>

                  :
                  <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Task id:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.task_id}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Customer name:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.customer_name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Mobile Number:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.mobile_no}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Approved by:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.approved_by}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Created Date:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.create_at}</Text>
                    </View>

                    <View style={styles.centeredView}>
                      <Modal
                        animationType="none"
                        transparent={true}
                        visible={modalVisible1}
                        onRequestClose={() => {
                          Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody:'screen has been closed.',
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()]
                          })
                        
                          setModalVisible1(!modalVisible1);
                        }}
                      >
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={[{ fontSize: 16, fontWeight: "bold" }, { color: Themes == 'dark' ? '#2196F3' : '#2196F3', marginBottom: 5 }]}>Remark</Text>

                              </View>
                              <TextInput
                                placeholder='Notes'
                                value={remark}
                                placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                                style={{ color: Themes == 'dark' ? '#000' : '#000', borderWidth: 1, borderRadius: 10, textAlignVertical: 'top', padding: 5 }}
                                multiline={true}
                                autoFocusOnLoad = {true}
                                numberOfLines={4}
                                onChangeText={(text) => [setRemart(text), setLocation(location + 1)]}
                                onChange={() => setRemarkError(null)}
                              />
                              {remarkError ? (
                                <Text style={{
                                  color: 'red',
                                  marginBottom: 8,
                                  textAlign: 'center', fontSize: 13, marginTop: 5
                                }}>{remarkError}</Text>
                              ) : null}
                            </View>
                            <View style={{ margin: 20, alignSelf: "center" }}>
                              <Pressable onPress={()=>takePhotoFromCamera()}>
                                <View style={styles.takepic}>
                                  <Text style={styles.takepictext}>PICK FROM CAMERA</Text>
                                  {
                                    cameramodal ?

                                      <AntDesign
                                        name="check"
                                        size={20}
                                        color="#fff"
                                      />
                                      :
                                      null
                                  }
                                </View>
                              </Pressable>
                              <TouchableOpacity onPress={()=>choosePhotoFromLibrary()}>

                                <View style={styles.takepic1}>
                                  <Text style={styles.takepictext}>PICK FROM GALLERY</Text>
                                  {
                                    cameramodal1 ?

                                      <AntDesign
                                        name="check"
                                        size={20}
                                        color="#fff"
                                      />
                                      :
                                      null
                                  }
                                </View>
                              </TouchableOpacity>

                              {photoError ? (
                                <Text style={{
                                  color: 'red',
                                  marginBottom: 8,
                                  textAlign: 'center', fontSize: 13, marginTop: 5
                                }}>{photoError}</Text>
                              ) : null}
                              <Pressable onPress={()=>chooseDocumentLibrary()}>
                                <View style={styles.takepic1}>
                                  <Text style={styles.takepictext}>PICK Document</Text>
                                  {
                                    docmodal ?

                                      <AntDesign
                                        name="check"
                                        size={20}
                                        color="#fff"
                                      />
                                      :
                                      null
                                  }
                                </View>
                              </Pressable>

                           
                            </View>
                            <View style={{ flexDirection: "row", alignSelf: "center" }}>
                              {loading1 ?
                                <>
                                  <Pressable disabled={true}
                                    style={[styles.button, styles.buttonSubmit]}
                                 
                                  >
                                    <Text style={[{ textAlign: "center", }, { color: Themes == 'dark' ? '#000' : '#000' }]}>Submit</Text>
                                    <ActivityIndicator marginHorizontal={8} size='small' color="#000" />
                                  </Pressable>
                                </>
                                :
                                <>
                                  <Pressable
                                    style={[styles.button, styles.buttonSubmit1]}
                                    onPress={() => tast_status_update(item)}
                                  >
                                    <Text style={[{ textAlign: "center", }, { color: Themes == 'dark' ? '#fff' : '#fff' }]}>Submit</Text>
                                  </Pressable>
                                </>
                              }
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
   </Root>
    </View>
  )
}

export default Processing

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3eefb"
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
    borderRadius: 8,
    flexDirection: "row", alignSelf: "center", justifyContent: "center", alignItems: "center",
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
    borderRadius: 8,
    flexDirection: "row", alignSelf: "center", justifyContent: "center", alignItems: "center", marginTop: 5
  },
  button: {
    borderRadius: 10,
    width: responsiveWidth(30),
    height: responsiveHeight(6),
    padding: 10,
    elevation: 2,
    marginTop: 0,
    marginHorizontal: 5,
    justifyContent: "center",
    flexDirection: "row", marginHorizontal: 5
  },
  buttonClose: {
    backgroundColor: 'red',
    marginBottom: 25,
    justifyContent: "center", alignSelf: "center", alignItems: "center"

  },
  buttonSubmit: {
    backgroundColor: '#cccccc',
    marginBottom: 25, marginHorizontal: 5,
    justifyContent: "center", alignSelf: "center", alignItems: "center"
  },
  buttonSubmit1: {
    backgroundColor: 'green',
    marginBottom: 25, marginHorizontal: 5,
    justifyContent: "center", alignSelf: "center", alignItems: "center"
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
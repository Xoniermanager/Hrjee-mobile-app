import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  useColorScheme, ActivityIndicator,
  FlatList,
  Modal, PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl'
import axios from 'axios';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Reload from '../../../Reload';
import { Root, Popup } from 'popup-ui'
import Empty from '../../reusable/Empty';
import RNFetchBlob from 'rn-fetch-blob';

const PRM = () => {

  const theme = useColorScheme();
  const [search, setSearch] = useState();
  // const [arr, setArr] = useState();
  const [searchList, setSearchList] = useState()
  const [prmdata, setPRMdata] = useState(null)
  const navigation = useNavigation();
  const [loading, setloading] = useState(false);
  const [active, setSetActive] = useState(-1)
  const [modalVisible, setModalVisible] = useState(false);
  const [dataItem, setDataItem] = useState()
  const [show, setShow] = useState(false)
  const [ind, setInd] = useState()
  console.log("prmdata.........", prmdata)
  const get_employee_detail = async () => {
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .get(`${apiUrl}/SecondPhaseApi/get_prm_payments`, config)
      .then(response => {
        setloading(false)
        if (response?.data?.status == 1) {
          setPRMdata(response?.data?.data);
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
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      get_employee_detail()
    });

    return unsubscribe;
  }, [navigation]);

  if (prmdata == null) {
    return <Reload />
  }
  const prm_delete = async () => {
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {
        Token: token,
        'Content-Type': 'multipart/form-data'
      },
    };
    let data = new FormData();

    data.append('prm_request_id', dataItem?.id);
    axios
      .post(`${apiUrl}/SecondPhaseApi/delete_prm_request`, data, config)
      .then(response => {
        setloading(false)
        if (response?.data?.status == 1) {
          get_employee_detail()
          setModalVisible(false)
        }
      })
      .catch(error => {

        setloading(false)
        setModalVisible(false)

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
  }

  const Post_edit_category = async (item) => {
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {
        Token: token,
        'Content-Type': 'multipart/form-data'
      },
    };
    let data = new FormData();

    data.append('prm_request_id', item?.id);
    axios
      .post(`${apiUrl}/SecondPhaseApi/get_details_prm`, data, config)
      .then(response => {
        setloading(false)
        response?.data?.data?.map((item, index) => {
          navigation.navigate('AddPRM', { item: item })
        })
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
  }
  const handleToggle = async (index) => {
    setSetActive(index === active ? -1 : index)
  }

  const historyDownload = (item) => {
    if (item?.uploade_document != null) {
      setShow(true)
      if (Platform.OS === 'ios' || Platform.OS == 'android') {
        downloadHistory(item);
      } else {
        try {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'storage title',
              message: 'storage_permission',
            },
          ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              setShow(false)

              downloadHistory(item);
            } else {
              Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'storage_permission',
                buttonText: 'Ok',
                callback: () => [Popup.hide()]
              });
              setShow(false)

            }
          });
        } catch (err) {
          //To handle permission related issue
          setloading(false)

        }
      }
    }
    else {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'No record found!',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      });
      setShow(false)
    }


  };
  const downloadHistory = async (item) => {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/Report_Download' +
          Math.floor(date.getTime() + date.getSeconds() / 2),
        description: 'Risk Report Download',
      },
    };
    config(options)
      .fetch('GET', item?.uploade_document)
      .then(res => {
        //Showing alert after successful downloading
        Popup.show({
          type: 'Success',
          title: 'Success',
          button: true,
          textBody: 'Report Downloaded Successfully.',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        });
        setShow(false)

      });
  };
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#e3eefb" />
      <SafeAreaView style={{ flex: 1 }}>
        <Root>
          <View showsVerticalScrollIndicator={false} style={{marginBottom:20}}>

            <TouchableOpacity activeOpacity={0.8}
              style={{
                backgroundColor: '#0043ae',
                borderRadius: 10,
                alignSelf: "flex-end", justifyContent: "center", width: responsiveWidth(30),
                height: responsiveHeight(6), marginRight: 8, marginTop: 8
              }}
              onPress={() => navigation.navigate('AddPRM')}>
              <Text style={{ color: '#fff', fontWeight: "bold", textAlign: "center" }}>+ Add PRM</Text>
            </TouchableOpacity>
            {loading ? <ActivityIndicator size='large' color="#0043ae" /> : null}
            {prmdata?.length == 0 ? <Empty /> : null}
            <FlatList
              data={prmdata}
              keyExtractor={(item, index) => `${item.key}${index}`}
              renderItem={({ item, index }) =>
                <View style={styles.Card_Box} key={index}>
                  <View
                    style={{
                      width: responsiveWidth(95),
                      height: responsiveHeight(2),
                      backgroundColor: '#0043ae',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      justifyContent: 'center',
                    }}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}>S.No</Text>
                    <Text style={styles.card_text}>{index + 1}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}>Employee Name</Text>
                    <Text style={styles.card_text}>{item?.employee_name}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}>Employee Number</Text>
                    <Text style={styles.card_text}>{item?.employee_number}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}>Category Name:</Text>
                    <Text style={styles.card_text}>{item?.category_name}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}> Payment Date:</Text>
                    <Text style={styles.card_text}>{item?.payment_date}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}>Comments</Text>
                    <Text style={styles.card_text}>{item?.remark}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}>Amount</Text>
                    <Text style={styles.card_text}>{item?.amount}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.card_textleft}>Status</Text>
                    <Text style={styles.card_text}>{item?.status == 0 ? 'Approved' : 'Pending'}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-around', marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => [setModalVisible(true), setDataItem(item)]} style={{ width: 100, height: 30, borderRadius: 10, backgroundColor: '#0043ae', justifyContent: 'center', alignItems: 'center' }}>
                      {/* <AntDesign
                                        name="delete"
                                        style={{
                                            fontSize: 25,
                                            color: '#000',
                                            marginRight: 10
                                        }}
                                    /> */}
                      <Text style={{ color: '#fff' }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => [historyDownload(item), setInd(index)]} style={{ width: 100, height: 30, borderRadius: 10, backgroundColor: '#0043ae', justifyContent: 'center', alignItems: 'center' }}>
                      {/* <AntDesign
                                        name="delete"
                                        style={{
                                            fontSize: 25,
                                            color: '#000',
                                            marginRight: 10
                                        }}
                                    /> */}
                      {show && ind == index ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#fff' }}>View Report</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Post_edit_category(item)} style={{ width: 100, height: 30, borderRadius: 10, backgroundColor: '#0043ae', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#fff' }}>Edit</Text>

                    </TouchableOpacity>

                  </View>
                  <View
                    style={{
                      width: responsiveWidth(95),
                      height: responsiveHeight(2),
                      backgroundColor: '#0043ae',
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      justifyContent: 'center',
                      bottom: 0,
                      position: 'absolute',
                    }}></View>
                </View>
              }
            />
            {modalVisible && <View style={{ width: '100%', height: '100%', zIndex: 99, backgroundColor: 'rgba(0,0,0,0.3)', position: 'absolute', flex: 1 }}></View>}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={{
                width: responsiveWidth(95),
                backgroundColor: "#fff", alignSelf: "center",
                marginVertical: responsiveHeight(30), borderRadius: 10,
                padding: 10

              }}>

                <Text style={{
                  fontSize: 17, fontWeight: '400', color: '#000',
                  marginTop: 10, alignSelf: 'center'
                }}>
                  Are you sure you want to delete this item?
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
                  <TouchableOpacity style={styles.Download} onPress={() => setModalVisible(false)}>
                    <Text style={{ color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Download} onPress={() => prm_delete()}>
                    <Text style={{ color: '#fff' }}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </View>
        </Root>
      </SafeAreaView>


    </>

  );
};
export default PRM;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3eefb'

  },
  Dashboard_Text: {
    color: '#37496E',
    fontSize: responsiveFontSize(2),
    marginHorizontal: 20,
    fontWeight: '700',
    marginVertical: 10,
  },
  AdministerBOx: {
    width: responsiveWidth(92),
    height: responsiveHeight(33),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 15,
  },
  Care_Box: {
    width: responsiveWidth(92),
    height: responsiveHeight(7),
    backgroundColor: '#37496E',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
  },
  Administer_text: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    marginHorizontal: 15,
    fontWeight: '500',
  },
  header_text: {
    color: '#37496E',
    fontSize: responsiveFontSize(1.2),
    textAlign: 'center',
  },
  header: {
    height: responsiveHeight(7),
  },
  text: {
    color: '#37496E',
    fontSize: 10,
  },
  Card_Box: {
    width: responsiveWidth(95),
    backgroundColor: '#fff',
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 5,
    elevation: 10,
    marginBottom: 5,
    // Add these properties for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card_text: {
    fontSize: responsiveFontSize(1.9),
    marginTop: 5,
    color: '#37496E',
    marginRight: 20,
    textAlign: "justify",
    // width: responsiveWidth(50)
  },
  card_textleft: {
    fontSize: responsiveFontSize(1.9),
    marginTop: 5,
    color: '#37496E',
    marginLeft: 20,
  },
  Download: {
    width: 150,
    height: 45,
    backgroundColor: '#0043ae',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,

    marginTop: 15,
    alignSelf: 'flex-end',
    marginRight: 15
  },
});












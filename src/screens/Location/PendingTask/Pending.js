import { Alert, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View, useColorScheme, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalStyle from '../../../reusable/GlobalStyle';
import { responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Themes from './Pending';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Reload from '../../../../Reload';
import Toast from 'react-native-simple-toast'


const Pending = ({ navigation }) => {
  const theme = useColorScheme();
  console.log(apiUrl, 'ueowuoi')
  const [Userdata, setUserdata] = useState(null);
  const [show, setShow] = useState('2')
  const [showMore, setShowMore] = useState(false);
  const [currentDisplayedTask, setCurrentDisplayedTask] = useState(null);
  const [loading, setloading] = useState(false);
  const [ind, setInd] = useState()
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      get_employee_detail()
    });

    return unsubscribe;
  }, [navigation]);

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
          console.log("responsive==============", response?.data?.data)
          setUserdata(response?.data?.data);
        }
      })
      .catch(error => {
        alert(error.request._response);
        setloading(false)
      });
  }
  const tast_status_update = async (item) => {

    const updatedStatus = (parseInt(item?.status) + parseInt(1));
    const token = await AsyncStorage.getItem('Token');
    let body = new FormData();
    body.append('task_id', item?.task_id);
    body.append('status', updatedStatus);
    const config = {
      headers: {
        Token: token,
        'Content-Type': 'multipart/form-data',
      },

    };

    console.log("body = > ", body)
    axios
      .post(`${apiUrl}/SecondPhaseApi/update_task_status`, body, config)
      .then(response => {
        console.log("response statsu ---------", response?.data)
        get_employee_detail()
        setShow(response?.data)
        setModalVisible(false)
        Toast.show('This task is under progress.')
      })
      .catch(error => {
        alert(error.request._response);
      });
  }

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
  useEffect(() => {
    get_employee_detail()
  }, [show])

  // useEffect(() => {
  //   get_employee_detail()
  // }, [])
 

  const data = Userdata && Userdata.filter((item, index) => {
    return item.status == 0;
  })
  
   if (data == null) {
    return <Reload />
  }

  return (
    <View style={styles.container}>
      <View>
        {data?.length>0 ? null :
          <View style={{ justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
            <Text style={{marginTop: responsiveHeight(30), textAlign: 'center', fontSize: 20, color: Themes == 'dark' ? '#000' : '#000' }}>No Data Found</Text>
          </View>
        }

        <FlatList
          data={data}
          renderItem={({ item, index }) =>
            <>
              <View activeOpacity={0.2} style={styles.maincard}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => [tast_status_update(item), setModalVisible(true)]} style={{ backgroundColor: "#0043ae", borderRadius: 10 }}>
                    <Text style={{ color: Themes == 'dark' ? '#fff' : '#fff', fontWeight: "bold", fontSize: 16, padding: 5 }}>Select </Text>
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
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Task id:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.task_id}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>User id:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.assign}</Text>
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
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Approved_by:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item.approved_by !== '' ? item.approved_by : 'N/A'}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Employee number:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.employee_number}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Address:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.lat_long_address}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Loan no:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.loan_no}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Risk Category:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.risk_category}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Total Amount:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.total_amount}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Principal:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.principle}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Emi amount:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.emi_amount}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Overdue amount:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.overdue_amount}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Link account:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.link_account}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Builder name:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.builder_name}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Banker name:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.banker_name}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Loan center:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.loan_center}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Employee number:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.employee_number}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Current address:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.lat_long_address}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Remark:</Text>
                        <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.remark}</Text>
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
                    </>
                }

              </View>
            </>
          }
        />
      </View>
      {modalVisible && <View style={{ width: '100%', height: '100%', zIndex: 99, backgroundColor: 'rgba(0,0,0,0.3)', position: 'absolute', flex: 1 }}></View>}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
      >
        <View style={{ width: 50, height: 50, borderRadius: 10, alignSelf: 'center', marginTop: responsiveHeight(50) }}>
          <ActivityIndicator size='large' color="#0043ae" />
        </View>
      </Modal>

    </View>
  )
}

export default Pending

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
  }
})

import { FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalStyle from '../../../reusable/GlobalStyle'
import { responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions'
import Themes from '../PendingTask/Pending';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl'
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const Done = ({navigation}) => {
  const theme = useColorScheme();

  const [Userdata, setUserdata] = useState();

  const [show, setShow] = useState('2')
  const [showMore, setShowMore] = useState(false);
  const [currentDisplayedTask, setCurrentDisplayedTask] = useState(null);
  const [loading, setloading] = useState(false);

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
        console.log("data--------------11111111", response?.data?.data)
        if (response?.data?.status == 1) {
          setUserdata(response?.data?.data);
        }
      })
      .catch(error => {
        setloading(false)
        alert(error.request._response);
      });
  };
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
  }, [])
  const data = Userdata && Userdata.filter((item, index) => {
    return item.status == 2;
  })
  // console.log(data,'yashuweyriuyeriuywiue')

  return (
    <View style={styles.container}>
      {data?.length != 0 ? null :
        <View style={{ flex: 1, justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
          <Text style={{ textAlign: 'center', fontSize: 20, color: Themes == 'dark' ? '#000' : '#000' }}>No Data Found</Text>
        </View>
      }
      {loading ? <ActivityIndicator size='large' color="#0043ae" /> : null}

      <FlatList
        data={data}
        renderItem={({ item, index }) =>
          <>
            <View activeOpacity={0.2} style={styles.maincard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: Themes == 'dark' ? '#0043ae' : '#0043ae', fontWeight: "bold", fontSize: 18 }}>Task</Text>
                  <View>
                    <MaterialIcons
                      name="check-circle"
                      size={25}
                      color="green"
                      marginLeft={5}
                    />
                  </View>
                </View>

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
                    {/* <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2}}>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "right" }}>Address:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "right"  }}>{item?.lat_long_address}</Text>
                    </View> */}
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
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign:"right", width: responsiveWidth(40) }}>{item?.lat_long_address}</Text>
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
  )
}

export default Done

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#e3eefb"
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
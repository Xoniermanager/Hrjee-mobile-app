import { FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalStyle from '../../../reusable/GlobalStyle'
import { responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Themes from '../PendingTask/Pending';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl'
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const Done = () => {
  const theme = useColorScheme();

  const [Userdata, setUserdata] = useState();

  const [show, setShow] = useState('2')
  const [showMore, setShowMore] = useState(false);
  const [currentDisplayedTask, setCurrentDisplayedTask] = useState(null);

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
          <Text style={{ textAlign: 'center', fontSize: 20, color:Themes=='dark'?'#000':'#000' }}>No Data Found</Text>
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
                    <MaterialIcons
                      name="check-circle"
                      size={25}
                      color="green"
                      marginLeft={5}
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
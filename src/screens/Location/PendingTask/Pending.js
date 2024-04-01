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


const Pending = () => {
  const theme = useColorScheme();

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

  const arr = [1, 2, 3, 4, 5, 6]

  // const get_employee_detail = async () => {
  //   const token = await AsyncStorage.getItem('Token');
  //   const config = {
  //     headers: { Token: token },
  //   };

  //   axios
  //     .post(`${apiUrl}/SecondPhaseApi/get_user_task`,{}, config)
  //     .then(response => {
  //       console.log("response>>>>>>>>>>", response?.data)
  //       if (response.data.status === 200) {
  //         try {
  //           // console.log("response>>>>>>>>>>", response?.data?.data)
  //           // setUserdata(
  //           //   employee_id: response.data.data.EMP_ID,
  //           //   name: response.data.data.FULL_NAME,
  //           //   email: response.data.data.email,
  //           //   phone: response.data.data.mobile_no,
  //           //   atWorkfor: response.data.data.at_work_for,
  //           //   attendence: response.data.data.attendence,
  //           //   leave: response.data.data.leave,
  //           //   awards: response.data.data.awards,
  //           //   fatherName: response.data.data.father_name,
  //           //   dob: response.data.data.dob,
  //           //   gender: response.data.data.SEX,
  //           //   permanentAddress: response.data.data.permanent_address,
  //           //   image: response.data.data.image,
  //           //   department: response.data.data.department,
  //           //   joining_date: response.data.data.joining_date,
  //           //   status: response.data.data.status,
  //           //   salary: `${response.data.data.total_salary}`,
  //           // });
  //           get_employee_detail();
  //         } catch (e) {
  //           console.log("ffc",e);
  //         }
  //       } else {
  //         console.log('some error occured');
  //       }
  //     })
  //     .catch(error => {
  //       console.log('kkkk-------',error);
  //     });
  // };
  // useEffect(()=> {
  //   get_employee_detail()
  // },[])
  return (
    <View style={styles.container}>
      <FlatList
        data={arr}
        renderItem={({ item, index }) =>
          <View activeOpacity={0.2} style={styles.maincard}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: Themes == 'dark' ? '#0043ae' : '#0043ae', fontWeight: "bold", fontSize: 18 }}>Task</Text>
                <View>
                    <MaterialIcons
                      name="done"
                      size={30}
                      color="green"
                    />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: Themes == 'dark' ? '#0043ae' : '#0043ae', fontWeight: "bold", fontSize: 18, marginRight:5 }}>See all</Text>
                <View>
                    <AntDesign
                      name="down"
                      size={30}
                      color="#000"
                    />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>EMP_ID</Text>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>141</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>customer_name</Text>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Yash</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>customer_name</Text>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Yash</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>customer_name</Text>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Yash</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>customer_name</Text>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Yash</Text>
            </View>
          </View>
        }
      />

    </View>
  )
}

export default Pending

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3eefb",
  },
  maincard: {
    // flexDirection:"row", justifyContent:"space-between", marginHorizontal: responsiveScreenWidth(2),
    borderRadius: 10, padding: 10, marginTop: 5,
    elevation: 5,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: responsiveScreenWidth(3),
    marginVertical: 2,
    borderWidth: 0.5
  }
})
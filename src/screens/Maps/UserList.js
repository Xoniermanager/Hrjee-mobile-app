import { FlatList, Image, StyleSheet, Text, View,TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Reload from '../../../Reload';
const UserList = () => {
    const navigation=useNavigation()
    const [list,setList]=useState(null)
    const data = [{
        id: 1,
        fullName: "Aafreen Khan",
        timeStamp: "12:47 PM",
        recentText: "Good Day!",
        avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
      }, {
        id:2,
        fullName: "Sujitha Mathur",
        timeStamp: "11:11 PM",
        recentText: "Cheer up, there!",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id:3,
        fullName: "Anci Barroco",
        timeStamp: "6:22 PM",
        recentText: "Good Day!",
        avatarUrl: "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"
      }, {
        id:4,
        fullName: "Aniket Kumar",
        timeStamp: "8:56 PM",
        recentText: "All the best",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id: 5,
        fullName: "Kiara",
        timeStamp: "12:47 PM",
        recentText: "I will call today.",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
      },
      
      {
        id:6,
        fullName: "Sujitha Mathur",
        timeStamp: "11:11 PM",
        recentText: "Cheer up, there!",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id:7,
        fullName: "Anci Barroco",
        timeStamp: "6:22 PM",
        recentText: "Good Day!",
        avatarUrl: "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"
      }, {
        id:8,
        fullName: "Aniket Kumar",
        timeStamp: "8:56 PM",
        recentText: "All the best",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id: 9,
        fullName: "Kiara",
        timeStamp: "12:47 PM",
        recentText: "I will call today.",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
      },
    ];
const getList=async()=>{
  const token=await AsyncStorage.getItem('Token')
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://app.hrjee.com/api/get_employee_list',
    headers: { 
      'Token':token, 
      'Cookie': 'ci_session=0bdnfjlm1c2i26gao0ocvmvld6sllmdk'
    }
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    setList(response?.data?.data)
  })
  .catch((error) => {
    console.log(error);
  });
}

    useEffect(async()=>{
      getList()
    },[])
    if(list==null){
      <Reload/>
    }
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
        <FlatList
        data={list}
        renderItem={(item,index)=>{
            console.log(item,'item')
            return (
                <TouchableOpacity style={styles.cart_box} onPress={()=>navigation.navigate('Maps')}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                   { item?.item?.profile_img==""?
                   <Image 
                    source={require('../../images/profile_pic.webp')}
                    style={{width:85, height:responsiveHeight(10),}}
                    />:
                   
                   <Image 
                    source={{uri:item?.item?.profile_img}}
                    style={{width:85, height:responsiveHeight(10),}}
                    />}
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                    
                    <Text style={{color:'#000'}}>{item?.item?.FULL_NAME}</Text>
                    <Text style={{color:'#000',marginTop:3,fontSize:10}}>{item?.item?.email}</Text>
                    <Text style={{color:'#000',marginTop:3}}>{item?.item?.job_deg}</Text>

                    <Text style={{color:'#000',marginTop:3}}>{item?.item?.office_timing}</Text>
                    </View>
                 <TouchableOpacity onPress={()=>Alert.alert("hello")}>
                 <Entypo name="dots-three-horizontal" size={20} color="#000" style={{marginRight:20}}/>
                 </TouchableOpacity>


                            </View>
                    </TouchableOpacity>
            )
        }}
        />
    </View>
  )
}

export default UserList

const styles = StyleSheet.create({
    cart_box:{
        width:responsiveWidth(95),
        height:responsiveHeight(10),
        backgroundColor:'#fff',
        marginTop:5,
        alignSelf:'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // Android shadow property
        elevation: 5,
    }
})
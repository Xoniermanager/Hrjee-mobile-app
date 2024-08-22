import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Reload from '../../../Reload';
import UserListSkeleton from '../Skeleton/UserListSkeleton';

const UserList = () => {
  const navigation = useNavigation()
  const [list, setList] = useState(null)
  useEffect(async () => {
    getList()
  }, [])
  const getList = async () => {
    const token = await AsyncStorage.getItem('Token');
    console.log(token, 'token')
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://app.hrjee.com/api/get_employee_list',
      headers: {
        'Token': token,
        'Cookie': 'ci_session=0bdnfjlm1c2i26gao0ocvmvld6sllmdk'
      }
    };

    axios.request(config)
      .then((response) => {

        setList(response?.data?.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }


  if (list == null) {
    return <UserListSkeleton />
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {list && list?.length == 0 ?
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={styles.tinyLogo}
            source={require('../../images/nothingToShow.gif')}
          />
        </View>
        : null}
      <FlatList
        data={list}
        renderItem={({ item, index }) =>
          <TouchableOpacity style={styles.cart_box} onPress={() => navigation.navigate('Maps', { userId: item?.userid })} key={index}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {item?.profile_img == "" ?
                <Image
                  source={require('../../images/profile_pic.webp')}
                  style={{ width: 85, height: responsiveHeight(10), }}
                />
                :
                <Image
                  source={{ uri: item?.profile_img }}
                  style={{ width: 85, height: responsiveHeight(10), }}
                />}
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <Text style={{ color: '#000' }}>{item?.FULL_NAME}</Text>
                <Text style={{ color: '#000', marginTop: 3, fontSize: 10 }}>{item?.email}</Text>
                <Text style={{ color: '#000', marginTop: 3 }}>{item?.job_deg}</Text>

                <Text style={{ color: '#000', marginTop: 3 }}>{item?.office_timing}</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert("hello")}>
                <Entypo name="dots-three-horizontal" size={20} color="#000" style={{ marginRight: 20 }} />
              </TouchableOpacity>


            </View>
          </TouchableOpacity>
        }

      />
    </View>
  )
}

export default UserList

const styles = StyleSheet.create({
  cart_box: {
    width: responsiveWidth(95),
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // Android shadow property
    elevation: 5,
  },
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
})
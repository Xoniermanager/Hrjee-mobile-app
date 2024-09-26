import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Reload from '../../../Reload';
import UserListSkeleton from '../Skeleton/UserListSkeleton';
import apiUrl from '../../reusable/apiUrl';
import { SocketContext } from '../../tracking/SocketContext';
import { Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const UserList = () => {
  const navigation = useNavigation(); // Get the navigation object
  const { updatedlivetrackingaccess, livetrackingaccess, manualusertackingaccess, getList } = useContext(SocketContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openModel, setOpenModel] = useState(false);

  checkIfTrackingEnableForUser = (id) => {
    setSelectedUserId(id)
    livetrackingaccess.forEach(item => {
      if (item.userid == id) {
        setOpenModel(item.track_location == 1 ? true : false)
      }
    });

    setModalVisible(!modalVisible)
  }


  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{ alignSelf: 'flex-end' }}>
              <AntDesign
                name="close"
                size={25}
                color="#000"
                style={{ alignSelf: 'flex-end' }}
              />
            </TouchableOpacity>


            {
              openModel ?
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => [setModalVisible(false), navigation.navigate('Maps', { userId: selectedUserId })]}>
                  <Text style={styles.modalButtonText}>Tracking</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity disabled
                  style={styles.modalButton1}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    // Handle Tracking button press
                    Alert.alert("Tracking Button Pressed");
                  }}>
                  <Text style={styles.modalButtonText}>Tracking</Text>
                </TouchableOpacity>
            }
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => [setModalVisible(false), navigation.navigate('Profile', { userId: selectedUserId })]}>
              <Text style={styles.modalButtonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => [setModalVisible(false), navigation.navigate(' Attendence', { userId: selectedUserId })]}>
              <Text style={styles.modalButtonText}>Attendence</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => [setModalVisible(false), navigation.navigate('Leave', { userId: selectedUserId })]}>
              <Text style={styles.modalButtonText}>Leave</Text>
            </TouchableOpacity>





            {/* <TouchableOpacity
            style={styles.modalButton}
            onPress={() => navigation.navigate('Attendence')}>
            <Text style={styles.modalButtonText}>Attendance</Text>
          </TouchableOpacity> */}
          </View>
        </View>
      </TouchableWithoutFeedback>

    </Modal>
  );

  useEffect(() => {
    getList()
  }, [])



  if (livetrackingaccess.length == 0) {
    return <UserListSkeleton />
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {renderModal()}
      {livetrackingaccess && livetrackingaccess?.length == 0 ?
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
        data={livetrackingaccess}
        renderItem={({ item, index }) =>
          <View style={styles.cart_box} key={index}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {item?.profile_img == "" ?
                <Image
                  source={require('../../images/profile_pic.webp')}
                  style={{ width: responsiveHeight(10), height: responsiveHeight(10), borderRadius:100, resizeMode:"cover" }}
                />
                :
                <Image
                  source={{ uri: item?.profile_img }}
                  style={{ width: responsiveHeight(10), height: responsiveHeight(10), borderRadius:100, resizeMode:"cover" }}
                />}
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <Text style={{ color: '#000' }}>{item?.FULL_NAME}</Text>
                <Text style={{ color: '#000', marginTop: 3, fontSize: 10 }}>{item?.email}</Text>
                <Text style={{ color: '#000', marginTop: 3 }}>{item?.job_deg}</Text>

                <Text style={{ color: '#000', marginTop: 3 }}>{item?.office_timing}</Text>
              </View>
              <TouchableOpacity onPress={() => checkIfTrackingEnableForUser(item?.userid)}>
                <Entypo name="dots-three-horizontal" size={20} color="#000" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
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
    borderRadius:15
  },
  tinyLogo: {
    width: 30,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    padding: 15,
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButton1: {
    padding: 15,
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#EBEBE4',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
})
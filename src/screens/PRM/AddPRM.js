import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView,
  Pressable
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import React, { useEffect, useState, useCallback } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Root, Popup } from 'popup-ui'

import Themes from '../../Theme/Theme';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl'
import axios from 'axios';
import Reload from '../../../Reload';
import DocumentPicker from 'react-native-document-picker'
import { useRoute } from '@react-navigation/native';
import { lightGreen100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { invalid } from 'moment';

const AddPRM = ({ navigation }) => {

  const route = useRoute();
  // Access params from the route
  const get_data = route?.params?.item;



  const theme = useColorScheme();
  const [value, setValue] = useState(null);
  const [loading, setloading] = useState(false);
  const [reason, setReason] = useState('');
  const [prmcategorydata, setPRM_category_data] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [startdate, setStartDate] = useState(new Date());
  const [openstartdate, setOpenStartDate] = useState(false);
  const [prmcategory_id, setPrmcategory_id] = useState()
  const [fileResponse, setFileResponse] = useState([]);
  const [remarkError, setRemarkError] = useState()
  const [catError, setCatError] = useState()
  const [documentError, setDocumentError] = useState()
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState()

  const currentDate = new Date()

  useEffect(() => {

    if (route?.params?.item) {
      setReason(route?.params?.item?.remark);
      setStartDate(new Date(route?.params?.item?.payment_date));
      setValue(route?.params?.item?.prmcategory_id)
      setAmount(route?.params?.item?.amount)
    }
  }, [route?.params])


  // choose from library for Profile  chooseDocumentLibrar/y

  const chooseDocumentLibrary = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);
      setDocumentError(null)
    } catch (err) {
      console.warn(err);
    }
  }, []);
  const get_prm_category = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .get(`${apiUrl}/SecondPhaseApi/get_prm_category_all`, config)
      .then(response => {
        if (response?.data?.status == 1) {
          setPRM_category_data(response?.data?.data)
        }
      })
      .catch(error => {

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

  // console.log(prmcategory_id,'prmcategory_id')
  // console.log(get_data?.id,'dncknfr')

  const Post_prm_category = async (get_data) => {
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {
        Token: token,
        'Content-Type': 'multipart/form-data'
      },
    }
    if (get_data) {
      let data = new FormData();
      data.append('prm_request_id', get_data?.id);
      data.append('prmcategory_id', prmcategory_id ? prmcategory_id : get_data?.prmcategory_id);
      data.append('remark', reason);
      data.append('amount', amount);
      data.append('payment_date', startdate.toISOString().split('T')[0]);
      data.append('image', fileResponse[0]);
      // console.log(data,'category')
      axios
        .post(`${apiUrl}/SecondPhaseApi/update_prm_request`, data, config)
        .then(response => {
          setloading(false)
          if (response?.data?.status == 1) {
            navigation.goBack()
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
    } else {
      let data = new FormData();
      data.append('prmcategory_id', prmcategory_id);
      data.append('remark', reason);
      data.append('amount', amount);
      data.append('payment_date', startdate.toISOString().split('T')[0]);
      data.append('image', fileResponse[0]);
      // console.log(data,'datanejbb')
      if (currentDate.valueOf() < startdate.valueOf()) {
        Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: 'Invalid Date',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        });
        setloading(false)
      }
      else if (value == null) {
        setCatError('Select Category');
        setloading(false)
      }
      else if (reason.trim() === '') {
        setRemarkError('Please enter reason');
        setloading(false)
      }
      else if (amount.trim() === '') {
        setAmountError('Please Enter Amount')
        setloading(false)

      }
      else {
        axios
          .post(`${apiUrl}/SecondPhaseApi/add_prm_request`, data, config)
          .then(response => {
            setloading(false)
            if (response?.data?.status == 1) {
              navigation.goBack()
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
    }
  }

  useEffect(() => {
    get_prm_category()
  }, []);
  if (prmcategorydata == null) {
    return <Reload />
  }
  return (
    <SafeAreaView style={
      styles.container
    }>
      <Root>


        <ScrollView >

          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' },
            ]}>

            PRM Category{' '}
          </Text>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={{ color: Themes == 'dark' ? '#000' : '#000' }}
            selectedTextStyle={[styles.selectedTextStyle, { color: Themes == 'dark' ? '#000' : '#000' }]}
            data={prmcategorydata}
            maxHeight={300}
            labelField="title"
            valueField="id"
            placeholder={!isFocus ? 'Select Item...' : '....'}
            value={value}
            itemTextStyle={{ color: Themes == 'dark' ? '#000' : '#000' }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item?.id);
              setIsFocus(false);
              setPrmcategory_id(item?.id)
              setCatError('')
            }}
          />
          {catError ? (
            <Text style={{
              color: 'red',
              marginBottom: 8,
              textAlign: 'center', fontSize: 13, marginTop: 5
            }}>{catError}</Text>
          ) : null}
          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' },
            ]}>
            Payment Date
          </Text>
          <View style={styles.Date_box}>
            <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{startdate?.toISOString().split('T')[0]}</Text>
            <TouchableOpacity onPress={() => setOpenStartDate(true)}>
              <EvilIcons
                name="calendar"
                style={{
                  fontSize: 25,
                  color: Themes == 'dark' ? '#000' : '#000',
                  alignSelf: "center"
                }}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' }

            ]}>
            Comment
          </Text>
          <TextInput
            value={reason}
            placeholder="Comments"
            placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
            style={styles.input_Text}
            onChangeText={prev => setReason(prev)}
            onChange={() => setRemarkError(null)}
          />
          {remarkError ? (
            <Text style={{
              color: 'red',
              marginBottom: 8,
              textAlign: 'center', fontSize: 13, marginTop: 5
            }}>{remarkError}</Text>
          ) : null}
          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' }

            ]}>
            Amount
          </Text>
          <TextInput
            value={amount}
            placeholder="Amount..."
            placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
            keyboardType='number-pad'
            style={styles.input_Text}
            onChangeText={prev => setAmount(prev)}
            onChange={() => setAmountError(null)}
          />
          {amountError ? (
            <Text style={{
              color: 'red',
              marginBottom: 8,
              textAlign: 'center', fontSize: 13, marginTop: 5
            }}>{amountError}</Text>
          ) : null}
          <Text
            style={[
              styles.reportType,
              { color: Themes == 'dark' ? '#000' : '#000' }

            ]}>
            Document
          </Text>
          {/* <TextInput
          value={reason}
          placeholder="Reason..."
          placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
          style={styles.input_Text}
          onChangeText={prev => setReason(prev)}
        /> */}

          <Pressable onPress={chooseDocumentLibrary}>
            <View style={styles.document_pick_text}>
              <Text style={styles.takepictext}>PICK Document</Text>
            </View>
          </Pressable>
          {documentError ? (
            <Text style={{
              color: 'red',
              marginBottom: 8,
              textAlign: 'center', fontSize: 13, marginTop: 5
            }}>{documentError}</Text>
          ) : null}
          <TouchableOpacity
            style={{
              width: 150,
              height: 40,
              backgroundColor: '#0043ae',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 10,
            }}
            onPress={() => Post_prm_category(get_data)}>
            {
              loading ? <ActivityIndicator size="small" color="#fff" /> :
                <Text style={{ color: '#fff' }}>{get_data ? 'Update' : 'Submit'}</Text>}
          </TouchableOpacity>
          <DatePicker
            modal
            open={openstartdate}
            date={startdate}
            theme='light'
            mode="date"
            onConfirm={startdate => {
              setOpenStartDate(false);
              setStartDate(startdate);

            }}
            onCancel={() => {
              setOpenStartDate(false);
            }}
          />
        </ScrollView>
      </Root>
    </SafeAreaView>
  );
};
export default AddPRM;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#e3eefb"
  },
  Dashboard_Text: {
    fontSize: responsiveFontSize(2),
    marginHorizontal: 20,
    fontWeight: '700',
    marginVertical: 10,
  },
  check_box: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    backgroundColor: '#50C878',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Person_card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginHorizontal: 5,
  },
  card: {
    borderRadius: 10,
    // borderColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    // height: 92,
    // width: 90,
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
    color: '#000',
  },
  reportType: {
    color: '#37496E',
    marginHorizontal: 20,
    fontSize: responsiveFontSize(1.9),
    fontWeight: '500',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center'
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: responsiveFontSize(1.7),
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(1.9),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  input_Text: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center',
    color: Themes == 'dark' ? '#000' : '#000'
  },
  document_pick_text: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center', justifyContent: "center",
    color: Themes == 'dark' ? '#000' : '#000'
  },
  Date_box: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 15,
    height: 50,
    marginBottom: 5,
    width: responsiveWidth(90),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  addimage: {
    width: responsiveWidth(30),
    height: responsiveHeight(6),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image_show: {
    width: responsiveWidth(58),
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  qtn_box: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center',
    // alignItems:"center",
    justifyContent: 'center'
  },
  takepictext: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Themes == 'dark' ? '#000' : '#000'
  },
});



































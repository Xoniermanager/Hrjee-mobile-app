import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  SafeAreaView
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-date-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl';
import axios from 'axios';
import { EssContext } from '../../../../../Context/EssContext';
import { moderateScale } from 'react-native-size-matters';
import Themes from '../../../../Theme/Theme';
import Reload from '../../../../../Reload';
import { Root, Popup } from 'popup-ui'
import { RadioButton, RadioButtonGroup } from 'react-native-paper';


const ApplyLeave = ({ navigation }) => {
  const theme = useColorScheme();
  const { user } = useContext(EssContext);
  const [loading, setloading] = useState(false);
  // const [leaveBalance,setLeaveBalance]=useState()
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [halfDay, sethalfDay] = useState('0');
  const [choosedata, setChooseData] = useState('Self');
  const [checked, setChecked] = useState('first');
  const [leaveType, setleaveType] = useState(null);
  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endopen, setendopen] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [leaveBalance, setleaveBalance] = useState(0);
  const [companyid, setCompany_id] = useState('');
  const [comment, setcomment] = useState(null);
  const [name, setname] = useState(null);
  const [phone, setphone] = useState(null);
  const [address, setaddress] = useState(null)


  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  });


  const handleFieldChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    })
  };


  const [isCheck, setisCheck] = useState(true);
  const leave_type = async () => {
    const token = await AsyncStorage.getItem('Token');

    const config = {
      headers: { Token: token },
    };
    body = {}
    axios
      .post(`${apiUrl}/secondPhaseApi/leave_type`, body, config)
      .then(response => {
        setloading(false);
        if (response.data.status == 1) {
          setleaveType(response?.data?.data)
        } else {
          setloading(false);
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: response.data.message,
            buttonText: 'Ok',
            callback: () => [Popup.hide()]
          })

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
  };

  const company_id = async () => {
    setloading(true);
    const userData = await AsyncStorage.getItem('UserData');
    const userInfo = JSON.parse(userData);
    let company_id = userInfo?.company_id;
    setCompany_id(company_id)
  }

  const get_employee_detail = async () => {
    setloading(true)
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    axios
      .post(`${apiUrl}/api/get_employee_detail`, {}, config)
      .then(response => {
        setloading(false)
        if (response.data.status === 1) {
          try {
            setForm({
              name: response?.data?.data?.FULL_NAME,
              phone: response?.data?.data?.mobile_no,
              address: response?.data?.data?.permanent_address,
            })
            // get_employee_detail();
          } catch (e) {
            setloading(false)
          }
        } else {
          setloading(false)
          console.log('some error occured');
        }
      })
      .catch(error => {
        alert(error.request._response);
        setloading(false)
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      leave_type();
      company_id()
      get_employee_detail()
    }, []),
  );


  if (leaveType == null) {
    return <Reload />
  }


  const apply_leave = async () => {

    if (startDate.valueOf() < endDate.valueOf()) {
      setloading(true);
      const token = await AsyncStorage.getItem('Token');
      const config = {
        headers: { Token: token },
      };

      var bodyFormData = new FormData();
      bodyFormData.append('userid', user.userid);
      bodyFormData.append('leave_balance', leaveBalance);
      bodyFormData.append('region_name', 'Eastern');
      bodyFormData.append('leavetype', value);
      bodyFormData.append('leave_wfstage_id', 11);
      bodyFormData.append(
        'leave_start_date',
        `${startDate.getFullYear() +
        '-' +
        (startDate.getMonth() + 1) +
        '-' +
        startDate.getDate()
        }`,
      );
      bodyFormData.append(
        'leave_end_date',
        `${endDate.getFullYear() +
        '-' +
        (endDate.getMonth() + 1) +
        '-' +
        endDate.getDate()
        }`,
      );
      bodyFormData.append('morning_evening', halfDay);
      bodyFormData.append('notes', comment);
      bodyFormData.append('guaranter_id', user.employee_number);
      bodyFormData.append('emergency_contact_name', form.name);
      bodyFormData.append('emergency_contact_phone', form.phone);
      bodyFormData.append('emergency_contact_address', form.address);
      bodyFormData.append('exit_entry_visa_reqd', 1);
      bodyFormData.append('accept_leave_policy', isCheck ? 1 : 0);
      bodyFormData.append('current_approver_eno', user.employee_number);


      axios({
        method: 'post',
        url: `${apiUrl}/secondPhaseApi/apply_for_leave`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data', Token: token },
      })
        .then(function (response) {
          //handle success
          setloading(false);
          if (response.data.status == 1) {
            try {

              Popup.show({
                type: 'Success',
                title: 'Success',
                button: true,
                textBody: response.data.message,
                buttonText: 'Ok',
                callback: () => [Popup.hide(), navigation.navigate('Leave Applied List')]
              })


            } catch (e) {
              setloading(false);

            }
          } else {
            setloading(false);
            Popup.show({
              type: 'Warning',
              title: 'Warning',
              button: true,
              textBody: response.data.message,
              buttonText: 'Ok',
              callback: () => [Popup.hide()]
            })

          }
        })
        .catch(function (error) {
          //handle error
          setloading(false);
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
    else {
      Popup.show({
        type: 'Warning',
        title: 'Warning',
        button: true,
        textBody: 'End date greater then start date',
        buttonText: 'Ok',
        callback: () => [Popup.hide()]
      });
    }


  };

  // useEffect(()=> {
  //   get_employee_detail()
  // },[])



  const checkEmptyField = () => {
    if (choosedata == 'Self') {
      return apply_leave();
    }
    else if (value !== null && name !== null && phone !== null && address !== null) {
      return apply_leave();
    } else {
      if (value == null) {
        return Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: 'please select leave type',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        })
      }

      if (name == null) {
        return Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: 'please enter name',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        })
      }
      if (phone == null) {
        return Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: 'please enter mobile',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        })
      }
      if (address == null) {
        return Popup.show({
          type: 'Warning',
          title: 'Warning',
          button: true,
          textBody: 'please enter address',
          buttonText: 'Ok',
          callback: () => [Popup.hide()]
        })
      }

    }
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 18 }}>

      <Root>
        <ScrollView style={{ marginHorizontal: 5 }}>
          <View>
            <Text style={styles.input_title}>Leave Type</Text>
            <Dropdown
              data={leaveType}
              labelField="leave_type"
              valueField="id"
              value={value}
              onChange={item => {
                setValue(item.id);
                setleaveBalance(item.balance_leave)

                setIsFocus(false);
              }}
              style={styles.dropdown}
              placeholder="Select Type"
              placeholderStyle={styles.placeholderStyle}
              itemTextStyle={{ color: Themes == 'dark' ? '#000' : '#000' }}
              selectedTextStyle={{ color: Themes == 'dark' ? '#000' : '#000' }}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Leave Balance</Text>
            <Text style={[{ marginLeft: 10, marginBottom: 10, marginTop: 5 }, { color: Themes == 'dark' ? '#000' : '#000' }]}>{leaveBalance != 0 ? leaveBalance : 0}</Text>
            <View style={{ borderWidth: 0.5, backgroundColor: "#000", elevation: 1, opacity: 0.4, }}></View>
          </View>
          <View style={styles.input_top_margin}>
            {/* <Text style={styles.input_title}>Holiday</Text> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {
                companyid == 56 ?
                  <TouchableOpacity
                    onPress={() => sethalfDay('0')}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {halfDay == '0' ? (
                      <Fontisto
                        name="radio-btn-active"
                        size={18}
                        style={styles.radio_icon}
                        color="#0321a4"
                      />
                    ) : (
                      <Fontisto
                        name="radio-btn-passive"
                        size={18}
                        color="#0321a4"
                        style={styles.radio_icon}
                      />
                    )}
                    <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>None</Text>
                  </TouchableOpacity>
                  :
                  <>
                    <TouchableOpacity
                      onPress={() => sethalfDay('A')}
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {halfDay == 'A' ? (
                        <Fontisto
                          name="radio-btn-active"
                          size={18}
                          style={styles.radio_icon}
                        />
                      ) : (
                        <Fontisto
                          name="radio-btn-passive"
                          size={18}
                          style={styles.radio_icon}
                        />
                      )}
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Morning</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => sethalfDay('P')}
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {halfDay == 'P' ? (
                        <Fontisto
                          name="radio-btn-active"
                          size={18}
                          style={styles.radio_icon}
                          color="#0321a4"
                        />
                      ) : (
                        <Fontisto
                          name="radio-btn-passive"
                          size={18}
                          color="#0321a4"
                          style={styles.radio_icon}
                        />
                      )}
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Evening</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => sethalfDay('0')}
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {halfDay == '0' ? (
                        <Fontisto
                          name="radio-btn-active"
                          size={18}
                          style={styles.radio_icon}
                          color="#0321a4"
                        />
                      ) : (
                        <Fontisto
                          name="radio-btn-passive"
                          size={18}
                          color="#0321a4"
                          style={styles.radio_icon}
                        />
                      )}
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>None</Text>
                    </TouchableOpacity>
                  </>
              }



            </View>
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Start Date</Text>
            <TouchableOpacity
              onPress={() => setstartopen(true)} //
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
                borderRadius: 5,
                borderBottomWidth: 1,
                borderBottomColor: 'grey',
              }}>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{new Date(startDate).toISOString().substring(0, 10)}</Text>
              <AntDesign
                name="calendar"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            </TouchableOpacity>
            <DatePicker
              textColor="#000000"
              backgroundColor="#FFFFFF"
              theme="light"
              modal
              // minimumDate={new Date()}
              open={startopen}
              date={startDate}
              mode="date"
              onConfirm={date => {
                setstartopen(false);
                setStartDate(date);
              }}
              onCancel={() => {
                setstartopen(false);
              }}
            />
          </View>
          {halfDay === '0' ? (
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>End Date</Text>
              <TouchableOpacity
                onPress={() => setendopen(true)} //
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                  borderRadius: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'grey',
                }}>
                <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{new Date(endDate).toISOString().substring(0, 10)}</Text>
                <AntDesign
                  name="calendar"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              </TouchableOpacity>
              <DatePicker
                textColor="#000000"
                backgroundColor="#FFFFFF"
                modal
                // minimumDate={new Date()}
                open={endopen}
                date={endDate}
                theme='light'
                mode="date"
                onConfirm={date => {
                  setendopen(false);
                  setEndDate(date);
                }}
                onCancel={() => {
                  setendopen(false);
                }}
              />
            </View>
          ) : null}
          <View style={styles.input_top_margin}>
            <Text style={[{ fontSize: 20, fontWeight: '600' }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
              Emergency Contacts
            </Text>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>

              <TouchableOpacity
                onPress={() => setChooseData('Self')}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                {choosedata == 'Self' ? (
                  <Fontisto
                    name="radio-btn-active"
                    size={18}
                    style={styles.radio_icon}
                  />
                ) : (
                  <Fontisto
                    name="radio-btn-passive"
                    size={18}
                    style={styles.radio_icon}
                  />
                )}
                <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Self</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setChooseData('Other')}
                style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                {choosedata == 'Other' ? (
                  <Fontisto
                    name="radio-btn-active"
                    size={18}
                    style={styles.radio_icon}
                    color="#0321a4"
                  />

                ) : (
                  <Fontisto
                    name="radio-btn-passive"
                    size={18}
                    color="#0321a4"
                    style={styles.radio_icon}
                  />
                )}
                <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Other</Text>
              </TouchableOpacity>
            </View>
            {choosedata === 'Self' ?
              <>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Name</Text>
                  <TextInput
                    maxLength={25}
                    style={styles.input}
                    placeholder="Please enter name"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    value={form.name}
                    onChangeText={value => {
                      handleFieldChange('name', value);
                    }}
                  />
                </View>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Phone number</Text>
                  <TextInput
                    maxLength={10}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder="Please enter phone number"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    value={form.phone}
                    onChangeText={value => {
                      handleFieldChange('phone', value);
                    }}
                  />
                </View>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Address</Text>
                  <TextInput
                    maxLength={50}
                    style={styles.input}
                    placeholder="Please enter address"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    value={form.address}
                    onChangeText={value => {
                      handleFieldChange('address', value);
                    }} />
                </View>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Comment</Text>
                  <TextInput
                    multiline
                    style={styles.input}
                    placeholder="Put your comment here....."
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}

                    onChangeText={setcomment}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setisCheck(!isCheck)}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                  {isCheck ? (
                    <Fontisto
                      name="checkbox-active"
                      size={18}
                      style={styles.radio_icon}
                    />
                  ) : (
                    <Fontisto
                      name="checkbox-passive"
                      size={18}
                      style={styles.radio_icon}
                    />
                  )}
                  <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Accept leave policy.</Text>
                </TouchableOpacity>
              </>

              :
              <>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Name</Text>
                  <TextInput
                    maxLength={25}
                    style={styles.input}
                    placeholder="Please enter name"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    value={name}
                    onChangeText={setname}
                  />
                </View>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Phone number</Text>
                  <TextInput
                    maxLength={10}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder="Please enter phone number"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    value={phone}
                    onChangeText={setphone}
                  />
                </View>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Address</Text>
                  <TextInput
                    maxLength={50}
                    style={styles.input}
                    placeholder="Please enter address"
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    value={address}
                    onChangeText={setaddress}
                  />
                </View>
                <View style={styles.input_top_margin}>
                  <Text style={styles.input_title}>Comment</Text>
                  <TextInput
                    multiline
                    style={styles.input}
                    placeholder="Put your comment here....."
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    onChangeText={setcomment}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setisCheck(!isCheck)}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                  {isCheck ? (
                    <Fontisto
                      name="checkbox-active"
                      size={18}
                      style={styles.radio_icon}
                    />
                  ) : (
                    <Fontisto
                      name="checkbox-passive"
                      size={18}
                      style={styles.radio_icon}
                    />
                  )}
                  <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Accept leave policy.</Text>
                </TouchableOpacity>
              </>
            }
            {
              form.length > 0 ?
                < TouchableOpacity
                  style={[styles.btn_style, { flexDirection: 'row' }]}
                  onPress={checkEmptyField}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: 15,
                      marginRight: 10,
                    }}>
                    SUBMIT
                  </Text>
                  {loading ? <ActivityIndicator /> : null}
                </TouchableOpacity>
                :
                < TouchableOpacity
                  style={[styles.btn_style, { flexDirection: 'row' }]}
                  onPress={checkEmptyField}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: 15,
                      marginRight: 10,
                    }}>
                    Apply
                  </Text>
                  {loading ? <ActivityIndicator /> : null}
                </TouchableOpacity>
            }



          </View>
        </ScrollView>
      </Root>

    </SafeAreaView >
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  placeholderStyle: {
    fontSize: 16,
    color: Themes == 'dark' ? '#000' : '#000'
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    color: Themes == 'dark' ? '#000' : '#000'
  },
  radio_icon: {
    marginRight: 5,
    color: GlobalStyle.orange,
  },
  input_title: { marginBottom: 3, fontSize: 14, fontWeight: '500', color: Themes == 'dark' ? '#000' : '#000' },
  input_top_margin: { marginTop: 30 },
  btn_style: {
    width: '100%',
    marginTop: 30,
    backgroundColor: GlobalStyle.blueDark,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTextStyle: {
    fontSize: 16, color: Themes == 'dark' ? '#000' : '#000'

  },

  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

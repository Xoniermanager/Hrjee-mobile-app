import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
  useColorScheme,
  Modal,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import GlobalStyle from '../../../reusable/GlobalStyle';
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Root, Popup } from 'popup-ui';
import Themes from './Pending';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Reload from '../../../../Reload';
import Toast from 'react-native-simple-toast';
import PullToRefresh from '../../../reusable/PullToRefresh';

const Pending = ({ navigation }) => {
  const theme = useColorScheme();
  const [Userdata, setUserdata] = useState(null);
  const [show, setShow] = useState('2');
  const [showMore, setShowMore] = useState(false);
  const [currentDisplayedTask, setCurrentDisplayedTask] = useState(null);
  const [loading, setloading] = useState(false);
  const [ind, setInd] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchItem, setSearchItem] = useState();
  const [filterData, setFilterData] = useState();

  const get_employee_detail = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    axios
      .get(`${apiUrl}/SecondPhaseApi/get_user_task`, config)
      .then(response => {
        setloading(false);
        if (response?.data?.status == 200) {
          setUserdata(response?.data?.data);
        }
      })
      .catch(error => {
        setloading(false);
        if (error.response.status == '401') {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [
              Popup.hide(),
              AsyncStorage.removeItem('Token'),
              AsyncStorage.removeItem('UserData'),
              AsyncStorage.removeItem('UserLocation'),
              navigation.navigate('Login'),
            ],
          });
        } else if (error.response.status == '400') {
          console.log(first)
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [Popup.hide()],
          });
        }
      });
  };
  const tast_status_update = async item => {
    const updatedStatus = parseInt(item?.status) + parseInt(1);
    const token = await AsyncStorage.getItem('Token');
    let body = new FormData();
    body.append('task_id', item?.task_id);
    body.append('status', updatedStatus);
    console.log(body, 'body')
    const config = {
      headers: {
        Token: token,
        'Content-Type': 'multipart/form-data',
      },
    };

    axios
      .post(`${apiUrl}/SecondPhaseApi/update_task_status`, body, config)
      .then(response => {
        console.log(response?.data, 'hello yash')
        get_employee_detail();
        setShow(response?.data);
        setModalVisible(false);

        Toast.show('This task is under progress.');
      })
      .catch(error => {
        if (error.response.status == '401') {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [
              Popup.hide(),
              AsyncStorage.removeItem('Token'),
              AsyncStorage.removeItem('UserData'),
              AsyncStorage.removeItem('UserLocation'),
              navigation.navigate('Login'),
            ],
          });
        }
      });
  };

  const update_show_hide = async (task_id, show) => {
    if (task_id == currentDisplayedTask) {
      setCurrentDisplayedTask(null);
      setShowMore(false);
    } else {
      setCurrentDisplayedTask(task_id);
      setShowMore(true);
    }
  };
  useEffect(() => {
    get_employee_detail();
  }, [show]);

  const data =
    Userdata &&
    Userdata.filter((item, index) => {
      return item.status == 0;
    });

  const onSearchList = async prev => {
    const filtered = data?.filter(
      item =>
        item.pincode?.toLowerCase().includes(prev.toLowerCase()) ||
        item.city?.toLowerCase().includes(prev.toLowerCase()) ||
        item.state?.toLowerCase().includes(prev.toLowerCase()) ||
        item.customer_name?.toLowerCase().includes(prev.toLowerCase()) ||
        item.loan_no?.toLowerCase().includes(prev.toLowerCase()),
    );
    if (prev === '') {
      setFilterData(null);
      return setUserdata(data);
    }
    setFilterData(filtered);
  };

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_employee_detail();
  };
  if (data == null) {
    return <Reload />;
  }
  return (
    <View style={styles.container}>
      <Root>
        <View
          style={{
            width: responsiveScreenWidth(96),
            height: responsiveHeight(5),
            borderRadius: 10,
            borderWidth: 0.5,
            shadowColor: '#000',
            alignSelf: 'center',
            marginVertical: 10,
          }}>
          <TextInput
            placeholder="Search by pin code/customer name/loan no"
            placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
            style={{ color: Themes == 'dark' ? '#000' : '#000' }}
            value={searchItem}
            onChangeText={prev => onSearchList(prev)}
          />
        </View>

        <PullToRefresh onRefresh={handleRefresh}>
          <View>
            {data?.length > 0 ? null : (
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginTop: responsiveHeight(30),
                    textAlign: 'center',
                    fontSize: 20,
                    color: Themes == 'dark' ? '#000' : '#000',
                  }}>
                  No Data Found
                </Text>
              </View>
            )}
            {filterData?.length != 0 ? null : <View style={{ justifyContent: "center", alignSelf: "center", alignItems: "center" }}>
              <Text style={{ marginTop: responsiveHeight(30), textAlign: 'center', fontSize: 20, color: Themes == 'dark' ? '#000' : '#000' }}>No Data Found</Text>
            </View>}
            <FlatList
              data={filterData ? filterData : data}
              renderItem={({ item, index }) => (
                <>
                  <View activeOpacity={0.2} style={styles.maincard}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => [
                          tast_status_update(item),
                          setModalVisible(true),
                        ]}
                        style={{ backgroundColor: '#0043ae', borderRadius: 10 }}>
                        <Text
                          style={{
                            color: Themes == 'dark' ? '#fff' : '#fff',
                            fontWeight: 'bold',
                            fontSize: 16,
                            padding: 5,
                          }}>
                          Select{' '}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => update_show_hide(item?.task_id, true)}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                          <Text
                            style={{
                              color: Themes == 'dark' ? '#0043ae' : '#0043ae',
                              fontWeight: 'bold',
                              fontSize: 16,
                              marginRight: 5,
                            }}>
                            {currentDisplayedTask != item.task_id
                              ? 'More'
                              : 'Hide'}
                          </Text>
                        </View>
                        <View>
                          <AntDesign name="down" size={20} color="#000" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    {
                      item?.company_id == 130 ?
                        <>
                          {currentDisplayedTask &&
                            currentDisplayedTask == item?.task_id ? (
                            <>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Agreement No:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.agreement_no ? item?.agreement_no : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Party id:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.party_id ? item?.party_id : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Hirer Name:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.hirer_name ? item?.hirer_name : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  BKT:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.bkt ? item?.bkt : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Pos Amount:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.pos_amount ? item?.pos_amount : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  BKT:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.bkt ? item?.bkt : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Emi Amount:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.emi_amount ? item?.emi_amount : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Od With Fir:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.od_with_fir ? item?.od_with_fir : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Hirer phone:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.hirer_phone ? item?.hirer_phone : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Area:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.area ? item?.area : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Sub Area:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.sub_area ? item?.sub_area : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  New Fos:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.new_fos ? item?.new_fos : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Hirer Address:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.hirer_address ? item?.hirer_address : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Hirer Address Off:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.hirer_address_off ? item?.hirer_address_off : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Model:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.model ? item?.model : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Registration_no:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.registration_no ? item?.registration_no : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  First Emi Date:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.first_emi_date ? item?.first_emi_date : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Agreement Date:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.agreement_date ? item?.agreement_date : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Last Emi Date:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.last_emi_date ? item?.last_emi_date : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Bounce Reason:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.bounce_reason ? item?.bounce_reason : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Dept id:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.dept_id ? item?.dept_id : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Customer name:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.customer_name ? item?.customer_name : 'N/A'}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Mobile Number:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.mobile_no ? item?.mobile_no : 'N/A'}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Loan no:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.loan_no ? item?.loan_no : 'N/A'}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Visit Address:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    width: responsiveWidth(60),
                                    textAlign: 'right',
                                  }}>
                                  {item?.risk_address ? item?.risk_address : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  State:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.state ? item?.state : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  City:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.city ? item?.city : "N/A"}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Pincode:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.pincode ? item?.pincode : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Total Amount:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.total_amount ? item?.total_amount : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Principal:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.principle ? item?.principle : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Emi amount:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.emi_amount ? item?.emi_amount : 'N/A'}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Builder name:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.builder_name ? item?.builder_name : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Banker name:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.banker_name ? item?.banker_name : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Loan center:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.loan_center ? item?.loan_center : 'N/A'}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Proparty address:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    width: responsiveWidth(60),
                                    textAlign: 'right',
                                  }}>
                                  {item?.proparty_address ? item?.proparty_address : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Alternate no:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.alternate_no ? item?.alternate_no : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Legal status:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.legal_status ? item?.legal_status : 'N/A'}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Manager remark:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    width: responsiveWidth(60),
                                    textAlign: 'right',
                                  }}>
                                  {item?.description ? item?.description : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Location coordinates:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.location_coordinates ? item?.location_coordinates : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Home address:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    width: responsiveWidth(60),
                                    textAlign: 'right',
                                  }}>
                                  {item?.home_address ? item?.home_address : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  pos amount:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.pos_amount ? item?.pos_amount : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Product:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.product ? item?.product : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Process name:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.process_name ? item?.process_name : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Created Date:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.create_at ? item?.create_at : 'N/A'}
                                </Text>
                              </View>
                            </>
                          ) : (
                            <>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Loan no:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.loan_no ? item?.loan_no : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Customer name:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.customer_name ? item?.customer_name : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Pincode:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  {item?.pincode ? item?.pincode : 'N/A'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    textAlign: 'center',
                                  }}>
                                  Visit Address:
                                </Text>
                                <Text
                                  style={{
                                    color: Themes == 'dark' ? '#000' : '#000',
                                    width: responsiveWidth(60),
                                    textAlign: 'right'
                                  }}>
                                  {item?.risk_address ? item?.risk_address : 'N/A'}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginBottom: 2,
                                }}>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  Created Date:
                                </Text>
                                <Text
                                  style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                  {item?.create_at ? item?.create_at : 'N/A'}
                                </Text>
                              </View>
                            </>
                          )}
                        </>
                        :
                        item?.company_id == 163 ?
                          <>
                            {currentDisplayedTask &&
                              currentDisplayedTask == item?.task_id ? (
                              <>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Account No:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.ac_no ? item?.ac_no : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Bank Name:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.bank_name ? item?.bank_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Product:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.product ? item?.product : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Closing Date:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.closing_date ? item?.closing_date : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    BKT:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.bkt ? item?.bkt : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Customer name:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.customer_name ? item?.customer_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Cr Balance:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.cr_balance ? item?.cr_balance : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Pos Amount:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.pos_amount ? item?.pos_amount : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Emi Amount:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.emi_amount ? item?.emi_amount : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Stab amount:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.stab_amount ? item?.stab_amount : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Area:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.area ? item?.area : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Zone:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.zone ? item?.zone : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    TC:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.tc ? item?.tc : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Assign:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.assign ? item?.assign : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Dept id:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.dept_id ? item?.dept_id : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Mobile Number:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.mobile_no ? item?.mobile_no : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Loan no:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.loan_no ? item?.loan_no : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Visit Address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.risk_address ? item?.risk_address : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    State:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.state ? item?.state : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    City:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.city ? item?.city : "N/A"}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Pincode:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.pincode ? item?.pincode : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Total Amount:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.total_amount ? item?.total_amount : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Principal:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.principle ? item?.principle : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Emi amount:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.emi_amount ? item?.emi_amount : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Builder name:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.builder_name ? item?.builder_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Banker name:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.banker_name ? item?.banker_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Loan center:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.loan_center ? item?.loan_center : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Proparty address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.proparty_address ? item?.proparty_address : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Alternate no:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.alternate_no ? item?.alternate_no : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Legal status:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.legal_status ? item?.legal_status : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Manager remark:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.description ? item?.description : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Location coordinates:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.location_coordinates ? item?.location_coordinates : 'N/A'}
                                  </Text>
                                </View>
                                {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Home address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.home_address ? item?.home_address : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    pos amount:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.pos_amount ? item?.pos_amount : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Product:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.product ? item?.product : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Process name:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.process_name ? item?.process_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Created Date:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.create_at ? item?.create_at : 'N/A'}
                                  </Text>
                                </View> */}
                              </>
                            ) : (
                              <>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Loan no:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.loan_no ? item?.loan_no : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Customer name:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.customer_name ? item?.customer_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Pincode:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.pincode ? item?.pincode : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Visit Address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right'
                                    }}>
                                    {item?.risk_address ? item?.risk_address : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Created Date:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.create_at ? item?.create_at : 'N/A'}
                                  </Text>
                                </View>
                              </>
                            )}
                          </>
                          :
                          <>
                            {currentDisplayedTask &&
                              currentDisplayedTask == item?.task_id ? (
                              <>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Dept id:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.dept_id ? item?.dept_id : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Customer name:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.customer_name ? item?.customer_name : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Mobile Number:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.mobile_no ? item?.mobile_no : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Loan no:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.loan_no ? item?.loan_no : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Visit Address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.risk_address ? item?.risk_address : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    State:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.state ? item?.state : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    City:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.city ? item?.city : "N/A"}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Pincode:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.pincode ? item?.pincode : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Total Amount:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.total_amount ? item?.total_amount : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Principal:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.principle ? item?.principle : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Emi amount:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.emi_amount ? item?.emi_amount : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Builder name:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.builder_name ? item?.builder_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Banker name:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.banker_name ? item?.banker_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Loan center:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.loan_center ? item?.loan_center : 'N/A'}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Proparty address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.proparty_address ? item?.proparty_address : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Alternate no:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.alternate_no ? item?.alternate_no : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Legal status:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.legal_status ? item?.legal_status : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Manager remark:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.description ? item?.description : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Location coordinates:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.location_coordinates ? item?.location_coordinates : 'N/A'}
                                  </Text>
                                </View>
                                {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Home address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right',
                                    }}>
                                    {item?.home_address ? item?.home_address : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    pos amount:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.pos_amount ? item?.pos_amount : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Product:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.product ? item?.product : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Process name:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.process_name ? item?.process_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Created Date:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.create_at ? item?.create_at : 'N/A'}
                                  </Text>
                                </View> */}
                              </>
                            ) : (
                              <>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Loan no:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.loan_no ? item?.loan_no : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Customer name:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.customer_name ? item?.customer_name : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Pincode:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    {item?.pincode ? item?.pincode : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      textAlign: 'center',
                                    }}>
                                    Visit Address:
                                  </Text>
                                  <Text
                                    style={{
                                      color: Themes == 'dark' ? '#000' : '#000',
                                      width: responsiveWidth(60),
                                      textAlign: 'right'
                                    }}>
                                    {item?.risk_address ? item?.risk_address : 'N/A'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 2,
                                  }}>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    Created Date:
                                  </Text>
                                  <Text
                                    style={{ color: Themes == 'dark' ? '#000' : '#000' }}>
                                    {item?.create_at ? item?.create_at : 'N/A'}
                                  </Text>
                                </View>
                              </>
                            )}
                          </>
                    }
                  </View>
                </>
              )}
            />
          </View>
          {modalVisible && (
            <View
              style={{
                width: '100%',
                height: '100%',
                zIndex: 99,
                backgroundColor: 'rgba(0,0,0,0.3)',
                position: 'absolute',
                flex: 1,
              }}></View>
          )}
          <Modal animationType="none" transparent={true} visible={modalVisible}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                alignSelf: 'center',
                marginTop: responsiveHeight(50),
              }}>
              <ActivityIndicator size="large" color="#0043ae" />
            </View>
          </Modal>
        </PullToRefresh>
      </Root>
    </View>
  );
};

export default Pending;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3eefb',
  },
  maincard: {
    // flexDirection:"row", justifyContent:"space-between", marginHorizontal: responsiveScreenWidth(2),
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    opacity: 1,
    elevation: 20,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: responsiveScreenWidth(3),
    marginVertical: 2,
  },
});

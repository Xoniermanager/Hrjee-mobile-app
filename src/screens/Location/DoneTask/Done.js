import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  useColorScheme,
  TextInput
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyle from '../../../reusable/GlobalStyle';
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
  
} from 'react-native-responsive-dimensions';

import Themes from '../PendingTask/Pending';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Reload from '../../../../Reload';
// import { Root, Popup } from 'popup-ui'

const Done = ({navigation}) => {
  const theme = useColorScheme();

  const [Userdata, setUserdata] = useState();

  const [show, setShow] = useState('2');
  const [showMore, setShowMore] = useState(false);
  const [currentDisplayedTask, setCurrentDisplayedTask] = useState(null);
  const [loading, setloading] = useState(false);
  const [filterData,setFilterData]=useState()
  const [searchItem,setSearchItem]=useState()
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      get_employee_detail();
    });

    return unsubscribe;
  }, [navigation]);

  const get_employee_detail = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
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
        // if (error.response.status == '401') {
      
        //   AsyncStorage.removeItem('Token');
        //   AsyncStorage.removeItem('UserData');
        //   AsyncStorage.removeItem('UserLocation');
        //   navigation.navigate('Login');
        // }
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
      return item.status == 2;
    });
  if (data == null) {
    return <Reload />;
  }
  const onSearchList = async (prev) => {
    const filtered = data?.filter(item =>
      item.pincode.toLowerCase().includes(prev.toLowerCase()) ||   item.city.toLowerCase().includes(prev.toLowerCase()) ||   item.state.toLowerCase().includes(prev.toLowerCase()) || item.customer_name.toLowerCase().includes(prev.toLowerCase()) ||  item.loan_no.toLowerCase().includes(prev.toLowerCase()),

    );
    if (prev === '') {
      setFilterData('')
      return setUserdata(data);
    }
    setFilterData(filtered);
};
  return (
    <View style={styles.container}>
      
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
<View style={{width:responsiveScreenWidth(96),height:responsiveHeight(5),borderRadius:10,borderWidth:0.5,shadowColor: '#000',alignSelf:'center',marginVertical:10}
    }>
  <TextInput
  placeholder='Search by pin code...'
  value={searchItem}
  onChangeText={(prev)=>onSearchList(prev)}
 
  />
</View>
      <FlatList
        data={filterData?filterData: data}
        renderItem={({item, index}) => (
          <>
            <View activeOpacity={0.2} style={styles.maincard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: Themes == 'dark' ? '#0043ae' : '#0043ae',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Task
                  </Text>
                  <View>
                    <MaterialIcons
                      name="check-circle"
                      size={25}
                      color="green"
                      marginLeft={5}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => update_show_hide(item?.task_id, true)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    <Text
                      style={{
                        color: Themes == 'dark' ? '#0043ae' : '#0043ae',
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginRight: 5,
                      }}>
                      {currentDisplayedTask != item.task_id ? 'More' : 'Hide'}
                    </Text>
                  </View>
                  <View>
                    <AntDesign name="down" size={30} color="#000" />
                  </View>
                </TouchableOpacity>
              </View>
              {currentDisplayedTask && currentDisplayedTask == item?.task_id ? (
               <>
             
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Dept id:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.dept_id}</Text>
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
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Visit Address:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.risk_address}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Loan no:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.loan_no}</Text>
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
                            textAlign: 'center',
                          }}>
                          {item?.risk_address}
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
                          {item?.state}
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
                          {item?.city}
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
                          {item?.pincode}
                        </Text>
                      </View>
              


               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Latitude:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.latitude}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Longitude:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.longitude}</Text>
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
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Current address:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.lat_long_address}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>Remark:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000', textAlign: "center" }}>{item?.remark}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Proparty address:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.proparty_address}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Alternate no:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.alternate_no}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Legal status:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.legal_status}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Created Date:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.create_at}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Status:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.status}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
              <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Is approve:</Text>
              {item?.is_approve==0?<Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Pending</Text>:null}   
              {item?.is_approve==1?<Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Process</Text>:null}    

              {item?.is_approve==2?<Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Complete</Text>:null}    

              {item?.is_approve==3?<Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Reject</Text>:null}    

                



               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Asign:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.assign}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Task asign id:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.task_asign_id}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Assign by:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.assign_by}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>update_at:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.update_at}</Text>
               </View>
               
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Manager remark:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.description}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Location coordinates:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.location_coordinates}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Home address:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.home_address}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>pos amount:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.pos_amount}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Product:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.product}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Process name:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.process_name}</Text>
               </View>
               <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>Remark:</Text>
                 <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{item?.remark}</Text>
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
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      Customer name:
                    </Text>
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      {item?.customer_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 2,
                    }}>
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      Mobile Number:
                    </Text>
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      {item?.mobile_no}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 2,
                    }}>
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      Approved by:
                    </Text>
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      {item?.approved_by}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 2,
                    }}>
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      Created Date:
                    </Text>
                    <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                      {item?.create_at}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </>
        )}
      />
    </View>
  );
};

export default Done;

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
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: responsiveScreenWidth(3),
    marginVertical: 2,
  },
});

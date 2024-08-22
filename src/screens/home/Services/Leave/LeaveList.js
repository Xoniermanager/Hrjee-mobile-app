import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  useColorScheme,
  SafeAreaView
} from 'react-native';
import React, { useState, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl';
import axios from 'axios';
import { EssContext } from '../../../../../Context/EssContext';
import PullToRefresh from '../../../../reusable/PullToRefresh';
import Themes from '../../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'
import CardSkeleton from '../../../Skeleton/CardSkeleton';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

const LeaveList = ({ navigation }) => {
  const theme = useColorScheme();
  const arr = [1, 2, 3, 4, 5, 6,7,8]

  const { user } = useContext(EssContext);

  // console.log('user------>', user);
  const [empty, setempty] = useState(false);
  const [leaveList, setleaveList] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setloading] = useState(false);
  const [leaveListFilter, setleaveListFilter] = useState();
  const [tag, settag] = useState('');

  // console.log('leaveList------>', leaveList);

  useFocusEffect(
    React.useCallback(() => {
      get_leaves();
      settag('all');
    }, [refreshing]),
  );

  const get_leaves = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');

    const config = {
      headers: { Token: token },
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/secondPhaseApi/leave_summary_by_userid`, body, config)
      .then(response => {
        if (response.data.status == 1) {
          setloading(false);
          try {
            setleaveList(response.data.data);
            setleaveListFilter(response.data.data);
            setempty(false);


          } catch (e) {
            console.log(e);
          }
        } else {
          setloading(false);
          setempty(true);
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

  const cancelLeave = async leave_id => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    const body = {
      leave_id: leave_id,
      leave_wfstage_id: 9,
      current_approver_eno: user.EMPLOYEE_NUMBER,
      stage_actor_eno: user.EMPLOYEE_NUMBER,
    };
    // console.log(body);
    axios
      .post(`${apiUrl}/secondPhaseApi/leave_action`, body, config)
      .then(response => {
        // console.log('response', response.data);
        if (response.data.status == 1) {
          try {
            console.log(response.data.message);
            setleaveList();
            get_leaves();
          } catch (e) {

          }
        } else {
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

  const leaveFilter = filter => {
    settag(filter);
    if (filter == 'all') {
      setleaveList(leaveListFilter);
    } else if (filter == 'earned') {
      let arr1 = [];
      leaveListFilter.forEach(i => {
        if (i.leave_type_name == 'Earned  Leave') {
          arr1.push(i);
        }
      });

      setleaveList(arr1);
    } else if (filter == 'casual') {
      let arr2 = [];
      leaveListFilter.forEach(i => {
        if (i.leave_type_name == 'Casual Leave ') {
          arr2.push(i);
        }
      });
      setleaveList(arr2);
    } else if (filter == 'unpaid') {
      let arr3 = [];
      leaveListFilter.forEach(i => {
        // console.log(i.leave_type_name);
        if (i.leave_type_name == 'Unpaid Leave ') {
          arr3.push(i);
        }
      });
      setleaveList(arr3);
    }
  };

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_leaves();
    settag('all');
  };

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <Root>


        <View style={{ flex: 1, backgroundColor: '#e3eefb' }}>
          {empty ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}>
              <Image
                style={styles.tinyLogo}
                source={require('../../../../images/emptyForm.gif')}
              />
            </View>
          ) : (
            <PullToRefresh onRefresh={handleRefresh}>
              <View style={{ flex: 1, padding: 15 }}>
                <View style={styles.tag_separator}>
                  {/* <TouchableOpacity
                  style={[
                    styles.tag,
                    { backgroundColor: tag == 'all' ? '#0043ae' : '#0043ae50' },
                  ]}
                  onPress={() => leaveFilter('all')}>
                  <Text style={styles.tag_text}>All</Text>
                  <AntDesign
                    name="plus"
                    size={15}
                    color="white"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity> */}
                  {/* <TouchableOpacity
                  style={[
                    styles.tag,
                    { backgroundColor: tag == 'earned' ? '#0043ae' : '#0043ae50' },
                  ]}
                  onPress={() => leaveFilter('earned')}>
                  <Text style={styles.tag_text}>Earned</Text>
                  <AntDesign
                    name="plus"
                    size={15}
                    color="white"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    { backgroundColor: tag == 'casual' ? '#0043ae' : '#0043ae50' },
                  ]}
                  onPress={() => leaveFilter('casual')}>
                  <Text style={[styles.tag_text]}>Casual</Text>
                  <AntDesign
                    name="plus"
                    size={15}
                    color="white"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    { backgroundColor: tag == 'unpaid' ? '#0043ae' : '#0043ae50' },
                  ]}
                  onPress={() => leaveFilter('unpaid')}>
                  <Text style={styles.tag_text}>Unpaid</Text>
                  <AntDesign
                    name="plus"
                    size={15}
                    color="white"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity> */}
                </View>
                {leaveList ? (
                  leaveList?.length > 0 ? (
                    leaveList.map((i, index) => (
                      <View
                        key={index}
                        style={[
                          {
                            padding: 18,
                            borderRadius: 5,
                            backgroundColor: 'white',
                            marginTop: 15,
                            marginBottom: index == leaveList?.length - 1 ? 100 : 0,
                          },
                          GlobalStyle.card,
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View>
                            <Text style={[{ fontWeight: '600', fontSize: 18 }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                              {i.leave_type_name}
                            </Text>
                            <Text style={[{ fontSize: 13 }, { color: Themes == 'dark' ? '#000' : '#000' }]}>
                              {i.leave_start_dt + ' to ' + i.leave_end_dt}
                            </Text>
                          </View>
                          <View style={styles.status_tag}>
                            <Text style={styles.status_txt}>
                              {i.leave_wfstage_name === 'Approved-Gr'
                                ? 'Pending'
                                : i.leave_wfstage_name === 'Approved-mgr'
                                  ? 'Approved'
                                  : i.leave_wfstage_name === 'Rejected-mgr'
                                    ? 'Rejected'
                                    : i.leave_wfstage_name}
                            </Text>
                          </View>
                        </View>

                        <View style={{ marginTop: 10 }}>
                          <Text style={{ fontSize: 14 }}>{i?.notes == null || i?.notes == '' || i?.notes == 'null' ? 'N/A' : i?.notes}</Text>
                        </View>
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          {
                            i.leave_wfstage_name === 'Pending' ?
                              <TouchableOpacity
                                onPress={() =>
                                  Alert.alert(
                                    '',
                                    'Are you sure you want to Cancel Leave?',
                                    [
                                      {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                      },
                                      { text: 'OK', onPress: () => cancelLeave(i.leaveid) },
                                    ],
                                  )
                                }
                                // onPress={() => cancelLeave(i.leaveid)}

                                style={{
                                  padding: 10,
                                  backgroundColor: GlobalStyle.orange,
                                  borderRadius: 25,
                                }}>
                                <Text style={{ color: 'white', fontWeight: '700' }}>
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                              :
                              null
                          }


                          <AntDesign
                            onPress={() =>
                              navigation.navigate('Leave Details', {
                                leave_id: i.leaveid,
                                current_status: i.leave_wfstage_name
                              })
                            }
                            name="rightcircle"
                            size={28}
                            color="#0043ae"
                            style={{ marginRight: 5 }}
                          />
                        </View>
                      </View>
                    ))
                  ) :
                    (
                      <View style={styles.emptyContainer}>
                      <Text style={{color:"#000"}}>No leaves found!</Text>
                    </View>
                    )
                )
                  :
                  (
                    arr.map((val, index) => {
                      return (
                        <View key={index} style={{ marginVertical: 5,  borderColor: 'gray', alignSelf: "center" }}>
                          <CardSkeleton height={responsiveHeight(18)} width={responsiveWidth(95)} />
                        </View>
                      )
                    })
                  )

                }

              </View>
            </PullToRefresh>
          )}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 15,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Apply Leave')}
              style={{
                padding: 15,
                backgroundColor: GlobalStyle.blueDark,
                borderRadius: 5,
                alignItems: 'center',
              }}>
              <Text style={{ color: 'white', fontWeight: '700' }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Root>
    </SafeAreaView>
  );
};

export default LeaveList;

const styles = StyleSheet.create({
  btn_style: {
    width: '100%',
    marginTop: 30,
    backgroundColor: '#0321a4',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  tag: {
    // backgroundColor: GlobalStyle.blueDark,
    padding: 6,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag_text: { color: 'white', fontWeight: '600' },
  tag_separator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status_tag: {
    padding: 5,
    backgroundColor: '#fcbc0320',
    borderColor: '#fcbc03',
    borderWidth: 1,
    borderRadius: 15,
  },
  status_txt: {
    color: '#fcbc03',
    fontWeight: '600',
  },
  emptyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

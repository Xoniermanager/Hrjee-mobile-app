import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import GlobalStyle from '../../../../../reusable/GlobalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useApi from '../../../../../../api/useApi';
import {EssContext} from '../../../../../../Context/EssContext';
import {useFocusEffect} from '@react-navigation/native';
import purchaseRequest from '../../../../../../api/purchaseRequest';
import Themes from '../Acknowledgement/Acknowledgement';

let {width} = Dimensions.get('window');

const PurchaseRequest = ({navigation, route}) => {
  const theme = useColorScheme();

  const {user} = useContext(EssContext);

  const submitApi = useApi(purchaseRequest.submit);
  const getDetailsApi = useApi(purchaseRequest.getDetails);
  const updateApi = useApi(purchaseRequest.updateDetails);

  useEffect(() => {
    getPurchasetRequestDetails();
  }, []);

  route.params.update &&
    useFocusEffect(
      React.useCallback(() => {
        getDetailsApi.data
          ? (setinputVal({
              department: getDetailsApi.data.data.department,
              employee: getDetailsApi.data.data.employee,
              executive_manager: getDetailsApi.data.data.executive_manager,
              direct_manager: getDetailsApi.data.data.direct_manager,
            }),
            setitemArr(JSON.parse(getDetailsApi.data.data.items)),
            setdateText({
              text1: getDetailsApi.data.data.doc_date
                ? new Date(getDetailsApi.data.data.doc_date)
                    .toISOString()
                    .substring(0, 10)
                : 'select date',
            }))
          : null;
      }, [getDetailsApi.loading]),
    );

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [dateText, setdateText] = useState({
    text1: 'select date',
  });
  const [item, setitem] = useState({
    items: '',
    quantity: '',
  });
  let [itemArr, setitemArr] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [load, setload] = useState(false);
  const [updateIndex, setupdateIndex] = useState('');
  const [showUpdate, setshowUpdate] = useState(false);
  const [inputVal, setinputVal] = useState({
    department: '',
    employee: '',
    executive_manager: '',
    direct_manager: '',
  });

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      department: inputVal.department,
      doc_date: dateText.text1 == 'select date' ? '' : dateText.text1,
      employee: inputVal.employee,
      executive_manager: inputVal.executive_manager,
      direct_manager: inputVal.direct_manager,
      items: itemArr,
    };
    console.log(body);
    const config = {
      headers: {Token: token},
    };

    submitApi.request(body, config);
  };
  const updateForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      purchase_id: route.params.id,
      department: inputVal.department,
      doc_date: dateText.text1 == 'select date' ? '' : dateText.text1,
      employee: inputVal.employee,
      executive_manager: inputVal.executive_manager,
      direct_manager: inputVal.direct_manager,
      items: itemArr,
    };
    console.log(body);
    const config = {
      headers: {Token: token},
    };
    updateApi.request(body, config);
  };

  submitApi.data?.status && navigation.navigate('Purchase Listings');
  updateApi.data?.status && navigation.navigate('Purchase Listings');

  const deleteItem = index => {
    itemArr.splice(index, 1);
    setitemArr(itemArr);
    setload(!load);
  };
  const updateItem = index => {
    setupdateIndex(index);
    setshowUpdate(true);
    setModalVisible(true);
    setitem(itemArr[index]);
  };

  const getPurchasetRequestDetails = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    getDetailsApi.request(
      {
        user_id: user.userid,
        id: route.params.id,
      },
      config,
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View style={{}}>
          <Text style={styles.input_title}>Date</Text>
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
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>{dateText.text1}</Text>
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
            theme='light'
            modal
            open={startopen}
            date={startDate}
            mode="date"
            onConfirm={date => {
              setstartopen(false);
              setStartDate(date);
              setdateText({
                ...dateText,
                text1: date.toISOString().substring(0, 10),
              });
            }}
            onCancel={() => {
              setstartopen(false);
            }}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, employee: text})}
            value={inputVal.employee}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Department</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, department: text})}
            value={inputVal.department}
          />
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={[{fontSize: 16, fontWeight: '500'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>Add Items</Text>
            <Pressable
              onPress={() => {
                setModalVisible(!modalVisible);
                setshowUpdate(false);
                setitem({
                  items: '',
                  quantity: '',
                });
              }}>
              <AntDesign name="plus" style={{fontSize: 26, color: '#0043ae'}} />
            </Pressable>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={[{fontSize: 17, fontWeight: '500'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
                      Add Items
                    </Text>
                    <Pressable
                      onPress={() => {
                        setitem({
                          items: '',
                          quantity: '',
                        });
                        setModalVisible(!modalVisible);
                        setshowUpdate(false);
                      }}>
                      <AntDesign
                        name="close"
                        style={{fontSize: 24, color: '#cd181f'}}
                      />
                    </Pressable>
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20},{color: Themes == 'dark' ? '#000' : '#000'}]}>Items</Text>
                    <TextInput
                      style={[styles.input]}
                      value={item.items}
                      onChangeText={text => setitem({...item, items: text})}
                    />
                  </View>

                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>Quantity</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={[styles.input]}
                      value={item.quantity}
                      onChangeText={text => setitem({...item, quantity: text})}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 30,
                    }}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      style={{backgroundColor: '#cd181f', borderRadius: 5}}>
                      <Text style={styles.modal_btn_txt}>Close</Text>
                    </TouchableOpacity>

                    {showUpdate ? (
                      <TouchableOpacity
                        onPress={() => {
                          itemArr.splice(updateIndex, 1);
                          setitemArr([...itemArr, item]);
                          setModalVisible(false);
                          setitem({
                            items: '',
                            quantity: '',
                          });
                        }}
                        style={{backgroundColor: '#0e664e', borderRadius: 5}}>
                        <Text style={styles.modal_btn_txt}>Update</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setitemArr([...itemArr, item]);
                          setModalVisible(false);
                          setitem({
                            items: '',
                            quantity: '',
                          });
                        }}
                        style={{backgroundColor: '#0e664e', borderRadius: 5}}>
                        <Text style={styles.modal_btn_txt}>Submit</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          {itemArr &&
            itemArr.map((i, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#0043ae15',
                  padding: 15,
                  marginTop: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 13, fontWeight: '500'}}>{i.items}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 60,
                  }}>
                  <AntDesign
                    name="edit"
                    onPress={() => updateItem(index)}
                    style={{fontSize: 20, color: '#0043ae'}}
                  />
                  <AntDesign
                    name="delete"
                    onPress={() => deleteItem(index)}
                    style={{fontSize: 20, color: '#cd181f'}}
                  />
                </View>
              </View>
            ))}
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Executive Manager</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({...inputVal, executive_manager: text})
            }
            value={inputVal.executive_manager}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Direct Manager</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({...inputVal, direct_manager: text})
            }
            value={inputVal.direct_manager}
          />
        </View>

        {route.params.update ? (
          <TouchableOpacity style={[styles.btn_style]} onPress={updateForm}>
            {updateApi.loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Update
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn_style]} onPress={submitForm}>
            {submitApi.loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default PurchaseRequest;

const styles = StyleSheet.create({
  input_title: {marginBottom: 3, fontSize: 14, fontWeight: '500', color: Themes == 'dark' ? '#000' : '#000'},
  input_top_margin: {marginTop: 15},
  radio_icon: {
    marginRight: 5,
    color: GlobalStyle.orange,
  },
  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey', color: Themes == 'dark' ? '#000' : '#000'
  },
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000070',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width / 1.2,
  },
  modal_btn_txt: {
    color: 'white',
    padding: 10,
    fontWeight: '700',
  },
});

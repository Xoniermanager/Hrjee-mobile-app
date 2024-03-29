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
import SparePartsRequestApi from '../../../../../../api/SparePartsRequest';
import {EssContext} from '../../../../../../Context/EssContext';
import useApi from '../../../../../../api/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Themes from '../Acknowledgement/Acknowledgement';


let {width} = Dimensions.get('window');

const SparePartsRequest = ({navigation, route}) => {
  const theme = useColorScheme();
  const {user} = useContext(EssContext);
  const submitApi = useApi(SparePartsRequestApi.submit);
  const getDetailsApi = useApi(SparePartsRequestApi.getDetails);
  const updateApi = useApi(SparePartsRequestApi.updateDetails);

  useEffect(() => {
    getAccessoriesDetails();
  }, []);

  route.params.update &&
    useFocusEffect(
      React.useCallback(() => {
        if (getDetailsApi.data) {
          const requested_by = JSON.parse(getDetailsApi.data.data.requested_by);
          setitemArr(getDetailsApi.data.data.items);
          setdateText({
            date:
              getDetailsApi.data.data.request_date == ''
                ? 'select date'
                : getDetailsApi.data.data.request_date,
          });
          setinputVal({
            accessories_type: getDetailsApi.data.data.accessories_type,
            request_reason: getDetailsApi.data.data.request_reason,
            name: requested_by.name,
            signature: requested_by.signature,
          });

          console.log('getDetailsApi.data.data.items===', getDetailsApi.data);
        }
      }, [getDetailsApi.loading]),
    );

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [dateText, setdateText] = useState({
    date: 'select date',
  });

  const [inputVal, setinputVal] = useState({
    accessories_type: '',
    request_reason: '',
    name: '',
    signature: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [item, setitem] = useState({
    code: '',
    description: '',
    quantity: '',
  });
  const [showUpdate, setshowUpdate] = useState(false);
  let [itemArr, setitemArr] = useState([]);
  const [updateIndex, setupdateIndex] = useState('');
  const [load, setload] = useState(false);

  const updateItem = index => {
    setupdateIndex(index);
    setshowUpdate(true);
    setModalVisible(true);
    setitem(itemArr[index]);
  };

  const deleteItem = index => {
    itemArr.splice(index, 1);
    setitemArr(itemArr);
    setload(!load);
  };

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      request_date: dateText.date == 'select date' ? '' : dateText.date,
      accessories_type: inputVal.accessories_type,
      request_reason: inputVal.request_reason,
      accessories_part: itemArr,
      requested_by: {
        name: inputVal.name,
        signature: inputVal.signature,
      },
    };

    console.log('body--->', body);
    const config = {
      headers: {Token: token},
    };

    submitApi.request(body, config);
  };

  if (submitApi.data?.status) {
    alert('Form submitted!');
    navigation.goBack();
  }

  const getAccessoriesDetails = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    getDetailsApi.request(
      {
        id: route.params.id,
      },
      config,
    );
  };

  const updateForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      request_date: dateText.date == 'select date' ? '' : dateText.date,
      accessories_type: inputVal.accessories_type,
      request_reason: inputVal.request_reason,
      accessories_part: itemArr,
      acc_id: route.params.id,
      requested_by: {
        name: inputVal.name,
        signature: inputVal.signature,
      },
    };
    // console.log(body);
    const config = {
      headers: {Token: token},
    };
    updateApi.request(body, config);
  };

  updateApi.data?.status && navigation.navigate('Accessories Listings');

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View style={{}}>
          <Text style={styles.input_title}>Date</Text>
          <TouchableOpacity
            onPress={() => setstartopen(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              borderRadius: 5,
              borderBottomWidth: 1,
              borderBottomColor: 'grey',
            }}>
            <Text>{dateText.date}</Text>
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
                date: date.toISOString().substring(0, 10),
              });
            }}
            onCancel={() => {
              setstartopen(false);
            }}
          />
        </View>

        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Accessory Type</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({...inputVal, accessories_type: text})
            }
            value={inputVal.accessories_type}
          />
        </View>

        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Request Reason</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({...inputVal, request_reason: text})
            }
            value={inputVal.request_reason}
          />
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={[{fontSize: 16, fontWeight: '500'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>Accessories:</Text>
            <Pressable
              onPress={() => {
                setModalVisible(!modalVisible);
                setshowUpdate(false);
                setitem({
                  code: '',
                  description: '',
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
                      Spare Parts:
                    </Text>
                    <Pressable onPress={() => setModalVisible(!modalVisible)}>
                      <AntDesign
                        name="close"
                        style={{fontSize: 24, color: '#cd181f'}}
                      />
                    </Pressable>
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>Code</Text>
                    <TextInput
                      style={[styles.input]}
                      value={item.code}
                      onChangeText={text => setitem({...item, code: text})}
                    />
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
                      Description
                    </Text>
                    <TextInput
                      style={[styles.input]}
                      value={item.description}
                      onChangeText={text =>
                        setitem({...item, description: text})
                      }
                    />
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20, }, {color: Themes == 'dark' ? '#000' : '#000'}]}>Quantity </Text>
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
                            code: '',
                            description: '',
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
                            code: '',
                            description: '',
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
                <Text style={{fontSize: 13, fontWeight: '500'}}>
                  {i.description}
                </Text>
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

        <View style={{marginTop: 15}}>
          <Text style={[{fontSize: 20, fontWeight: '600'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>Requested By</Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setinputVal({...inputVal, name: text})}
              value={inputVal.name}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setinputVal({...inputVal, signature: text})}
              value={inputVal.signature}
            />
          </View>
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

export default SparePartsRequest;

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

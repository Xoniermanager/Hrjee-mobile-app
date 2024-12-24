import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import GlobalStyle from '../../../../../reusable/GlobalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-date-picker';
import useApi from '../../../../../../api/useApi';
import {EssContext} from '../../../../../../Context/EssContext';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import disposalReport from '../../../../../../api/disposalReport';
import Themes from '../Acknowledgement/Acknowledgement';

let {width} = Dimensions.get('window');

const DisposalReport = ({navigation, route}) => {
  const theme = useColorScheme();

  const {user} = useContext(EssContext);
  const submitApi = useApi(disposalReport.submit);
  const getDetailsApi = useApi(disposalReport.getDetails);
  const updateApi = useApi(disposalReport.updateDetails);

  useEffect(() => {
    getDisposalRequestDetails();
  }, []);

  route.params.update &&
    useFocusEffect(
      React.useCallback(() => {
        if (getDetailsApi.data) {
          const executive_manager = JSON.parse(
            getDetailsApi?.data?.data?.executive_manager,
          );
          const finance_manager = JSON.parse(
            getDetailsApi.data.data.finance_manager,
          );
          const requested_by = JSON.parse(getDetailsApi.data.data.requested_by);

          setitem_type(getDetailsApi.data.data.item_type);
          setdateText({
            date: getDetailsApi.data.data.datetime.split(' ')[0],
            time: getDetailsApi.data.data.datetime.split(' ')[1],
          });
          setitemArr(getDetailsApi.data.data.items);
          setexecutive_manager({
            name: executive_manager.name,
            signature: executive_manager.signature,
          });
          setfinance_manager({
            name: finance_manager.name,
            signature: finance_manager.signature,
          });
          setrequested_by({
            name: requested_by.name,
            signature: requested_by.signature,
          });

        }
      }, [getDetailsApi.loading]),
    );

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [startopen2, setstartopen2] = useState(false);
  const [startDate2, setStartDate2] = useState(new Date());

  const [device, setdevice] = useState(false);
  const [equipment, setequipment] = useState(false);
  const [other, setother] = useState(false);
  const [medicalSupplies, setmedicalSupplies] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [item_type, setitem_type] = useState('');
  const [executive_manager, setexecutive_manager] = useState({
    name: '',
    signature: '',
  });
  const [finance_manager, setfinance_manager] = useState({
    name: '',
    signature: '',
  });
  const [requested_by, setrequested_by] = useState({
    name: '',
    signature: '',
  });
  const [item, setitem] = useState({
    note: '',
    type: '',
    quantity: 0,
    description: '',
  });
  let [itemArr, setitemArr] = useState([]);
  const [dateText, setdateText] = useState({
    date: 'select date',
    time: 'select time',
  });
  const [load, setload] = useState(false);
  const [updateIndex, setupdateIndex] = useState('');
  const [showUpdate, setshowUpdate] = useState(false);

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

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      datetime: `${dateText.date + ' ' + dateText.time}`,
      item_type: item_type,
      items: itemArr,
      executive_manager: executive_manager,
      finance_manager: finance_manager,
      requested_by: requested_by,
    };

    const config = {
      headers: {Token: token},
    };

    submitApi.request(body, config);
  };
  const updateForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      disposal_id: route.params.id,
      user_id: user.userid,
      datetime: `${dateText.date + ' ' + dateText.time}`,
      item_type: item_type,
      items: itemArr,
      executive_manager: executive_manager,
      finance_manager: finance_manager,
      requested_by: requested_by,
    };

    const config = {
      headers: {Token: token},
    };
    updateApi.request(body, config);
  };

  submitApi.data?.status && navigation.navigate('Disposal Listings');
  updateApi.data?.status && navigation.navigate('Disposal Listings');

  const getDisposalRequestDetails = async () => {
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

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <Text style={[{fontSize: 20, fontWeight: '600'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>On the day of</Text>
        <View style={{marginTop: 15}}>
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
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
              {dateText.date != 'select date'
                ? new Date(dateText.date).toLocaleDateString('en-GB')
                : dateText.date}
            </Text>

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
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>At</Text>
          <TouchableOpacity
            onPress={() => setstartopen2(true)} //
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              borderRadius: 5,
              borderBottomWidth: 1,
              borderBottomColor: 'grey',
            }}>
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>{dateText.time}</Text>
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
            open={startopen2}
            date={startDate2}
            mode="time"
            onConfirm={date => {
              setstartopen2(false);
              setStartDate2(date);
              setdateText({
                ...dateText,
                time:
                  (date.getHours() < 10
                    ? `0${date.getHours()}`
                    : date.getHours()) +
                  ':' +
                  (date.getMinutes() < 10
                    ? `0${date.getMinutes()}`
                    : date.getMinutes()),
              });
            }}
            onCancel={() => {
              setstartopen2(false);
            }}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Equipment Type </Text>
          <TouchableOpacity
            onPress={() =>
              setitem_type(
                item_type !== 'Medical Supplies' ? 'Medical Supplies' : null,
              )
            }
            style={{flexDirection: 'row', marginTop: 15}}>
            {item_type == 'Medical Supplies' ? (
              <Fontisto
                name="radio-btn-active"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            ) : (
              <Fontisto
                name="radio-btn-passive"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            )}
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>Medical Supplies</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setitem_type(item_type !== 'Equipment' ? 'Equipment' : null)
            }
            style={{flexDirection: 'row', marginTop: 15}}>
            {item_type == 'Equipment' ? (
              <Fontisto
                name="radio-btn-active"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            ) : (
              <Fontisto
                name="radio-btn-passive"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            )}
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>Equipment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setitem_type(item_type !== 'Device' ? 'Device' : null)
            }
            style={{flexDirection: 'row', marginTop: 15}}>
            {item_type == 'Device' ? (
              <Fontisto
                name="radio-btn-active"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            ) : (
              <Fontisto
                name="radio-btn-passive"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            )}
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>Device</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setitem_type(item_type !== 'Other' ? 'Other' : null)}
            style={{flexDirection: 'row', marginTop: 15}}>
            {item_type == 'Other' ? (
              <Fontisto
                name="radio-btn-active"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            ) : (
              <Fontisto
                name="radio-btn-passive"
                size={20}
                style={styles.radio_icon}
                color="#0321a4"
              />
            )}
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>Other</Text>
          </TouchableOpacity>
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
                  note: '',
                  type: '',
                  quantity: 0,
                  description: '',
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
                          note: '',
                          type: '',
                          quantity: 0,
                          description: '',
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
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>note</Text>
                    <TextInput
                      style={[styles.input]}
                      value={item.note}
                      onChangeText={text => setitem({...item, note: text})}
                    />
                  </View>

                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>type</Text>
                    <TextInput
                      style={[styles.input]}
                      value={item.type}
                      onChangeText={text => setitem({...item, type: text})}
                    />
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>quantity</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={[styles.input]}
                      value={item.quantity}
                      onChangeText={text => setitem({...item, quantity: text})}
                    />
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
                      description
                    </Text>
                    <TextInput
                      style={[styles.input]}
                      value={item.description}
                      onChangeText={text =>
                        setitem({...item, description: text})
                      }
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
                            note: '',
                            type: '',
                            quantity: 0,
                            description: '',
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
                            note: '',
                            type: '',
                            quantity: 0,
                            description: '',
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
        <Text style={[{fontSize: 20, fontWeight: '600', marginTop: 14}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
          Whereas, it is Unusable and irreparable.
        </Text>
        <View>
          <Text style={[{fontSize: 18, fontWeight: '500', marginTop: 14}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
            Executive Manager
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setexecutive_manager({...executive_manager, name: text})
              }
              value={executive_manager.name}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setexecutive_manager({...executive_manager, signature: text})
              }
              value={executive_manager.signature}
            />
          </View>
        </View>
        <View>
          <Text style={[{fontSize: 18, fontWeight: '500', marginTop: 14}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
            Finance Manager
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setfinance_manager({...finance_manager, name: text})
              }
              value={finance_manager.name}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setfinance_manager({...finance_manager, signature: text})
              }
              value={finance_manager.signature}
            />
          </View>
        </View>
        <View>
          <Text style={[{fontSize: 18, fontWeight: '500', marginTop: 14}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
            Requested By
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setrequested_by({...requested_by, name: text})
              }
              value={requested_by.name}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setrequested_by({...requested_by, signature: text})
              }
              value={requested_by.signature}
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

export default DisposalReport;

const styles = StyleSheet.create({
  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey', color: Themes == 'dark' ? '#000' : '#000'
  },
  input_title: {fontSize: 14, fontWeight: '500', color: Themes == 'dark' ? '#000' : '#000'},
  input_top_margin: {marginTop: 15},
  radio_icon: {
    marginRight: 5,
    color: GlobalStyle.orange,
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
  modal_btn_txt: {
    color: 'white',
    padding: 10,
    fontWeight: '700',
  },
});

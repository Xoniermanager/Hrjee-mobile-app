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
import React, {useState, useEffect, useContext} from 'react';
import GlobalStyle from '../../../../../reusable/GlobalStyle';
import paymentRequestApi from '../../../../../../api/paymentRequest';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useApi from '../../../../../../api/useApi';
import {EssContext} from '../../../../../../Context/EssContext';
import {useFocusEffect} from '@react-navigation/native';
import Themes from '../Acknowledgement/Acknowledgement';

let {width} = Dimensions.get('window');

const PaymentRequest = ({navigation, route}) => {
  const theme = useColorScheme();

  const {user} = useContext(EssContext);
  const submitApi = useApi(paymentRequestApi.submit);
  const getDetailsApi = useApi(paymentRequestApi.getDetails);
  const updateApi = useApi(paymentRequestApi.updateDetails);

  useEffect(() => {
    getPaymentRequestDetails();
  }, []);

  route.params.update &&
    useFocusEffect(
      React.useCallback(() => {
        getDetailsApi.data
          ? (setinputVal({
              amount: getDetailsApi.data.data.amount,
              currency: getDetailsApi.data.data.currency,
              amount_in_words: getDetailsApi.data.data.amount_in_words,
              details: getDetailsApi.data.data.details,
              beneficiary: getDetailsApi.data.data.beneficiary,
              pay_in: getDetailsApi.data.data.pay_in,
              beneficiary_name: getDetailsApi.data.data.beneficiary_name,
              beneficiary_bank: getDetailsApi.data.data.beneficiary_bank,
              account_no: getDetailsApi.data.data.account_no,
              requested_by: getDetailsApi.data.data.request_by,
              title: getDetailsApi.data.data.title,
              department: getDetailsApi.data.data.department,
              signature: getDetailsApi.data.data.signature,
            }),
            setattachmentArr(JSON.parse(getDetailsApi.data.data.attachments)),
            setpaymentMethod(getDetailsApi.data.data.pay_in))
          : null;
      }, [getDetailsApi.loading]),
    );

  const [paymentMethod, setpaymentMethod] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [startopen2, setstartopen2] = useState(false);
  const [startDate2, setStartDate2] = useState(new Date());

  const [startopen3, setstartopen3] = useState(false);
  const [startDate3, setStartDate3] = useState(new Date());
  const [load, setload] = useState(false);
  const [showUpdate, setshowUpdate] = useState(false);
  const [updateIndex, setupdateIndex] = useState('');
  const [inputVal, setinputVal] = useState({
    amount: getDetailsApi.data ? getDetailsApi.data?.data?.amount : 0,
    currency: '',
    amount_in_words: '',
    details: '',
    beneficiary: '',
    pay_in: '',
    beneficiary_name: '',
    beneficiary_bank: '',
    account_no: '',
    requested_by: '',
    title: '',
    department: '',
    signature: '',
  });
  const [dateText, setdateText] = useState({
    text1: 'select date',
  });

  const [attachment, setattachment] = useState({
    notes: '',
    amount: 0,
    doc_date: '',
    doc_invoice: '',
    doc_po: '',
  });

  let [attachmentArr, setattachmentArr] = useState([]);

  const deleteAttachment = index => {
    attachmentArr.splice(index, 1);
    setattachmentArr(attachmentArr);
    setload(!load);
  };

  const updateAttachment = index => {
    setupdateIndex(index);
    setshowUpdate(true);
    setModalVisible(true);
    setattachment(attachmentArr[index]);
    setStartDate3(new Date(attachmentArr[index].doc_date));
  };

  const getPaymentRequestDetails = async () => {
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

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      amount: inputVal.amount,
      currency: inputVal.currency,
      amount_in_words: inputVal.amount_in_words,
      details: inputVal.details,
      beneficiary: inputVal.beneficiary,
      pay_in: paymentMethod,
      beneficiary_name: inputVal.beneficiary_name,
      beneficiary_bank: inputVal.beneficiary_bank,
      account_no: inputVal.account_no,
      attachments: attachmentArr,
      requested_by: inputVal.requested_by,
      title: inputVal.title,
      department: inputVal.department,
      signature: inputVal.signature,
    };
    console.log(body);
    const config = {
      headers: {Token: token},
    };

    submitApi.request(body, config);
    setinputVal({
      amount: 0,
      currency: '',
      amount_in_words: '',
      details: '',
      beneficiary: '',
      pay_in: '',
      beneficiary_name: '',
      beneficiary_bank: '',
      account_no: '',
      requested_by: '',
      title: '',
      department: '',
      signature: '',
    });
    setattachmentArr([]);
  };

  const updateForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      payment_id: route.params.id,
      amount: inputVal.amount,
      currency: inputVal.currency,
      amount_in_words: inputVal.amount_in_words,
      details: inputVal.details,
      beneficiary: inputVal.beneficiary,
      pay_in: paymentMethod,
      beneficiary_name: inputVal.beneficiary_name,
      beneficiary_bank: inputVal.beneficiary_bank,
      account_no: inputVal.account_no,
      attachments: attachmentArr,
      requested_by: inputVal.requested_by,
      title: inputVal.title,
      department: inputVal.department,
      signature: inputVal.signature,
    };
    console.log(body);
    const config = {
      headers: {Token: token},
    };
    updateApi.request(body, config);
  };

  submitApi.data?.status && navigation.navigate('Payment Listings');
  updateApi.data?.status && navigation.navigate('Payment Listings');

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Amount</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, amount: text})}
            value={inputVal.amount}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Currency</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, currency: text})}
            value={inputVal.currency}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Ammount in Words</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({...inputVal, amount_in_words: text})
            }
            value={inputVal.amount_in_words}
          />
        </View>

        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Details</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, details: text})}
            value={inputVal.details}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{    color: Themes == 'dark' ? '#000' : '#000'}}>Please Pay in : </Text>
          <View>
            <TouchableOpacity
              onPress={() =>
                setpaymentMethod(paymentMethod !== 'Cash' ? 'Cash' : null)
              }
              style={{flexDirection: 'row', marginTop: 15}}>
              {paymentMethod == 'Cash' ? (
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
              <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setpaymentMethod(
                  paymentMethod !== 'Check Dated' ? 'Check Dated' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 15}}>
              {paymentMethod == 'Check Dated' ? (
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
              <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>Check Dated</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setpaymentMethod(
                  paymentMethod !== 'Bank Transfer' ? 'Bank Transfer' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 15}}>
              {paymentMethod == 'Bank Transfer' ? (
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
              <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>Bank Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
        {paymentMethod == 'Bank Transfer' ? (
          <View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Beneficiary</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  setinputVal({...inputVal, beneficiary: text})
                }
                value={inputVal.beneficiary}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Beneficiary Bank</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  setinputVal({...inputVal, beneficiary_bank: text})
                }
                value={inputVal.beneficiary_bank}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Beneficiary Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  setinputVal({...inputVal, beneficiary_name: text})
                }
                value={inputVal.beneficiary_name}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Account No.</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text =>
                  setinputVal({...inputVal, account_no: text})
                }
                value={inputVal.account_no}
              />
            </View>
          </View>
        ) : null}

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={[{fontSize: 16, fontWeight: '500'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
              Add Attachments
            </Text>
            <Pressable
              onPress={() => {
                setModalVisible(!modalVisible);
                setshowUpdate(false);
                setattachment({
                  notes: '',
                  amount: 0,
                  doc_date: `${startDate3.getFullYear()}-${
                    startDate3.getMonth() + 1
                  }-${startDate3.getDate()}`,
                  doc_invoice: '',
                  doc_po: '',
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
                      Add Attachments
                    </Text>
                    <Pressable onPress={() => setModalVisible(!modalVisible)}>
                      <AntDesign
                        name="close"
                        style={{fontSize: 24, color: '#cd181f'}}
                      />
                    </Pressable>
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>Notes</Text>
                    <TextInput
                      style={[styles.input]}
                      value={attachment.notes}
                      onChangeText={text =>
                        setattachment({...attachment, notes: text})
                      }
                    />
                  </View>
                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
                      Amount (SR)
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '60%',
                      }}>
                      <TextInput
                        style={[styles.input, {width: '40%'}]}
                        keyboardType="numeric"
                        value={attachment.amount}
                        onChangeText={text =>
                          setattachment({...attachment, amount: text})
                        }
                      />
                      {/* <TextInput
                        style={[styles.input, {width: '40%'}]}
                        keyboardType="numeric"
                        // value={company}
                        // onChangeText={text => setcompany(text)}
                      /> */}
                    </View>
                  </View>

                  <View style={{marginTop: 15}}>
                    <Text style={styles.input_title}>Document Date</Text>
                    <TouchableOpacity
                      onPress={() => setstartopen3(true)} //
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 15,
                        borderRadius: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: 'grey',
                      }}>
                      <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
                        {new Date(startDate3).toISOString().substring(0, 10)}
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
                      modal
                      open={startopen3}
                      date={startDate3}
                      mode="date"
                      onConfirm={date => {
                        setstartopen3(false);
                        setStartDate3(date);
                        setattachment({
                          ...attachment,
                          doc_date: `${date.getFullYear()}-${
                            date.getMonth() + 1
                          }-${date.getDate()}`,
                        });
                      }}
                      onCancel={() => {
                        setstartopen3(false);
                      }}
                    />
                  </View>

                  <View>
                    <Text style={[{fontSize: 15, marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
                      Document No.
                    </Text>
                    <View style={{width: '100%'}}>
                      <TextInput
                        style={[styles.input, {width: '40%'}]}
                        keyboardType="numeric"
                        placeholder="PO"
                        placeholderTextColor={theme=='dark'?'#000':'#000'}
                        value={attachment.doc_po}
                        onChangeText={text =>
                          setattachment({...attachment, doc_po: text})
                        }
                      />
                      <TextInput
                        style={[styles.input, {width: '40%'}]}
                        keyboardType="numeric"
                        placeholder="Invoice"
                        placeholderTextColor={theme=='dark'?'#000':'#000'}
                        value={attachment.doc_invoice}
                        onChangeText={text =>
                          setattachment({...attachment, doc_invoice: text})
                        }
                      />
                    </View>
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
                          attachmentArr.splice(updateIndex, 1);
                          setattachmentArr([...attachmentArr, attachment]);
                          setattachment({
                            notes: '',
                            amount: 0,
                            doc_date: '',
                            doc_invoice: '',
                            doc_po: '',
                          });
                          setModalVisible(false);
                        }}
                        style={{backgroundColor: '#0e664e', borderRadius: 5}}>
                        <Text style={styles.modal_btn_txt}>Update</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setattachmentArr([...attachmentArr, attachment]);
                          setattachment({
                            notes: '',
                            amount: 0,
                            doc_date: '',
                            doc_invoice: '',
                            doc_po: '',
                          });
                          setModalVisible(false);
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

          {attachmentArr
            ? attachmentArr.map((i, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#0043ae15',
                    //   borderWidth: 1,
                    //   borderColor: '#0043ae',
                    padding: 15,
                    marginTop: 10,
                    borderRadius: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 13, fontWeight: '500'}}>
                    {i.notes}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: 60,
                    }}>
                    <AntDesign
                      name="edit"
                      onPress={() => updateAttachment(index)}
                      style={{fontSize: 20, color: '#0043ae'}}
                    />
                    <AntDesign
                      name="delete"
                      onPress={() => deleteAttachment(index)}
                      style={{fontSize: 20, color: '#cd181f'}}
                    />
                  </View>
                </View>
              ))
            : null}
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Requested By</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({...inputVal, requested_by: text})
            }
            value={inputVal.requested_by}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, title: text})}
            value={inputVal.title}
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
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Signature</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, signature: text})}
            value={inputVal.signature}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={[{fontSize: 20, fontWeight: '600'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
            Executive Manager
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput style={styles.input} />
          </View>
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
              <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>{new Date(startDate).toISOString().substring(0, 10)}</Text>
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
              }}
              onCancel={() => {
                setstartopen(false);
              }}
            />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={[{fontSize: 20, fontWeight: '600'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>Finance Manager</Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Date</Text>
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
              <Text>{new Date(startDate2).toISOString().substring(0, 10)}</Text>
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
              mode="date"
              onConfirm={date => {
                setstartopen2(false);
                setStartDate2(date);
              }}
              onCancel={() => {
                setstartopen2(false);
              }}
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

export default PaymentRequest;

const styles = StyleSheet.create({
  input_title: {marginBottom: 3, fontSize: 14, fontWeight: '500',     color: Themes == 'dark' ? '#000' : '#000'
},
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
    borderBottomColor: 'grey',     color: Themes == 'dark' ? '#000' : '#000'

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

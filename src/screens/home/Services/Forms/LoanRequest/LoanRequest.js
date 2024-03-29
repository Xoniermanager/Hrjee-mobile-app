import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import GlobalStyle from '../../../../../reusable/GlobalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../../reusable/apiUrl';
import axios from 'axios';
import {EssContext} from '../../../../../../Context/EssContext';
import useApi from '../../../../../../api/useApi';
import loanRequestApi from '../../../../../../api/loanRequest';
import {useFocusEffect} from '@react-navigation/native';
import Themes from '../Acknowledgement/Acknowledgement';

const LoanRequest = ({navigation, route}) => {
  const theme = useColorScheme();

  const {user} = useContext(EssContext);
  const submitApi = useApi(loanRequestApi.submit);
  const getDetailsApi = useApi(loanRequestApi.getDetails);
  const updateApi = useApi(loanRequestApi.updateDetails);

  useEffect(() => {
    getLoanRequestDetails();
  }, []);

  route.params.update &&
    useFocusEffect(
      React.useCallback(() => {
        if (getDetailsApi.data) {
          const previous_loan = JSON.parse(
            getDetailsApi.data.data.previous_loan,
          );
          const additional_loan = JSON.parse(
            getDetailsApi.data.data.additional_loan,
          );
          const total_loan = JSON.parse(getDetailsApi.data.data.total_loan);
          const acknowledgement = JSON.parse(
            getDetailsApi.data.data.acknowledgement,
          );

          setemployee_info({
            job_title: getDetailsApi.data.data.job_title,
            mobile: getDetailsApi.data.data.mobile,
            name: getDetailsApi.data.data.name,
            management: getDetailsApi.data.data.management,
            signature: getDetailsApi.data.data.signature,
            date: getDetailsApi.data.data.date,
          });
          setdateText({
            text1: getDetailsApi.data.data.date
              ? new Date(getDetailsApi.data.data.date)
                  .toISOString()
                  .substring(0, 10)
              : 'select date',

            text2: previous_loan.installment_start_date
              ? new Date(previous_loan.installment_start_date)
                  .toISOString()
                  .substring(0, 10)
              : 'select date',

            text3: previous_loan.installment_end_date
              ? new Date(previous_loan.installment_end_date)
                  .toISOString()
                  .substring(0, 10)
              : 'select date',
            text4: additional_loan.installment_start_date
              ? new Date(additional_loan.installment_start_date)
                  .toISOString()
                  .substring(0, 10)
              : 'select date',
            text5: additional_loan.installment_end_date
              ? new Date(additional_loan.installment_end_date)
                  .toISOString()
                  .substring(0, 10)
              : 'select date',
            text6: total_loan.installment_start_date
              ? new Date(total_loan.installment_start_date)
                  .toISOString()
                  .substring(0, 10)
              : 'select date',
            text7: total_loan.installment_end_date
              ? new Date(total_loan.installment_end_date)
                  .toISOString()
                  .substring(0, 10)
              : 'select date',
            text8: acknowledgement.date
              ? new Date(acknowledgement.date).toISOString().substring(0, 10)
              : 'select date',
          });
          setloan_info({
            loan_amount: getDetailsApi.data.data.loan_amount,
            total_salary: getDetailsApi.data.data.total_salary,
            reason: getDetailsApi.data.data.reason,
            amount_in_words: getDetailsApi.data.data.amount_in_words,
            installment_method: getDetailsApi.data.data.installment_method,
          });
          setprevious_loan({
            loan_amount: previous_loan.loan_amount,
            monthly_installment: previous_loan.monthly_installment,
          });
          setadditional_loan({
            loan_amount: additional_loan.loan_amount,
            monthly_installment: additional_loan.monthly_installment,
          });
          settotal_loan({
            loan_amount: total_loan.loan_amount,
            monthly_installment: total_loan.monthly_installment,
          });
          setacknowledgement({
            amount: acknowledgement.amount,
            name: acknowledgement.name,
            signature: acknowledgement.signature,
          });
        }
      }, [getDetailsApi.loading]),
    );

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [startopen2, setstartopen2] = useState(false);
  const [startDate2, setStartDate2] = useState(new Date());

  const [startopen3, setstartopen3] = useState(false);
  const [startDate3, setStartDate3] = useState(new Date());

  const [startopen4, setstartopen4] = useState(false);
  const [startDate4, setStartDate4] = useState(new Date());

  const [startopen5, setstartopen5] = useState(false);
  const [startDate5, setStartDate5] = useState(new Date());

  const [startopen6, setstartopen6] = useState(false);
  const [startDate6, setStartDate6] = useState(new Date());

  const [startopen7, setstartopen7] = useState(false);
  const [startDate7, setStartDate7] = useState(new Date());

  const [startopen8, setstartopen8] = useState(false);
  const [startDate8, setStartDate8] = useState(new Date());

  const [startopen9, setstartopen9] = useState(false);
  const [startDate9, setStartDate9] = useState(new Date());

  const [startopen10, setstartopen10] = useState(false);
  const [startDate10, setStartDate10] = useState(new Date());

  const [startopen11, setstartopen11] = useState(false);
  const [startDate11, setStartDate11] = useState(new Date());

  const [ceoApproval, setceoApproval] = useState('');
  const [executiveApproval, setexecutiveApproval] = useState('');

  const [finance, setfinance] = useState(false);
  const [loading, setloading] = useState(false);

  const [dateText, setdateText] = useState({
    text1: 'select date',
    text2: 'select date',
    text3: 'select date',
    text4: 'select date',
    text5: 'select date',
    text6: 'select date',
    text7: 'select date',
    text8: 'select date',
  });

  const [employee_info, setemployee_info] = useState({
    job_title: '',
    mobile: '',
    name: '',
    management: '',
    signature: '',
    date: '',
  });

  const [loan_info, setloan_info] = useState({
    loan_amount: '',
    total_salary: '',
    reason: '',
    amount_in_words: '',
    installment_method: '',
  });

  const [previous_loan, setprevious_loan] = useState({
    loan_amount: '',
    monthly_installment: '',
    installment_start_date: '',
    installment_end_date: '',
  });

  const [additional_loan, setadditional_loan] = useState({
    loan_amount: '',
    monthly_installment: '',
    installment_start_date: '',
    installment_end_date: '',
  });

  const [total_loan, settotal_loan] = useState({
    loan_amount: '',
    monthly_installment: '',
    installment_start_date: '',
    installment_end_date: '',
  });

  const [acknowledgement, setacknowledgement] = useState({
    amount: '',
    name: '',
    signature: '',
    date: '',
  });

  const apply = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {
      user_id: user.userid,
      employee_info: {
        job_title: employee_info.job_title,
        mobile: employee_info.mobile,
        name: employee_info.name,
        management: employee_info.management,
        signature: employee_info.signature,
        date: dateText.text1 == 'select date' ? '' : dateText.text1,
      },
      loan_info: {
        loan_amount: loan_info.loan_amount,
        total_salary: loan_info.total_salary,
        reason: loan_info.reason,
        amount_in_words: loan_info.amount_in_words,
        installment_method: loan_info.installment_method,
      },
      previous_loan: {
        loan_amount: previous_loan.loan_amount,
        monthly_installment: previous_loan.monthly_installment,
        installment_start_date:
          dateText.text2 == 'select date' ? '' : dateText.text2,
        installment_end_date:
          dateText.text3 == 'select date' ? '' : dateText.text3,
      },
      additional_loan: {
        loan_amount: additional_loan.loan_amount,
        monthly_installment: additional_loan.monthly_installment,
        installment_start_date:
          dateText.text4 == 'select date' ? '' : dateText.text4,
        installment_end_date:
          dateText.text5 == 'select date' ? '' : dateText.text5,
      },
      total_loan: {
        loan_amount: additional_loan.loan_amount,
        monthly_installment: additional_loan.monthly_installment,
        installment_start_date:
          dateText.text6 == 'select date' ? '' : dateText.text6,
        installment_end_date:
          dateText.text7 == 'select date' ? '' : dateText.text7,
      },
      acknowledgement: {
        amount: acknowledgement.amount,
        name: acknowledgement.name,
        signature: acknowledgement.signature,
        date: dateText.text8 == 'select date' ? '' : dateText.text8,
      },
    };
    submitApi.request(body, config);
  };

  const getLoanRequestDetails = async () => {
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

  const updateForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      loan_id: route.params.id,
      user_id: user.userid,
      employee_info: {
        job_title: employee_info.job_title,
        mobile: employee_info.mobile,
        name: employee_info.name,
        management: employee_info.management,
        signature: employee_info.signature,
        date: dateText.text1 == 'select date' ? '' : dateText.text1,
      },
      loan_info: {
        loan_amount: loan_info.loan_amount,
        total_salary: loan_info.total_salary,
        reason: loan_info.reason,
        amount_in_words: loan_info.amount_in_words,
        installment_method: loan_info.installment_method,
      },
      previous_loan: {
        loan_amount: previous_loan.loan_amount,
        monthly_installment: previous_loan.monthly_installment,
        installment_start_date:
          dateText.text2 == 'select date' ? '' : dateText.text2,
        installment_end_date:
          dateText.text3 == 'select date' ? '' : dateText.text3,
      },
      additional_loan: {
        loan_amount: additional_loan.loan_amount,
        monthly_installment: additional_loan.monthly_installment,
        installment_start_date:
          dateText.text4 == 'select date' ? '' : dateText.text4,
        installment_end_date:
          dateText.text5 == 'select date' ? '' : dateText.text5,
      },
      total_loan: {
        loan_amount: additional_loan.loan_amount,
        monthly_installment: additional_loan.monthly_installment,
        installment_start_date:
          dateText.text6 == 'select date' ? '' : dateText.text6,
        installment_end_date:
          dateText.text7 == 'select date' ? '' : dateText.text7,
      },
      acknowledgement: {
        amount: acknowledgement.amount,
        name: acknowledgement.name,
        signature: acknowledgement.signature,
        date: dateText.text8 == 'select date' ? '' : dateText.text8,
      },
    };
    console.log(body);
    const config = {
      headers: {Token: token},
    };
    updateApi.request(body, config);
  };

  submitApi.data?.status && navigation.navigate('Listings');
  updateApi.data?.status && navigation.navigate('Listings');

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View>
          <Text style={[{fontSize: 20, fontWeight: '600'}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
            1. Employee Information
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Job title</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setemployee_info({...employee_info, job_title: text})
              }
              value={employee_info.job_title}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setemployee_info({...employee_info, mobile: text})
              }
              value={employee_info.mobile}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setemployee_info({...employee_info, name: text})
              }
              value={employee_info.name}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Management</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setemployee_info({...employee_info, management: text})
              }
              value={employee_info.management}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setemployee_info({...employee_info, signature: text})
              }
              value={employee_info.signature}
            />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Start date</Text>
            <TouchableOpacity
              onPress={() => setstartopen(true)}
              style={styles.date}>
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
        </View>
        <View>
          <Text style={[{fontSize: 20, fontWeight: '600', marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
            2. Loan Information
          </Text>

          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Loan Amount</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setloan_info({...loan_info, loan_amount: text})
              }
              value={loan_info.loan_amount}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Total Salary</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setloan_info({...loan_info, total_salary: text})
              }
              value={loan_info.total_salary}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Reason</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setloan_info({...loan_info, reason: text})}
              value={loan_info.reason}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Amount in Words</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setloan_info({...loan_info, amount_in_words: text})
              }
              value={loan_info.amount_in_words}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Installments Method</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setloan_info({...loan_info, installment_method: text})
              }
              value={loan_info.installment_method}
            />
          </View>
        </View>
        <View>
          <Text style={[{fontSize: 20, fontWeight: '600', marginTop: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
            3. Finance Review
          </Text>
          <View>
            <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
              Previous Loan Amount
            </Text>
            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>
                Installments Beginning Date
              </Text>
              <TouchableOpacity
                onPress={() => setstartopen2(true)} //
                style={styles.date}>
                <Text>{dateText.text2}</Text>
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
                open={startopen2}
                date={startDate2}
                theme='light'
                mode="date"
                onConfirm={date => {
                  setstartopen2(false);
                  setStartDate2(date);
                  setdateText({
                    ...dateText,
                    text2: date.toISOString().substring(0, 10),
                  });
                }}
                onCancel={() => {
                  setstartopen2(false);
                }}
              />
            </View>
            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>Final Installments Date</Text>

              <TouchableOpacity
                onPress={() => setstartopen3(true)} //
                style={styles.date}>
                <Text>{dateText.text3}</Text>
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
                open={startopen3}
                date={startDate3}
                mode="date"
                onConfirm={date => {
                  setstartopen3(false);
                  setStartDate3(date);
                  setdateText({
                    ...dateText,
                    text3: date.toISOString().substring(0, 10),
                  });
                }}
                onCancel={() => {
                  setstartopen3(false);
                }}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Monthly Installments</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  setprevious_loan({
                    ...previous_loan,
                    monthly_installment: text,
                  })
                }
                value={previous_loan.monthly_installment}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Loan Amount</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  setprevious_loan({...previous_loan, loan_amount: text})
                }
                value={previous_loan.loan_amount}
              />
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={[{fontSize: 20, fontWeight: '400', marginTop: 12}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
              Additional Loan Amount
            </Text>
            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>
                Installments Beginning Date
              </Text>

              <TouchableOpacity
                onPress={() => setstartopen4(true)} //
                style={styles.date}>
                <Text>{dateText.text4}</Text>
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
                open={startopen4}
                date={startDate4}
                mode="date"
                onConfirm={date => {
                  setstartopen4(false);
                  setStartDate4(date);
                  setdateText({
                    ...dateText,
                    text4: date.toISOString().substring(0, 10),
                  });
                }}
                onCancel={() => {
                  setstartopen4(false);
                }}
              />
            </View>
            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>Final Installments Date</Text>
              <TouchableOpacity
                onPress={() => setstartopen5(true)} //
                style={styles.date}>
                <Text>{dateText.text5}</Text>
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
                open={startopen5}
                date={startDate5}
                mode="date"
                onConfirm={date => {
                  setstartopen5(false);
                  setStartDate5(date);
                  setdateText({
                    ...dateText,
                    text5: date.toISOString().substring(0, 10),
                  });
                }}
                onCancel={() => {
                  setstartopen5(false);
                }}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Monthly Installments</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  setadditional_loan({
                    ...additional_loan,
                    monthly_installment: text,
                  })
                }
                value={additional_loan.monthly_installment}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Loan Amount</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  setadditional_loan({...additional_loan, loan_amount: text})
                }
                value={additional_loan.loan_amount}
              />
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={[{fontSize: 20, fontWeight: '400', marginTop: 12}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
              Total Amount
            </Text>
            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>
                Installments Beginning Date
              </Text>
              <TouchableOpacity
                onPress={() => setstartopen6(true)} //
                style={styles.date}>
                <Text>{dateText.text6}</Text>
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
                open={startopen6}
                date={startDate6}
                mode="date"
                onConfirm={date => {
                  setstartopen6(false);
                  setStartDate6(date);
                  setdateText({
                    ...dateText,
                    text6: date.toISOString().substring(0, 10),
                  });
                }}
                onCancel={() => {
                  setstartopen6(false);
                }}
              />
            </View>
            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>Final Installments Date</Text>

              <TouchableOpacity
                onPress={() => setstartopen7(true)} //
                style={styles.date}>
                <Text>{dateText.text7}</Text>
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
                open={startopen7}
                date={startDate7}
                mode="date"
                onConfirm={date => {
                  setstartopen7(false);
                  setStartDate7(date);
                  setdateText({
                    ...dateText,
                    text7: date.toISOString().substring(0, 10),
                  });
                }}
                onCancel={() => {
                  setstartopen7(false);
                }}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Monthly Installments</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  settotal_loan({...total_loan, monthly_installment: text})
                }
                value={total_loan.monthly_installment}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Loan Amount</Text>
              <TextInput
                style={styles.input}
                onChangeText={text =>
                  settotal_loan({...total_loan, loan_amount: text})
                }
                value={total_loan.loan_amount}
              />
            </View>
          </View>
          {/* <View style={styles.input_top_margin}>
            <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
              Finance Manager
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setfinance(!finance)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {finance ? (
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
                <Text>Approved</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setfinance(!finance)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!finance ? (
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
                <Text>Not Approved</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
              <View style={styles.input_top_margin}>
                <Text style={styles.input_title}>Notes</Text>
                <TextInput style={styles.input} />
              </View>
              <View style={{marginTop: 15}}>
                <Text style={styles.input_title}>Date</Text>
                <TouchableOpacity
                  onPress={() => setstartopen8(true)} //
                  style={styles.date}>
                  <Text>
                    {new Date(startDate8).toISOString().substring(0, 10)}
                  </Text>
                  <AntDesign
                    name="calendar"
                    size={20}
                    style={styles.radio_icon}
                    color="#0321a4"
                  />
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={startopen8}
                  date={startDate8}
                  mode="date"
                  onConfirm={date => {
                    setstartopen8(false);
                    setStartDate8(date);
                  }}
                  onCancel={() => {
                    setstartopen8(false);
                  }}
                />
              </View>

              <View style={styles.input_top_margin}>
                <Text style={styles.input_title}>Signature</Text>
                <TextInput style={styles.input} />
              </View>
              <View style={styles.input_top_margin}>
                <Text style={styles.input_title}>Name</Text>
                <TextInput style={styles.input} />
              </View>
            </View>
          </View> */}
        </View>
        {/* <View>
          <Text style={{fontSize: 20, fontWeight: '600', marginTop: 20}}>
            4. Approval
          </Text>
          <View>
            <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
              CEO’s Approval
            </Text>
            <TouchableOpacity
              onPress={() =>
                setceoApproval(ceoApproval !== 'approve' ? 'approve' : null)
              }
              style={{flexDirection: 'row', marginTop: 20}}>
              <Text style={{marginRight: 10}}>
                I approve this loan to be paid during:
              </Text>
              {ceoApproval == 'approve' ? (
                <Fontisto
                  name="checkbox-active"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="checkbox-passive"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setceoApproval(
                  ceoApproval !== 'disapprove' ? 'disapprove' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 20}}>
              <Text style={{marginRight: 10}}>I disapprove because:</Text>
              {ceoApproval == 'disapprove' ? (
                <Fontisto
                  name="checkbox-active"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="checkbox-passive"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setceoApproval(ceoApproval !== 'postpone' ? 'postpone' : null)
              }
              style={{flexDirection: 'row', marginTop: 20}}>
              <Text style={{marginRight: 10}}>Postpone the loan for: </Text>
              {ceoApproval == 'postpone' ? (
                <Fontisto
                  name="checkbox-active"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="checkbox-passive"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
            </TouchableOpacity>
            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>Date</Text>
              <TouchableOpacity
                onPress={() => setstartopen9(true)} //
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                  borderRadius: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'grey',
                }}>
                <Text>
                  {new Date(startDate9).toISOString().substring(0, 10)}
                </Text>
                <AntDesign
                  name="calendar"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              </TouchableOpacity>
              <DatePicker
                modal
                open={startopen9}
                date={startDate9}
                mode="date"
                onConfirm={date => {
                  setstartopen9(false);
                  setStartDate9(date);
                }}
                onCancel={() => {
                  setstartopen9(false);
                }}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Signature:</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <View>
            <Text style={{fontSize: 20, fontWeight: '400', marginTop: 30}}>
              Executive Manager’s Approval
            </Text>
            <TouchableOpacity
              onPress={() =>
                setexecutiveApproval(
                  executiveApproval !== 'approve' ? 'approve' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 20}}>
              <Text style={{marginRight: 10}}>
                I approve this loan to be paid during:
              </Text>
              {executiveApproval == 'approve' ? (
                <Fontisto
                  name="checkbox-active"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="checkbox-passive"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setexecutiveApproval(
                  executiveApproval !== 'disapprove' ? 'disapprove' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 20}}>
              <Text style={{marginRight: 10}}>I disapprove because:</Text>
              {executiveApproval == 'disapprove' ? (
                <Fontisto
                  name="checkbox-active"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="checkbox-passive"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setexecutiveApproval(
                  executiveApproval !== 'postpone' ? 'postpone' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 20}}>
              <Text style={{marginRight: 10}}>Postpone the loan for: </Text>
              {executiveApproval == 'postpone' ? (
                <Fontisto
                  name="checkbox-active"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="checkbox-passive"
                  size={18}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
            </TouchableOpacity>

            <Text style={{marginTop: 15}}>
              Note: The Executive Manager’s approval allows a one-month salary
              only. Anything above this amount must be approved by the CEO
            </Text>

            <View style={{marginTop: 15}}>
              <Text style={styles.input_title}>Date</Text>
              <TouchableOpacity
                onPress={() => setstartopen10(true)} //
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 15,
                  borderRadius: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: 'grey',
                }}>
                <Text>
                  {new Date(startDate10).toISOString().substring(0, 10)}
                </Text>
                <AntDesign
                  name="calendar"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              </TouchableOpacity>
              <DatePicker
                modal
                open={startopen10}
                date={startDate10}
                mode="date"
                onConfirm={date => {
                  setstartopen10(false);
                  setStartDate10(date);
                }}
                onCancel={() => {
                  setstartopen10(false);
                }}
              />
            </View>
            <View style={styles.input_top_margin}>
              <Text style={styles.input_title}>Signature:</Text>
              <TextInput style={styles.input} />
            </View>
          </View>
        </View> */}
        <View>
          <Text style={{fontSize: 20, fontWeight: '600', marginTop: 20}}>
            5. Acknowledgement
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>
              I am the under signed affirm that I have received the amount of:
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setacknowledgement({...acknowledgement, amount: text})
              }
              value={acknowledgement.amount}
            />
            <Text style={[styles.input_title, {marginTop: 10}]}>
              SR. as a loan to be paid as a.m. info or as the internal company
              procedure’s or as baptizing.
            </Text>
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setacknowledgement({...acknowledgement, name: text})
              }
              value={acknowledgement.name}
            />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Signature:</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                setacknowledgement({...acknowledgement, signature: text})
              }
              value={acknowledgement.signature}
            />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Date</Text>
            <TouchableOpacity
              onPress={() => setstartopen11(true)} //
              style={styles.date}>
              <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>{dateText.text8}</Text>
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
              open={startopen11}
              date={startDate11}
              mode="date"
              onConfirm={date => {
                setstartopen11(false);
                setStartDate11(date);
                setdateText({
                  ...dateText,
                  text8: date.toISOString().substring(0, 10),
                });
              }}
              onCancel={() => {
                setstartopen11(false);
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
          <TouchableOpacity style={[styles.btn_style]} onPress={apply}>
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

export default LoanRequest;

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
    borderBottomColor: 'grey',
    color: Themes == 'dark' ? '#000' : '#000'
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
  date: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
});

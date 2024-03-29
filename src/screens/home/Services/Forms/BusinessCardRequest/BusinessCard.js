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
import React, { useState, useContext, useEffect } from 'react';
import GlobalStyle from '../../../../../reusable/GlobalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import useApi from '../../../../../../api/useApi';
import BusinessCardRequest from '../../../../../../api/BusinessCardRequest';
import { EssContext } from '../../../../../../Context/EssContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Themes from '../Acknowledgement/Acknowledgement';

const BusinessCard = ({ navigation }) => {
  const theme = useColorScheme();

  const { user } = useContext(EssContext);

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const submitApi = useApi(BusinessCardRequest.submit);
  const getDetailsApi = useApi(BusinessCardRequest.getDetails);

  useEffect(() => {
    getBusinessCardDetails();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (getDetailsApi.data?.data) {
        console.log('date===', getDetailsApi.data);
        setinputVal({
          user_id: user.userid,
          emp_no: getDetailsApi.data.data.emp_no,
          job_title: getDetailsApi.data.data.job_title,
          department: getDetailsApi.data.data.department,
          name: getDetailsApi.data.data.name,
          busi_job_title: getDetailsApi.data.data.busi_job_title,
          mobile: getDetailsApi.data.data.mobile,
          phone: getDetailsApi.data.data.phone,
          extension: getDetailsApi.data.data.extension,
          fax: getDetailsApi.data.data.fax,
          email: getDetailsApi.data.data.email,
          direct_manager: getDetailsApi.data.data.direct_manager,
          employee: getDetailsApi.data.data.employee,
          executive_manager: getDetailsApi.data.data.executive_manager,
          hr_manager: getDetailsApi.data.data.hr_manager,
          requested_by: getDetailsApi.data.data.requested_by,
        });
        setdateTxt({
          txt1: getDetailsApi.data.data.card_date,
        });
      }
    }, [getDetailsApi.loading]),
  );

  const getBusinessCardDetails = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };
    getDetailsApi.request(
      {
        user_id: user.userid,
      },
      config,
    );
  };

  const [dateTxt, setdateTxt] = useState({
    txt1: 'select date',
  });

  const [inputVal, setinputVal] = useState({
    user_id: user.userid,
    emp_no: '',
    requested_by: '',
    job_title: '',
    department: '',
    name: '',
    busi_job_title: '',
    mobile: '',
    phone: '',
    extension: '',
    fax: '',
    email: '',
    direct_manager: '',
    employee: '',
    executive_manager: '',
    hr_manager: '',
    card_date: dateTxt.txt1,
  });

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      emp_no: inputVal.emp_no,
      job_title: inputVal.job_title,
      department: inputVal.department,
      name: inputVal.name,
      busi_job_title: inputVal.busi_job_title,
      mobile: inputVal.mobile,
      phone: inputVal.phone,
      extension: inputVal.extension,
      fax: inputVal.fax,
      email: inputVal.email,
      direct_manager: inputVal.direct_manager,
      employee: inputVal.employee,
      executive_manager: inputVal.executive_manager,
      hr_manager: inputVal.hr_manager,
      requested_by: inputVal.requested_by,
      card_date: dateTxt.txt1 == 'select date' ? '' : dateTxt.txt1,
    };
    console.log('bdy-->', body);
    const config = {
      headers: { Token: token },
    };
    submitApi.request(body, config);
  };

  if (submitApi.data?.status) {
    alert('Form submitted!');
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
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
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
              {dateTxt.txt1 != 'select date'
                ? new Date(dateTxt.txt1).toLocaleDateString('en-GB')
                : dateTxt.txt1}
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
              setdateTxt({
                ...dateTxt,
                txt1: date.toISOString().substring(0, 10),
              });
            }}
            onCancel={() => {
              setstartopen(false);
            }}
          />
        </View>
        <Text
          style={[
            styles.input_top_margin,
            { fontSize: 18, fontWeight: '600', marginTop: 30 },
          ]}>
          Employee's Information
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Requested by</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({ ...inputVal, requested_by: text })
            }
            value={inputVal.requested_by}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee No.</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, emp_no: text })}
            value={inputVal.emp_no}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Job Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, job_title: text })}
            value={inputVal.job_title}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Department</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, department: text })}
            value={inputVal.department}
          />
        </View>
        <Text
          style={[
            styles.input_top_margin,
            { fontSize: 18, fontWeight: '600', marginTop: 30 },
          ]}>
          Kindly make my business cards according to the following details
          below.
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, name: text })}
            value={inputVal.name}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Job Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({ ...inputVal, busi_job_title: text })
            }
            value={inputVal.busi_job_title}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Mobile</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, mobile: text })}
            value={inputVal.mobile}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Phone</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, phone: text })}
            value={inputVal.phone}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Extension</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, extension: text })}
            value={inputVal.extension}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Fax</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, fax: text })}
            value={inputVal.fax}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, email: text })}
            value={inputVal.email}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Direct Manager</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({ ...inputVal, direct_manager: text })
            }
            value={inputVal.direct_manager}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, employee: text })}
            value={inputVal.employee}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Executive Manager</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({ ...inputVal, executive_manager: text })
            }
            value={inputVal.executive_manager}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Hr Manager</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({ ...inputVal, hr_manager: text })}
            value={inputVal.hr_manager}
          />
        </View>
        <TouchableOpacity style={[styles.btn_style]} onPress={submitForm}>
          {submitApi.loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BusinessCard;

const styles = StyleSheet.create({
  input_title: { marginBottom: 3, fontSize: 14, fontWeight: '500', color: Themes == 'dark' ? '#000' : '#000' },
  input_top_margin: { marginTop: 15, color: Themes == 'dark' ? '#000' : '#000'} ,
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
});

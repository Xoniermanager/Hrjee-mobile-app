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
import DatePicker from 'react-native-date-picker';
import useApi from '../../../../../../api/useApi';
let {width} = Dimensions.get('window');
import EffectiveDateNoticeApi from '../../../../../../api/EffectiveDateNotice';
import {EssContext} from '../../../../../../Context/EssContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Themes from '../Acknowledgement/Acknowledgement';

const EffectiveDateNotice = ({navigation}) => {
  const theme = useColorScheme();

  const {user} = useContext(EssContext);
  const submitApi = useApi(EffectiveDateNoticeApi.submit);
  const getDetailsApi = useApi(EffectiveDateNoticeApi.getDetails);

  useEffect(() => {
    getEffectiveNoticeDetails();
  }, []);

  const [dateTxt, setdateTxt] = useState({
    txt1: 'select date',
  });

  useFocusEffect(
    React.useCallback(() => {
      console.log('getDetailsApi.data->', getDetailsApi.data);
      if (getDetailsApi.data?.status == 1) {
        console.log('first--->', getDetailsApi.data);
        // const signature = JSON.parse(getDetailsApi.data.data.signature);
        setinputVal({
          name: getDetailsApi.data.data.name,
          emp_no: getDetailsApi.data.data.emp_no,
          department: getDetailsApi.data.data.department,
          division: getDetailsApi.data.data.division,
          section: getDetailsApi.data.data.section,
          emp_signature: getDetailsApi.data.data.emp_signature,
        });
        setdateTxt({
          txt1:
            getDetailsApi.data.data.effective_date == ''
              ? 'select date'
              : getDetailsApi.data.data.effective_date,
        });
      }
    }, [getDetailsApi.loading]),
  );

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [inputVal, setinputVal] = useState({
    name: '',
    emp_no: '',
    department: '',
    division: '',
    section: '',
    emp_signature: '',
  });

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      user_id: user.userid,
      name: inputVal.name,
      emp_no: inputVal.emp_no,
      department: inputVal.department,
      division: inputVal.division,
      section: inputVal.section,
      effective_date: dateTxt.txt1 == 'select date' ? '' : dateTxt.txt1,
      emp_signature: inputVal.emp_signature,
    };
    console.log('bdy-->', body);
    const config = {
      headers: {Token: token},
    };

    submitApi.request(body, config);
  };

  if (submitApi.data?.status) {
    alert('Form submitted!');
    navigation.goBack();
  }

  const getEffectiveNoticeDetails = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    getDetailsApi.request(
      {
        user_id: user.userid,
      },
      config,
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Name </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, name: text})}
            value={inputVal.name}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Employee Number </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, emp_no: text})}
            value={inputVal.emp_no}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Department </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, department: text})}
            value={inputVal.department}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Division </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, division: text})}
            value={inputVal.division}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Section </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, section: text})}
            value={inputVal.section}
          />
        </View>
        <View style={styles.input_top_margin}>
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
            <Text>
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
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Employee’s Signature </Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({...inputVal, emp_signature: text})
            }
            value={inputVal.emp_signature}
          />
        </View>

        <TouchableOpacity style={[styles.btn_style]} onPress={submitForm}>
          {submitApi.loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EffectiveDateNotice;

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

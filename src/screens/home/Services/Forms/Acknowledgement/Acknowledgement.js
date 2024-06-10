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
import {EssContext} from '../../../../../../Context/EssContext';
import acknowledgement from '../../../../../../api/acknowledgement';
import useApi from '../../../../../../api/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Themes from '../Acknowledgement/Acknowledgement';


const Acknowledgement = ({navigation}) => {
  const theme = useColorScheme();

  const {user} = useContext(EssContext);

  const submitApi = useApi(acknowledgement.submit);
  const getDetailsApi = useApi(acknowledgement.getDetails);

  useEffect(() => {
    getAcknowlwdgementDetails();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (getDetailsApi.data?.status == 1) {
        const signature = JSON.parse(getDetailsApi.data.data.signature);
        setinputVal({
          user_id: getDetailsApi.data.data.user_id,
          full_name: getDetailsApi.data.data.full_name,
          nationality: getDetailsApi.data.data.nationality,
          ref_id_no: getDetailsApi.data.data.ref_id_no,
        }),
          setsignature({
            name: signature.name,
            signature: signature.signature,
          }),
          setdateTxt({
            txt1:
              getDetailsApi.data.data.form_date == ''
                ? 'select date'
                : getDetailsApi.data.data.form_date,
            txt2:
              getDetailsApi.data.data.contract_date == ''
                ? 'select date'
                : getDetailsApi.data.data.contract_date,
            txt3: signature.date == '' ? 'select date' : signature.date,
          });
      }
    }, [getDetailsApi.loading]),
  );

  const [startopen, setstartopen] = useState(false);
  const [startopen2, setstartopen2] = useState(false);
  const [startopen3, setstartopen3] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [startDate3, setStartDate3] = useState(new Date());

  const [dateTxt, setdateTxt] = useState({
    txt1: 'select date',
    txt2: 'select date',
    txt3: 'select date',
  });

  const [inputVal, setinputVal] = useState({
    form_date: dateTxt.txt1 == 'select date' ? '' : dateTxt.txt1,
    contract_date: dateTxt.txt2 == 'select date' ? '' : dateTxt.txt2,
    user_id: user.userid,
    full_name: '',
    nationality: '',
    ref_id_no: '',
  });
  const [signature, setsignature] = useState({
    name: '',
    date: dateTxt.txt3 == 'select date' ? '' : dateTxt.txt3,
    signature: '',
  });

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = {
      form_date: dateTxt.txt1,
      user_id: inputVal.user_id,
      full_name: inputVal.full_name,
      nationality: inputVal.nationality,
      ref_id_no: inputVal.ref_id_no,
      contract_date: dateTxt.txt2,
      signature: {
        name: signature.name,
        date: dateTxt.txt3 == 'select date' ? '' : dateTxt.txt3,
        signature: signature.signature,
      },
    };
    const config = {
      headers: {Token: token},
    };

    submitApi.request(body, config);
  };

  if (submitApi.data?.status) {
    alert('Form submitted!');
    navigation.goBack();
  }

  const getAcknowlwdgementDetails = async () => {
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

  // console.log('dt-->', dateTxt.txt1);

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 25}}>
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
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee number</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, user_id: text})}
            value={inputVal.user_id}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>I</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, full_name: text})}
            value={inputVal.full_name}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Nationality</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, nationality: text})}
            value={inputVal.nationality}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Aadhaar no.</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setinputVal({...inputVal, ref_id_no: text})}
            value={inputVal.ref_id_no}
          />
        </View>
        <Text style={[{marginVertical: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
          Issued in Riyadh acknowledge that I received all the entitlements and
          amounts that are due to me and all my rights of all types resulting
          from my rights of all types resulting from my contract until the date
          of
        </Text>
        <View style={{}}>
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
            <Text style={{color: Themes == 'dark' ? '#000' : '#000'}}>
              {dateTxt.txt2 != 'select date'
                ? new Date(dateTxt.txt2).toLocaleDateString('en-GB')
                : dateTxt.txt2}
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
            open={startopen2}
            date={startDate2}
            mode="date"
            onConfirm={date => {
              setstartopen2(false);
              setStartDate2(date);
              setdateTxt({
                ...dateTxt,
                txt2: date.toISOString().substring(0, 10),
              });
            }}
            onCancel={() => {
              setstartopen2(false);
            }}
          />
        </View>
        <Text style={[{marginVertical: 20}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
          Whether the source is basic or additional salaries, allowances in cash
          or any other kind, additional working hours, annual leave, period of
          warning or compensation, or any other ordinary or extraordinary
          source. Accordingly, I am absolving Kayes Establishment of a
          comprehensive and irrevocable discharge of any right or claim, current
          or future, of any kind or form whatsoever.
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setsignature({...signature, name: text})}
            value={signature.name}
          />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Date</Text>
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
              {dateTxt.txt3 != 'select date'
                ? new Date(dateTxt.txt3).toLocaleDateString('en-GB')
                : dateTxt.txt3}
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
            open={startopen3}
            date={startDate3}
            mode="date"
            onConfirm={date => {
              setstartopen3(false);
              setStartDate3(date);
              setdateTxt({
                ...dateTxt,
                txt3: date.toISOString().substring(0, 10),
              });
            }}
            onCancel={() => {
              setstartopen3(false);
            }}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Signature</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setsignature({...signature, signature: text})}
            value={signature.signature}
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

export default Acknowledgement;

const styles = StyleSheet.create({
  input_title: {marginBottom: 3, fontSize: 14, fontWeight: '500', color: Themes == 'dark' ? '#000' : '#000' },
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
});

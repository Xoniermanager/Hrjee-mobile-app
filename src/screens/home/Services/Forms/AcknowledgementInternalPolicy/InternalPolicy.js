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
import {EssContext} from '../../../../../../Context/EssContext';
import acknowledgementInternalPolicy from '../../../../../../api/acknowledgementInternalPolicy';
import useApi from '../../../../../../api/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Themes from '../Acknowledgement/Acknowledgement';

const InternalPolicy = ({navigation}) => {
  const theme = useColorScheme();

  const {user} = useContext(EssContext);

  const submitApi = useApi(acknowledgementInternalPolicy.submit);
  const getDetailsApi = useApi(acknowledgementInternalPolicy.getDetails);

  useEffect(() => {
    getAcknowlwdgementDetails();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (getDetailsApi.data?.status == 1) {
        console.log('first--->', getDetailsApi.data);
        const signature = JSON.parse(getDetailsApi.data.data.signature);
        setinputVal({
          user_id: user.userid,
          full_name: getDetailsApi.data.data.full_name,
          nationality: getDetailsApi.data.data.nationality,
          ref_id_no: getDetailsApi.data.data.ref_id_no,
          signature: {
            name: signature.name,
            date: signature.date == '' ? 'select date' : signature.date,
            signature: signature.signature,
          },
        });
      }
    }, [getDetailsApi.loading]),
  );

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [inputVal, setinputVal] = useState({
    user_id: user.userid,
    full_name: '',
    nationality: '',
    ref_id_no: '',
    signature: {
      name: '',
      date: 'select date',
      signature: '',
    },
  });

  const submitForm = async () => {
    const token = await AsyncStorage.getItem('Token');
    const body = inputVal;
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

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View style={{}}>
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
        <Text style={[{marginTop: 15}, {color: Themes == 'dark' ? '#000' : '#000'}]}>
          I have received and read the internal policy for kayes trading
          Establishment no.(735756), that was Approved by the ministry of labour
          and social development on 08/06/2020.
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({
                ...inputVal,
                signature: {...inputVal.signature, name: text},
              })
            }
            value={inputVal.signature.name}
          />
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
            <Text>{inputVal.signature.date}</Text>
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
              setinputVal({
                ...inputVal,
                signature: {
                  ...inputVal.signature,
                  date: date.toISOString().substring(0, 10),
                },
              });
            }}
            onCancel={() => {
              setstartopen(false);
            }}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Signature</Text>
          <TextInput
            style={styles.input}
            onChangeText={text =>
              setinputVal({
                ...inputVal,
                signature: {...inputVal.signature, signature: text},
              })
            }
            value={inputVal.signature.signature}
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

export default InternalPolicy;

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
});

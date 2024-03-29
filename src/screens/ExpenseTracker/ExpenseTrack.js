import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import GlobalStyle from '../../reusable/GlobalStyle';
import {Dropdown} from 'react-native-element-dropdown';
import DocumentPicker from 'react-native-document-picker';
let {width, height} = Dimensions.get('window');
import apiUrl from '../../reusable/apiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EssContext} from '../../../Context/EssContext';
import expenseTrackApi from '../../../api/expenseTrack';
import useApi from '../../../api/useApi';
import {useFocusEffect} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

const expenseTrack = ({navigation, route}) => {
  const {user} = useContext(EssContext);

  const [startopen, setstartopen] = useState(false);
  const [date, setdate] = useState(new Date());

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [singleFile, setSingleFile] = useState(undefined);
  const [modalVisibleImgUp, setModalVisibleImgUp] = useState(false);
  const [amount, setamount] = useState('');
  const [dateText, setdateText] = useState('select date');
  const [loading, setloading] = useState(false);

  //Loan Request
  const getDetailsApi = useApi(expenseTrackApi.getDetails);

  useEffect(() => {
    getExpenseDetails();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (getDetailsApi.data && route.params.id) {
        console.log('getDetailsApi.data==>', getDetailsApi.data);
        const fileNameArr = getDetailsApi.data.data?.thumb?.split('/');
        const fileName = fileNameArr
          ? fileNameArr[fileNameArr.length - 1]
          : null;
        setamount(getDetailsApi.data.data?.amount);
        setValue({
          label: getDetailsApi.data.data?.type,
          value: getDetailsApi.data.data?.type,
        });
        setdateText(
          getDetailsApi.data.data?.expense_date == ''
            ? 'select date'
            : getDetailsApi.data.data?.expense_date,
        );
        setSingleFile([{fileName: fileName}]);

        console.log('filename-->', fileName);
        // console.log(
        //   'getDetailsApi.data.data.items===>',
        //   getDetailsApi.data.data.type,
        // );
      }
    }, [getDetailsApi.loading]),
  );

  console.log('singleFile-->', singleFile);

  const getExpenseDetails = async () => {
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

  const data = [
    {label: 'Dine', value: 'Dine'},
    {label: 'Entertainment', value: 'Entertainment'},
    {
      label: 'Gift',
      value: 'Gift',
    },
    {
      label: 'Transport',
      value: 'Transport',
    },
    {
      label: 'Marketing',
      value: 'Marketing',
    },
  ];

  const selectFile = () => {
    const options = {
      title: 'Select Image',
      quality: 0.1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.error) {
      } else {
        console.log('response-->', response);
        setSingleFile(response.assets);
      }
    });
  };

  const submit = async () => {
    // console.log('dateText--->', dateText);
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    // Check if any file is selected or not
    if (
      singleFile != undefined &&
      value != null &&
      amount != '' &&
      dateText != 'select date'
    ) {
      // If file selected then create FormData
      const fileToUpload = singleFile;
      console.log('fileToUpload->', fileToUpload[0]);
      const data = new FormData();
      data.append('user_id', user.userid);
      data.append('attachment', {
        uri: fileToUpload[0].uri,
        name: fileToUpload[0].fileName,
        type: fileToUpload[0].type,
      });
      data.append('amount', amount);
      data.append('expense_date', dateText == 'select date' ? '' : dateText);
      data.append('type', value.value);
      // Please change file upload URL
      let res = await fetch(`${apiUrl}/api/user_add_expens`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Token: token,
        },
      });

      let responseJson = await res;
      // console.log('res img->', responseJson);
      if (responseJson.status == 200) {
        setloading(false);
        alert('submitted Successfully');
        navigation.goBack();
      } else {
        setloading(false);
        // alert(responseJson.message);
      }
    } else {
      setloading(false);
      // If no file selected the show alert
      if (value == null) {
        alert('Please Select expense type');
      } else if (singleFile == null || singleFile == undefined) {
        alert('Upload reciept');
      } else if (amount == '') {
        alert('add amount');
      } else if (dateText == 'select date') {
        alert('select date');
      }
    }
  };

  const update = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    // Check if any file is selected or not
    if (singleFile != null || singleFile != undefined) {
      // If file selected then create FormData
      const fileToUpload = singleFile;
      console.log('fileToUpload->', fileToUpload[0]);
      const data = new FormData();
      data.append('user_id', user.userid);
      data.append('attachment', {
        uri: fileToUpload[0].uri,
        name: fileToUpload[0].fileName,
        type: fileToUpload[0].type,
      });
      data.append('amount', amount);
      data.append('expense_date', dateText == 'select date' ? '' : dateText);
      data.append('type', value.value);
      data.append('id', route.params.id);
      // Please change file upload URL
      let res = await fetch(`${apiUrl}/api/update_user_expense`, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
          Token: token,
        },
      });

      let responseJson = await res;
      // console.log('res img->', responseJson);
      if (responseJson.status == 200) {
        setloading(false);
        alert('Updated Successfully !');
        navigation.goBack();
      } else {
        setloading(false);
        // alert(responseJson.message);
      }
    } else {
      setloading(false);
      // If no file selected the show alert
      alert('Please Select File first');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{flex: 1, padding: 15}}>
        <View style={{}}>
          <Text style={{fontSize: 17, fontWeight: '600'}}>
            Please fill the required field to create expense
          </Text>
          <Dropdown
            data={data}
            labelField="label"
            valueField="value"
            value={value}
            onChange={item => {
              setValue({
                label: item.value,
                value: item.value,
              });
              setIsFocus(false);
            }}
            style={styles.dropdown}
            placeholder="Select Type"
            placeholderStyle={styles.placeholderStyle}
          />
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Enter amount</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              onChangeText={text => setamount(text)}
              value={amount}
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
              <Text>
                {dateText != 'select date'
                  ? new Date(dateText).toLocaleDateString('en-GB')
                  : dateText}
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
              open={startopen}
              date={date}
              mode="date"
              onConfirm={date => {
                setstartopen(false);
                setdate(date);
                setdateText(date.toISOString().substring(0, 10));
              }}
              onCancel={() => {
                setstartopen(false);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={selectFile}
            style={{
              backgroundColor: '#0043ae5',
              flexDirection: 'row',
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
              borderWidth: 1,
              borderColor: '#0043ae',
            }}>
            <AntDesign name="cloudupload" size={22} color="#0043ae" />
            <Text style={{color: '#0043ae', marginLeft: 10}}>Upload image</Text>
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
            {singleFile?.map((i, index) => (
              <Text key={index} style={{color: GlobalStyle.blueDark}}>
                {i.fileName}
              </Text>
            ))}
          </View>
        </View>
        {route.params.update ? (
          <TouchableOpacity style={[styles.btn_style]} onPress={update}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Update
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn_style]} onPress={submit}>
            {loading ? (
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

export default expenseTrack;

const styles = StyleSheet.create({
  input_title: {marginBottom: 3, fontSize: 14, fontWeight: '500'},
  input_top_margin: {marginTop: 15},

  input: {
    height: 45,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginTop: 15,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btn_style: {
    width: '100%',
    // position: 'relative',
    marginTop: 20,
    backgroundColor: GlobalStyle.blueDark,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

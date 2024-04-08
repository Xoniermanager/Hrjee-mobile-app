import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import { useNavigation } from '@react-navigation/native';

const AddPRM = () => {
  const theme = useColorScheme();
  const [value, setValue] = useState(null);
  const [loader, setLoader] = useState(false);
  const [reason, setReason] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [startdate, setStartDate] = useState(new Date());
  const [openstartdate, setOpenStartDate] = useState(false);
  const data_3 = [
    { label: 'Destroyed', value: '1' },
    { label: ' Hospitalised', value: '2' },
    { label: 'Nausea/vomiting ', value: '3' },
    { label: 'Refused', value: '4' },
    { label: ' Discontinued', value: '5' },
    { label: 'Other', value: '6' },
  ];

  return (
    <SafeAreaView style={
      styles.container
    }>
      <ScrollView style={{
        backgroundColor:
          '#fff'
      }}>

        <Text
          style={[
            styles.reportType,
            { color: '#fff' },
          ]}>

          Care Taker Name{' '}
        </Text>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={[styles.selectedTextStyle,]}
          data={data_3}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Item...' : '....'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setCareTaker(item.name);
            setIsFocus(false);
          }}
        />



        <Text
          style={[
            styles.reportType,
            { color: '#fff' },
          ]}>
          Time Taken
        </Text>
        <View style={styles.Date_box}>
          <Text>{startdate?.toISOString().split('T')[0]}</Text>
          <TouchableOpacity onPress={() => setOpenStartDate(true)}>
            <Text>add</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.reportType,
            { color: theme == '#fff', }

          ]}>
          Reason for variation
        </Text>
        <TextInput
          value={reason}
          placeholder="Reason..."
          style={styles.input_Text}
          onChangeText={prev => setReason(prev)}
        />


        <TouchableOpacity
          style={{
            width: 150,
            height: 40,
            backgroundColor: '#46D0C9',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginVertical: 10,
          }}
          onPress={() => AddList()}>
          {
            loader ? <ActivityIndicator size="small" color="#fff" /> :
              <Text style={{ color: '#fff' }}>Submit</Text>}
        </TouchableOpacity>
        <DatePicker
          modal
          open={openstartdate}
          date={startdate}
          mode="date"
          onConfirm={startdate => {
            setOpenStartDate(false);
            setStartDate(startdate);
            setTimeCheck(true)
            // getReport();
          }}
          onCancel={() => {
            setOpenStartDate(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default AddPRM;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Dashboard_Text: {
    fontSize: responsiveFontSize(2),
    marginHorizontal: 20,
    fontWeight: '700',
    marginVertical: 10,
  },
  check_box: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    backgroundColor: '#50C878',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Person_card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginHorizontal: 5,
  },
  card: {
    borderRadius: 10,
    // borderColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    // height: 92,
    // width: 90,
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
    color: '#000',
  },
  reportType: {
    color: '#37496E',
    marginHorizontal: 20,
    fontSize: responsiveFontSize(1.9),
    fontWeight: '500',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: responsiveFontSize(1.7),
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(1.9),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  input_Text: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  Date_box: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 15,
    height: 50,
    marginBottom: 5,
    width: responsiveWidth(90),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  addimage: {
    width: responsiveWidth(30),
    height: responsiveHeight(6),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image_show: {
    width: responsiveWidth(58),
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  qtn_box: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 15,
    width: responsiveWidth(90),
    alignSelf: 'center',
    // alignItems:"center",
    justifyContent: 'center'
  }
});





















import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';

const ItEquipmentRequest = () => {
  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [startopen2, setstartopen2] = useState(false);
  const [startDate2, setStartDate2] = useState(new Date());

  const [startopen3, setstartopen3] = useState(false);
  const [startDate3, setStartDate3] = useState(new Date());

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <Text style={{fontSize: 20, fontWeight: '600'}}>
          To be filled by the requesting party
        </Text>
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
            <Text>{new Date(startDate).toISOString().substring(0, 10)}</Text>
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
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee No.</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Division</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Brand/ Model</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Complaint/Defect</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Serial/ Engine No.</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Description</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Division Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee</Text>
          <TextInput style={styles.input} />
        </View>
        <Text style={{fontSize: 20, fontWeight: '600', marginTop: 15}}>
          To be filled by the IT Personnel
        </Text>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Inspection Date</Text>
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
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Last Repair Date</Text>
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
            <Text>{new Date(startDate3).toISOString().substring(0, 10)}</Text>
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
            }}
            onCancel={() => {
              setstartopen3(false);
            }}
          />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Last Repair Remarks</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Findings</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Recommendations</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Executive Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>IT Personnel</Text>
          <TextInput style={styles.input} />
        </View>
        <TouchableOpacity
          style={[styles.btn_style]}
          // onPress={() => navigation.navigate('Apply Leave')}
        >
          <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ItEquipmentRequest;

const styles = StyleSheet.create({
  input_title: {marginBottom: 3, fontSize: 14, fontWeight: '500'},
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

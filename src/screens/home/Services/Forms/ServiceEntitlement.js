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

const ServiceEntitlement = () => {
  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [startopen2, setstartopen2] = useState(false);
  const [startDate2, setStartDate2] = useState(new Date());

  const [startopen3, setstartopen3] = useState(false);
  const [startDate3, setStartDate3] = useState(new Date());
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
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
        <Text style={{fontSize: 20, fontWeight: '600', marginTop: 14}}>
          HR Review
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Employee No.</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Full Name</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>ID/ Iqama Number</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Job Title</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Division</Text>
          <TextInput style={styles.input} />
        </View>
        <View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Service Period from</Text>
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
            <Text style={styles.input_title}>to</Text>
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
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Work Leaving Reason</Text>
          <TextInput style={styles.input} />
        </View>
        <Text style={{fontSize: 20, fontWeight: '600', marginTop: 14}}>
          Salary Details And Other Allowances
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Transportation</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Housing</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Basic</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Others</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Total Salary</Text>
          <TextInput style={styles.input} />
        </View>
        <Text style={{fontSize: 20, fontWeight: '600', marginTop: 14}}>
          Entitlements
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Left Vacation Days</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Vacation Entitlements</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Last Business Days Salary</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Final Exit Ticket Cost</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>End of Service Entitlements</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Total</Text>
          <TextInput style={styles.input} />
        </View>
        <Text style={{fontSize: 20, fontWeight: '600', marginTop: 14}}>
          HR Manager Signature
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Left Loans</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Other Deductions</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Final Entitlements Total</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Executive Manager Signature</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>CFO Signature</Text>
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

export default ServiceEntitlement;

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

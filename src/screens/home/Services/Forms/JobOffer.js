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

const JobOffer = () => {
  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [startopen2, setstartopen2] = useState(false);
  const [startDate2, setStartDate2] = useState(new Date());

  const [startopen3, setstartopen3] = useState(false);
  const [startDate3, setStartDate3] = useState(new Date());

  const [startopen4, setstartopen4] = useState(false);
  const [startDate4, setStartDate4] = useState(new Date());

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View style={{}}>
          <Text style={styles.input_title}>Job Title</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Name</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Division</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>ID No.</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Department</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Nationality</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Expected Starting Date</Text>
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
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Issued From</Text>
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
        <Text style={{fontSize: 20, fontWeight: '600', marginTop: 15}}>
          Salary And Allowances
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Housing Allowances</Text>
          <TextInput style={styles.input} placeholder="Monthly" />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Transportation</Text>
          <TextInput style={styles.input} placeholder="Monthly" />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Total</Text>
          <TextInput style={styles.input} placeholder="Monthly" />
        </View>
        <Text style={{fontSize: 20, fontWeight: '600', marginTop: 15}}>
          Benefits and Other Terms
        </Text>
        <Text style={[styles.input_top_margin, {fontSize: 15}]}>
          Annual leave is (30) paid days for each (Gregorian) service year
          Tickets for non-Saudis according to the institution’s system Medical
          insurance according to the institution's system. The probation period
          is (90) days according to the Saudi labor system as of the date of
          starting work This offer is void if the work is not started on the
          date specified below or the sponsorship cannot be transferred
          according to the system This offer is a part of the employment
          contract that will be signed between the employee and the institution
          after the end of the sponsorship transfer procedures for the non-Saudi
          employee and after the end of the probation period according to the
          work system. This offer is final and replaces any previous agreements
          or negotiations.
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Executive Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Finance Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>HR Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <Text style={[styles.input_top_margin, {fontSize: 15}]}>
          I agree with the details of this offer, and I confirm that I am ready
          to start work on
        </Text>
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
        <Text style={[styles.input_top_margin, {fontSize: 15}]}>
          and abide by the above mentioned terms
        </Text>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Date</Text>
          <TouchableOpacity
            onPress={() => setstartopen4(true)} //
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              borderRadius: 5,
              borderBottomWidth: 1,
              borderBottomColor: 'grey',
            }}>
            <Text>{new Date(startDate4).toISOString().substring(0, 10)}</Text>
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
            open={startopen4}
            date={startDate4}
            mode="date"
            onConfirm={date => {
              setstartopen4(false);
              setStartDate4(date);
            }}
            onCancel={() => {
              setstartopen4(false);
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

export default JobOffer;

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

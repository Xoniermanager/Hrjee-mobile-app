import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
let {width} = Dimensions.get('window');

const TravelAllowance = () => {
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

  const [visa, setvisa] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <View style={{}}>
          <Text style={styles.input_title}>Employee No.</Text>
          <TextInput style={styles.input} />
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
          <Text style={styles.input_title}>Employee</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Job Title</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Department</Text>
          <TextInput style={styles.input} />
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Trip Reason</Text>
          <TextInput multiline style={styles.input} />
        </View>

        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Exit Entry visa:</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => setvisa(!visa)}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              {visa ? (
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
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setvisa(!visa)}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              {!visa ? (
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
              <Text>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{fontSize: 20, fontWeight: '600'}}>Internal Trip </Text>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Start date of the trip</Text>
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
            <Text style={styles.input_title}>End date of the trip</Text>
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
        <View style={{marginTop: 15}}>
          <Text style={{fontSize: 20, fontWeight: '600'}}>
            International Trip
          </Text>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Start date of the trip</Text>
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
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>End date of the trip</Text>
            <TouchableOpacity
              onPress={() => setstartopen5(true)} //
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
                borderRadius: 5,
                borderBottomWidth: 1,
                borderBottomColor: 'grey',
              }}>
              <Text>{new Date(startDate5).toISOString().substring(0, 10)}</Text>
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
              open={startopen5}
              date={startDate5}
              mode="date"
              onConfirm={date => {
                setstartopen5(false);
                setStartDate5(date);
              }}
              onCancel={() => {
                setstartopen5(false);
              }}
            />
          </View>
        </View>
        <Text style={{marginTop: 15}}>
          Travel allowance for one day based on internal regulations
        </Text>

        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Ticket cost</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Allowance trip cost</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Total Amount</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Remark</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Executive Manager</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Finance Manager</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Direct Manager</Text>
          <TextInput multiline style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Employee</Text>
          <TextInput multiline style={styles.input} />
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

export default TravelAllowance;

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
  modal_btn_txt: {
    color: 'white',
    padding: 10,
    fontWeight: '700',
  },
});

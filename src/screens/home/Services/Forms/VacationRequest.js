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

const VacationRequest = () => {
  const [vacationType, setvacationType] = useState('');

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
          <Text style={styles.input_title}>Vacation Request : </Text>
          <View>
            <TouchableOpacity
              onPress={() =>
                setvacationType(vacationType !== 'Annual' ? 'Annual' : null)
              }
              style={{flexDirection: 'row', marginTop: 15}}>
              {vacationType == 'Annual' ? (
                <Fontisto
                  name="radio-btn-active"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="radio-btn-passive"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
              <Text>Annual</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setvacationType(
                  vacationType !== 'Exceptional' ? 'Exceptional' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 15}}>
              {vacationType == 'Exceptional' ? (
                <Fontisto
                  name="radio-btn-active"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="radio-btn-passive"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
              <Text>Exceptional</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setvacationType(
                  vacationType !== 'Emergency' ? 'Emergency' : null,
                )
              }
              style={{flexDirection: 'row', marginTop: 15}}>
              {vacationType == 'Emergency' ? (
                <Fontisto
                  name="radio-btn-active"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              ) : (
                <Fontisto
                  name="radio-btn-passive"
                  size={20}
                  style={styles.radio_icon}
                  color="#0321a4"
                />
              )}
              <Text>Emergency</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Employee No.</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={{marginTop: 15}}>
          <Text style={styles.input_title}>Full Name</Text>
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
          <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
            I would like to get permitted for
          </Text>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>From</Text>
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
            <Text style={styles.input_title}>To</Text>
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
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Days</Text>
            <TextInput keyboardType="numeric" style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>
              My address during my vacation is
            </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Mobile no.</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Vacation Reason</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Date</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput style={styles.input} />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
            Direct Manager
          </Text>

          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Job Title</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Date</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput style={styles.input} />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
            Substitute
          </Text>
          <Text style={{marginTop: 5}}>
            I accept handling the mentioned work while he's in vacation
          </Text>

          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Name</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Job Title</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Date</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Signature</Text>
            <TextInput style={styles.input} />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
            HR Review
          </Text>
          <Text style={{marginTop: 5}}>The Requested Vacation </Text>

          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Disapproved (Reason)</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Approved</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>
              Vacation Balance Before Deduction
            </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>
              Vacation Balance After Deduction
            </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>HR Manager's Signature</Text>
            <TextInput style={styles.input} />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
            Decision
          </Text>

          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}>Executive Manager</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Finance Manager</Text>
            <TextInput style={styles.input} />
          </View>
        </View>
        <View style={{marginTop: 15}}>
          <Text style={{fontSize: 20, fontWeight: '400', marginTop: 12}}>
            Kindly Fill This Field After Returning From Vacation
          </Text>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Returning Date</Text>
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
            <Text style={styles.input_title}>HR Manager</Text>
            <TextInput keyboardType="numeric" style={styles.input} />
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.input_title}>Employee</Text>
            <TextInput style={styles.input} />
          </View>
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

export default VacationRequest;

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

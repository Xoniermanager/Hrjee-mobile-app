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

const ClearanceLetter = () => {
  const [military, setmilitary] = useState(false);
  const [medical, setmedical] = useState(false);
  const [logistics, setlogistics] = useState(false);
  const [environmental, setenvironmental] = useState(false);
  const [it, setit] = useState(false);
  const [finance, setfinance] = useState(false);
  const [hr, sethr] = useState(false);

  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <ScrollView>
        <Text style={{fontSize: 18, fontWeight: '600'}}>
          Employee Information
        </Text>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Employee Number </Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Employee Name </Text>
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
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Job Title </Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Division </Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}> Nationality </Text>
          <TextInput style={styles.input} />
        </View>
        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 30}}>
            Military Division
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Date </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Reason </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Division Manager </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setmilitary(!military)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {military ? (
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
                <Text>Cleared</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setmilitary(!military)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!military ? (
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
                <Text>Uncleared</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 30}}>
            Medical Division
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Date </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Reason </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Division Manager </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setmedical(!medical)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {medical ? (
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
                <Text>Cleared</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setmedical(!medical)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!medical ? (
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
                <Text>Uncleared</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 30}}>
            Logistics Division
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Date </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Reason </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Division Manager </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setlogistics(!logistics)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {logistics ? (
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
                <Text>Cleared</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setlogistics(!logistics)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!logistics ? (
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
                <Text>Uncleared</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 30}}>
            Environmental Division
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Date </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Reason </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Division Manager </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setenvironmental(!environmental)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {environmental ? (
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
                <Text>Cleared</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setenvironmental(!environmental)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!environmental ? (
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
                <Text>Uncleared</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 30}}>
            Information Technology Division
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Date </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Reason </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Division Manager </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setit(!it)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {it ? (
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
                <Text>Cleared</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setit(!it)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!it ? (
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
                <Text>Uncleared</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 30}}>
            Finance
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Date </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Reason </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Division Manager </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setfinance(!finance)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {finance ? (
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
                <Text>Cleared</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setfinance(!finance)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!finance ? (
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
                <Text>Uncleared</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Text style={{fontSize: 18, fontWeight: '600', marginTop: 30}}>
            Human Resources
          </Text>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Date </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Reason </Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.input_top_margin}>
            <Text style={styles.input_title}> Division Manager </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => sethr(!hr)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {hr ? (
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
                <Text>Cleared</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sethr(!hr)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {!hr ? (
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
                <Text>Uncleared</Text>
              </TouchableOpacity>
            </View>
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

export default ClearanceLetter;

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

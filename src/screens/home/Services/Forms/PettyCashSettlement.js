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

const PettyCashSettlement = () => {
  const [startopen, setstartopen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [startopen2, setstartopen2] = useState(false);
  const [startDate2, setStartDate2] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);

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
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Department</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Custody Total</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Expenses Total</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Net. of Petty Cash</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Beneficiary</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Reason</Text>
          <TextInput style={styles.input} />
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              Greetings, Kindly Approve The Following Amount Of Petty Cash:
            </Text>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="plus" style={{fontSize: 26, color: '#0043ae'}} />
            </Pressable>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 17, fontWeight: '500'}}>
                      Petty Cash
                    </Text>
                    <Pressable onPress={() => setModalVisible(!modalVisible)}>
                      <AntDesign
                        name="close"
                        style={{fontSize: 24, color: '#cd181f'}}
                      />
                    </Pressable>
                  </View>
                  <View>
                    <Text style={{fontSize: 15, marginTop: 20}}>
                      Discription
                    </Text>
                    <TextInput
                      style={[styles.input]}
                      // value={jobtitle}
                      // onChangeText={text => setjobtitle(text)}
                    />
                  </View>

                  <View style={{marginTop: 15}}>
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
                      <Text>
                        {new Date(startDate2).toISOString().substring(0, 10)}
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

                  <View>
                    <Text style={{fontSize: 15, marginTop: 20}}>Ammount</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '60%',
                      }}>
                      <TextInput
                        style={[styles.input, {width: '40%'}]}
                        keyboardType="numeric"
                        placeholder="SR"
                        // value={company}
                        // onChangeText={text => setcompany(text)}
                      />
                      <TextInput
                        style={[styles.input, {width: '40%'}]}
                        keyboardType="numeric"
                        placeholder="H"
                        // value={company}
                        // onChangeText={text => setcompany(text)}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 30,
                    }}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      style={{backgroundColor: '#cd181f', borderRadius: 5}}>
                      <Text style={styles.modal_btn_txt}>Close</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{backgroundColor: '#0e664e', borderRadius: 5}}>
                      <Text style={styles.modal_btn_txt}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <View
            style={{
              backgroundColor: '#0043ae15',
              //   borderWidth: 1,
              //   borderColor: '#0043ae',
              padding: 15,
              marginTop: 10,
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 13, fontWeight: '500'}}>Item 1</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 60,
              }}>
              <AntDesign
                name="edit"
                //   onPress={() => singleExperience(i.id)}
                style={{fontSize: 20, color: '#0043ae'}}
              />
              <AntDesign
                name="delete"
                //   onPress={() => deleteExperience(i.id)}
                style={{fontSize: 20, color: '#cd181f'}}
              />
            </View>
          </View>
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Executive Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Finance Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Dept. Manager</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.input_top_margin}>
          <Text style={styles.input_title}>Petty Holder</Text>
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

export default PettyCashSettlement;

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

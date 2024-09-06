import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import React, { useState, useContext } from 'react';
import GlobalStyle from '../../../reusable/GlobalStyle';
import { EssContext } from '../../../../Context/EssContext';
import { useFocusEffect } from '@react-navigation/native';
import apiUrl from '../../../reusable/apiUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PullToRefresh from '../../../reusable/PullToRefresh';
import Themes from '../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'
import Reload from '../../../../Reload';


const Support = ({ navigation }) => {
  const theme = useColorScheme();

  const [empty, setempty] = useState(false);

  const [complainList, setcomplainList] = useState();
  const [loading, setloading] = useState(false);

  // console.log("complainList......", complainList)

  useFocusEffect(
    React.useCallback(() => {
      get_complains();
    }, []),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_complains();
  };

  const get_complains = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: { Token: token },
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/api/complain`, body, config)
      .then(response => {
        setloading(false);
        // console.log('response', response.data);
        if (response.data.status == 1) {
          try {
            setcomplainList(response.data.content);
            response.data.content.length < 1 ? setempty(true) : setempty(false);
            // setrecentLogs(response.data.content);
          } catch (e) {
            setloading(false);
            // console.log(e);
          }
        } else {
          // console.log(response.data.msg);
          setloading(false);
        }
      })
      .catch(error => {

        setloading(false)
        if (error.response.status == '401') {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody: error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [Popup.hide(), AsyncStorage.removeItem('Token'),
            AsyncStorage.removeItem('UserData'),
            AsyncStorage.removeItem('UserLocation'),
            navigation.navigate('Login')]
          });
        }
      });
  };


  return (
    <>
      <Root>

        {empty && !loading && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}>
            <Image
              style={styles.tinyLogo}
              source={require('../../../images/nothingToShow.gif')}
            />
          </View>
        )}


        <ScrollView>
          <View
            style={{
              padding: 15,
              paddingTop: 0
            }}>
            <PullToRefresh onRefresh={handleRefresh}>
              {
                complainList?.map((i, index) => (
                  <View
                    key={index}
                    style={[
                      {
                        padding: 15,
                        backgroundColor: 'white',
                        marginTop: 20,
                        // marginBottom:
                        //   index == complainList.length - 1 ? 100 : 0,
                        borderRadius: 5,
                        width: '99.4%',
                      },
                      GlobalStyle.card,
                    ]}>
                    <View style={styles.separator}>
                      <Text style={styles.heading}>Subject:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{i.subject}</Text>
                    </View>
                    <View style={styles.separator}>
                      <Text style={styles.heading}>Comment:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{i.comment}</Text>
                    </View>
                    <View style={styles.separator}>
                      <Text style={styles.heading}>Created Date:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{i.created_date}</Text>
                    </View>
                    <View style={styles.separator}>
                      <Text style={styles.heading}>Status:</Text>
                      <Text style={{ color: Themes == 'dark' ? '#000' : '#000' }}>{i.feedback_status}</Text>
                    </View>
                  </View>
                ))
                  }
            </PullToRefresh>
            <View
              style={{
                left: 0,
                right: 0,
                bottom: 0,
                padding: 15
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Talk to us')}
                style={{
                  padding: 15,
                  backgroundColor: GlobalStyle.blueDark,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'white', fontWeight: '700' }}>
                  Talk to us
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>


        {loading && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}>
            <ActivityIndicator size="small" color="#388aeb" />
          </View>
        )}

      </Root>
    </>
  );
};

export default Support;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  heading: { fontWeight: '700', color: Themes == 'dark' ? '#000' : '#000' },
});
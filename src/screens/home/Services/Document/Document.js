import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  useColorScheme,
  SafeAreaView
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../../reusable/GlobalStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../reusable/apiUrl';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import PullToRefresh from '../../../../reusable/PullToRefresh';
import Themes from '../../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'

const Document = ({navigation}) => {
  const theme = useColorScheme();

  const [empty, setempty] = useState(false);
  const [doc, setdoc] = useState();
  const [loading, setloading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      get_documents();
    }, []),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    get_documents();
  };

  const get_documents = async () => {
    setloading(true);
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };

    const body = {};
    // console.log('body1mon----->', body);
    axios
      .post(`${apiUrl}/api/document`, body, config)
      .then(response => {
        setloading(false);
        console.log('response', response.data);
        if (response.data.status === 1) {
          try {
            // console.log(response.data.data);
            setloading(false);
            setdoc(response.data.data);
          } catch (e) {
            setloading(false);
            console.log(e);
          }
        } else {
          setloading(false);
          console.log(response.data.message);
        }
      })
      .catch(error => {
       
        setloading(false)
        if(error.response.status=='401')
        {
          Popup.show({
            type: 'Warning',
            title: 'Warning',
            button: true,
            textBody:error.response.data.msg,
            buttonText: 'Ok',
            callback: () => [Popup.hide(),AsyncStorage.removeItem('Token'),
            AsyncStorage.removeItem('UserData'),
            AsyncStorage.removeItem('UserLocation'),
           navigation.navigate('Login')]
          });
        }
      });
  };

  console.log('doc--->', doc);

  return (
    <>
      {doc && !loading && (
        <SafeAreaView  style={{flex: 1,}}>
          <Root>
        <View style={{flex: 1, backgroundColor: '#e3eefb', padding: 15}}>
          <PullToRefresh onRefresh={handleRefresh}>
            {doc?.map((i, index) => (
              <TouchableOpacity
                onPress={() =>
                  i.file
                    ? navigation.navigate('Document Details', {doc: i.file})
                    :   Popup.show({
                      type: 'Warning',
                      title: 'Warning',
                      button: true,
                      textBody:'folder is empty',
                      buttonText: 'Ok',
                      callback: () => [Popup.hide()]
                    })
                }
                key={index}
                style={[
                  {
                    marginTop: index == 0 ? 0 : 20,
                    padding: 15,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '99.3%',
                  },
                  GlobalStyle.card,
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <FontAwesome
                    name="file-pdf-o"
                    size={28}
                    color="red"
                    style={{marginRight: 10}}
                  />
                  <Text style={[{fontWeight: '600', fontSize: 16},{color: Themes == 'dark' ? '#000' : '#000' }]}>
                    {i.name}
                  </Text>
                </View>
                <AntDesign
                  name="rightcircle"
                  size={28}
                  color="#0043ae"
                  style={{marginRight: 5}}
                />
              </TouchableOpacity>
            ))}
          </PullToRefresh>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 15,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{
                padding: 15,
                backgroundColor: GlobalStyle.blueDark,
                borderRadius: 5,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: '700'}}>
                Back To Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </Root>
        </SafeAreaView>
      )}

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
    </>
  );
};

export default Document;

const styles = StyleSheet.create({
  btn_style: {
    width: '100%',
    marginTop: 30,
    backgroundColor: '#0321a4',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
});

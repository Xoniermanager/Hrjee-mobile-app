import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../reusable/GlobalStyle';
import {useFocusEffect, useEffect} from '@react-navigation/native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

import useApi from '../../../api/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EssContext} from '../../../Context/EssContext';
import expenseTrackApi from '../../../api/expenseTrack';
import PullToRefresh from '../../reusable/PullToRefresh';

let {width} = Dimensions.get('window');
const Listings = ({navigation, route}) => {
  const [loading, setloading] = useState(false);
  const {user} = useContext(EssContext);

  //Loan Request
  const getAllExpense = useApi(expenseTrackApi.getAll);
  const deleteExpense = useApi(expenseTrackApi.deleteForm);

  useFocusEffect(
    React.useCallback(() => {
      getExpensesFunc();
    }, []),
  );

  const openDoc = str => {
    setloading(true);
    const url = str;
    console.log(url);

    // this will split the whole url.
    const f2 = url.split('/');

    // then get the file name with extention.
    const fileName = f2[f2.length - 1];
    // const fileExtention = url.split(".")[3];

    // create a local file path from url
    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const options = {
      fromUrl: url,
      toFile: localFile,
    };

    // last step it will download open it with fileviewer.
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        setloading(false);
        // success
        // Here you can perform any of your completion tasks
      })
      .catch(error => {
        setloading(false);
        // error
      });
  };

  const getExpensesFunc = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    getAllExpense.request(
      {
        user_id: user.userid,
      },
      config,
    );
  };

  const deleteForm = async id => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    const body = {
      user_id: user.userid,
      id: id,
    };
    deleteExpense.request(body, config);
    getExpensesFunc();
  };

  const handleRefresh = async () => {
    // Do something to refresh the data
    getExpensesFunc();
  };

  console.log('response-->', getAllExpense.data);

  return (
    <View style={{flex: 1, backgroundColor: '#e3eefb'}}>
      {getAllExpense.loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      )}
      {getAllExpense.error && alert(getAllExpense.error)}

      <PullToRefresh onRefresh={handleRefresh}>
        {getAllExpense.data?.data?.map((i, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              backgroundColor: '#e3eefb',
              paddingHorizontal: 15,
              paddingVertical: 1,
            }}>
            <View
              style={[
                {
                  // backgroundColor: 'pink',
                  marginTop: 20,
                  borderRadius: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom:
                    index == getAllExpense.data?.data?.length - 1 ? 200 : 0,
                },
                styles.card,
              ]}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={styles.tinyLogo}
                  source={
                    i.thumb
                      ? {uri: i.thumb}
                      : require('../../images/default-img.png')
                  }
                />
                <View style={{padding: 10}}>
                  <Text style={{fontSize: 18, fontWeight: '600'}}>
                    {i.type}
                  </Text>
                  <Text
                    style={{fontSize: 13, fontWeight: '500', color: 'grey'}}>
                    {i.expense_date != 'select date'
                      ? new Date(i.expense_date).toLocaleDateString('en-GB')
                      : i.expense_date}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      marginTop: 15,
                      fontWeight: '600',
                      color: 'red',
                    }}>
                    ₹ {i.amount}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  width: 110,
                }}>
                <AntDesign
                  name="eyeo"
                  onPress={() =>
                    i.thumb ? openDoc(i.thumb) : alert('image does not exist')
                  }
                  style={{fontSize: 22, color: 'green', mrginRight: 5}}
                />
                <AntDesign
                  name="edit"
                  onPress={() =>
                    navigation.navigate('expenseTrack', {
                      update: true,
                      id: i.id,
                    })
                  }
                  style={{fontSize: 22, color: '#0043ae', mrginRight: 5}}
                />
                <AntDesign
                  name="delete"
                  onPress={() =>
                    Alert.alert(
                      '',
                      'Are you sure you want to delete expense?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {text: 'OK', onPress: () => deleteForm(i.id)},
                      ],
                    )
                  }
                  style={{fontSize: 22, color: '#cd181f'}}
                />
              </View>
            </View>
          </View>
        ))}
      </PullToRefresh>
      {getAllExpense.data?.data.length == 0 && (
        <View style={styles.emptyContainer}>
          <Image
            style={styles.tinyLogo}
            source={require('../../images/emptyForm.gif')}
          />
        </View>
      )}

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 15,
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('expenseTrack', {update: false})}
          style={{
            padding: 15,
            backgroundColor: GlobalStyle.blueDark,
            borderRadius: 5,
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: '700'}}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  tinyLogo: {
    height: 100,
    width: 100,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    resizeMode: 'cover',
  },
  emptyContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loader: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 5,
    height: 100,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

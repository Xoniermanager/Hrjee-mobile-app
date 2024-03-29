import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import React, {useContext} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from '../../../../../reusable/GlobalStyle';
import {useFocusEffect, useEffect} from '@react-navigation/native';
import disposalReport from '../../../../../../api/disposalReport';
import useApi from '../../../../../../api/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EssContext} from '../../../../../../Context/EssContext';
import PullToRefresh from '../../../../../reusable/PullToRefresh';
let {width} = Dimensions.get('window');

const Listings = ({navigation, route}) => {
  const {user} = useContext(EssContext);

  //Loan Request
  const getAllDisposalRequest = useApi(disposalReport.getAll);
  const deleteDisposalRequest = useApi(disposalReport.deleteForm);

  useFocusEffect(
    React.useCallback(() => {
      getPurchaseRequest();
    }, []),
  );

  const getPurchaseRequest = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    getAllDisposalRequest.request(
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
    deleteDisposalRequest.request(body, config);
    getPurchaseRequest();
  };

  const handleRefresh = async () => {
    // Do something to refresh the data
    getPurchaseRequest();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#e3eefb'}}>
      {getAllDisposalRequest.loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      )}
      {getAllDisposalRequest.error && alert(getAllDisposalRequest.error)}
      <PullToRefresh onRefresh={handleRefresh}>
        {getAllDisposalRequest.data?.data?.map((i, index) => (
          <View
            key={index}
            style={[
              styles.form,
              {
                marginBottom:
                  index == getAllDisposalRequest.data.data.length - 1 ? 100 : 0,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Ionicons
                name="document-text-outline"
                size={28}
                color="#0043ae"
                style={{marginRight: 10}}
              />
              <Text style={{fontWeight: '600', fontSize: 16}}>
                {i.item_type}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AntDesign
                name="edit"
                onPress={() =>
                  navigation.navigate('Disposal Report', {
                    update: true,
                    id: i.id,
                  })
                }
                size={22}
                color="#0e664e"
                style={{marginRight: 25}}
              />
              <AntDesign
                onPress={() => deleteForm(i.id)}
                name="delete"
                size={22}
                color="#cd181f"
                style={{marginRight: 0}}
              />
            </View>
          </View>
        ))}
      </PullToRefresh>

      {getAllDisposalRequest.data?.data.length == 0 && (
        <View style={styles.emptyContainer}>
          <Image
            style={styles.tinyLogo}
            source={require('../../../../../images/emptyForm.gif')}
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
          onPress={() =>
            navigation.navigate('Disposal Report', {update: false})
          }
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
    width: 200,
    height: 200,
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
});

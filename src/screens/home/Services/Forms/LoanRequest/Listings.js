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
import {useFocusEffect} from '@react-navigation/native';
import loanRequest from '../../../../../../api/loanRequest';
import useApi from '../../../../../../api/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EssContext} from '../../../../../../Context/EssContext';
import PullToRefresh from '../../../../../reusable/PullToRefresh';
let {width} = Dimensions.get('window');

const Listings = ({navigation, route}) => {
  const {user} = useContext(EssContext);

  //Loan Request
  const getAllLoans = useApi(loanRequest.getAll);
  const deleteLoan = useApi(loanRequest.deleteForm);

  useFocusEffect(
    React.useCallback(() => {
      getLoans();
    }, []),
  );

  const handleRefresh = async () => {
    // Do something to refresh the data
    getLoans();
  };

  const getLoans = async () => {
    const token = await AsyncStorage.getItem('Token');
    const config = {
      headers: {Token: token},
    };
    getAllLoans.request(
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
    deleteLoan.request(body, config);
    getLoans();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#e3eefb'}}>
      {getAllLoans.loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#388aeb" />
        </View>
      )}
      {getAllLoans.error && alert(getAllLoans.error)}
      <PullToRefresh onRefresh={handleRefresh}>
        {getAllLoans.data?.data.result?.map((i, index) => (
          <View
            key={index}
            style={[
              styles.form,
              {
                marginBottom:
                  index == getAllLoans.data.data.result.length - 1 ? 100 : 0,
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
              <Text style={{fontWeight: '600', fontSize: 16}}>{i.name}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AntDesign
                name="edit"
                size={22}
                color="#0e664e"
                style={{marginRight: 25}}
                onPress={() =>
                  navigation.navigate('Loan Request', {
                    update: true,
                    id: i.id,
                  })
                }
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

      {getAllLoans.data?.data.result.length == 0 && (
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
            navigation.navigate('Loan Request', {
              update: false,
            })
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

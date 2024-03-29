import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import GlobalStyle from './GlobalStyle';

const Empty = ({navigation, onPress}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      <View style={{alignItems: 'center'}}>
        <Image
          style={styles.tinyLogo}
          source={require('../images/empty.gif')}
        />
        <Text>No Data Found</Text>
        {/* <TouchableOpacity style={[styles.btn_style]} onPress={onPress}>
          <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
            Back to dashboard
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
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
  tinyLogo: {
    width: 300,
    height: 300,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
});

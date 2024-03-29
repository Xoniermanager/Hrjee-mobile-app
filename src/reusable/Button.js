import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalStyle from './GlobalStyle';

const Button = ({label, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn_style}>
      <Text
        style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 15,
          width: '90%',
        }}>
        {label}
      </Text>
      <AntDesign
        name="rightcircle"
        size={22}
        color="white"
        style={{margin: 5}}
      />
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn_style: {
    marginTop: 20,
    backgroundColor: GlobalStyle.blueDark,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

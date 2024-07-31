import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Reload = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('./src/images/processingtask.json')}
        autoPlay
        loop
        style={styles.lottie}
      />    
      </View>
  )
}
export default Reload
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lottie: {
    width: 100,
    height: 100
  }
})
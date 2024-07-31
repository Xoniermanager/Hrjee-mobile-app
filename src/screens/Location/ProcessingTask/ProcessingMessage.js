
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';


const ProcessingMessage = () => {
  return (
    <View style={styles.container}>
      {/* <ActivityIndicator size="large" color="#0000FF"  /> */}
      <LottieView
        source={require('../../../images/processingtask.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text>Please wait</Text>
      <Text> we are submitting your requiest</Text>
    </View>
  )
}

export default ProcessingMessage

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
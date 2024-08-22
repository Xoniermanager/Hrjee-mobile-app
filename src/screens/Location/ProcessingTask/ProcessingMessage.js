
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';


const ProcessingMessage = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../images/processingtask.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>


  )
}

export default ProcessingMessage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Ensure the background is white or another contrasting color
  },
  text: {
    fontSize: 24,
    color: 'black', // Ensure the text color contrasts with the background
    marginBottom: 20, // Adjust spacing
  },
  animation: {
    width: 150, // Ensure the animation is large enough to be visible
    height: 150,
  },
})
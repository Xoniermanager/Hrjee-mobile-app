import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';

const Reload = () => {
  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={require('./src/images/loadergif.gif')}

        // source={{
        //   // uri: 'https://media.giphy.com/media/3o6UBd8Go6rLNu0I1y/giphy.gif',
        //   source:require('./src/images/loadergif.gif'),
        //   priority: FastImage.priority.normal,
        // }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
}
export default Reload
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
  },
})
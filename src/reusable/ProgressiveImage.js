import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const ProgressiveImage = val => {
  const {defaultImageSource, source, style, ...props} = val;
  let defaultImageAnimated = new Animated.Value(0);
  let imageAnimated = new Animated.Value(0);

  const handleDefaultImageLoad = () => {
    Animated.timing(defaultImageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        {...props}
        source={defaultImageSource}
        style={[style, {opacity: defaultImageAnimated}]}
        onLoad={handleDefaultImageLoad}
        blurRadius={1}
      />
      <Animated.Image
        {...props}
        source={source}
        style={[style, {opacity: imageAnimated}, styles.imageOverlay]}
        onLoad={handleImageLoad}
      />
    </View>
  );
};

export default ProgressiveImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
});

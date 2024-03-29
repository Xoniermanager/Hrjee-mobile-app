import React from 'react';
import {View, StyleSheet} from 'react-native';

const Skeleton = () => {
  return (
    <View style={styles.container}>
      {/* Add skeleton components here */}
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonName} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#bbb',
    marginRight: 10,
  },
  skeletonName: {
    width: 120,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#bbb',
  },
});

export default Skeleton;

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
const Reload = () => {
  return (
    <View style={styles.container}>
     <ActivityIndicator size="large" color="#0000FF"  />
    </View>
  )
}
export default Reload
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
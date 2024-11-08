import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
    const navigation = useNavigation();
    setTimeout(async () => {
        const token = await AsyncStorage.getItem('Token');
        if (token !== null) {
            navigation.navigate('Main')
        } else {
            navigation.navigate('OnboardingScreen');
        }
    }, 2000);
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#e3eefb" />
            <View style={styles.conatiner}>
                <Image source={require('../src/images/logo.png')} style={{ resizeMode: 'contain', width: '75%' }} />
            </View>
        </>

    );
};

export default Splash;

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: '#e3eefb',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

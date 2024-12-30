import { StyleSheet, Text, StatusBar, View, Image } from 'react-native';
import React, { useRef } from 'react';
import Onboarding, { goNext } from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const Stack = createNativeStackNavigator();


const OnboardingScreen = () => {
    const onboardingRef = useRef();
    const navigation = useNavigation();
    return (

        <>
            <View style={{ flex: 1 }}>
                <Onboarding
                    onSkip={() => navigation.navigate('Login')}
                    onDone={() => navigation.navigate('Login')}
                    ref={onboardingRef}
                    pages={[
                        {
                            backgroundColor: '#e3eefb',
                            image: (
                                <Image
                                    source={require('../../src/images/logo.png')}
                                    style={{ resizeMode: "contain", width: responsiveWidth(70), height: responsiveHeight(30) }}
                                />
                            ),
                            title: 'HR is hard, HRJEE is easy',
                            subtitle:
                                'Create a great place to work at every stage of growth with all-in-one software from HRJEE',
                        },
                        {
                            backgroundColor: '#e3eefb',
                            image: (
                                <Image
                                    source={require('../../src/images/logo.png')}
                                    style={{ resizeMode: "contain", width: responsiveWidth(70), height: responsiveHeight(30) }}
                                />
                            ),
                            title: 'Why HRJEE?',
                            subtitle:
                                'Hrjee empowers employees to manage their own personal and employment information',
                        },
                        {
                            backgroundColor: '#e3eefb',
                            image: (
                                <Image
                                    source={require('../../src/images/logo.png')}
                                    style={{ resizeMode: "contain", width: responsiveWidth(70), height: responsiveHeight(30) }}
                                />
                            ),
                            title: 'Hrjee enhances the People-centric focus of HR operations.',
                            subtitle:
                                'Hrjee is an electronic platform that enables employees to manage their personal HR-related information and tasks without requiring assistance from HR personnel.',
                        },
                    ]}
                />
            </View>
        </>
    );
};

export default OnboardingScreen;

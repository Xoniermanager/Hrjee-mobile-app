import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Modal,
    StatusBar,
    Easing,
    Animated
} from 'react-native';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Root, Popup } from 'popup-ui'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apiUrl from '../../../../reusable/apiUrl'


const Attendence_Update_Request = () => {
    const [loading, setloading] = useState(false);

    const navigation = useNavigation()
    const [updateattendence, setUpdateAttendence] = useState('')

    console.log("updateattendence---------------------->", updateattendence)

    const [scale] = useState(new Animated.Value(1)); // Initialize the scale animation
    const [opacity] = useState(new Animated.Value(1)); // Initialize the opacity animation

    // Animated border styles
    const borderWidth = useState(new Animated.Value(2))[0]; // Animated border width
    const borderColor = useState(new Animated.Value(0))[0]; // Animated color (0 will represent initial color)

    // Animation for the border
    useEffect(() => {
        const animateBorder = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(borderWidth, {
                        toValue: 5, // Increase border width
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                    Animated.timing(borderWidth, {
                        toValue: 2, // Reset border width
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                    Animated.timing(borderColor, {
                        toValue: 1, // Change color
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                    Animated.timing(borderColor, {
                        toValue: 0, // Reset color
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        };

        animateBorder(); // Start the border animation
    }, [borderWidth, borderColor]);

    // Interpolate color based on the animated value
    const animatedBorderColor = borderColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#0043ae', '#FF6347'], // From blue to tomato
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setloading(true);

                const token = await AsyncStorage.getItem('Token');
                if (!token) {
                    // Handle case when token is not available
                    return;
                }

                const config = {
                    headers: {
                        Token: token,
                        'Content-Type': 'multipart/form-data',
                    },
                };
                const response = await axios.get(`${apiUrl}/SecondPhaseApi/attendanceRequests`, config);
                setloading(false);
                if (response?.data?.status === 200) {
                    Popup.show({
                        type: 'Success',
                        title: 'Success',
                        button: true,
                        textBody: response?.data?.message,
                        buttonText: 'Ok',
                        callback: () => {
                            Popup.hide();
                        },
                    });
                    setUpdateAttendence(response?.data?.data?.data)
                }
            } catch (error) {
                setloading(false);

                // Ensure error is properly handled and prevent accessing undefined fields
                if (error.response) {
                    if (error.response.status === 401) {
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: error.response.data.msg,
                            buttonText: 'Ok',
                            callback: async () => {
                                await AsyncStorage.removeItem('Token');
                                await AsyncStorage.removeItem('UserData');
                                await AsyncStorage.removeItem('UserLocation');
                                navigation.navigate('Login');
                                Popup.hide();
                            },
                        });
                    } else {
                        // Handle other errors or show a generic error message
                        Popup.show({
                            type: 'Error',
                            title: 'Error',
                            button: true,
                            textBody: 'An unexpected error occurred.',
                            buttonText: 'Ok',
                            callback: () => Popup.hide(),
                        });
                    }
                } else {
                    // Network or other unexpected error
                    Popup.show({
                        type: 'Error',
                        title: 'Error',
                        button: true,
                        textBody: 'Network error. Please try again later.',
                        buttonText: 'Ok',
                        callback: () => Popup.hide(),
                    });
                }
            }
        };
        fetchData();
    }, [])

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#e3eefb" />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e3eefb' }}>
                <Root>
                    <Animated.View
                        style={{
                            transform: [{ scale }],
                            opacity,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                backgroundColor: '#0043ae',
                                borderRadius: 10,
                                alignSelf: 'flex-end',
                                justifyContent: 'center',
                                width: responsiveWidth(40),
                                height: responsiveHeight(6),
                                marginRight: 10,
                                marginTop: 8,
                            }}
                            onPress={() => navigation.navigate('Add_Attendence')}
                            onPressIn={() => {
                                Animated.sequence([
                                    Animated.timing(scale, {
                                        toValue: 0.95,
                                        duration: 150,
                                        easing: Easing.ease,
                                        useNativeDriver: true,
                                    }),
                                    Animated.timing(opacity, {
                                        toValue: 0.7,
                                        duration: 150,
                                        easing: Easing.ease,
                                        useNativeDriver: true,
                                    }),
                                ]).start();
                            }}
                            onPressOut={() => {
                                Animated.sequence([
                                    Animated.timing(scale, {
                                        toValue: 1,
                                        duration: 150,
                                        easing: Easing.ease,
                                        useNativeDriver: true,
                                    }),
                                    Animated.timing(opacity, {
                                        toValue: 1,
                                        duration: 150,
                                        easing: Easing.ease,
                                        useNativeDriver: true,
                                    }),
                                ]).start();
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                                + Attendance Update
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <FlatList
                        data={updateattendence}
                        keyExtractor={(item, index) => `${item.key}${index}`}
                        renderItem={({ item, index }) => (
                            <View style={styles.Card_Box} key={index}>
                                <Animated.View
                                    style={[
                                        styles.CardContent,
                                        {
                                            borderWidth: borderWidth, // Animated border width
                                            borderColor: animatedBorderColor, // Animated border color
                                        },
                                    ]}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={styles.card_textleft}>Emp No</Text>
                                        <Text style={styles.card_text}>{item?.employee_number}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={styles.card_textleft}>Date</Text>
                                        <Text style={styles.card_text}>{item?.date}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={styles.card_textleft}>Punch In:</Text>
                                        <Text style={styles.card_text}>{item?.punch_in_time}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={styles.card_textleft}>Punch Out:</Text>
                                        <Text style={styles.card_text}>{item?.punch_out_time}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={styles.card_textleft}>Status</Text>
                                        <Text style={styles.card_text}>{item?.status}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={styles.card_textleft}>Reason</Text>
                                        <Text style={styles.card_text}>{item?.reason}</Text>
                                    </View>
                                </Animated.View>
                            </View>
                        )}
                    />
                </Root>
            </SafeAreaView>
        </>
    );
};

export default Attendence_Update_Request;

const styles = StyleSheet.create({
    Card_Box: {
        width: responsiveWidth(95),
        backgroundColor: '#fff',
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 5,
        elevation: 2,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    CardContent: {
        borderRadius: 15,
        padding: 10,
        borderWidth: 2, // Static border width as fallback before animation
    },
    card_text: {
        fontSize: responsiveFontSize(1.9),
        marginTop: 5,
        color: '#37496E',
        marginRight: 20,
    },
    card_textleft: {
        fontSize: responsiveFontSize(1.9),
        marginTop: 5,
        color: '#37496E',
        marginLeft: 20,
    },
});

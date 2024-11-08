import { Image, SafeAreaView, StyleSheet, TextInput, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useCallback, useState, useFocusEffect, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Themes from '../../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../../../../src/reusable/apiUrl'
import axios from 'axios';
import Reload from '../../../../../Reload';

const ResignStatus = ({ navigation }) => {
    {/* THis code is less more */ }

    const [expandedprofile, setExpandedProfile] = useState(false);
    const [resignstatus, setResignStatus] = useState(null);
    const [loading, setloading] = useState(true);

    const toggleExpandedProfile = () => {
        setExpandedProfile(!expandedprofile);
    };

    const get_ResignStatus = async () => {
        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: { Token: token },
        };
        axios
            .get(`${apiUrl}/secondPhaseApi/getResignations`, config)
            .then(response => {
                setResignStatus(response?.data?.data);
                setloading(false);
            })
            .catch(error => {

                setloading(false)
                if (error.response.status == '401') {
                    Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: error.response.data.msg,
                        buttonText: 'Ok',
                        callback: () => [Popup.hide(), AsyncStorage.removeItem('Token'),
                        AsyncStorage.removeItem('UserData'),
                        AsyncStorage.removeItem('UserLocation'),
                        navigation.navigate('Login')]
                    });
                }
            });
    };

    useEffect(() => {
        get_ResignStatus()
    }, [])
    if (resignstatus == null) {
        return <Reload />
    }

    return (
        <SafeAreaView style={styles.container}>



            <ScrollView showsVerticalScrollIndicator={false}>
                <>
                    {
                        resignstatus?.map((elements, index) => {
                            return (
                                <>
                                    <View key={index} style={{ marginTop: 20, borderRadius: 30, marginBottom: 10, padding: 20, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, width: "95%", alignSelf: "center" }}>
                                        <View style={{ marginBottom: 20 }}>
                                            <Text style={{ color: "#000", fontWeight: "500", marginLeft: 10 }}>Subject</Text>

                                            <Text style={{ marginLeft: 10, color: Themes == 'dark' ? '#000' : '#000' }}>{elements?.subject}</Text>
                                        </View>

                                        <View style={{ marginBottom: 20 }}>
                                            <Text style={{ color: "#000", fontWeight: "500", marginLeft: 10 }}>Mail to</Text>
                                            <Text style={{ marginLeft: 10, color: Themes == 'dark' ? '#000' : '#000' }}>{elements?.submitToEmails}</Text>
                                        </View>
                                        <Text style={{ color: "#000", fontWeight: "500", marginLeft: 10 }}>Message</Text>
                                        <Text style={{ marginLeft: 10, color: Themes == 'dark' ? '#000' : '#000' }}>{elements?.resone}</Text>

                                        <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", marginHorizontal: 10, alignItems: "center" }}>
                                            <Text style={{ color: "#000", fontSize: 16 }}>Resignation Status</Text>
                                            <TouchableOpacity onPress={() => navigation.navigate('ResignStatus')} style={{ backgroundColor: elements?.status == 0 ? "#0CD533" : "#F1416C", borderRadius: 15 }}>
                                                <Text style={{ textAlign: "center", color: "#fff", padding: 6 }}>{elements?.status == 0 ? 'Approved' : 'Reject'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            )
                        })
                    }
                </>
            </ScrollView>


        </SafeAreaView>
    );
};
export default ResignStatus;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3eefb',
    },

    name: {
        color: '#fff',
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: responsiveHeight(3)
    },
});
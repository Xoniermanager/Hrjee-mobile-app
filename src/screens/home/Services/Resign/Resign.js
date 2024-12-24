import { Image, SafeAreaView, StyleSheet, Modal, TextInput, Text, View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import Themes from '../../../../Theme/Theme';
import { Root, Popup } from 'popup-ui'
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apiUrl from '../../../../reusable/apiUrl';
import Reload from '../../../../../Reload';
import { SocketContext } from '../../../../tracking/SocketContext'; { }

const Resign = ({ navigation }) => {
    {/* THis code is less more */ }

    const [expandedprofile, setExpandedProfile] = useState(false);
    const { managerdetils } = useContext(SocketContext);

    const toggleExpandedProfile = () => {
        setExpandedProfile(!expandedprofile);
    };

    const [startopen, setstartopen] = useState(false);
    const [status, setStatus] = useState(new Date());
    const [resigninData, setResignData] = useState('');
    const [show, setShow] = useState(false)
    const [typeresign, setTypeResign] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setloading] = useState(false);
    const [managerId, setManagerID] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedName, setSelectedName] = useState('Pick the manager name');

    const resignShare = async () => {

        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: { Token: token },
        };
        const body = {
            subject : subject,
            submit_to : [managerId],
            reason: typeresign,
        };
        setloading(true);

        if (subject == '') {
            Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'Please enter subject',
                buttonText: 'Ok',
                callback: () => [Popup.hide()]
            })

            setloading(false);
        }
        else if (selectedName === 'Pick the manager name') {
            Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'Please pick manager name',
                buttonText: 'Ok',
                callback: () => [Popup.hide()]
            })
            setloading(false);
        }
        else if (typeresign == '') {
            Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: 'Please type resigation',
                buttonText: 'Ok',
                callback: () => [Popup.hide()]
            })
            setloading(false);
        }
        else {
            setShow(true)
            axios
                .post(`${apiUrl}/secondPhaseApi/submit_resignation`, body, config)
                .then(response => {
                    setStatus(response?.data)
                    console.log("res---------------------", response?.data)
                    if (response.data.status == 1) {
                        setloading(false);
                        try {
                            setloading(false);
                            setShow(false)
                            setResignData(response?.data)
                            Popup.show({
                                type: 'Success',
                                title: 'Successful',
                                button: true,
                                textBody: response?.data?.message,
                                buttonText: 'Ok',
                                callback: () => [Popup.hide(), setResignData(response?.data), navigation.navigate('ResignStatus')]
                            })
                        } catch (e) {
                            setloading(false);
                            setShow(false)
                        }
                    } else if (response.data.status == 0) {
                        setloading(false);
                        setShow(false)
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: response?.data?.message,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()]
                        })

                    }
                })
                .catch(error => {
                    setShow(false)
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
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <Root>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* This is profile details */}
                    <View style={{ marginTop: 10, alignSelf: "center", marginTop: responsiveHeight(1), borderTopLeftRadius: 10, borderBottomLeftRadius: expandedprofile == true ? 0 : 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>

                        <Image style={{ height: 150, width: 150, alignSelf: "center", marginVertical: 20, resizeMode: "contain" }}
                            source={require('../../../../images/regin.png')}
                        />

                        <View style={{ borderRadius: 30, marginBottom: 8, padding: Platform.OS == 'ios'? 15:5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                            <TextInput
                                placeholder='Subject'
                                placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                                color={Themes == 'dark' ? '#000' : '#000'}
                                value={subject}
                                onChangeText={text =>
                                    setSubject(text)
                                }
                            />
                        </View>
                        <View style={{ marginBottom: expandedprofile == true ? 0 : 8, width: "95%", backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, borderTopLeftRadius: 50, borderBottomLeftRadius: expandedprofile == true ? 0 : 50, borderTopRightRadius: 50, borderBottomRightRadius: expandedprofile == true ? 0 : 50, padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ color: "#000", fontSize: responsiveFontSize(2.3) }}>Send To</Text>
                            <TouchableOpacity onPress={toggleExpandedProfile}>
                                {
                                    expandedprofile ?
                                        <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../../../images/up.png')} />
                                        :
                                        <>
                                            <Image style={{ height: 30, width: 30, resizeMode: "contain" }} source={require('../../../../images/down.png')} />
                                        </>
                                }
                            </TouchableOpacity>
                        </View>
                        {
                            expandedprofile ?
                                <View style={{ marginBottom: expandedprofile == true ? 8 : 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                    <View style={{ borderTopWidth: expandedprofile == true ? 0 : 2, backgroundColor: "#EDFBFE", borderTopLeftRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={styles.dropdown}
                                            onPress={() => setModalVisible(true)}
                                        >
                                            <Text style={styles.selectedText}>{selectedName}</Text>
                                        </TouchableOpacity>

                                        <Modal
                                            transparent={true}
                                            animationType="slide"
                                            visible={modalVisible}
                                            onRequestClose={() => setModalVisible(false)}
                                        >
                                            <View style={styles.modalBackground}>
                                                <View style={styles.modalContainer}>
                                                    {managerdetils.map((elements, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={styles.option}
                                                            onPress={() => {
                                                                setSelectedName(elements?.FULL_NAME);
                                                                setManagerID(elements?.EMPLOYEE_NUMBER)
                                                                setModalVisible(false);
                                                            }}
                                                        >
                                                            <Text style={styles.optionText}>{elements?.FULL_NAME}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                </View>
                                :
                                null
                        }

                        <View style={{ borderRadius: 30, marginBottom: 8, padding: Platform.OS == 'ios'?15:5, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, }}>
                            <TextInput
                                placeholder='Type Resignation'
                                numberOfLines={6}
                                textAlignVertical={'top'}
                                placeholderTextColor={Themes == 'dark' ? '#000' : '#000'}
                                color={Themes == 'dark' ? '#000' : '#000'}
                                value={typeresign}
                                onChangeText={text =>
                                    setTypeResign(text)
                                }
                            />
                        </View>

                    </View>

                    <TouchableOpacity onPress={() => resignShare()} style={{ marginBottom: 5, backgroundColor: "#0433DA", padding: 18, width: "90%", alignSelf: "center", borderRadius: 50 }}>
                        {loading ? <ActivityIndicator size={'small'} color={"#fff"} /> : <Text style={{ textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" }}>Submit</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </Root>
        </SafeAreaView>
    );
};
export default Resign;
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
    dropdown: {
        borderColor: "gray",
        borderWidth: 0.5,
        marginVertical: 5,
        padding: 10,
        backgroundColor: "#EDFBFE",
        borderRadius: 10,
        alignItems: 'center',
    },
    selectedText: {
        textAlign: "center",
        fontSize: 15,
        color: "#000",
        fontWeight: "bold",
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    optionText: {
        fontSize: 15,
        color: "#000",
        textAlign: 'center',
    },
});


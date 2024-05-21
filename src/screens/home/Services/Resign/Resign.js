import { StyleSheet, Text, ActivityIndicator, TextInput, View, TouchableOpacity, Image, useColorScheme, SafeAreaView, Platform } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apiUrl from '../../../../reusable/apiUrl';
import Themes from '../Resign/Resign';
import { Root, Popup } from 'popup-ui'
import { useNavigation } from '@react-navigation/core';


const Resign = () => {
    const theme = useColorScheme();

    const [startopen, setstartopen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [resignin, setResign] = useState('');
    const [show,setShow]=useState(false)
    const [resigndata, setResignData] = useState('');
    const [loading, setloading] = useState(false);
    const navigation=useNavigation()
    const resignShare = async () => {

        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: { Token: token },
        };
        const body = {
            reason: resignin
        };

        setloading(true);

        if (resignin == '') {
            Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody:'Please enter some text',
                buttonText: 'Ok',
                callback: () => [Popup.hide()]
              })
           
            setloading(false);
        } else {
            setShow(true)
            axios
                .post(`${apiUrl}/secondPhaseApi/submit_resignation`, body, config)
                .then(response => {
                 
                    if (response.data.status == 1) {
                        try {
                            setloading(false);
                            setShow(false)
                            Popup.show({
                                type: 'Success',
                                title: 'Successful',
                                button: true,
                                textBody:response?.data?.message,
                                buttonText: 'Ok',
                                callback: () => [Popup.hide(),   setResignData(response?.data), navigation.navigate('Home')]
                              })
                         
                          
                           
                          
                        } catch (e) {
                            setloading(false);
                            setShow(false)

                           
                        }
                    } else   if (response.data.status == 0){
                        setloading(false);
                        setShow(false)
        
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody:response?.data?.message,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()]
                          })
                       
                    }
                })
                .catch(error => {
                    setShow(false)
                    setloading(false)
                    if(error.response.status=='401')
                    {
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody:error.response.data.msg,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide(),AsyncStorage.removeItem('Token'),
                            AsyncStorage.removeItem('UserData'),
                            AsyncStorage.removeItem('UserLocation'),
                           navigation.navigate('Login')]
                          });
                    }
                });
        }
    };

    return (
        <SafeAreaView style={{flex: 1,}}>
            <Root>
          
            <View style={styles.container}>
                <Image style={{ width:'100%',resizeMode:'stretch',height:300}}
                    source={require('../../../../images/resign.jpeg')}
                />
                <Text style={styles.txtname}>Comment</Text>
                <TextInput
                    placeholder='Comment...'
                    placeholderTextColor={theme == 'dark' ? '#000' : '#000'}
                    value={resignin}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(text) => setResign(text)}
                    style={{ color: Themes == 'dark' ? '#000' : '#000', borderWidth: 0.5, textAlignVertical: 'top',height:Platform.OS==='ios'?100:null ,borderRadius:10}}
                />
               
                <TouchableOpacity activeOpacity={0.8}  onPress={()=> resignShare()}  disabled={show}>
                    <Text style={styles.subtxt}>Submit</Text>
                </TouchableOpacity>
                {/* <View style={styles.viewstatus}>
                    <Text style={{ color: "#000", fontSize: 18 }}>Status</Text>
                    <Text style={{ color: "#000", fontSize: 18 }}>*</Text>
                    {
                        resigndata?.status == 0 ?
                            <Text style={{ color: "#000", fontSize: 18 }}>Waiting for approval</Text>
                            :
                            <Text style={{ color: "green", fontSize: 18 }}>Active</Text>
                    }
                </View> */}
            </View>
                  
            </Root>
        </SafeAreaView>
    )
}

export default Resign

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        padding: 10
    },
    title: { fontSize: 16, marginVertical: 10, fontWeight: '600' },
    calender: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    txtname: {
        fontSize: 16, marginVertical: 10, fontWeight: '600', color: Themes == 'dark' ? '#000' : '#000'
    },
    underline: {
        borderWidth: 0.5,
        color: "#fff",
        opacity: 0.6
    },
    statustxt: {
        backgroundColor: "#0321a4",

    },
    subtxt: {
        color: "#fff",
        padding: 10,
        fontSize: 18,
        backgroundColor: "#0321a4",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 5
    },
    viewstatus: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
    }
})



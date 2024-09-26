import { Image, SafeAreaView, StyleSheet, TextInput, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Themes from '../../../../Theme/Theme';


const ResignStatus = ({ navigation }) => {
    {/* THis code is less more */ }

    const [expandedprofile, setExpandedProfile] = useState(false);

    const toggleExpandedProfile = () => {
        setExpandedProfile(!expandedprofile);
    };

    return (
        <SafeAreaView style={styles.container}>



                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 20, borderRadius: 30, marginBottom: 10, padding: 20, backgroundColor: "#EDFBFE", opacity: 1, elevation: 10, width: "95%", alignSelf: "center" }}>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ color: "#000", fontWeight: "500", marginLeft: 10 }}>Subject</Text>
                                
                                <Text style={{ marginLeft: 10, color: Themes == 'dark' ? '#000' : '#000' }}>This is the subject</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ color: "#000", fontWeight: "500", marginLeft: 10 }}>Mail to</Text>
                                <Text style={{ marginLeft: 10, color: Themes == 'dark' ? '#000' : '#000'}}>demo@xoniertech.com</Text>
                                <Text style={{ marginLeft: 10, color: Themes == 'dark' ? '#000' : '#000' }}>hr@xoniertech.com</Text>
                            </View>
                            <Text style={{ color: "#000", fontWeight: "500", marginLeft: 10 }}>Message</Text>
                            <Text style={{ marginLeft: 10, color: Themes == 'dark' ? '#000' : '#000' }}>This is the main content for resignation latter</Text>

                            <View style={{ borderRadius: 10, backgroundColor: "#F1416C", width: 75, alignSelf: "flex-end", marginRight: 20, marginTop: 10 }}>
                                <Text style={{ textAlign: "center", padding: 5, color: "#fff" }}>Cache</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row", marginTop:10, justifyContent:"space-between", marginHorizontal:25, alignItems:"center"}}>
                            <Text style={{color:"#000", fontSize:16}}>Resignation Status</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ResignStatus')} style={{  backgroundColor: "#0CD533", borderRadius: 15 }}>
                                <Text style={{ textAlign: "center", color: "#fff", padding:6 }}>Approved</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>


        </SafeAreaView>
    );
};
export default ResignStatus;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    name: {
        color: '#fff',
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: responsiveHeight(3)
    },
});
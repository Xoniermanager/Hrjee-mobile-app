import {
    Pressable,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    TextInput,
    useColorScheme,
    FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Reload from '../../../Reload';


const PRM = () => {
    const theme = useColorScheme();
    const [search, setSearch] = useState();
    // const [arr, setArr] = useState();
    const [searchList, setSearchList] = useState()
    const [prmdata, setPRMdata] = useState(null)
    const navigation = useNavigation();

    console.log(prmdata)

    const get_employee_detail = async () => {

        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: { Token: token },
        };
        console.log(token)
        axios
            .get(`${apiUrl}/SecondPhaseApi/get_prm_payments`, config)
            .then(response => {
                console.log(response?.data, 'dvshjvfhjsvhjdcfsjhgchjasjcgj')

                if (response?.data?.status == 1) {
                    setPRMdata(response?.data?.data);
                }
            })
            .catch(error => {

                alert(error.request._response);
            });
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            get_employee_detail()
        });

        return unsubscribe;
    }, [navigation]);
            if(prmdata==null){
                return <Reload/>
            }
    return (
        <SafeAreaView style={styles.container}>
            <Text
                style={[
                    styles.Dashboard_Text,
                    { color: '#000' },
                ]}>
                PRM
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}
                style={[
                    {
                        backgroundColor: '#ffff'
                    },
                ]}>
                <View
                    style={{
                        width: responsiveWidth(99),
                        height: responsiveHeight(10),
                        backgroundColor: '#0c57d0',
                        borderRadius: 10,
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}>
                    <TextInput
                        value={search}
                        placeholder="search..."
                        placeholderTextColor={theme=='dark'?'#000':'#000'}
                        style={{
                            width: 200,
                            height: 40,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            padding: 10,
                        }}
                        onChangeText={prev => [setSearch(prev), onSearchList()]}
                    // onSubmitEditing={() => onSearchList()}
                    />
                    <TouchableOpacity
                        style={{
                            width: 150,
                            height: 40,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => navigation.navigate('AddPRM')}>
                        <Text style={{ color: '#0c57d0', fontWeight: "bold" }}>+ Add PRM</Text>
                    </TouchableOpacity>
                </View>
                {searchList && <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 15 }}>{searchList.message}</Text>}
                <FlatList

                    data={prmdata}
                    keyExtractor={(item, index) => `${item.key}${index}`}
                    renderItem={({ item, index }) =>
                        <View style={styles.Card_Box} key={index}>
                            <View
                                style={{
                                    width: responsiveWidth(95),
                                    height: responsiveHeight(2),
                                    backgroundColor: '#000',
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    justifyContent: 'center',
                                }}></View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.card_textleft}>Employee Name</Text>
                                <Text style={styles.card_text}>{item?.employee_name}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.card_textleft}>Employee Number</Text>
                                <Text style={styles.card_text}>{item?.employee_number}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.card_textleft}>Caretaker Name</Text>
                                <Text style={styles.card_text}>{"Pyare"}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.card_textleft}>Role</Text>
                                <Text style={styles.card_text}>{item?.role}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.card_textleft}>Payment Date</Text>
                                <Text style={styles.card_text}>{item?.payment_date}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.card_textleft}>Category Name</Text>
                                <Text style={styles.card_text}>{item?.category_name}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.card_textleft}>Remark</Text>
                                <Text style={styles.card_text}>{item?.remark}</Text>
                            </View>
                            <TouchableOpacity
                                style={{
                                    marginVertical: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() =>
                                    navigation.navigate('AdminsterMedicineDeatils', item)
                                }>

                            </TouchableOpacity>
                            <View
                                style={{
                                    width: responsiveWidth(95),
                                    height: responsiveHeight(2),
                                    backgroundColor: '#000',
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                    justifyContent: 'center',
                                    bottom: 0,
                                    position: 'absolute',
                                }}>
                                <TouchableOpacity>
                                    <Ionicons
                                        name="arrow-down"
                                        style={{
                                            fontSize: 15,
                                            color: '#fff',
                                            alignSelf: "center"
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>}
                />
            </ScrollView>
        </SafeAreaView>
    );
};
export default PRM;
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    Dashboard_Text: {
        color: '#37496E',
        fontSize: responsiveFontSize(2),
        marginHorizontal: 20,
        fontWeight: '700',
        marginVertical: 10,
    },
    AdministerBOx: {
        width: responsiveWidth(92),
        height: responsiveHeight(33),
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 15,
    },
    Care_Box: {
        width: responsiveWidth(92),
        height: responsiveHeight(7),
        backgroundColor: '#37496E',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'center',
    },
    Administer_text: {
        color: '#fff',
        fontSize: responsiveFontSize(2),
        marginHorizontal: 15,
        fontWeight: '500',
    },
    header_text: {
        color: '#37496E',
        fontSize: responsiveFontSize(1.2),
        textAlign: 'center',
    },
    header: {
        height: responsiveHeight(7),
    },
    text: {
        color: '#37496E',
        fontSize: 10,
    },
    Card_Box: {
        width: responsiveWidth(95),
        // height: responsiveHeight(30),
        // padding:12,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 5,
        elevation: 10,
        borderWidth: 1,
        marginBottom: 5
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












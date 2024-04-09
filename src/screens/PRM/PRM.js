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
    useColorScheme, ActivityIndicator,
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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Reload from '../../../Reload';


const PRM = () => {
    const theme = useColorScheme();
    const [search, setSearch] = useState();
    // const [arr, setArr] = useState();
    const [searchList, setSearchList] = useState()
    const [prmdata, setPRMdata] = useState(null)
    const navigation = useNavigation();
    const [loading, setloading] = useState(false);
    const [active, setSetActive] = useState(-1)

    const get_employee_detail = async () => {
        setloading(true)
        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: { Token: token },
        };
        console.log(token)
        axios
            .get(`${apiUrl}/SecondPhaseApi/get_prm_payments`, config)
            .then(response => {
                setloading(false)
                if (response?.data?.status == 1) {
                    setPRMdata(response?.data?.data);
                }
            })
            .catch(error => {
                setloading(false)
                alert(error.request._response);
            });
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            get_employee_detail()
        });

        return unsubscribe;
    }, [navigation]);

    if (prmdata == null) {
        return <Reload />
    }
    const prm_delete = async (item) => {
        setloading(true)
        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: {
                Token: token,
                'Content-Type': 'multipart/form-data'
            },
        };
        let data = new FormData();

        data.append('prm_request_id', item?.id);
        console.log(data)
        axios
            .post(`${apiUrl}/SecondPhaseApi/delete_prm_request`, data, config)
            .then(response => {
                setloading(false)
                if (response?.data?.status == 1) {
                    get_employee_detail()
                }
            })
            .catch(error => {
                setloading(false)
                alert(error.request._response);
            });
    }

    const Post_edit_category = async (item) => {
        setloading(true)
        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: {
                Token: token,
                'Content-Type': 'multipart/form-data'
            },
        };
        let data = new FormData();

        data.append('prm_request_id', item?.id);
        console.log(data)
        axios
            .post(`${apiUrl}/SecondPhaseApi/get_details_prm`, data, config)
            .then(response => {
                setloading(false)
                response?.data?.data?.map((item, index) => {
                    navigation.navigate('AddPRM', { item: item })
                })
            })
            .catch(error => {
                setloading(false)
                alert(error);
            });
    }
    const handleToggle = async (index) => {
        setSetActive(index === active ? -1 : index)
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        backgroundColor: '#0c57d0',
                        borderRadius: 10,
                        alignSelf: "flex-end", justifyContent: "center", width: responsiveWidth(30),
                        height: responsiveHeight(6), marginRight: 8, marginTop: 8
                    }}
                    onPress={() => navigation.navigate('AddPRM')}>
                    <Text style={{ color: '#fff', fontWeight: "bold", textAlign: "center" }}>+ Add PRM</Text>
                </TouchableOpacity>
                {loading ? <ActivityIndicator size='large' color="#0043ae" /> : null}

                <FlatList
                    data={prmdata}
                    keyExtractor={(item, index) => `${item.key}${index}`}
                    renderItem={({ item, index }) =>
                        <View style={styles.Card_Box} key={index}>
                            <View style={{
                                width: responsiveWidth(95),
                                height: responsiveHeight(4),
                                backgroundColor: '#000',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                flexDirection: "row",
                                justifyContent: "flex-end"
                            }}>
                                <TouchableOpacity onPress={() => prm_delete(item)}>
                                    <Feather
                                        name="delete"
                                        style={{
                                            fontSize: 25,
                                            color: '#fff',
                                            marginRight: 10
                                        }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Post_edit_category(item)}>
                                    <AntDesign
                                        name="edit"
                                        style={{
                                            fontSize: 25,
                                            color: '#fff',
                                            marginRight: 10
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <>
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
                            </>
                            {
                                active === index && 
                                <>
                                    <View>
                                        <Text style={{ color: "#000" }}>Ankur</Text>
                                    </View>
                                </>
                            }

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
                            <View style={{
                                width: responsiveWidth(95),
                                height: responsiveHeight(4),
                                backgroundColor: '#000',
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                justifyContent: "center"
                            }}>
                                <TouchableOpacity key={index} onPress={() => handleToggle(index)}>
                                   
                                    {active ?
                                        <SimpleLineIcons
                                            name="arrow-up"
                                            style={{
                                                fontSize: 25,
                                                color: '#fff',
                                                alignSelf: "flex-end",
                                                marginRight: 10
                                            }}
                                        />
                                        :
                                        <SimpleLineIcons
                                            name="arrow-down"
                                            style={{
                                                fontSize: 25,
                                                color: '#fff',
                                                alignSelf: "flex-end",
                                                marginRight: 10
                                            }}
                                        />
                                    }


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












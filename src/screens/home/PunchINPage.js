import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect, useContext, createContext, useCallback } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import AWS, { Rekognition, S3, } from 'aws-sdk';
import { accessKeyId, secretAccessKey, region } from "@env"
import { useNavigation, useRoute } from '@react-navigation/native';
import useApi2 from '../../../api/useApi2';
import attendence from '../../../api/attendence';
import { SocketContext } from '../../tracking/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Root, Popup } from 'popup-ui';
import { PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as Progress from 'react-native-progress'; // Import Progress from react-native-progress
import BackgroundService from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
export const LiveTrackingContext = createContext();
const { width } = Dimensions.get('window');
import Modal from "react-native-modal";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { getDistance } from 'geolib';
import { useFocusEffect } from '@react-navigation/native';
import { EssContext } from '../../../Context/EssContext';


const PunchINPage = () => {
    const navigation=useNavigation()
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [loading, setloading] = useState(false);
    const [kYCModal, setKYCModal] = useState(false)
    const [faceModal, setFaceModal] = useState(false)
    const [faceNotModal, setFaceNotModal] = useState(false)
    const punchInApi = useApi2(attendence.punchIn);
    const punchOutApi = useApi2(attendence.punchOut);
    const [timerOn, settimerOn] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setuser1] = useState(null);
    const { setuser } = useContext(EssContext);
    const { activeinactivetracking, updatedlivetrackingaccess, livetrackingaccess, getList, locationblock, ManuAccessdetails_Socket, setStartBackgroundTracking, radius, updatedfacereconization, employeeNumber, firsttimelogin } = useContext(SocketContext);
    console.log("updatedfacereconization============>", updatedfacereconization.length)
    const route = useRoute();
    const [currentLocation, setcurrentLocation] = useState({
        long: '',
        lat: '',
    });
    const [activeLocation, setactiveLocation] = useState({
        latitude: '',
        longitude: '',
        location_id: '',
    });
    const [officetiming, setOfficeTiming] = useState('');


    useEffect(() => {
        const getData = async () => {
          AsyncStorage.getItem('UserData').then(res => {
            setuser1(JSON.parse(res));
            setuser(JSON.parse(res));
            setOfficeTiming(JSON.parse(res));
          });
        };
        getData();
      }, []);

    useFocusEffect(
        useCallback(() => {
            getActiveLocation();
            check_punchIn();
        }, []),
    );

    const getActiveLocation = async () => {
        const token = await AsyncStorage.getItem('Token');
        const config = {
            headers: { Token: token },
        };
        const body = {};
        getActiveLocationApi.request(body, config);
    };

    const getActiveLocationApi = useApi2(attendence.getActiveLocation);


    // face dedection start...........................................
    const [firstImage, setFirstImage] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [menu_access, setMenuaccess] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [face_kyc_img, setFace_kyc_img] = useState()
    const [faces, setFaces] = useState([]);
    const [progress, setProgress] = useState(0);
    const [imageUri, setImageUri] = useState(null);
    const [suggestion, setSuggestion] = useState(false)
    const [showkyc, setShowKyc] = useState(false)
    const [modalkycpermissions, setModalKycPermission] = useState(false)
    const [detecting, setDetecting] = useState(false);

    console.log("modalkycpermissions========", modalkycpermissions)

    const s3 = new S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });
    const rekognition = new Rekognition({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });
    const cameraRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [blob, setBlob] = useState()
    const handleFacesDetected = ({ faces }) => {
        if (faces.length > 0) {
            setDetecting(true);
            // Simulate progress
            let progressInterval = setInterval(() => {
                setProgress(prevProgress => {
                    if (prevProgress >= 1) {
                        clearInterval(progressInterval);
                        return 1;
                    }
                    return prevProgress + 0.1;
                });
            }, 1000); // Adjust the interval as needed
        } else {
            setDetecting(false);
            setProgress(0);
        }
    };
    const takePicture = async () => {

        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setBlob(data)
            setCapturedImage(data.uri);
            console.log(data.uri, 'hello')
            const uploadResult = await uploadTmpimage(data.uri);
            console.log(uploadResult, 'uploadResult')
            const s3ObjectKey = uploadResult.Key;
            console.log("S3 object data ------------->", s3ObjectKey)
            const ss = await compareFaces(s3ObjectKey)


        }

    };
    const uploadTmpimage = async (uri) => {
        const date = new Date();
        const monthIndex = date.getMonth();
        const day = date.getDate();
        const months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];
        const monthName = months[monthIndex];
        const response = await fetch(uri);
        const blob = await response.blob();

        const params = {
            Bucket: 'face-recoginition', // replace with your bucket name
            Key: `face_detection_punch_in/${employeeNumber}.jpg`, // Use empId in the file path
            Body: blob,
            ContentType: 'image/jpeg',
        };
        console.log("params during punch_in face deduction-----------------", params)
        return s3.upload(params).promise();
    };
    const getUserFace = async () => {
        const token = await AsyncStorage.getItem('Token');
        fetch(`${apiUrl}/SecondPhaseApi/get_user_face_kyc`, {
            method: 'GET',
            headers: {
                'Token': token,
                Accept: 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                console.log("response?.data?.face_kyc==========>", response?.data?.face_kyc)
                setModalKycPermission(response?.data?.face_kyc)
                if (response?.data?.face_kyc == 1) {
                    setFace_kyc_img(response?.data?.face_kyc_img)
                    setShowKyc(false)
                }
                else {
                    setIsModalVisible(true)
                    setShowKyc(false)
                }

            })
            .catch(err => {
                setloading(false);
            });

    }
    useEffect(() => {
        getUserFace()
    }, [route])


    // end kyc check api

    const compareFaces = async (s3ObjectKey) => {
        console.log("compareFaces----------")
        // setIsModalVisible(false)
        const token = await AsyncStorage.getItem('Token');
        const userData = await AsyncStorage.getItem('UserData');
        const params = {
            SourceImage: {
                S3Object: {
                    Bucket: 'face-recoginition',
                    Name: s3ObjectKey  // The image you want to compare with
                },
            },
            TargetImage: {
                S3Object: {
                    Bucket: 'face-recoginition',
                    Name: face_kyc_img, // The uploaded image
                },
            },
            SimilarityThreshold: 90,
        };

        rekognition.compareFaces(params, (err, data) => {
            if (err) {
                console.log("errr------", err?.message)
                if (err.message === 'Requested image should either contain bytes or s3 object.') {
                    Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: 'Keep Your Face front to the camera',
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()]
                    });
                    // setShowKyc(false)
                }
                else if (err.message === 'Request has invalid parameters') {
                    Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: 'Keep Your Face front to the camera',
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()]
                    });
                    // setShowKyc(false)
                } else {
                    // Show the popup with the error message for other errors
                    Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: err.message, // Display the actual error message
                        buttonText: 'Ok',
                        callback: () => Popup.hide()
                    });
                    // setShowKyc(false)
                }
            }
            else if (data?.UnmatchedFaces.length > 0) {
                Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: 'Faces do not match',
                    buttonText: 'Ok',
                    callback: () => [Popup.hide()]
                });
                // setShowKyc(false)
            }
            else {
                console.log("else part")
                setShowCamera(false)
                setFaceModal(true)
                setloading(false);
                setIsModalVisible(false)
                punch_in()
            }
        });
    };

    useEffect(() => {
        if (kYCModal == true) {
            setKYCModal(false)
        }
    }, [kYCModal, faceModal, faceNotModal])

    // face dedection end.............................................

    const showAlert = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to punch out?',
            [
                {
                    text: 'Cancel',
                    // onPress: handleCancelButtonPress,
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => punch_out() },
            ],
            { cancelable: false },
        );
    };

    const check_punchIn = async () => {
        // setloading(true)

        settimerOn(false);
        shouldTrackLocation.current = false;
        const token = await AsyncStorage.getItem('Token');
        const userData = await AsyncStorage.getItem('UserData');
        const UserLocation = await AsyncStorage.getItem('UserLocation');
        setuser(JSON.parse(userData));
        // setlocation(JSON.parse(UserLocation));
        const config = {
            headers: { Token: token },
        };

        const body = {};
        axios
            .post(`${apiUrl}/api/today_attendance`, body, config)
            .then(function (response) {
                console.log("res------------------", response?.data?.data)
                if (response.data.status == 1) {
                    const data = response.data.data;
                    if (data.in_time != '' && data.out_location_id == null) {

                        setpunchIn(true);
                        setinTime(data.in_time);
                        setlocationOut(data?.out_location_id);
                        settimerOn(true);
                        shouldTrackLocation.current = true;
                        setloading(false);
                        setModalVisible(false);
                    } else {
                        if (data.in_time != '' && data.out_location_id != '') {
                            setloading(false);
                            setpunchIn(false);
                            setModalVisible(false);
                            setHomeSkeleton(response.data)
                            setinTime(data.in_time);
                            setlocationOut(data.out_location_id);
                            settimerOn(false);
                            shouldTrackLocation.current = false;
                            var timeEnd1 = moment(data.out_time);
                            const startDate = moment(data.in_time);
                            const timeEnd = moment(timeEnd1);
                            const diff = timeEnd.diff(startDate);
                            const diffDuration = moment.duration(diff);
                            var days = diffDuration.days();
                            var hours = diffDuration.hours();
                            var minutes = diffDuration.minutes();
                            var seconds = diffDuration.seconds();
                            var time =
                                (hours < 10 ? '0' + hours : hours) +
                                ':' +
                                (minutes < 10 ? '0' + minutes : minutes) +
                                ':' +
                                (seconds < 10 ? '0' + seconds : seconds);
                            setfullTime(time);
                        }
                    }
                } else {
                    setloading(false);
                    setinTime(null);
                    setModalVisible(false);
                    setlocationOut(null);
                    setactivityTime(null);
                    setloading(false);
                }
            })
            .catch(function (error) {
                setloading(false);
                setModalVisible(false);

                if (error?.response?.status == '401') {
                    Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: error.response.data.msg,
                        buttonText: 'Ok',
                        callback: () => [
                            AsyncStorage.removeItem('Token'),
                            AsyncStorage.removeItem('UserData'),
                            AsyncStorage.removeItem('UserLocation'),
                            navigation.navigate('Login'),
                        ],
                    });

                    setModalVisible(false);
                }
            });
    };

    const punch_out = async () => {
        setloading(true);
        const userData = await AsyncStorage.getItem('UserData');
        const userInfo = JSON.parse(userData);
        let company_id = userInfo?.company_id;
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(async location => {
                var lat = parseFloat(location.latitude);
                var long = parseFloat(location.longitude);
                // console.log('loc-->', lat, long);
                const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
                const address = await axios.get(urlAddress)
                // console.log(address.data?.results[0].formatted_address, 'address.data?.results[0].formatted_address')
                setcurrentLocation({
                    long: long,
                    lat: lat,
                });
                let locations = { userId: userInfo?.userid, location: { longitude: long, latitude: lat } }
                var dis = getDistance(
                    { latitude: lat, longitude: long },
                    {
                        latitude: activeLocation.latitude,
                        longitude: activeLocation.longitude,
                    },
                );

                if (radius <= 0) {
                    const token = await AsyncStorage.getItem('Token');
                    const config = {
                        headers: { Token: token },
                    };
                    const body = {
                        user_id: user.userid,
                        employee_number: user.employee_number,
                        email: user.email,
                        location_id: activeLocation.location_id,
                        latitude: lat,
                        longitude: long,
                        current_address: address.data?.results[0]?.formatted_address,
                    };
                    // console.log("current address............................punch out...........................", body)
                    axios
                        .post(`${apiUrl}/secondPhaseApi/mark_attendance_out`, body, config)
                        .then(function (response) {
                            if (response.data.status == 1) {
                                check_punchIn();
                                EndBackgroundService()
                            } else {
                                setloading(false);
                            }
                        })
                        .catch(function (error) {
                            if (error.response.status == '401') {
                                Popup.show({
                                    type: 'Warning',
                                    title: 'Warning',
                                    button: true,
                                    textBody: error.response.data.msg,
                                    buttonText: 'Ok',
                                    callback: () => [
                                        AsyncStorage.removeItem('Token'),
                                        AsyncStorage.removeItem('UserData'),
                                        AsyncStorage.removeItem('UserLocation'),
                                        navigation.navigate('Login'),
                                    ],
                                });
                            }
                        });
                }
                else if (radius > 0) {
                    if (radius >= dis) {
                        const token = await AsyncStorage.getItem('Token');
                        const config = {
                            headers: { Token: token },
                        };
                        const body = {
                            user_id: user.userid,
                            employee_number: user.employee_number,
                            email: user.email,
                            location_id: activeLocation.location_id,
                            latitude: lat,
                            longitude: long,
                            current_address: address.data?.results[0]?.formatted_address,
                        };
                        // console.log("current address............................punch out...........................", body)
                        axios
                            .post(`${apiUrl}/secondPhaseApi/mark_attendance_out`, body, config)
                            .then(function (response) {
                                if (response.data.status == 1) {
                                    check_punchIn();
                                    EndBackgroundService()
                                } else {
                                    setloading(false);
                                }
                            })
                            .catch(function (error) {
                                if (error.response.status == '401') {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: error.response.data.msg,
                                        buttonText: 'Ok',
                                        callback: () => [
                                            AsyncStorage.removeItem('Token'),
                                            AsyncStorage.removeItem('UserData'),
                                            AsyncStorage.removeItem('UserLocation'),
                                            navigation.navigate('Login'),
                                        ],
                                    });
                                }
                            });
                    } else {
                        if (lat == null || lat == '') {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Location not find',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });

                            setloading(false);
                            return;
                        } else if (long == null || long == '') {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Location not find',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });
                            setloading(false);
                            return;
                        } else if (
                            activeLocation.latitude == null ||
                            activeLocation.latitude == ''
                        ) {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Please set active location',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });

                            setloading(false);
                            return;
                        } else if (
                            activeLocation.longitude == null ||
                            activeLocation.longitude == ''
                        ) {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Please set active location',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });
                            setloading(false);
                            return;
                        }
                        if (radius >= dis) {
                            const token = await AsyncStorage.getItem('Token');
                            const config = {
                                headers: { Token: token },
                            };
                            const body = {
                                user_id: user.userid,
                                employee_number: user.employee_number,
                                email: user.email,
                                location_id: activeLocation.location_id,
                                latitude: lat,
                                longitude: long,
                                current_address: address.data?.results[0].formatted_address,
                            };
                            axios
                                .post(
                                    `${apiUrl}/secondPhaseApi/mark_attendance_out`,
                                    body,
                                    config,
                                )
                                .then(function (response) {
                                    if (response.data.status == 1) {
                                        check_punchIn();
                                        EndBackgroundService()
                                    } else {
                                        setloading(false);
                                    }
                                })
                                .catch(function (error) {
                                    if (error.response.status == '401') {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: error.response.data.msg,
                                            buttonText: 'Ok',
                                            callback: () => [
                                                AsyncStorage.removeItem('Token'),
                                                AsyncStorage.removeItem('UserData'),
                                                AsyncStorage.removeItem('UserLocation'),
                                                navigation.navigate('Login'),
                                            ],
                                        });
                                    }
                                });
                        } else {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'You are not in the radius',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });

                            setloading(false);
                        }
                    }
                }
                else {
                    if (lat == null || lat == '') {
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: 'Location not find',
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()],
                        });

                        setloading(false);
                        setDisabledBtn(false)
                        return;
                    } else if (long == null || long == '') {
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: 'Location not find',
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()],
                        });
                        setloading(false);
                        setDisabledBtn(false)
                        return;
                    } else if (
                        activeLocation.latitude == null ||
                        activeLocation.latitude == ''
                    ) {
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: 'Please set active location',
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()],
                        });
                        setloading(false);
                        setDisabledBtn(false)
                        return;
                    } else if (
                        activeLocation.longitude == null ||
                        activeLocation.longitude == ''
                    ) {
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: 'Please set active location',
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()],
                        });
                        setloading(false);
                        setDisabledBtn(false)
                        return;
                    }

                    if (radius <= 0) {
                        const token = await AsyncStorage.getItem('Token');
                        const userData = await AsyncStorage.getItem('UserData');
                        const userInfo = JSON.parse(userData);

                        const config = {
                            headers: { Token: token },
                        };
                        const body = {
                            email: userInfo.email,
                            location_id: activeLocation.location_id,
                            latitude: lat,
                            longitude: long,
                            login_type: 'mobile',
                            current_address: address.data?.results[0].formatted_address,
                        };
                        axios
                            .post(
                                `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                body,
                                config,
                            )
                            .then(function (response) {
                                if (response.data.status == 1) {
                                    check_punchIn();
                                    setloading(false);
                                    setDisabledBtn(false)
                                } else {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: response.data.message,
                                        buttonText: 'Ok',
                                        callback: () => [Popup.hide()],
                                    });

                                    setloading(false);
                                    setDisabledBtn(false)
                                }
                            })
                            .catch(function (error) {
                                setloading(false);
                                setDisabledBtn(false)
                                if (error.response.status == '401') {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: error.response.data.msg,
                                        buttonText: 'Ok',
                                        callback: () => [
                                            AsyncStorage.removeItem('Token'),
                                            AsyncStorage.removeItem('UserData'),
                                            AsyncStorage.removeItem('UserLocation'),
                                            navigation.navigate('Login'),
                                        ],
                                    });
                                }
                            });
                    }
                    else if (radius > 0) {
                        if (radius >= dis) {
                            const token = await AsyncStorage.getItem('Token');
                            const userData = await AsyncStorage.getItem('UserData');
                            const userInfo = JSON.parse(userData);

                            const config = {
                                headers: { Token: token },
                            };
                            const body = {
                                email: userInfo.email,
                                location_id: activeLocation.location_id,
                                latitude: lat,
                                longitude: long,
                                login_type: 'mobile',
                                current_address: address.data?.results[0].formatted_address,
                            };
                            axios
                                .post(
                                    `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                    body,
                                    config,
                                )
                                .then(function (response) {
                                    if (response.data.status == 1) {
                                        check_punchIn();
                                        setloading(false);
                                        setDisabledBtn(false)
                                    } else {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: response.data.message,
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()],
                                        });

                                        setloading(false);
                                        setDisabledBtn(false)
                                    }
                                })
                                .catch(function (error) {
                                    setloading(false);
                                    setDisabledBtn(false)
                                    if (error.response.status == '401') {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: error.response.data.msg,
                                            buttonText: 'Ok',
                                            callback: () => [
                                                AsyncStorage.removeItem('Token'),
                                                AsyncStorage.removeItem('UserData'),
                                                AsyncStorage.removeItem('UserLocation'),
                                                navigation.navigate('Login'),
                                            ],
                                        });
                                    }
                                });
                        } else {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'You are not in the radius',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });
                            setloading(false);
                            setDisabledBtn(false)
                        }
                    }
                    else {
                        if (lat == null || lat == '') {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Location not find',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });

                            setloading(false);
                            setDisabledBtn(false)
                            return;
                        } else if (long == null || long == '') {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Location not find',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });
                            setloading(false);
                            setDisabledBtn(false)
                            return;
                        } else if (
                            activeLocation.latitude == null ||
                            activeLocation.latitude == ''
                        ) {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Please set active location',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });
                            setloading(false);
                            setDisabledBtn(false)
                            return;
                        } else if (
                            activeLocation.longitude == null ||
                            activeLocation.longitude == ''
                        ) {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'Please set active location',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });
                            setloading(false);
                            setDisabledBtn(false)
                            return;
                        }

                        if (radius >= dis) {
                            const token = await AsyncStorage.getItem('Token');
                            const userData = await AsyncStorage.getItem('UserData');
                            const userInfo = JSON.parse(userData);

                            const config = {
                                headers: { Token: token },
                            };
                            const body = {
                                email: userInfo.email,
                                location_id: activeLocation.location_id,
                                latitude: lat,
                                longitude: long,
                                login_type: 'mobile',
                                current_address: address.data?.results[0].formatted_address,
                            };
                            axios
                                .post(
                                    `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                    body,
                                    config,
                                )
                                .then(function (response) {
                                    if (response.data.status == 1) {
                                        check_punchIn();
                                        setloading(false);
                                        setDisabledBtn(false)
                                    } else {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: response.data.message,
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()],
                                        });

                                        setloading(false);
                                        setDisabledBtn(false)
                                    }
                                })
                                .catch(function (error) {
                                    setloading(false);
                                    setDisabledBtn(false)
                                    if (error.response.status == '401') {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: error.response.data.msg,
                                            buttonText: 'Ok',
                                            callback: () => [
                                                AsyncStorage.removeItem('Token'),
                                                AsyncStorage.removeItem('UserData'),
                                                AsyncStorage.removeItem('UserLocation'),
                                                navigation.navigate('Login'),
                                            ],
                                        });
                                    }
                                });
                        } else {
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: 'You are not in the radius',
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });

                            setloading(false);
                            setDisabledBtn(false)
                        }
                    }
                }
            })
            .catch(error => {
                setloading(false);
                const { code, message } = error;
                Popup.show({
                    type: 'Warning',
                    title: 'Warning',
                    button: true,
                    textBody: message,
                    buttonText: 'Ok',
                    callback: () => [Popup.hide()],
                });
            });
    };
    const punch_in = async () => {
        setDisabledBtn(true)
        setloading(true);
        if (Platform.OS == 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    GetLocation.getCurrentPosition({});
                    const userData = await AsyncStorage.getItem('UserData');
                    const userInfo = JSON.parse(userData);
                    let company_id = userInfo?.company_id;

                    GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 15000,
                    })
                        .then(async location => {
                            console.log("location>>>>>>>>>>>>>", location)
                            setloading(false);
                            var lat = parseFloat(location.latitude);
                            var long = parseFloat(location.longitude);
                            const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
                            const address = await axios.get(urlAddress)
                            // { Live tracking starting}
                            // sendLocation({
                            //   userId: userInfo?.userid,
                            //   location: {
                            //     longitude: long,
                            //     latitude: lat,
                            //   },
                            // });
                            // { Live tracking ending }
                            // console.log(address.data?.results[0]?.formatted_address)

                            setcurrentLocation({
                                long: long,
                                lat: lat,
                            });

                            var dis = getDistance(
                                { latitude: lat, longitude: long },
                                {
                                    latitude: activeLocation.latitude,
                                    longitude: activeLocation.longitude,
                                },
                            );

                            if (radius <= 0) {
                                const token = await AsyncStorage.getItem('Token');
                                const userData = await AsyncStorage.getItem('UserData');
                                const userInfo = JSON.parse(userData);

                                const config = {
                                    headers: { Token: token },
                                };
                                const body = {
                                    email: userInfo.email,
                                    location_id: activeLocation.location_id,
                                    latitude: lat,
                                    longitude: long,
                                    login_type: 'mobile',
                                    current_address: address.data?.results[0]?.formatted_address,

                                };
                                axios
                                    .post(
                                        `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                        body,
                                        config,
                                    )
                                    .then(function (response) {
                                        if (response.data.status == 1) {
                                            check_punchIn();
                                            // Popup.show({
                                            //     type: 'Success',
                                            //     title: 'Success',
                                            //     button: true,
                                            //     textBody: response.data.message,
                                            //     buttonText: 'Ok',
                                            //     callback: () => [Popup.hide()]
                                            // });
                                            setIsModalVisible(false)
                                            setShowKyc(false)
                                            setloading(false);
                                            setDisabledBtn(false)
                                            navigation.navigate('Home')

                                        } else {
                                            Popup.show({
                                                type: 'Warning',
                                                title: 'Warning',
                                                button: true,
                                                textBody: response.data.message,
                                                buttonText: 'Ok',
                                                callback: () => [Popup.hide()]
                                            });
                                            setShowKyc(false)
                                            setloading(false);
                                            setDisabledBtn(false)

                                        }
                                    })
                                    .catch(function (error) {
                                        console.log("error============>", error)
                                        setloading(false);
                                        setDisabledBtn(false)
                                        // if (error.response.status == '401') {
                                        //     Popup.show({
                                        //         type: 'Warning',
                                        //         title: 'Warning',
                                        //         button: true,
                                        //         textBody: error.response.data.msg,
                                        //         buttonText: 'Ok',
                                        //         callback: () => [
                                        //             AsyncStorage.removeItem('Token'),
                                        //             AsyncStorage.removeItem('UserData'),
                                        //             AsyncStorage.removeItem('UserLocation'),
                                        //             navigation.navigate('Login'),
                                        //         ],
                                        //     });
                                        // }
                                    });
                            }
                            else if (radius > 0) {
                                if (radius >= dis) {
                                    if (updatedfacereconization?.length > 0) {
                                        setShowCamera(true)
                                        setFirstImage(false)
                                    }
                                    else {
                                        const token = await AsyncStorage.getItem('Token');
                                        const userData = await AsyncStorage.getItem('UserData');
                                        const userInfo = JSON.parse(userData);

                                        const config = {
                                            headers: { Token: token },
                                        };
                                        const body = {
                                            email: userInfo.email,
                                            location_id: activeLocation.location_id,
                                            latitude: lat,
                                            longitude: long,
                                            login_type: 'mobile',
                                            current_address: address.data?.results[0]?.formatted_address,

                                        };
                                        axios
                                            .post(
                                                `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                                body,
                                                config,
                                            )
                                            .then(function (response) {
                                                if (response.data.status == 1) {
                                                    check_punchIn();
                                                    // Popup.show({
                                                    //     type: 'Success',
                                                    //     title: 'Success',
                                                    //     button: true,
                                                    //     textBody: response.data.message,
                                                    //     buttonText: 'Ok',
                                                    //     callback: () => [Popup.hide()]
                                                    // });
                                                    setShowKyc(false)
                                                    setloading(false);
                                                    setDisabledBtn(false)
                                                    setIsModalVisible(false)

                                                } else {
                                                    setloading(false);
                                                    setloading(false);
                                                    setDisabledBtn(false)
                                                    Popup.show({
                                                        type: 'Success',
                                                        title: 'Success',
                                                        button: true,
                                                        textBody: response.data.message,
                                                        buttonText: 'Ok',
                                                        callback: () => [Popup.hide()]
                                                    });
                                                    setShowKyc(false)

                                                }
                                            })
                                            .catch(function (error) {
                                                setloading(false);
                                                setDisabledBtn(false)
                                                if (error.response.status == '401') {
                                                    Popup.show({
                                                        type: 'Warning',
                                                        title: 'Warning',
                                                        button: true,
                                                        textBody: error.response.data.msg,
                                                        buttonText: 'Ok',
                                                        callback: () => [
                                                            AsyncStorage.removeItem('Token'),
                                                            AsyncStorage.removeItem('UserData'),
                                                            AsyncStorage.removeItem('UserLocation'),
                                                            navigation.navigate('Login'),
                                                        ],
                                                    });
                                                }
                                            });

                                    }
                                } else {
                                    if (lat == null || lat == '') {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: 'Location not find',
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()],
                                        });

                                        setloading(false);
                                        setDisabledBtn(false)
                                        return;
                                    } else if (long == null || long == '') {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: 'Location not find',
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()],
                                        });
                                        setloading(false);
                                        setDisabledBtn(false)
                                        return;
                                    } else if (
                                        activeLocation.latitude == null ||
                                        activeLocation.latitude == ''
                                    ) {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: 'Please set active location',
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()],
                                        });
                                        setloading(false);
                                        setDisabledBtn(false)
                                        return;
                                    } else if (
                                        activeLocation.longitude == null ||
                                        activeLocation.longitude == ''
                                    ) {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: 'Please set active location',
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()],
                                        });
                                        setloading(false);
                                        setDisabledBtn(false)
                                        return;
                                    }

                                    if (radius >= dis) {
                                        const token = await AsyncStorage.getItem('Token');
                                        const userData = await AsyncStorage.getItem('UserData');
                                        const userInfo = JSON.parse(userData);

                                        const config = {
                                            headers: { Token: token },
                                        };
                                        const body = {
                                            email: userInfo.email,
                                            location_id: activeLocation.location_id,
                                            latitude: lat,
                                            longitude: long,
                                            login_type: 'mobile',
                                            current_address: address.data?.results[0].formatted_address,
                                        };
                                        axios
                                            .post(
                                                `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                                body,
                                                config,
                                            )
                                            .then(function (response) {
                                                if (response.data.status == 1) {
                                                    check_punchIn();
                                                    Popup.show({
                                                        type: 'Success',
                                                        title: 'Success',
                                                        button: true,
                                                        textBody: response.data.message,
                                                        buttonText: 'Ok',
                                                        callback: () => [Popup.hide()]
                                                    });
                                                    setShowKyc(false)
                                                    setloading(false);
                                                    setDisabledBtn(false)
                                                } else {
                                                    Popup.show({
                                                        type: 'Warning',
                                                        title: 'Warning',
                                                        button: true,
                                                        textBody: response.data.message,
                                                        buttonText: 'Ok',
                                                        callback: () => [Popup.hide()]
                                                    });
                                                    setShowKyc(false)
                                                    setloading(false);
                                                    setDisabledBtn(false)
                                                }
                                            })
                                            .catch(function (error) {
                                                setloading(false);
                                                setDisabledBtn(false)
                                                if (error.response.status == '401') {
                                                    Popup.show({
                                                        type: 'Warning',
                                                        title: 'Warning',
                                                        button: true,
                                                        textBody: error.response.data.msg,
                                                        buttonText: 'Ok',
                                                        callback: () => [
                                                            AsyncStorage.removeItem('Token'),
                                                            AsyncStorage.removeItem('UserData'),
                                                            AsyncStorage.removeItem('UserLocation'),
                                                            navigation.navigate('Login'),
                                                        ],
                                                    });
                                                }
                                            });
                                    } else {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: 'You are not in the radius',
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()],
                                        });

                                        setloading(false);
                                        setDisabledBtn(false)
                                    }
                                }
                            }
                        })
                        .catch(error => {
                            const { code, message } = error;
                            Popup.show({
                                type: 'Warning',
                                title: 'Warning',
                                button: true,
                                textBody: message,
                                buttonText: 'Ok',
                                callback: () => [Popup.hide()],
                            });
                            setloading(false);
                            setDisabledBtn(false)
                        });
                } else {
                    Popup.show({
                        type: 'Warning',
                        title: 'Warning',
                        button: true,
                        textBody: 'Location permission denied',
                        buttonText: 'Ok',
                        callback: () => [Popup.hide()],
                    });

                    setloading(false);
                    setDisabledBtn(false)
                }
            } catch (err) {
                setloading(false);
                setDisabledBtn(false)
            }
        } else {
            try {
                GetLocation.getCurrentPosition({});
                const userData = await AsyncStorage.getItem('UserData');
                const userInfo = JSON.parse(userData);
                let company_id = userInfo?.company_id;

                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                })
                    .then(async location => {
                        setloading(false);
                        var lat = parseFloat(location.latitude);
                        var long = parseFloat(location.longitude);
                        const urlAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCAdzVvYFPUpI3mfGWUTVXLDTerw1UWbdg`;
                        const address = await axios.get(urlAddress)
                        // { Live tracking starting}
                        // sendLocation({
                        //   userId: userInfo?.userid,
                        //   location: {
                        //     longitude: long,
                        //     latitude: lat,
                        //   },
                        // });
                        // { Live tracking starting}

                        setcurrentLocation({
                            long: long,
                            lat: lat,
                        });

                        var dis = getDistance(
                            { latitude: lat, longitude: long },
                            {
                                latitude: activeLocation.latitude,
                                longitude: activeLocation.longitude,
                            },
                        );


                        if (radius <= 0) {
                            const token = await AsyncStorage.getItem('Token');
                            const userData = await AsyncStorage.getItem('UserData');
                            const userInfo = JSON.parse(userData);

                            const config = {
                                headers: { Token: token },
                            };
                            const body = {
                                email: userInfo.email,
                                location_id: activeLocation.location_id,
                                latitude: lat,
                                longitude: long,
                                login_type: 'mobile',
                                current_address: address.data?.results[0].formatted_address,
                            };

                            axios
                                .post(
                                    `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                    body,
                                    config,
                                )
                                .then(function (response) {
                                    if (response.data.status == 1) {
                                        check_punchIn();
                                        Popup.show({
                                            type: 'Success',
                                            title: 'Success',
                                            button: true,
                                            textBody: response.data.message,
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()]
                                        });
                                        setShowKyc(false)
                                        setDisabledBtn(false)
                                        setloading(false);
                                    } else {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: response.data.message,
                                            buttonText: 'Ok',
                                            callback: () => [Popup.hide()]
                                        });
                                        setShowKyc(false)

                                        setloading(false);
                                        setDisabledBtn(false)
                                    }
                                })
                                .catch(function (error) {
                                    setloading(false);
                                    setDisabledBtn(false)
                                    if (error.response.status == '401') {
                                        Popup.show({
                                            type: 'Warning',
                                            title: 'Warning',
                                            button: true,
                                            textBody: error.response.data.msg,
                                            buttonText: 'Ok',
                                            callback: () => [
                                                Popup.hide(),
                                                AsyncStorage.removeItem('Token'),
                                                AsyncStorage.removeItem('UserData'),
                                                AsyncStorage.removeItem('UserLocation'),
                                                navigation.navigate('Login'),
                                            ],
                                        });
                                    }
                                });
                        }
                        else if (radius > 0) {
                            if (radius >= dis) {
                                const token = await AsyncStorage.getItem('Token');
                                const userData = await AsyncStorage.getItem('UserData');
                                const userInfo = JSON.parse(userData);

                                const config = {
                                    headers: { Token: token },
                                };
                                const body = {
                                    email: userInfo.email,
                                    location_id: activeLocation.location_id,
                                    latitude: lat,
                                    longitude: long,
                                    login_type: 'mobile',
                                    current_address: address.data?.results[0].formatted_address,
                                };

                                axios
                                    .post(
                                        `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                        body,
                                        config,
                                    )
                                    .then(function (response) {
                                        if (response.data.status == 1) {
                                            check_punchIn();
                                            Popup.show({
                                                type: 'Success',
                                                title: 'Success',
                                                button: true,
                                                textBody: response.data.message,
                                                buttonText: 'Ok',
                                                callback: () => [Popup.hide()]
                                            });
                                            setShowKyc(false)
                                            setDisabledBtn(false)
                                            setloading(false);
                                        } else {
                                            Popup.show({
                                                type: 'Warning',
                                                title: 'Warning',
                                                button: true,
                                                textBody: response.data.message,
                                                buttonText: 'Ok',
                                                callback: () => [Popup.hide()]
                                            });
                                            setShowKyc(false)
                                            setloading(false);
                                            setDisabledBtn(false)
                                        }
                                    })
                                    .catch(function (error) {
                                        setloading(false);
                                        setDisabledBtn(false)
                                        if (error.response.status == '401') {
                                            Popup.show({
                                                type: 'Warning',
                                                title: 'Warning',
                                                button: true,
                                                textBody: error.response.data.msg,
                                                buttonText: 'Ok',
                                                callback: () => [
                                                    AsyncStorage.removeItem('Token'),
                                                    AsyncStorage.removeItem('UserData'),
                                                    AsyncStorage.removeItem('UserLocation'),
                                                    navigation.navigate('Login'),
                                                ],
                                            });
                                        }
                                    });
                            } else {
                                if (lat == null || lat == '') {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: 'Location not find',
                                        buttonText: 'Ok',
                                        callback: () => [Popup.hide()],
                                    });

                                    setloading(false);
                                    setDisabledBtn(false)
                                    return;
                                } else if (long == null || long == '') {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: 'Location not find',
                                        buttonText: 'Ok',
                                        callback: () => [Popup.hide()],
                                    });
                                    setloading(false);
                                    setDisabledBtn(false)
                                    return;
                                } else if (
                                    activeLocation.latitude == null ||
                                    activeLocation.latitude == ''
                                ) {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: 'Please set active location',
                                        buttonText: 'Ok',
                                        callback: () => [Popup.hide()],
                                    });

                                    setloading(false);
                                    setDisabledBtn(false)
                                    return;
                                } else if (
                                    activeLocation.longitude == null ||
                                    activeLocation.longitude == ''
                                ) {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: 'Please set active location',
                                        buttonText: 'Ok',
                                        callback: () => [Popup.hide()],
                                    });
                                    setloading(false);
                                    setDisabledBtn(false)
                                    return;
                                }

                                if (radius >= dis) {
                                    const token = await AsyncStorage.getItem('Token');
                                    const userData = await AsyncStorage.getItem('UserData');
                                    const userInfo = JSON.parse(userData);

                                    const config = {
                                        headers: { Token: token },
                                    };
                                    const body = {
                                        email: userInfo.email,
                                        location_id: activeLocation.location_id,
                                        latitude: lat,
                                        longitude: long,
                                        login_type: 'mobile',
                                        current_address: address.data?.results[0].formatted_address,
                                    };

                                    axios
                                        .post(
                                            `${apiUrl}/secondPhaseApi/mark_attendance_in`,
                                            body,
                                            config,
                                        )
                                        .then(function (response) {
                                            if (response.data.status == 1) {
                                                check_punchIn();
                                                Popup.show({
                                                    type: 'Success',
                                                    title: 'Success',
                                                    button: true,
                                                    textBody: response.data.message,
                                                    buttonText: 'Ok',
                                                    callback: () => [Popup.hide()]
                                                });
                                                setShowKyc(false)
                                                setDisabledBtn(false)
                                                setloading(false);
                                            } else {
                                                Popup.show({
                                                    type: 'Warning',
                                                    title: 'Warning',
                                                    button: true,
                                                    textBody: response.data.message,
                                                    buttonText: 'Ok',
                                                    callback: () => [Popup.hide()]
                                                });
                                                setShowKyc(false)

                                                setloading(false);
                                                setDisabledBtn(false)
                                            }
                                        })
                                        .catch(function (error) {
                                            setloading(false);
                                            setDisabledBtn(false)

                                            if (error.response.status == '401') {
                                                Popup.show({
                                                    type: 'Warning',
                                                    title: 'Warning',
                                                    button: true,
                                                    textBody: error.response.data.msg,
                                                    buttonText: 'Ok',
                                                    callback: () => [
                                                        AsyncStorage.removeItem('Token'),
                                                        AsyncStorage.removeItem('UserData'),
                                                        AsyncStorage.removeItem('UserLocation'),
                                                        navigation.navigate('Login'),
                                                    ],
                                                });
                                            }
                                        });
                                } else {
                                    Popup.show({
                                        type: 'Warning',
                                        title: 'Warning',
                                        button: true,
                                        textBody: 'You are not in the radius',
                                        buttonText: 'Ok',
                                        callback: () => [Popup.hide()],
                                    });

                                    setloading(false);
                                    setDisabledBtn(false)
                                }
                            }
                        }
                    })
                    .catch(error => {
                        const { code, message } = error;
                        Popup.show({
                            type: 'Warning',
                            title: 'Warning',
                            button: true,
                            textBody: message,
                            buttonText: 'Ok',
                            callback: () => [Popup.hide()],
                        });

                        setloading(false);
                        setDisabledBtn(false)
                    });
            } catch (err) {
                setloading(false);
                setDisabledBtn(false)
                // console.warn(err);
            }
        }
    };

    useEffect(() => {
        if (punchInApi.data != null) {
            // console.log('punchInApi.data--->', punchInApi.data);
            check_punchIn();
            Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: punchInApi.data.message,
                buttonText: 'Ok',
                callback: () => [Popup.hide()],
            });
        }
    }, [punchInApi.loading,]);

    useEffect(() => {
        if (punchOutApi.data != null) {
            // console.log('punchOutApi.data--->', punchOutApi.data);
            check_punchIn();
            Popup.show({
                type: 'Warning',
                title: 'Warning',
                button: true,
                textBody: punchOutApi.data.message,
                buttonText: 'Ok',
                callback: () => [Popup.hide()],
            });
        }
    }, [punchOutApi.loading]);

    useEffect(() => {
        setTimeout(function () {
            if (getActiveLocationApi.data != null) {
                let activeLocation = getActiveLocationApi?.data?.data?.map(i => {
                    if (i.active_status == 1) {
                        setactiveLocation({
                            latitude: i.latitude,
                            longitude: i.longitude,
                            address: i.address1,
                            location_id: i.location_id,
                        });
                    }
                });
            }
        }, 1500);
    }, [getActiveLocationApi.loading]);

    const [locationArray, setLocationArray] = useState([]);

    const storeLocation = async (location) => {
        if (timerOn && updatedlivetrackingaccess?.length > 0 && locationblock == 1 && activeinactivetracking == 1 && shouldTrackLocation.current) {
            try {
                console.log("5 sec ......")
                setLocationArray((prevLocations) => {
                    const updatedLocations = [...prevLocations, location];
                    AsyncStorage.setItem('CurrentLocation', JSON.stringify(updatedLocations));
                    return updatedLocations;
                });
            } catch (error) {
                console.error('Error storing location:', error);
            }
        } else {
            console.log('Location Tracking Blocked for this user');
        }
    };

    const sendStoredLocation = async () => {
        // console.log("1 mint........")
        if (timerOn && updatedlivetrackingaccess?.length > 0 && locationblock == 1 && activeinactivetracking == 1 && shouldTrackLocation.current) {
            try {
                const token = await AsyncStorage.getItem('Token');
                const config = {
                    headers: { Token: token },
                };
                const userData = await AsyncStorage.getItem('UserData');
                const userInfo = JSON.parse(userData);
                const storedLocation = await AsyncStorage.getItem('CurrentLocation');
                // console.log("json location........", storedLocation)
                if (storedLocation) {
                    const locations = JSON.parse(storedLocation).map((loc) => ({
                        latitude: loc.latitude.toString(),
                        longitude: loc.longitude.toString()
                    }));
                    const payload = {
                        user_id: userInfo?.userid,
                        locations
                    };
                    const response = await axios.post(
                        `${apiUrl}/secondPhaseApi/send_locations`,
                        payload, config
                    );
                    // console.error('Response from server:', response?.data);
                    await AsyncStorage.removeItem('CurrentLocation');
                    setLocationArray([]);
                } else {
                    // console.error('No stored location found.')
                    await AsyncStorage.removeItem('CurrentLocation');
                    setLocationArray([]);
                }
            } catch (error) {
                // console.error('Error sending stored location:', error);
                await AsyncStorage.removeItem('CurrentLocation');
                setLocationArray([]);
            }
        } else {
            console.log('Location Tracking Blocked for this user');
        }
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            return new Promise((resolve, reject) => {
                Geolocation.requestAuthorization('always')
                    .then((result) => {
                        // Handle the result or status if needed
                        resolve(result);
                    })
                    .catch((error) => {
                        // Handle any errors that might occur
                        reject(error);
                        return false;
                    });
            });
        }
        else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message:
                            "We need access to your location " +
                            "so we can provide location-based services.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );
                const backgroundGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                );

                if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Background location permission denied');
                    return false;
                }

                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
    };

    const previousLocationRef = useRef(null);

    startLocationTracking = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Location permission is required to fetch location.');
            setTracking(false);
            return;
        }

        watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLocation = { latitude, longitude };

                // console.log('position', position);

                // Calculate distance from previous location
                if (previousLocationRef.current) {
                    const distance = getDistance(previousLocationRef.current, newLocation);
                    if (distance > 10) {
                        console.log('distance is greater than 20 - new location', newLocation, distance);
                        console.log('distance is greater than 20 - previous location', previousLocationRef.current, distance);
                        previousLocationRef.current = newLocation;
                        setLocation(newLocation);
                        storeLocation(newLocation);
                    } else {
                        console.log('distance is less than 20 - new location', newLocation, distance);
                        console.log('distance is less than 20 - previous location', previousLocationRef.current, distance);
                    }
                } else {
                    // console.log('setting previous locations....');
                    previousLocationRef.current = newLocation;
                }
            },
            (error) => {
                console.error('Error getting location:', error);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 2,
                interval: 1000,
                maximumAge: 0,
                showLocationDialog: true,
            }
        );
    }

    const getDistance = (loc1, loc2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371e3; // Radius of Earth in meters

        const lat1 = toRad(loc1.latitude);
        const lat2 = toRad(loc2.latitude);
        const deltaLat = toRad(loc2.latitude - loc1.latitude);
        const deltaLon = toRad(loc2.longitude - loc1.longitude);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters

        return distance;
    };

    const shouldTrackLocation = useRef(false)

    useEffect(() => {
        setStartBackgroundTracking(() => startBackgroundService);
    }, [setStartBackgroundTracking]);

    useEffect(() => {
        async function fetchMyAPI() {
            const token = await AsyncStorage.getItem('Token');

            if (token && updatedlivetrackingaccess?.length > 0 && locationblock == 1 && activeinactivetracking == 1 && shouldTrackLocation.current) {
                startBackgroundService()
            } else {
                EndBackgroundService()
            }
        }
        fetchMyAPI()
    }, [timerOn, updatedlivetrackingaccess?.length, locationblock, activeinactivetracking])

    const EndBackgroundService = async () => {
        Geolocation.stopObserving()
        BackgroundService.on('expiration', () => { console.log('Background service is being closed :('); });
        await BackgroundService.stop()
    }

    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

    const startBackgroundService = async () => {
        const veryIntensiveTask = async (taskDataArguments) => {
            const { delay } = taskDataArguments;

            const cleanup = () => {
                // Clear watch and intervals
                if (watchId !== null) {
                    Geolocation.clearWatch(watchId);
                }
                if (sendInterval !== null) {
                    clearInterval(sendInterval);
                }
            };

            let sendInterval = null;
            let watchId = null;

            while (BackgroundService.isRunning(veryIntensiveTask)) {
                console.log("Running task...");

                if (timerOn) {
                    // Start location tracking
                    watchId = startLocationTracking();

                    // Send stored location periodically
                    sendInterval = setInterval(() => {
                        sendStoredLocation();
                    }, 60000);

                    // Wait for the specified delay before the next iteration
                    await sleep(delay);
                } else {
                    // Cleanup if timer is turned off
                    cleanup();
                    break; // Exit the loop if timer is turned off
                }
            }

            // Cleanup when the task is done
            cleanup();
        };

        const options = {
            taskName: 'HRJee Track Your Locations',
            taskTitle: 'HRJee Track Your Locations',
            taskDesc: 'Tracking started',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            linkingURI: 'yourSchemeHere://chat/jane',
            parameters: {
                delay: 5000, // Delay in milliseconds
            },
        };

        try {
            await BackgroundService.start(veryIntensiveTask, options);
        } catch (e) {
            console.error('Error starting background service:', e);
        }
    };


    console.log("modalkycpermissions--------->", modalkycpermissions)

    return (
        <>
            {
                showkyc ?
                    <>
                        <Root>
                            <RNCamera
                                ref={cameraRef}
                                style={styles.preview}
                                type={RNCamera.Constants.Type.front}
                                captureAudio={false}
                                onFacesDetected={handleFacesDetected}
                                onCameraReady={takePicture}
                                faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                            >
                                {/* <Progress.Circle size={30} progress={progress} width={200} /> */}
                                <Progress.Circle
                                    size={100}
                                    progress={progress}
                                    showsText={true}
                                    formatText={(progress) => `${Math.round(progress * 100)}%`}
                                    color={'#e3eefb'}
                                    style={{ marginVertical: 20 }}
                                />

                            </RNCamera>
                        </Root >
                    </>
                    :
                    <Root>

                        <>
                            <View style={{ flex: 1, backgroundColor: "#e3eefb", justifyContent: "center", }}>
                                <View style={{ alignSelf: "center", alignItems: "center" }}>
                                    <Text style={{ textAlign: "center", color: "#172B85", fontWeight: "500", fontSize: 15, marginBottom: 15 }}>Click on the button to make your attendance</Text>
                                    {/* Outer Circle */}
                                    <View style={styles.outerCircle}>
                                        {/* Middle Circle */}
                                        <View style={styles.middleCircle}>
                                            {/* Inner Circle with Gradient */}
                                            <TouchableOpacity
                                                disabled={disabledBtn == true ? true : false}
                                                onPress={() => {
                                                    if (updatedfacereconization?.length > 0) {
                                                        if (modalkycpermissions == 0) {
                                                            setIsModalVisible(true)
                                                        } else {
                                                            setShowKyc(true)
                                                        }

                                                    } else {
                                                        punch_in();
                                                        setShowKyc(false);
                                                    }
                                                }}
                                            >
                                                <LinearGradient
                                                    colors={['#FF5200', '#FF8F00', '#FF6700']} // Gradient colors
                                                    style={styles.innerCircle}
                                                >
                                                    <Text style={styles.buttonTextPUnchInPopup}>Punch In</Text>
                                                </LinearGradient>
                                                {loading ? <ActivityIndicator color="white" /> : null}
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            </View>
                            {modalVisible && (
                                <View
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 99,
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        position: 'absolute',
                                        flex: 1,
                                    }}>

                                </View>
                            )}
                            <Modal animationType="none" transparent={true} visible={modalVisible}>
                                <View
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 10,
                                        alignSelf: 'center',
                                    }}>
                                    <ActivityIndicator size="large" color="#0528A5" />
                                </View>
                            </Modal>
                        </>
                    </Root>

            }
        </>


    )
}

export default PunchINPage

const styles = StyleSheet.create({
    containerpunchinmodal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    text: {
        fontSize: 18,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#0052CC',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    outerCircle: {
        width: 380,
        height: 380,
        borderRadius: 200,
        backgroundColor: '#D3D3D3', // Light gray (Outermost border)
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    middleCircle: {
        width: 350,
        height: 350,
        borderRadius: 300,
        backgroundColor: '#FFFFFF', // White (Second border)
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 330,
        height: 330,
        borderRadius: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextPUnchInPopup: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text for the button
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
})
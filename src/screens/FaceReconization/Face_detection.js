import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {
  useState,
  useContext,
  useEffect,
  createContext,
  useRef,
} from 'react';
import { FaceDetector, RNCamera } from 'react-native-camera';
import AWS, { Rekognition, S3 } from 'aws-sdk';
import * as Progress from 'react-native-progress';
import Modal from "react-native-modal";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../../reusable/apiUrl';
import { Root, Popup } from 'popup-ui';
import { SocketContext } from '../../tracking/SocketContext';
import {accessKeyId, secretAccessKey, region} from "@env"



const Face_detection = ({ navigation }) => {
  // console.log("here ia m", accessKeyId, secretAccessKey, region)
  const [firstImage, setFirstImage] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [faceKYCImg, setFaceKYCImg] = useState();
  const [progress, setProgress] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const [suggestion, setSuggestion] = useState(false);
  const [faceLoader, setFaceLoader] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { employeeNumber } = useContext(SocketContext);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isMounted, setIsMounted] = useState(true);


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

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);


  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      const cameraWidth = 400; // Replace with actual camera width
      const cameraHeight = 600; // Replace with actual camera height

      // Define the frame boundaries in pixels
      const frameBounds = {
        top: cameraHeight * 0.25,
        left: cameraWidth * 0.10,
        width: cameraWidth * 0.80,
        height: cameraHeight * 0.40,
      };

      const frameRect = {
        top: frameBounds.top,
        left: frameBounds.left,
        right: frameBounds.left + frameBounds.width,
        bottom: frameBounds.top + frameBounds.height,
      };

      const isFaceInFrame = faces.some(face => {
        const faceBounds = face.bounds; // Make sure this structure is correct

        // Check if the face is within the static frame
        return (
          faceBounds.origin.x >= frameRect.left &&
          faceBounds.origin.x + faceBounds.size.width <= frameRect.right &&
          faceBounds.origin.y >= frameRect.top &&
          faceBounds.origin.y + faceBounds.size.height <= frameRect.bottom
        );
      });

      if (isFaceInFrame) {
        setDetecting(true);
        setProgress(0);
        // Your progress logic here
      } else {
        setDetecting(false);
        setProgress(0);
      }
    } else {
      setDetecting(false);
      setProgress(0);
    }
  };

  const updateProfile = async (key) => {
    const token = await AsyncStorage.getItem('Token');
    const data = new FormData();
    data.append('face_kyc', '1');
    data.append('face_kyc_img', key);

    try {
      const response = await fetch(`${apiUrl}/SecondPhaseApi/update_face_kyc`, {
        method: 'POST',
        headers: {
          'Token': token,
          Accept: 'application/json',
        },
        body: data,
      });
      const result = await response.json();
      if (isMounted) {
        setFaceLoader(false);
        setSuggestion(true);
        setProgress(1);
        Popup.show({
          type: 'Success',
          title: 'Success',
          button: true,
          textBody: result.message,
          buttonText: 'Ok',
          callback: () => {
            Popup.hide();
            navigation.navigate('Home', { success });
          },
        });
      }
    } catch (error) {
      setLoading(false);
      setProgress(0);
    }
  };

  const UploadTake = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(data.uri);
      const response = await firstTimeUploadImage(data.uri);
      await updateProfile(response.key);
      setFaceLoader(true);
    }
  };

  const firstTimeUploadImage = async (uri) => {
    setFaceLoader(true);
    const response = await fetch(uri);
    const blob = await response.blob();

    const rekognitionParams = {
      Image: {
        Bytes: await blobToArrayBuffer(blob),
      },
      Attributes: ['ALL'],
    };

    const rekognitionResponse = await rekognition.detectFaces(rekognitionParams).promise();
    const facesWithEyeContact = rekognitionResponse.FaceDetails.filter(face => {
      const eyesOpen = face.EyesOpen && face.EyesOpen.Value;
      const yaw = face.Pose.Yaw;
      const pitch = face.Pose.Pitch;
      return eyesOpen && Math.abs(yaw) < 20 && Math.abs(pitch) < 20;
    });

    // Check if more than one face is detected
    if (rekognitionResponse.FaceDetails.length > 1) {
      setFaceLoader(false);
      showPopup('Warning', 'Multiple faces detected. Please ensure only one face is in the image for KYC verification.');
      return;
    }

    if (rekognitionResponse.FaceDetails.length === 0) {
      setFaceLoader(false);
      showPopup('Warning', 'No human faces detected. Upload aborted.');
      return;
    }

    if (facesWithEyeContact.length === 0) {
      setFaceLoader(false);
      showPopup('Warning', 'No front-facing faces with eye contact detected. Upload aborted.');
      return;
    }

    const params = {
      Bucket: 'face-recoginition',
      Key: `face_detection_kyc/${employeeNumber}.jpg`,
      Body: blob,
      ContentType: 'image/jpeg',
    };

    return s3.upload(params).promise();
  };


  const blobToArrayBuffer = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  };

  const showPopup = (type, message) => {
    Popup.show({
      type,
      title: type,
      button: true,
      textBody: message,
      buttonText: 'Ok',
      callback: () => {
        Popup.hide();
        navigation.navigate('Home');
      },
    });
  };


  return (
    <Root>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <RNCamera
          ref={cameraRef}
          style={[styles.preview, { backgroundColor: 'transparent' }]} // Make background transparent
          type={RNCamera.Constants.Type.front}
          captureAudio={false}
          onFacesDetected={handleFacesDetected}
          onCameraReady={UploadTake}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
          trackingEnabled
        >
          {/* Render the overlay */}
          {/* <View style={styles.overlay} /> */}


          {/* Render Static Frame */}
          <View style={styles.staticFrame} />

          <Progress.Circle
            size={100}
            progress={progress}
            showsText={true}
            formatText={(progress) => `${Math.round(progress * 100)}%`}
            color={'#e3eefb'}
            style={{ marginVertical: 20 }}
            thickness={8}
          />

        </RNCamera>


      </View>
    </Root>

  )
}

export default Face_detection

const styles = StyleSheet.create({
  tinyLogo: {
    width: 60,
    height: 60,
    borderRadius: 100,
    // marginRight: 20,
    borderWidth: 1,
    borderColor: 'white',
    // backgroundColor: 'pink',
  },
  tinynews: {
    width: 180,
    height: 100,
    borderRadius: 10,
    resizeMode: 'contain',
    // marginRight: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 5,
    // backgroundColor: 'pink',
  },
  options: {
    width: 130,
    height: 160,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'cover',
  },
  options1: {
    width: 130,
    height: 160,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode: 'cover',
    marginHorizontal: 2,
    borderRadius: 10,
  },
  tinyLogo: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  profileFont: {
    color: 'white',
  },
  options: {
    width: 65,
    height: 65,
  },
  loader: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skill: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dashed',
    borderRadius: 5,
    backgroundColor: '#d3e3fd30',
    borderColor: '#0c57d0',
  },
  heading: { fontWeight: '700', fontSize: 16 },
  heading_grey: { fontSize: 14, color: 'grey', fontWeight: '300' },
  add_txt: { fontSize: 14, color: '#efad37', fontWeight: '600' },
  view_txt: { color: '#702963', fontWeight: 'bold' },
  weekDay: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 5,
  },
  recent_log_box: {
    width: responsiveWidth(96),
    marginTop: 15,
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '600',
  },
  display_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
  },
  btn_style: {
    marginTop: 30,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calender: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: "hidden",
    borderRadius: 10
  },
  capturedImage: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },

  facesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // width:200
  },
  faceBox: {
    position: "absolute",
    borderColor: 'rgba(255, 0, 0, 0.8)', // Change color to red for visibility
    borderWidth: 2,
    borderRadius: 50, // Make it circular
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background for face box
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  captureButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton: {
    fontSize: 14,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 20,
  },
  capturedImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  staticFrame: {
    position: 'absolute',
    top: '15%', // Adjust as per your static frame's top position
    left: '10%', // Adjust as per your static frame's left position
    width: '80%', // Width of the frame
    height: '60%', // Height of the frame
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 0, 0.8)', // Static frame color
    borderRadius: 10, // Rounded corners
    zIndex: 1, // Ensure it's below detected faces
  },
  warningText: {
    position: 'absolute',
    top: '5%', // Position it above the static frame
    left: '10%', // Align with the static frame
    color: 'red',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    zIndex: 2, // Ensure it appears above other elements
  },
  SuccessText: {
    position: 'absolute',
    top: '5%', // Position it above the static frame
    left: '10%', // Align with the static frame
    color: 'green',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    zIndex: 2, // Ensure it appears above other elements
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 0,
  },

});




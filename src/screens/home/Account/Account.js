// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';

// const Account = () => {
//   return (
//     <View>
//       <Text>Account</Text>
//     </View>
//   );
// };

// export default Account;

// const styles = StyleSheet.create({});






const blobToArrayBuffer = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // result is an ArrayBuffer
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

const FirstTimeUploadImage = async (uri) => {
  const date = new Date();
  const day = date.getDate();
  const response = await fetch(uri);
  const blob = await response.blob();

  // Convert blob to ArrayBuffer
  const arrayBuffer = await blobToArrayBuffer(blob);

  // Prepare image for Rekognition
  const rekognitionParams = {
    Image: {
      Bytes: new Uint8Array(arrayBuffer), // Use Uint8Array instead
    },
  };

  // Detect faces
  const rekognitionResponse = await rekognition.detectFaces(rekognitionParams).promise();

  // Check if there are any faces detected
  if (rekognitionResponse.FaceDetails.length === 0) {
    return;
  }

  // Upload to S3
  const s3Params = {
    Bucket: 'face-recognition', // replace with your bucket name
    Key: `images/user/${day}.jpg`,
    Body: blob,
    ContentType: 'image/jpeg',
  };

  return s3.upload(s3Params).promise();
};
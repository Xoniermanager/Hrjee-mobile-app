import React, { useState } from 'react';
import { Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const UploadPDF = ({onUpload}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      // console.log(result,'result')
      onUpload(result)
      setSelectedFile(result);
    } catch (err) {
      // console.error(err);
      // Handle errors here (e.g., show an error message to the user)
    }
  };

  return (
  
    <Button title='Select PDF' onPress={pickPDF} /> 
  );
};

export default UploadPDF;
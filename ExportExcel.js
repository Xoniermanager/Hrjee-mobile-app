import React, { useState } from 'react';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { Button } from 'react-native';
import base64 from 'base64-js'; // Import base64-js library

const ExportExcel = ({ data }) => {
  const [isExporting, setIsExporting] = useState(false);
  const exportData = async () => {
    setIsExporting(true); // Assuming setIsExporting is a state setter function
  console.log(data,'data')
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data); // Ensure `data` is correctly formatted
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); // Use 'array' type for binary output
    
    const base64String = base64.fromByteArray(excelBuffer); // Convert array buffer to base64 string
    
    const filePath = `${RNFS.DocumentDirectoryPath}/data.xlsx`;
  
    try {
        
    const info=  await RNFS.writeFile(filePath, base64String, 'base64');
    console.log(info,'info')
      console.log('Excel exported successfully!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      // Handle error as needed (e.g., show error message to user)
    } finally {
      setIsExporting(false); // Reset export state
    }
  };

  return (

    <Button title= {isExporting ? 'Exporting...' : 'Export to Excel'} disabled={isExporting} onPress={exportData} /> 

  
  );
};

export default ExportExcel;

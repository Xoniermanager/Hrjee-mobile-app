// // PdfViewer.js
// import React, { useState } from 'react';
// import { WebView } from 'react-native-webview';
// import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
// import AntDesign from 'react-native-vector-icons/AntDesign'
// import Reload from '../../../Reload';


// const PdfViewer = ({ route, navigation }) => {
//   const { url } = route.params;
//   const [loading, setLoading] = useState(true);


//   return (
//     <>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <View style={{ flexDirection: 'row', padding: 10, marginTop: 5, marginBottom: 0 }}>
//             <AntDesign name='left' color='black' size={18} />
//             <Text style={{ color: '#000', fontWeight: 700 }}>  Back</Text>
//           </View>
//         </TouchableOpacity>
//         <View style={styles.container}>
//           {loading && (
//             <View style={styles.overlay}>
//               {/* <Text style={styles.loadingText}>Please wait, loading...</Text> */}
//               <Reload />
//             </View>
//           )}
//           <WebView
//             source={{ uri: url }}
//             style={styles.webView}
//             onLoadStart={() => setLoading(true)}
//             onLoadEnd={() => setLoading(false)}
//             onError={(e) => {
//               console.error('WebView Error:', e);
//               setLoading(false);  // Hide the loading message on error
//             }}
//           />
//         </View>
//     </>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'relative',
//   },
//   webView: {
//     flex: 1,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000, // Ensure the overlay is above the WebView
//   },
//   loadingText: {
//     fontSize: 16,
//     color: 'black',
//   },
// });

// export default PdfViewer;


// PdfViewer.js
import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, BackHandler } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Reload from '../../../Reload';

const PdfViewer = ({ route, navigation }) => {
  const { url } = route.params;
  const [loading, setLoading] = useState(true);

  // Handle Android back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove(); // Clean up on unmount
  }, []);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true; // Prevent default behavior
    }
    return false; // Let the system handle the back press
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name='left' color='black' size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.overlay}>
            <Reload />
          </View>
        )}

        <WebView
          source={{ uri: url }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(e) => {
            console.error('WebView Error:', e.nativeEvent.description);
            setLoading(false);
          }}
          // Disable caching for Android to prevent stale content issues
          cacheEnabled={Platform.OS === 'android' ? false : true}
          originWhitelist={['*']}
          allowsBackForwardNavigationGestures={true}
          startInLoadingState={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 5,
    marginBottom: 0,
  },
  backText: {
    color: '#000',
    fontWeight: '700',
  },
  webView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default PdfViewer;



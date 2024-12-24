import { Platform, StyleSheet } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
  } from 'react-native-responsive-dimensions';
import Themes from '../../Theme/Theme';
const LoginGuestStyle = StyleSheet.create({

    contanier: {
        flex: 1,
        backgroundColor:'#0E0E64'
      },
      Img_icon: {
        alignSelf: 'center',
        marginTop:30,
        height: responsiveHeight(25), width: responsiveWidth(45), resizeMode:"contain"
      },
      LoginGuest_Text: {
        textAlign: 'center',
        color: '#fff',
        fontSize:responsiveFontSize(3),
        fontWeight: '600',
        marginTop: 10,
      },
      Phone_number: {
        color: '#fff',
        fontSize: responsiveFontSize(1.8),
        fontWeight: '400',
        marginHorizontal: 40,
        marginTop: 10,
      },
      Input_Text: {
        width: responsiveWidth(79),
        borderRadius: 20,
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginTop: 7,
        padding: 10,
        color: '#000',
      },
      submit_button: {
        width: responsiveWidth(79),
        borderRadius: 20,
        alignSelf: 'center',
        backgroundColor: '#0433DA',
        marginTop: responsiveHeight(5),
        height: responsiveHeight(6.25),
        justifyContent: 'center',
        alignItems: 'center',
      },
      submit_text: {
        color: '#fff',
        fontSize: responsiveFontSize(2.1),
        fontWeight: '500',
      },
      account_text:{
        flexDirection:'row',
        marginTop:7,
        justifyContent:'center'
      },
      account:{
        color:'#000',
        fontSize:responsiveFontSize(1.87),
    
      },
      register_Text:{
        color:'#000',
        fontSize:responsiveFontSize(2),
        fontWeight:'600',
        textDecorationLine:'underline'
      },
      GuestLogin:{
        color:'#BA3028',
        fontSize:responsiveFontSize(2),
        fontWeight:'600',
        textDecorationLine:'underline'
      },
      forget:{
        fontSize:responsiveFontSize(1.5),
        textAlign:'right',
        fontWeight:'400',
        marginTop:10,
        color:'#fff',
        marginRight:35,
        textDecorationLine:'underline',
        
    },
    profileAdd:{
      width:responsiveWidth(30),
      height:responsiveHeight(15),
      borderWidth:1,
      borderColor:'#37496E',
      borderRadius:100,
     alignSelf:'center',
     position:'relative'
    },
    imges:{
      width:responsiveWidth(30),
      height:responsiveHeight(15),
      borderRadius:100,
      alignSelf:'center'
    },
    gallery:{
      width:30,
      height:30,
     
    },
    gallery_box:{
      position:'absolute',
      alignSelf:"flex-end"
    },
    error: {
      color: 'red',
      marginBottom: 8,
      textAlign:'center'
    },
    passInput:{
      width: responsiveWidth(79),
      borderRadius: 20,
      alignSelf: 'center',
      backgroundColor: '#fff',
      marginTop: 7,
      padding:Platform.OS === 'ios' ? 12 : 2,
      color: '#000',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'

    },
    InputPassword:{
      width: responsiveWidth(68),
      color: Themes == 'dark' ? '#000' : '#000'
    }

});

export default LoginGuestStyle;
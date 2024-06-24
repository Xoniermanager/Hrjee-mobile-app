import { FlatList, Image, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';

const UserList = () => {
    const navigation=useNavigation()
    const data = [{
        id: 1,
        fullName: "Aafreen Khan",
        timeStamp: "12:47 PM",
        recentText: "Good Day!",
        avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
      }, {
        id:2,
        fullName: "Sujitha Mathur",
        timeStamp: "11:11 PM",
        recentText: "Cheer up, there!",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id:3,
        fullName: "Anci Barroco",
        timeStamp: "6:22 PM",
        recentText: "Good Day!",
        avatarUrl: "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"
      }, {
        id:4,
        fullName: "Aniket Kumar",
        timeStamp: "8:56 PM",
        recentText: "All the best",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id: 5,
        fullName: "Kiara",
        timeStamp: "12:47 PM",
        recentText: "I will call today.",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
      },
      
      {
        id:6,
        fullName: "Sujitha Mathur",
        timeStamp: "11:11 PM",
        recentText: "Cheer up, there!",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id:7,
        fullName: "Anci Barroco",
        timeStamp: "6:22 PM",
        recentText: "Good Day!",
        avatarUrl: "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"
      }, {
        id:8,
        fullName: "Aniket Kumar",
        timeStamp: "8:56 PM",
        recentText: "All the best",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
      }, {
        id: 9,
        fullName: "Kiara",
        timeStamp: "12:47 PM",
        recentText: "I will call today.",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
      },
    ];
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
        <FlatList
        data={data}
        renderItem={(item,index)=>{
            console.log(item,'item')
            return (
                <TouchableOpacity style={styles.cart_box} onPress={()=>navigation.navigate('Maps')}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Image 
                    source={{uri:item?.item.avatarUrl}}
                    style={{width:85, height:responsiveHeight(10),}}
                    />
                    <Text style={{color:'#fff'}}>{item?.item.fullName}</Text>
                    <Text style={{marginRight:20,color:'#fff'}}>{item?.item?.timeStamp}</Text>


                            </View>
                    </TouchableOpacity>
            )
        }}
        />
    </View>
  )
}

export default UserList

const styles = StyleSheet.create({
    cart_box:{
        width:responsiveWidth(95),
        height:responsiveHeight(10),
        backgroundColor:'#0043ae',
        marginTop:5,
        alignSelf:'center'
    }
})
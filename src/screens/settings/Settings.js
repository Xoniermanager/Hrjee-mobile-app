import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Zocial from 'react-native-vector-icons/Zocial';
import LinearGradient from 'react-native-linear-gradient';

const Settings = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={{backgroundColor: 'white', margin: 10, borderRadius: 5}}>
          <View
            style={{
              padding: 10,
              backgroundColor: '#0321a4',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../../images/profile_pic.webp')}
                />
                <View>
                  <Text
                    style={[
                      styles.profileFont,
                      {fontSize: 20, fontWeight: 'bold'},
                    ]}>
                    Waseem Ahmad
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Entypo
                      name="location-pin"
                      size={17}
                      color="white"
                      style={{marginRight: 5}}
                    />
                    <Text style={styles.profileFont}>
                      Mobile Application Developer
                    </Text>
                  </View>
                </View>
              </View>
              {/* <Entypo
                name="edit"
                size={25}
                color="white"
                // onPress={() => navigation.navigate('About Myself')}
              /> */}
            </View>
          </View>
          <View style={{padding: 10}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePassword')}
              style={{
                marginTop: 30,
                backgroundColor: '#0321a4',
                padding: 15,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Change Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 30,
                // backgroundColor: '#702963',
                padding: 15,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#0321a4',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: '#0321a4', fontWeight: '600', fontSize: 15}}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
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

    // borderWidth: 1,
    // borderColor: 'white',
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
  heading: {fontWeight: '700', fontSize: 16},
  heading_grey: {fontSize: 14, color: 'grey', fontWeight: '300'},
  add_txt: {fontSize: 14, color: '#efad37', fontWeight: '600'},
  view_txt: {color: '#702963', fontWeight: 'bold'},
});

import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Platform} from 'react-native';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import BackgroundService from 'react-native-background-actions';
import {useNavigation} from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
const NotificationController = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(true);
  
  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };
  const setUPPlayer = async () => {
    TrackPlayer.setupPlayer()
  };
  const playBackgroundSound = async () => {
    try {
      //add track
      await TrackPlayer.add({
        // id: 'background-sound',
        url: require('./assets/yash.mp3'),
        title: 'Background Sound',
        artist: 'Your App',
        artwork: require('./assets/Login/LoginIcon.png'),
      });
      //play track
      await TrackPlayer.play();
      console.log('TrackPlayer has been play');
    } catch (error) {
      console.error('Error playing TrackPlayer:', error);
    }
  };


  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.ACTION_PRESS:
          handleActionPress(detail.pressAction.id);
          break;
        // Add more event types if needed
      }
    });
  }, []);
  const resetTrackPlayer = async () => {
    try {
      await TrackPlayer.reset();
      console.log('TrackPlayer has been reset');
    } catch (error) {
      console.error('Error resetting TrackPlayer:', error);
    }
  };
  const handleActionPress = async(actionId) => {
    if (actionId === 'dance') {
      await notifee.cancelNotification(notification.id);
      resetTrackPlayer()
      

      console.log('Accept button pressed');
      // Your logic for accept action
    } else if (actionId === 'cry') {
      // Handle reject action
      await notifee.cancelNotification(notification.id);

      resetTrackPlayer()
      console.log('Reject button pressed');
      // Your logic for reject action
    }
  };



// this code is used push notification comming

  async function onDisplayNotification(data) {
    await notifee.requestPermission({sound:true});

    const channelId = await notifee.createChannel({
      id: 'default10',
      name: 'Default Channel-10',
      sound:'yash',
      importance: AndroidImportance.HIGH,
    });
    console.log(channelId,'channelId')
    notifee.displayNotification({
      title: `<p style="color: #4caf50;"><b>${data?.notification.title}</span></p></b></p> &#128576`,
      subtitle: '&#129395;',
      body: data?.notification.body,
      android: {
        channelId,
        sound:'yash',
        color: '#4caf50',
        actions: [
          {
            title: '<b>Accept</b> &#128111;',
            pressAction: {id: 'dance'},
          },
          {
            title: '<p style="color: #f44336;"><b>reject</b> &#128557;</p>',
            pressAction: {id: 'cry'},
          },
        ],
      },
    });
   

  }

  async function onBacckotification(data) {
    if(data?.notification.title!=undefined){
      await notifee.requestPermission({sound:true});

      const channelId = await notifee.createChannel({
        id: 'default10',
        name: 'Default Channel-10',
        importance: AndroidImportance.HIGH,
      });
      notifee.displayNotification({
        title: `<p style="color: #4caf50;"><b>${data?.notification.title}</span></p></b></p> &#128576`,
        subtitle: '&#129395;',
        body: data?.notification.body,
        android: {
          channelId,
          color: '#4caf50',
          actions: [
            {
              title: '<b>Accept</b> &#128111;',
              pressAction: {id: 'dance'},
            },
            {
              title: '<p style="color: #f44336;"><b>reject</b> &#128557;</p>',
              pressAction: {id: 'cry'},
            },
          ],
        },
      });
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS) {
          const { pressAction, notification } = detail;
          
          if (pressAction.id === 'dance') {
            // Your custom logic here
            console.log('Notification action pressed:', pressAction.id);
            
            // Cancel the notification
            await notifee.cancelNotification(notification.id);
            resetTrackPlayer()
          }
          else if (pressAction.id === 'cry') {
            // Your custom logic here

            console.log('Notification action pressed:', pressAction.id);
            
            
            // Cancel the notification
            await notifee.cancelNotification(notification.id);
            resetTrackPlayer()
          }
        }
      });
      setTimeout(async()=>{
        await TrackPlayer.reset();
      },20000)
      setUPPlayer()
      playBackgroundSound()
   
    }
    
  }


  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
console.log('veryIntensiveTask')
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(i);
        await sleep(delay);
    
      
        const unsubscribe = messaging().setBackgroundMessageHandler(
          async remoteMessage => {
          onBacckotification(remoteMessage);
      
          },
        );
        messaging().onNotificationOpenedApp(remoteMessage => {
          setTimeout(async () => {
            const token = await AsyncStorage.getItem('token');
            const PRN = await AsyncStorage.getItem('PRN');

            if (token !== null) {
              if (PRN == 1) {
                navigation.navigate('PatientTabBar');
              } else {
                navigation.navigate('PRNTabBar');
              }
            }
          }, 2000);
        });

        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.notification,
              );
            }
          });
        
        return unsubscribe;
      }
    });
  };
  useEffect(async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    setUPPlayer()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
      console.log("app open")
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      setTimeout(async () => {
        const token = await AsyncStorage.getItem('token');
        const PRN = await AsyncStorage.getItem('PRN');

        if (token !== null) {
          if (PRN == 1) {
            navigation.navigate('PatientTabBar');
          } else {
            navigation.navigate('PRNTabBar');
          }
        }
      }, 2000);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return unsubscribe;
  }, []);

  return (
    <View>
      {/* <Button title="Display Notification" onPress={() => onDisplayNotification()} /> */}
    </View>
  );
};

export default NotificationController;

const styles = StyleSheet.create({});
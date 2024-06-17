import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import BackgroundService from 'react-native-background-actions';
import {useNavigation} from '@react-navigation/native';
const NotificationController = () => {
  const navigation = useNavigation();
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
  

  // this code is used push notification comming

  async function onDisplayNotification(data) {
    await notifee.requestPermission({sound:true});

    const channelId = await notifee.createChannel({
      id: 'default2',
      name: 'Default Channel-2',
      importance: AndroidImportance.HIGH,
      sound:'default'
    });
    console.log(channelId,'channelId')
    notifee.displayNotification({
      title: `<p style="color: #4caf50;"><b>${data?.notification.title}</span></p></b></p> &#128576`,
      subtitle: '&#129395;',
      body: data?.notification.body,
      android: {
        channelId,
        color: '#4caf50',
        sound:'default'
      },
    });
   

  }

  async function onBacckotification(data) {
    if(data?.notification.title!=undefined){
      await notifee.requestPermission({sound:true});
      const channelId = await notifee.createChannel({
        id: 'default2',
        name: 'Default Channel-2',
        importance: AndroidImportance.HIGH,
      });
      notifee.displayNotification({
        title: `<p style="color: #4caf50;"><b>${data?.notification.title}</span></p></b></p> &#128576`,
        subtitle: '&#129395;',
        body: data?.notification.body,
        android: {
          channelId,
          color: '#4caf50',
         
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
           
          }
          else if (pressAction.id === 'cry') {
            // Your custom logic here

            console.log('Notification action pressed:', pressAction.id);
            
            
            // Cancel the notification
            await notifee.cancelNotification(notification.id);
           
          }
        }
      });
   
   
    }
    
  }


    const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));
    const veryIntensiveTask = async taskDataArguments => {
    const {delay} = taskDataArguments;
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
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage,'remoteMessage')
      onDisplayNotification(remoteMessage);
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
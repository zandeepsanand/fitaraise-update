/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {requestUserPermission, onMessageReceived} from './FirebaseMessaging';
import { Block ,Image,Text} from '../components';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission
    requestUserPermission();

    // Retrieve notifications from AsyncStorage when the component mounts
    AsyncStorage.getItem('notifications').then((storedNotifications) => {
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    });

    // Handle received messages
    const unsubscribe = onMessageReceived(async (remoteMessage) => {
      console.log('Notification Data:', remoteMessage.data);
      console.log('Notification Notification:', remoteMessage.notification);
   

      // Update the state with the new notification
      const newNotification = {
        data: remoteMessage.data,
        notification: remoteMessage.notification,
      };

      setNotifications((prevNotifications) => {
        const updatedNotifications = [...prevNotifications, newNotification];

        // Store the updated notifications in AsyncStorage
        AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

        return updatedNotifications;
      });
    });

    return () => {
      // Clean up the subscription when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <Block safe marginTop={20}>
    <View style={{padding: 20}}>
    <Text  bold secondary size={15}  marginBottom={10} paddingLeft={20}>
      Today's
    </Text>
    {notifications.map((notification, index) => (
        <Block flex={0} height={95} key={index} card marginVertical={10}>
        <Block row>
          <Block
            flex={0}
            center
            width={60}
            height={60}
            radius={50}
            color={'#f0f0f8'}
            paddingLeft={18}
            marginTop={10}>
            <Image
              color={'green'}
              width={25}
              height={25}
              source={require('../assets/icons/bell2.png')}></Image>
          </Block>
          <Block flex={1} paddingLeft={20} paddingTop={15}>
            <Block flex={0} center>
              <Text p semibold>
              {notification.notification.title}
              </Text>
              <Text
                semibold
                secondary
                opacity={0.5}
                paddingTop={5}
                size={12}>
                {notification.notification.body}
              </Text>
            </Block>
          </Block>
          <Block flex={0} center paddingRight={10}>
            <TouchableOpacity>
             
                
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
     
    ))}
  </View>
    </Block>

  );
};

export default NotificationPage;

/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Switch } from 'react-native';
import { requestUserPermission, onMessageReceived } from './FirebaseMessaging';
import { Block, Image, Text } from '../components';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnableNotificationOnOff = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Default to true

  useEffect(() => {
    // Request permission
    requestUserPermission();

    // Retrieve notifications and enabled status from AsyncStorage when the component mounts
    AsyncStorage.multiGet(['notifications', 'notificationsEnabled']).then(
      ([storedNotifications, storedEnabledStatus]) => {
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications[1]));
        }

        if (storedEnabledStatus) {
          setNotificationsEnabled(JSON.parse(storedEnabledStatus[1]));
        }
      }
    );

    // Handle received messages only if notifications are enabled
    const unsubscribe = notificationsEnabled
      ? onMessageReceived(async (remoteMessage) => {
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
        })
      : () => {}; // No-op if notifications are disabled

    return () => {
      // Clean up the subscription when the component unmounts
      unsubscribe();
    };
  }, [notificationsEnabled]); // Run effect when notificationsEnabled changes

  const toggleNotifications = () => {
    setNotificationsEnabled((prevStatus) => {
      // Store the updated enabled status in AsyncStorage
      AsyncStorage.setItem('notificationsEnabled', JSON.stringify(!prevStatus));

      return !prevStatus;
    });
  };

  return (
    <Block safe marginTop={20}>
      <View style={{ padding: 20 }}>
        {/* <Text center bold size={20} marginBottom={30}>
          Notification
        </Text> */}

        {/* Toggle switch for enabling or disabling notifications */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text>Notifications:</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>

       
      </View>
    </Block>
  );
};

export default EnableNotificationOnOff;

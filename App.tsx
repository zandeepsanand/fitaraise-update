/* eslint-disable prettier/prettier */
import React, { useContext, useEffect } from 'react';
import 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import { DataProvider } from './src/hooks';
import AppNavigation from './src/navigation/App';
import LoginContext, { LoginProvider } from './src/hooks/LoginContext';
import * as NotificationsExpo from 'expo-notifications';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const { customerId } = useContext(LoginContext);
  console.log(customerId , "from main app.tsx");
  
  useEffect(() => {
    
    registerForPushNotifications();

    // Add a listener for received notifications
    const notificationListener = NotificationsExpo.addNotificationReceivedListener(notification => {
      // Handle received notification here
      console.log('Received notification:', notification);
    });

    // Add a listener for notification responses
    const responseListener = NotificationsExpo.addNotificationResponseReceivedListener(response => {
      // Handle notification response here
      console.log('Notification response:', response);
    });

    // Clean up the listeners when the component unmounts
    return () => {
      NotificationsExpo.removeNotificationSubscription(notificationListener);
      NotificationsExpo.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotifications() {
    try {
      const { status: existingStatus } = await NotificationsExpo.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await NotificationsExpo.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = (await NotificationsExpo.getExpoPushTokenAsync()).data;
      const device_token = token;
      console.log('Expo push token:', token);

      // Store the token in AsyncStorage for later use
      await AsyncStorage.setItem('expoPushToken', device_token);

      // Uncomment and complete this part to send the token to your server
      // await api.post('set_personal_datas', { customerId, device_token });

    } catch (error) {
      console.error('Error registering for push notificationsqq:', error.message, error.code);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // ...

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    let token = await NotificationsExpo.getExpoPushTokenAsync();
    console.log('Expo push token:', token);

    // ...
  }
  

  return (
    <LoginProvider>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </LoginProvider>
  );
}

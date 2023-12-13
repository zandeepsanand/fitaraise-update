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
import GoogleContext, { GoogleProvider } from './src/hooks/GoogleContext';



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
      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== 'granted') {
        // Request permissions if not granted
  
        
  const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== 'granted') {
        console.error('Failed to get push token for push notification!');
        return;
      }
  
      // Get Expo Push Token
      const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', expoPushToken);
  
      // Store token in AsyncStorage
      await AsyncStorage.setItem('expoPushToken', expoPushToken);
  
      // Send token to server (uncomment and complete)
      // await api.post('set_personal_datas', { customerId, expoPushToken });
    } catch (error) {
      console.error('Error registering for push notifications:', error);
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
    <GoogleProvider>
    <LoginProvider>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </LoginProvider>
    </GoogleProvider>
  );
}

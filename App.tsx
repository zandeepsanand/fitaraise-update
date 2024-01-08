/* eslint-disable prettier/prettier */
import React, {useContext, useEffect, useState} from 'react';
import 'react-native-gesture-handler';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import LoginContext, {LoginProvider} from './src/hooks/LoginContext';

import GoogleContext, {GoogleProvider} from './src/hooks/GoogleContext';
import {FavoritesProvider} from './src/hooks/FavoritesContext';

import messaging from '@react-native-firebase/messaging';
import {Alert, View, ActivityIndicator, AppState, Platform} from 'react-native';
import * as Permissions from 'expo-permissions';
import {Text, Block, Image} from './src/components';
import {HomeWorkoutProvider} from './src/hooks/HomeWorkoutContext';
import SplashScreen from 'react-native-splash-screen';
import {ChallengeDataProvider} from './src/hooks/ChallengeData';
import { GymDataProvider } from './src/hooks/GymData';

export default function App() {
  const [token1, setToken1] = useState(null);
 
  const {customerId} = useContext(LoginContext);

  console.log(customerId, 'from main app.tsx');

  useEffect(() => {
    getDeviceToken();
     requestPermission();
  }, []);
  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    console.log(token, 'token1');
    setToken1(token);
  };
  // console.log(token1);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    
    
    });

    return unsubscribe;
  }, []);

  const requestPermission = async () => {
    const authorized = await messaging().requestPermission();
    if (authorized) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  };
  useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  return (
    <GoogleProvider>
      <LoginProvider>
      <GymDataProvider>
      <ChallengeDataProvider>
          <FavoritesProvider>
            <HomeWorkoutProvider>
              <DataProvider>
                
                <AppNavigation />
              </DataProvider>
            </HomeWorkoutProvider>
          </FavoritesProvider>
        </ChallengeDataProvider>
      </GymDataProvider>
       
      </LoginProvider>
    </GoogleProvider>
  );
}

/* eslint-disable prettier/prettier */
// api.js
//web-app 261015350901-6q8aj2fbb82eutjmugdu9lkb91hnnel0.apps.googleusercontent.com
// ios 261015350901-vstjf25m9r7c8ef8k3rqocbtelae949a.apps.googleusercontent.com
// android 261015350901-p80gpfnhi2kfbu93o8dab43ks88c7ji2.apps.googleusercontent.com

import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: BASE_URL,
});

export const setAuthToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const isAuthTokenSet = async () => {
  try {
    const authDataJSON = await AsyncStorage.getItem('authData');
    // console.log('authDataJSON:', authDataJSON); // Log the retrieved data for debugging
    const authData = JSON.parse(authDataJSON);
    // console.log('authData:', authData); // Log the parsed data for debugging
    return !!authData && !!authData.token;
  } catch (error) {
    console.error('Error checking token in AsyncStorage:', error);
    return false;
  }
};

export default api;

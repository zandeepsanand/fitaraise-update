/* eslint-disable prettier/prettier */
// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    // Check for authData when the context is initialized
    const checkAuthData = async () => {
      const authDataJSON = await AsyncStorage.getItem('authData');
      if (authDataJSON) {
        const authData = JSON.parse(authDataJSON);
        setAuthData(authData);
        setAuthToken(authData.token);
      }
    };

    checkAuthData();
  }, []);

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

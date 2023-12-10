/* eslint-disable prettier/prettier */
import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../api'; // Import the setAuthToken function

type LoginContextValue = {
  customerId: number | null;
  isLoggedIn: boolean;
  authenticated: boolean; // Add authenticated state
  formData: {
    // Define formData structure
    first_name: string;
    last_name: string;
    id: number;
    customer_id:number;
    password: string;
    // ... other properties
  } | null;
  token: string | null; // Add token
  loginSuccess: (customerId: string, formData: any, token: string) => void; // Update loginSuccess
  logout: () => void;
};

const LoginContext = createContext<LoginContextValue>({
  customerId: null,
  authenticated: false, // Initialize authenticated state
  isLoggedIn: false,
  formData: null,
  token: null,
  loginSuccess: () => {},
  logout: () => {},
});

export const LoginProvider = ({children}) => {
  const [customerId, setCustomerId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState(null); // Initialize formData state
  const [token, setToken] = useState(null); // Initialize token state
  const [authenticated, setAuthenticated] = useState(false); // Initialize authenticated state
console.log(customerId , "login context");

  useEffect(() => {
    // Check for authentication status in AsyncStorage and update the authenticated state
    const checkAuthenticationStatus = async () => {
      try {
        const authDataJSON = await AsyncStorage.getItem('authData');
        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);
          const authToken = authData.token;
          const customerId=authData.customerId
          console.log('====================================');
          console.log(customerId,"tell me");
          console.log('====================================');
  
          if (authToken) {
            // User is authenticated
            setAuthenticated(true);
            setToken(authToken);
            setAuthToken(authToken);
  
            // You can also set other states like customerId and formData if needed
            // ...
          }
        } else {
          // User is not authenticated
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setAuthenticated(false);
      }
    };
  
    checkAuthenticationStatus();
  }, []);
   // Empty dependency array to run only once


   const loginSuccess = async (customerId, formData, token) => {
    try {
      // Convert customerId to a string before saving to AsyncStorage
      const customerIdString = customerId.toString();
  
      await AsyncStorage.setItem('customerId', customerIdString);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('formData', JSON.stringify(formData));
      await AsyncStorage.setItem('token', token);
  
      setCustomerId(customerIdString);
      setIsLoggedIn(true);
      setFormData(formData);
      setToken(token);
      setAuthToken(token);
      setAuthenticated(true);
  
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };
  
  const logout = async () => {
    try {
      // Clear the stored authentication data from AsyncStorage
      await AsyncStorage.multiRemove(['authData', 'workoutData', 'homeWorkout', 'customerId', 'formData','expoPushToken']);

      setCustomerId(null);
      // Clear any other necessary data or states
  
      // Optionally, you can clear the token if you have a setAuthToken function
      // setAuthToken(null);
  
      // Set the user as logged out
      setIsLoggedIn(false);
      // After logout, set authenticated to false
      setAuthenticated(false);
      
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        customerId,
        authenticated,
        isLoggedIn,
        formData,
        token,
        loginSuccess,
        logout,
      }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;

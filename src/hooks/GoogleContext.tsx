/* eslint-disable prettier/prettier */
import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../api'; // Import the setAuthToken function

type GoogleContextValue = {

  userInfo: string | null; // Add token
 
  googleloginSuccess: (userInfo: any) => void; // Update googleloginSuccess
  logoutGoogle: () => void;
};

const GoogleContext = createContext<GoogleContextValue>({

  userInfo: null,
 
  googleloginSuccess: () => {},
  logoutGoogle: () => {},
});

export const GoogleProvider = ({children}) => {

  const [userInfo, setUserInfo] = useState(null); // Initialize authenticated state


  useEffect(() => {
    // Check for authentication status in AsyncStorage and update the authenticated state
    const checkAuthenticationStatus = async () => {
      try {
        const authDataJSON = await AsyncStorage.getItem('userInfo');
        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);
       
  
  
          if (authData) {
           
            setUserInfo(authData);
  
            // You can also set other states like customerId and formData if needed
            // ...
          }
        } else {
          // User is not authenticated
        console.log('====================================');
        console.log("no google user found");
        console.log('====================================');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        
      }
    };
  
    checkAuthenticationStatus();
  }, []);
   // Empty dependency array to run only once


   const googleloginSuccess = async ( google ) => {
    try {
      // Convert customerId to a string before saving to AsyncStorage
console.log('====================================');
console.log(google , "google context ");
console.log('====================================');
  
      await AsyncStorage.setItem('userInfo', JSON.stringify(google));
      
     
  
     
      setUserInfo(google);
     
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };
  
  const logoutGoogle = async () => {
    try {
      // Clear the stored authentication data from AsyncStorage
      await AsyncStorage.multiRemove(['userInfo']);

      setUserInfo(null);
    
     
      
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <GoogleContext.Provider
      value={{
       userInfo,
       
        googleloginSuccess,
        logoutGoogle,
      }}>
      {children}
    </GoogleContext.Provider>
  );
};

export default GoogleContext;

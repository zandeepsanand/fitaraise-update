/* eslint-disable prettier/prettier */
// TabNavigator.js
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../../hooks';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// import DietPlan from '../screens/DietPlan';

import {Image} from 'react-native';

import LoadingScreen from '../../../navigation/LoadingScreen';
import ChallengeMain from './ChallengeMain';
import Account from '../../account/Account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreenDiet from './LoadingScreenDiet';

const workoutIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.10958 18.7714V15.7047C8.10956 14.9246 8.81161 14.2908 9.68145 14.2856H12.8677C13.7417 14.2856 14.4502 14.9209 14.4502 15.7047V18.7809C14.45 19.4432 15.0394 19.9845 15.7778 20H17.9019C20.0194 20 21.736 18.4607 21.736 16.5618V7.83784C21.7247 7.09083 21.3336 6.38935 20.6739 5.93303L13.4093 0.685301C12.1367 -0.228434 10.3275 -0.228434 9.05482 0.685301L1.82209 5.94256C1.15994 6.39702 0.768165 7.09967 0.76001 7.84736V16.5618C0.76001 18.4607 2.47659 20 4.5941 20H6.71826C7.47493 20 8.08833 19.4499 8.08833 18.7714" fill="#5D5FEF"/>
</svg>
`;
const Tab = createBottomTabNavigator();

const ChallengeTabNavigator = ({route}) => {
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const {challenge} = route.params ?? {};
  const [formData, setFormData] = useState([]);

  // useEffect(() => {
  //   const checkAuthenticationStatus = async () => {
  //     try {
  //       const authDataJSON = await AsyncStorage.getItem('authData');

  //       if (authDataJSON) {
  //         const authData = JSON.parse(authDataJSON);
  //         const authToken = authData.token;
  //         const customerId = authData.formData.customer_id;
  //         const userFormData = authData.formData;
  //         console.log(userFormData , "formdata challenge");
  //         // Update the state variable formData
  //         setFormData(userFormData);
  //       }
  //     } catch (error) {
  //       console.error('Authentication Status Error:', error);
  //       // Handle the error if needed
  //     }
  //   };

  //   checkAuthenticationStatus();
  // }, []);
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: '#97b4fe', // Set the active tab color to blue
        inactiveTintColor: 'gray', // Set the inactive tab color to gray
      }}>
      <Tab.Screen
        name="ChallengeMain"
        component={ChallengeMain}
        initialParams={{challenge}}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../../assets/icons/house.png')}
              style={{
                tintColor: color,
                width: size,
                height: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Loading"
        component={LoadingScreenDiet}
        options={{
          headerShown: false,

          tabBarLabel: 'Diet', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../../assets/icons/diet.png')} // Replace with your image source
              style={{tintColor: color, width: size, height: size}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Account}
        initialParams={{formData}}
        options={{
          headerShown: false,

          tabBarLabel: '', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../../assets/icons/user.png')} // Replace with your image source
              style={{tintColor: color, width: 20, height: 20}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ChallengeTabNavigator;

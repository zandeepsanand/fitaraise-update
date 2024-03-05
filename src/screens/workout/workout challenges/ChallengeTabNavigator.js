/* eslint-disable prettier/prettier */

import React, {useEffect, useState} from 'react';
import {useTheme} from '../../../hooks';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


import {Image} from 'react-native';


import ChallengeMain from './ChallengeMain';
import Account from '../../account/Account';

import LoadingScreenDiet from './LoadingScreenDiet';
import HomeWorkoutDietPlan from '../../../navigation/HomeWorkoutDietPlan';


const Tab = createBottomTabNavigator();

const ChallengeTabNavigator = ({route}) => {
  

  const {challenge} = route.params ?? {};
  const [formData, setFormData] = useState([]);


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
        component={HomeWorkoutDietPlan}
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
          headerShown: true,
          title: '',
          tabBarLabel: 'User', // Custom tab label
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

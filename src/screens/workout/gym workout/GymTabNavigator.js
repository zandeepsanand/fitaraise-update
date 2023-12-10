/* eslint-disable prettier/prettier */
// TabNavigator.js
import React from 'react';
import {useTheme} from '../../../hooks';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import DietPlan from '../screens/DietPlan';
import {Image} from 'react-native';
import {SvgXml} from 'react-native-svg';
import GymWorkoutMain from './GymWorkoutMain';
import Frstpage from '../../../navigation/Frstpage';
import Profile from '../../Profile';
const workoutIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.10958 18.7714V15.7047C8.10956 14.9246 8.81161 14.2908 9.68145 14.2856H12.8677C13.7417 14.2856 14.4502 14.9209 14.4502 15.7047V18.7809C14.45 19.4432 15.0394 19.9845 15.7778 20H17.9019C20.0194 20 21.736 18.4607 21.736 16.5618V7.83784C21.7247 7.09083 21.3336 6.38935 20.6739 5.93303L13.4093 0.685301C12.1367 -0.228434 10.3275 -0.228434 9.05482 0.685301L1.82209 5.94256C1.15994 6.39702 0.768165 7.09967 0.76001 7.84736V16.5618C0.76001 18.4607 2.47659 20 4.5941 20H6.71826C7.47493 20 8.08833 19.4499 8.08833 18.7714" fill="#5D5FEF"/>
</svg>
`;
const Tab = createBottomTabNavigator();

const GymTabNavigator = () => {
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  return (
    <Tab.Navigator
    screenOptions={{
        activeTintColor: '#97b4fe', // Set the active tab color to blue
        inactiveTintColor: 'gray', // Set the inactive tab color to gray
      }}>
      <Tab.Screen
        name="GymWorkoutMain"
        component={GymWorkoutMain}
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
        name="Frstpage"
        component={Frstpage}
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
        name="nutrition"
        component={Profile}
        options={{
          headerShown: false,

          tabBarLabel: 'Nutrition Facts', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../../assets/icons/book.png')} // Replace with your image source
              style={{tintColor: color, width: size, height: size}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: '', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../../assets/icons/user.png')} // Replace with your image source
              style={{tintColor: color, width: size, height: size}}
            />
          ),
        }}
      /> 
    </Tab.Navigator>
  );
};

export default GymTabNavigator;

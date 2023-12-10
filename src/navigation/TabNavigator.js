/* eslint-disable prettier/prettier */
// TabNavigator.js
import React, { useEffect } from 'react';
import {useTheme} from '../hooks';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DietPlan from '../screens/DietPlan';
import WorkoutFirstPage from '../screens/workout/WorkoutFirstPage';
import {Image} from '../components';
import Account from '../screens/account/Account';
import NotFoundPage from '../screens/error/ErrorPage';
import HomeWorkoutLoadingScreen from '../screens/workout/home workout/HomeWorkoutLoadingScreen';




const Tab = createBottomTabNavigator();

const TabNavigator = ({route}) => {
  const { data, formDataCopy, dietPlan } = route.params ?? {};
  console.log(formDataCopy, data, "menu drawer check");
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  
  useEffect(() => {
    // Navigate to the "Screens" screen when the Menu component is first loaded
    console.log(data.calories , "updatess diet plan tab");
    
    
   
  }, [data , dietPlan, formDataCopy]);
  const workoutData = formDataCopy;
 
  console.log(workoutData , "workout data");

  return (
    <Tab.Navigator 
    initialRouteName="pie" // Set the initial tab to "Home"
    screenOptions={{
        activeTintColor: '#97b4fe', // Set the active tab color to blue
        inactiveTintColor: 'gray', // Set the inactive tab color to gray
      }}>
      <Tab.Screen
        name="pie"
        component={DietPlan}
        initialParams={{ data,dietPlan,formDataCopy }}
        options={{
          headerShown: false,

          tabBarLabel: 'Home', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../assets/icons/house.png')} // Replace with your image source
              style={{
                tintColor: color,
                width: 20,
                height: 20,
                borderRadius: 0,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="fitness"
        component={WorkoutFirstPage}
        initialParams={{ workoutData }}
        options={{
          headerShown: false,

          tabBarLabel: 'Workout', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../assets/icons/gym.png')} // Replace with your image source
              style={{tintColor: color, width: 20, height: 20}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="nutrition"
        component={NotFoundPage}
        options={{
          headerShown: false,

          tabBarLabel: 'Nutrition Facts', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../assets/icons/book.png')} // Replace with your image source
              style={{tintColor: color, width: size, height: size}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Account}
        initialParams={{ formData:formDataCopy }}
        options={{
          headerShown: false,

          tabBarLabel: '', // Custom tab label
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../assets/icons/user.png')} // Replace with your image source
              style={{tintColor: color, width: 20, height: 20}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


// Wrap the DrawerNavigator inside a NavigationContainer

export default TabNavigator;

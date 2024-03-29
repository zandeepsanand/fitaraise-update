/* eslint-disable prettier/prettier */
// TabNavigator.js

import React, { useState,useEffect } from 'react';
import { useTheme } from '../hooks';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DietPlan from '../screens/DietPlan';
import WorkoutFirstPage from '../screens/workout/WorkoutFirstPage';
import { Image } from '../components';
import Account from '../screens/account/Account';
import NutritionFactsSearch from '../screens/nutritionFacts/NutritionFactsSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWorkoutPathContext } from '../hooks/WorkoutPathContext';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useIsFocused } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigator = ({navigation, route}) => {
  const { selectedWorkoutPath, setWorkoutPath } = useWorkoutPathContext();
  const { data, formDataCopy, dietPlan } = route.params ?? {};
  const { assets, colors, fonts, gradients, sizes } = useTheme();
  const [programmaticNavigation, setProgrammaticNavigation] = useState(false);
  const isFocused = useIsFocused();
  const workoutData = formDataCopy;

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      // Prevent default behavior
      e.preventDefault();

      // Handle tab press here
      handleTabPress();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, programmaticNavigation]);

  const handleTabPress = async () => {
    console.log("clicked tab");
    try {
      setProgrammaticNavigation(true);
      let workoutData2 = null;

      switch (selectedWorkoutPath) {
        case 'HomeTabNavigator':
          workoutData2 = await navigateToTab(
            'homeWorkoutData',
            'userDataHomeWorkout',
            'HomeWorkoutMain'
          );
          break;

        case 'GymTabNavigator':
          workoutData2 = await navigateToTab(
            'gymWorkoutData',
            'userDataGymWorkout',
            'GymWorkoutMain'
          );
          break;

        case 'ChallengeTabNavigator':
          workoutData2 = await navigateToTab(
            'challengeWorkoutData',
            'userDataChallengeWorkout',
            'ChallengeMain'
          );
          break;

        default:
          workoutData2 = formDataCopy;
          navigation.navigate('fitness', { workoutData });
          break;
      }
    } catch (error) {
      console.error('Error retrieving stored data:', error);
    } finally {
      setProgrammaticNavigation(false);
    }
  };

  const navigateToTab = async (workoutDataKey, userDataKey, screenName) => {
    const storedWorkoutData = await AsyncStorage.getItem(workoutDataKey);
    const storedUserData = await AsyncStorage.getItem(userDataKey);

    if (storedWorkoutData && storedUserData) {
      const workoutData1 = JSON.parse(storedWorkoutData);
      const userData = JSON.parse(storedUserData);
      if (selectedWorkoutPath === 'HomeTabNavigator') {
        await AsyncStorage.setItem('lastHomePage', 'Workout');
        navigation.navigate(selectedWorkoutPath, {
          screen: screenName,
          params: { workout: workoutData1, workoutData: userData },
        });
      } else if (selectedWorkoutPath === 'GymTabNavigator') {
        await AsyncStorage.setItem('lastHomePage', 'Workout');
        navigation.navigate(selectedWorkoutPath, {
          screen: screenName,
          params: { data: workoutData1, formDataCopy: userData },
        });
      } else if (selectedWorkoutPath === 'ChallengeTabNavigator') {
        await AsyncStorage.setItem('lastHomePage', 'Workout');
      
        navigation.navigate('ChallengeTabNavigator', {
          screen: 'ChallengeMain',
          params: {challenge: workoutData1},
        });
        
      }

      return workoutData1;
    }

    return null;
  };

  return (
    <Tab.Navigator
    initialRouteName="pie"
    screenOptions={{
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor:'black',
     
    }}>
      <Tab.Screen
        name="pie"
        component={DietPlan}
        initialParams={{data, dietPlan, formDataCopy}}
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
                // backgroundColor:'gray'
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
        tabBarLabel: 'Workout',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('../assets/icons/gym.png')}
            style={{ tintColor: color, width: 20, height: 20 }}
          />
        ),
      }}
      
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          // Prevent default behavior
          e.preventDefault();
          // Call the handleTabPress function if it is defined
          if (typeof handleTabPress === 'function') {
            handleTabPress(navigation);
          } else {
            console.error('handleTabPress function is not defined');
          }
        },
      })}
    />
 
    
    
      <Tab.Screen
        name="nutrition"
        component={NutritionFactsSearch}
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
        initialParams={{formData: formDataCopy}}
        options={{
          headerShown: false,

          tabBarLabel: 'User', // Custom tab label
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

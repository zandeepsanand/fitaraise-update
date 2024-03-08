import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Animated, Easing } from 'react-native';
import Lottie from 'lottie-react-native';
import api, { setAuthToken } from '../../api';
import LoginContext from '../hooks/LoginContext';
import { useWorkoutPathContext } from '../hooks/WorkoutPathContext';

const LoadingScreen = () => {
  const navigation = useNavigation();
  const {selectedWorkoutPath} = useWorkoutPathContext();
  const { loginSuccess } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const animationProgress = new Animated.Value(0);

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const authDataJSON = await AsyncStorage.getItem('authData');
        const LastHome = await AsyncStorage.getItem('lastHomePage');

        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);
          const authToken = authData.token;
          const customerId = authData.formData.customer_id;
          const formData = authData.formData;

          loginSuccess(customerId, formData, authToken);
          
          if (authToken) {
            setAuthToken(authToken);
            const requiredCalorieResponse = await api.get(`get_daily_required_calories/${customerId}`);
            const dietListResponse = await api.get(`get_recommended_diet/${customerId}`);

            if (requiredCalorieResponse.data.success && dietListResponse.data.success && formData) {
              const requiredCalorie = requiredCalorieResponse.data.data;
              const dietPlan = dietListResponse.data.data.recommended_diet_list;

              if (LastHome) {
                const homePath = LastHome;
                if (homePath === 'DietPlan') {
                  const cachedDataJSON = await AsyncStorage.getItem('cachedData');
                  if (cachedDataJSON) {
                    const cachedData = JSON.parse(cachedDataJSON);
                    const { requiredCalorie1, dietPlan1 } = cachedData;
                    if (requiredCalorie && formData) {
                      await AsyncStorage.setItem('lastHomePage', 'DietPlan');
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Menu', params: { data: requiredCalorie, formDataCopy: formData, dietPlan: dietPlan } }],
                      });
                      return;
                    }
                  }
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Frstpage', params: { formData: formData } }],
                  });
                } else if (homePath === 'Workout') {
                  handleTabPress();
                  setIsLoading(true);
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Frstpage', params: { formData: formData } }],
                  });
                }
              }
            } else if (formData) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Frstpage', params: { formData: formData } }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'FirstPageCountrySelect' }],
              });
            }
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'FirstPageCountrySelect' }],
            });
          }
        } else {
          console.log("Failed to retrieve authData from AsyncStorage");
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication Status Error:', error);
        setIsLoading(false);
      }
    };

    checkAuthenticationStatus();
  }, [navigation,selectedWorkoutPath]);

  const handleTabPress = async () => {
    console.log(selectedWorkoutPath, "print");
    
    setIsLoading(true);
    try {
      let workoutData2 = null;

      switch (selectedWorkoutPath) {
        case 'HomeTabNavigator':
          workoutData2 = await navigateToTab('homeWorkoutData', 'userDataHomeWorkout', 'HomeWorkoutMain');
          break;
        case 'GymTabNavigator':
          workoutData2 = await navigateToTab('gymWorkoutData', 'userDataGymWorkout', 'GymWorkoutMain');
          break;
        case 'ChallengeTabNavigator':
          workoutData2 = await navigateToTab('challengeWorkoutData', 'userDataChallengeWorkout', 'ChallengeMain');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error retrieving stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToTab = async (workoutDataKey, userDataKey, screenName) => {
    const storedWorkoutData = await AsyncStorage.getItem(workoutDataKey);
    const storedUserData = await AsyncStorage.getItem(userDataKey);

    if (storedWorkoutData && storedUserData) {
      const workoutData1 = JSON.parse(storedWorkoutData);
      const userData = JSON.parse(storedUserData);

      if (selectedWorkoutPath === 'HomeTabNavigator') {
        navigation.navigate('HomeTabNavigator', { screen: screenName, params: { workout: workoutData1, workoutData: userData } });
      } else if (selectedWorkoutPath === 'GymTabNavigator') {
        navigation.navigate('GymTabNavigator', { screen: screenName, params: { data: workoutData1, formDataCopy: userData } });
      } else if (selectedWorkoutPath === 'ChallengeTabNavigator') {
        navigation.navigate('ChallengeTabNavigator', { screen: 'ChallengeMain', params: { challenge: workoutData1 } });
      }

      return workoutData1;
    }

    return null;
  };

  return (
    <View style={styles.loadingContainer}>
      {isLoading && (
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../assets/json/loader.json')}
          progress={animationProgress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;

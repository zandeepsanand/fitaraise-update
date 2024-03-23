import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import api, {setAuthToken} from '../../api';
import LoginContext from '../hooks/LoginContext';
import {useWorkoutPathContext} from '../hooks/WorkoutPathContext';

const LoadingScreen = () => {
  const navigation = useNavigation();
  const {selectedWorkoutPath} = useWorkoutPathContext();
  const {loginSuccess} = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCache, setIsLoadingCache] = useState(false);
  const animationProgress = new Animated.Value(0);
  const checkIfDataExists = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      if (allKeys.length > 0) {
        // Data exists
        console.log(allKeys, 'Data exists in AsyncStorage');
      } else {
        // No data
        console.log('No data in AsyncStorage');
      }
    } catch (error) {
      console.error('Error checking AsyncStorage:', error);
    }
  };
  useEffect(() => {
    checkIfDataExists();
  }, []);
  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const authDataJSON = await AsyncStorage.getItem('authData');
        const LastHome = await AsyncStorage.getItem('lastHomePage');
        const cachedDataJSON = await AsyncStorage.getItem('cachedData');
        const authData1 = JSON.parse(authDataJSON);
        const formData1 = authData1.formData;

        if (cachedDataJSON && authDataJSON && LastHome) {
          setIsLoadingCache(true);
          const authData = JSON.parse(authDataJSON);
          const authToken = authData.token;
          const customerId = authData.formData.customer_id;
          const formData = authData.formData;

          loginSuccess(customerId, formData, authToken);

          if (LastHome) {
            if (LastHome === 'DietPlan') {
              setIsLoadingCache(true);

              const cachedData = JSON.parse(cachedDataJSON);
              const DietPlanCache = cachedData.dietPlan;
              const RequiredCalorieCache = cachedData.requiredCalorie;
              const formDataCache = authData.formData;
              if (RequiredCalorieCache && formDataCache) {
                await AsyncStorage.setItem('lastHomePage', 'DietPlan');
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Menu',
                      params: {
                        data: RequiredCalorieCache,
                        formDataCopy: formDataCache,
                        dietPlan: DietPlanCache,
                      },
                    },
                  ],
                });
                setIsLoadingCache(false);
              }
            }
            if (LastHome === 'Workout') {
              handleTabPress();
              setIsLoading(true);
            }
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'Frstpage', params: {formData: formData1}}],
            });
          }
        } else if (authDataJSON) {
          setIsLoading(true);
          const authData = JSON.parse(authDataJSON);
          const authToken = authData.token;
          const customerId = authData.formData.customer_id;
          const formData = authData.formData;

          loginSuccess(customerId, formData, authToken);

          if (authToken) {
            setAuthToken(authToken);
            const requiredCalorieResponse = await api.get(
              `get_daily_required_calories/${customerId}`,
            );
            const dietListResponse = await api.get(
              `get_recommended_diet/${customerId}`,
            );
            console.log('====================================');
            console.log(requiredCalorieResponse.data.data);
            console.log(dietListResponse.data.data);
            console.log('====================================');

            if (LastHome) {
              console.log(LastHome, 'home path');

              if (LastHome === 'DietPlan') {
                if (
                  requiredCalorieResponse.data.success &&
                  dietListResponse.data.success &&
                  formData
                ) {
                  const requiredCalorie = requiredCalorieResponse.data.data;
                  const dietPlan =
                    dietListResponse.data.data.recommended_diet_list;

                  if (requiredCalorie && formData) {
                    await AsyncStorage.setItem('lastHomePage', 'DietPlan');
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'Menu',
                          params: {
                            data: requiredCalorie,
                            formDataCopy: formData,
                            dietPlan: dietPlan,
                          },
                        },
                      ],
                    });
                    setIsLoading(false);
                    return;
                  } else {
                    navigation.reset({
                      index: 0,
                      routes: [
                        {name: 'Frstpage', params: {formData: formData}},
                      ],
                    });
                    setIsLoading(false);
                  }
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Frstpage', params: {formData: formData}}],
                  });
                  setIsLoading(false);
                }
              } else if (LastHome === 'Workout') {
                handleTabPress();
                setIsLoading(true);
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Frstpage', params: {formData: formData}}],
                });
              }
            } else {
              navigation.reset({
                index: 0,
                routes: [{name: 'Frstpage', params: {formData: formData}}],
              });
            }
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'FirstPageCountrySelect'}],
            });
          }
        } else {
          console.log('Failed to retrieve authData from AsyncStorage');
          navigation.reset({
            index: 0,
            routes: [{name: 'FirstPageCountrySelect'}],
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication Status Error:', error);
        setIsLoading(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'FirstPageCountrySelect'}],
        });
      }
    };

    checkAuthenticationStatus();
  }, [navigation, selectedWorkoutPath]);

  const handleTabPress = async () => {
    console.log(selectedWorkoutPath, 'print');

    setIsLoading(true);
    try {
      let workoutData2 = null;

      switch (selectedWorkoutPath) {
        case 'HomeTabNavigator':
          workoutData2 = await navigateToTab(
            'homeWorkoutData',
            'userDataHomeWorkout',
            'HomeWorkoutMain',
          );
          break;
        case 'GymTabNavigator':
          workoutData2 = await navigateToTab(
            'gymWorkoutData',
            'userDataGymWorkout',
            'GymWorkoutMain',
          );
          break;
        case 'ChallengeTabNavigator':
          workoutData2 = await navigateToTab(
            'challengeWorkoutData',
            'userDataChallengeWorkout',
            'ChallengeMain',
          );
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
        navigation.navigate('HomeTabNavigator', {
          screen: screenName,
          params: {workout: workoutData1, workoutData: userData},
        });
      } else if (selectedWorkoutPath === 'GymTabNavigator') {
        navigation.navigate('GymTabNavigator', {
          screen: screenName,
          params: {data: workoutData1, formDataCopy: userData},
        });
      } else if (selectedWorkoutPath === 'ChallengeTabNavigator') {
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
    <View style={styles.loadingContainer}>
      {isLoading && (
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../assets/json/loader.json')}
          autoPlay={true}
        />
      )}
      {isLoadingCache && (
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../assets/json/loader4.json')}
          autoPlay={true}
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
  backgroundAnimation: {
    width: 200,
    height: 200,
  },
});

export default LoadingScreen;

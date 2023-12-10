/* eslint-disable prettier/prettier */

import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import api, { setAuthToken } from '../../../../api';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';

const GymWorkoutLoadingScreen = ({route}) => {
  // const {workoutData} = route.params ;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const authDataJSON = await AsyncStorage.getItem('authData');
      

        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);

          const authToken = authData.token;
          // console.log('token');
          

          if (authToken) {
            setIsLoading(true);
            setAuthToken(authToken);
            // console.log(authToken, "token preview");
            

            try {
              const authData = JSON.parse(authDataJSON);
              const workoutDataJSON = authData.formData;
              const userData = await api.get(
                `get_personal_datas/${workoutDataJSON.customer_id}`,
              );
              const user = userData.data.data;
              console.log(user, "user data home workout loading");
              


              if (user.gender && user.gym_workout_level){
                const homeWorkout = await api.get(
                  `get_gym_workouts?gender=${user.gender}&level=${user.home_workout_level}`,
                );
                const gymWorkoutJSON = homeWorkout.data.data;
                console.log(gymWorkoutJSON);
                if (gymWorkoutJSON) {
                  console.log(gymWorkoutJSON , "workout data gym");
                  
                  
                  // Navigate to 'HomeTabNavigator' with homeWorkout and workoutData
                  navigation.navigate('GymTabNavigator', {
                    screen: 'GymWorkoutMain',
                    params: { data:gymWorkoutJSON, formDataCopy:user },
                  });
                } 
              }else {
                console.log('workout page');
                // Navigate to 'Gender' screen with workoutData
                navigation.navigate('GymGenderPage', {
                  workoutData: workoutDataJSON,
                });
              }
              

              // console.log(homeWorkoutJSON.data.data);

            
            } catch (error) {
              console.error('Error fetching stored data:', error);
            } finally {
              setIsLoading(false);
            }
          }
        } else {
          console.log('Token not available');
          navigation.reset({
            index: 0,
            routes: [{name: 'loginNew'}],
          });
        }
      } catch (error) {
        console.error('Authentication Status Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthenticationStatus();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* <ActivityIndicator size="large" color="#0000ff" /> */}
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../../../assets/json/loveloader.json')}
          progress={animationProgress.current}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GymWorkoutLoadingScreen;

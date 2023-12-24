/* eslint-disable prettier/prettier */

import React, {useContext, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import api, {setAuthToken} from '../../../../api';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import LoginContext from '../../../hooks/LoginContext';


const LoadingScreenDiet = () => {
  const navigation = useNavigation();
  const {loginSuccess,customerId} = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  console.log(api, 'api check');

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
        const requiredCalorieResponse = await api.get(
          `get_daily_required_calories/${customerId}`
        );
        const dietListResponse = await api.get(
          `get_recommended_diet/${customerId}`
        );
        const formDataResponse = await api.get(
          `get_personal_datas/${customerId}`
        );
  
        const requiredCalorie = requiredCalorieResponse.data.data;
        const dietPlan =
          dietListResponse.data.success &&
          dietListResponse.data.data.recommended_diet_list;
        const formData = formDataResponse.data.data;
        console.log(formData, "data print");
        
  
        if (requiredCalorieResponse.data.success && formData) {
          // Reset the navigation stack and navigate to 'Menu'
          navigation.navigate('Menu', {
            data: requiredCalorie,
            formDataCopy: formData,
            dietPlan,
          });
        } else if (formData) {
          // Reset the navigation stack and navigate to 'Frstpage'
          navigation.reset({
            index: 0,
            routes: [
              { name: 'Frstpage', params: { formData: formData } },
            ],
          });
        } else {
          // Reset the navigation stack and navigate to 'FirstPageCountrySelect'
          navigation.reset({
            index: 0,
            routes: [{ name: 'FirstPageCountrySelect' }],
          });
        }
      } catch (error) {
        // Handle errors, log or show a user-friendly message
        console.error('Error checking authentication status:', error);
      }
    };
  
    // Call the function
    checkAuthenticationStatus();
  }, [customerId]); // Make sure to pass an empty dependency array to run this effect only once
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* <ActivityIndicator size="large" color="#0000ff" /> */}
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../../../assets/json/loader.json')}
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

export default LoadingScreenDiet;

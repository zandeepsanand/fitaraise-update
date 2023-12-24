import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import api from '../../api';
import { Animated, Easing } from 'react-native';
import Lottie from 'lottie-react-native';
import LoginContext from '../hooks/LoginContext';

const HomeWorkoutDietPlan = () => {
  const navigation = useNavigation();
  const { customerId } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const requiredCalorieResponse = await api.get(`get_daily_required_calories/${customerId}`);
        const diet_List = await api.get(`get_recommended_diet/${customerId}`);
        const formDataData = await api.get(`get_personal_datas/${customerId}`);

        const requiredCalorie = requiredCalorieResponse.data.data;
        const dietPlan = diet_List.data.data.recommended_diet_list;
        const formData = formDataData.data.data;

        if (requiredCalorieResponse.data.success === true && formData) {
          // Reset the navigation stack and navigate to 'Menu'
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Menu',
                params: {
                  data: requiredCalorie,
                  formDataCopy: formData,
                  dietPlan,
                },
              },
            ],
          });
        } else if (formData) {
          // Reset the navigation stack and navigate to 'Details'
          navigation.reset({
            index: 0,
            routes: [{ name: 'Details', params: { formData: formData } }],
          });
        } else {
          // Reset the navigation stack and navigate to 'FirstPageCountrySelect'
          navigation.reset({
            index: 0,
            routes: [{ name: 'FirstPageCountrySelect' }],
          });
        }
      } catch (error) {
        console.error('Authentication Status Error:', error.message);
        // Handle error, set state, or perform any necessary actions
        // navigation.reset({ index: 0, routes: [{ name: 'FirstPageCountrySelect' }] });
      }
    };

    const onAnimationComplete = () => {
      setIsLoading(false);
      checkAuthenticationStatus();
    };

    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 2500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(onAnimationComplete);

    // Clean up animation listeners when the component is unmounted
    return () => {
      animationProgress.current.removeAllListeners();
    };
  }, [navigation, customerId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../assets/json/loader.json')}
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
  backgroundAnimation: {
    width: 200, // Adjust the width based on your design
    height: 200, // Adjust the height based on your design
  },
});

export default HomeWorkoutDietPlan;

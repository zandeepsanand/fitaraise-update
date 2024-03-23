import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import api from '../../api';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import LoginContext from '../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeWorkoutDietPlan = () => {
  const navigation = useNavigation();
  const {customerId} = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCache, setIsLoadingCache] = useState(false);
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {
    const fetchDataAndNavigate = async () => {
      try {
        // setIsLoading(true);
        console.log('clicked diet');

        const storedData = await AsyncStorage.getItem('cachedData');
        const authData = JSON.parse(await AsyncStorage.getItem('authData'));

        if (storedData) {
          setIsLoadingCache(true);
          const cachedData = JSON.parse(storedData);
          const requiredCalorie = cachedData.requiredCalorie;
          const dietPlan = cachedData.dietPlan;

          if (requiredCalorie && authData.formData) {
            try {
              await AsyncStorage.setItem('lastHomePage', 'DietPlan');
            } catch (error) {
              console.error('Error setting AsyncStorage item:', error);
            }
            setIsLoadingCache(false);
            navigation.navigate('Menu', {
              data: requiredCalorie,
              formDataCopy: authData.formData,
              dietPlan,
            });
          } else if (authData.formData) {
            navigation.navigate('Details', {formData: authData.formData});
            setIsLoadingCache(false);
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'loginNew'}],
            });
            setIsLoadingCache(false);
          }
        } else {
          setIsLoading(true);
          const requiredCalorieResponse = await api.get(
            `get_daily_required_calories/${customerId}`,
          );
          const dietListResponse = await api.get(
            `get_recommended_diet/${customerId}`,
          );
          const formDataResponse = await api.get(
            `get_personal_datas/${customerId}`,
          );

          const requiredCalorie = requiredCalorieResponse.data.data;
          const dietPlan = dietListResponse.data.data.recommended_diet_list;
          const formData = formDataResponse.data.data;
          await AsyncStorage.setItem(
            'cachedData',
            JSON.stringify({requiredCalorie, dietPlan}),
          );

          if (requiredCalorieResponse.data.success === true && formData) {
            await AsyncStorage.setItem('lastHomePage', 'DietPlan');

            navigation.navigate('Menu', {
              data: requiredCalorie,
              formDataCopy: formData,
              dietPlan,
            });
            setIsLoading(false);
          } else if (formData) {
            navigation.reset({
              index: 0,
              routes: [{name: 'Details', params: {formData: formData}}],
            });
            setIsLoading(false);
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'FirstPageCountrySelect'}],
            });
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in useEffect:', error);
        setIsLoading(false);
        setIsLoadingCache(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchDataAndNavigate();
    });

    return unsubscribe;
  }, [navigation, customerId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../assets/json/loader.json')}
          autoPlay={true}
        />
      </View>
    );
  }
  if (isLoadingCache) {
    return (
      <View style={styles.loadingContainer}>
        <Lottie
          style={styles.backgroundAnimation}
          source={require('../assets/json/loader4.json')}
          autoPlay={true}
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
    width: 150, // Adjust the width based on your design
    height: 150, // Adjust the height based on your design
  },
});

export default HomeWorkoutDietPlan;

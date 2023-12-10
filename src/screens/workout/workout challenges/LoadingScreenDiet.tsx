/* eslint-disable prettier/prettier */

import React, {useContext, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import api, {setAuthToken} from '../../../../api';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import LoginContext from '../../../hooks/LoginContext';
import * as Notifications from 'expo-notifications';

const LoadingScreenDiet = () => {
  const navigation = useNavigation();
  const {loginSuccess} = useContext(LoginContext);
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
        const authDataJSON = await AsyncStorage.getItem('authData');
        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);

          const authToken = authData.token;
          const customerId = authData.formData.customer_id;
          const formData = authData.formData;
          const token = authData.token;
          // Store the authData object as a JSON string in AsyncStorage
          // await AsyncStorage.setItem('authData', JSON.stringify(authData));
          // Use the loginSuccess method from LoginContext
          // setAuthToken(authData.token); // Set the token for future requests
          loginSuccess(customerId, formData, token);
          console.log(authToken, 'auth Data');
          if (authToken) {
            setAuthToken(authToken);
            const requiredCalorieResponse = await api.get(
              `get_daily_required_calories/${authData.formData.customer_id}`,
            );
            const diet_List = await api.get(
              `get_recommended_diet/${authData.formData.customer_id}`,
            );

            const requiredCalorie = requiredCalorieResponse.data.data;

            const dietPlan = diet_List.data.data.recommended_diet_list;
            console.log(requiredCalorie, 'calorie required');
            console.log(authData.formData, 'for workout example');

            // Now, register for push notifications and save the token to the database
            // const {status: existingStatus} =
            //   await Notifications.getPermissionsAsync();
            // let finalStatus = existingStatus;

            // if (existingStatus !== 'granted') {
            //   const {status} = await Notifications.requestPermissionsAsync();
            //   finalStatus = status;
            // }

            // if (finalStatus === 'granted') {
            //   const token = (await Notifications.getExpoPushTokenAsync()).data;
            //   console.log('Expo push token:', token);
            //   const device_token = token;
            //   const customer_id = customerId;

            //   // Save the token to your database using an API request
            //   // Example:
            //   await AsyncStorage.setItem('expoPushToken', device_token);
            //   const response = await api.post('set_personal_datas', {
            //     customer_id,
            //     device_token,
            //   });
            //   // Handle the response from your server as needed.
            //   console.log(
            //     response.data.data,
            //     'loading screen push notification to db',
            //   );

            //   // Continue with your navigation logic...
            // } else {
            //   console.log('Failed to get push token for push notification!');
            // }

            if (
              requiredCalorieResponse.data.success === true &&
              authData.formData
            ) {
              // Reset the navigation stack and navigate to 'Menu'
              // console.log("console ok");
              navigation.navigate('Menu', {
                data: requiredCalorie,
                formDataCopy: authData.formData,
                dietPlan,
              });
              // navigation.navigate({
              //   index: 0,
              //   // routes: [
              //   //   {name: 'Frstpage', params: {formData: authData.formData}},
              //   // ],
              //   routes: [{ name: 'Menu', params: { data: requiredCalorie, formDataCopy: authData.formData , dietPlan } }],
              // });
            } else if (authData.formData) {
              // console.log("console ok 1");
              // Reset the navigation stack and navigate to 'Frstpage'
              navigation.reset({
                index: 0,
                routes: [
                  {name: 'Frstpage', params: {formData: authData.formData}},
                ],
              });
            } else {
              // Reset the navigation stack and navigate to 'FirstPageCountrySelect'
              navigation.reset({
                index: 0,
                routes: [{name: 'FirstPageCountrySelect'}],
              });
            }
          } else {
            // No authToken, navigate to 'FirstPageCountrySelect'
            navigation.reset({
              index: 0,
              routes: [{name: 'FirstPageCountrySelect'}],
            });
          }
        } else {
          // authData JSON doesn't exist, navigate to 'FirstPageCountrySelect'
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
  }, [navigation]);

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

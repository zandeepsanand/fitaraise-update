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
  const [isLoading, setIsLoading] = useState(true);
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {
    const fetchDataAndNavigate = async () => {
      try {
        console.log('clicked diet');

        const storedData = await AsyncStorage.getItem('cachedData');
        const authData = JSON.parse(await AsyncStorage.getItem('authData'));

        if (storedData) {
          const cachedData = JSON.parse(storedData);
          const requiredCalorie = cachedData.requiredCalorie;
          const dietPlan = cachedData.dietPlan;

          setIsLoading(false);
          if (requiredCalorie && authData.formData) {
            navigation.navigate('Menu', {
              data: requiredCalorie,
              formDataCopy: authData.formData,
              dietPlan,
            });
          } else if (authData.formData) {
            navigation.navigate('Details', {formData: authData.formData});
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'loginNew'}],
            });
          }
          checkAuthenticationStatus(cachedData);
        } else {
          await startLoadingAnimation();

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
          if (requiredCalorieResponse.data.success === true && formData) {
            navigation.navigate('Menu', {
              data: requiredCalorie,
              formDataCopy: formData,
              dietPlan,
            });
          } else if (formData) {
            navigation.reset({
              index: 0,
              routes: [{name: 'Details', params: {formData: formData}}],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'FirstPageCountrySelect'}],
            });
          }

          onAnimationComplete();
        }
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    const startLoadingAnimation = () => {
      return new Promise((resolve) => {
        Animated.timing(animationProgress.current, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          resolve();
        });
      });
    };

    const checkAuthenticationStatus = (parsedData) => {
      onAnimationComplete();
    };

    const onAnimationComplete = () => {
      setIsLoading(false);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchDataAndNavigate();
    });

    return unsubscribe;
  }, [navigation, customerId]);

  // useEffect(() => {
  //   const fetchDataAndNavigate = async () => {
  //     try {
  //       console.log('clicked diet');

  //       const storedData = await AsyncStorage.getItem('cachedData');
  //       const authData = JSON.parse(await AsyncStorage.getItem('authData'));

  //       if (storedData) {
  //         const cachedData = JSON.parse(storedData);
  //         const requiredCalorie = cachedData.requiredCalorie;
  //         const dietPlan = cachedData.dietPlan;
  //         // Skip animation and proceed to the next step

  //         setIsLoading(false);
  //         if (requiredCalorie && authData.formData) {
  //           navigation.navigate('Menu', {
  //             data: requiredCalorie,
  //             formDataCopy: authData.formData,
  //             dietPlan,
  //           });
  //         } else if (authData.formData) {
  //           navigation.navigate('Details', {formData: authData.formData});
  //         } else {
  //           navigation.reset({
  //             index: 0,
  //             routes: [{name: 'loginNew'}],
  //           });
  //         }
  //         checkAuthenticationStatus(cachedData);
  //       } else {
  //         // Data is not available in AsyncStorage, proceed with API calls
  //         await startLoadingAnimation();

  //         const requiredCalorieResponse = await api.get(
  //           `get_daily_required_calories/${customerId}`,
  //         );
  //         const diet_List = await api.get(`get_recommended_diet/${customerId}`);
  //         const formDataData = await api.get(
  //           `get_personal_datas/${customerId}`,
  //         );

  //         const requiredCalorie = requiredCalorieResponse.data.data;
  //         const dietPlan = diet_List.data.data.recommended_diet_list;
  //         const formData = formDataData.data.data;
  //         if (requiredCalorieResponse.data.success === true && formData) {
  //           // Reset the navigation stack and navigate to 'Menu'
  //           navigation.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: 'Menu',
  //                 params: {
  //                   data: requiredCalorie,
  //                   formDataCopy: formData,
  //                   dietPlan,
  //                 },
  //               },
  //             ],
  //           });
  //         } else if (formData) {
  //           // Reset the navigation stack and navigate to 'Details'
  //           navigation.reset({
  //             index: 0,
  //             routes: [{name: 'Details', params: {formData: formData}}],
  //           });
  //         } else {
  //           // Reset the navigation stack and navigate to 'FirstPageCountrySelect'
  //           navigation.reset({
  //             index: 0,
  //             routes: [{name: 'FirstPageCountrySelect'}],
  //           });
  //         }

  //         onAnimationComplete(); // Proceed to the next step
  //       }
  //     } catch (error) {
  //       console.error('Error in useEffect:', error);
  //       // Handle error, set state, or perform any necessary actions
  //       // navigation.reset({ index: 0, routes: [{ name: 'FirstPageCountrySelect' }] });
  //     }
  //   };

  //   const startLoadingAnimation = () => {
  //     return new Promise((resolve) => {
  //       Animated.timing(animationProgress.current, {
  //         toValue: 1,
  //         duration: 2500,
  //         easing: Easing.linear,
  //         useNativeDriver: false,
  //       }).start(() => {
  //         resolve();
  //       });
  //     });
  //   };

  //   const checkAuthenticationStatus = (parsedData) => {
  //     // Your logic to handle the data from AsyncStorage
  //     // ...

  //     onAnimationComplete(); // Proceed to the next step
  //   };

  //   const onAnimationComplete = () => {
  //     setIsLoading(false);
  //   };

  //   fetchDataAndNavigate();
  // }, [navigation, customerId]);

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

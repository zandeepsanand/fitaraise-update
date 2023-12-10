/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
    useCallback,
    useState,
    useLayoutEffect,
    useEffect,
    useRef,
    useContext,
  } from 'react';
  import axios from 'axios';
import {BASE_URL} from '@env';

  import {useData, useTheme, useTranslation} from '../hooks/';
  import {Block, Button, Image, Input, Product, Text} from '../components/';
  import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
  import {Animated, Easing} from 'react-native';
  import Lottie from 'lottie-react-native';
  
  import {
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    TouchableOpacity,
    TouchableHighlight,
  } from 'react-native';
  import {useNavigation} from '@react-navigation/core';
  import {useHeaderHeight} from '@react-navigation/stack';
import api, { setAuthToken } from '../../api';
import LoginContext from '../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export default function AnimationPage({navigation, route}) {
    const {assets, fonts, sizes, gradients, colors} = useTheme();
    const {data,formDataCopy} = route.params;
     const [dietPlan, setDietPlan] = useState('');
     console.log(formDataCopy.customer_id);
     const {customerId}=useContext(LoginContext)
     


    const animationProgress = useRef(new Animated.Value(0));
  
 
    // useEffect(() => {
    //   // Start the animation
    
    //   api
    //     .get(`get_recommended_diet/${formDataCopy.customer_id}`)
    //     .then((response) => {
    //       console.log(response.data.data.recommended_diet_list, "data for sandeepsss");
    //       // Handle the successful response from the backend if needed
    //       setDietPlan(response.data.data.recommended_diet_list);
          

    //       const diet_list = response.data.data.recommended_diet_list ;

    //       if (diet_list !== null) {
    //         const timeout = setTimeout(() => {
    //           // Navigate to the next page
    //           navigation.navigate('Progress', { data, formDataCopy, dietPlan : diet_list });

    //         }, 5000);
    //         return () => clearTimeout(timeout);
    //       } else {
    //         console.log("not ok");
    //       }


    //     })
    //     .catch((error) => {
    //       // Handle the error if needed
    //     });
    
    //   Animated.timing(animationProgress.current, {
    //     toValue: 1,
    //     duration: 15000,
    //     easing: Easing.linear,
    //     useNativeDriver: false,
    //   }).start();
    
    //   // Clean up the timeout when the component unmounts
    //   return () => {
    //     // Clear any asynchronous tasks, timers, or listeners here
    //   };
    // }, []);
     // Empty dependency array to run this effect only once when the component mounts
    
    // Wait for 2 seconds before showing the next page
    const {loginSuccess} = useContext(LoginContext);
    useEffect(() => {
      const fetchDataAndRedirect = async () => {
        try {
          // Start the animation
          Animated.timing(animationProgress.current, {
            toValue: 1,
            duration: 15000,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start();
    
          // Fetch diet data
          const dietListResponse = await api.get(`get_recommended_diet/${formDataCopy.customer_id}`);
          const dietList = dietListResponse.data.data.recommended_diet_list;
    
          // Handle the successful response from the backend if needed
          setDietPlan(dietList);
    
          if (dietList !== null) {
            // Navigate to the next page after 5000ms
            // const timeout = setTimeout(() => {
            //   navigation.navigate('Progress', { data, formDataCopy, dietPlan: dietList });
            // }, 5000);
    
            // return () => clearTimeout(timeout);
          } else {
            console.log("not ok");
          }
    
          // Your redirectTo logic here
          // ...
         
    
        } catch (error) {
          // Handle errors
          console.error('Error:', error);
        }
      };
      const redirectTo = async () => {
        try {
          console.log('clicked');
    
          const authDataJSON = await AsyncStorage.getItem('authData');
          console.log(authDataJSON, 'authdata first page');
    
          if (authDataJSON) {
            const authData = JSON.parse(authDataJSON);
    
            const authToken = authData.token;
            const customerId = authData.formData.customer_id;
            const formData = authData.formData;
            const token = authData.token;
    
            loginSuccess(customerId, formData, token);
            console.log(authToken, 'auth Data');
            if (authToken) {
              setAuthToken(authToken);
              // setIsLoading(true);
              const requiredCalorieResponse = await api.get(
                `get_daily_required_calories/${formData.customer_id}`,
              );
              const diet_List = await api.get(
                `get_recommended_diet/${formData.customer_id}`,
              );
    
              const requiredCalorie = requiredCalorieResponse.data.data;
    
              const dietPlan = diet_List.data.data.recommended_diet_list;
              console.log(requiredCalorie, 'calorie required');
              console.log(authData.formData, 'for workout example');
    
              // setIsLoading(false);
    
              if (
                requiredCalorieResponse.data.success === true &&
                authData.formData
              ) {
                //   navigation.reset({
                //   index: 0,
                //   routes: [{ name: 'Menu', params: { data: requiredCalorie, formDataCopy: authData.formData, dietPlan } }],
                // });
                navigation.navigate('Progress', {
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
              // Replace 2000 with the desired loading duration (in milliseconds)
            } else {
              // No authToken, navigate to 'loginNew'
              navigation.reset({
                index: 0,
                routes: [{name: 'loginNew'}],
              });
            }
          } else {
            // authData JSON doesn't exist, navigate to 'loginNew'
            navigation.reset({
              index: 0,
              routes: [{name: 'loginNew'}],
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
    
      // Call the new function
      // fetchDataAndRedirect();
      redirectTo();

    }, [formDataCopy,data,navigation]);
  
console.log(dietPlan , "new diet plan");

  
    return (
      <Block safe>
      <Block  
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        
        <Block style={styles.container3}>
        <Lottie
                   style={styles.backgroundAnimation}
                   
                    source={require('../assets/json/upload.json')}
                    progress={animationProgress.current}
                  />
  
        </Block>
        <Block  padding={10} center align='center' >
            <Text semibold center>Please wait while we crunch the numbers for your personalized diet plan  </Text>
            {/* <Text semibold> </Text> */}
        </Block>
      
       
  
       
      </Block>
      {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 30,
              paddingRight:10
            }}>
  
            <TouchableOpacity >
            <Image
              source={assets.Button}
           
            />
            </TouchableOpacity>
          </View> */}
      
    </Block>
    );
  }
  const styles = StyleSheet.create({
    container3:{
      flex:0,
      zIndex:10,
       },
    backgroundAnimation: {
      height:250,
      alignSelf:'center',
      position: 'relative',
      // zIndex:-10,
  
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    container:{
      position:'relative',
      marginTop:40
    },
    container1: {
      flex: 1,
      // backgroundColor: '#22faa0',
  
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
  
    img: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {backgroundColor: '', flexDirection: 'row', flex: 1},
    cover: {padding: 30, width: '50%', height: '10%'},
    text: {padding: 30},
    container: {
      flex: 1,
      // flexDirection: "row", // set elements horizontally, try column.
      padding: 30,
      justifyContent: 'center',
    },
    container2: {
     position:'absolute',
     bottom:0,
      justifyContent: 'flex-end',
      alignContent: 'flex-end',
      alignSelf: 'flex-end',
      padding: 30,
    },
  
    mainCardView: {
      // top:70,
      height: 90,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffff',
      borderRadius: 25,
      shadowColor: 'gray',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 16,
      paddingRight: 14,
      marginTop: 6,
      marginBottom: 6,
      marginLeft: 16,
      marginRight: 16,
    },
    subCardView: {
      height: 20,
      width: 50,
      borderRadius: 0,
      backgroundColor: 'transparent',
      // borderColor: "green",
      // borderWidth: 1,
      // borderStyle: "solid",
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
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
  import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
  import axios from 'axios';
import {BASE_URL} from '@env';

  import {useData, useTheme, useTranslation} from '../../../hooks';
  import {Block, Button, Image, Input, Product, Text} from '../../../components';
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
import api from '../../../../api';
import { log } from 'react-native-reanimated';
import { useWorkoutPathContext } from '../../../hooks/WorkoutPathContext';
import LoginContext from '../../../hooks/LoginContext';
  
  export default function AnimationPageWorkout({navigation, route}) {
    const { selectedWorkoutPath, setWorkoutPath } = useWorkoutPathContext();
    const {authenticated, customerId} = useContext(LoginContext);
    const {assets, fonts, sizes, gradients, colors} = useTheme();
    const [workoutDataDB,setWorkoutDataDB]=useState('');
    console.log(workoutDataDB, "data of user updated ");
    
    const {workoutData} = route.params;
    console.log(workoutData);
    
   
    
     const [dietPlan, setDietPlan] = useState('');


    const animationProgress = useRef(new Animated.Value(0));
  

    useEffect(() => {
      const fetchData = async () => {
        try {
          // First API call to get user data
          const userDataResponse = await api.get(`get_personal_datas/${customerId}`);
          const user = userDataResponse.data.data;
          console.log(user, "user Animation");
    
          setWorkoutDataDB(user);
          console.log(user, "user useState");
        } catch (error) {
          console.error(error, 'errorsss');
        }
      };
    
      fetchData();
    }, [customerId]); // Run only once on mount to fetch user data
    
    useEffect(() => {
      const nextPage = async () => {
        try {
          if (workoutDataDB.home_workout_level) {
            // Call the second API to get home workouts
            const secondApiResponse = await api.get(
              `get_home_workouts?gender=${workoutDataDB.gender}&level=${workoutDataDB.home_workout_level}`
            );
    
            // Process the second API response
            const homeWorkout = secondApiResponse.data.data;
            console.log(homeWorkout, "response");
            if (homeWorkout === null) {
              alert('Network error occurred');
            } else {
              // Store workoutData and homeWorkout in AsyncStorage
              await AsyncStorage.setItem('workoutData', JSON.stringify(workoutData));
              await AsyncStorage.setItem('homeWorkoutData', JSON.stringify(homeWorkout));
              await AsyncStorage.setItem('userDataHomeWorkout', JSON.stringify(workoutData));
              await AsyncStorage.setItem('WorkoutPath', JSON.stringify('HomeTabNavigator'));
              await AsyncStorage.setItem('lastHomePage', 'Workout');
              setWorkoutPath('HomeTabNavigator');
              console.log('success');
              setTimeout(() => {
                navigation.navigate('HomeTabNavigator', {
                  screen: 'HomeWorkoutMain',
                  params: { workout: homeWorkout, workoutData },
                });
              }, 2000);
            }
          }
        } catch (error) {
          console.error(error, 'Error fetching home workouts');
        }
      };
    
      nextPage();
    
      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    
      // Wait for 5 seconds before navigating to the next page if dietPlan is not null
      if (dietPlan !== null) {
        const timeout = setTimeout(() => {
          // Navigate to the next page
          // navigation.navigate('Progress', { workoutData });
        }, 5000);
        return () => clearTimeout(timeout);
      } else {
        console.log("dietPlan is null");
      }
    }, [workoutDataDB]);
    
    
    
  
// console.log(dietPlan , "new diet plan");

  
    return (
      <Block safe>
      <Block  
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        
        <Block style={styles.container3}>
        <Lottie
                   style={styles.backgroundAnimation}
                   
                    source={require('../../../assets/json/yoga.json')}
                    progress={animationProgress.current}
                  />
  
        </Block>
        <Block  padding={10} center align='center' >
            <Text semibold>Please wait for the Workout Data </Text>
            <Text semibold>Our Ai is working on it </Text>
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
  
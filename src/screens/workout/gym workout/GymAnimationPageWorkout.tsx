/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';
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

export default function GymAnimationPageWorkout({navigation, route}) {
  const {assets, fonts, sizes, gradients, colors} = useTheme();
  const {workoutData} = route.params;
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {}, []);
  useEffect(() => {
    if (workoutData.gym_workout_level) {
      // Create a copy of the formData object
      const formDataCopy = {...workoutData};
      const formDataWithoutEmptyFields = Object.keys(formDataCopy).reduce((obj, key) => {
        if (formDataCopy[key] !== null && formDataCopy[key] !== undefined && formDataCopy[key] !== '') {
          obj[key] = formDataCopy[key];
        }
        return obj;
      }, {});
      console.log(formDataWithoutEmptyFields, 'form data empty');

      const fetchData = async () => {
        console.log('clicked');
        
        try {
          const response = await api.post(
            `set_personal_datas`,
            formDataWithoutEmptyFields,
          );
          console.log(response.data ,"posted");
          

          if (response.data.success) {
            console.log('success posted');
            
            // Call the second API
            const secondApiResponse = await api.get(
              `get_gym_workouts?gender=${formDataCopy.gender}&level=${formDataCopy.gym_workout_level}`,
            );
            // Do something with the second API response
            const data = secondApiResponse.data.data;
            // setData(secondApiResponse.data.data);
            console.log(data, 'the data of second apifffff');
            if (data === null) {
              alert('turn on network and re-try');
            } else {
              console.log('success');
              setTimeout(() => {
                // navigation.navigate('HomeWorkoutMain', { data, formDataCopy });
                navigation.navigate('GymTabNavigator', {
                  screen: 'GymWorkoutMain', // Screen name within the TabNavigator
                  params: {data, formDataCopy}, // Pass your parameters here
                });
              }, 2000);
            }
            // navigation.navigate('donutchart', { data });
          }
          // Do something with the first API response
          // console.log(response.data);
        } catch (error) {
          if (error.response) {
            // The request was made, but the server responded with a status code that falls out of the range of 2xx
            console.error('Response Error:', error.response.data);
          } else if (error.request) {
            // The request was made, but no response was received
            console.error('Request Error:', error.request);
          } else {
            // Something happened in setting up the request that triggered an error
            console.error('Request Setup Error:', error.message);
          }
        }
      };
      fetchData();
    } else {
      // console.log(formData.gender, formData.weight , formData.feet ,formData.inches , formData.acitivity_level,formData.height);

      alert('Please enter all details');
    }

    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  });

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
        <Block padding={10} center align="center">
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
  container3: {
    flex: 0,
    zIndex: 10,
  },
  backgroundAnimation: {
    height: 250,
    alignSelf: 'center',
    position: 'relative',
    // zIndex:-10,

    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    position: 'relative',
    marginTop: 40,
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
    position: 'absolute',
    bottom: 0,
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

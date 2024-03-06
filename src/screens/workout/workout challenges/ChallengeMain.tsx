/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {ThemedButton} from 'react-native-really-awesome-button';
import AwesomeButton from 'react-native-really-awesome-button';

import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import SelectDropdown from 'react-native-select-dropdown';

import axios from 'axios';
import {BASE_URL} from '@env';
import api from '../../../../api';
import LoginContext from '../../../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import {useWorkoutPathContext} from '../../../hooks/WorkoutPathContext';

const ChallengeMain = ({navigation, route}) => {
  const {t} = useTranslation();

  const dataSample = [
    {
      completed: true,
      day: '1st Day',
      day_number: 1,
      id: 4013,
      number: 1,
      recent_workout_done_date: '26-02-2024',
      total_done_excercise: 8,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '2nd Day',
      day_number: 2,
      id: 4021,
      number: 2,
      recent_workout_done_date: '27-02-2024',
      total_done_excercise: 8,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '3rd Day',
      day_number: 3,
      id: 4029,
      number: 3,
      recent_workout_done_date: '28-02-2024',
      total_done_excercise: 8,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '4th Day',
      day_number: 4,
      id: 4037,
      number: 4,
      recent_workout_done_date: '05-03-2024',
      total_done_excercise: 7,
      total_excercises: 7,
    },
    {
      completed: true,
      day: '5th Day',
      day_number: 5,
      id: 4044,
      number: 5,
      recent_workout_done_date: '06-03-2024',
      total_done_excercise: 8,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '6th Day',
      day_number: 6,
      id: 4052,
      number: 6,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '7th Day',
      day_number: 7,
      id: 4060,
      number: 7,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 5,
    },
    {
      completed: true,
      day: '8th Day',
      day_number: 8,
      id: 4065,
      number: 8,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '9th Day',
      day_number: 9,
      id: 4073,
      number: 9,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '10th Day',
      day_number: 10,
      id: 4081,
      number: 10,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: true,
      day: '11th Day',
      day_number: 11,
      id: 4088,
      number: 11,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: true,
      day: '12th Day',
      day_number: 12,
      id: 4095,
      number: 12,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '13th Day',
      day_number: 13,
      id: 4103,
      number: 13,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: true,
      day: '14th Day',
      day_number: 14,
      id: 4111,
      number: 14,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 9,
    },
    {
      completed: false,
      day: '15th Day',
      day_number: 15,
      id: 4120,
      number: 15,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '16th Day',
      day_number: 16,
      id: 4127,
      number: 16,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 5,
    },
    {
      completed: false,
      day: '17th Day',
      day_number: 17,
      id: 4132,
      number: 17,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '18th Day',
      day_number: 18,
      id: 4140,
      number: 18,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '19th Day',
      day_number: 19,
      id: 4148,
      number: 19,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '20th Day',
      day_number: 20,
      id: 4155,
      number: 20,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '21st Day',
      day_number: 21,
      id: 4162,
      number: 21,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '22nd Day',
      day_number: 22,
      id: 4170,
      number: 22,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '23rd Day',
      day_number: 23,
      id: 4178,
      number: 23,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '24th Day',
      day_number: 24,
      id: 4185,
      number: 24,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '25th Day',
      day_number: 25,
      id: 4192,
      number: 25,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '26th Day',
      day_number: 26,
      id: 4200,
      number: 26,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '27th Day',
      day_number: 27,
      id: 4208,
      number: 27,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '28th Day',
      day_number: 28,
      id: 4215,
      number: 28,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 5,
    },
    {
      completed: false,
      day: '29th Day',
      day_number: 29,
      id: 4220,
      number: 29,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '30th Day',
      day_number: 30,
      id: 4228,
      number: 30,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '31st Day',
      day_number: 31,
      id: 4236,
      number: 31,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '32nd Day',
      day_number: 32,
      id: 4243,
      number: 32,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '33rd Day',
      day_number: 33,
      id: 4250,
      number: 33,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 9,
    },
    {
      completed: false,
      day: '34th Day',
      day_number: 34,
      id: 4259,
      number: 34,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '35th Day',
      day_number: 35,
      id: 4267,
      number: 35,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '36th Day',
      day_number: 36,
      id: 4275,
      number: 36,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 5,
    },
    {
      completed: false,
      day: '37th Day',
      day_number: 37,
      id: 4280,
      number: 37,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '38th Day',
      day_number: 38,
      id: 4288,
      number: 38,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '39th Day',
      day_number: 39,
      id: 4296,
      number: 39,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '40th Day',
      day_number: 40,
      id: 4303,
      number: 40,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '41st Day',
      day_number: 41,
      id: 4310,
      number: 41,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '42nd Day',
      day_number: 42,
      id: 4318,
      number: 42,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '43rd Day',
      day_number: 43,
      id: 4326,
      number: 43,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '44th Day',
      day_number: 44,
      id: 4333,
      number: 44,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '45th Day',
      day_number: 45,
      id: 4340,
      number: 45,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '46th Day',
      day_number: 46,
      id: 4348,
      number: 46,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '47th Day',
      day_number: 47,
      id: 4356,
      number: 47,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '48th Day',
      day_number: 48,
      id: 4363,
      number: 48,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '49th Day',
      day_number: 49,
      id: 4370,
      number: 49,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '50th Day',
      day_number: 50,
      id: 4378,
      number: 50,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '51st Day',
      day_number: 51,
      id: 4386,
      number: 51,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '52nd Day',
      day_number: 52,
      id: 4393,
      number: 52,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '53rd Day',
      day_number: 53,
      id: 4401,
      number: 53,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '54th Day',
      day_number: 54,
      id: 4409,
      number: 54,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '55th Day',
      day_number: 55,
      id: 4417,
      number: 55,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 5,
    },
    {
      completed: false,
      day: '56th Day',
      day_number: 56,
      id: 4422,
      number: 56,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '57th Day',
      day_number: 57,
      id: 4429,
      number: 57,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 8,
    },
    {
      completed: false,
      day: '58th Day',
      day_number: 58,
      id: 4437,
      number: 58,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '59th Day',
      day_number: 59,
      id: 4444,
      number: 59,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
    {
      completed: false,
      day: '60th Day',
      day_number: 60,
      id: 4451,
      number: 60,
      recent_workout_done_date: null,
      total_done_excercise: 0,
      total_excercises: 7,
    },
  ];

  // const handleProgress = (release) => setTimeout(release, 1000);
  const {selectedWorkoutPath, setWorkoutPath} = useWorkoutPathContext();
  const [isCurrentDayCompleted, setIsCurrentDayCompleted] = useState(false);
  console.log('====================================');
  console.log(selectedWorkoutPath);
  console.log('====================================');
  const {
    formDataCopy = [],
    savedDate = [],
    completedWorkouts = [],
    challenge,
  } = route.params;
  console.log(challenge, 'challengee data');

  const {customerId} = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [monthId, setMonthId] = useState(challenge.id);
  const [month, setMonth] = useState(challenge);
  console.log(monthId, 'monthId');

  console.log(month, 'haiii month');

  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [selectedLevel, setSelectedLevel] = useState(
    // formDataCopy.workout_level,
    '',
  );
  const [data, setData] = useState('');
  console.log(data.length, 'dataaaaaas');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data2, setData2] = useState('');
  const [currentDay, setCurrentDay] = useState(0);
  const [todayWorkout, setTodayWorkout] = useState('');
  const [workoutData, setWorkoutData] = useState('');
  const [userData, setUserData] = useState('');
  const [challengeDays, setChallengeDays] = useState(challenge);
  console.log(challengeDays, 'testing');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       if (!month.id) {
  //         throw new Error('Please enter all details');
  //       }
  //       const response = await api.get(
  //         `get_workout_challenge_days/${month.id}`,
  //       );
  //       const userData1 = await api.get(`get_personal_datas/${customerId}`);
  //       const user = userData1.data.data;
  //       setUserData(user);
  //       console.log(user, 'user data home workout loading');

  //       const responseData = response.data.data;
  //       console.log(responseData);

  //       if (responseData === null) {
  //         throw new Error('Turn on the network and retry');
  //       }

  //       setData(responseData);
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [month.id, customerId]);
  const fetchData = async () => {
    try {
      setLoading(true);
      if (!monthId || !customerId) {
        throw new Error('Please enter all details');
      }
      const response = await api.get(`get_workout_challenge_days/${monthId}`);
      const userDataResponse = await api.get(
        `get_personal_datas/${customerId}`,
      );
      const user = userDataResponse.data.data;
      setUserData(user);
      console.log(user, 'user data home workout loading');

      const responseData = response.data.data;
      console.log(responseData);

      if (responseData === null) {
        throw new Error('Turn on the network and retry');
      }

      setData(responseData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation, monthId, customerId]);

  const handleLevelChange = async (level) => {
    setSelectedLevel(level);
    if (
      [
        'Home Workout',
        'Gym Workout',
        '90 day challenge',
        '60 day challenge',
      ].includes(level)
    ) {
      if (level === 'Home Workout') {
        setWorkoutPath('HomeTabNavigator');
        console.log('====================================');
        console.log('cliiick');
        console.log('====================================');
        const navigationHandled = await handleHomeWorkoutNavigation();
        if (!navigationHandled) {
          await handleHomeWorkoutApiCall();
        }
      } else if (level === 'Gym Workout') {
        setWorkoutPath('GymTabNavigator');
        const navigationHandled = await navigateToGymTab();
        if (!navigationHandled) {
          await handleGymWorkoutNavigation(); // Handle non-cached case for 'Gym workout'
        }
      } else if (level === '90 day challenge') {
        try {
          setIsLoading(true);
          const userData = await api.get(`get_personal_datas/${customerId}`);
          const user = userData.data.data;
          if (!challenge.id) {
            throw new Error('Please enter all details');
          }
          if (user.gender && user.workout_challenge_level) {
            const homeWorkout = await api.get(
              `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
            );
            const challengeMonthJSON = homeWorkout.data.data;
            const challenge90Days = challengeMonthJSON.find(
              (challenge) => challenge.number_of_days === 90,
            );
            if (challenge90Days) {
              const challenge90DaysId = challenge90Days.id;
              console.log('ID of 90 Days Challenge:', challenge90DaysId);
              await AsyncStorage.setItem(
                'challengeWorkoutData',
                JSON.stringify(challenge90Days),
              );
              await AsyncStorage.setItem(
                'userDataChallengeWorkout',
                JSON.stringify(user),
              );
              await AsyncStorage.setItem(
                'WorkoutPath',
                JSON.stringify('ChallengeTabNavigator'),
              );

              setWorkoutPath('ChallengeTabNavigator');

              // Now you can use challenge90DaysId in your code
              const response = await api.get(
                `get_workout_challenge_days/${challenge90DaysId}`,
              );
              const responseData = response.data.data;
              // console.log(responseData, '90 days dataaa');
              setMonthId(challenge90DaysId);
              setData(responseData);
              setIsLoading(false);
              if (responseData === null) {
                setIsLoading(false);
                throw new Error('Turn on the network and retry');
              }
            } else {
              console.log('90 Days Challenge not found in the data.');
            }
          }
        } catch (error) {
          setIsLoading(false);
          console.error('Error in handleLevelChange:', error);
        }
      } else if (level === '60 day challenge') {
        try {
          setIsLoading(true);
          const userData60 = await api.get(`get_personal_datas/${customerId}`);
          const user = userData60.data.data;
          if (!challenge.id) {
            throw new Error('Please enter all details');
          }
          if (user.gender && user.workout_challenge_level) {
            const homeWorkout = await api.get(
              `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
            );
            const challengeMonthJSON = homeWorkout.data.data;
            const challenge60Days = challengeMonthJSON.find(
              (challenge) => challenge.number_of_days === 60,
            );
            if (challenge60Days) {
              const challenge60DaysId = challenge60Days.id;
              console.log('ID of 60 Days Challenge:', challenge60DaysId);
              await AsyncStorage.setItem(
                'challengeWorkoutData',
                JSON.stringify(challenge60Days),
              );
              await AsyncStorage.setItem(
                'userDataChallengeWorkout',
                JSON.stringify(user),
              );
              await AsyncStorage.setItem(
                'WorkoutPath',
                JSON.stringify('ChallengeTabNavigator'),
              );

              setWorkoutPath('ChallengeTabNavigator');
              // Now you can use challenge90DaysId in your code
              const response = await api.get(
                `get_workout_challenge_days/${challenge60DaysId}`,
              );
              const responseData = response.data.data;
              console.log(responseData, '60 days');
              setMonthId(challenge60DaysId);
              setData(responseData);
              setIsLoading(false);
              if (responseData === null) {
                setIsLoading(false);
                throw new Error('Turn on the network and retry');
              }
            } else {
              console.log('60 Days Challenge not found in the data.');
            }
          }
        } catch (error) {
          setIsLoading(false);
          console.error('Error in handleLevelChange:', error);
        }
      }
    }
  };
  const handleHomeWorkoutNavigation = async () => {
    console.log('====================================');
    console.log('async home');
    console.log('====================================');

    const storedHomeWorkoutData = await AsyncStorage.getItem('homeWorkoutData');
    const storeduserDataHomeWorkout = await AsyncStorage.getItem(
      'userDataHomeWorkout',
    );

    if (storedHomeWorkoutData && storeduserDataHomeWorkout) {
      setWorkoutPath('HomeTabNavigator');
      const homeWorkoutData = JSON.parse(storedHomeWorkoutData);
      const userData = JSON.parse(storeduserDataHomeWorkout);
      console.log(userData, 'home work 2');

      navigation.navigate('HomeTabNavigator', {
        screen: 'HomeWorkoutMain',
        params: {workout: homeWorkoutData, workoutData: userData},
      });
      return true; // Navigation handled
    }
    return false; // Navigation not handled
  };
  const navigateToGymTab = async () => {
    const storedGymWorkoutData = await AsyncStorage.getItem('gymWorkoutData');
    const storeduserDataGymWorkout = await AsyncStorage.getItem(
      'userDataGymWorkout',
    );

    if (storedGymWorkoutData && storeduserDataGymWorkout) {
      setWorkoutPath('GymTabNavigator');
      const gymWorkoutData = JSON.parse(storedGymWorkoutData);
      const userData = JSON.parse(storeduserDataGymWorkout);

      navigation.navigate('GymTabNavigator', {
        screen: 'GymWorkoutMain',
        params: {data: gymWorkoutData, formDataCopy: userData},
      });
      return true; // Navigation handled
    }
    return false; // Navigation not handled
  };
  const handleHomeWorkoutApiCall = async () => {
    console.log('====================================');
    console.log('clicked 2');
    console.log('====================================');
    try {
      const userData1 = await api.get(`get_personal_datas/${customerId}`);
      const user = userData1.data.data;
      console.log(user, 'user data home 1');

      if (user.gender && user.home_workout_level) {
        console.log('====================================');
        console.log('clicked 3');
        console.log('====================================');

        const homeWorkout = await api.get(
          `get_home_workouts?gender=${user.gender}&level=${user.home_workout_level}`,
        );
        const homeWorkoutJSON = homeWorkout.data.data;

        if (homeWorkoutJSON) {
          await AsyncStorage.setItem(
            'homeWorkoutData',
            JSON.stringify(homeWorkoutJSON),
          );
          await AsyncStorage.setItem(
            'userDataHomeWorkout',
            JSON.stringify(user),
          );
          await AsyncStorage.setItem(
            'WorkoutPath',
            JSON.stringify('HomeTabNavigator'),
          );

          setWorkoutPath('HomeTabNavigator');

          navigation.navigate('HomeTabNavigator', {
            screen: 'HomeWorkoutMain',
            params: {workout: homeWorkoutJSON, workoutData: user},
          });
        }
      } else {
        console.log('workout page');
        // Navigate to 'Gender' screen with workoutData
        navigation.navigate('Gender', {
          workoutData: formDataCopy,
        });
      }
    } catch (error) {
      console.error('Error in handleHomeWorkoutApiCall:', error);
    }
  };

  const handleGymWorkoutNavigation = async () => {
    try {
      const userData = await api.get(`get_personal_datas/${customerId}`);
      const user = userData.data.data;

      if (user.gender && user.gym_workout_level) {
        const homeWorkout = await api.get(
          `get_gym_workouts?gender=${user.gender}&level=${user.gym_workout_level}`,
        );
        const gymWorkoutJSON = homeWorkout.data.data;

        if (gymWorkoutJSON) {
          await AsyncStorage.setItem(
            'gymWorkoutData',
            JSON.stringify(gymWorkoutJSON),
          );
          await AsyncStorage.setItem(
            'userDataGymWorkout',
            JSON.stringify(user),
          );
          await AsyncStorage.setItem(
            'WorkoutPath',
            JSON.stringify('GymTabNavigator'),
          );

          setWorkoutPath('GymTabNavigator');

          navigation.navigate('GymTabNavigator', {
            screen: 'GymWorkoutMain',
            params: {data: gymWorkoutJSON, formDataCopy: user},
          });
        }
      } else {
        navigation.navigate('GymGenderPage', {
          workoutData,
        });
      }
    } catch (error) {
      console.error('Error in handleGymWorkoutNavigation:', error);
    }
  };

  const targetTimeZone = 'Asia/Kolkata'; // Change this to 'Asia/Kolkata' for Indian Standard Time

  const completed_date = moment.tz(targetTimeZone).format('DD-MM-YYYY');
  console.log('====================================');
  console.log(completed_date, 'todays date');
  console.log('====================================');

  // const clickStart = async () => {

  //   try {
  //     if (!challenge.id) {
  //       throw new Error('Please enter all details');
  //     }

  //     if (isCurrentDayCompleted) {
  //       // Display an alert to inform the user that they've already completed today's workout
  //       alert("You have already completed today's workout");
  //       return;
  //     }

  //     // Fetch the days data
  //     const daysResponse = await api.get(
  //       `get_workout_challenge_days/${month.id}`,
  //     );
  //     const daysData = daysResponse.data.data;
  //     console.log(daysData, 'days data');

  //     if (daysData.length === 0) {
  //       throw new Error('No days data available');
  //     }

  //     // Determine the current day number based on completion status
  //     let currentDayNumber = 0;
  //     for (const day of daysData) {
  //       if (!day.completed) {
  //         break; // The first incomplete day becomes the current day
  //       }
  //       currentDayNumber++;
  //     }

  //     if (currentDayNumber > daysData.length) {
  //       throw new Error('All days are completed');
  //     } else {
  //       // Increment currentDayNumber to move to the next day
  //       currentDayNumber++;
  //     }

  //     // Fetch the workout data for the determined current day
  //     const workoutResponse = await api.get(
  //       `get_workout_challenge_excercise/${challenge.id}/${currentDayNumber}`,
  //     );
  //     const responseData = workoutResponse.data.data;
  //     console.log(responseData, `day ${currentDayNumber}`);

  //     setTodayWorkout(responseData);

  //     navigation.navigate('ChallengeDayAll', {
  //       responseData,
  //       completedWorkouts,
  //       currentDayNumber,
  //       dayWithId: daysData,
  //       challenge,
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };
  const clickStart = async () => {
    try {
      if (!monthId) {
        throw new Error('Please enter all details');
      }
      console.log('====================================');
      console.log(monthId, 'current challenge id');
      console.log('====================================');
      if (isCurrentDayCompleted) {
        // Display an alert to inform the user that they've already completed today's workout
        alert("You have already completed today's workout..");
        return;
      }

      // Fetch the days data
      const daysResponse = await api.get(
        `get_workout_challenge_days/${monthId}`,
      );
      const daysData = daysResponse.data.data;
      console.log(daysData, 'days data');

      if (daysData.length === 0) {
        throw new Error('No days data available');
      }

      // Determine the current day number based on completion status
      let currentDayNumber = 0;
      for (const day of daysData) {
        if (!day.completed) {
          break; // The first incomplete day becomes the current day
        }
        currentDayNumber++;
      }

      if (currentDayNumber >= daysData.length) {
        throw new Error('All days are completed');
      }
      console.log('============================');
      console.log(currentDayNumber, 'day number pleae');
      console.log(completed_date, 'day  pleae');
      console.log('============================');

      if (currentDayNumber === 0) {
        console.log('halo');

        const workoutResponse = await api.get(
          `get_workout_challenge_excercise/${monthId}/${currentDayNumber + 1}`,
        );
        const responseDataWorkout = workoutResponse.data.data;
        console.log(responseDataWorkout, `day ${currentDayNumber + 1}`);

        setTodayWorkout(responseDataWorkout);

        navigation.navigate('ChallengeDayAll', {
          responseData: responseDataWorkout,
          completedWorkouts,
          currentDayNumber: currentDayNumber + 1,
          dayWithId: daysData,
          challenge: monthId,
        });
      } else if (
        daysData[currentDayNumber - 1].recent_workout_done_date ===
        completed_date
      ) {
        // Display an alert to inform the user that they've already completed today's workout
        alert("You have already completed today's workout...");
        return;
      } else {
        const workoutResponse = await api.get(
          `get_workout_challenge_excercise/${monthId}/${currentDayNumber}`,
        );
        const responseData = workoutResponse.data.data;
        console.log(responseData, `day ${currentDayNumber}`);

        setTodayWorkout(responseData);

        navigation.navigate('ChallengeDayAll', {
          responseData,
          completedWorkouts,
          currentDayNumber: currentDayNumber + 1,
          dayWithId: daysData,
          challenge: monthId,
        });
      }

      // Fetch the workout data for the determined current day
    } catch (err) {
      setError(err.message);
    }
  };

  //second code error on starting date is null

  // const clickStart = async () => {
  //   try {
  //     console.log(challenge.id, 'clicked button inside');
  //     if (!monthId) {
  //       throw new Error('Please enter all details');
  //     }
  //     if (isCurrentDayCompleted) {
  //       // Display an alert to inform the user that they've already completed today's workout

  //       alert("You have already completed today's workout");
  //       return;
  //     }

  //     // Fetch the days data
  //     const daysResponse = await api.get(
  //       `get_workout_challenge_days/${monthId}`,
  //     );
  //     const daysData = daysResponse.data.data;
  //     console.log(daysData, 'days data 1');

  //     if (daysData.length === 0) {
  //       throw new Error('No days data available');
  //     }

  //     // Determine the current day number based on completion status
  //     let currentDayNumber = 0;
  //     for (const day of daysData) {
  //       if (!day.completed) {
  //         break; // The first incomplete day becomes the current day
  //       }
  //       currentDayNumber++;
  //     }

  //     if (currentDayNumber >= daysData.length) {
  //       throw new Error('All days are completed');
  //     }

  //     // Check if the recent workout done date is the same as today's date
  //     if (
  //       daysData[currentDayNumber - 1].recent_workout_done_date &&
  //       daysData[currentDayNumber - 1].recent_workout_done_date ===
  //         completed_date // Replace todayDate with the actual today's date
  //     ) {
  //       // Display an alert to inform the user that they've already completed today's workout
  //       alert("You have already completed today's workout");
  //       return;
  //     }

  //     // If not, increment currentDayNumber to move to the next day
  //     currentDayNumber++;
  //     console.log(currentDayNumber, 'daynumber');

  //     // Fetch the workout data for the determined current day
  //     const workoutResponse = await api.get(
  //       `get_workout_challenge_excercise/${monthId}/${currentDayNumber}`,
  //     );
  //     const responseData = workoutResponse.data.data;
  //     console.log(responseData, `day ${currentDayNumber}`);

  //     setTodayWorkout(responseData);

  //     navigation.navigate('ChallengeDayAll', {
  //       responseData,
  //       completedWorkouts,
  //       currentDayNumber,
  //       dayWithId: daysData,
  //       challenge,
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // third code

  const handleProgress = async (release) => {
    try {
      await Promise.race([
        clickStart(),
        new Promise((resolve, reject) => setTimeout(reject, 1000)), // Adjust timeout as needed (10 seconds in this case)
      ]);
    } catch (error) {
      console.error('Timeout occurred');
    }
    release(); // Release the lock after the timeout or completion of clickStart
  };

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  const handleWorkoutClick = (workout) => {
    // Call the API with workoutId and fetch exercise details
    // Once you have the exercise data, navigate to the 'HomeWorkoutAll' screen
    navigation.navigate('GymWorkoutAll', {workout, data, completedWorkouts});
    console.log(completedWorkouts, 'completed workout list');
  };

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const authDataJSON = await AsyncStorage.getItem('authData');
        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);

          const authToken = authData.token;
          const customerId = authData.formData.customer_id;
          const formData = authData.formData;
          console.log('====================================');
          console.log(formData);
          console.log('====================================');
          const token = authData.token;

          if (authToken) {
            // Continue with your navigation logic...
            setIsLoading(false);
            setUserData(formData);
          } else {
            console.log('Failed to get push token for push notification!');
          }
        }
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
  }, []);
  console.log(workoutData, 'dataaaa');
  const numberOfWeeks = Math.ceil(data.length / 7);
  const weeks = [];
  // console.log(data, 'data of the 60 day');

  const weekStatus = new Array(numberOfWeeks).fill('Lock'); // Initialize array to store completion status of each week

  for (let week = 0; week < numberOfWeeks; week++) {
      const weekData = data.slice(week * 7, (week + 1) * 7);
      // Calculate completion status for the week
      const completedDaysInWeek = weekData.filter(day => day.completed).length;
  
      const isWeekCompleted = completedDaysInWeek === 7;
  
      if (isWeekCompleted) {
          // If the week is completed, set the button text to 'Completed'
          weekStatus[week] = 'Completed';
          // If it's not the last week, set the button text of the next week to 'Start'
          if (week < numberOfWeeks - 1) {
              weekStatus[week + 1] = 'Start';
          }
      } else if (week === 0) {
          // If it's the first week and not completed, set the button text to 'Start'
          weekStatus[week] = 'Start';
      }
  
      // Determine start button text for this week using weekStatus[week]
      const startButtonText = weekStatus[week];

    const firstRowDays = weekData.slice(0, 4);
    const secondRowDays = weekData.slice(4);

    const firstRow = firstRowDays.map((day, index) => (
      <Block
        key={index}
        center
        align="center"
        style={{
          // borderColor: day.completed ? '#19F196F0' : '#D9D9D9',
          // borderWidth: 3,
          // borderRadius: 50,
          minWidth: 80,
          minHeight: 60,
          // backgroundColor: day.completed ? '#c7fce6' : 'transparent',
        }}
        // color={day.completed ? '#c7fce6' : 'green'}
        marginTop={25}>
        {/* <Text center bold>
          {day.day}
        </Text> */}
        <AwesomeButton
          width={60}
          backgroundColor={day.completed ? '#c7fce6' : 'white'}
          borderRadius={50}
          textColor="black"
          style={{
            borderColor: day.completed ? '#19F196F0' : '#D9D9D9',
            // borderWidth: 3,
            borderRadius: 50,
            minWidth: 60,
            minHeight: 60,
          }}>
          {day.day}
        </AwesomeButton>
      </Block>
    ));

    const secondRow = secondRowDays.map((day, index) => (
      <Block
        key={index}
        center
        align="center"
        style={{
          // borderColor: day.completed ? '#19F196F0' : '#D9D9D9',
          // borderWidth: 3,
          // borderRadius: 50,
          minWidth: 80,
          minHeight: 60,
          // backgroundColor: day.completed ? '#c7fce6' : 'transparent',
        }}
        // color={day.completed ? '#c7fce6' : 'green'}
        marginTop={15}>
        {/* <Text center bold>
        {day.day}
      </Text> */}
        <AwesomeButton
          width={60}
          backgroundColor={day.completed ? '#c7fce6' : 'white'}
          borderRadius={50}
          textColor="black"
          style={{
            borderColor: day.completed ? '#19F196F0' : '#D9D9D9',
            // borderWidth: 3,
            borderRadius: 50,
            minWidth: 60,
            minHeight: 60,
          }}>
          {day.day}
        </AwesomeButton>
      </Block>
    ));

    weeks.push(
      <Block key={week} card margin={10}>
        <Block flex={0} align="flex-start" padding={30} position="absolute">
          {startButtonText === 'Completed' && (
            <Image
              source={require('../../../assets/icons/check1.png')}
              style={{height: 30, width: 30}}
              radius={0}
            />
          )}
        </Block>
        <Text center bold paddingTop={20} h5>
          Week {week + 1}
        </Text>
        <Block paddingHorizontal={20}>
          <Block row center paddingTop={20}>
            {firstRow}
          </Block>
          <Block
            row
            center
            paddingTop={20}
            paddingHorizontal={20}
            paddingBottom={20}>
            {secondRow}
          </Block>
        </Block>
        {/* Render the button based on completion status */}

        <Block
          center
          align="center"
          marginTop={10}
          // gradient={gradients?.[tab === 2 ? 'success' : '#ffff']}
        >
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text bold white h4>
                    {startButtonText}
                  </Text>
                </View>
              </View> */}

          <ThemedButton
            size="large"
            name="bruce"
            backgroundColor={
              startButtonText === 'Start'
                ? '#92A3FD' // Background color when startButtonText is 'Start'
                : startButtonText === 'Lock'
                ? '#CCCCCC' // Background color when startButtonText is 'Lock'
                : startButtonText === 'Completed'
                ? '#66FF99' // Background color when startButtonText is 'Completed'
                : '#92A3FD' // Default background color
            }
            backgroundDarker="white"
            backgroundProgress="#19F196F0"
            borderColor={
              startButtonText === 'Start'
                ? '#92A3FD' // Background color when startButtonText is 'Start'
                : startButtonText === 'Lock'
                ? '#CCCCCC' // Background color when startButtonText is 'Lock'
                : startButtonText === 'Completed'
                ? '#66FF99' // Background color when startButtonText is 'Completed'
                : '#92A3FD' // Default background color
            }
            style={styles.button}
            transparent
            disabled={
              startButtonText === 'Lock' || startButtonText === 'Completed'
            }
            // onPress={() => clickStart()}
            progress
            onPress={handleProgress}
            // onProgressEnd={handleProgress}
          >
            {startButtonText}
          </ThemedButton>
        </Block>
      </Block>,
    );

    // Update isFirstWeekCompleted if the first week is completed
    if (week === 0 && isWeekCompleted) {
      isFirstWeekCompleted = true;
    }
  }

  return (
    <>
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 140,
          }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      {!isLoading && (
        <Block safe marginTop={sizes.md} marginBottom={10}>
          <Block
            scroll
            // paddingHorizontal={sizes.s}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: sizes.padding}}>
            <Block>
              <Block
                row
                justify="space-around"
                paddingBottom={10}
                style={{borderBottomWidth: 10, borderBottomColor: '#938669'}}>
                <Block paddingLeft={20}>
                  <Block center>
                    <Text key={challenge.id} bold>
                      {data.length} days challenge
                    </Text>
                  </Block>
                  {/* <Block row>
                <Text>Your program :</Text>
                <Text bold>
                  {' '}
                  {selectedLevel.charAt(0).toUpperCase() +
                    selectedLevel.slice(1)}
                </Text>
              </Block> */}
                </Block>
                <Block>
                  <Block center>
                    <SelectDropdown
                      defaultValue={'one'}
                      dropdownStyle={{borderRadius: 20}}
                      buttonStyle={{
                        height: 50,
                        width: 180,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        marginLeft: 10,
                      }}
                      data={[
                        'Home Workout',
                        'Gym Workout',
                        ...(data.length === 60 ? [] : ['60 day challenge']), // Only include '90 day challenge' if data.length is not 60
                        ...(data.length === 90 ? [] : ['90 day challenge']), // Only include '60 day challenge' if data.length is not 90
                      ]}
                      // defaultButtonText={formDataCopy.workout_level}
                      defaultButtonText={'Select an option'}
                      onSelect={handleLevelChange}
                    />
                  </Block>
                </Block>
              </Block>
              <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <Block
                    style={styles.mainCardView}
                    gradient={gradients?.[tab === 2 ? 'success' : '#ffff']}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{
                          marginLeft: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        {/* <Image
                    source={assets.arrow}
                    color={colors.white}
                    radius={0}
                  /> */}
                        <Text bold danger center paddingRight={8}>
                          •
                        </Text>
                        <Text semibold gray center>
                          Level -
                        </Text>
                      </View>
                      <View style={{marginLeft: 12}}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                          bold
                          white>
                          {userData.workout_challenge_level}
                        </Text>
                      </View>
                    </View>
                  </Block>
                </TouchableWithoutFeedback>
              </View>
              <View>
                {weeks.map((week, index) => (
                  <View key={index}>{week}</View>
                ))}
              </View>
              {/* <ThemedButton name="bruce" type="secondary" style={styles.button}>1st Day</ThemedButton>
              <AwesomeButton backgroundColor='white' borderRadius={50} textColor='black' >1st Day</AwesomeButton> */}

              <View style={{paddingBottom: 20}}>
                {/* <GifPlayer /> */}
                {/* <GymWorkoutCalender savedDate={savedDate} /> */}
              </View>

              {/* {data2.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              onPress={() => handleWorkoutClick(workout)}>
              <Block center>
                <Block paddingTop={20}>
                  <Text
                    center
                    primary
                    bold
                    size={20}
                    padding={5}
                    paddingBottom={10}>
                    {workout.name}
                  </Text>
                </Block>
                <Block paddingHorizontal={10}>
                  <Image
                    // resizeMode="contain"
                    source={{
                      uri: `${workout.image}`,
                    }}
                    style={{
                      overflow: 'hidden',
                      height: 114,
                      width: 350,
                      borderRadius: 15,
                      alignSelf: 'center',
                    }}
                  />
                </Block>
              </Block>
            </TouchableOpacity>
          ))} */}
            </Block>
          </Block>
        </Block>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#22faa0',

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
    flex: 0.1,
    flexDirection: 'row', // set elements horizontally, try column.
    padding: 20,
    // alignItems: 'center',
  },

  mainCardView: {
    height: 80,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C3585',
    borderRadius: 30,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 36,
    marginRight: 36,
  },
  mainCardView1: {
    // height: 60,
    // width: 150,
    //    bottom:0,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#92A3FD',
    // borderRadius: 15,
    // shadowColor: 'gray',
    // shadowOffset: {width: 0, height: 5},
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
    // elevation: 5,
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    // paddingLeft: 16,
    // paddingRight: 14,
    // marginTop: 16,
    // marginBottom: 6,
    // marginLeft: 40,
    // marginRight: 40,
  },

  bottom: {
    flex: 0.5,
    justifyContent: 'flex-end', // Aligns content to the bottom of the container
    marginBottom: 40, // Optional: Adds some spacing from the bottom
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 16,
    borderRadius: 50,
    backgroundColor: '#92A3FD',
  },
});

export default ChallengeMain;

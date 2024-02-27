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
  console.log(monthId, 'monthId');

  const month = challenge;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!challenge.id) {
          throw new Error('Please enter all details');
        }
        const response = await api.get(
          `get_workout_challenge_days/${month.id}`,
        );
        const userData = await api.get(`get_personal_datas/${customerId}`);
        const user = userData.data.data;
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

    fetchData();
  }, []);

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
      if (!challenge.id) {
        throw new Error('Please enter all details');
      }

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
        const responseData = workoutResponse.data.data;
        console.log(responseData, `day ${currentDayNumber + 1}`);

        setTodayWorkout(responseData);

        navigation.navigate('ChallengeDayAll', {
          responseData,
          completedWorkouts,
          currentDayNumber: currentDayNumber + 1,
          dayWithId: daysData,
          challenge,
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
          challenge,
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

  let isFirstWeekCompleted = false; // Track if the first week is completed

  for (let week = 0; week < numberOfWeeks; week++) {
    const weekData = data.slice(week * 7, (week + 1) * 7);
    // Calculate completion status for the week
    const isWeekCompleted = weekData.every((day) => day.completed);

    const startButtonText = isWeekCompleted
      ? 'Completed'
      : week === 0 && !isFirstWeekCompleted
      ? 'Start'
      : 'Lock';

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

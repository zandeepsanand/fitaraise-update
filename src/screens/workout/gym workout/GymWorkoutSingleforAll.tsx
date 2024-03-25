/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {Block, Button, Image, Text} from '../../../components';
import {useData, useTheme, useTranslation} from '../../../hooks';

import GymWorkoutDetailsPageTwo from './GymWorkoutDetailsPageTwo';
import GymDetails from './GymDetails';
import GymWorkoutDetailsPage from './GymWorkoutDetailsPage';
import api from '../../../../api';
import LoginContext from '../../../hooks/LoginContext';
import moment from 'moment-timezone';
import {usegymData} from '../../../hooks/GymData';
const isAndroid = Platform.OS === 'android';

const GymWorkoutSingleforAll = () => {

  const route = useRoute();
  const {exerciseDataSingle,  index} = route.params;
  const {customerId} = useContext(LoginContext);
  const {exerciseData, setGymData,setGymDataAll,exerciseDataAll} = usegymData();
  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();
  const [buttonVisible, setButtonVisible] = useState(true);
  const [savedDate, setCompletedDate] = useState([]);
 
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(
    exerciseDataAll.findIndex((exercise) => exercise.id === exerciseDataSingle.id),
  );
  const fetchData = () => {
    api
      .get(`get_gym_workout_excercises/${index}`)
      .then((response) => {
        // setExerciseAll(response.data.data);
        setGymDataAll(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });

    // api
    //   .get(`get_gym_workout_excercises_recommended/${index}`)
    //   .then((response) => {
    //     setGymData(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching exercise data:', error);
    //   });
  };
  const goToPreviousWorkout = () => {
    setButtonVisible(true);
    setIsTimerRunning(false);
    setTimerText('Start');
    if (exerciseDataAll && currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
      setTimeLeft(
        exerciseDataAll[currentWorkoutIndex - 1].time_or_sets === 'time'
          ? exerciseDataAll[currentWorkoutIndex - 1].time_in_seconds
          : 0,
      );
      setIsTimerPaused(false); // Reset pause state to false
    }
    fetchData();
  };
  const goToNextWorkout = () => {
    setButtonVisible(true);
    if (currentWorkoutIndex < exerciseDataAll.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
    }
  };
  const currentWorkout = exerciseDataAll[currentWorkoutIndex];
  // const restTimeInSeconds = currentWorkout.rest_time_in_seconds;
  const [timeLeft, setTimeLeft] = useState(
    currentWorkout.time_or_sets === 'time' ? currentWorkout.time_in_seconds : 0,
  );
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    let interval;

    if (
      // !showRestPopup &&
      currentWorkout.time_or_sets === 'time' &&
      timeLeft > 0 &&
      isTimerRunning &&
      !modalVisible // Check if the modal is not visible
    ) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            setIsTimerRunning(false); // Timer has finished
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft, isTimerRunning, modalVisible]);

  console.log(timeLeft, 'actual time left ');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [timerText, setTimerText] = useState('Start');
  const handleToggleTimer = () => {
    if (timeLeft === 0) {
      // Timer has reached 0, do not start/stop the timer
      setIsTimerRunning(false);
      return;
    }

    if (isTimerRunning) {
      setIsTimerRunning(false);
      setTimerText('Resume'); // Change button text to "Resume"
    } else {
      setIsTimerRunning(true);
      setTimerText('Pause'); // Change button text to "Pause"
    }
  };
  // console.log(isTimerPaused);

  const toggleTimerPause = () => {
    setIsTimerPaused((prevIsTimerPaused) => !prevIsTimerPaused);
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };
  const [areFieldsFilled, setFieldsFilled] = useState(false);
  const handleFieldsFilled = (filled) => {
    setFieldsFilled(filled);
  };
  const [kgInputValues, setKgInputValues] = useState(
    Array(currentWorkout.sets).fill(''),
  );
  const [lbsInputValues, setLbsInputValues] = useState(
    Array(currentWorkout.sets).fill(''),
  );
  const [repsInputValuesLbs, setRepsInputValuesLbs] = useState(
    Array(currentWorkout.sets).fill(''),
  );
  const [repsInputValuesKg, setRepsInputValuesKg] = useState(
    Array(currentWorkout.sets).fill(''),
  );
  const [showNextButton, setShowNextButton] = useState(false);
  const customer_id = customerId;
  const workout_id = currentWorkout.workout_id;
  const excercise_id = currentWorkout.excercise;
  const home_workout_excercise = currentWorkout.id;
  const targetTimeZone = 'Asia/Kolkata';
  const completed_date = moment.tz(targetTimeZone).format('YYYY-MM-DD');
  const weightValuesKg = kgInputValues.map((value) => parseInt(value));
  const repsValuesKg = repsInputValuesKg.map((value) => parseInt(value));

  const weightValuesLbs = lbsInputValues.map((value) => parseInt(value));
  const repsValuesLbs = repsInputValuesLbs.map((value) => parseInt(value));
  const hasKgData =
    weightValuesKg.some((value) => !isNaN(value)) &&
    repsValuesKg.some((value) => !isNaN(value));
  const hasLbsData =
    weightValuesLbs.some((value) => !isNaN(value)) &&
    repsValuesLbs.some((value) => !isNaN(value));
  console.log(hasLbsData, 'weight');

  let weight_vs_reps;

  if (hasKgData) {
    // Convert kg data to lbs and create the weight_vs_reps array
    weight_vs_reps = weightValuesKg.map((weight, index) => ({
      weight: `${weight}kg`, // Convert kg to lbs
      reps: repsValuesKg[index],
    }));
  } else if (hasLbsData) {
    // Use lbs data directly
    weight_vs_reps = weightValuesLbs.map((weight, index) => ({
      weight: `${weight}lbs`,
      reps: repsValuesLbs[index],
    }));
  } else {
    // Handle the case when neither kg nor lbs data is present
    console.log('No data entered');
  }

  console.log('====================================');
  console.log(weight_vs_reps, 'demo');
  console.log('====================================');
  useEffect(() => {
    // Update the input arrays with the new workout's sets
    setKgInputValues(Array(currentWorkout.sets).fill(''));
    setLbsInputValues(Array(currentWorkout.sets).fill(''));
    setRepsInputValuesLbs(Array(currentWorkout.sets).fill(''));
    setRepsInputValuesKg(Array(currentWorkout.sets).fill(''));
  }, [currentWorkout]);
  const handleFinish = (currentWorkout) => {
    api
      .post(`add_gym_workout_excercises_done`, {
        customer_id,
        workout_id,
        excercise_id,
        home_workout_excercise,
        completed_date,
        weight_vs_reps,
      })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data, 'saved or not');
          setButtonVisible(true);
          setShowNextButton(true);
          // setCompletedDate([completed_date]);
          // setCompletedWorkouts([
          //   ...completedWorkouts,
          //   currentWorkout.excercise,
          // ]);
        }
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
  };
  const isLastWorkout = currentWorkoutIndex === exerciseDataAll.length - 1;
  return (
    <Block safe marginTop={sizes.md}>
      <Block
        scroll
        // paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Block center paddingTop={20}>
            <View style={{flex: 1}}>
              {/* <GymDetails
                workout={currentWorkout}
                timeLeft={timeLeft}
                formattedTime={formatTime(timeLeft)}
              /> */}

              <GymWorkoutDetailsPage
                workout={currentWorkout}
                timeLeft={timeLeft}
                formattedTime={formatTime(timeLeft)}
                index={index}
                onFieldsFilled={handleFieldsFilled}
                kgInputValues={kgInputValues}
                setKgInputValues={setKgInputValues}
                lbsInputValues={lbsInputValues}
                setLbsInputValues={setLbsInputValues}
                repsInputValuesLbs={repsInputValuesLbs}
                setRepsInputValuesLbs={setRepsInputValuesLbs}
                repsInputValuesKg={repsInputValuesKg}
                setRepsInputValuesKg={setRepsInputValuesKg}
                buttonVisible={buttonVisible}
                setButtonVisible={setButtonVisible}
              />
              {currentWorkout.time_or_sets === 'sets' ? (
                <Block centerContent paddingTop={50}>
                  <Button
                    color={'#19F196F0'}
                    width={100}
                    style={{alignSelf: 'center', backgroundColor: '#19F196F0'}}
                    onPress={() => {
                      if (areFieldsFilled) {
                        // Proceed with your logic
                        goToNextWorkout();
                        handleFinish(currentWorkout);

                        if (isLastWorkout) {
                          handleFinish(currentWorkout);
                          setButtonVisible(true);
                          navigation.navigate('GymCongratsPage');
                          // Replace 'YourNewPage' with the actual page name
                        } else {
                          // Show a message or handle the error
                          // alert('fill all inputs')
                        }
                      }
                    }}
                    disabled={!areFieldsFilled}>
                    <Text center bold>
                      DONE
                    </Text>
                  </Button>
                </Block>
              ) : timeLeft === 0 ? (
                <Block centerContent paddingTop={50}>
                  <Button
                    color={'#19F196F0'}
                    onPress={() => {
                      handleFinish(currentWorkout);
                      goToNextWorkout();
                      setShowNextButton(false);

                      if (isLastWorkout) {
                        setButtonVisible(true);
                        navigation.navigate('GymCongratsPage');
                        // Replace 'YourNewPage' with the actual page name
                      }
                    }}
                    white
                    width={100}
                    radius={15}
                    style={{alignSelf: 'center'}}>
                    <Text bold>Done</Text>
                  </Button>
                </Block>
              ) : (
                <Block centerContent paddingTop={50}>
                  <Button
                    onPress={handleToggleTimer}
                    color={'#19F196F0'}
                    white
                    style={{alignSelf: 'center'}}
                    width={100}
                    radius={15}>
                    <Text bold>{timerText}</Text>
                  </Button>
                </Block>
              )}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button
                  disabled={currentWorkoutIndex === 0}
                  onPress={goToPreviousWorkout}>
                  <Image
                    radius={0}
                    width={30}
                    height={30}
                    // color={colors.primary}
                    source={require('../../../assets/icons/nextpng.png')}
                    transform={[{rotate: '180deg'}]}
                  />
                </Button>
                <Button
                  onPress={goToNextWorkout}
                  disabled={currentWorkoutIndex === exerciseDataAll.length - 1}>
                  <Image
                    radius={0}
                    width={30}
                    height={30}
                    // color={colors.primary}
                    source={require('../../../assets/icons/nextpng.png')}
                    transform={[{rotate: '0deg'}]}
                  />
                </Button>
              </View>
            </View>
          </Block>

          <GymWorkoutDetailsPageTwo workout={currentWorkout} />

          {/* profile: photo album */}
        </Block>
      </Block>

      {/* <TouchableOpacity>
        <Block style={styles.stickyButton} center justify="center">
          <Text style={styles.buttonText} bold>
            START
          </Text>
        </Block>
      </TouchableOpacity> */}
    </Block>
  );
};
const styles = StyleSheet.create({
  stickyButton: {
    backgroundColor: '#19F196', // Customize the button's appearance
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    height: 50, // Set the button's height as needed
    width: 150, // Set the button's width
    alignSelf: 'center', // Align the button horizontally in the center
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default GymWorkoutSingleforAll;

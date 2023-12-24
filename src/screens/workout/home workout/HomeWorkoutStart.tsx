/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment-timezone';
import axios from 'axios';
import {BASE_URL} from '@env';
import {
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  Alert,
  BackHandler
} from 'react-native';
import {useRoute  } from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Text} from '../../../components/';
import {useData, useTheme, useTranslation} from '../../../hooks/';
import HomeWorkoutDetailsPage from './HomeWorkoutDetailsPage';
import HomeWorkoutDetailsPageTwo from './HomeWorkoutDetailsPageTwo';
import Timer from './Timer';
import TimerIntermediatePage from './TimerIntermediatePage';
import api from '../../../../api';


const isAndroid = Platform.OS === 'android';
function PopupPage() {
  // State to control whether the modal is visible or not
  const [modalVisible, setModalVisible] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };
}
const HomeWorkoutStart = () => {
  const route = useRoute();
  const {exerciseData ,workoutData} = route.params;
  // console.log(workoutData , "formDAta");

  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();
  const [showRestPopup, setShowRestPopup] = useState(false);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0); // Start with the first workout
  const [showNextButton, setShowNextButton] = useState(false);
  const [savedDate, setCompletedDate] = useState([]);
  const [isLoading ,setIsLoading]=useState(false);
  // console.log(savedDate , "date for showing scroll calender");

  const currentWorkout = exerciseData[currentWorkoutIndex];
  const nextNotCompletedIndex = exerciseData.findIndex(
    (workout, index) => index >= currentWorkoutIndex && !workout.completed_today
  );
  
  // Determine the next workout based on the index
  const nextNotCompletedWorkout =
    nextNotCompletedIndex !== -1 ? exerciseData[nextNotCompletedIndex] : null;

    const [timeLeft, setTimeLeft] = useState(
      nextNotCompletedWorkout.time_or_sets === 'time' ? nextNotCompletedWorkout.time_in_seconds : 0,
    );
  // console.log(currentWorkout.time_or_sets, 'time or set ');

  const restTimeInSeconds = nextNotCompletedWorkout.rest_time_in_seconds;


  // console.log(timeLeft, 'actual time left ');

  const [isTimerPaused, setIsTimerPaused] = useState(false);
  // console.log(isTimerPaused);

  const toggleTimerPause = () => {
    setIsTimerPaused((prevIsTimerPaused) => !prevIsTimerPaused);
  };
  const goToPreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
      setTimeLeft(
        exerciseData[currentWorkoutIndex - 1].time_or_sets === 'time'
          ? exerciseData[currentWorkoutIndex - 1].time_in_seconds
          : 0,
      );
      setIsTimerPaused(false); // Reset pause state to false
    }
  };


  // const goToNextWorkout = () => {
  //   if (currentWorkoutIndex < exerciseData.length - 1) {
  //     setCurrentWorkoutIndex(currentWorkoutIndex + 1);
  //     setTimeLeft(
  //       exerciseData[currentWorkoutIndex + 1].time_or_sets === 'time'
  //         ? exerciseData[currentWorkoutIndex + 1].time_in_seconds
  //         : 0,
  //     );
  //     setIsTimerPaused(false); // Reset pause state to false
  //     setShowRestPopup(true); // Show the rest time popup

  //   }
  // };


  // this is working code 
  // const goToNextWorkout = () => {
  //   console.log('clicked');

  //   if (exerciseData && currentWorkoutIndex < exerciseData.length - 1) {
  //     const nextWorkout = exerciseData[currentWorkoutIndex + 1];
  //     const newRestTime = nextWorkout.time_in_seconds;

  //     setCurrentWorkoutIndex(currentWorkoutIndex + 1);
  //     setTimeLeft(newRestTime); // Start the new countdown timer with the new rest time
  //     setIsTimerPaused(false); // Reset pause state to false
  //     setShowRestPopup(true); // Show the rest time popup
  //     setShowNextButton(false); // to set show button false
  //   }
  // };
  const goToNextWorkout = () => {
    console.log('clicked');
  
    // Check if there are more workouts and the current index is within bounds
    if (exerciseData && currentWorkoutIndex < exerciseData.length - 1) {
      // Find the next workout with completed_today set to false
      let nextIndex = currentWorkoutIndex + 1;
  
      // Check if the current workout is the first one and is already completed today
      if (
        currentWorkoutIndex === 0 &&
        exerciseData[currentWorkoutIndex].completed_today
      ) {
        console.log('Skipping first completed workout.');
        return;
      }
  
      // Find the next workout with completed_today set to false and not the same as the current workout
      while (
        nextIndex < exerciseData.length &&
        (exerciseData[nextIndex].completed_today ||
          (nextIndex === currentWorkoutIndex + 1 &&
            exerciseData[nextIndex].completed_today))
      ) {
        nextIndex++;
      }
  
      if (nextIndex < exerciseData.length) {
        const nextWorkout = exerciseData[nextIndex];
        const newRestTime = nextWorkout.time_in_seconds;
  
        setCurrentWorkoutIndex(nextIndex);
        setTimeLeft(newRestTime);
        setIsTimerPaused(false);
        setShowRestPopup(true);
        setShowNextButton(false);
      } else {
        console.log('No more uncompleted workouts available.');
        alert("last workout of unfinished");
        // Handle the case where there are no more uncompleted workouts available
      }
    }
  };
  
  const goToNextWorkoutDone = () => {
    console.log('clicked');
  
    if (exerciseData && currentWorkoutIndex < exerciseData.length - 1) {
      let nextIndex = currentWorkoutIndex + 1;
  
      // Find the next workout with completed_today set to false and not the same as the current workout
      while (
        nextIndex < exerciseData.length &&
        (exerciseData[nextIndex].completed_today ||
          (nextIndex === currentWorkoutIndex + 1 &&
            exerciseData[nextIndex].completed_today))
      ) {
        nextIndex++;
      }
  
      if (nextIndex < exerciseData.length) {
        const nextWorkout = exerciseData[nextIndex];
        const newRestTime = nextWorkout.time_in_seconds;
  
        setCurrentWorkoutIndex(nextIndex);
        setTimeLeft(newRestTime);
        setIsTimerPaused(false);
        setShowRestPopup(true);
        setShowNextButton(false);
      } else {
        console.log('No more workouts available.');
        navigation.navigate('CongratsPage');
      }
    }
  };
  

  const handleRestPopupClose = () => {
    setShowRestPopup(false); // Close the rest time popup
  };
  function getPreviousWorkoutRestTime(currentWorkoutIndex, exerciseData) {
    // Start from the current workout's index and move backward
    for (let i = currentWorkoutIndex - 1; i >= 0; i--) {
      const previousWorkout = exerciseData[i];

      // Check if the previous workout has a non-null rest_time_in_seconds
      if (previousWorkout.rest_time_in_seconds !== null) {
        return previousWorkout.rest_time_in_seconds;
      }
    }

    // If no previous workout with non-null rest_time_in_seconds is found, return 0 or a default value
    return 0; // You can change this to a different default value if needed
  }
  const previousRestTimeInSeconds = getPreviousWorkoutRestTime(
    currentWorkoutIndex,
    exerciseData,
  );
  // console.log(previousRestTimeInSeconds, 'testing previous time');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleBackButton, setModalVisibleBackButton] = useState(false);

  useEffect(() => {
    const backAction = () => {
      setModalVisibleBackButton(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleModalButtonPress = (action) => {
    if (action === 'Resume') {
      setModalVisibleBackButton(false);
      // Resume logic
    } else if (action === 'Restart') {
      setModalVisibleBackButton(false);
      // Restart logic
    } else if (action === 'Exit') {
      setModalVisibleBackButton(false);
      navigation.goBack();
    }
  };
  useEffect(() => {
    if (
      !showRestPopup &&
      nextNotCompletedWorkout.time_or_sets === 'time' &&
      timeLeft > 0 &&
      !isTimerPaused &&
      !modalVisible // Check if the modal is not visible
    ) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [nextNotCompletedWorkout, timeLeft, isTimerPaused, showRestPopup, modalVisible]);
  const targetTimeZone = 'Asia/Kolkata'; // Change this to 'Asia/Kolkata' for Indian Standard Time

  const completed_date = moment.tz(targetTimeZone).format('YYYY-MM-DD');
  // const completed_date = new Date().toISOString().slice(0, 10);
  // console.log(completed_date  ,"today date");
  const customer_id = workoutData.customer_id;
  // console.log(customer_id, "check id");
  
  const workout_id = nextNotCompletedWorkout.workout_id;
  const excercise_id = nextNotCompletedWorkout.excercise;
  const home_workout_excercise = nextNotCompletedWorkout.id;
  // const workoutData = {
  //   customer_id,
  //   workout_id,
  //   excercise_id,
  //   home_workout_excercise,
  //   completed_date,
  // };

  const handleFinish = () => {
    api
      .post(
        `add_home_workout_excercises_done`,
        {
          customer_id,
          workout_id,
          excercise_id,
          home_workout_excercise,
          completed_date,
        }
        ,
      )
      .then((response) => {
        // console.log(response.data);
        if (response.data.success) {
          console.log("success workout");
          
          setShowNextButton(true);
          setCompletedDate([completed_date]);
        }
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
  };
  const isLastWorkout = currentWorkoutIndex === exerciseData.length - 1;
  // console.log(showNextButton, 'last');

  useEffect(() => {
    // Open the modal when the component mounts
    setModalVisible(true);

    // Close the modal automatically after 15 seconds
    const timeout = setTimeout(() => {
      setModalVisible(false);
    }, restTimeInSeconds * 1000); // 15000 milliseconds = 15 seconds

    // Clear the timeout if the component unmounts before the timeout
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array means this effect runs only once when mounted
  const handleSkip = () => {
    setModalVisible(false);
    // Close the popup when "Skip" button is pressed
  };
  // const nextNotCompletedIndex = exerciseData.findIndex(
  //   (workout, index) => index > currentWorkoutIndex && !workout.completed_today
  // );
  // const nextNotCompletedIndex = exerciseData.findIndex(
  //   (workout, index) => index >= currentWorkoutIndex && !workout.completed_today
  // );
  
  // // Determine the next workout based on the index
  // const nextNotCompletedWorkout =
  //   nextNotCompletedIndex !== -1 ? exerciseData[nextNotCompletedIndex] : null;

  //   const [timeLeft, setTimeLeft] = useState(
  //     nextNotCompletedWorkout.time_or_sets === 'time' ? nextNotCompletedWorkout.time_in_seconds : 0,
  //   );
  return (
    <Block safe >
      <Block
        scroll
        // paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <View>
            {/* Button to open the modal */}

            {/* Modal */}
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleBackButton}
        onRequestClose={() => {
          setModalVisibleBackButton(false);
        }}
      >
        <Block card flex={1} bottom={10}  center style={styles.modalContainer}>
       
        <Block flex={0} height={85} marginHorizontal={10}>
              <Block row height={85} center>
                <Block
                  flex={0}
                  center
                  width={60}
                  height={60}
                  radius={50}
                  color={'#f0f0f8'}
                  paddingLeft={18}
                  marginTop={10}>
                  <Image
                   
                    width={25}
                    height={25}
                    source={require('../../../assets/icons/pause-button.png')}></Image>
                </Block>
                <Block flex={1} paddingLeft={20} paddingTop={15}>
                  <Block flex={0} center>
                    <Text p semibold>
                     Pause
                    </Text>
                    <Text
                      semibold
                      secondary
                      opacity={0.5}
                      paddingTop={5}
                      size={12}>
                      Please select one option to continue!
                    </Text>
                  </Block>
                </Block>
                <Block flex={0} center paddingRight={10}>
                  <TouchableOpacity>
                    {/* <Image
                      color={'green'}
                      width={8}
                      height={15}
                      source={require('../../../assets/icons/arrow.png')}></Image> */}
                  </TouchableOpacity>
                </Block>
              </Block>
            </Block>
          <TouchableOpacity onPress={() => handleModalButtonPress('Resume')}>
            <Button primary>
            <Text white>Resume</Text>
            </Button>
            
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleModalButtonPress('Restart')}>
          <Button secondary>
          <Text>Restart this exercise</Text>
          </Button>
           
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleModalButtonPress('Exit')}>
          <Button secondary>
          <Text>Yes</Text>
          </Button>
          </TouchableOpacity>
        </Block>
      </Modal>
            <Modal
              animationType="slide" // You can choose different animation types
              transparent={false} // Makes the modal background transparent
              visible={modalVisible} // Controls the visibility of the modal
              // Function called when the Android back button is pressed
            >
              {/* Content of the modal */}
              <Block>
                <Timer
                  restTimeInSeconds={restTimeInSeconds}
                  workout={nextNotCompletedWorkout}
                  data={exerciseData}
                  onClose={handleSkip}
                />
              </Block>
            </Modal>
            <TimerIntermediatePage
              isVisible={showRestPopup }
              restTimeInSeconds={previousRestTimeInSeconds}
              onClose={handleRestPopupClose}
              workout={nextNotCompletedWorkout}
              data={exerciseData}
            />
          </View>
          <Block center paddingTop={20}>
            <View style={{flex: 1}}>
              <HomeWorkoutDetailsPage
                workout={nextNotCompletedWorkout}
                timeLeft={timeLeft}
              />

              {nextNotCompletedWorkout.time_or_sets === 'sets' ? (
                <Block centerContent paddingTop={50}>
                  <Button
                    tertiary
                    width={130}
                    padding={20}
                    style={{alignSelf: 'center', backgroundColor: '#fdb2b2'}}
                    onPress={() => {
                      goToNextWorkoutDone();
                      handleFinish();
                      if (isLastWorkout) {
                        navigation.navigate('CongratsPage', {savedDate}); // Replace 'YourNewPage' with the actual page name
                      }
                    }}>
                    <Text center bold>
                      DONE
                    </Text>
                  </Button>
                </Block>
              ) : timeLeft === 0 ? (
                <Block centerContent paddingTop={50}>
                  {showNextButton ? (
                    <Button
                      tertiary
                      onPress={() => {
                        goToNextWorkoutDone();
                        setShowNextButton(false);
                        handleFinish();
                        if (isLastWorkout) {
                          navigation.navigate('CongratsPage', {savedDate}); // Replace 'YourNewPage' with the actual page name
                        }
                      }}
                      white
                      width={130}
                      padding={20}
                      radius={15}
                      style={{alignSelf: 'center'}}>
                      <Text bold>Next</Text>
                    </Button>
                  ) : (
                    <Button
                      onPress={handleFinish}
                      color={colors.lightGreen}
                      width={150}
                      padding={20}
                      radius={15}
                      style={{alignSelf: 'center'}}>
                      <Text bold>Finish</Text>
                    </Button>
                  )}
                </Block>
              ) : (
                <Block centerContent paddingTop={50}>
                  <Button
                    tertiary
                    onPress={toggleTimerPause}
                    white
                    width={130}
                    padding={20}
                    radius={15}
                    style={{alignSelf: 'center'}}
                    row>
                    <Image
                      radius={0}
                      width={18}
                      height={20}
                      color={colors.white}
                      source={
                        isTimerPaused
                          ? require('../../../assets/icons/play.png')
                          : require('../../../assets/icons/pause.png')
                      }
                      transform={[{rotate: '0deg'}]}
                      style={{alignSelf: 'center'}}
                      marginRight={5}
                    />
                    <Text bold>{isTimerPaused ? 'Resume' : 'Pause'}</Text>
                  </Button>
                </Block>
              )}

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button
                  disabled={nextNotCompletedWorkout === 0}
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
                  disabled={exerciseData.every(workout => workout.completed_today)}
                 >
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

          <HomeWorkoutDetailsPageTwo workout={nextNotCompletedWorkout} />

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
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 36,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height:300
  },
});

export default HomeWorkoutStart;

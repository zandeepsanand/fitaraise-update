import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Modal,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Text} from '../../../components/';
import {useData, useTheme, useTranslation} from '../../../hooks/';

import CircularProgress from 'react-native-circular-progress-indicator';
const workoutData = [
  {name: 'Workout 1', details: 'Details of Workout 1'},
  {name: 'Workout 2', details: 'Details of Workout 2'},
  // ... more workout data
];

const isAndroid = Platform.OS === 'android';
const screenHeight = Dimensions.get('window').height;

const TimerIntermediatePage = ({
  isVisible,
  restTimeInSeconds,
  onClose,
  workout,
  data,
}) => {
  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();
  const [timeLeft, setTimeLeft] = useState(restTimeInSeconds);
  const currentWorkoutIndex = data.findIndex((item) => item.id === workout.id);
  const [countdownFinished, setCountdownFinished] = useState(false);
  let interval;

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(restTimeInSeconds);
      clearInterval(interval); // Clear any existing intervals
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            onClose(); // Automatically close the popup after rest time is done
            return 0; // Ensure timeLeft doesn't go negative
          }
        });
      }, 1000);
    } else {
      clearInterval(interval); // Clear the interval when modal is not visible
    }
  
    return () => {
      clearInterval(interval); // Clear interval when unmounting
    };
  }, [isVisible, restTimeInSeconds]);

  const handleSkip = () => {
    onClose(); // Close the popup when "Skip" button is pressed
  };

  return (
    <Modal
      animationType="slide" // You can choose different animation types
      transparent={false} // Makes the modal background transparent
      visible={isVisible} // Controls the visibility of the modal
      // Function called when the Android back button is pressed
    >
      <Block safe>
        <Block
          scroll
          // paddingHorizontal={sizes.s}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          <View style={styles.container}>
            <View style={styles.section}>
              <Block center>
                <Text style={styles.text} bold center size={20}>
                  REST
                </Text>
                <Text
                  style={styles.text}
                  bold
                  center
                  paddingBottom={20}
                  paddingTop={20}
                  size={30}>
                  00 : {timeLeft.toString().padStart(2, '0')}
                </Text>

                <Button white width={100} radius={15} onPress={handleSkip}>
                  <Text bold> Skip</Text>
                </Button>
              </Block>
            </View>
            <View style={styles.section2}>
              <Text center bold paddingTop={50} size={22}>
                NEXT
              </Text>
              <Text paddingTop={20} bold size={20} primary>
                {workout.name}
              </Text>
              <Block>
                <Text paddingTop={20} semibold size={20}></Text>
                {workout.time_or_sets === 'sets' ? (
                  <Block centerContent>
                    <Text center bold size={30} paddingTop={30}>
                      {' '}
                      {workout.sets} X {workout.reps}
                    </Text>
                  </Block>
                ) : (
                  <Block>
                    <Text bold size={30} paddingTop={30}>
                      {' '}
                      00 : {workout.time_in_seconds}
                    </Text>
                  </Block>
                )}
              </Block>
            </View>
          </View>
        </Block>

        <TouchableOpacity>
          <Block style={styles.stickyButton} center justify="center">
            <Text style={styles.buttonText} bold>
              {currentWorkoutIndex + 1}/{data.length}
            </Text>
          </Block>
        </TouchableOpacity>
      </Block>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Default, just for clarity
  },
  section: {
    minHeight: screenHeight / 2.5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#04FB93', // Just for visualization
    borderRadius: 15,
  },
  section2: {
    paddingHorizontal: 10,
    minHeight: screenHeight / 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Just for visualization
    // marginTop: -10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
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

export default TimerIntermediatePage;

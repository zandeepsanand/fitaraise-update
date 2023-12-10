import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
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

const Timer = ({isVisible, restTimeInSeconds, onClose, workout, data}) => {
  console.log(restTimeInSeconds, 'testing');

  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const currentWorkout = workoutData[currentWorkoutIndex];

  const goToPreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
    }
  };

  const goToNextWorkout = () => {
    if (currentWorkoutIndex < workoutData.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
    }
  };

  return (
    <Block safe >
      <Block
        scroll
        // paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.text} semibold>
              ‘Get ready to sweat and feel great’
            </Text>
          </View>
          <View style={styles.section2}>
            <Text center bold paddingTop={50} size={22}>
              LET’S GO CHAMP
            </Text>
            <Text paddingTop={20} semibold size={15}>
              {workout.name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:40 ,marginLeft:40}}>
              <CircularProgress
                value={0}
                radius={80}
                maxValue={10}
                initialValue={restTimeInSeconds}
                progressValueColor={'#ecf0f1'}
                activeStrokeWidth={15}
                inActiveStrokeWidth={15}
                duration={restTimeInSeconds * 1000}
                circleBackgroundColor={'#778CF6'}
                activeStrokeColor={'#C58BF2'}
                activeStrokeSecondaryColor={'#B4C0FE'}
              />
              <TouchableOpacity onPress={onClose} style={{marginLeft:20}}>
              <Image
                radius={0}
                width={20}
                height={38}
                color={'#778CF6'}
                source={assets.arrow}
                transform={[{rotate: '0deg'}]}
              />
              </TouchableOpacity>
             
            </View>
          </View>
        </View>
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
  },
  section2: {
    minHeight: screenHeight / 1.5,
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Just for visualization
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Timer;

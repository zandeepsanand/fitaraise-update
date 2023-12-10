import React, {useCallback, useState} from 'react';
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

import {Block, Button, Image, Text} from '../../../components/';
import {useData, useTheme, useTranslation} from '../../../hooks/';
import HomeWorkoutDetailsPage from './HomeWorkoutDetailsPage';
import HomeWorkoutDetailsPageTwo from './HomeWorkoutDetailsPageTwo';

const workoutData = [
  {name: 'Workout 1', details: 'Details of Workout 1'},
  {name: 'Workout 2', details: 'Details of Workout 2'},
  // ... more workout data
];
const isAndroid = Platform.OS === 'android';

const HomeWorkoutSingle = () => {
  const route = useRoute();
  const {exerciseDataSingle, exerciseData} = route.params;
  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(
    exerciseData.findIndex((exercise) => exercise.id === exerciseDataSingle.id),
  );

  const goToPreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
    }
  };

  const goToNextWorkout = () => {
    if (currentWorkoutIndex < exerciseData.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
    }
  };

  const currentWorkout = exerciseData[currentWorkoutIndex];

  // console.log(currentWorkout.time_or_sets, 'time or set ');

  const restTimeInSeconds = currentWorkout.rest_time_in_seconds;

  const [timeLeft, setTimeLeft] = useState(
    currentWorkout.time_or_sets === 'time' ? currentWorkout.time_in_seconds : 0,
  );

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
              <HomeWorkoutDetailsPage
                workout={currentWorkout}
                timeLeft={timeLeft}
              />
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
                  disabled={currentWorkoutIndex === exerciseData.length - 1}>
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

          <HomeWorkoutDetailsPageTwo workout={currentWorkout} />

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

export default HomeWorkoutSingle;

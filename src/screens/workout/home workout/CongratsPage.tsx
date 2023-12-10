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

const CongratsPage = ({route}) => {
  const {savedDate} = route.params;
  console.log(savedDate, 'saved date from');

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
    <Block safe marginTop={sizes.md}>
      <Block
        scroll
        // paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <View style={styles.container}>
          <View style={styles.section}>
            <Block center>
              <Text style={styles.text} bold center size={20} lineHeight={25}>
                ‘CONGRATS FOR COMPLETING THIS SESSION’
              </Text>

              <Text
                style={styles.text}
                bold
                center
                paddingBottom={20}
                paddingTop={60}
                paddingHorizontal={20}
                size={15}>
                ‘You are stronger than you think! Keep pushing yourself to reach
                new limits’
              </Text>
            </Block>
          </View>

          <View style={styles.section2}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('HomeTabNavigator', {
                  screen: 'HomeWorkoutMain', // Screen name within the TabNavigator
                  params: {savedDate}, // Pass your parameters here
                });
              }}>
              <Block style={styles.stickyButton} center justify="center" row>
                <Text style={styles.buttonText} bold paddingRight={10}>
                  Finish
                </Text>
                <Image
                  source={require('../../../assets/icons/tick1.png')}></Image>
              </Block>
            </TouchableOpacity>
          </View>
        </View>
      </Block>
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
    backgroundColor: '#04FB93',
    borderRadius: 15,
    padding: 20,
    // width: '90%',

    // Add shadow properties for Android and iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 13,
    },

    shadowOpacity: 0.2,
    shadowRadius: 5,

    elevation: 5, // For Android
  },
  section2: {
    paddingHorizontal: 10,
    minHeight: screenHeight / 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white', // Just for visualization
    marginTop: 10,
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
    // bottom: 10,
    height: 50, // Set the button's height as needed
    width: 150, // Set the button's width
    alignSelf: 'center', // Align the button horizontally in the center
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.2,
    shadowRadius: 5,

    elevation: 5, // For Android
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CongratsPage;

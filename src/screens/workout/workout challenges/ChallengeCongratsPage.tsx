/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Platform,
  Linking,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Text} from '../../../components';
import {useData, useTheme, useTranslation} from '../../../hooks';
import api from '../../../../api';
import LoginContext from '../../../hooks/LoginContext';
import {useWorkoutPathContext} from '../../../hooks/WorkoutPathContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isAndroid = Platform.OS === 'android';
const screenHeight = Dimensions.get('window').height;

const ChallengeCongratsPage = ({route}) => {
  const [isLoading, setLoading] = useState(false);
  const {challenge} = route.params;
  console.log('====================================');
  console.log(challenge, 'congrats');
  console.log('====================================');

  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();
  const {authenticated, customerId} = useContext(LoginContext);
  const {selectedWorkoutPath, setWorkoutPath} = useWorkoutPathContext();

  const handleChallengePage = async () => {
    try {
      // Fetch user data
      setLoading(true);
      const userData = await api.get(`get_personal_datas/${customerId}`);
      const user = userData.data.data;
      console.log(user, 'user data challenge workout loading');

      if (user.gender && user.workout_challenge_level) {
        // Check if user has gender and workout challenge level set
        console.log('entered challege');

        // Fetch home workout data based on user's gender and workout level
        const homeWorkout = await api.get(
          `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
        );
        // console.log(homeWorkout, 'entered');

        const challengeMonthJSON = homeWorkout.data.data;
        console.log('====================================');
        console.log(challengeMonthJSON, 'months');
        console.log('====================================');
        console.log(challengeMonthJSON);

        if (challengeMonthJSON) {
          console.log('inside im');

          // Check if there are active challenges
          const activeChallenges = challengeMonthJSON.filter(
            (challenge) => challenge.currently_using,
          );
          console.log(activeChallenges, 'active challenge?');

          if (activeChallenges.length > 0) {
            // If there are active challenges, find the currently active one
            const currentlyActiveChallenge = activeChallenges.find(
              (challenge) => challenge.currently_using,
            );
            console.log('====================================');
            console.log(currentlyActiveChallenge, 'check active');
            console.log('====================================');
            if (currentlyActiveChallenge) {
              await AsyncStorage.setItem(
                'challengeWorkoutData',
                JSON.stringify(currentlyActiveChallenge),
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
              await AsyncStorage.setItem('WorkoutPath', JSON.stringify('ChallengeTabNavigator'));
              await AsyncStorage.setItem('lastHomePage', 'Workout');
              // Navigate to the main challenge screen with the active challenge
              navigation.navigate('ChallengeTabNavigator', {
                screen: 'ChallengeMain',
                params: {challenge: currentlyActiveChallenge},
              });
            } else {
              console.log('workout page');
              // If no active challenge, navigate to the gender page with workout data
              navigation.navigate('ChallengeMonth', {
                workoutData: user,
              });
            }
          } else {
            // If no active challenge, navigate to the gender page with workout data
            navigation.navigate('ChallengeMonth', {
              workoutData: user,
            });
          }
        } else {
          // If no challenge data, navigate to the gender page with workout data
          navigation.navigate('ChallengeMonth', {
            workoutData: user,
          });
        }
      } else {
        // If gender or workout challenge level is not set, log a message
        console.log('set user gender weight height');

        navigation.navigate('ChallengeGenderPage', {
          workoutData: user,
        });
      }
    } catch (error) {
      // Handle errors during API calls
      if (error.response && error.response.data) {
        console.error('Error fetching stored data 1:', error.response.data);
      } else {
        console.error('Error fetching stored data:', error.message);
      }
    } finally {
      // Set loading state to false
      setLoading(false);
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
            <TouchableWithoutFeedback
              onPress={() => {
                // navigation.navigate('ChallengeTabNavigator', {
                //   screen: 'ChallengeMain',
                //   params: {  challenge },
                // });
                handleChallengePage();
              }}>
              <Block style={styles.stickyButton} center justify="center" row>
                <Text style={styles.buttonText} bold paddingRight={10}>
                  Finish
                </Text>
                <Image
                  source={require('../../../assets/icons/tick1.png')}></Image>
              </Block>
            </TouchableWithoutFeedback>
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

export default ChallengeCongratsPage;

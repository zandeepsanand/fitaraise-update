/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Platform,
  Linking,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Dimensions
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import {BASE_URL} from '@env';

import {Block, Button, Image, Text} from '../../../components/';
import {useData, useTheme, useTranslation} from '../../../hooks/';
import api from '../../../../api';
import {isAuthTokenSet} from '../../../../api';
import {useFavorites} from '../../../hooks/HomeWorkoutContext';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
const screenWidth = Dimensions.get('window').width;

const isAndroid = Platform.OS === 'android';

const HomeWorkoutAll = ({route}) => {
  const {workoutData, workout} = route.params;
  console.log(workoutData, 'workout datas');
  // const {workout} = useFavorites();

  const [exerciseData, setExerciseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  const handleSocialLink = useCallback(
    (type: 'twitter' | 'dribbble') => {
      const url =
        type === 'twitter'
          ? `https://twitter.com/${user?.social?.twitter}`
          : `https://dribbble.com/${user?.social?.dribbble}`;

      try {
        Linking.openURL(url);
      } catch (error) {
        alert(`Cannot open URL: ${url}`);
      }
    },
    [user],
  );
  // useEffect(() => {
  //   const checkAuthenticationStatus = async () => {
  //     try {
  //       // Set isLoading to true to indicate that the check is in progress
  //       setIsLoading(true);

  //       const authDataJSON = await AsyncStorage.getItem('authData');

  //       if (authDataJSON) {
  //         const authData = JSON.parse(authDataJSON);
  //         const authToken = authData.token;

  //         if (authToken) {
  //           try {
  //             // Check if the token is still set
  //             const tokenIsSet = await isAuthTokenSet();
  //             // console.log(tokenIsSet, 'token is set');
  //             console.log(workout.id , "check workout id ");

  //             if (tokenIsSet) {
  //               // Proceed with the API call
  //               const response = await api.get(
  //                 `get_home_workout_excercises/${workout.id}`,
  //               );
  //               setExerciseData(response.data.data);
  //               // ...
  //             } else {
  //               // Handle the case where the token is not set or has expired
  //               console.error(
  //                 'Token is not set or has expired. Handle accordingly.',
  //               );
  //             }
  //           } catch (error) {
  //             // Handle API call errors
  //             console.error('Error fetching exercise data:', error);
  //           }
  //         } else {
  //           // Handle the case where authToken is not set
  //           console.error('authToken is not set');
  //         }
  //       } else {
  //         // Handle the case where authDataJSON is not set
  //         console.error('authDataJSON is not set');
  //       }
  //     } catch (error) {
  //       // Handle AsyncStorage errors
  //       console.error('Error reading authData from AsyncStorage:', error);
  //     } finally {
  //       // Set isLoading to false when the check is finished
  //       setIsLoading(false);
  //     }
  //   };

  //   // Call the checkAuthenticationStatus function
  //   checkAuthenticationStatus();
  // }, [workout.id]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          const tokenIsSet = await isAuthTokenSet();

          if (tokenIsSet) {
            const response = await api.get(
              `get_home_workout_excercises/${workout.id}`,
            );
            setExerciseData(response.data.data);
            // ...
          } else {
            console.error(
              'Token is not set or has expired. Handle accordingly.',
            );
          }
        } catch (error) {
          console.error('Error fetching exercise data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [workout.id]),
  );
  console.log(exerciseData, 'single exercise data');

  return (
    <Block safe marginTop={sizes.md} marginBottom={10}>
      <Block
        scroll
        // paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block  paddingBottom={60} >
         
     
          <FastImage
            style={{
              width: screenWidth * 0.98, // You can adjust this multiplier according to your needs
              height: screenWidth * 0.54, // Keeping aspect ratio for square image
              borderRadius: 30,
              paddingBottom: sizes.l,
              padding: sizes.sm,
              marginLeft:4
            }}
            source={{
              uri: workout.image,

              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              {/* <Text p white marginLeft={sizes.s}>
                {t('profile.title')}
              </Text> */}
            </Button>
            <Block
              flex={0}
              align="center"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black color (adjust the alpha value as needed)
                borderRadius: 50, // Set the border radius to your desired value
                padding: 20, // Optional padding for text inside the view
                width: 250,
                alignContent: 'center',
                alignSelf: 'center',
              }}>
              <Text h5 center white bold>
                {workout.name}
              </Text>
            </Block>
          </FastImage>

          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={-sizes.sm}
            marginHorizontal="8%"
            color="#fffff"
            paddingBottom={20}>
            <Block
              row
              // blur
              color={'white'}
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text h5>{workout.total_minutes} </Text>
                <Text>Minutes</Text>
              </Block>
              <Block align="center">
                <Text h5>{exerciseData.length}</Text>
                <Text>Workouts</Text>
              </Block>
            </Block>
          </Block>

          {/* profile: about me */}
          {/* <Block paddingHorizontal={sizes.sm}>
            <Text semibold marginBottom={sizes.s} marginTop={sizes.s}>
              {workout.total_minutes} minutes - {exerciseData.length} workouts
            </Text>
            <Text p lineHeight={26}>
             
            </Text>
          </Block> */}

          {exerciseData.map((exercise) => (
            <TouchableWithoutFeedback
              key={exercise.id}
              onPress={() => {
                console.log('Navigating with exercise:', exercise);
                navigation.navigate('HomeWorkoutSingle', {
                  exerciseDataSingle: exercise,
                  exerciseData: exerciseData,
                });
              }}>
              <Block
                card
                paddingHorizontal={sizes.sm}
                marginHorizontal={10}
                row
                key={exercise.id}
                marginTop={5}
                color={exercise.completed_today ? 'skyblue' : 'white'}>
                <FastImage
                  style={{width: 75, height: 75, borderRadius: 15}}
                  source={{
                    uri: exercise.image,

                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />

                <Block center>
                  <Block>
                    <Text center bold top={10} primary>
                      {exercise.name}
                    </Text>
                  </Block>
                  {exercise.time_or_sets === 'time' ? (
                    <Block>
                      <Text
                        padding={10}
                        paddingTop={20}
                        bold
                        size={15}
                        secondary
                        center>
                        00 : {exercise.time_in_seconds}
                      </Text>
                    </Block>
                  ) : (
                    <Block>
                      <Text
                        bold
                        size={15}
                        secondary
                        center
                        padding={10}
                        paddingTop={20}>
                        {exercise.sets} X {exercise.reps}
                      </Text>
                    </Block>
                  )}
                </Block>
              </Block>
            </TouchableWithoutFeedback>
          ))}

          {/* profile: photo album */}
        </Block>
      </Block>
      <TouchableWithoutFeedback>
        <Button
          style={styles.stickyButton}
          justify="center"
          color={'#19F196'}
          onPress={() => {
            const isAnyExerciseNotCompleted = exerciseData.some(
              (exercise) => !exercise.completed_today,
            );

            if (isAnyExerciseNotCompleted) {
              navigation.navigate('HomeWorkoutStart', {
                exerciseData: exerciseData,
                workoutData,
              });
            } else {
              // Handle the case where all exercises are completed
              console.log('All exercises are completed. Button is disabled.');
              Alert.alert('All workouts are done today');
            }
          }}>
          <Text style={styles.buttonText} bold>
            START
          </Text>
        </Button>
      </TouchableWithoutFeedback>
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

export default HomeWorkoutAll;

/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  Linking,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import {BASE_URL} from '@env';

import {Block, Button, Image, Text} from '../../../components';
import {useData, useTheme, useTranslation} from '../../../hooks';
import { View } from 'react-native';
import api from '../../../../api';

const isAndroid = Platform.OS === 'android';

const GymWorkoutAll = ({route}) => {
  const {workout, completedWorkouts = []} = route.params;
  // const [exerciseData, setExerciseData] = useState([]);

  console.log(workout.id, 'time');

  const [tab, setTab] = useState<number>(0);

  const [exerciseAll, setExerciseAll] = useState([]);
  const [exerciseRecommended, setExerciseRecommended] = useState([]);
  console.log(exerciseRecommended);

  console.log(completedWorkouts);

  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, fonts, gradients, sizes} = useTheme();

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
  useEffect(() => {
    api
      .get(`get_gym_workout_excercises/${workout.id}`
      )
      .then((response) => {
        // console.log(response.data.data , "data");
        
        setExerciseAll(response.data.data);
        // console.log(exerciseRecommended.id);
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
    api
      .get(`get_gym_workout_excercises_recommended/${workout.id}`)
      .then((response) => {
        const workoutIndex = workout.id;
        setExerciseRecommended(response.data.data);
        // console.log('Exercise data after API call:', response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
  }, [workout.id]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      // setProducts(tab === 0 ? following : trending);
      console.log(tab);
    },
    [setTab],
  );

  return (
    <Block safe marginTop={sizes.md} marginBottom={10}>
      <Block
        scroll
        // paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0} paddingBottom={60}>
          <Image
            style={{height: 250}}
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={30}
            // source={require('../../../assets/images/homeworkout.png')}

            source={{
              uri: `${workout.image}`,
            }}>
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
              {tab ? (
                <>
                   <View style={{flexDirection:'row'}}>
                  {/* <Text p center white>
                    {workout.total_minutes} Minutes , 
                  </Text> */}
                  <Text white>{exerciseAll.length} Workouts</Text>
                </View>
                </>
              ) : (
                <View style={{flexDirection:'row'}}>
                  {/* <Text p center white>
                    {workout.total_minutes} Minutes , 
                  </Text> */}
                  <Text white>{exerciseRecommended.length} Workouts</Text>
                </View>
              )}

              {/* <Block row marginVertical={sizes.m}>
                <Button
                  white
                  outlined
                  shadow={false}
                  radius={sizes.m}
                  onPress={() => {
                    alert(`Follow ${user?.name}`);
                  }}>
                  <Block
                    justify="center"
                    radius={sizes.m}
                    paddingHorizontal={sizes.m}
                    color="rgba(255,255,255,0.2)">
                    <Text white bold transform="uppercase">
                      {t('common.follow')}
                    </Text>
                  </Block>
                </Button>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  marginHorizontal={sizes.sm}
                  color="rgba(255,255,255,0.2)"
                  outlined={String(colors.white)}
                  onPress={() => handleSocialLink('twitter')}>
                  <Ionicons
                    size={18}
                    name="logo-twitter"
                    color={colors.white}
                  />
                </Button>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  color="rgba(255,255,255,0.2)"
                  outlined={String(colors.white)}
                  onPress={() => handleSocialLink('dribbble')}>
                  <Ionicons
                    size={18}
                    name="logo-dribbble"
                    color={colors.white}
                  />
                </Button>
              </Block> */}
            </Block>
          </Image>

          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={-sizes.sm}
            marginHorizontal="8%"
            color="#fffff"
            paddingBottom={20}>
            {/* <Block
              row
              blur
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
            </Block> */}
            <Block
              row
              flex={0}
              radius={sizes.sm}
              align="center"
              justify="space-evenly"
              color={colors.card}
              padding={sizes.sm}>
              <Button onPress={() => handleProducts(0)}>
                <Block row align="center" >
                  <Block 
                    flex={0}
                    radius={6}
                    align="center"
                    justify="center"
                    marginRight={sizes.s}
                    width={sizes.socialIconSize}
                    height={sizes.socialIconSize}
                    gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
                    <Image
                      source={require('../../../assets/icons/recommended1.png')}
                      color={colors.white}
                      radius={0}
                      style={{width: 15, height: 15}}
                    />
                  </Block>
                  <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']} >
                    Recommended
                  </Text>
                </Block>
              </Button>
              <Block
                gray
                flex={0}
                width={1}
                marginHorizontal={sizes.sm}
                height={sizes.socialIconSize}
              />
              <Button onPress={() => handleProducts(1)}>
                <Block row align="center">
                  <Block
                    flex={0}
                    radius={6}
                    align="center"
                    justify="center"
                    marginRight={sizes.s}
                    width={sizes.socialIconSize}
                    height={sizes.socialIconSize}
                    gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
                    <Image
                      radius={0}
                      color={colors.white}
                      source={assets.documentation}
                    />
                  </Block>
                  <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
                    All
                  </Text>
                </Block>
              </Button>
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
          {tab ? (
            <>
              {exerciseAll.map((exercise) => (
                <TouchableWithoutFeedback
                  key={exercise.id}
                  onPress={() => {
                    console.log('Navigating with exercise:', exercise.completed_today);
                    navigation.navigate('GymWorkoutSingle', {
                      exerciseDataSingle: exercise,
                      exerciseData: exerciseAll,
                      index: workout.id,
                    });
                  }}>
                  <Block
                    // card
                    paddingHorizontal={sizes.sm}
                    marginHorizontal={10}
                    row
                    key={exercise.id}
                    marginTop={5}
                    style={{
                      // Check if completedWorkouts is defined and contains the workout ID
                      // backgroundColor:
                      //   completedWorkouts &&
                      //   completedWorkouts.includes(exercise.excercise)
                      //     ? '#92A3FD'
                      //     : 'white',
                      borderRadius: 15,
                      padding: 10,
                    }}
                    color={exercise.completed_today ? '#92A3FD' : 'white'}
                    >
                    <Image
                      width={75}
                      height={75}
                      radius={10}
                      source={{
                        uri: `${exercise.image}`,
                      }}></Image>

                    <Block center>
                      <Block>
                        <Text center bold top={10}>
                          {exercise.name}
                        </Text>
                      </Block>
                      {exercise.time_or_sets === 'time' ? (
                        <Block>
                          <Text
                            padding={10}
                            paddingTop={20}
                            semibold
                            size={15}
                            center>
                            {formatTime(exercise.time_in_seconds)}
                          </Text>
                        </Block>
                      ) : (
                        <Block>
                          <Text
                            semibold
                            size={15}
                            center
                            padding={10}
                            paddingTop={20}>
                            {exercise.sets} Sets
                          </Text>
                        </Block>
                      )}
                    </Block>
                  </Block>
                </TouchableWithoutFeedback>
              ))}
            </>
          ) : (
            <>
              {exerciseRecommended.map((exercise, index) => (
                <TouchableWithoutFeedback
                  key={exercise.id}
                  onPress={() => {
                    console.log('Navigating with exercise:', exercise);
                    navigation.navigate('GymWorkoutSingle', {
                      exerciseDataSingle: exercise,
                      exerciseData: exerciseRecommended,
                      index: workout.id,
                    });
                  }}>
                  <Block
                    // card
                    paddingHorizontal={sizes.sm}
                    marginHorizontal={10}
                    row
                    key={exercise.id}
                    marginTop={5}
                    style={{
                      // Check if completedWorkouts is defined and contains the workout ID
                      // backgroundColor:
                      //   completedWorkouts &&
                      //   completedWorkouts.includes(exercise.excercise)
                      //     ? '#92A3FD'
                      //     : 'white',
                      borderRadius: 15,
                      padding: 10,
                    }}
                    color={exercise.completed_today ? '#92A3FD' : 'white'}
                    >
                    <Image
                      width={75}
                      height={75}
                   
                      // source={require('../../../assets/images/gif.gif')}
                      source={{
                        uri: `${exercise.image}`,
                      }}
                      style={{ borderRadius: 20,
                        }}
                      ></Image>

                    <Block center>
                      <Block>
                        <Text center bold top={10}>
                          {exercise.name}
                        </Text>
                      </Block>
                      {exercise.time_or_sets === 'time' ? (
                        <Block>
                          <Text
                            padding={10}
                            paddingTop={20}
                            semibold
                            size={15}
                            center>
                            {formatTime(exercise.time_in_seconds)}
                          </Text>
                        </Block>
                      ) : (
                        <Block>
                          <Text
                            semibold
                            size={15}
                            center
                            padding={10}
                            paddingTop={20}>
                            {exercise.sets} Sets
                          </Text>
                        </Block>
                      )}
                    </Block>
                  </Block>
                </TouchableWithoutFeedback>
              ))}
            </>
          )}

          {/* profile: photo album */}
        </Block>
      </Block>
      {tab ? (
        <></>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('GymWorkoutStart', {
              exerciseData: exerciseRecommended,
              completedWorkouts: completedWorkouts,
              index: workout.id, // Include the 'index' value here
            });
          }}>
          <Block style={styles.stickyButton} center justify="center">
            <Text style={styles.buttonText} bold white>
              START
            </Text>
          </Block>
        </TouchableWithoutFeedback>
      )}
    </Block>
  );
};
const styles = StyleSheet.create({
  stickyButton: {
    backgroundColor: '#5D5FEF', // Customize the button's appearance
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

export default GymWorkoutAll;

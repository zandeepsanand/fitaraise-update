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

const isAndroid = Platform.OS === 'android';

const ChallengeDayAll = ({route}) => {
  const {responseData, completedWorkouts = [],currentDayNumber,challenge,dayWithId} = route.params;
  // const [exerciseData, setExerciseData] = useState([]);

  console.log(responseData, 'workouts all');

  const [tab, setTab] = useState<number>(0);

  const [exerciseAll, setExerciseAll] = useState([]);
  const [exerciseRecommended, setExerciseRecommended] = useState([]);

  // console.log(completedWorkouts);

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
  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}get_gym_workout_excercises/${workout.id}`, {
  //       headers: {
  //         Authorization: `Bearer 477|F4h2p6ibB4FFhCwx0RJLNO6rPRXhPbMttg2x1iYT`,
  //       },
  //     })
  //     .then((response) => {
  //       setExerciseAll(response.data.data);
  //       // console.log(exerciseRecommended.id);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching exercise data:', error);
  //     });
  //   axios
  //     .get(`${BASE_URL}get_gym_workout_excercises_recommended/${workout.id}`, {
  //       headers: {
  //         Authorization: `Bearer 477|F4h2p6ibB4FFhCwx0RJLNO6rPRXhPbMttg2x1iYT`,
  //       },
  //     })
  //     .then((response) => {
  //       setExerciseRecommended(response.data.data);
  //       // console.log('Exercise data after API call:', response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching exercise data:', error);
  //     });
  // }, [workout.id]);

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
            style={{height: 150}}
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={30}
            // source={require('../../../assets/images/homeworkout.png')}

            source={
              {
                // uri: `${workout.image}`,
              }
            }>
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
            <Image>
              
            </Image>
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
                {/* {workout.name} */} Body Part Name
              </Text>
              {tab ? (
                <>
                  <Text white>Minutes</Text>
                </>
              ) : (
                <Text p center white>
                  {/* {workout.total_minutes}  */}
                  {responseData.length} Workouts
                </Text>
              )}
            </Block>
          </Image>
        </Block>
        <Block card>
          <Text paddingLeft={20} bold>
            Day {currentDayNumber}
          </Text>
          <Text center bold marginBottom={10}>
            {/* EXCERCISE 1 - Legs */}
          </Text>
          {responseData.map((day) => (
            <TouchableWithoutFeedback
              key={day.id} // Assuming 'id' is a unique identifier for each day
              onPress={() => {
                console.log('Navigating with exercise:');
                // Add your navigation logic here
              }}>
              <Block
                paddingHorizontal={sizes.sm}
                marginHorizontal={10}
                row
                marginTop={5}
                style={{
                  backgroundColor: '#F7F8F8',
                  borderRadius: 15,
                  padding: 10,
                  shadowColor: 'gray',
                  shadowOffset: {width: 0, height: 5},
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 5,
                }}
                color={day.customer_completed ? '#92A3FD' : 'white'}
                >
                <Image
                  width={75}
                  height={75}
                  radius={10}
                  source={{
                    uri: day.excercise_image,
                  }}
                />

                <Block center>
                  <Block>
                    <Text center bold top={10}>
                      {day.excercise_name}
                    </Text>
                  </Block>

                  {day.time_or_sets === 'time' ? (
                    <Block>
                      <Text
                        padding={10}
                        paddingTop={20}
                        semibold
                        size={15}
                        center>
                        {day.time_in_seconds} seconds
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
                        {day.excercise_times} 
                      </Text>
                    </Block>
                  )}
                </Block>
              </Block>
            </TouchableWithoutFeedback>
          ))}

          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(
                'ChallengeWorkoutStart',
                {
                  exerciseData: responseData,
                  completedWorkouts: completedWorkouts,
                  currentDayNumber,
                  challenge,dayWithId
                }
              );
            }}>
            <Block
              style={styles.stickyButton}
              center
              justify="center"
              marginTop={20}>
              <Text style={styles.buttonText} bold white h5>
                START
              </Text>
            </Block>
          </TouchableWithoutFeedback>
        </Block>
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  stickyButton: {
    backgroundColor: '#19F196F0', // Customize the button's appearance
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    bottom: 10,
    height: 50, // Set the button's height as needed
    width: 150, // Set the button's width
    alignSelf: 'center', // Align the button horizontally in the center
    borderRadius: 15,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default ChallengeDayAll;

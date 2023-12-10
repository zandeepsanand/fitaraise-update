/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

import {Block, Button, Image, Text} from '../../../components/';
import {useData, useTheme, useTranslation} from '../../../hooks/';
import api from '../../../../api';
import {isAuthTokenSet} from '../../../../api';

const isAndroid = Platform.OS === 'android';

const HomeWorkoutAll = ({route}) => {
  const {workout ,workoutData} = route.params;
  // console.log(workout, 'workout datas');

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
  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        // Set isLoading to true to indicate that the check is in progress
        setIsLoading(true);

        const authDataJSON = await AsyncStorage.getItem('authData');

        if (authDataJSON) {
          const authData = JSON.parse(authDataJSON);
          const authToken = authData.token;

          if (authToken) {
            try {
              // Check if the token is still set
              const tokenIsSet = await isAuthTokenSet();
              // console.log(tokenIsSet, 'token is set');
              console.log(workout.id , "check workout id ");
              

              if (tokenIsSet) {
                // Proceed with the API call
                const response = await api.get(
                  `get_home_workout_excercises/${workout.id}`,
                );
                setExerciseData(response.data.data);
                // ...
              } else {
                // Handle the case where the token is not set or has expired
                console.error(
                  'Token is not set or has expired. Handle accordingly.',
                );
              }
            } catch (error) {
              // Handle API call errors
              console.error('Error fetching exercise data:', error);
            }
          } else {
            // Handle the case where authToken is not set
            console.error('authToken is not set');
          }
        } else {
          // Handle the case where authDataJSON is not set
          console.error('authDataJSON is not set');
        }
      } catch (error) {
        // Handle AsyncStorage errors
        console.error('Error reading authData from AsyncStorage:', error);
      } finally {
        // Set isLoading to false when the check is finished
        setIsLoading(false);
      }
    };

    // Call the checkAuthenticationStatus function
    checkAuthenticationStatus();
  }, [workout.id]);

  console.log(exerciseData , "single exercise data");

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
              {/* <Text p center white>
                {user?.department}
              </Text> */}
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
                        00 : {exercise.time_in_seconds}
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
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('HomeWorkoutStart', {
            exerciseData: exerciseData,workoutData
          });
        }}>
        <Block style={styles.stickyButton} center justify="center">
          <Text style={styles.buttonText} bold>
            START
          </Text>
        </Block>
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

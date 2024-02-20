import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Block, Button, Image, Text} from '../../../components/';
import {useTheme} from '../../../hooks';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '@env';
import YoutubePage from '../../youtube/YoutubePage';

const HomeWorkoutDetailsPage = ({workout, timeLeft}) => {
  const completed_date = new Date().toISOString().slice(0, 10);
  // console.log(completed_date);
  const youtubeId = workout.video_link;
  const {assets, colors, sizes} = useTheme();
  // console.log(workout.id);
  const customer_id = 10;
  const workout_id = workout.workout_id;
  const excercise_id = workout.excercise;
  const home_workout_excercise = workout.id;
  const workoutData = {
    customer_id,
    workout_id,
    excercise_id,
    home_workout_excercise,
    completed_date,
  };

  const navigation = useNavigation();
  // console.log(timeLeft);
  const handleFinish = () => {
    axios
      .post(
        `${BASE_URL}add_home_workout_excercises_done`,
        {
          customer_id,
          workout_id,
          excercise_id,
          home_workout_excercise,
          completed_date,
        },
        {
          headers: {
            Authorization: `Bearer 477|F4h2p6ibB4FFhCwx0RJLNO6rPRXhPbMttg2x1iYT`,
          },
        },
      )
      .then((response) => {
        console.log(response.data);
        // setExerciseData(response.data.data);
        // console.log('Exercise data after API call:', response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
  };
  const [buttonVisible, setButtonVisible] = useState(true);

  const handleButtonPress = () => {
    // Hide the button and show the image
    setButtonVisible(false);
  };
  return (
    <>
      <Image
        background
        resizeMode="cover"
        padding={sizes.sm}
        paddingBottom={sizes.l}
        margin={10}
        height={350}
        radius={30}
        source={{
          uri: `${workout.image}`,
        }}>
        <Block row flex={0}>
          <Button
            row
            flex={0}
            justify="flex-start"
            onPress={() => navigation.goBack()}>
            <Image
              radius={0}
              width={10}
              height={18}
              color={colors.black}
              source={assets.arrow}
              transform={[{rotate: '180deg'}]}
            />
            {/* <Text p white marginLeft={sizes.s}>
                {t('profile.title')}
              </Text> */}
          </Button>
          {youtubeId !== null && (
          <Button
            row
            flex={1}
            justify="flex-end"
            onPress={() => navigation.goBack()}>
            <Image
              radius={0}
              width={18}
              height={18}
              color={colors.danger}
              source={assets.google}
              transform={[{rotate: '0deg'}]}
            />
            {/* <Text p white marginLeft={sizes.s}>
                {t('profile.title')}
              </Text> */}
          </Button>
          )}
        </Block>
      </Image>
      <YoutubePage workout={workout} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 30,
        }}>
        <Text center bold margin={sizes.sm} marginTop={sizes.s}>
          {workout.name}
        </Text>
        {workout.time_or_sets === 'time' ? (
          <>
            <Text padding={10} bold>
              00 : {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </Text>
          </>
        ) : (
          <Text padding={10} bold>
            {workout.sets} X {workout.reps}
          </Text>
        )}
      </View>
    </>
  );
};

export default HomeWorkoutDetailsPage;

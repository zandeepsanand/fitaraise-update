import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Block, Button, Image, Text} from '../../../components/';
import {useTheme} from '../../../hooks';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '@env';
import YoutubePage from '../../youtube/YoutubePage';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import FastImage from 'react-native-fast-image';

const HomeWorkoutDetailsPage = ({
  workout,
  timeLeft,
  buttonVisible,
  setButtonVisible,
}) => {
  const animationProgress = useRef(new Animated.Value(0));
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
  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  });
  const handleButtonPress = () => {
    // Hide the button and show the image
    setButtonVisible(false);
  };

  const navigation = useNavigation();
  // console.log(timeLeft);

  return (
    <>
      <Block safe>
        <Block
          scroll
          paddingHorizontal={sizes.s}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          {buttonVisible && (
            <FastImage
              style={{width: 390, height: 350, borderRadius: 30}}
              source={{
                uri: workout.image,
                headers: {Authorization: 'someAuthToken'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}>
              <Block row flex={0}>
                <Button
                  padding={10}
                  row
                  flex={0}
                  justify="flex-start"
                  onPress={() => navigation.goBack()}>
                  <Image
                    radius={0}
                    width={10}
                    height={18}
                    color={colors.primary}
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
                    // onPress={() => navigation.goBack()}
                    onPress={handleButtonPress}>
                    <Lottie
                      style={styles.backgroundAnimation}
                      source={require('../../../assets/json/youtube.json')}
                      progress={animationProgress.current}
                    />
                  </Button>
                )}
              </Block>
            </FastImage>
          )}

          {!buttonVisible && (
            <>
              <YoutubePage workout={workout} />
              <Block flex={0}>
                <Button
                  paddingRight={20}
                  row
                  flex={0}
                  justify="flex-end"
                  onPress={() => setButtonVisible(true)}>
                  <Image
                    radius={0}
                    width={40}
                    height={28}
                    color={colors.primary}
                    source={require('../../../assets/icons/gif2.png')}
                    transform={[{rotate: '0deg'}]}
                  />
                </Button>
              </Block>
            </>
          )}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 30,
            }}>
            <Text
              center
              bold
              margin={sizes.sm}
              marginTop={sizes.s}
              size={17}
              primary>
              {workout.name}
            </Text>
            {workout.time_or_sets === 'time' ? (
              <>
                <Text padding={10} bold size={15} secondary>
                  00 : {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </Text>
              </>
            ) : (
              <Text padding={10} bold size={15} secondary>
                {workout.sets} X {workout.reps}
              </Text>
            )}
          </View>
        </Block>
      </Block>
    </>
  );
};
const styles = StyleSheet.create({
  backgroundAnimation: {
    height: 80,
    // width:60,
    alignSelf: 'center',
    position: 'relative',
    // zIndex:-10,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default HomeWorkoutDetailsPage;

/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import Animated from 'react-native-reanimated';

import SelectDropdown from 'react-native-select-dropdown';

import axios from 'axios';
import {BASE_URL} from '@env';
import HomeWorkoutCalender from '../home workout/HomeWorkoutCalender';
import GifPlayer from '../GifPlayer';
import GymWorkoutCalender from './GymWorkoutCalender';
import api from '../../../../api';
import CalendarHomeWorkout from '../home workout/calendar/Calendar';
import LoginContext from '../../../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import {ImageBackground} from 'react-native';
import {useWorkoutPathContext} from '../../../hooks/WorkoutPathContext';

const GymWorkoutMain = ({navigation, route}) => {
  const {selectedWorkoutPath, setWorkoutPath} = useWorkoutPathContext();
  const {t} = useTranslation();
  const {data, formDataCopy, savedDate, completedWorkouts} = route.params;
  const {authenticated, customerId} = useContext(LoginContext);
  const isSavedDateAvailable = savedDate !== undefined && savedDate !== null;
  // console.log(completedWorkouts, 'saved workouts');

  console.log(savedDate, 'haiii');

  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [selectedLevel, setSelectedLevel] = useState('');
  const [completedDates, setCompletedDates] = useState([]);
  const [data2, setData2] = useState(data);
  const [isLoading, setIsLoading] = useState(true);
  console.log(data2, 'testing');

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  const handleWorkoutClick = (workout) => {
    // Call the API with workoutId and fetch exercise details
    // Once you have the exercise data, navigate to the 'HomeWorkoutAll' screen
    navigation.navigate('GymWorkoutAll', {workout, data, completedWorkouts});
    console.log(completedWorkouts, 'completed workout list');
  };
  // const handleLevelChange = async (level) => {
  //   setSelectedLevel(level);

  //   if (['Home workout', 'Workout Challenge'].includes(level)) {
  //     if (level === 'Home workout') {
  //       if (selectedWorkoutPath === 'HomeTabNavigator') {
  //         let homeWorkoutData = null;
  //         let userData = null;

  //         // Retrieve homeWorkoutData from AsyncStorage
  //         const storedHomeWorkoutData = await AsyncStorage.getItem('homeWorkoutData');
  //         const storeduserDataHomeWorkout = await AsyncStorage.getItem('userDataHomeWorkout');

  //         if (storedHomeWorkoutData && storeduserDataHomeWorkout) {
  //           homeWorkoutData = JSON.parse(storedHomeWorkoutData);
  //           userData = JSON.parse(storeduserDataHomeWorkout);
  //           navigation.navigate(selectedWorkoutPath, {
  //             screen: 'HomeWorkoutMain',
  //             params: { workout: homeWorkoutData, workoutData: userData },
  //           });
  //         }
  //       }

  //       const userData = await api.get(`get_personal_datas/${formDataCopy.customer_id}`);
  //       const user = userData.data.data;
  //       console.log(user, 'user data home workout loading');

  //       if (user.gender && user.home_workout_level) {
  //         const homeWorkout = await api.get(`get_home_workouts?gender=${user.gender}&level=${user.home_workout_level}`);
  //         const homeWorkoutJSON = homeWorkout.data.data;

  //         if (homeWorkoutJSON) {
  //           console.log(homeWorkoutJSON, 'workout data home');
  //           await AsyncStorage.setItem('homeWorkoutData', JSON.stringify(homeWorkoutJSON));
  //           await AsyncStorage.setItem('userDataHomeWorkout', JSON.stringify(user));
  //           await AsyncStorage.setItem('WorkoutPath', JSON.stringify('HomeTabNavigator'));

  //           setWorkoutPath('HomeTabNavigator');

  //           // Navigate to 'HomeTabNavigator' with homeWorkout and workoutData
  //           navigation.navigate('HomeTabNavigator', {
  //             screen: 'HomeWorkoutMain',
  //             params: { workout: homeWorkoutJSON, workoutData: user },
  //           });
  //         }
  //       } else {
  //         console.log('workout page');
  //         // Navigate to 'Gender' screen with workoutData
  //         navigation.navigate('Gender', {
  //           workoutData: formDataCopy,
  //         });
  //       }
  //     } else if (level === 'Workout Challenge') {
  //       if(selectedWorkoutPath === 'ChallengeTabNavigator'){
  //         let challengeWorkoutData = null;
  //         let userData = null;

  //         // Retrieve homeWorkoutData from AsyncStorage
  //         const storedChallengeWorkoutData = await AsyncStorage.getItem('challengeWorkoutData');
  //         const storeduserDataChallengeWorkout = await AsyncStorage.getItem('userDataChallengeWorkout');
  //         if (storedChallengeWorkoutData && storeduserDataChallengeWorkout) {
  //           challengeWorkoutData = JSON.parse(storedChallengeWorkoutData);
  //           userData = JSON.parse(storeduserDataChallengeWorkout);

  //           // navigation.navigate('GymTabNavigator', {
  //           //   screen: 'GymWorkoutMain',
  //           //   params: {data: gymWorkoutData, formDataCopy:userData},
  //           // });

  //           navigation.navigate('ChallengeTabNavigator', {
  //             screen: 'ChallengeMain',
  //             params: {challenge: challengeWorkoutData},
  //           });
  //         }

  //       }

  //       try {
  //         const authDataJSON = await AsyncStorage.getItem('authData');

  //         if (authDataJSON) {
  //           const authData = JSON.parse(authDataJSON);
  //           const authToken = authData.token;

  //           if (authToken) {
  //             setIsLoading(true);

  //             const authData = JSON.parse(authDataJSON);
  //             const workoutDataJSON = authData.formData;
  //             console.log(customerId, 'id');
  //             const userData = await api.get(`get_personal_datas/${customerId}`);
  //             const user = userData.data.data;
  //             console.log(user, 'user data challenge workout loading');

  //             if (user.gender && user.workout_challenge_level) {
  //               const homeWorkout = await api.get(`get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`);
  //               const challengeMonthJSON = homeWorkout.data.data;
  //               console.log(challengeMonthJSON);
  //               if (challengeMonthJSON) {
  //                 const activeChallenges = challengeMonthJSON.filter((challenge) => challenge.currently_using);

  //                 if (activeChallenges.length > 0) {
  //                   const currentlyActiveChallenge = activeChallenges.find(
  //                     (challenge) => challenge.currently_using,
  //                   );
  //                   console.log('====================================');
  //                   console.log(currentlyActiveChallenge, 'check active');
  //                   console.log('====================================');

  //             await AsyncStorage.setItem('challengeWorkoutData', JSON.stringify(currentlyActiveChallenge));
  //             await AsyncStorage.setItem('userDataChallengeWorkout', JSON.stringify(user));
  //             await AsyncStorage.setItem('WorkoutPath', JSON.stringify('ChallengeTabNavigator'));

  //             setWorkoutPath('ChallengeTabNavigator');

  //                   // Use the navigation.navigate function to pass the data to the next screen
  //                   navigation.navigate('ChallengeTabNavigator', {
  //                     screen: 'ChallengeMain',
  //                     params: { challenge: currentlyActiveChallenge },
  //                   });
  //                 } else {
  //                   console.log('workout page');
  //                   // Navigate to 'Gender' screen with workoutData
  //                   navigation.navigate('ChallengeGenderPage', {
  //                     workoutData: user,
  //                   });
  //                 }
  //               }
  //             } else {
  //               console.log('workout page');
  //               // Navigate to 'Gender' screen with workoutData
  //               navigation.navigate('ChallengeGenderPage', {
  //                 workoutData: user,
  //               });
  //             }
  //           }
  //         } else {
  //           console.log('Token not available');
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'loginNew' }],
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Authentication Status Error:', error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   }
  // };
  const handleLevelChange = async (level) => {
    setSelectedLevel(level);

    if (['Home workout', 'Workout Challenge'].includes(level)) {
      if (level === 'Home workout') {
        const navigationHandled = await handleHomeWorkoutNavigation();
        if (!navigationHandled) {
          await handleHomeWorkoutApiCall();
        }
      } else if (level === 'Workout Challenge') {
        const navigationHandled = await handleChallengeTabNavigation();
        if (!navigationHandled) {
          await handleChallengeTabApiCall();
        }
      }
    }
  };

  const handleHomeWorkoutNavigation = async () => {
    if (selectedWorkoutPath === 'HomeTabNavigator') {
      const storedHomeWorkoutData = await AsyncStorage.getItem(
        'homeWorkoutData',
      );
      const storeduserDataHomeWorkout = await AsyncStorage.getItem(
        'userDataHomeWorkout',
      );

      if (storedHomeWorkoutData && storeduserDataHomeWorkout) {
        const homeWorkoutData = JSON.parse(storedHomeWorkoutData);
        const userData = JSON.parse(storeduserDataHomeWorkout);

        navigation.navigate(selectedWorkoutPath, {
          screen: 'HomeWorkoutMain',
          params: {workout: homeWorkoutData, workoutData: userData},
        });
        return true; // Navigation handled
      }
    }
    return false; // Navigation not handled
  };

  const handleHomeWorkoutApiCall = async () => {
    try {
      const userData = await api.get(
        `get_personal_datas/${formDataCopy.customer_id}`,
      );
      const user = userData.data.data;

      if (user.gender && user.home_workout_level) {
        const homeWorkout = await api.get(
          `get_home_workouts?gender=${user.gender}&level=${user.home_workout_level}`,
        );
        const homeWorkoutJSON = homeWorkout.data.data;

        if (homeWorkoutJSON) {
          await AsyncStorage.setItem(
            'homeWorkoutData',
            JSON.stringify(homeWorkoutJSON),
          );
          await AsyncStorage.setItem(
            'userDataHomeWorkout',
            JSON.stringify(user),
          );
          await AsyncStorage.setItem(
            'WorkoutPath',
            JSON.stringify('HomeTabNavigator'),
          );

          setWorkoutPath('HomeTabNavigator');

          navigation.navigate('HomeTabNavigator', {
            screen: 'HomeWorkoutMain',
            params: {homeWorkout: homeWorkoutJSON, workoutData: user},
          });
        }
      } else {
        console.log('workout page');
        // Navigate to 'Gender' screen with workoutData
        navigation.navigate('Gender', {
          workoutData: formDataCopy,
        });
      }
    } catch (error) {
      console.error('Error in handleHomeWorkoutApiCall:', error);
    }
  };

  const handleChallengeTabNavigation = async () => {
    const storedChallengeWorkoutData = await AsyncStorage.getItem(
      'challengeWorkoutData',
    );
    const storeduserDataChallengeWorkout = await AsyncStorage.getItem(
      'userDataChallengeWorkout',
    );

    if (storedChallengeWorkoutData && storeduserDataChallengeWorkout) {
      const challengeWorkoutData = JSON.parse(storedChallengeWorkoutData);
      const userData = JSON.parse(storeduserDataChallengeWorkout);

      navigation.navigate('ChallengeTabNavigator', {
        screen: 'ChallengeMain',
        params: {challenge: challengeWorkoutData},
      });
      return true; // Navigation handled
    }

    return false; // Navigation not handled
  };

  const handleChallengeTabApiCall = async () => {
    try {
      setIsLoading(true);
      console.log(customerId, 'id');
      const userData = await api.get(`get_personal_datas/${customerId}`);
      const user = userData.data.data;
      console.log(user, 'user data challenge workout loading');

      if (user.gender && user.workout_challenge_level) {
        const homeWorkout = await api.get(
          `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
        );
        const challengeMonthJSON = homeWorkout.data.data;
        console.log(challengeMonthJSON);

        if (challengeMonthJSON) {
          const activeChallenges = challengeMonthJSON.filter(
            (challenge) => challenge.currently_using,
          );

          if (activeChallenges.length > 0) {
            const currentlyActiveChallenge = activeChallenges.find(
              (challenge) => challenge.currently_using,
            );
            console.log('====================================');
            console.log(currentlyActiveChallenge, 'check active');
            console.log('====================================');

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

            navigation.navigate('ChallengeTabNavigator', {
              screen: 'ChallengeMain',
              params: {challenge: currentlyActiveChallenge},
            });
          } else  {
            console.log('workout page');
            // Navigate to 'Gender' screen with workoutData
            navigation.navigate('ChallengeMonth', {
              workoutData: user,
            });
          }
        }
      } else if (user.gender) {
        console.log('workout page');
        // Navigate to 'Gender' screen with workoutData
        navigation.navigate('ChallengeDifficultyLevel', {
          workoutData: user,
        });
      } else {
        console.log('workout page');
        // Navigate to 'Gender' screen with workoutData
        navigation.navigate('ChallengeGenderPage', {
          workoutData: user,
        }); 
      }
    } catch (error) {
      console.error('Authentication Status Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(
        `get_customer_done_gym_workouts/${customerId}`,
      );
      if (response.data.success) {
        // Handle the data and update your calendar with the results
        const completedDates = response.data.data.map(
          (item) => item.completed_date,
        );
        console.log(completedDates, 'dates');
        setCompletedDates(completedDates);
        // Set completedDates in your state or props
      } else {
        // Handle the case when the API call is successful but data is not as expected
      }
    } catch (error) {
      // Handle errors from the API call
    }
  };

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 140,
          }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      {!isLoading && (
        <Block safe marginTop={sizes.md} marginBottom={10}>
          <Block
            scroll
            // paddingHorizontal={sizes.s}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: sizes.padding}}>
            <Block>
              <Block
                row
                style={{
                  justifyContent: 'space-between',
                  paddingBottom: 10,
                  borderBottomWidth: 10,
                  borderBottomColor: '#2FD87269',
                }}>
                <Block center paddingLeft={10}>
                  <Text bold>Gym Workout</Text>
                </Block>
                <Block>
                  <Block
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <SelectDropdown
                      // defaultValue={'one'}
                      dropdownStyle={{borderRadius: 20}}
                      buttonStyle={{
                        height: 50,
                        width: 180,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        marginLeft: 10,
                      }}
                      data={['Home workout', 'Workout Challenge']} // Provide your options here
                      // defaultButtonText={formDataCopy.workout_level}
                      defaultButtonText={'Select Workout'}
                      onSelect={handleLevelChange}
                    />
                  </Block>
                </Block>
              </Block>

              <Block
              // style={{
              //   borderBottomColor: 'black',
              //   borderBottomWidth: 0.11,
              //   backgroundColor: 'white',
              // }}
              // paddingBottom={10}
              ></Block>
              <View style={{paddingBottom: 20}}>
                {/* <GifPlayer /> */}
                <CalendarHomeWorkout savedDate={completedDates} />
              </View>

              {/* <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/200' }}
        style={{ width: 300, height: 300 }}
        sharedTransitionTag="tag"
      /> */}

              {data2.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  onPress={() => handleWorkoutClick(workout)}>
                  <Block
                    flex={1}
                    marginHorizontal={10}
                    marginVertical={10}
                    style={styles.container}>
                    <Block>
                      <Text
                        // white
                        // left={40}
                        // top={20}
                        padding={30}
                        size={20}
                        color={'lightgreen'}
                        bold
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                        }}>
                        {workout.name}
                      </Text>
                      {/* <Text
                        white
                        // left={40}
                        top={60}
                        paddingLeft={25}
                        size={20}
                        bold
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                        }}>
                        {workout.start_quote}
                      </Text> */}
                      <Text
                        white
                        // left={40}
                        top={60}
                        paddingLeft={30}
                        size={15}
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                        }}>
                        Total Minutes : {workout.total_minutes}
                      </Text>
                      <Text
                        white
                        // left={40}
                        top={90}
                        paddingLeft={30}
                        size={15}
                        bold
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                        }}>
                        {formDataCopy.gym_workout_level
                          .charAt(0)
                          .toUpperCase() +
                          formDataCopy.gym_workout_level.slice(1)}
                      </Text>
                      <Animated.Image
                        style={styles.coverImage}
                        source={{uri: `${workout.image}`}}
                        // style={{ width: 300, height: 300 }}
                        sharedTransitionTag="tag"></Animated.Image>

                      {/* <ImageBackground
                    style={styles.coverImage}
                    source={{
                      uri: `${workout.image}`,
                    }}
                    > */}
                      <View style={styles.darkness} />
                      {/* </ImageBackground> */}
                    </Block>
                    <Block
                      right={20}
                      bottom={20}
                      style={{
                        position: 'absolute',
                        zIndex: 10,
                        justifyContent: 'flex-end',
                      }}>
                      <Button
                        color={'#A7F432'}
                        onPress={() => handleWorkoutClick(workout)}>
                        <Text paddingHorizontal={25} size={15} bold>
                          Try
                        </Text>
                      </Button>
                    </Block>
                  </Block>
                </TouchableOpacity>
              ))}
            </Block>
          </Block>
        </Block>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#22faa0',

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  img: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {backgroundColor: '', flexDirection: 'row', flex: 1},
  cover: {padding: 30, width: '50%', height: '10%'},
  text: {padding: 30},
  container: {
    flex: 0.1,
    flexDirection: 'row', // set elements horizontally, try column.
    padding: 20,
    // alignItems: 'center',
  },

  mainCardView: {
    height: 250,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 30,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  mainCardView1: {
    // height: 250,
    // width: 150,
    //    bottom:0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3cf29d',
    borderRadius: 15,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    // marginTop: 6,
    marginBottom: 6,
    marginLeft: 20,
    marginRight: 20,
  },

  bottom: {
    flex: 0.5,
    justifyContent: 'flex-end', // Aligns content to the bottom of the container
    marginBottom: 40, // Optional: Adds some spacing from the bottom
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  container: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  coverImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: 200,
    position: 'absolute',
  },
  darkness: {
    backgroundColor: 'rgba(0,0,0,0.64)',
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  darkness1: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: 200,
    borderRadius: 15,
    zIndex: 20,
  },
});

export default GymWorkoutMain;

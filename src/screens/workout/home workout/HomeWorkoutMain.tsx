/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import FastImage from 'react-native-fast-image';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Animated from 'react-native-reanimated';

import SelectDropdown from 'react-native-select-dropdown';
import HomeWorkoutCalender from './HomeWorkoutCalender';
import axios from 'axios';
import {BASE_URL} from '@env';
import api from '../../../../api';
import CalendarHomeWorkout from './calendar/Calendar';
import LoginContext from '../../../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavorites} from '../../../hooks/HomeWorkoutContext';
import {useWorkoutPathContext} from '../../../hooks/WorkoutPathContext';
import { useFocusEffect } from '@react-navigation/native';

const HomeWorkoutMain = ({navigation, route}) => {
  const {t} = useTranslation();
  const {workout, workoutData} = route.params;
  // const {workout} = useFavorites();
  const homeWorkout = workout;
  const {authenticated, customerId} = useContext(LoginContext);
  const {selectedWorkoutPath, setWorkoutPath} = useWorkoutPathContext();
  console.log('====================================');
  console.log(customerId, selectedWorkoutPath, 'homeworkout check');
  console.log('====================================');
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [selectedLevel, setSelectedLevel] = useState('');
  const [data2, setData2] = useState(homeWorkout);
  const [completedDates, setCompletedDates] = useState([]);

 

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
    navigation.navigate('HomeWorkoutAll', {workout, workoutData});
    // console.log(workout);
  };

  // const handleLevelChange = async (level) => {
  //   setSelectedLevel(level);
  //   if (['Gym workout', 'Workout Challenge'].includes(level)) {
  //     if (level === 'Gym workout') {
  //       if(selectedWorkoutPath === 'GymTabNavigator'){
  //         let gymWorkoutData = null;
  //         let userData = null;

  //         // Retrieve homeWorkoutData from AsyncStorage
  //         const storedGymWorkoutData = await AsyncStorage.getItem('gymWorkoutData');
  //         const storeduserDataGymWorkout = await AsyncStorage.getItem('userDataGymWorkout');
  //         if (storedGymWorkoutData && storeduserDataGymWorkout) {
  //           gymWorkoutData = JSON.parse(storedGymWorkoutData);
  //           userData = JSON.parse(storeduserDataGymWorkout);

  //           navigation.navigate('GymTabNavigator', {
  //             screen: 'GymWorkoutMain',
  //             params: {data: gymWorkoutData, formDataCopy:userData},
  //           });
  //         }

  //       }

  //       try {
  //         const userData = await api.get(
  //           `get_personal_datas/${workoutData.customer_id}`,
  //         );
  //         const user = userData.data.data;
  //         console.log(user, 'user data home workout loading');

  //         if (user.gender && user.gym_workout_level) {
  //           const homeWorkout = await api.get(
  //             `get_gym_workouts?gender=${user.gender}&level=${user.gym_workout_level}`,
  //           );
  //           const gymWorkoutJSON = homeWorkout.data.data;
  //           console.log(gymWorkoutJSON);

  //           if (gymWorkoutJSON) {
  //             console.log(gymWorkoutJSON, 'workout data gym');
  //             await AsyncStorage.setItem('gymWorkoutData', JSON.stringify(gymWorkoutJSON));
  //             await AsyncStorage.setItem('userDataGymWorkout', JSON.stringify(user));
  //             await AsyncStorage.setItem('WorkoutPath', JSON.stringify('GymTabNavigator'));

  //             setWorkoutPath('GymTabNavigator')

  //             // Navigate to 'GymTabNavigator' with gymWorkoutJSON and user data
  //             navigation.navigate('GymTabNavigator', {
  //               screen: 'GymWorkoutMain',
  //               params: {data: gymWorkoutJSON, formDataCopy: user},
  //             });
  //           }
  //         } else {
  //           console.log('workout page');
  //           // Navigate to 'GymGenderPage' with workoutData
  //           navigation.navigate('GymGenderPage', {
  //             workoutData,
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Error in handleLevelChange:', error);
  //       }
  //     } else if (level === 'Workout Challenge') {
  //       // navigation.navigate('ChallengeGenderPage', { workoutData });
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
  //         // Fetch user data
  //         setIsLoading(true);
  //         const userData = await api.get(`get_personal_datas/${customerId}`);
  //         const user = userData.data.data;
  //         console.log(user, 'user data challenge workout loading');

  //         if (user.gender && user.workout_challenge_level) {
  //           // Check if user has gender and workout challenge level set
  //           console.log('entered');

  //           // Fetch home workout data based on user's gender and workout level
  //           const homeWorkout = await api.get(
  //             `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
  //           );
  //           console.log(homeWorkout, 'entered');

  //           const challengeMonthJSON = homeWorkout.data.data;
  //           console.log('====================================');
  //           console.log(challengeMonthJSON, 'months');
  //           console.log('====================================');
  //           console.log(challengeMonthJSON);

  //           if (challengeMonthJSON) {
  //             // Check if there are active challenges
  //             const activeChallenges = challengeMonthJSON.filter(
  //               (challenge) => challenge.currently_using,
  //             );
  //             console.log(activeChallenges, 'active challenge?');

  //             if (activeChallenges.length > 0) {
  //               // If there are active challenges, find the currently active one
  //               const currentlyActiveChallenge = activeChallenges.find(
  //                 (challenge) => challenge.currently_using,
  //               );
  //               console.log('====================================');
  //               console.log(currentlyActiveChallenge, 'check active');
  //               console.log('====================================');
  //               if (currentlyActiveChallenge) {
  //                 // Navigate to the main challenge screen with the active challenge
  //                 navigation.navigate('ChallengeTabNavigator', {
  //                   screen: 'ChallengeMain',
  //                   params: {challenge: currentlyActiveChallenge},
  //                 });

  //               } else {
  //                 console.log('workout page');
  //                 // If no active challenge, navigate to the gender page with workout data
  //                 navigation.navigate('ChallengeGenderPage', {
  //                   workoutData: user,
  //                 });
  //               }
  //             } else {
  //               // If no active challenge, navigate to the gender page with workout data
  //               navigation.navigate('ChallengeGenderPage', {
  //                 workoutData: user,
  //               });
  //             }
  //           } else {
  //             // If no challenge data, navigate to the gender page with workout data
  //             navigation.navigate('ChallengeGenderPage', {
  //               workoutData: user,
  //             });
  //           }
  //         } else {
  //           // If gender or workout challenge level is not set, log a message
  //           console.log('set user gender weight height');

  //           navigation.navigate('ChallengeGenderPage', {
  //             workoutData: user,
  //           });
  //         }
  //       } catch (error) {
  //         // Handle errors during API calls
  //         if (error.response && error.response.data) {
  //           console.error('Error fetching stored data 1:', error.response.data);
  //         } else {
  //           console.error('Error fetching stored data:', error.message);
  //         }
  //       } finally {
  //         // Set loading state to false
  //         setIsLoading(false);
  //       }
  //     }
  //   }
  // };
  const handleLevelChange = async (level) => {
    setSelectedLevel(level);

    const navigateToGymTab = async () => {
      const storedGymWorkoutData = await AsyncStorage.getItem('gymWorkoutData');
      const storeduserDataGymWorkout = await AsyncStorage.getItem(
        'userDataGymWorkout',
      );

      if (storedGymWorkoutData && storeduserDataGymWorkout) {
        const gymWorkoutData = JSON.parse(storedGymWorkoutData);
        const userData = JSON.parse(storeduserDataGymWorkout);

        await AsyncStorage.setItem('lastHomePage', 'Workout');

        navigation.navigate('GymTabNavigator', {
          screen: 'GymWorkoutMain',
          params: {data: gymWorkoutData, formDataCopy: userData},
        });
        return true; // Navigation handled
      }
      return false; // Navigation not handled
    };

    const navigateToChallengeTab = async () => {
      const storedChallengeWorkoutData = await AsyncStorage.getItem(
        'challengeWorkoutData',
      );
      const storeduserDataChallengeWorkout = await AsyncStorage.getItem(
        'userDataChallengeWorkout',
      );

      if (storedChallengeWorkoutData && storeduserDataChallengeWorkout) {
        const challengeWorkoutData = JSON.parse(storedChallengeWorkoutData);
        const userData = JSON.parse(storeduserDataChallengeWorkout);
setWorkoutPath('ChallengeTabNavigator');
await AsyncStorage.setItem('WorkoutPath', JSON.stringify('ChallengeTabNavigator'));

        await AsyncStorage.setItem('lastHomePage', 'Workout');

        navigation.navigate('ChallengeTabNavigator', {
          screen: 'ChallengeMain',
          params: {challenge: challengeWorkoutData},
        });
        return true; // Navigation handled
      }
      return false; // Navigation not handled
    };

    if (['Gym workout', 'Workout Challenge'].includes(level)) {
      if (level === 'Gym workout') {
        const navigationHandled = await navigateToGymTab();
        if (!navigationHandled) {
          await handleGymWorkoutNavigation(); // Handle non-cached case for 'Gym workout'
        }
      } else if (level === 'Workout Challenge') {
        const navigationHandled = await navigateToChallengeTab();
        if (!navigationHandled) {
          await handleChallengeWorkoutNavigation(); // Handle non-cached case for 'Workout Challenge'
        }
      }
    }
  };

  const handleGymWorkoutNavigation = async () => {
    try {
      const userData = await api.get(`get_personal_datas/${customerId}`);
      const user = userData.data.data;

      if (user.gender && user.gym_workout_level) {
        const homeWorkout1 = await api.get(
          `get_gym_workouts?gender=${user.gender}&level=${user.gym_workout_level}`,
        );
        const gymWorkoutJSON = homeWorkout1.data.data;

        if (gymWorkoutJSON) {
          await AsyncStorage.setItem(
            'gymWorkoutData',
            JSON.stringify(gymWorkoutJSON),
          );
          await AsyncStorage.setItem(
            'userDataGymWorkout',
            JSON.stringify(user),
          );
          await AsyncStorage.setItem(
            'WorkoutPath',
            JSON.stringify('GymTabNavigator'),
          );

          setWorkoutPath('GymTabNavigator');
          await AsyncStorage.setItem('WorkoutPath', JSON.stringify('GymTabNavigator'));
          await AsyncStorage.setItem('lastHomePage', 'Workout');

          navigation.navigate('GymTabNavigator', {
            screen: 'GymWorkoutMain',
            params: {data: gymWorkoutJSON, formDataCopy: user},
          });
        }
      } else if (user.gender) {
        navigation.navigate('GymDifficultyLevel', {
          workoutData,
        });
      } else {
        navigation.navigate('GymGenderPage', {
          workoutData,
        });
      }
    } catch (error) {
      console.error('Error in handleGymWorkoutNavigation:', error);
    }
  };

  // const handleChallengeWorkoutNavigation = async () => {
  //   try {
  //     setIsLoading(true);
  //     const userData = await api.get(`get_personal_datas/${customerId}`);
  //     const user = userData.data.data;

  //     if (user.gender && user.workout_challenge_level) {
  //       const homeWorkout = await api.get(
  //         `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
  //       );
  //       const challengeMonthJSON = homeWorkout.data.data;

  //       if (challengeMonthJSON) {
  //         const activeChallenges = challengeMonthJSON.filter(
  //           (challenge) => challenge.currently_using,
  //         );

  //         if (activeChallenges.length > 0) {
  //           const currentlyActiveChallenge = activeChallenges.find(
  //             (challenge) => challenge.currently_using,
  //           );

  //           if (currentlyActiveChallenge) {
  //             navigation.navigate('ChallengeTabNavigator', {
  //               screen: 'ChallengeMain',
  //               params: { challenge: currentlyActiveChallenge },
  //             });
  //           } else {
  //             navigation.navigate('ChallengeGenderPage', {
  //               workoutData: user,
  //             });
  //           }
  //         } else {
  //           navigation.navigate('ChallengeGenderPage', {
  //             workoutData: user,
  //           });
  //         }
  //       } else {
  //         navigation.navigate('ChallengeGenderPage', {
  //           workoutData: user,
  //         });
  //       }
  //     } else {
  //       console.log('set user gender weight height');
  //       navigation.navigate('ChallengeGenderPage', {
  //         workoutData: user,
  //       });
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       console.error('Error fetching stored data 1:', error.response.data);
  //     } else {
  //       console.error('Error fetching stored data:', error.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleChallengeWorkoutNavigation = async () => {
    try {
      setIsLoading(true);
      console.log(customerId, 'id');
      const userData = await api.get(`get_personal_datas/${customerId}`);
      const user = userData.data.data;
      console.log(user, 'user data challenge workout loading');

      if (user.gender && user.workout_challenge_level) {
        const homeWorkoutres = await api.get(
          `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
        );
        const challengeMonthJSON = homeWorkoutres.data.data;
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
         

            setWorkoutPath('ChallengeTabNavigator');
            await AsyncStorage.setItem('WorkoutPath', JSON.stringify('ChallengeTabNavigator'));
            await AsyncStorage.setItem('lastHomePage', 'Workout');

            navigation.navigate('ChallengeTabNavigator', {
              screen: 'ChallengeMain',
              params: {challenge: currentlyActiveChallenge},
            });
          } else {
            console.log('ChallengeMonth');
            // Navigate to 'Gender' screen with workoutData
            navigation.navigate('ChallengeMonth', {
              workoutData: user,
            });
          }
        }
      } else if (user.gender) {
        console.log('ChallengeDifficultyLevel');
        // Navigate to 'Gender' screen with workoutData
        navigation.navigate('ChallengeDifficultyLevel', {
          workoutData: user,
        });
      } else {
        console.log('ChallengeGenderPage');
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

  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate data loading (replace this with your actual data loading logic)
    setTimeout(() => {
      setIsLoading(false); // Set loading state to false when data is loaded
    }, 1000); // Simulate a 2-second loading time (adjust as needed)
  }, []);

  const fetchData = async () => {
  
    try {
      const response = await api.get(
        `get_customer_done_home_workouts/${customerId}`,
      );
      if (response.data.success) {
        // Handle the data and update your calendar with the results
        const completedDates = response.data.data.map(
          (item) => item.completed_date,
        );
        console.log(completedDates, 'dates home w');
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Fetch data when the component comes into focus
    }, []),
  );
  return (
    <Block safe paddingTop={10}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
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
          <Block
            // scroll
            paddingTop={50}
            // paddingHorizontal={sizes.padding}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: sizes.l}}
            paddingBottom={50}
            // centerContent
          >
            <Block
            //   centerContent
            //   center
            //   style={{justifyContent: 'center', flex: 1, marginTop: 10}}
            >
              <Block
                row
                style={{
                  justifyContent: 'space-between',
                  paddingBottom: 10,
                  borderBottomWidth: 10,
                  borderBottomColor: '#2FD87269',
                }}>
                <Block center paddingLeft={10}>
                  <Text bold>Home Workout</Text>
                </Block>

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
                      width: 160,
                      backgroundColor: 'white',
                      borderRadius: 20,
                      marginLeft: 10,
                    }}
                    data={['Gym workout', 'Workout Challenge']}
                    defaultButtonText={'Select Workout'}
                    onSelect={handleLevelChange}
                  />
                </Block>
              </Block>

              <Block></Block>
              <View style={{paddingBottom: 20}}>
                {/* <HomeWorkoutCalender savedDate={savedDate} /> */}
                <CalendarHomeWorkout savedDate={completedDates} />
              </View>
              {/* 
            {workout.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                onPress={() => handleWorkoutClick(workout)}>
                <Block center>
                  <Block paddingTop={20}>
                    <Text
                      center
                      primary
                      bold
                      size={20}
                      padding={5}
                      paddingBottom={10}>
                      {workout.name}
                    </Text>
                  </Block>
                  <Block paddingHorizontal={10}>
                    <Image
                      resizeMode="cover"
                      source={{
                        uri: `${workout.image}`,
                      }}
                      // width={350}
                      style={{
                        overflow: 'hidden',
                        height: 150,
                        width: 350,
                        borderRadius: 15,
                        alignSelf: 'center',
                        position:'relative'
                      }}
                    />
                  
                    
                  </Block>
                </Block>
              </TouchableOpacity>
            ))} */}

              {workout.map((workout) => (
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
                        Total Minutes : {workout.total_minutes}{' '}
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
                        {workoutData.home_workout_level
                          .charAt(0)
                          .toUpperCase() +
                          workoutData.home_workout_level.slice(1)}
                      </Text>

                      <FastImage
                        style={styles.coverImage}
                        source={{
                          uri: workout.image,

                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
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
        )}
      </Block>
    </Block>
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

export default HomeWorkoutMain;

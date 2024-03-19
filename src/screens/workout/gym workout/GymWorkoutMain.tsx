/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import SelectDropdown from 'react-native-select-dropdown';

import api from '../../../../api';

import LoginContext from '../../../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';

import {useWorkoutPathContext} from '../../../hooks/WorkoutPathContext';
import CalendarGym from './gymCalender/GymCalendar';
import {useFocusEffect} from '@react-navigation/native';

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
  const [data3, setData3] = useState(formDataCopy);
  const [showText, setShowText] = useState(true);
  const [loading, setLoading] = useState(false);
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
  const handleTextClick = () => {
    setShowText(false);
  };

  const dropdownRef = useRef<SelectDropdown>(null);

  const handleWorkoutLevel = async (level) => {
    if (['beginner', 'intermediate', 'expert'].includes(level)) {
      if (level === 'beginner') {
        try {
          setLoading(true);
          const userData = await api.get(`get_personal_datas/${customerId}`);
          const user = userData.data.data;

          if (user.gender) {
            const formData = {
              customer_id: customerId,
              gym_workout_level: 'beginner',
            };
            const formDataCopy1 = Object.fromEntries(
              Object.entries(formData).filter(([key, value]) => value !== null),
            );
            console.log(formDataCopy1, 'form data');

            const setUserData = await api.post(
              `set_personal_datas`,
              formDataCopy1,
            );
            console.log(setUserData.data.message);
            const gymWorkout1 = await api.get(
              `get_gym_workouts?gender=${user.gender}&level=beginner`,
            );
            const userData3 = await api.get(`get_personal_datas/${customerId}`);
            console.log('====================================');
            console.log(userData3.data.data, 'beginer check');
            console.log('====================================');
            setData2(gymWorkout1.data.data);
            setData3(userData3.data.data);

            const gymWorkoutJSON = gymWorkout1.data.data;
            const userGym = userData3.data.data;
            if (gymWorkoutJSON && userGym) {
              await AsyncStorage.setItem(
                'gymWorkoutData',
                JSON.stringify(gymWorkoutJSON),
              );
              await AsyncStorage.setItem(
                'userDataGymWorkout',
                JSON.stringify(userGym),
              );
              await AsyncStorage.setItem(
                'WorkoutPath',
                JSON.stringify('GymTabNavigator'),
              );

              setWorkoutPath('GymTabNavigator');
              await AsyncStorage.setItem(
                'WorkoutPath',
                JSON.stringify('GymTabNavigator'),
              );
              await AsyncStorage.setItem('lastHomePage', 'Workout');
            }
            setLoading(false);
            setShowText(true);
          }
        } catch (error) {
          console.error('Error in handleGymWorkoutNavigation:', error);
        }
      }
    }
    if (level === 'intermediate') {
      try {
        setLoading(true);
        const userData = await api.get(`get_personal_datas/${customerId}`);
        const user = userData.data.data;

        if (user.gender) {
          const formData = {
            customer_id: customerId,
            gym_workout_level: 'intermediate',
          };
          const formDataCopy1 = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== null),
          );
          console.log(formDataCopy1, 'form data');

          const setUserData = await api.post(
            `set_personal_datas`,
            formDataCopy1,
          );
          console.log(setUserData.data.message);
          const gymWorkout1 = await api.get(
            `get_gym_workouts?gender=${user.gender}&level=intermediate`,
          );
          const userData3 = await api.get(`get_personal_datas/${customerId}`);
          console.log('====================================');
          console.log(userData3.data.data, 'beginer check');
          console.log('====================================');
          setData2(gymWorkout1.data.data);
          setData3(userData3.data.data);

          const gymWorkoutJSON = gymWorkout1.data.data;
          const userGym = userData3.data.data;
          if (gymWorkoutJSON && userGym) {
            await AsyncStorage.setItem(
              'gymWorkoutData',
              JSON.stringify(gymWorkoutJSON),
            );
            await AsyncStorage.setItem(
              'userDataGymWorkout',
              JSON.stringify(userGym),
            );
            await AsyncStorage.setItem(
              'WorkoutPath',
              JSON.stringify('GymTabNavigator'),
            );

            setWorkoutPath('GymTabNavigator');
            await AsyncStorage.setItem(
              'WorkoutPath',
              JSON.stringify('GymTabNavigator'),
            );
            await AsyncStorage.setItem('lastHomePage', 'Workout');
          }
          setLoading(false);
          setShowText(true);
        }
      } catch (error) {
        console.error('Error in handleGymWorkoutNavigation:', error);
      }
    }
    if (level === 'expert') {
      try {
        setLoading(true);
        const userData = await api.get(`get_personal_datas/${customerId}`);
        const user = userData.data.data;

        if (user.gender) {
          const formData = {
            customer_id: customerId,
            gym_workout_level: 'expert',
          };
          const formDataCopy1 = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== null),
          );
          console.log(formDataCopy1, 'form data');

          const setUserData = await api.post(
            `set_personal_datas`,
            formDataCopy1,
          );
          console.log(setUserData.data.message);
          const gymWorkout1 = await api.get(
            `get_gym_workouts?gender=${user.gender}&level=expert`,
          );
          const userData3 = await api.get(`get_personal_datas/${customerId}`);
          console.log('====================================');
          console.log(userData3.data.data, 'beginer check');
          console.log('====================================');
          setData2(gymWorkout1.data.data);
          setData3(userData3.data.data);

          const gymWorkoutJSON = gymWorkout1.data.data;
          const userGym = userData3.data.data;
          if (gymWorkoutJSON && userGym) {
            await AsyncStorage.setItem(
              'gymWorkoutData',
              JSON.stringify(gymWorkoutJSON),
            );
            await AsyncStorage.setItem(
              'userDataGymWorkout',
              JSON.stringify(userGym),
            );
            await AsyncStorage.setItem(
              'WorkoutPath',
              JSON.stringify('GymTabNavigator'),
            );

            setWorkoutPath('GymTabNavigator');
            await AsyncStorage.setItem(
              'WorkoutPath',
              JSON.stringify('GymTabNavigator'),
            );
            await AsyncStorage.setItem('lastHomePage', 'Workout');
          }
          setLoading(false);
          setShowText(true);
        }
      } catch (error) {
        console.error('Error in handleGymWorkoutNavigation:', error);
      }
    }
  };

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
        await AsyncStorage.setItem('lastHomePage', 'Workout');
        navigation.navigate('HomeTabNavigator', {
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
      const userData = await api.get(`get_personal_datas/${customerId}`);
      const userHome = userData.data.data;

      if (userHome.gender && userHome.home_workout_level) {
        const homeWorkout = await api.get(
          `get_home_workouts?gender=${userHome.gender}&level=${userHome.home_workout_level}`,
        );
        const homeWorkoutJSON = homeWorkout.data.data;

        if (homeWorkoutJSON) {
          await AsyncStorage.setItem(
            'homeWorkoutData',
            JSON.stringify(homeWorkoutJSON),
          );
          await AsyncStorage.setItem(
            'userDataHomeWorkout',
            JSON.stringify(userHome),
          );
          await AsyncStorage.setItem(
            'WorkoutPath',
            JSON.stringify('HomeTabNavigator'),
          );
          await AsyncStorage.setItem(
            'WorkoutPath',
            JSON.stringify('HomeTabNavigator'),
          );
          setWorkoutPath('HomeTabNavigator');
          await AsyncStorage.setItem('lastHomePage', 'Workout');

          navigation.navigate('HomeTabNavigator', {
            screen: 'HomeWorkoutMain',
            params: {workout: homeWorkoutJSON, workoutData: userHome},
          });
        }
      } else if (userHome.gender) {
        navigation.navigate('DifficultyLevel', {workoutData: userHome});
      } else {
        console.log('workout page');
        // Navigate to 'Gender' screen with workoutData
        navigation.navigate('Gender', {
          workoutData: userHome,
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
      await AsyncStorage.setItem('lastHomePage', 'Workout');
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
            await AsyncStorage.setItem(
              'WorkoutPath',
              JSON.stringify('ChallengeTabNavigator'),
            );
            await AsyncStorage.setItem('lastHomePage', 'Workout');
            navigation.navigate('ChallengeTabNavigator', {
              screen: 'ChallengeMain',
              params: {challenge: currentlyActiveChallenge},
            });
          } else {
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
        throw new Error(response.data.message);
        // Handle the case when the API call is successful but data is not as expected
      }
    } catch (error) {
      // Handle errors from the API call

      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Fetch data when the component comes into focus
    }, []),
  );

  return (
    <Block safe>
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
                    paddingBottom: 20,
                    borderBottomWidth: 5,
                    borderBottomColor: '#2FD87269',
                    paddingTop: 15,
                  }}
                  card>
                  <Block center paddingLeft={10}>
                    <Text bold primary>
                      Gym Workout
                    </Text>

                    <View>
                      {showText ? (
                        <TouchableOpacity onPress={handleTextClick}>
                          <Block row paddingTop={10}>
                            <Text>
                              {data3.gym_workout_level.charAt(0).toUpperCase() +
                                data3.gym_workout_level.slice(1)}
                            </Text>
                            <View style={{paddingLeft: 10}}>
                              <FontAwesome
                                name={'edit'}
                                color={'green'}
                                size={18}
                              />
                            </View>
                          </Block>
                        </TouchableOpacity>
                      ) : (
                        <>
                          {loading ? (
                            <Block paddingTop={10} align="flex-start">
                              <ActivityIndicator />
                            </Block>
                          ) : (
                            <Block align="flex-start">
                              <SelectDropdown
                                renderDropdownIcon={(isOpened) => {
                                  return (
                                    <FontAwesome
                                      name={
                                        isOpened ? 'chevron-up' : 'chevron-down'
                                      }
                                      color={'green'}
                                      size={12}
                                    />
                                  );
                                }}
                                ref={dropdownRef}
                                data={['beginner', 'intermediate', 'expert']}
                                defaultButtonText={'Select Difficulty'}
                                onSelect={handleWorkoutLevel}
                                buttonStyle={styles.dropdown2BtnStyle}
                                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdown2DropdownStyle}
                                rowStyle={styles.dropdown2RowStyle}
                                rowTextStyle={styles.dropdown2RowTxtStyle}
                              />
                            </Block>
                          )}
                        </>
                      )}
                    </View>
                  </Block>
                  <Block>
                    <Block
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}
                      paddingRight={10}>
                      <SelectDropdown
                        // defaultValue={'one'}
                        renderDropdownIcon={(isOpened) => {
                          return (
                            <FontAwesome
                              name={isOpened ? 'chevron-up' : 'chevron-down'}
                              color={'green'}
                              size={12}
                            />
                          );
                        }}
                        data={['Home workout', 'Workout Challenge']} // Provide your options here
                        // defaultButtonText={formDataCopy.workout_level}
                        defaultButtonText={'Select Workout'}
                        onSelect={handleLevelChange}
                        buttonStyle={styles.dropdown2BtnStyle}
                        buttonTextStyle={styles.dropdown2BtnTxtStyle}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown2DropdownStyle}
                        rowStyle={styles.dropdown2RowStyle}
                        rowTextStyle={
                          styles.dropdown2RowTxtStyle
                        }></SelectDropdown>
                    </Block>
                  </Block>
                </Block>

                <Block></Block>
                <View style={{paddingBottom: 20}}>
                  {/* <GifPlayer /> */}
                  <CalendarGym
                    savedDate={completedDates}
                    navigation={navigation}
                  />
                </View>

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
                          {data3.gym_workout_level.charAt(0).toUpperCase() +
                            data3.gym_workout_level.slice(1)}
                        </Text>

                        <FastImage
                          style={styles.coverImage}
                          source={{
                            uri: workout.image,

                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />

                        <View style={styles.darkness} />
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
    alignContent: 'center',
    alignSelf: 'stretch',
    // aspectRatio:3,
    flex: 1,

    width: '100%',
    height: '150%',
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

  dropdown1BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown2BtnStyle: {
    width: '95%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'normal',
  },
  dropdown2DropdownStyle: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: 'white', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  dropdown3BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#444',
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    color: '#444',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderBottomColor: '#444',
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3RowTxt: {
    color: '#F1F1F1',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },

  dropdown4BtnStyle: {
    width: '50%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default GymWorkoutMain;

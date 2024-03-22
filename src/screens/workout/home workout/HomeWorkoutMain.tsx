/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
import {useFocusEffect} from '@react-navigation/native';

const HomeWorkoutMain = ({navigation, route}) => {
  const {t} = useTranslation();
  const {workout, workoutData} = route.params;
  console.log('====================================');
  console.log(workoutData, 'userData');
  console.log('====================================');

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
  const [data3, setData3] = useState(workoutData);
  const [showText, setShowText] = useState(true);
  const [loading, setLoading] = useState(false);
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
  const handleTextClick = () => {
    setShowText(false);
  };

 
  const dropdownRef = useRef<SelectDropdown>(null);
  const handleWorkoutLevel = async (level) => {
    if (['beginner', 'intermediate', 'expert'].includes(level)) {
      if (level === 'beginner') {
        setLoading(true);
        try {
          const userData = await api.get(`get_personal_datas/${customerId}`);
          const user = userData.data.data;


          if (user.gender) {
            const formData = {
              customer_id: customerId,
              home_workout_level: 'beginner',
            };
            const formDataCopy = Object.fromEntries(
              Object.entries(formData).filter(([key, value]) => value !== null),
            );
            console.log(formDataCopy, 'form data');

            const setUserData = await api.post(
              `set_personal_datas`,
              formDataCopy,
            );
            console.log(setUserData.data.message);
            const homeWorkout1 = await api.get(
              `get_home_workouts?gender=${user.gender}&level=beginner`,
            );
            const userData3 = await api.get(`get_personal_datas/${customerId}`);
            console.log('====================================');
            console.log(userData3.data.data, 'beginer check');
            console.log('====================================');
            setData2(homeWorkout1.data.data);
            setData3(userData3.data.data);
            const homeWorkoutJSON = homeWorkout1.data.data;
            const userHome = userData3.data.data
            if (homeWorkoutJSON && userHome){
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
             
          setWorkoutPath('HomeTabNavigator');
          await AsyncStorage.setItem('lastHomePage', 'Workout');
            }
            setShowText(true);
            setLoading(false);

          }
        } catch (error) {
          console.error('Error in handleGymWorkoutNavigation:', error);
        }
      }
    } if (level === 'intermediate') {
      setLoading(true);
      try {
        const userData = await api.get(`get_personal_datas/${customerId}`);
        const user = userData.data.data;


        if (user.gender) {
          const formData = {
            customer_id: customerId,
            home_workout_level: 'intermediate',
          };
          const formDataCopy = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== null),
          );
          console.log(formDataCopy, 'form data');

          const setUserData = await api.post(
            `set_personal_datas`,
            formDataCopy,
          );
          console.log(setUserData.data.message);
          const homeWorkout1 = await api.get(
            `get_home_workouts?gender=${user.gender}&level=intermediate`,
          );
          const userData3 = await api.get(`get_personal_datas/${customerId}`);
          console.log('====================================');
          console.log(userData3.data.data, 'beginer check');
          console.log('====================================');
          setData2(homeWorkout1.data.data);
          setData3(userData3.data.data);
          const homeWorkoutJSON = homeWorkout1.data.data;
          const userHome = userData3.data.data
          if (homeWorkoutJSON && userHome){
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
           
        setWorkoutPath('HomeTabNavigator');
        await AsyncStorage.setItem('lastHomePage', 'Workout');
          }
          setShowText(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in handleGymWorkoutNavigation:', error);
      }
    } if (level === 'expert') {
      setLoading(true);
      try {
        const userData = await api.get(`get_personal_datas/${customerId}`);
        const user = userData.data.data;


        if (user.gender) {
          const formData = {
            customer_id: customerId,
            home_workout_level: 'expert',
          };
          const formDataCopy = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value !== null),
          );
          console.log(formDataCopy, 'form data');

          const setUserData = await api.post(
            `set_personal_datas`,
            formDataCopy,
          );
          console.log(setUserData.data.message);
          const homeWorkout1 = await api.get(
            `get_home_workouts?gender=${user.gender}&level=expert`,
          );
          const userData3 = await api.get(`get_personal_datas/${customerId}`);
          console.log('====================================');
          console.log(userData3.data.data, 'beginer check');
          console.log('====================================');
          setData2(homeWorkout1.data.data);
          setData3(userData3.data.data);
          const homeWorkoutJSON = homeWorkout1.data.data;
          const userHome = userData3.data.data
          if (homeWorkoutJSON && userHome){
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
           
        setWorkoutPath('HomeTabNavigator');
        await AsyncStorage.setItem('lastHomePage', 'Workout');
          }
          setShowText(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in handleGymWorkoutNavigation:', error);
      }
    }
  };

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
        await AsyncStorage.setItem(
          'WorkoutPath',
          JSON.stringify('GymTabNavigator'),
        );


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
        await AsyncStorage.setItem(
          'WorkoutPath',
          JSON.stringify('ChallengeTabNavigator'),
        );

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
          await AsyncStorage.setItem(
            'WorkoutPath',
            JSON.stringify('GymTabNavigator'),
          );
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
          safe marginTop={sizes.md} marginBottom={10}
          >
           
              <Block
              row
               style={{
                justifyContent: 'space-between',
                paddingBottom: 20,
                borderBottomWidth: 5,
                borderBottomColor: '#2FD87269',
                paddingTop:15
              }} card>
                <Block center paddingLeft={10}>
                  <Text bold>Home Workout</Text>
              
                   <View>
      {showText ? (
          <TouchableOpacity onPress={handleTextClick}>
          <Block row paddingTop={10}>
            <Text>
              {data3.home_workout_level.charAt(0).toUpperCase() +
                data3.home_workout_level.slice(1)}
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

                <Block
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <SelectDropdown
                    // defaultValue={'one'}

                    // dropdownStyle={{borderRadius: 20}}
                    // buttonStyle={{
                    //   height: 50,
                    //   width: 160,
                    //   backgroundColor: 'white',
                    //   borderRadius: 20,
                    //   marginLeft: 10,

                    // }}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <FontAwesome
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={'green'}
                          size={12}
                        />
                      );
                    }}
                    ref={dropdownRef}
                    data={['Gym workout', 'Workout Challenge']}
                    defaultButtonText={'Select Workout'}
                    onSelect={handleLevelChange}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                    rowStyle={styles.dropdown2RowStyle}
                    rowTextStyle={styles.dropdown2RowTxtStyle}
                  />
                </Block>
              </Block>

              <Block></Block>
              <View style={{paddingBottom: 20}}>
                {/* <HomeWorkoutCalender savedDate={savedDate} /> */}
                <CalendarHomeWorkout
                  savedDate={completedDates}
                  navigation={navigation}
                />
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
                        {data3.home_workout_level
                          .charAt(0)
                          .toUpperCase() +
                          data3.home_workout_level.slice(1)}
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
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},

  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
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
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize:10,
  },
  dropdown2BtnTxtStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'normal',
    fontSize:14,
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
    fontSize:14,
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

export default HomeWorkoutMain;

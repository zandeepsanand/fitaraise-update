/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../../components';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

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
import { ActivityIndicator } from 'react-native';

const GymWorkoutMain = ({navigation, route}) => {

  const {t} = useTranslation();
  const {data, formDataCopy, savedDate, completedWorkouts} = route.params;
  const {authenticated,customerId} = useContext(LoginContext);
  const isSavedDateAvailable = savedDate !== undefined && savedDate !== null;
  // console.log(completedWorkouts, 'saved workouts');

  console.log(savedDate, 'haiii');

  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [selectedLevel, setSelectedLevel] = useState(
    ''
  );
  const [completedDates, setCompletedDates] = useState([]);
  const [data2, setData2] = useState(data);
  const [isLoading , setIsLoading] = useState(true);
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
  const handleLevelChange = async(level) => {
    setSelectedLevel(level);
    if (['Home workout', 'Workout Challenge'].includes(level)) {
      // Make an Axios API call here with the selected level
      if (level === 'Home workout') {
        // console.log('clicked');
        
        // navigation.navigate('HomeWorkoutLoadingScreen');
        const userData = await api.get(
          `get_personal_datas/${formDataCopy.customer_id}`,
        );
        const user = userData.data.data;
        console.log(user, "user data home workout loading");
        


        if (user.gender && user.home_workout_level){
          const homeWorkout = await api.get(
            `get_home_workouts?gender=${user.gender}&level=${user.home_workout_level}`,
          );
          const homeWorkoutJSON = homeWorkout.data.data;
          console.log(homeWorkoutJSON);
          if (homeWorkoutJSON) {
            console.log(homeWorkoutJSON , "workout data home");
            
            
            // Navigate to 'HomeTabNavigator' with homeWorkout and workoutData
            navigation.navigate('HomeTabNavigator', {
              screen: 'HomeWorkoutMain',
              params: { homeWorkout:homeWorkoutJSON, workoutData:user },
            });
          } 
        }else {
          console.log('workout page');
          // Navigate to 'Gender' screen with workoutData
          navigation.navigate('Gender', {
            workoutData:formDataCopy,
          });
        }

      } else if (level === 'Workout Challenge') {
        // navigation.navigate('ChallengeGenderPage',{workoutData :formDataCopy});
        try {
          const authDataJSON = await AsyncStorage.getItem('authData');
         
          if (authDataJSON) {
           
            const authData = JSON.parse(authDataJSON);
    
            const authToken = authData.token;
            // console.log('token');
    
            if (authToken) {
             
              setIsLoading(true);
              // setAuthToken(authToken);
              // console.log(authToken, "token preview");
    
              try {
               
                const authData = JSON.parse(authDataJSON);
                const workoutDataJSON = authData.formData;
                console.log(customerId , "id");
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
                      // You can choose to navigate with the first active challenge here
                      const firstActiveChallenge = activeChallenges[0];
    
                      // Use the navigation.navigate function to pass the data to the next screen
                      // navigation.navigate('ChallengeMain', { workoutData, challenge: firstActiveChallenge });
    
                      navigation.navigate('ChallengeTabNavigator', {
                        screen: 'ChallengeMain',
                        params: {challenge: firstActiveChallenge},
                      });
                      // navigation.navigate('ChallengeMenu', {
                      //   workoutData ,
                      //   challenge:firstActiveChallenge,
                      //   formDataCopy: authData.formData,
                      // });
                    }
                    else {
                      console.log('workout page');
                      // Navigate to 'Gender' screen with workoutData
                      navigation.navigate('ChallengeGenderPage', {
                        workoutData: user,
                      });
                    }
                  }
                } else {
                  console.log('workout page');
                  // Navigate to 'Gender' screen with workoutData
                  navigation.navigate('ChallengeGenderPage', {
                    workoutData: user,
                  });
                }
    
                // console.log(homeWorkoutJSON.data.data);
              } catch (error) {
                console.error('Error fetching stored data:', error);
              } finally {
                setIsLoading(false);
              }
            }
          } else {
            console.log('Token not available');
            navigation.reset({
              index: 0,
              routes: [{name: 'loginNew'}],
            });
          }
        } catch (error) {
          console.error('Authentication Status Error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  const fetchData = async () => {
    try {
      const response = await api.get(`get_customer_done_gym_workouts/${customerId}`);
      if (response.data.success) {
        // Handle the data and update your calendar with the results
        const completedDates = response.data.data.map((item) => item.completed_date);
        console.log(completedDates, "dates");
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop:140}}>
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
            justify="space-around"
            paddingBottom={10}
            style={{borderBottomWidth: 10, borderBottomColor: '#2FD87269'}}>
            <Block paddingLeft={10}>
              <Block>
                <Text bold>Gym Workout</Text>
              </Block>
              <Block row>
                <Text>Your program :</Text>
                <Text bold>
                  {' '}
                  {formDataCopy.gym_workout_level.charAt(0).toUpperCase() +
                    formDataCopy.gym_workout_level.slice(1)}
                </Text>
              </Block>
            </Block>
            <Block>
              <Block center>
                <SelectDropdown
                  defaultValue={'one'}
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
            <CalendarHomeWorkout  savedDate={completedDates}/>
          </View>

          {data2.map((workout) => (
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
                    // resizeMode="contain"
                    source={{
                      uri: `${workout.image}`,
                    }}
                    style={{
                      overflow: 'hidden',
                      height: 114,
                      width: 350,
                      borderRadius: 15,
                      alignSelf: 'center',
                    }}
                  />
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
});

export default GymWorkoutMain;

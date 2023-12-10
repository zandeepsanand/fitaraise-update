/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useData, useTheme, useTranslation} from '../../hooks';
import {Block, Button, Image, Input, Product, Text} from '../../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext from '../../hooks/LoginContext';
import api, {setAuthToken} from '../../../api';

const WorkoutFirstPage = ({navigation, route}) => {
  const {workoutData} = route.params;

  console.log(workoutData, 'workout  first page');

  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const {authenticated, customerId} = useContext(LoginContext);
console.log('====================================');
console.log(customerId);
console.log('====================================');
  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  const handleChallengePage = async () => {
   
    try {
      const authDataJSON = await AsyncStorage.getItem('authData');
     
      if (authDataJSON) {
       
        const authData = JSON.parse(authDataJSON);

        const authToken = authData.token;
        // console.log('token');

        if (authToken) {
         
          setIsLoading(true);
          setAuthToken(authToken);
          console.log(authToken, "token preview");

          try {
           
            const authData = JSON.parse(authDataJSON);
            const workoutDataJSON = authData.formData;
            // const token =authData.token;

            console.log(customerId , "id");
            const userData = await api.get(`get_personal_datas/${customerId}`);
          
            const user = userData.data.data;
            console.log(user, 'user data challenge workout loading');
           
            if (user.gender && user.workout_challenge_level) {
            
              const homeWorkout = await api.get(
                `get_workout_challenges?gender=${user.gender}&level=${user.workout_challenge_level}`,
              );
              const challengeMonthJSON = homeWorkout.data.data;
              console.log('====================================');
              console.log(challengeMonthJSON, "months");
              console.log('====================================');
              console.log(challengeMonthJSON);
              if (challengeMonthJSON) {
             
                const activeChallenges = challengeMonthJSON.filter(
                  (challenge) => challenge.currently_using,
                );

                if (activeChallenges.length > 0) {
                  // Get the challenge that is currently in use (where currently_using is true)
                  const currentlyActiveChallenge = activeChallenges.find(
                    (challenge) => challenge.currently_using
                  );
            console.log('====================================');
            console.log(currentlyActiveChallenge,"check active");
            console.log('====================================');
                  if (currentlyActiveChallenge) {
                    // Use the navigation.navigate function to pass the data to the next screen
                    navigation.navigate('ChallengeTabNavigator', {
                      screen: 'ChallengeMain',
                      params: { challenge: currentlyActiveChallenge },
                    });
                  }
                else {
                  console.log('workout page');
                  // Navigate to 'Gender' screen with workoutData
                  navigation.navigate('ChallengeGenderPage', {
                    workoutData: user,
                  });
                }
              }else{
                navigation.navigate('ChallengeGenderPage', {
                  workoutData: user,
                });
              }
            } else {
            
              // Navigate to 'Gender' screen with workoutData
              navigation.navigate('ChallengeGenderPage', {
                workoutData: user,
              });
            }
          }

            // console.log(homeWorkoutJSON.data.data);
          } catch (error) {
            console.error('Error fetching stored data:', error);
          } finally {
            setIsLoading(false);
          }
        }
       else {
        console.log('Token not available');
        navigation.reset({
          index: 0,
          routes: [{name: 'loginNew'}],
        });
      }}
    } catch (error) {
      console.error('Authentication Status Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Block>
      <Block flex={0} padding={sizes.padding}></Block>

      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block
          row
          wrap="wrap"
          justify="space-between"
          marginTop={sizes.sm}></Block>
        <Block>
          <View style={styles.container1}>
            <ExpoStatusBar style="auto" />
          </View>

          <View style={styles.container}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('HomeWorkoutLoadingScreen');
                handleProducts(2);
              }}>
              <Block
                style={styles.mainCardView}
                gradient={gradients?.[tab === 2 ? 'success' : '#ffff']}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.subCardView}></View>
                  <View style={{marginLeft: 12}}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                      bold>
                      HOME WORKOUTS
                    </Text>
                    <View
                      style={{
                        marginTop: 4,
                        borderWidth: 0,
                        width: '85%',
                      }}></View>
                  </View>
                </View>
                <View
                  style={{
                    height: 25,
                    backgroundColor: 'pink',
                    borderWidth: 0,
                    width: 25,
                    marginLeft: -26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                  }}>
                  <Image
                    source={assets.arrow}
                    color={colors.white}
                    radius={0}
                  />
                </View>
              </Block>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                handleProducts(3);
                navigation.navigate('GymWorkoutLoadingScreen');
              }}>
              <Block
                style={styles.mainCardView}
                gradient={gradients?.[tab === 3 ? 'success' : '#ffff']}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.subCardView}></View>
                  <View style={{marginLeft: 12}}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                      bold>
                      GYM WORKOUTS
                    </Text>
                    <View
                      style={{
                        marginTop: 4,
                        borderWidth: 0,
                        width: '85%',
                      }}></View>
                  </View>
                </View>
                <View
                  style={{
                    height: 25,
                    backgroundColor: 'pink',
                    borderWidth: 0,
                    width: 25,
                    marginLeft: -26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                  }}>
                  <Image
                    source={assets.arrow}
                    color={colors.white}
                    radius={0}
                  />
                </View>
              </Block>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                handleProducts(4);
                // navigation.navigate('ChallengeGenderPage',{workoutData});
                handleChallengePage();
              }}>
              <Block
                style={styles.mainCardView}
                gradient={gradients?.[tab === 4 ? 'success' : '#ffff']}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.subCardView}></View>
                  <Block style={{alignContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                      bold
                      primary
                      // center
                    >
                      WORKOUT CHALLENGES
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                      bold
                      // center
                    >
                      (Transformation plan)
                    </Text>
                    <View
                      style={{
                        marginTop: 4,
                        borderWidth: 0,
                        width: '85%',
                      }}></View>
                  </Block>
                </View>
                <Block
                  flex={1}
                  style={{
                    height: 25,
                    backgroundColor: 'pink',
                    borderWidth: 0,
                    width: 25,
                    marginLeft: -26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                  }}>
                  <Image
                    source={assets.arrow}
                    color={colors.white}
                    radius={0}
                  />
                </Block>
              </Block>
            </TouchableWithoutFeedback>
          </View>
        </Block>
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
    flex: 4,
    flexDirection: 'row', // set elements horizontally, try column.
    padding: 20,
  },
  powderblue: {
    width: 60,
    height: 60,
    backgroundColor: 'powderblue',
  },
  skyblue: {
    width: 60,
    height: 60,
    backgroundColor: 'skyblue',
  },
  steelblue: {
    width: 60,
    height: 60,
    backgroundColor: 'steelblue',
  },
  container: {
    flex: 3,
    // backgroundColor: '#f9f6ee',
  },
  mainCardView: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 30,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 0,
    backgroundColor: 'transparent',
    // borderColor: "green",
    // borderWidth: 1,
    // borderStyle: "solid",
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WorkoutFirstPage;

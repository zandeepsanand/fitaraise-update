/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';



import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import Lottie from 'lottie-react-native';
import {Alert, Animated, Easing, TouchableWithoutFeedback} from 'react-native';
import Toast from 'react-native-toast-message';

import {
  StyleSheet,
  // Text,
  View,
  SafeAreaView,
  Platform,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {BlurView} from 'expo-blur';
import LoginContext from '../hooks/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, {setAuthToken} from '../../api';
import Loader from '../screens/alert/loader/Loader';
import messaging from '@react-native-firebase/messaging';
import {useWorkoutPathContext} from '../hooks/WorkoutPathContext';


const {height, width} = Dimensions.get('window');

const sizes = ['S', 'M', 'L'];

export default function Frstpage({
  navigation,
  route: {
    params: {formData},
  },
}) {
  console.log(formData);
  const {loginSuccess} = useContext(LoginContext);
  const {selectedWorkoutPath, setWorkoutPath} = useWorkoutPathContext();

  console.log('====================================');
  console.log(selectedWorkoutPath, 'first page');
  console.log('====================================');

  useEffect(()=>{
    AsyncStorage.getItem('userDataHomeWorkout')
    .then(value => {
      if (value !== null) {
        console.log('Value retrieved successfully:', value);
      } else {
        console.log('No value stored for this key sandeep');
      }
    })
    .catch(error => {
      console.error('Error retrieving value: ', error);
    });
  });
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const [isLoading, setIsLoading] = useState(false);
  const [expoNotification, setExpoNotification] = useState('');
  const {
    customerId,
    isLoggedIn,

    token,
    logout, // You can access the logout function
  } = useContext(LoginContext);
  console.log(customerId, 'idddd');

  const handleLogout = () => {
    console.log('clicked');

    // Call the logout function to log the user out
    logout();
    navigation.navigate('FirstPageCountrySelect');
  };
  const handlePressOut = async () => {
    try {
      if (selectedWorkoutPath === 'HomeTabNavigator') {
        let homeWorkoutData = null;
        let userData = null;

        // Retrieve homeWorkoutData from AsyncStorage
        const storedHomeWorkoutData = await AsyncStorage.getItem(
          'homeWorkoutData',
        );
        const storeduserDataHomeWorkout = await AsyncStorage.getItem(
          'userDataHomeWorkout',
        );
        if (storedHomeWorkoutData && storeduserDataHomeWorkout) {
          homeWorkoutData = JSON.parse(storedHomeWorkoutData);
          userData = JSON.parse(storeduserDataHomeWorkout);
          navigation.navigate(selectedWorkoutPath, {
            screen: 'HomeWorkoutMain',
            params: {workout: homeWorkoutData, workoutData: userData},
          });
        }

        // If there's a selectedWorkoutPath, navigate to that path
        // navigation.navigate(selectedWorkoutPath, {
        //   workoutData: formData,
        //   workout: homeWorkoutData,
        // });
      } else if (selectedWorkoutPath === 'GymTabNavigator') {
        let gymWorkoutData = null;
        let userData = null;

        // Retrieve homeWorkoutData from AsyncStorage
        const storedGymWorkoutData = await AsyncStorage.getItem(
          'gymWorkoutData',
        );
        const storeduserDataGymWorkout = await AsyncStorage.getItem(
          'userDataGymWorkout',
        );
        if (storedGymWorkoutData && storeduserDataGymWorkout) {
          gymWorkoutData = JSON.parse(storedGymWorkoutData);
          userData = JSON.parse(storeduserDataGymWorkout);

          navigation.navigate('GymTabNavigator', {
            screen: 'GymWorkoutMain',
            params: {data: gymWorkoutData, formDataCopy: userData},
          });
        }
      } else if (selectedWorkoutPath === 'ChallengeTabNavigator') {
        let challengeWorkoutData = null;
        let userData = null;

        // Retrieve homeWorkoutData from AsyncStorage
        const storedChallengeWorkoutData = await AsyncStorage.getItem(
          'challengeWorkoutData',
        );
        const storeduserDataChallengeWorkout = await AsyncStorage.getItem(
          'userDataChallengeWorkout',
        );
        if (storedChallengeWorkoutData && storeduserDataChallengeWorkout) {
          challengeWorkoutData = JSON.parse(storedChallengeWorkoutData);
          userData = JSON.parse(storeduserDataChallengeWorkout);

          // navigation.navigate('GymTabNavigator', {
          //   screen: 'GymWorkoutMain',
          //   params: {data: gymWorkoutData, formDataCopy:userData},
          // });

          navigation.navigate('ChallengeTabNavigator', {
            screen: 'ChallengeMain',
            params: {challenge: challengeWorkoutData},
          });
        }
      } else {
        // If there's no selectedWorkoutPath, navigate to the default 'fitness' route
        navigation.navigate('fitness', {workoutData: formData});
      }
    } catch (error) {
      console.error('Error retrieving stored data:', error);
    }
  };

  // home page set code 

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
        
        
  //       if (selectedWorkoutPath) {
  //         // Now you can use the logic from handlePressOut function here
  //         if (selectedWorkoutPath === 'HomeTabNavigator') {
  //           console.log("inside im");
            
  //           let homeWorkoutData = null;
  //           let userData = null;
  
  //           // Retrieve homeWorkoutData from AsyncStorage
  //           const storedHomeWorkoutData = await AsyncStorage.getItem(
  //             'homeWorkoutData',
  //           );
  //           const storeduserDataHomeWorkout = await AsyncStorage.getItem(
  //             'userDataHomeWorkout',
  //           );
  //           if (storedHomeWorkoutData && storeduserDataHomeWorkout) {
             
  //             homeWorkoutData = JSON.parse(storedHomeWorkoutData);
  //             userData = JSON.parse(storeduserDataHomeWorkout);
  //             navigation.navigate(selectedWorkoutPath, {
  //               screen: 'HomeWorkoutMain',
  //               params: {workout: homeWorkoutData, workoutData: userData},
  //             });
  //             setIsLoading(false);
  //           }
  //         } else if (selectedWorkoutPath === 'GymTabNavigator') {
  //           let gymWorkoutData = null;
  //           let userData = null;
    
  //           // Retrieve homeWorkoutData from AsyncStorage
  //           const storedGymWorkoutData = await AsyncStorage.getItem(
  //             'gymWorkoutData',
  //           );
  //           const storeduserDataGymWorkout = await AsyncStorage.getItem(
  //             'userDataGymWorkout',
  //           );
  //           if (storedGymWorkoutData && storeduserDataGymWorkout) {
  //             gymWorkoutData = JSON.parse(storedGymWorkoutData);
  //             userData = JSON.parse(storeduserDataGymWorkout);
    
  //             navigation.navigate('GymTabNavigator', {
  //               screen: 'GymWorkoutMain',
  //               params: {data: gymWorkoutData, formDataCopy: userData},
  //             });
  //           }
  //         } else if (selectedWorkoutPath === 'ChallengeTabNavigator') {
  //           let challengeWorkoutData = null;
  //           let userData = null;
    
  //           // Retrieve homeWorkoutData from AsyncStorage
  //           const storedChallengeWorkoutData = await AsyncStorage.getItem(
  //             'challengeWorkoutData',
  //           );
  //           const storeduserDataChallengeWorkout = await AsyncStorage.getItem(
  //             'userDataChallengeWorkout',
  //           );
  //           if (storedChallengeWorkoutData && storeduserDataChallengeWorkout) {
  //             challengeWorkoutData = JSON.parse(storedChallengeWorkoutData);
  //             userData = JSON.parse(storeduserDataChallengeWorkout);
    
  //             // navigation.navigate('GymTabNavigator', {
  //             //   screen: 'GymWorkoutMain',
  //             //   params: {data: gymWorkoutData, formDataCopy:userData},
  //             // });
    
  //             navigation.navigate('ChallengeTabNavigator', {
  //               screen: 'ChallengeMain',
  //               params: {challenge: challengeWorkoutData},
  //             });
  //           }
  //         } else {
  //           // Default logic
  //           // navigation.navigate('fitness', {workoutData: formData});
  //           setIsLoading(false);
  //         }
  //       } else {
  //         setIsLoading(false);
  //         console.log('No value stored for this key');
  //       }
  //     } catch (error) {
  //       setIsLoading(false);
  //       console.error('Error retrieving stored data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);



  
  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  useEffect(() => {
    getDeviceToken();
    requestPermission();
  }, [customerId]);
  const getDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log(token, 'token12');

      if (token && customerId) {
        try {
          const response = await api.post('set_personal_datas', {
            device_token: token,
            customer_id: customerId,
          });
          console.log(response.data, 'set data');
        } catch (error) {
          console.error('Error making API request:', error);
          if (error.response) {
            // The request was made, but the server responded with a status code
            // outside the range of 2xx
            console.error('Server responded with:', error.response.data);
            console.error('Status code:', error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from the server');
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up the request:', error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error getting device token:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const {title, body} = remoteMessage.notification;
      const imageUrl = remoteMessage.notification.android.smallIcon;

      // Show toast notification
      Toast.show({
        onPress() {
          navigation.navigate('NotificationPage');
        },
        swipeable: true,
        props: imageUrl,

        type: 'success',
        position: 'top',
        text1: title || 'Default Title', // Provide a default title if not present
        text2: body || 'Default Body', // Provide a default body if not present
        visibilityTime: 4000, // Adjust visibility time as needed
        autoHide: true, // Auto-hide the toast after visibilityTime
        topOffset: 30, // Adjust the top offset as needed
        // Add an image to the toast if imageUrl is available
        // You may need to adjust the styling based on the library you are using
      });
    });

    return unsubscribe;
  }, []);

  const requestPermission = async () => {
    const authorized = await messaging().requestPermission();
    if (authorized) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  };

  const redirectTo = async () => {
    try {
      const [cachedDataJSON, authDataJSON] = await Promise.all([
        AsyncStorage.getItem('cachedData'),
        AsyncStorage.getItem('authData'),
      ]);
  
      const authData = JSON.parse(authDataJSON || '{}');
      const { token, formData } = authData;
  
      if (cachedDataJSON) {
        const cachedData = JSON.parse(cachedDataJSON);
        const { requiredCalorie, dietPlan } = cachedData;
  
        setIsLoading(false);
        if (requiredCalorie && formData) {
         
          return navigation.navigate('Menu', {
            data: requiredCalorie,
            formDataCopy: formData,
            dietPlan,
          });
        }
      }
  
      if (!token) {
        return navigateToLogin();
      }
  
      loginSuccess(formData.customer_id, formData, token);
      setAuthToken(token);
      setIsLoading(true);
  
      const [requiredCalorieResponse, dietListResponse] = await Promise.all([
        api.get(`get_daily_required_calories/${formData.customer_id}`),
        api.get(`get_recommended_diet/${formData.customer_id}`),
      ]);
  
      const requiredCalorie = requiredCalorieResponse.data.data;
      const dietPlan = dietListResponse.data.data.recommended_diet_list;
  
      if (requiredCalorieResponse.data.success) {
        await AsyncStorage.setItem('cachedData', JSON.stringify({ requiredCalorie, dietPlan }));
      }
  
      setIsLoading(false);
  
      if (requiredCalorieResponse.data.success && formData) {
        navigation.navigate('Menu', {
          data: requiredCalorie,
          formDataCopy: formData,
          dietPlan,
        });
      } else if (formData) {
        navigation.navigate('Details', { formData });
      } else {
        navigateToLogin();
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      navigateToLogin();
    }
  };
  
  const navigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'loginNew' }],
    });
  };
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Block>
            <Block style={styles.container1} gradient={gradients.success}>
           
              <Text
                bold
                //  font="Pacifico"
                style={{top: 40, padding: 16}}>
                Welcome {formData.first_name} ,
              </Text>
             

              <View style={styles.img}>
                <Image
                  source={require('../assets/images/fitter-bg.png')}
                  style={{width: '40%', height: '45%', top: 40}}
                />
              </View>
              <ExpoStatusBar style="auto" />
            </Block>

            <View style={styles.container}>
              <TouchableWithoutFeedback
                // onPress={() => navigation.navigate('Details')}
                activeOpacity={0.1}
                onPress={() => {
                  handleProducts(2);
                  redirectTo();
                }}
                // onPressOut={() => navigation.navigate('Details', {formData})}
              >
                <Block
                  style={styles.mainCardView}
                  flex={0}
                  marginTop={50}
                  //  radius={30}
                  gradient={gradients?.[tab === 2 ? 'success' : '#fffff']}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View flex={2}>
                      <Image
                        //  source={require('../../../assets/fruit2.png')}
                        source={assets.fruit2}
                        resizeMode="contain"
                      />
                      {/* <Lottie
                    width={64}
                    height={64}
                    marginBottom={sizes.sm}
                    source={require('../assets/json/diet1.json')}
                    progress={animationProgress.current}
                  /> */}
                    </View>
                    <View flex={4} style={{alignSelf: 'center'}}>
                      <Text
                        bold
                        primary
                        style={{
                          fontSize: 14,
                          color: 'black',
                        }}>
                        {'DIET PLANS'}
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
                  handlePressOut();
                }}
                // onPressOut={() =>
                //   navigation.navigate('fitness', {workoutData: formData})
                // }
              >
                <Block
                  style={styles.mainCardView}
                  flex={0}
                  //  radius={6}
                  gradient={gradients?.[tab === 3 ? 'success' : '#fffff']}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View flex={2}>
                      <Image
                        // source={require('../../../assets/fitness2.png')}
                        source={assets.fitness2}
                        resizeMode="contain"
                      />
                    </View>
                    <View flex={4} style={{alignSelf: 'center'}}>
                      <Text bold primary>
                        {'WORKOUT'}
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
                // onPressOut={() => navigation.navigate('NutritionFactsSearch')}
                onPress={() => {
                  navigation.navigate('NutritionFactsSearch');
                  handleProducts(4);
                  // handleLogout();
                }}>
                <Block
                  style={styles.mainCardView}
                  flex={0}
                  //  radius={6}
                  gradient={gradients?.[tab === 4 ? 'success' : '#fffff']}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View flex={2}>
                      <Image
                        //  source={require('../../../assets/book2.png')}
                        source={assets.book2}
                        resizeMode="contain"
                      />
                    </View>
                    <View flex={4} style={{alignContent: 'center'}}>
                      <Text
                        bold
                        primary
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontWeight: 'bold',
                        }}>
                        {'NUTRITION FACTS'}
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
              {/* <Text>{expoNotification}</Text> */}
             
            </View>
          </Block>
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontFamily: 'Pacifico',
    fontSize: 26,
  },
  container1: {
    flex: 1,
    // backgroundColor: "#22faa0",

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
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'skyblue',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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

    // justifyContent: 'center',

    paddingHorizontal: 10,
    backgroundColor: 'rgb(255,255,255)',
  },
  mainCardView: {
    height: 150,
    alignItems: 'center',
    //   justifyContent: "center",
    backgroundColor: 'rgb(255,255,255)',

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
    // gradient:"success"
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 0,
    // backgroundColor: "transparent",
    // borderColor: "green",
    // borderWidth: 1,
    // borderStyle: "solid",
    alignItems: 'center',
    justifyContent: 'center',
  },
});

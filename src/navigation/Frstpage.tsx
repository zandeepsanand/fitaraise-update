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
import {Animated, Easing, TouchableWithoutFeedback} from 'react-native';
import * as Notifications from 'expo-notifications';

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
  console.log(token);

  const handleLogout = () => {
    console.log('clicked');

    // Call the logout function to log the user out
    logout();
    navigation.navigate('FirstPageCountrySelect');
  };

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  useEffect(() => {
    registerForPushNotifications();

    // Add a listener for received notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      // Handle received notification here
      console.log('Received notification:', notification);
    });

    // Add a listener for notification responses
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle notification response here
      console.log('Notification response:', response);
    });

    // Clean up the listeners when the component unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  async function registerForPushNotifications() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
        const device_token = token;
        console.log('Expo push token:', token);

        // Store the token in AsyncStorage for later use
        await AsyncStorage.setItem('expoPushToken', device_token);

        // Uncomment and complete this part to send the token to your server
        // await api.post('set_personal_datas', { customerId, device_token });
      
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }
  AsyncStorage.getItem('expoPushToken').then(value => {
    console.log(value, "expo");
  });
  

  const redirectTo = async () => {
    try {
      console.log('clicked');

      const authDataJSON = await AsyncStorage.getItem('authData');
      console.log(authDataJSON, 'authdata first page');

      if (authDataJSON) {
        const authData = JSON.parse(authDataJSON);

        const authToken = authData.token;
        const customerId = authData.formData.customer_id;
        const formData = authData.formData;
        const token = authData.token;

        loginSuccess(customerId, formData, token);
        console.log(authToken, 'auth Data');
        if (authToken) {
          setAuthToken(authToken);
          setIsLoading(true);
          const requiredCalorieResponse = await api.get(
            `get_daily_required_calories/${formData.customer_id}`,
          );
          const diet_List = await api.get(
            `get_recommended_diet/${formData.customer_id}`,
          );

          const requiredCalorie = requiredCalorieResponse.data.data;

          const dietPlan = diet_List.data.data.recommended_diet_list;
          console.log(requiredCalorie, 'calorie required');
          console.log(authData.formData, 'for workout example');

          setIsLoading(false);

          if (
            requiredCalorieResponse.data.success === true &&
            authData.formData
          ) {
            //   navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Menu', params: { data: requiredCalorie, formDataCopy: authData.formData, dietPlan } }],
            // });
            navigation.navigate('Menu', {
              data: requiredCalorie,
              formDataCopy: authData.formData,
              dietPlan,
            });
          } else if (authData.formData) {
            navigation.navigate('Details', {formData: authData.formData});
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'loginNew'}],
            });
          }
          // Replace 2000 with the desired loading duration (in milliseconds)
        } else {
          // No authToken, navigate to 'loginNew'
          navigation.reset({
            index: 0,
            routes: [{name: 'loginNew'}],
          });
        }
      } else {
        // authData JSON doesn't exist, navigate to 'loginNew'
        navigation.reset({
          index: 0,
          routes: [{name: 'loginNew'}],
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Authentication Status Error:', error);
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'FirstPageCountrySelect'}],
      });
    }
  };

  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await api.get(`get_personal_datas/${customerId}`);
        // setExpoNotification(response.data.data.device_token);
        // const expo = response.data.data.device_token;
        const expoToken = await AsyncStorage.getItem('expoPushToken');

        // If the token is found in AsyncStorage, set it in your component's state
        if (expoToken) {
          setExpoNotification(expoToken);
        }
  
        // Start the animation after the API request is completed
        Animated.timing(animationProgress.current, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      } catch (error) {
        console.error('Error fetching data for expo:', error);
      }
    };

    fetchData();
  }, [customerId, animationProgress]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Block>
          <Block style={styles.container1} gradient={gradients.success}>
            <Text bold font="Pacifico" style={{top: 40, padding: 16}}>
              Welcome {formData.first_name}
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
              onPress={() => handleProducts(3)}
              onPressOut={() =>
                navigation.navigate('fitness', {workoutData: formData})
              }>
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
              // onPressOut={() => navigation.navigate('water')}
              onPress={() => {
                handleProducts(4);
                handleLogout();
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

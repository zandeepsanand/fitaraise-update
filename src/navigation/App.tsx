/* eslint-disable prettier/prettier */

import React, {useContext, useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Frstpage from './Frstpage';
import SecondPage from './SecondPage';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';
import {createStackNavigator} from '@react-navigation/stack';
import ThirdPage from './ThirdPage';
import FourthPage from './FourthPage';
import FifthPage from './FifthPage';
import LoginPage from './LoginPage';
import OtpPage from './OtpPage';
import WelcomePage from './WelcomePage';
import TypingScreen from './TypingScreen';
import * as SplashScreen from 'expo-splash-screen';
import NextButton from './NextButton';
import DemoPage from './DemoPage';
import AgeAndHeightPage from './AgeAndHeightPage';
import ToggleSwitchButton from './ToggleSwitchButton';
import GainWeight from './GainWeight';
import CirclePage from './CirclePage';
import AccordionPage from './AccordionPage';
import CardPage from './CardPage';
import DietPlanData from '../screens/DietPlanData';
import DietPlanDynamic from '../screens/DietPlanDynamic';
import MealContextProvider from '../hooks/useMeal';
import SixthPage from './SixthPage';
import LoginContext from '../hooks/LoginContext';
import DonutChart1 from './DonutChart';
import DietPlan from '../screens/DietPlan';
import FoodPage from '../screens/foodPage/FoodPage';
import LoginScreenNew from './LoginPageNew';
import CountrySelect from './CountrySelect';
import AnimationPage from './AnimationPage';
import WorkoutFirstPage from '../screens/workout/WorkoutFirstPage';
import MorningSnackSingle from '../screens/foodPage/MorningSnackSingle';
import LunchSingle from '../screens/foodPage/LunchSingle';
import EveningSingle from '../screens/foodPage/EveningSnackSingle';
import DinnerSingle from '../screens/foodPage/DinnerSingle';
import Meal1Single from '../screens/foodPage/Meal1Single';
import Meal2Single from '../screens/foodPage/Meal2Single';
import UnlockDietPlan from '../screens/foodPage/UnlockDietPlan';
import PreviousDietDetails from '../screens/foodPage/PreviousDietDetails';
import TabNavigator from './TabNavigator';
import GenderPage from '../screens/workout/home workout/Gender';
import HeightAndWeight from '../screens/workout/home workout/WeightAndHeight';
import DifficultyLevel from '../screens/workout/home workout/DifficultyLevel';
import HomeWorkoutMain from '../screens/workout/home workout/HomeWorkoutMain';
import HomeWorkoutAll from '../screens/workout/home workout/HomeWorkoutAll';
import HomeWorkoutSingle from '../screens/workout/home workout/HomeWorkoutSingle';
import Timer from '../screens/workout/home workout/Timer';
import TimerIntermediatePage from '../screens/workout/home workout/TimerIntermediatePage';
import CongratsPage from '../screens/workout/home workout/CongratsPage';
import AnimationPageWorkout from '../screens/workout/home workout/AnimationPageWorkout';
import HomeWorkoutStart from '../screens/workout/home workout/HomeWorkoutStart';
import HomeTabNavigator from '../screens/workout/home workout/HomeTabNavigator';
import GymGenderPage from '../screens/workout/gym workout/GymGenderPage';
import GymWeightAndHeight from '../screens/workout/gym workout/GymWeightAndHeight';
import GymDifficultyLevel from '../screens/workout/gym workout/GymDifficultyLevel';
import GymAnimationPageWorkout from '../screens/workout/gym workout/GymAnimationPageWorkout';
import GymTabNavigator from '../screens/workout/gym workout/GymTabNavigator';
import {Home} from '../screens';
import GymWorkoutAll from '../screens/workout/gym workout/GymWorkoutAll';
import GymWorkoutSingle from '../screens/workout/gym workout/GymWorkoutSingle';
import GymWorkoutStart from '../screens/workout/gym workout/GymWorkoutStart';
import GymCongratsPage from '../screens/workout/gym workout/GymCongratsPage';
import ChallengeGenderPage from '../screens/workout/workout challenges/ChallengeGenderPage';
import ChallengeWeightAndHeight from '../screens/workout/workout challenges/ChallengeWeightAndHeight';
import ChallengeDifficultyLevel from '../screens/workout/workout challenges/ChallengeDifficultyLevel';
import ChallengeMonth from '../screens/workout/workout challenges/ChallengeMonth';
import ChallengeMain from '../screens/workout/workout challenges/ChallengeMain';
import ChallengeDayAll from '../screens/workout/workout challenges/ChallengeDayAll';
import ChallengeWorkoutStart from '../screens/workout/workout challenges/ChallengeWorkoutStart';
import LoginScreenNewRegister from './LoginPageNewRegister';
import LoadingScreen from './LoadingScreen';
import PhoneNumber from '../screens/phoneNumber/PhoneNumber';
import OtpPageNew from './OtpPageNew';
import Menu from './Menu';
import MyDrawerNavigator from './Drawer';
import AlertCustom from '../screens/alert/AlertCustom';
import DemoAlert from '../screens/alert/DemoAlert';
import Account from '../screens/account/Account';
import HomeWorkoutLoadingScreen from '../screens/workout/home workout/HomeWorkoutLoadingScreen';
import NameLastName from './NameLastName';
import { AuthProvider } from '../hooks/AuthData';
import GymWorkoutLoadingScreen from '../screens/workout/gym workout/GymWorkoutLoadingScreen';
import ChallengeCongratsPage from '../screens/workout/workout challenges/ChallengeCongratsPage';
import FirstPageCountrySelect from './FirstPageCountrySelect';
import ChallengeTabNavigator from '../screens/workout/workout challenges/ChallengeTabNavigator';
import ChallengeMenu from '../screens/workout/workout challenges/ChallengeMenu';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()
  .then((result) => {
    // Do any asynchronous tasks you need to do before hiding the splash screen.
    // For example, you can load data or perform any initialization here.
  })
  .catch(console.warn); // Handle any errors that occur during the asynchronous tasks.

// When you're ready to hide the splash screen (e.g., after your app has loaded),
// you can call hideAsync():
SplashScreen.hideAsync()
  .then(() => {
    // The splash screen is now hidden, and your app can continue.
  })
  .catch(console.warn); // Handle any errors that occur while hiding the splash screen.

export default () => {
  const {isDark, theme, setTheme} = useData();
  const Stack = createStackNavigator();
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
    Pacifico: theme.assets.Pacifico,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <AuthProvider>
    <MealContextProvider>
      <TranslationProvider>
        <ThemeProvider theme={theme} setTheme={setTheme}>
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator initialRouteName="Loading">
            <Stack.Screen name="ChallengeMenu" component={ChallengeMenu} options={{ headerShown: false }} />
            <Stack.Screen
                name="ChallengeTabNavigator"
                component={ChallengeTabNavigator}
                options={{headerShown: false}}
              />
            <Stack.Screen
                name="FirstPageCountrySelect"
                component={FirstPageCountrySelect}
                options={{headerShown: false}}
              />
            <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
            <Stack.Screen
                name="NameLastName"
                component={NameLastName}
                options={{headerShown: false}}
              />
            
            <Stack.Screen
                name="Account"
                component={Account}
                options={{headerShown: false}}
              />
                <Stack.Screen
                name="HomeWorkoutLoadingScreen"
                component={HomeWorkoutLoadingScreen}
                options={{headerShown: false}}
              />
               <Stack.Screen
                name="GymWorkoutLoadingScreen"
                component={GymWorkoutLoadingScreen}
                options={{headerShown: false}}
              />
            <Stack.Screen
                name="Alert"
                component={AlertCustom}
                options={{headerShown: false}}
              />
                  <Stack.Screen
                name="DemoAlert"
                component={DemoAlert}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Loading"
                component={LoadingScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="loginNew"
                component={LoginScreenNew}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="fitness"
                component={WorkoutFirstPage}
                options={{
                  title: 'Workouts', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: true, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="PhoneNumber"
                component={PhoneNumber}
                options={{
                  title: 'Number', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: true, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="OtpPage"
                component={OtpPageNew}
                options={{
                  title: 'Signup', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: true, // Show the header (you can omit this line if not needed)
                }}
              />

              <Stack.Screen
                name="country"
                component={CountrySelect}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="donutchart"
                component={DonutChart1}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="foodPage"
                component={FoodPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Frstpage"
                component={Frstpage}
                options={{headerShown: false}}
              />

              {/* <Stack.Screen
        name="searchfoodData"
        component={DietPlanData}
        options={{title: 'Nutriotion' , headerTitleAlign:'left'}}
      /> */}
              <Stack.Screen
                name="card"
                component={CardPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="AnimationPage"
                component={AnimationPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="gain"
                component={SixthPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="accordion"
                component={AccordionPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Progress"
                component={CirclePage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Switch"
                component={ToggleSwitchButton}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Ageandheight"
                component={AgeAndHeightPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Next"
                component={NextButton}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Demo1"
                component={DemoPage}
                options={{title: 'I am a'}}
              />
              <Stack.Screen
                name="TypingScreen"
                component={TypingScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Welcome"
                component={WelcomePage}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="Details"
                component={SecondPage}
                options={{title: 'I want to'}}
              />
              <Stack.Screen
                name="Veg"
                component={ThirdPage}
                options={{title: "I'am a"}}
              />
              <Stack.Screen
                name="dietcalculation"
                component={FourthPage}
                options={{title: 'Calculate Daily Required Calories'}}
              />
              <Stack.Screen
                name="goal"
                component={FifthPage}
                options={{title: 'Select your goal'}}
              />
              <Stack.Screen
                name="gainweight"
                component={GainWeight}
                options={{title: 'Select your goal'}}
              />

              {/* <Stack.Screen
              name="chart"
              component={SeventhPage}
              options={{title: 'Chart'}}
            /> */}
              {/* <Stack.Screen
                name="pie"
                component={DietPlan}
                options={{
                  headerShown: false,
                }}
              /> */}
              <Stack.Screen
                name="login"
                component={LoginPage}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="OtpPageold"
                component={OtpPage}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="searchfood"
                component={DietPlanDynamic}
                options={{title: 'Search food', headerBackTitle: ''}}
              />
              <Stack.Screen
                name="searchfoodData"
                component={DietPlanData}
                options={{title: 'Nutrition', headerTitleAlign: 'left'}}
              />
              <Stack.Screen
                name="morngSnack"
                component={MorningSnackSingle}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="lunch"
                component={LunchSingle}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="evening"
                component={EveningSingle}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="dinner"
                component={DinnerSingle}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="meal1"
                component={Meal1Single}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="meal2"
                component={Meal2Single}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="unlockDiet"
                component={UnlockDietPlan}
                options={{title: 'Diet Plan', headerTitleAlign: 'center'}}
              />
              <Stack.Screen
                name="previous"
                component={PreviousDietDetails}
                options={{title: 'Diet Details', headerTitleAlign: 'center'}}
              />
              <Stack.Screen
                name="tabNavigator"
                component={TabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Gender"
                component={GenderPage}
                options={{
                  title: 'Gender', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: true, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="HeightAndWeight"
                component={HeightAndWeight}
                options={{
                  title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: true, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="DifficultyLevel"
                component={DifficultyLevel}
                options={{
                  title: 'Difficulty Level', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: true, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="HomeWorkoutMain"
                component={HomeWorkoutMain}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="HomeWorkoutAll"
                component={HomeWorkoutAll}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="HomeWorkoutSingle"
                component={HomeWorkoutSingle}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="Timer"
                component={Timer}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="TimerIntermediatePage"
                component={TimerIntermediatePage}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="CongratsPage"
                component={CongratsPage}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="AnimationPageWorkout"
                component={AnimationPageWorkout}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="HomeWorkoutStart"
                component={HomeWorkoutStart}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="HomeTabNavigator"
                component={HomeTabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="GymGenderPage"
                component={GymGenderPage}
                options={{
                  title: 'Gender',
                  headerBackTitle: 'Back',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="GymHeightAndWeight"
                component={GymWeightAndHeight}
                options={{
                  title: 'Height And Weight',
                  headerBackTitle: 'Back',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="GymDifficultyLevel"
                component={GymDifficultyLevel}
                options={{
                  title: 'Level',
                  headerBackTitle: 'Back',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="GymAnimationPageWorkout"
                component={GymAnimationPageWorkout}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="GymTabNavigator"
                component={GymTabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="home1"
                component={Home}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="GymWorkoutAll"
                component={GymWorkoutAll}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="GymWorkoutSingle"
                component={GymWorkoutSingle}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="GymWorkoutStart"
                component={GymWorkoutStart}
                options={{
                  // title: 'Height And Weight', // Change the header title
                  headerBackTitle: 'Back', // Change the back button title
                  headerShown: false, // Show the header (you can omit this line if not needed)
                }}
              />
              <Stack.Screen
                name="GymCongratsPage"
                component={GymCongratsPage}
                options={{
                  // title: 'Height And Weight',
                  headerBackTitle: 'Back',
                  headerShown: false,
                }}
              />
                <Stack.Screen
                name="ChallengeCongratsPage"
                component={ChallengeCongratsPage}
                options={{
                  // title: 'Height And Weight',
                  headerBackTitle: 'Back',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ChallengeGenderPage"
                component={ChallengeGenderPage}
                options={{
                  title: 'Gender',
                  headerBackTitle: 'Back',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="ChallengeWeightAndHeight"
                component={ChallengeWeightAndHeight}
                options={{
                  title: 'Height And Weight',
                  headerBackTitle: 'Back',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="ChallengeDifficultyLevel"
                component={ChallengeDifficultyLevel}
                options={{
                  title: 'Difficulty Level',
                  headerBackTitle: 'Back',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="ChallengeMonth"
                component={ChallengeMonth}
                options={{
                  title: 'Workout Challenge',
                  headerBackTitle: 'Back',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="ChallengeMain"
                component={ChallengeMain}
                options={{
                  title: 'Workout Challenge',
                  headerBackTitle: 'Back',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ChallengeDayAll"
                component={ChallengeDayAll}
                options={{
                  title: 'Workout Challenge',
                  headerBackTitle: 'Back',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ChallengeWorkoutStart"
                component={ChallengeWorkoutStart}
                options={{
                  title: 'Workout Challenge',
                  headerBackTitle: 'Back',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LoginScreenNewRegister"
                component={LoginScreenNewRegister}
                options={{
                  title: 'Workout Challenge',
                  headerBackTitle: 'Back',
                  headerShown: false,
                }}
              />
            </Stack.Navigator>

            {/* <Menu /> */}
            {/* <Frstpage /> */}
          </NavigationContainer>
        </ThemeProvider>
      </TranslationProvider>
    </MealContextProvider>
    </AuthProvider>
  );
};

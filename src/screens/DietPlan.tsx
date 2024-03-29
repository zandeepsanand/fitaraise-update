/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {DataTable,Card} from 'react-native-paper';
import {ProgressBarAndroid} from 'react-native-elements';
import {BASE_URL} from '@env';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Text} from '../components/';
import {Animated, Easing, View} from 'react-native';
import Lottie from 'lottie-react-native';
import {StyleSheet, Platform, TouchableOpacity} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import ScrollCalender from './ScrollCalender';
import * as Progress from 'react-native-progress';
import {MealContext} from '../hooks/useMeal';

import PreviousDietDetails from './foodPage/PreviousDietDetails';
const isAndroid = Platform.OS === 'android';
import {useRoute} from '@react-navigation/native';
import api from '../../api';
import {ActivityIndicator} from 'react-native';
import LoginContext from '../hooks/LoginContext';
import {TouchableWithoutFeedback} from 'react-native';
import Loader from './alert/loader/Loader';
import Calendar from './calendar/Calendar';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { colors } from '../../app/res/colors';
// import AnimatableProgressBar from 'animateprogress';

const VerticalProgressBar = ({progress}) => {
  const fillHeight = `${(1 - progress) * 100}%`;

  return (
    <View style={styles.progressBar}>
      {/* Lottie animation for filling the progress bar */}
      <Lottie
        source={require('../assets/json/water2.json')} // Replace with the path to your fill animation JSON file
        autoPlay={true}
        loop={false}
        style={{
          position: 'absolute',
          bottom: 0,
          height: fillHeight,
          width: '100%',
        }}
      />
      {/* <View style={[styles.progressBarFill, { height: fillHeight }]} /> */}
    </View>
  );
};

const DietPlan = ({navigation, text, maxLines = 3}) => {
  // const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date().toISOString().slice(0, 10);
  const isFocused = useIsFocused();
  const animationProgress = useRef(new Animated.Value(0));
  
  const route = useRoute();
  const {
    breakfastItems,
    lunchItems,
    eveningSnackItems,
    dinnerItems,
    deleteItem,
    morningSnackItems,
    mealItems1,
    mealItems2,
    isLoading,
    addWater,
    water,
  } = useContext(MealContext);

  console.log('====================================');
  console.log(breakfastItems, 'breakkk');
  console.log('====================================');
  const {customerId} = useContext(LoginContext);
  const [isLoadingScroll, setIsLoadingScroll] = useState(true);
  const [isDietPlanUnlocked, setDietPlanUnlocked] = useState(false);
  console.log('====================================');
  console.log(isDietPlanUnlocked, 'check diet');
  console.log('===================================='); // Initially set to true
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [apiData, setApiData] = useState(null);
  const handleUnlockDietPlan = async () => {
    // Check if the diet plan is unlocked in AsyncStorage
    const unlocked = await AsyncStorage.getItem('isDietPlanUnlocked');
    console.log('====================================');
    console.log(unlocked, 'unlocked');
    console.log('====================================');
    if (!unlocked) {
      // Perform actions to unlock the diet plan, e.g., make an API call
      // ...

      // Update state to indicate that the diet plan is now unlocked
      setDietPlanUnlocked(true);

      // Store the unlocked status in AsyncStorage to persist it
      await AsyncStorage.setItem('isDietPlanUnlocked', 'true');
    }

    // Continue with navigation
    if (dietPlan) {
      navigation.navigate('unlockDiet', {
        dietPlan,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Check if the diet plan is unlocked in AsyncStorage
      const unlocked = AsyncStorage.getItem('isDietPlanUnlocked');

      if (unlocked) {
        // Update state to permanently set it to DIET PLAN
        setDietPlanUnlocked(true);
      }
    }, []),
  );
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoadingScroll(false);
    }, 2500); // Replace 2000 with the desired loading duration (in milliseconds)

    // To clear the timeout when the component unmounts
    return () => clearTimeout(loadingTimeout);
  }, []);

  const {authenticated} = useContext(LoginContext);

  const shouldRenderDietPlan = authenticated && isLoading;

  const {data, dietPlan, formDataCopy} = route.params;

  if (water) {
    console.log('====================================');
    console.log(water, 'water data');
    console.log('====================================');
  }
  console.log(water, 'water track new 1');
  const waterTracker = water;
  console.log(waterTracker, 'water track new');

  console.log(data, 'check 2');

  const [expandedItems, setExpandedItems] = useState([]); // To keep track of expanded items
  const [waterAmount, setWaterAmount] = React.useState(0);

  const waterProgress =
    waterTracker &&
    waterTracker.todays_consumed_water_count_ml &&
    waterTracker.normal_water_count_ml
      ? waterTracker.todays_consumed_water_count_ml /
        waterTracker.normal_water_count_ml
      : 0;

  console.log(waterProgress, 'progress water');

  const increaseWater = () => {
    const plus = 'plus';

    addWater(plus);
  };

  const decreaseWater = () => {
    const plus = 'minus';

    addWater(plus);
  };
  const handleAddFood = () => {};
  // Function to toggle the expanded state of an item
  const toggleItemExpansion = (index) => {
    const updatedExpandedItems = [...expandedItems];
    if (updatedExpandedItems.includes(index)) {
      updatedExpandedItems.splice(updatedExpandedItems.indexOf(index), 1);
    } else {
      updatedExpandedItems.push(index);
    }
    setExpandedItems(updatedExpandedItems);
  };

  // console.log(breakfastItems, 'breakfast from device distribution');

  if (!breakfastItems || !lunchItems || !eveningSnackItems) {
    // Render a loading indicator while data is being fetched
    return <ActivityIndicator size="large" color="blue" />;
  }

  // Calculate total protein, carbs, fat, and kcal for breakfast items
  const calculateTotalCalories = (items) => {
    return items.reduce((total, item) => total + item.calories, 0);
  };

  const sum = breakfastItems.reduce((accumulator, currentValue) => {
    // Remove formatting characters (e.g., commas) before parsing
    const value = currentValue.details.totalCalorie.replace(/,/g, '');
    return accumulator + parseFloat(value);
  }, 0);

  console.log(sum, 'total sum');

  const totalBreakfastCalorie = breakfastItems.reduce(
    (accumulator, currentValue) => {
      // Check if currentValue.details.totalCalorie is a non-empty string
      if (
        currentValue.details.totalCalorie &&
        typeof currentValue.details.totalCalorie === 'string'
      ) {
        // Remove formatting characters (e.g., commas) before parsing
        const value = currentValue.details.totalCalorie.replace(/,/g, '');

        // Check if the parsed value is a valid number
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          return accumulator + parsedValue;
        }
      }

      // If currentValue.details.totalCalorie is not a valid string or the parsing fails, return accumulator
      return accumulator;
    },
    0,
  );
  // const totalBreakfastProtein = breakfastItems.reduce(
  //   (acc, item) => {
  //     const value = item.details.totalProtein;
  //    return acc + parseFloat(value);
  //   },
  //   0,
  // );
  const totalBreakfastProtein = breakfastItems.reduce(
    (accumulator, currentValue) => {
      const value = currentValue.details.totalProtein;

      return accumulator + parseFloat(value);
    },
    0,
  );

  const totalBreakfastCarb = breakfastItems.reduce((acc, item) => {
    const value = item.details.totalCarb;
    return acc + parseFloat(value);
  }, 0);
  const totalBreakfastFat = breakfastItems.reduce((acc, item) => {
    const value = item.details.totalFat;
    return acc + parseFloat(value);
  }, 0);
  // const totalBreakfastCalories = totalBreakfastCalorie.toFixed(2);
  // console.log("total calorie for breakfast items: ", totalBreakfastCalories);

  const totalLunchCalorie = lunchItems.reduce((acc, item) => {
    const value = item.details.totalCalorie.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  // const totalLunchCalories = totalLunchCalorie.toFixed(2);
  const totalLunchProtein = lunchItems.reduce((acc, item) => {
    const value = item.details.totalProtein.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  const totalLunchCarb = lunchItems.reduce((acc, item) => {
    const value = item.details.totalCarb.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalLunchFat = lunchItems.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  const totalDinnerCalorie = dinnerItems.reduce((acc, item) => {
    const value = item.details.totalCalorie.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalDinnerProtein = dinnerItems.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  const totalDinnerCarb = dinnerItems.reduce((acc, item) => {
    const value = item.details.totalCarb.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalDinnerFat = dinnerItems.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  // const totalDinnerCalories = totalDinnerCalorie.toFixed(2);

  const totalMorningSnackCalorie = morningSnackItems.reduce((acc, item) => {
    const value = item.details.totalCalorie.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalmorningSnackItemsProtein = morningSnackItems.reduce(
    (acc, item) => {
      const value = item.details.totalFat.replace(/,/g, '');
      return acc + parseFloat(value);
    },
    0,
  );

  const totalmorningSnackItemsCarb = morningSnackItems.reduce((acc, item) => {
    const value = item.details.totalCarb.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalmorningSnackItemsFat = morningSnackItems.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  // const totalMorningSnackCalories = totalMorningSnackCalorie.toFixed(2);

  const totalEveningSnackCalorie = eveningSnackItems.reduce((acc, item) => {
    const value = item.details.totalCalorie.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totaleveningSnackItemsProtein = eveningSnackItems.reduce(
    (acc, item) => {
      const value = item.details.totalFat.replace(/,/g, '');
      return acc + parseFloat(value);
    },
    0,
  );

  const totaleveningSnackItemsCarb = eveningSnackItems.reduce((acc, item) => {
    const value = item.details.totalCarb.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totaleveningSnackItemsFat = eveningSnackItems.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  const totalMeal1Calorie = mealItems1.reduce((acc, item) => {
    const value = item.details.totalCalorie.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalMeal1Protein = mealItems1.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  const totalMeal1Carb = mealItems1.reduce((acc, item) => {
    const value = item.details.totalCarb.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalMeal1Fat = mealItems1.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  const totalMeal2Calorie = mealItems2.reduce((acc, item) => {
    const value = item.details.totalCalorie.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalMeal2Protein = mealItems2.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  const totalMeal2Carb = mealItems2.reduce((acc, item) => {
    const value = item.details.totalCarb.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);
  const totalMeal2Fat = mealItems2.reduce((acc, item) => {
    const value = item.details.totalFat.replace(/,/g, '');
    return acc + parseFloat(value);
  }, 0);

  // const totalEveningSnackCalories = totalEveningSnackCalorie.toFixed(2);

  // calculate total calories for the entire day
  const totalCaloriesOfAllFoods =
    totalBreakfastCalorie +
    totalLunchCalorie +
    totalDinnerCalorie +
    totalMorningSnackCalorie +
    totalEveningSnackCalorie +
    totalMeal1Calorie +
    totalMeal2Calorie;
  console.log(totalCaloriesOfAllFoods, 'total calorie');
  const totalCaloriesRounded = totalCaloriesOfAllFoods.toFixed(0);
  console.log(totalCaloriesRounded, 'total calorie');

  const ProgressCalorie = totalCaloriesOfAllFoods;

  const ProgressCalories = ProgressCalorie.toFixed(0);
  // console.log(ProgressCalories, 'total Calories');

  const totalProteinfAllFoods =
    totalBreakfastProtein +
    totalLunchProtein +
    totalDinnerProtein +
    totalmorningSnackItemsProtein +
    totaleveningSnackItemsProtein +
    totalMeal1Protein +
    totalMeal2Protein;
    console.log('====================================');
    console.log(totalProteinfAllFoods, "total protein");
    console.log('====================================');
  const ProgressProtein = totalProteinfAllFoods;
  const ProgressProteins = ProgressProtein.toFixed(0);
  const RoundedProtienTotal= totalProteinfAllFoods.toFixed(0);
  // console.log(ProgressProteins, 'total Protein');

  const totalFatfAllFoods =
    totalBreakfastFat +
    totalLunchFat +
    totalDinnerFat +
    totalmorningSnackItemsFat +
    totaleveningSnackItemsFat +
    totalMeal1Fat +
    totalMeal2Fat;
  const ProgressFat = totalFatfAllFoods;
  const ProgressFats = ProgressFat.toFixed(0);
  const RoundedFatTotal= totalFatfAllFoods.toFixed(0);
  // console.log(ProgressFats, 'total fat');

  const totalCarbfAllFoods =
    totalBreakfastCarb +
    totalLunchCarb +
    totalDinnerCarb +
    totalmorningSnackItemsCarb +
    totaleveningSnackItemsCarb +
    totalMeal1Carb +
    totalMeal2Carb;
  const ProgressCarb = totalCarbfAllFoods;
  const ProgressCarbs = ProgressCarb.toFixed(0);
  const RoundedCarbTotal= totalCarbfAllFoods.toFixed(0);
  // console.log(ProgressCarbs, 'total Carbs');
  console.log('====================================');
  console.log(data.calories);
  console.log('====================================');

  const initialValueWithoutDecimals = Math.floor(
    data.calories - totalCaloriesOfAllFoods >= 1
      ? data.calories - totalCaloriesOfAllFoods
      : data.calories,
  );

  const handleDelete = (itemIndex: number, mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        const newBreakfastItems = [...breakfastItems];
        newBreakfastItems.splice(itemIndex, 1);
        deleteItem(newBreakfastItems, mealType);

        break;
      case 'morningSnackItems':
        const newMorningSnackItems = [...morningSnackItems];
        newMorningSnackItems.splice(itemIndex, 1);
        deleteItem(newMorningSnackItems, mealType);
        break;
      case 'lunch':
        // console.log('lunchhhh');

        const newLunchItems = [...lunchItems];
        newLunchItems.splice(itemIndex, 1);
        deleteItem(newLunchItems, mealType);
        break;
      case 'evening':
        // console.log('lunchhhh');

        const neweveningItems = [...eveningSnackItems];
        neweveningItems.splice(itemIndex, 1);
        deleteItem(neweveningItems, mealType);
        break;
      case 'dinner':
        const newDinnerItems = [...dinnerItems];
        newDinnerItems.splice(itemIndex, 1);
        deleteItem(newDinnerItems, mealType);
        break;
      case 'meal1':
        const newMealItem1 = [...mealItems1];
        newMealItem1.splice(itemIndex, 1);
        deleteItem(newMealItem1, mealType);
        break;
      case 'meal2':
        const newMealItem2 = [...mealItems2];
        newMealItem2.splice(itemIndex, 1);
        deleteItem(newMealItem2, mealType);
        break;
      default:
        break;
    }
  };
  const handleDeleteApi = (item) => {
    console.log(item, 'deleteditem');

    api
      .get(`delete_diet_list/${item.details.id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch(function (error) {
        console.error('Error deleteing using api:', error);
      });
  };

  // const totalCalories = 1579 ;
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [percentage, setPercentage] = React.useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const handlePrevStep = useCallback(() => {
    setCurrentStep((prevStep) => prevStep - 1);
  }, []);

  const handleNextStep = useCallback(() => {
    setCurrentStep((prevStep) => prevStep + 1);
  }, []);
  const {user} = useData();
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  const progressValueOfProtein = ProgressProteins / data.protien_g;
  const progressValueOfCarb = ProgressCarbs / data.carb_g;
  const progressValueOfFat = ProgressFat / data.fat_g;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  console.log(currentDate, 'date check');

  // State to hold the selected date and response data

  console.log(selectedDate, 'selected date');

  // Callback function to handle date change in ScrollCalendar
  //  const handleScrollCalendarDateChange = (newSelectedDate, newResponseData) => {
  //   setSelectedDate(newSelectedDate);

  // };
  // console.log(selectedDate, 'selected date');

  // console.log(apiData, 'the data of diet');

  const handleScrollCalendarDateChange = async (selectedDate) => {
    // console.log(selectedDate, 'hai');
    setSelectedDate(selectedDate);

    setApiData(null); // Clear previous API data when selecting a new date

    if (selectedDate === currentDate) {
      // If selected date is equal to current date, show breakfast items
      setApiData(null);
    } else {
      // Fetch data from API using Axios and update apiData state
      try {
        const response = await api.get(
          `get_diet_list_wrt_date/${formDataCopy.customer_id}/${selectedDate}`,
        );
        const responseData = response.data.data;
        console.log(responseData, 'diet data for selected date');
        setApiData(responseData);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    console.log('====================================');
    console.log(data, 'checking over');
    console.log('====================================');
  }, [data]);

  const increaseProgress = () => {
    // Increase animation progress by 20%
    animationProgress.current = Math.min(animationProgress.current + 0.2, 1);
  };

  const decreaseProgress = () => {
    // Decrease animation progress by 20%
    animationProgress.current = Math.max(animationProgress.current - 0.2, 0);
  };
  return (
    <Block paddingTop={10}>
      {shouldRenderDietPlan ? (
        <Block style={styles.loadingContainer}>
          <Lottie
            style={styles.backgroundAnimation}
            source={require('../assets/json/foodloader.json')}
            autoPlay={true}
          />
        </Block>
      ) : (
        <>
          {/* search input */}
          <Block color={colors.card} flex={0}>
            {/* <Input icon  placeholder={t('common.search')} /> */}
            {/* <CircularProgress value={80} /> */}
          </Block>
          <Block safe>
            <Block
              scroll
              paddingHorizontal={sizes.s}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: sizes.padding}}>
              <Block flex={0}>
                <Image
                  background
                  resizeMode="cover"
                  padding={sizes.sm}
                  paddingBottom={sizes.l}
                  radius={sizes.cardRadius}
                  source={assets.green}
                  blurRadius={10}>
                  {/* <Button
                row
                flex={0}
                justify="flex-start"
                onPress={() => navigation.goBack()}>
                <Image
                  radius={0}
                  width={10}
                  height={18}
                  color={colors.white}
                  source={assets.arrow}
                  transform={[{rotate: '180deg'}]}
                />
                <Text p white marginLeft={sizes.s}>
               
                </Text>
              </Button> */}
                  <Block flex={0} align="center">
                    <CircularProgress
                      // value={(initialValueWithoutDecimals - totalCaloriesOfAllFoods) >= 0 ? (initialValueWithoutDecimals - totalCaloriesOfAllFoods) : totalCaloriesOfAllFoods}
                      // value={
                      //   data.calories - totalCaloriesOfAllFoods >= data.calories
                      //     ? totalCaloriesOfAllFoods
                      //     : data.calories - totalCaloriesOfAllFoods
                      // }
                      value={totalCaloriesOfAllFoods.toFixed(2)}
                      showProgressValue={false}
                      initialValue={initialValueWithoutDecimals}
                      radius={100}
                      duration={2000}
                      activeStrokeWidth={12}
                      progressValueColor={'#ecf0f1'}
                      maxValue={data.calories}
                      circleBackgroundColor={'#353353'}
                      title={
                        totalCaloriesRounded >= data.calories
                          ? `${-(data.calories - totalCaloriesOfAllFoods)}`
                          : `${data.calories - totalCaloriesRounded}`
                      }
                      titleColor={'white'}
                      titleStyle={{fontWeight: 'bold', fontSize: 22}}
                      subtitle={
                        totalCaloriesOfAllFoods >= data.calories
                          ? `KCAL OVER`
                          : `KCAL LEFT 🔥`
                      }
                      subtitleStyle={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        paddingTop: 10,
                      }}

                      // onAnimationComplete={()=>{alert('hai')}}
                      // disableAnimation={totalCaloriesOfAllFoods >= data.calories}
                    />

                    <Block row paddingHorizontal={10}  marginTop={-10}>
                      <Button
                        white
                        outlined
                        shadow={false}
                        radius={sizes.m}
                        margin={sizes.m}
                        //   onPress={() => {
                        //     alert(`Follow ${user?.name}`);
                        //   }}
                      >
                        <Block
                          justify="center"
                          radius={sizes.m}
                          paddingHorizontal={sizes.m}
                          paddingVertical={10}
                          align='center'
                          color="rgba(255,255,255,0.2)">
                          <Text
                            white
                            bold
                            transform="uppercase"
                            center
                            paddingBottom={5}>
                            Protein
                          </Text>

                          <Progress.Bar
                            progress={progressValueOfProtein}
                            width={50}
                            color="white"
                          />
                          <Text
                            white
                            bold
                            // transform="uppercase"
                            center
                            paddingTop={5}>
                            {RoundedProtienTotal}/{data.protien_g}g
                          </Text>
                        </Block>
                      </Button>
                      <Button
                        white
                        outlined
                        shadow={false}
                        radius={sizes.m}
                        marginBottom={sizes.m}
                        marginTop={sizes.m}
                        //   onPress={() => {
                        //     alert(`Follow ${user?.name}`);
                        //   }}
                      >
                        <Block
                          justify="center"
                          radius={sizes.m}
                          paddingHorizontal={sizes.m}
                          paddingVertical={10}
                          align='center'
                          color="rgba(255,255,255,0.2)">
                          <Text
                            white
                            bold
                            transform="uppercase"
                            center
                            paddingBottom={5}>
                            Carbs
                          </Text>

                          <Progress.Bar
                            progress={progressValueOfCarb}
                            width={50}
                            color="white"
                          />
                          <Text
                            white
                            bold
                            // transform="uppercase"
                            center
                            paddingTop={5}>
                            {RoundedCarbTotal}/{data.carb_g}g
                          </Text>
                        </Block>
                      </Button>
                      <Button
                        white
                        outlined
                        shadow={false}
                        radius={sizes.m}
                        margin={sizes.m}
                        //   onPress={() => {
                        //     alert(`Follow ${user?.name}`);
                        //   }}
                      >
                        <Block
                          justify="center"
                          radius={sizes.m}
                          paddingHorizontal={sizes.m}
                          paddingVertical={10}
                          align='center'
                          color="rgba(255,255,255,0.2)">
                          <Text
                            white
                            bold
                            transform="uppercase"
                            center
                            paddingBottom={5}>
                            fat
                          </Text>

                          <Progress.Bar
                            progress={progressValueOfFat}
                            width={50}
                            color="white"
                          />
                          <Text
                            white
                            bold
                            // transform="uppercase"
                            center
                            paddingTop={5}>
                            {RoundedFatTotal}/{data.fat_g}g
                          </Text>
                        </Block>
                      </Button>
                    </Block>
                  </Block>
                </Image>

                {/* profile: stats */}
                <Block
                  flex={0}
                  radius={sizes.sm}
                  shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                  marginTop={-sizes.l}
                  marginHorizontal="8%"
                  color="rgba(255,255,255,0.2)">
                  <TouchableWithoutFeedback
                    onPress={handleUnlockDietPlan}
                    disabled={!dietPlan}>
                    <Block padding={sizes.padding} card>
                      <Block row>
                        <Block>
                          <Text bold center primary>
                            {isDietPlanUnlocked
                              ? 'DIET PLAN'
                              : 'UNLOCK YOUR FREE DIET PLAN'}
                          </Text>
                        </Block>
                      </Block>
                    </Block>
                  </TouchableWithoutFeedback>
                </Block>

                {/* profile: about me */}

                <Block card padding={0} marginTop={sizes.sm}>
                  <Block
                    // row
                    paddingTop={10}
                    blur
                    flex={1}
                    intensity={100}
                    radius={sizes.sm}
                    overflow="hidden"
                    tint={colors.blurTint}
                    justify="space-evenly"
                    // paddingVertical={sizes.sm}
                    renderToHardwareTextureAndroid
                    // height={800}
                  >
                    {/* <Lottie
                             source={require('../assets/json/loader.json')} // Replace with the path to your fill animation JSON file
                             autoPlay={true}
                             loop={true}
                             style={{alignSelf:'center',width:300,height:150}}
                            >

                            </Lottie> 
                      */}

                    {/* <ScrollCalender
                       formDataCopy={formDataCopy}
                      onDateChange={handleScrollCalendarDateChange}
                      />  */}

                    <Calendar
                      onSelectDate={handleScrollCalendarDateChange}
                      selected={selectedDate}
                    />
                  </Block>
                </Block>
                {selectedDate === '' || selectedDate === currentDate ? (
                  <>
                    {breakfastItems.length > 0 ? (
                      <Block
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.s}
                        marginHorizontal={0}
                        card>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/breakfast.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('foodPage', {
                                  mealType: 'breakfast',
                                  meal_type: 1,
                                  data,
                                  formDataCopy,
                                });
                              }}>
                              <Text
                                p
                                black
                                semibold
                                center
                                padding={10}
                                primary>
                                Breakfast ({totalBreakfastCalorie.toFixed(2)})
                              </Text>
                            </TouchableOpacity>

                            <Block row flex={0} align="center" justify="center">
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[1, 0]}
                                start={[0, 1]}
                                gradient={gradients.divider}
                              />
                              <Text center marginHorizontal={sizes.s}></Text>
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[0, 1]}
                                start={[1, 0]}
                                gradient={gradients.divider}
                              />
                            </Block>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'breakfast',
                                meal_type: '1',
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                        <Block flex={1} center>
                          
                          <Card style={styles.tableHeader1}>
                          <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                              <DataTable.Cell
                                style={{flex: 3}}></DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Protein
                              </DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Carb
                              </DataTable.Cell>
                              <DataTable.Cell numeric>Fat</DataTable.Cell >
                              {/* <DataTable.Cell>KCAL</DataTable.Cell> */}
                              <DataTable.Cell numeric> </DataTable.Cell>
                            </DataTable.Header>
                            {breakfastItems.map((item, index) => (
                              <DataTable.Row key={index}>
                                <DataTable.Cell
                                  style={{flex: 3}}
                                  >
                                  {item.food_name}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalProtein}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalCarb}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                  {item.details.totalFat}
                                </DataTable.Cell>
                                {/* <DataTable.Cell>
                                  {item.details.totalCalorie}
                                </DataTable.Cell> */}
                                <DataTable.Cell
                                numeric>
                                 
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleDelete(index, 'breakfast');
                                      handleDeleteApi(item);
                                    }}>
                                    <Image
                                      source={require('../assets/icons/close1.png')}
                                      color={'#fa9579'}
                                      style={
                                        ({
                                          width: 20,
                                          height: 20,
                                       
                                        })
                                      }
                                      
                                    />
                                  </TouchableOpacity>
                                  
                                </DataTable.Cell>
                              </DataTable.Row>
                            ))}
                          </DataTable></Card>
                         
                        </Block>
                      </Block>
                    ) : (
                      <Block
                        flex={0}
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.m}
                        marginHorizontal={10}
                        card
                        center>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/breakfast.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            <Text
                              p
                              black
                              semibold
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'breakfast',
                                  meal_type: 1,
                                  formDataCopy,
                                })
                              }>
                              Add Breakfast
                            </Text>
                            <Text
                              black
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'breakfast',
                                  meal_type: 1,
                                  formDataCopy,
                                })
                              }>
                              (Recommended {Math.floor(data.calories * 0.18)} -{' '}
                              {Math.floor(data.calories * 0.25)} kcal)
                            </Text>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'breakfast',
                                meal_type: 1,
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    )}

                    {morningSnackItems.length > 0 ? (
                      <Block
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.s}
                        card>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/break.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            {morningSnackItems.length > 1 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('morngSnack', {
                                    mealType: 'morningSnackItems',
                                    meal_type: 3,
                                    data,
                                    formDataCopy,
                                  });
                                }}>
                                <Text p black semibold center padding={10} primary>
                                  {' '}
                                  Morning Snacks ({totalMorningSnackCalorie})
                                 
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('morngSnack', {
                                    mealType: 'morningSnackItems',
                                    meal_type: 3,
                                    data,
                                    formDataCopy,
                                  });
                                }}>
                                <Text p black semibold center padding={10} primary>
                                  Morning Snack ({totalMorningSnackCalorie})
                                  
                                </Text>
                              </TouchableOpacity>
                              //   <TouchableOpacity onPress={toggleExpand}>
                              //   <Text numberOfLines={expanded ? undefined : maxLines}  ellipsizeMode="tail">
                              //   {text}
                              //   </Text>
                              //   </TouchableOpacity>
                            )}

                            <Block row flex={0} align="center" justify="center">
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[1, 0]}
                                start={[0, 1]}
                                gradient={gradients.divider}
                              />
                              <Text center marginHorizontal={sizes.s}></Text>
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[0, 1]}
                                start={[1, 0]}
                                gradient={gradients.divider}
                              />
                            </Block>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'morningSnackItems',
                                meal_type: 3,
                                formDataCopy,
                                data,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>

                        {/* Header */}

                        <Block flex={1} center>
                          <Card style={styles.tableHeader1}>
                          <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                              <DataTable.Cell
                                style={{flex: 3}}></DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Protein
                              </DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Carb
                              </DataTable.Cell>
                              <DataTable.Cell numeric>Fat</DataTable.Cell >
                              {/* <DataTable.Cell>KCAL</DataTable.Cell> */}
                              <DataTable.Cell numeric> </DataTable.Cell>
                            </DataTable.Header>
                            {morningSnackItems.map((item, index) => (
                              <DataTable.Row key={index}>
                                <DataTable.Cell
                                  style={{flex: 3}}
                                  >
                                  {item.food_name}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalProtein}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalCarb}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                  {item.details.totalFat}
                                </DataTable.Cell>
                                {/* <DataTable.Cell>
                                  {item.details.totalCalorie}
                                </DataTable.Cell> */}
                                <DataTable.Cell
                                numeric>
                                 
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleDelete(index, 'morningSnackItems');
                                      handleDeleteApi(item);
                                    }}>
                                    <Image
                                      source={require('../assets/icons/close1.png')}
                                      color={'#fa9579'}
                                      style={
                                        ({
                                          width: 20,
                                          height: 20,
                                       
                                        })
                                      }
                                      
                                    />
                                  </TouchableOpacity>
                                </DataTable.Cell>
                              </DataTable.Row>
                            ))}
                          </DataTable></Card>
                        </Block>
                      </Block>
                    ) : (
                      <Block
                        flex={0}
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.m}
                        marginHorizontal={10}
                        card
                        center>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/break.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            <Text
                              p
                              black
                              semibold
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'morningSnackItems',
                                  meal_type: 3,
                                  formDataCopy,
                                })
                              }>
                              Add Morning Snacks
                            </Text>
                            <Text
                              black
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'morningSnackItems',
                                  meal_type: 3,
                                  formDataCopy,
                                })
                              }>
                              (Recommended {Math.floor(data.calories * 0.06)} -{' '}
                              {Math.floor(data.calories * 0.08)} kcal)
                            </Text>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'morningSnackItems',
                                meal_type: 3,
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    )}
                    {lunchItems.length > 0 ? (
                      <Block
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.s}
                        card>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/lunch.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            {lunchItems.length > 1 ? (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('lunch', {
                                    mealType: 'lunch',
                                    meal_type: 4,
                                    data,
                                    formDataCopy,
                                  })
                                }>
                                <Text p black semibold center padding={10} primary>
                                  {' '}
                                  Lunch ({totalLunchCalorie}) 
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('lunch', {
                                    mealType: 'lunch',
                                    meal_type: 4,
                                    data,
                                    formDataCopy,
                                  })
                                }>
                                <Text p black semibold center padding={10} primary>
                                  Lunch ({totalLunchCalorie}) 
                                </Text>
                              </TouchableOpacity>
                            )}

                            <Block row flex={0} align="center" justify="center">
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[1, 0]}
                                start={[0, 1]}
                                gradient={gradients.divider}
                              />
                              <Text center marginHorizontal={sizes.s}></Text>
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[0, 1]}
                                start={[1, 0]}
                                gradient={gradients.divider}
                              />
                            </Block>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'lunch',
                                meal_type: 4,
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                        <Block flex={1} center>
                          <Card style={styles.tableHeader1}>
                          <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                              <DataTable.Cell
                                style={{flex: 3}}></DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Protein
                              </DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Carb
                              </DataTable.Cell>
                              <DataTable.Cell numeric>Fat</DataTable.Cell >
                              {/* <DataTable.Cell>KCAL</DataTable.Cell> */}
                              <DataTable.Cell numeric> </DataTable.Cell>
                            </DataTable.Header>
                            {lunchItems.map((item, index) => (
                              <DataTable.Row key={index}>
                                <DataTable.Cell
                                  style={{flex: 3}}
                                  >
                                  {item.food_name}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalProtein}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalCarb}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                  {item.details.totalFat}
                                </DataTable.Cell>
                                {/* <DataTable.Cell>
                                  {item.details.totalCalorie}
                                </DataTable.Cell> */}
                                <DataTable.Cell
                                numeric>
                                 
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleDelete(index, 'lunch');
                                      handleDeleteApi(item);
                                    }}>
                                    <Image
                                      source={require('../assets/icons/close1.png')}
                                      color={'#fa9579'}
                                      style={
                                        ({
                                          width: 20,
                                          height: 20,
                                       
                                        })
                                      }
                                      
                                    />
                                  </TouchableOpacity>
                                </DataTable.Cell>
                              </DataTable.Row>
                            ))}
                          </DataTable></Card>
                        </Block>
                      </Block>
                    ) : (
                      <Block
                        flex={0}
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.m}
                        marginHorizontal={10}
                        card
                        center>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/lunch.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            <Text
                              p
                              black
                              semibold
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'lunch',
                                  meal_type: 4,
                                  formDataCopy,
                                })
                              }>
                              Add Lunch
                            </Text>
                            <Text
                              black
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'lunch',
                                  meal_type: 4,
                                  formDataCopy,
                                })
                              }>
                              (Recommended {Math.floor(data.calories * 0.27)} -{' '}
                              {Math.floor(data.calories * 0.36)} kcal)
                            </Text>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'lunch',
                                meal_type: 4,
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    )}
                    {eveningSnackItems.length > 0 ? (
                      <Block
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.s}
                        card>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/snacks.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            {eveningSnackItems.length > 1 ? (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('evening', {
                                    mealType: 'evening',
                                    meal_type: 5,
                                    data,
                                    formDataCopy,
                                  })
                                }>
                                <Text p black semibold center padding={10} primary>
                                  {' '}
                                  Evening Snacks ({totalEveningSnackCalorie})
                                  
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('evening', {
                                    mealType: 'evening',
                                    meal_type: 5,
                                    data,
                                    formDataCopy,
                                  })
                                }>
                                <Text p black semibold center padding={10} primary>
                                  Evening Snack ({totalEveningSnackCalorie})
                                  
                                </Text>
                              </TouchableOpacity>
                            )}

                            <Block row flex={0} align="center" justify="center">
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[1, 0]}
                                start={[0, 1]}
                                gradient={gradients.divider}
                              />
                              <Text center marginHorizontal={sizes.s}></Text>
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[0, 1]}
                                start={[1, 0]}
                                gradient={gradients.divider}
                              />
                            </Block>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'evening',
                                meal_type: 5,
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                        <Block flex={1} center>
                          <Card style={styles.tableHeader1}>
                          <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                              <DataTable.Cell
                                style={{flex: 3}}></DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Protein
                              </DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Carb
                              </DataTable.Cell>
                              <DataTable.Cell numeric>Fat</DataTable.Cell >
                              {/* <DataTable.Cell>KCAL</DataTable.Cell> */}
                              <DataTable.Cell numeric> </DataTable.Cell>
                            </DataTable.Header>
                            {eveningSnackItems.map((item, index) => (
                              <DataTable.Row key={index}>
                                <DataTable.Cell
                                  style={{flex: 3}}
                                  >
                                  {item.food_name}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalProtein}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalCarb}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                  {item.details.totalFat}
                                </DataTable.Cell>
                                {/* <DataTable.Cell>
                                  {item.details.totalCalorie}
                                </DataTable.Cell> */}
                                <DataTable.Cell
                                numeric>
                                 
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleDelete(index, 'evening');
                                      handleDeleteApi(item);
                                    }}>
                                    <Image
                                      source={require('../assets/icons/close1.png')}
                                      color={'#fa9579'}
                                      style={
                                        ({
                                          width: 20,
                                          height: 20,
                                       
                                        })
                                      }
                                      
                                    />
                                  </TouchableOpacity>
                                </DataTable.Cell>
                              </DataTable.Row>
                            ))}
                          </DataTable></Card>
                        </Block>
                      </Block>
                    ) : (
                      <Block
                        flex={0}
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.m}
                        marginHorizontal={10}
                        card
                        center>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/snacks.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            <Text
                              p
                              black
                              semibold
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'evening',
                                  meal_type: 5,
                                  formDataCopy,
                                })
                              }>
                              Add Evening Snacks
                            </Text>
                            <Text
                              black
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'evening',
                                  meal_type: 5,
                                  formDataCopy,
                                })
                              }>
                              (Recommended {Math.floor(data.calories * 0.05)} -{' '}
                              {Math.floor(data.calories * 0.08)} kcal)
                            </Text>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'evening',
                                meal_type: 5,
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    )}
                    {dinnerItems.length > 0 ? (
                      <Block
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.s}
                        card>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/dinner.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            {eveningSnackItems.length > 1 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('dinner', {
                                    mealType: 'dinner',
                                    meal_type: 6,
                                    data,
                                    formDataCopy,
                                  });
                                }}>
                                <Text p black semibold center padding={10} primary>
                                  {' '}
                                  Dinner ({totalDinnerCalorie}) 
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('dinner', {
                                    mealType: 'dinner',
                                    meal_type: 6,
                                    data,
                                    formDataCopy,
                                  });
                                }}>
                                <Text p black semibold center padding={10} primary>
                                  Dinner ({totalDinnerCalorie}) 
                                </Text>
                              </TouchableOpacity>
                            )}

                            <Block row flex={0} align="center" justify="center">
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[1, 0]}
                                start={[0, 1]}
                                gradient={gradients.divider}
                              />
                              <Text center marginHorizontal={sizes.s}></Text>
                              <Block
                                flex={0}
                                height={1}
                                width="50%"
                                end={[0, 1]}
                                start={[1, 0]}
                                gradient={gradients.divider}
                              />
                            </Block>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'dinner',
                                meal_type: 6,
                                data,
                                formDataCopy,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>

                        <Block flex={1} center>
                          <Card style={styles.tableHeader1}>
                          <DataTable style={styles.container}>
                            <DataTable.Header style={styles.tableHeader}>
                              <DataTable.Cell
                                style={{flex: 3}}></DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Protein
                              </DataTable.Cell>
                              <DataTable.Cell style={{flex: 1}} numeric>
                                Carb
                              </DataTable.Cell>
                              <DataTable.Cell numeric>Fat</DataTable.Cell >
                              {/* <DataTable.Cell>KCAL</DataTable.Cell> */}
                              <DataTable.Cell numeric> </DataTable.Cell>
                            </DataTable.Header>
                            {dinnerItems.map((item, index) => (
                              <DataTable.Row key={index}>
                                <DataTable.Cell
                                  style={{flex: 3}}
                                  >
                                  {item.food_name}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalProtein}
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 1}} numeric>
                                  {item.details.totalCarb}
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                  {item.details.totalFat}
                                </DataTable.Cell>
                                {/* <DataTable.Cell>
                                  {item.details.totalCalorie}
                                </DataTable.Cell> */}
                                <DataTable.Cell
                                numeric>
                                 
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleDelete(index, 'dinner');
                                      handleDeleteApi(item);
                                    }}>
                                    <Image
                                      source={require('../assets/icons/close1.png')}
                                      color={'#fa9579'}
                                      style={
                                        ({
                                          width: 20,
                                          height: 20,
                                       
                                        })
                                      }
                                      
                                    />
                                  </TouchableOpacity>
                                </DataTable.Cell>
                              </DataTable.Row>
                            ))}
                          </DataTable></Card>
                        </Block>
                      </Block>
                    ) : (
                      <Block
                        flex={0}
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={sizes.m}
                        marginHorizontal={10}
                        card
                        center>
                        <Block row align="center">
                          <Block flex={0}>
                            <Image
                              source={require('../assets/icons/dinner.png')}
                              style={{
                                width: sizes.xl,
                                height: sizes.xl,
                              }}
                              marginLeft={sizes.s}
                            />
                          </Block>
                          <Block flex={3} style={{alignSelf: 'center'}}>
                            <Text
                              p
                              black
                              semibold
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'dinner',
                                  meal_type: 6,
                                  formDataCopy,
                                  data,
                                })
                              }>
                              Add Dinner
                            </Text>
                            <Text
                              black
                              center
                              padding={10}
                              onPress={() =>
                                navigation.navigate('searchfood', {
                                  mealType: 'dinner',
                                  meal_type: 6,
                                  formDataCopy,
                                })
                              }>
                              (Recommended {Math.floor(data.calories * 0.27)} -{' '}
                              {Math.floor(data.calories * 0.36)} kcal)
                            </Text>
                          </Block>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('searchfood', {
                                mealType: 'dinner',
                                meal_type: 6,
                                formDataCopy,
                                data,
                              })
                            }>
                            <Block flex={0} style={{alignSelf: 'center'}}>
                              <Image
                                radius={0}
                                width={25}
                                height={25}
                                color={'#c58bf2'}
                                source={assets.plus}
                                transform={[{rotate: '360deg'}]}
                                margin={sizes.s}
                              />
                            </Block>
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    )}
                    {/* meal 1 and 2 area is here */}
                    {/* <Progress.Bar progress={0.3}  width={100}  /> */}

                    <Block flex={0} marginTop={10}>
                      <Image
                        background
                        resizeMode="cover"
                        padding={sizes.sm}
                        paddingBottom={sizes.l}
                        radius={sizes.cardRadius}
                        source={assets.green}
                        blurRadius={10}>
                        <Block flex={0}>
                          <Image source={{uri: user?.avatar}} />

                          <Text h5 center white>
                            Water Tracker
                          </Text>
                          {water ? (
                            <Text p center white>
                              Target {waterTracker.normal_water_count_ml} ml
                            </Text>
                          ) : (
                            <ActivityIndicator size="large" color="green" />
                          )}

                          {water ? (
                            <Block
                              row
                              style={{
                                justifyContent: 'space-between',
                                paddingTop: 20,
                              }}>
                              <Block
                                flex={1.8}
                                width={160}
                                height={80}
                                card
                                center
                                marginTop={30}>
                                <Block
                                  center
                                  flex={0}
                                  marginBottom={10}
                                  marginRight={20}></Block>
                                <Block flex={0}>
                                  <Text center info h5 bold>
                                    {/* {Math.round(waterAmount * 100)}% */}
                                    {/* {data.water_datas.todays_consumed_water_count_ml} */}
                                    {waterTracker.todays_consumed_water_count_ml
                                      ? `${waterTracker.todays_consumed_water_count_ml} ml`
                                      : '0 ml'}
                                  </Text>
                                  <Text center semibold secondary>
                                    Water intake
                                  </Text>
                                </Block>
                              </Block>
                              <Block
                                flex={1.1}
                                // card
                                width={130}
                                marginHorizontal={10}
                                center
                                padding={30}>
                                <Block
                                  flex={1}
                                  centerContent
                                  center
                                  style={{
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                  }}>
                                  <Image
                                    center
                                    source={require('../assets/icons/glass.png')}
                                    height={40}
                                    width={40}></Image>
                                </Block>
                                <Text center white>
                                  (250 ml per cup)
                                </Text>
                                <Block row center marginTop={10}>
                                  <Block flex={0} marginRight={5}>
                                    <Button
                                      info
                                      // onPress={decreaseWater}
                                      onPress={decreaseProgress}
                                      // disabled={
                                      //   waterTracker.todays_consumed_water_count_ml <=
                                      //   0
                                      // }
                                      >
                                      <Text bold white p>
                                        -
                                      </Text>
                                    </Button>
                                  </Block>
                                  <Block flex={0}>
                                    <Button
                                      info
                                      marginLeft={5}
                                      // onPress={increaseWater}
                                      onPress={increaseProgress} 
                                      >
                                      <Text bold white>
                                        {' '}
                                        +{' '}
                                      </Text>
                                    </Button>
                                  </Block>
                                </Block>
                              </Block>
                              <Block flex={1} center>
                                <Lottie
                                    width={84}
                                    height={194}
                                    source={require('../assets/json/waterProgress.json')}
                                    progress={animationProgress.current}
                                    // autoPlay={true}
                                  />
                                  
                                {/* <Block
                                  transform={[{rotate: '-90deg'}]}
                                  centerContent
                                  flex={0}
                                  width={100}
                                  margin={-20}>
                                  <Progress.Bar
                                    progress={waterProgress}
                                    width={120}
                                    height={15}
                                    borderRadius={10}
                                    color="skyblue"></Progress.Bar>
                                </Block> */}
                              </Block>
                            </Block>
                          ) : (
                            <ActivityIndicator size="large" color="green" /> // Show loading indicator when water data is null
                          )}
                        </Block>
                      </Image>
                    </Block>
                  </>
                ) : (
                  <PreviousDietDetails data={apiData} />
                )}
              </Block>
            </Block>
          </Block>

          {/* toggle products list */}

          {/* products list */}
        </>
      )}
    </Block>
  );
};
const styles = StyleSheet.create({
  boldTitle: {
    fontWeight: 'bold',
    // Other style properties you want to apply, such as fontSize, color, etc.
  },
  tableHeader: {
    borderBottomColor: 'lightgreen',
    borderBottomWidth: 0.9,
     marginTop:0,
     borderRadius:15
     
  },
  tableHeader1: {
    // borderBottomColor: 'lightgreen',
    // borderBottomWidth: 0.9,
    //  marginTop:0,
     borderRadius:15,
    //  backgroundColor:'white'
     
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundAnimation: {
    width: 100,
    height: 100,
  },

  progressBar: {
    width: 10,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 15,
  },
  progressBarFill: {
    backgroundColor: 'skyblue',
    borderRadius: 15,
  },
  progressText: {
    fontSize: 16,
    marginVertical: 10,
  },
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
    // flex: 1,
    // flexDirection: 'row', // set elements horizontally, try column.
    // paddingHorizontal: 10,
  },
  // container: {
  //   flex: 3,
  //   // backgroundColor: '#f9f6ee',
  // padding: 10,
  // },
  mainCardView: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 15,
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

  row: {
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    // alignSelf: 'center',
    minWidth: 60,
    // justifyContent:'center'
  },
  header2: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    // alignSelf: 'center',
    minWidth: 70,
    // justifyContent:'center'
  },
  header3: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    // alignSelf: 'center',
    maxWidth: 50,
  },
  data: {
    flex: 2,
    fontSize: 16,
    padding: 5,
    minWidth: 60,
    // paddingBottom: 10,
    alignItems: 'center',
    alignContent: 'center',
  },
  item: {
    flexDirection: 'row',
  },
});

export default DietPlan;

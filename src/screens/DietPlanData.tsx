/* eslint-disable prettier/prettier */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import {Platform, Linking, StyleSheet, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, Input, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';

import Icon from 'react-native-vector-icons/FontAwesome';
import {MealContext} from '../hooks/useMeal';
import {FOOD_IMAGE, BASE_URL} from '@env';
import SelectDropdown from 'react-native-select-dropdown';
import {ActivityIndicator} from 'react-native';

const isAndroid = Platform.OS === 'android';

const DietPlanData = ({route, navigation}) => {
  const {mealType, responseData, meal_type, formDataCopy, food} = route.params;
  console.log(responseData, 'response');

  const [initialGram, setInitialGram] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(initialGram);
  console.log(selectedWeight, 'selected');

  useEffect(() => {
    setSelectedWeight(initialGram);
  }, [initialGram]);

  const [selectedFood, setSelectedFood] = useState({});
  const [servingGrams, setServingGrams] = useState([]);
  const [servingDetails, setServingDetails] = useState([]);
  const [servingDetailsFull, setServingDetailsFull] = useState([]);

  // new items for adding food to db
  const [servingId, setServingId] = useState('');
  console.log(servingId, 'serving id');

  const [servingDesc, setServingDesc] = useState('');

  const [selectedDropDown, setSelectedDropDown] = useState('');
  const [ironAmount, setIronAmount] = useState(0);
  const [proteinAmount, setProteinAmount] = useState(0);
  const [calorieAmount, setCalorieAmount] = useState(0);
  const [fatAmount, setFatAmount] = useState(0);
  const [carbAmount, setCarbAmount] = useState(0);
  const [fiberAmount, setFiberAmount] = useState(0);
  const [sugarAmount, setSugarAmount] = useState(0);
  const [sodiumAmount, setSodiumAmount] = useState(0);
  const [potassiumAmount, setPotassiumAmount] = useState(0);
  const [cholesterolAmount, setCholesterolAmount] = useState(0);
  const [saturatedFatAmount, setSaturatedFatAmount] = useState(0);
  const [transFatAmount, setTransFatAmount] = useState(0);
  const [monounsaturatedFatAmount, setMonounsaturatedFatAmount] = useState(0);
  const [polyunsaturatedFatAmount, setPolyunsaturatedFatAmount] = useState(0);
  const [vitaminAIUAmount, setVitaminAIUAmount] = useState(0);
  const [vitaminARAEAmount, setVitaminARAEAmount] = useState(0);
  const [vitaminCAmount, setVitaminCAmount] = useState(0);
  const [vitaminDAmount, setVitaminDAmount] = useState(0);
  const [calciumAmount, setCalciumAmount] = useState(0);
  const [multiplication, setMultiplication] = useState(1);
  const [totalCalorie, setTotalCalorie] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [totalCarb, setTotalCarb] = useState(0);
  const [totalSugar, setTotalSugar] = useState(0);
  const [totalFiber, setTotalFiber] = useState(0);
  const [totalSodium, setTotalSodium] = useState(0);
  const [totalPotassium, setTotalPotassium] = useState(0);
  const [totalCholesterol, setTotalCholesterol] = useState(0);
  const [totalSaturatedFat, setTotalSaturatedFat] = useState(0);
  const [totalTransFat, setTotalTransFat] = useState(0);
  const [totalMonounsaturatedFat, setTotalMonounsaturatedFat] = useState(0);
  const [totalPolyunsaturatedFat, setTotalPolyunsaturatedFat] = useState(0);
  const [totalVitaminAIU, setTotalVitaminAIU] = useState(0);
  const [totalVitaminARAE, setTotalVitaminARAE] = useState(0);
  const [totalVitaminC, setTotalVitaminC] = useState(0);
  const [totalVitaminD, setTotalVitaminD] = useState(0);
  const [totalCalcium, setTotalCalcium] = useState(0);
  const [totalIron, setTotalIron] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    addBreakfastItem,
    addLunchItem,
    addDinnerItem,
    addMorningSnackItem,
    addEveningSnackItem,
    addMealItem1,
    addMealItem2,
  } = useContext(MealContext);
  const {assets, colors, gradients, sizes, fonts, user} = useTheme();
  const [selectedValue, setSelectedValue] = useState(245);
  const [count, setCount] = useState(1);
  const [gramCount, setGramCount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const handleValueChange = (value) => {
    setSelectedValue(value);
    setTextInputValue(`You selected ${value}`);
  };
  const [foodData, setFoodData] = useState();
  const {t} = useTranslation();
  const [isFullBlock, setIsFullBlock] = useState(false);
  const [breakfast, setBreakfast] = useState('');

  const handleViewToggle = () => {
    setIsFullBlock(!isFullBlock);
  };
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;
  const [isLoadingServingGrams, setIsLoadingServingGrams] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
    setSelectedWeight(text);
    setServingId(4792);
    setMultiplication(1);
    // Add any additional logic you need when the search text changes
  };

  const handleEditButtonClick = () => {
    setIsEditing(true);
    setSearchText('');
  };

  useEffect(() => {
    setIsLoadingServingGrams(true);
    axios
      .get(`${BASE_URL}get_serving_desc_by_food_id/${responseData.id}`)
      .then((response) => {
        // console.log(response.data.data.serving_desc , "new check");

        setServingDetailsFull(response.data.data.serving_desc);
        const servingNames = response.data.data.serving_desc.map(
          (serving) => serving.name,
        );
        // new steps
        const servingDesc = response.data.data.serving_desc.map(
          (serving) => serving.desc,
        );
        const servingId = response.data.data.serving_desc.map(
          (serving) => serving.id,
        );
        servingId.unshift(4792);
        const servingInitialGram = response.data.data.serving_desc.map(
          (serving) => serving.weight,
        );
        servingInitialGram.unshift(100);
        const servingGrams = response.data.data.serving_desc.map(
          (serving) => `${serving.name} (${serving.weight} g)`,
        );
        setServingId(servingId[0]);

        setServingDesc(servingDesc[0]);
        servingGrams.unshift('100 g');
        // console.log(servingDesc , "servingDesc");

        // console.log(servingId[0] , "without touch");

        // console.log(servingId , "serving id");

        setServingDetails(servingNames);
        // console.log(servingDetails, "serving names");

        setServingGrams(servingGrams);
        setInitialGram(servingInitialGram[0]);
        setSelectedDropDown(servingGrams[0]);
        setIsLoadingServingGrams(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // console.log(servingDesc , "serving desc");

  useEffect(() => {
    // console.log('food ', selectedWeight);

    if (selectedWeight === null) {
      // console.log('null', initialGram);
      // setSelectedWeight(initialGram);
    }

    nutritionCalculation();
  }, [selectedWeight]);
  function nutritionCalculation() {
    const new_calories = selectedWeight * (responseData.calories / 100);
    const new_fat = selectedWeight * (responseData.fat_in_g / 100);
    const new_protein = selectedWeight * (responseData.protein_in_g / 100);
    const new_carb = selectedWeight * (responseData.carb_in_g / 100);
    const new_sugar = selectedWeight * (responseData.sugar_in_g / 100);
    const new_fiber = selectedWeight * (responseData.fiber_in_g / 100);
    const new_sodium = selectedWeight * (responseData.sodium_in_mg / 100);
    const new_potassium = selectedWeight * (responseData.potassium_in_mg / 100);
    const new_cholestrol =
      selectedWeight * (responseData.cholestrol_in_mg / 100);
    const new_saturated_fat =
      selectedWeight * (responseData.saturated_fat_in_g / 100);
    const new_trans_fat = selectedWeight * (responseData.trans_fat_in_g / 100);
    const new_monounsaturated_fat =
      selectedWeight * (responseData.monounsaturated_fat_in_g / 100);
    const new_polyunsaturated_fat =
      selectedWeight * (responseData.polyunsaturated_fat_in_g / 100);
    const new_vitamin_a_iu = selectedWeight * (responseData.vitamin_a_iu / 100);
    const new_vitamin_a_rae_mg =
      selectedWeight * (responseData.vitamin_a_rae_mg / 100);
    const new_vitamin_c = selectedWeight * (responseData.vitamin_c_in_mg / 100);
    const new_vitamin_d = selectedWeight * (responseData.vitamin_d_mg / 100);
    const new_calcium = selectedWeight * (responseData.calcium_in_mg / 100);
    const new_iron = selectedWeight * (responseData.iron_in_mg / 100);

    // console.log(new_protein, new_calories, new_iron);
    setProteinAmount(new_protein);
    setCalorieAmount(new_calories);
    setIronAmount(new_iron);
    setFatAmount(new_fat);
    setCarbAmount(new_carb);
    setSugarAmount(new_sugar);
    setFiberAmount(new_fiber);
    setSodiumAmount(new_sodium);
    setPotassiumAmount(new_potassium);
    setCholesterolAmount(new_cholestrol);
    setSaturatedFatAmount(new_saturated_fat);
    setTransFatAmount(new_trans_fat);
    setMonounsaturatedFatAmount(new_monounsaturated_fat);
    setPolyunsaturatedFatAmount(new_polyunsaturated_fat);
    setVitaminAIUAmount(new_vitamin_a_iu);
    setVitaminARAEAmount(new_vitamin_a_rae_mg);
    setVitaminCAmount(new_vitamin_c);
    setVitaminDAmount(new_vitamin_d);
    setCalciumAmount(new_calcium);
  }
  const handleGramChange = (value) => {
    // Parse the input value as an integer
    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue) && parsedValue > 0) {
      // Set the valid value
      setMultiplication(parsedValue);
    } else {
      // Handle invalid input (e.g., set it to 1 or show an error message)
      // For example, setting it to 1:
      setMultiplication(1);
    }
  };
  // console.log(multiplication,"count");

  useEffect(() => {
    if (multiplication) {
      setTotalCalorie((multiplication * calorieAmount).toFixed(2));
      setTotalProtein((multiplication * proteinAmount).toFixed(2));
      setTotalFat((multiplication * fatAmount).toFixed(2));
      setTotalCarb((multiplication * carbAmount).toFixed(2));
      setTotalSugar((multiplication * sugarAmount).toFixed(2));
      setTotalFiber((multiplication * fiberAmount).toFixed(2));
      setTotalSodium((multiplication * sodiumAmount).toFixed(2));
      setTotalPotassium((multiplication * potassiumAmount).toFixed(2));
      setTotalCholesterol((multiplication * cholesterolAmount).toFixed(2));
      setTotalSaturatedFat((multiplication * saturatedFatAmount).toFixed(2));
      setTotalTransFat((multiplication * transFatAmount).toFixed(2));
      setTotalMonounsaturatedFat(
        (multiplication * monounsaturatedFatAmount).toFixed(2),
      );
      setTotalPolyunsaturatedFat(
        (multiplication * polyunsaturatedFatAmount).toFixed(2),
      );
      setTotalVitaminAIU((multiplication * vitaminAIUAmount).toFixed(2));
      setTotalVitaminARAE((multiplication * vitaminARAEAmount).toFixed(2));
      setTotalVitaminC((multiplication * vitaminCAmount).toFixed(2));
      setTotalVitaminD((multiplication * vitaminDAmount).toFixed(2));
      setTotalCalcium((multiplication * calciumAmount).toFixed(2));
      setTotalIron((multiplication * ironAmount).toFixed(2));
    }
  }, [
    multiplication,
    calorieAmount,
    proteinAmount,
    fatAmount,
    carbAmount,
    sugarAmount,
    fiberAmount,
    sodiumAmount,
    potassiumAmount,
    cholesterolAmount,
    saturatedFatAmount,
    transFatAmount,
    monounsaturatedFatAmount,
    polyunsaturatedFatAmount,
    vitaminAIUAmount,
    vitaminARAEAmount,
    vitaminCAmount,
    vitaminDAmount,
    calciumAmount,
    ironAmount,
  ]);
  const currentDate = new Date().toISOString().slice(0, 10);

  const desc = servingDesc;
  const added_date = currentDate;
  const desc_num_food_tbl = 10;
  const customer_id = formDataCopy.customer_id;
  const food_id = food.id;
  const taken_weight = selectedWeight;
  const quantity = multiplication;
  const serving_desc_id = servingId;
  // for update diet list in db
  const id = formDataCopy.customer_id;

  // console.log(serving_desc_id , "theid");

  const mealDetails = {
    totalCalorie,
    totalProtein,
    totalFat,
    totalCarb,
    totalSugar,
    totalFiber,
    totalSodium,
    totalPotassium,
    totalCholesterol,
    totalSaturatedFat,
    totalTransFat,
    totalMonounsaturatedFat,
    totalPolyunsaturatedFat,
    totalVitaminAIU,
    totalVitaminARAE,
    totalVitaminC,
    totalVitaminD,
    totalCalcium,
    totalIron,
    multiplication,
    selectedDropDown,
    selectedWeight,
    mealType,
    added_date,
    desc,
    food_id,
    meal_type,
    customer_id,
    taken_weight,
    quantity,
    serving_desc_id,
    desc_num_food_tbl,
    id,
  };

  const handleAddFood = () => {
    setLoading(true);
    switch (mealType) {
      case 'breakfast':
      case 'breakfast':
        console.log(responseData, 'from device breakfast');

        addBreakfastItem(responseData, mealDetails);
        break;
      case 'morningSnackItems':
        addMorningSnackItem(responseData, mealDetails);
        break;
      case 'lunch':
        addLunchItem(responseData, mealDetails);
        break;
      case 'evening':
        addEveningSnackItem(responseData, mealDetails);
        break;
      case 'dinner':
        addDinnerItem(responseData, mealDetails);
        break;
      case 'meal1':
        addMealItem1(responseData, mealDetails);
        break;
      case 'meal2':
        addMealItem2(responseData, mealDetails);
        break;
      default:
        break;
    }
    console.log(servingId);

    // console.log(servingId);

    // console.log(mealDetails.customer_id, 'demo');

    // navigation.navigate('tabNavigator', {
    //   screen: 'pie', // Screen name within the TabNavigator
    //   params: {formDataCopy}, // Pass your parameters here
    // });
    navigation.navigate('Menu', {
      formDataCopy, // Pass your parameters here
    });

    setLoading(false);
  };

  return (
    <Block safe>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block safe>
          <Block
            scroll
            paddingHorizontal={sizes.s}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: sizes.padding}}>
            <Block marginTop={20}>
              <Block card padding={0}>
                <Image
                  background
                  padding={15}
                  blurRadius={10}
                  resizeMode="cover"
                  source={require('../assets/images/bg111.jpg')}
                  radius={sizes.cardRadius}>
                  <Block row>
                    {responseData.image ===
                    'https://admin.fitaraise.com/storage/uploads/app_images/no_image.png' ? (
                      // <Image
                      //   resizeMode="contain"
                      //   source={assets.dosa}
                      //   style={{height: 114, width: 114}}
                      // />
                      <View
                        style={{
                          width: sizes.xxl,
                          backgroundColor: 'rgb(245,232,250)',
                          borderRadius: sizes.s,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{fontSize: 50, color: '#fff'}}
                          bold
                          primary>
                          {responseData.food_name.charAt(0)}
                        </Text>
                      </View>
                    ) : (
                      <Image
                        resizeMode="contain"
                        source={{
                          uri: `${responseData.image}`,
                        }}
                        style={{height: 114, width: 114}}
                      />
                    )}

                    <Block padding={sizes.s} justify="space-between">
                      <Block row style={{justifyContent: 'space-around'}}>
                        <Block paddingBottom={10} paddingLeft={10}>
                          <Text p bold color={colors.primary}>
                            {responseData.food_name}
                          </Text>
                        </Block>

                        <TouchableOpacity onPress={toggleFavorite}>
                          <Icon
                            name={isFavorite ? 'heart' : 'heart-o'}
                            size={30}
                            color="green"
                          />
                        </TouchableOpacity>
                      </Block>

                      <TouchableOpacity>
                     
                        <Block row marginTop={10}>
                          <Block row paddingBottom={10} paddingLeft={10}>
                          {isEditing ? (
                              <>
                              <Block center flex={0}>
                              <Text
                                  p
                                  semibold
                                  center
                                  marginRight={sizes.s}
                                  color={colors.secondary}>
                                  Selected Gram :
                                </Text>
                              </Block>
                               
                                <TextInput
                                  style={styles.inputContainer}
                                  autoCapitalize="none"
                                  placeholder={`${
                                    multiplication * selectedWeight
                                  }g`}
                                  onChangeText={handleSearch}
                                  value={searchText}
                                />
                              </>
                            ) : (
                              <Text
                                p
                                semibold
                                center
                                marginRight={sizes.s}
                                color={colors.secondary}>
                                Selected Gram :{' '}
                                {multiplication * selectedWeight}g
                              </Text>
                            )}
                            {/* <Image source={assets.arrow} color={colors.link} /> */}
                          </Block>
                          {isEditing?(
                             <TouchableWithoutFeedback
                             // key={item.details.id}
                             onPress={handleEditButtonClick}>
                             <Block flex={0} center>
                               {/* <Image
                                 marginLeft={5}
                                 // marginRight={10}
                                 marginTop={1}
                                 source={require('../assets/icons/edit1.png')}
                                 color={'green'}
                                 style={
                                   (styles.data, {width: 30, height: 30})
                                 }></Image> */}
                             </Block>
                           </TouchableWithoutFeedback>
                          ):(
                            <TouchableWithoutFeedback
                            // key={item.details.id}
                            onPress={handleEditButtonClick}>
                            <Block flex={0} center>
                              <Image
                                marginLeft={5}
                                // marginRight={10}
                                marginTop={1}
                                source={require('../assets/icons/edit1.png')}
                                color={'green'}
                                style={
                                  (styles.data, {width: 30, height: 30})
                                }></Image>
                            </Block>
                          </TouchableWithoutFeedback>
                          )}
                         
                        </Block>
                      </TouchableOpacity>
                    </Block>
                  </Block>
                </Image>
              </Block>
            </Block>
            {/* <Block card style={{alignSelf:'center' , width:400 , justifyContent:'space-around'}} row marginTop={10} paddingHorizontal={sizes.s}>
<Text bold center> Dosa </Text>
<TouchableOpacity onPress={toggleFavorite}>
      <Icon name={isFavorite ? 'heart' : 'heart-o'} size={30} color="#f00" />
    </TouchableOpacity>
  </Block> */}
            <Block row style={{alignSelf: 'center'}} paddingTop={20} flex={0}>
              <Input
                marginBottom={sizes.s}
                placeholder="1"
                keyboardType="numeric"
                maxLength={3}
                style={{
                  height: 50,
                  width: 60,
                  backgroundColor: 'white',
                }}
                onChangeText={(value) => {
                  {
                    // setCount(value);
                    handleGramChange(value);
                  }
                }}
              />
              {/* <Picker
                selectedValue={selectedValue}
                
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedValue(itemValue)
                }>
                <Picker.Item label="Medium serving ( 245g )" value="245" />
                <Picker.Item label="Small serving ( 164.2 g )" value="164.2" />
                <Picker.Item label="Large serving ( 367.5 g )" value="367.5" />
                <Picker.Item label="Medium ( 25 g )" value="25" />
                <Picker.Item label="Small ( 10 g )" value="10" />
                <Picker.Item label="gram" value="1" />
              </Picker> */}
              <Block
                style={{
                  height: 50,
                  width: 300,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  marginLeft: 10,
                }}>
                <SelectDropdown
                  defaultValue={initialGram}
                  dropdownStyle={{borderRadius: 20}}
                  buttonStyle={{
                    height: 50,
                    width: 250,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    marginLeft: 10,
                  }}
                  data={isLoadingServingGrams ? ['Loading...'] : servingGrams}
                  onSelect={(selectedItem, index) => {
                    // console.log(servingGrams, 'ok bie ');
                    const item = servingGrams.find((item) =>
                      item.includes(selectedItem),
                    );

                    const selectedweight1 = item
                      ? item
                          .split(' ')
                          [item.split(' ').length - 2].replace('(', '')
                      : null;

                    setSelectedWeight(selectedweight1);
                    setIsEditing(false);
                    // Get the ID of the selected item
                    // console.log('this is serving detrails', servingDetailsFull);

                    const ids = servingDetailsFull.find(
                      (ids) => ids.name === selectedItem.split(' (')[0],
                    );
                    // console.log('dark', ids);
                    if (ids) {
                      console.log(ids.id, 'first');

                      setServingId(ids.id);
                    }
                    // Update the state variables
                    setSelectedWeight(selectedweight1);
                    setSelectedDropDown(selectedItem);

                    // Get the ID and Desc of the selected item from 'servingDetailsFull' array
                    const selectedItemName = selectedItem.split(' (')[0];
                    const selectedServing = servingDetailsFull.find(
                      (item) => item.name === selectedItemName,
                    );

                    if (selectedServing) {
                      setServingId(selectedServing.id);
                      // console.log(selectedServing.desc, 'testing');

                      // You can also set the 'desc' details based on the selected item's 'id' here if needed.
                      // For example, if 'desc' is a state variable, you can set it like:
                      setServingDesc(selectedServing.desc);
                    } else {
                      setServingId(null);
                      // If the selected item's 'id' or 'desc' should be set to a default value when not found in 'servingDetailsFull', do it here.
                    }
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    setSelectedDropDown(selectedItem);
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item;
                  }}
                  defaultButtonText={servingGrams[0]}
                />
              </Block>
            </Block>

            <Block flex={0}>
              <Block paddingBottom={sizes.s} paddingTop={sizes.s}>
                <Block
                  card
                  flex={2}
                  marginBottom={sizes.m}
                  style={{height: 250}}>
                  <Text
                    p
                    bold
                    color={'green'}
                    align="center"
                    paddingTop={sizes.m}>
                    {responseData.food_name} - Nutrition Facts of{' '}
                    {multiplication * selectedWeight} g
                  </Text>
                  <Block
                    row
                    flex={0}
                    align="center"
                    justify="center"
                    marginBottom={sizes.sm}
                    paddingHorizontal={sizes.xxl}
                    paddingTop={sizes.s}>
                    <Block
                      flex={0}
                      height={1}
                      width="30%"
                      align="center"
                      center
                      gradient={gradients.primary}
                    />
                  </Block>

                  <Block row>
                    <Block
                      paddingTop={sizes.sm}
                      marginRight={sizes.s}
                      card
                      radius={46}
                      style={{
                        height: 60,
                        opacity: 0.8,
                        backgroundColor: 'green',
                        shadowColor: 'green',
                      }}>
                      <Block row>
                        <Block align="center">
                          <Text bold>Protien: {totalProtein}</Text>
                        </Block>
                      </Block>
                    </Block>
                    <Block
                      card
                      radius={46}
                      paddingTop={sizes.sm}
                      style={{height: 60}}>
                      <Block row>
                        <Block align="center">
                          <Text bold>Calories: {totalCalorie} </Text>
                        </Block>
                      </Block>
                      <Block></Block>
                    </Block>
                  </Block>
                  <Block row>
                    <Block
                      paddingTop={sizes.sm}
                      marginRight={sizes.s}
                      card
                      radius={46}
                      style={{
                        height: 60,
                        opacity: 0.8,
                        backgroundColor: 'green',
                      }}>
                      <Block row>
                        <Block align="center">
                          <Text bold>Carbs: {totalCarb}</Text>
                        </Block>
                      </Block>
                      <Block></Block>
                    </Block>
                    <Block
                      card
                      radius={46}
                      paddingTop={sizes.sm}
                      style={{height: 60}}>
                      <Block row>
                        <Block align="center">
                          <Text bold>Fat: {totalFat}</Text>
                        </Block>
                      </Block>
                      <Block></Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
              {/* Nutrition full details card*/}

              {isFullBlock ? (
                <Block flex={2} style={{height: 900}}>
                  <Block
                    card
                    row
                    flex={3}
                    padding={sizes.s}
                    paddingTop={sizes.m}
                    marginBottom={sizes.m}
                    style={styles.container5}>
                    <Block>
                      <Text
                        p
                        bold
                        center
                        color={'green'}
                        paddingBottom={sizes.s}>
                        Nutrition
                      </Text>
                      <Block style={styles.container}>
                        {/* Header */}
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.header} center semibold>
                            Sugar :
                          </Text>
                          <Text style={styles.header} center>
                            {totalSugar}
                          </Text>
                        </Block>

                        {/* Data Rows */}
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.header} center semibold>
                            Fiber :
                          </Text>
                          <Text style={styles.header} center>
                            {totalFiber}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.header} center semibold>
                            Sodium :
                          </Text>
                          <Text style={styles.header} center>
                            {totalSodium}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.header} center semibold>
                            Potassium :
                          </Text>
                          <Text style={styles.header} center>
                            {totalPotassium}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.header} center semibold>
                            Cholesterol :
                          </Text>
                          <Text style={styles.header} center>
                            {totalCholesterol}
                          </Text>
                        </Block>

                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Saturated Fat :
                          </Text>
                          <Text style={styles.data} center>
                            {totalSaturatedFat}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            TransFat :
                          </Text>
                          <Text style={styles.data} center>
                            {totalTransFat}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Monounsaturated Fat :
                          </Text>
                          <Text style={styles.data} center>
                            {totalMonounsaturatedFat}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Polyunsaturated Fat :
                          </Text>
                          <Text style={styles.data} center>
                            {totalPolyunsaturatedFat}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Vitamin A :
                          </Text>
                          <Text style={styles.data} center>
                            {totalVitaminAIU}
                          </Text>
                        </Block>
                        {/* <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Vitamin A Retinol Activity Equivalents (RAE) :
                          </Text>
                          <Text style={styles.data} center>
                            {totalVitaminARAE}
                          </Text>
                        </Block> */}
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Vitamin C :
                          </Text>
                          <Text style={styles.data} center>
                            {totalVitaminC}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Vitamin D :
                          </Text>
                          <Text style={styles.data} center>
                            {totalVitaminD}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Calcium :
                          </Text>
                          <Text style={styles.data} center>
                            {totalCalcium}
                          </Text>
                        </Block>
                        <Block style={styles.row} flex={0} card margin={1}>
                          <Text style={styles.data} center semibold>
                            Iron :
                          </Text>
                          <Text style={styles.data} center>
                            {totalIron}
                          </Text>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              ) : (
                <Block flex={2} style={{height: 200}}>
                  <Block
                    flex={1}
                    card
                    marginBottom={sizes.m}
                    center
                    style={{
                      backgroundColor: 'yellow',
                      opacity: 0.8,
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                    }}>
                    <TouchableOpacity onPress={handleViewToggle}>
                      <Block row></Block>
                      <Text center bold h5 color={'green'}>
                        Click to get full Nutrition details
                      </Text>
                    </TouchableOpacity>
                  </Block>
                </Block>
              )}
            </Block>
          </Block>
        </Block>
      </Block>

      {loading ? ( // Show loading indicator if loading is true
        <Block center style={styles.buttonContainer}>
          <ActivityIndicator size="large" color="blue" />
        </Block>
      ) : (
        <TouchableWithoutFeedback onPress={handleAddFood}>
          <Block center style={styles.buttonContainer}>
            <Text style={styles.buttonText} bold>
              Add
            </Text>
          </Block>
        </TouchableWithoutFeedback>
      )}
    </Block>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#f2f8fc',
    borderRadius: 15,
    borderWidth: 0.3,
    width: 75,
    // marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
  color:'gray'
    // minHeight:30
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#0ef896',
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 300,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  container5: {
    // flex: 1,
    maxHeight: 2000,
    backgroundColor: '#00000',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  data: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
});

export default DietPlanData;

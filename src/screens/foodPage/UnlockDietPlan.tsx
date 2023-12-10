/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';
import {useData, useTheme, useTranslation} from '../../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {Animated, Easing, FlatList, ScrollView} from 'react-native';
import Lottie from 'lottie-react-native';

import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';
const dietPlan = [
  {
    id: 1,
    meal_type_name: 'Breakfast',
    meal_type_image:
      'http://admin.fitaraise.com/storage/uploads/meal_type/16799380846421d22431507.jpg',
    diet_list: [
      {
        id: 671,
        food_id: 20481,
        food_name: 'Oats',
        taken_weight: 96,
        quantity: 1,
        serving_desc: 'half cup',
        final_weight_g: 96,
        calories_kcal: 365.83,
        proteins_g: 12.64,
        carb_g: 64.58,
        fat_g: 6.17,
        meal_type_recommended_percentage_from: 18,
        meal_type_recommended_percentage_to: 25,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/foods/168034407264280408b2843.jpg',
      },
      {
        id: 672,
        food_id: 7359,
        food_name: 'Low-Fat Milk',
        taken_weight: 155,
        quantity: 1,
        serving_desc: '1 cup',
        final_weight_g: 155,
        calories_kcal: 65.1,
        proteins_g: 5.22,
        carb_g: 7.73,
        fat_g: 1.5,
        meal_type_recommended_percentage_from: 18,
        meal_type_recommended_percentage_to: 25,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 673,
        food_id: 654,
        food_name: 'Raisins',
        taken_weight: 28.4,
        quantity: 1,
        serving_desc: '1 oz (60 raisins)',
        final_weight_g: 28.4,
        calories_kcal: 84.92,
        proteins_g: 0.94,
        carb_g: 22.53,
        fat_g: 0.07,
        meal_type_recommended_percentage_from: 18,
        meal_type_recommended_percentage_to: 25,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
    ],
  },
  {
    id: 3,
    meal_type_name: 'Morning Snack',
    meal_type_image:
      'http://admin.fitaraise.com/storage/uploads/meal_type/1679938164.jpg',
    diet_list: [
      {
        id: 674,
        food_id: 10174,
        food_name: 'Apples',
        taken_weight: 109,
        quantity: 1,
        serving_desc: '1 cup slices',
        final_weight_g: 109,
        calories_kcal: 56.68,
        proteins_g: 0.28,
        carb_g: 15.05,
        fat_g: 0.19,
        meal_type_recommended_percentage_from: 6,
        meal_type_recommended_percentage_to: 8,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 675,
        food_id: 1903,
        food_name: 'Flax Seeds',
        taken_weight: 28.4,
        quantity: 1,
        serving_desc: '1oz',
        final_weight_g: 28.4,
        calories_kcal: 151.66,
        proteins_g: 5.19,
        carb_g: 8.2,
        fat_g: 11.97,
        meal_type_recommended_percentage_from: 6,
        meal_type_recommended_percentage_to: 8,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 676,
        food_id: 7054,
        food_name: 'Almonds',
        taken_weight: 26,
        quantity: 1,
        serving_desc: '5 Piece',
        final_weight_g: 26,
        calories_kcal: 150.54,
        proteins_g: 5.5,
        carb_g: 5.6,
        fat_g: 12.98,
        meal_type_recommended_percentage_from: 6,
        meal_type_recommended_percentage_to: 8,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/foods/168043909264297734e235a.jpg',
      },
    ],
  },
  {
    id: 4,
    meal_type_name: 'Lunch',
    meal_type_image:
      'http://admin.fitaraise.com/storage/uploads/meal_type/1679938205.jpg',
    diet_list: [
      {
        id: 677,
        food_id: 6191,
        food_name: 'Brown Rice',
        taken_weight: 175,
        quantity: 1,
        serving_desc: '1 cup',
        final_weight_g: 175,
        calories_kcal: 215.25,
        proteins_g: 4.79,
        carb_g: 44.76,
        fat_g: 1.7,
        meal_type_recommended_percentage_from: 27,
        meal_type_recommended_percentage_to: 36,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 678,
        food_id: 7771,
        food_name: 'Plain Yogurt',
        taken_weight: 125,
        quantity: 1,
        serving_desc: '(1/2 cup)',
        final_weight_g: 125,
        calories_kcal: 76.25,
        proteins_g: 4.34,
        carb_g: 5.83,
        fat_g: 4.06,
        meal_type_recommended_percentage_from: 27,
        meal_type_recommended_percentage_to: 36,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 679,
        food_id: 13680,
        food_name: 'Cooked Red Kidney Beans',
        taken_weight: 120,
        quantity: 1,
        serving_desc: '1 cup',
        final_weight_g: 120,
        calories_kcal: 152.4,
        proteins_g: 10.4,
        carb_g: 27.36,
        fat_g: 0.6,
        meal_type_recommended_percentage_from: 27,
        meal_type_recommended_percentage_to: 36,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 680,
        food_id: 6909,
        food_name: 'Pea Sprouts',
        taken_weight: 120,
        quantity: 1,
        serving_desc: '1 cup',
        final_weight_g: 120,
        calories_kcal: 148.8,
        proteins_g: 10.56,
        carb_g: 32.53,
        fat_g: 0.82,
        meal_type_recommended_percentage_from: 27,
        meal_type_recommended_percentage_to: 36,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
    ],
  },
  {
    id: 5,
    meal_type_name: 'Evening snack',
    meal_type_image:
      'http://admin.fitaraise.com/storage/uploads/meal_type/1679938250.jpg',
    diet_list: [
      {
        id: 681,
        food_id: 16498,
        food_name: 'Bread Cheese Toasted',
        taken_weight: 25,
        quantity: 1,
        serving_desc: '1 medium or regular slice',
        final_weight_g: 25,
        calories_kcal: 112,
        proteins_g: 2.86,
        carb_g: 12.31,
        fat_g: 5.72,
        meal_type_recommended_percentage_from: 5,
        meal_type_recommended_percentage_to: 8,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 683,
        food_id: 12780,
        food_name: 'Peanut Butter (Smooth)',
        taken_weight: 16,
        quantity: 1,
        serving_desc: '1 tblsp',
        final_weight_g: 16,
        calories_kcal: 94.08,
        proteins_g: 3.51,
        carb_g: 3.84,
        fat_g: 7.93,
        meal_type_recommended_percentage_from: 5,
        meal_type_recommended_percentage_to: 8,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
    ],
  },
  {
    id: 6,
    meal_type_name: 'Dinner',
    meal_type_image:
      'http://admin.fitaraise.com/storage/uploads/meal_type/1679938309.jpg',
    diet_list: [
      {
        id: 684,
        food_id: 6191,
        food_name: 'Brown Rice',
        taken_weight: 100,
        quantity: 1,
        serving_desc: '1 cup',
        final_weight_g: 100,
        calories_kcal: 123,
        proteins_g: 2.74,
        carb_g: 25.58,
        fat_g: 0.97,
        meal_type_recommended_percentage_from: 27,
        meal_type_recommended_percentage_to: 36,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png',
      },
      {
        id: 685,
        food_id: 20484,
        food_name: 'vegetable Salad',
        taken_weight: 55,
        quantity: 1,
        serving_desc: '(1/2 cup)',
        final_weight_g: 55,
        calories_kcal: 38.45,
        proteins_g: 1.26,
        carb_g: 3.69,
        fat_g: 2.2,
        meal_type_recommended_percentage_from: 27,
        meal_type_recommended_percentage_to: 36,
        food_image:
          'http://admin.fitaraise.com/storage/uploads/foods/1680449414.jpg',
      },
    ],
  },
];

export default function UnlockDietPlan({navigation, route}) {
  const {dietPlan} = route.params;
  console.log(dietPlan, 'hello');

  const {assets, fonts, sizes, gradients, colors} = useTheme();

  const headerHeight = useHeaderHeight();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const initialLinesToShow = 2;
  const [showFullText, setShowFullText] = useState(false);
  const [showFullList, setShowFullList] = useState(false);

  const toggleFullList = () => {
    setShowFullList(!showFullList);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Image
          radius={0}
          resizeMode="cover"
          width={sizes.width}
          height={headerHeight}
          source={assets.header4}
        />
      ),
    });
  }, [assets.header4, navigation, sizes.width, headerHeight]);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);
  const dummyText = `This diet plan does not exclude any ingredients and is recommended if it’s your first time trying this kind of diet plan & foods, if you have any restrictions to any of the food items recommended by your physician then you should follow your physician. If you want to follow our diet plans then discuss with physician before starting.`;

  const toggleReadMore = () => {
    setShowFullText(!showFullText);
  };
  const renderItem = ({item}) => {
    const isNoImage =
      item.food_image ===
      'http://admin.fitaraise.com/storage/uploads/app_images/no_image.png';

    return <></>;
  };
  const [expandedMealTypeId, setExpandedMealTypeId] = useState(null);
  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: sizes.padding}}>
          <Block style={styles.container1}>
            <Block card marginHorizontal={10}>
              <Text
                numberOfLines={showFullText ? undefined : initialLinesToShow}
                align="auto"
                padding={10}>
                {dummyText}
              </Text>
              {!showFullText ? (
                <TouchableOpacity onPress={toggleReadMore}>
                  <Text primary align="right">
                    Read more
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={toggleReadMore}>
                  <Text color={'blue'} align="right">
                    Show less
                  </Text>
                </TouchableOpacity>
              )}
            </Block>
          </Block>

          {dietPlan.map((item) => (
            <Block
              key={item.id}
              card
              padding={0}
              marginTop={10}
              marginHorizontal={10}>
              <Image
                background
                padding={15}
                blurRadius={10}
                resizeMode="cover"
                source={require('../../assets/images/bgcard.jpg')}
                radius={sizes.cardRadius}>
                <Block
                  style={styles.container5}
                  paddingTop={15}
                  paddingBottom={15}>
                  <Block style={styles.breakfast}>
                    <Text bold paddingLeft={10} size={sizes.sm}>
                      {item.meal_type_name}
                    </Text>
                  </Block>
                  <Block style={styles.kalorie}>
                    <Text
                      paddingRight={10}
                      size={sizes.sm}
                      primary
                      semibold></Text>
                  </Block>
                </Block>
                {item.diet_list.slice(0, 2).map((foodItem) => (
                  <View key={foodItem.id}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 5,
                      }}>
                      {foodItem.food_image ===
                      'https://admin.fitaraise.com/storage/uploads/app_images/no_image.png' ? (
                        <>
                          <Block>
                            <Block paddingTop={5}>
                              <Block card row marginLeft={5} marginLeft={5}>
                                <View
                                  style={{
                                    width: sizes.xxl,
                                    height: sizes.xxl,
                                    backgroundColor: 'rgb(245,232,250)',
                                    borderRadius: sizes.s,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{fontSize: 50, color: '#fff'}}
                                    bold
                                    primary>
                                    {foodItem.food_name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>

                                <Block
                                  padding={sizes.s}
                                  justify="space-between">
                                  <Block
                                    row
                                    style={{justifyContent: 'space-around'}}>
                                    <Block paddingBottom={10} paddingLeft={10}>
                                      <Text p bold color={colors.primary}>
                                        {foodItem.food_name}
                                      </Text>
                                    </Block>
                                  </Block>

                                  <TouchableOpacity>
                                    <Block
                                      row
                                      paddingBottom={10}
                                      paddingLeft={10}>
                                      <Text
                                        p
                                        semibold
                                        marginRight={sizes.s}
                                        color={colors.secondary}>
                                        {foodItem.serving_desc}
                                      </Text>
                                    </Block>
                                  </TouchableOpacity>
                                </Block>
                              </Block>
                            </Block>
                          </Block>
                        </>
                      ) : (
                        <Block>
                          <Block paddingTop={5}>
                            <Block card row marginLeft={5} marginLeft={5}>
                              <View
                                style={{
                                  width: sizes.xxl,
                                  borderRadius: sizes.s,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={{uri: foodItem.food_image}}
                                  style={{
                                    width: sizes.xxl,
                                    height: sizes.xxl,
                                    marginRight: 0,
                                  }}
                                  radius={10}
                                />
                              </View>

                              <Block padding={sizes.s} justify="space-between">
                                <Block
                                  row
                                  style={{justifyContent: 'space-around'}}>
                                  <Block paddingBottom={10} paddingLeft={10}>
                                    <Text p bold color={colors.primary}>
                                      {foodItem.food_name}
                                    </Text>
                                  </Block>
                                </Block>

                                <TouchableOpacity>
                                  <Block
                                    row
                                    paddingBottom={10}
                                    paddingLeft={10}>
                                    <Text
                                      p
                                      semibold
                                      marginRight={sizes.s}
                                      color={colors.secondary}>
                                      {foodItem.serving_desc}
                                    </Text>
                                  </Block>
                                </TouchableOpacity>
                              </Block>
                            </Block>
                            <Block></Block>
                          </Block>
                        </Block>
                      )}

                      {/* <Text>{item.food_name}</Text> */}
                      {/* You can include more information about the food here */}
                    </View>
                  </View>
                ))}
                {!expandedMealTypeId && item.diet_list.length > 2 && (
                  <TouchableOpacity
                    onPress={() => setExpandedMealTypeId(item.id)}>
                    <Text
                      style={{color: 'blue', marginTop: 5}}
                      align="center"
                      bold
                      color={'green'}>
                      Show More Option
                    </Text>
                  </TouchableOpacity>
                )}
              </Image>
            </Block>
          ))}
        </ScrollView>
      </Block>
    </Block>
  );
}
const styles = StyleSheet.create({
  container3: {
    flex: 0,
    zIndex: 10,
  },
  backgroundAnimation: {
    height: 250,
    alignSelf: 'center',
    position: 'relative',
    // zIndex:-10,

    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    position: 'relative',
    marginTop: 40,
  },
  container1: {
    flex: 1,
    // backgroundColor: '#22faa0',

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
    flex: 1,
    // flexDirection: "row", // set elements horizontally, try column.
    padding: 30,
    justifyContent: 'center',
  },
  container2: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    padding: 30,
  },

  mainCardView: {
    // top:70,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 25,
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
    height: 20,
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
    alignSelf: 'center',
    minWidth: 60,
  },
  container5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5, // Add a bottom border with the desired thickness (you can adjust the value)
    borderBottomColor: 'gray', // Specify the color of the underline (you can change it to any color you want)
    paddingBottom: 10,
  },
  kalorie: {
    alignItems: 'flex-end',
  },
});

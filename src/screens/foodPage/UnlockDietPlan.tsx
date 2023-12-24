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
  const [expandedMealTypes, setExpandedMealTypes] = useState([]);
  const toggleExpanded = (mealTypeId) => {
    if (expandedMealTypes.includes(mealTypeId)) {
      // If the meal type is expanded, collapse it
      setExpandedMealTypes((prev) => prev.filter((id) => id !== mealTypeId));
    } else {
      // If the meal type is collapsed, expand it
      setExpandedMealTypes((prev) => [...prev, mealTypeId]);
    }
  };

  const toggleFullList = () => {
    setShowFullList(!showFullList);
  };

 
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
        
          >
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
              padding={15}
              marginTop={10}
              marginHorizontal={10}>
           
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
                {item.diet_list.map((foodItem, index) => (
                   <View key={foodItem.id}>
                   {expandedMealTypes.includes(item.id) || index < 2 ? (
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
                              <Block card row marginLeft={5} marginLeft={5} >
                                <Block flex={0} center
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
                                </Block>

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
                                        {foodItem.serving_desc} ({foodItem.final_weight_g}gm)
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
                                      {foodItem.serving_desc} ({foodItem.final_weight_g}gm)
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
                    </View>):null}
                  </View>
                ))}
                {item.diet_list.length > 2 && (
  <TouchableOpacity onPress={() => toggleExpanded(item.id)}>
    <Text style={{color: 'blue', marginTop: 5}} align="center" bold color={'green'}>
      {expandedMealTypes.includes(item.id) ? 'Show Less' : 'Show More'}
    </Text>
  </TouchableOpacity>
)}
             
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

/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {BASE_URL} from '@env';

import {Block, Image, Input, Text} from '../../components/';

import {Platform, TouchableOpacity, SectionList} from 'react-native';
import Axios from 'axios';
import {useTheme} from '../../hooks';
import {View} from 'react-native';
import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native';

const isAndroid = Platform.OS === 'android';

export default function PreviousDietDetails({data}) {
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [expandedItems, setExpandedItems] = useState([]); 
  if (!data) {
    return null; // Handle the case when data hasn't been fetched yet
  }

  return (
    <>
      <View>
        {data.diet_details.filter((mealType) => mealType.diet_list.length > 0).map((mealType) => (
          <>
            <Block
              radius={sizes.sm}
              shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
              marginTop={sizes.s}
              marginHorizontal={0}
              card
              color="#f5e8fa">
              <Block row align="center" key={mealType.meal_type_id}>
                <Block flex={0}>
                  <Image
                    source={require('../../assets/icons/breakfast.png')}
                    style={{
                      width: sizes.xl,
                      height: sizes.xl,
                    }}
                    marginLeft={sizes.s}
                  />
                </Block>
                <Block flex={3} style={{alignSelf: 'center'}}>
                  <TouchableOpacity>
                    <Text p black semibold center padding={10}>
                      {mealType.meal_type_name}
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
                <TouchableOpacity>
                  <Block flex={0} style={{alignSelf: 'center'}}>
                    <Image
                      radius={0}
                      width={25}
                      height={25}
                      color={'#9fa1a2'}
                      source={assets.plus}
                      transform={[{rotate: '360deg'}]}
                      margin={sizes.s}
                    />
                  </Block>
                </TouchableOpacity>
              </Block>
              <Block margin={0}>
                <Block style={styles.container} margin={0}>
                  {/* Header */}
                  <Block style={styles.row} flex={1}>
                    <Text style={styles.header2} size={12} bold></Text>
                    <Text style={styles.header} bold size={12}>
                      Protein
                    </Text>
                    <Text style={styles.header} bold size={12}>
                      Carbs
                    </Text>
                    <Text style={styles.header} bold size={12}>
                      Fat
                    </Text>
                    <Text style={styles.header} bold size={12}>
                      KCAL
                    </Text>
                    <Text style={styles.header}></Text>
                  </Block>

                  {/* Data Rows */}
                  <FlatList
                    data={mealType.diet_list}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item, index}) => (
                    
                      <View key={index} style={{flexDirection: 'row'}}>
                              <Text
                                style={styles.header2}
                                size={12}
                                bold
                                numberOfLines={
                                  expandedItems.includes(index) ? 0 : 1
                                }>
                                {item.food_name}
                              </Text>

                              <Text style={styles.header} semibold size={12}>
                                {item.protienes}
                              </Text>
                              <Text style={styles.header} semibold size={12}>
                                {item.carb}
                              </Text>
                              <Text style={styles.header} semibold size={12}>
                                {item.fat}
                              </Text>
                              <Text style={styles.header} semibold size={12}>
                                {item.calories}
                              </Text>
                         
                            </View>
                    )}
                  />
                </Block>
              </Block>
            </Block>
          </>
        ))}
        {/* <Text>Total Calories: {data.todays_total_calories}</Text>
      <Text>Customer Needed Calories: {data.customer_needed_calories}</Text> */}
      </View>
    </>
  );
}
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
    padding: 10,
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
    padding: 10,
  },
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
    alignSelf: 'center',
    minWidth: 60,
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

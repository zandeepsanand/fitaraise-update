/* eslint-disable prettier/prettier */
import React, {useRef, useState} from 'react';
import {BASE_URL} from '@env';

import {Block, Image, Input, Text, Button} from '../../components/';

import {Platform, TouchableOpacity, SectionList} from 'react-native';
import Axios from 'axios';
import {useData, useTheme} from '../../hooks';
import {DataTable} from 'react-native-paper';

import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native';
import * as Progress from 'react-native-progress';
import {Animated, Easing, View} from 'react-native';
import Lottie from 'lottie-react-native';
import { loop } from 'react-native-reanimated/lib/types/lib/reanimated2/animation/repeat';

const isAndroid = Platform.OS === 'android';

export default function PreviousDietDetails({data}) {
  const {assets, colors, fonts, gradients, sizes} = useTheme();
  const [expandedItems, setExpandedItems] = useState([]);
  if (!data) {
    return null; // Handle the case when data hasn't been fetched yet
  }
  const {
    water_tracker: {
      todays_consumed_water_count_glass,
      todays_consumed_water_count_ml,
      normal_water_count_ml,
      normal_water_count_glass,
    },
  } = data;

  const waterProgress = todays_consumed_water_count_ml / normal_water_count_ml;
  console.log(data.diet_details.length ,"length");
  

  return (
    <>
      <View>
        {data.diet_details.length > 1 ? (
          <>
            {data.diet_details
              .filter((mealType) => mealType.diet_list.length > 0)
              .map((mealType) => (
                <View key={mealType.meal_type_id}>
                  <Block
                    radius={sizes.sm}
                    shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                    marginTop={sizes.s}
                    marginHorizontal={0}
                    card
                    color="#f5e8fa">
                    <Block row align="center">
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

                    <Block flex={1} center>
                      <DataTable style={styles.container}>
                        <DataTable.Header style={styles.tableHeader}>
                          <DataTable.Cell style={{flex: 1.4}}></DataTable.Cell>
                          <DataTable.Cell style={{flex: 1.3}}>
                            Protien
                          </DataTable.Cell>
                          <DataTable.Cell style={{flex: 1.3}}>
                            Carb
                          </DataTable.Cell>
                          <DataTable.Cell>Fat</DataTable.Cell>
                          <DataTable.Cell>KCAL</DataTable.Cell>
                          <DataTable.Cell></DataTable.Cell>
                        </DataTable.Header>
                        <FlatList
                          data={mealType.diet_list}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={({item, index}) => (
                            <DataTable.Row key={index}>
                              <DataTable.Cell
                                style={{flex: 1.4}}
                                numberOfLines={
                                  expandedItems.includes(index) ? 0 : 1
                                }>
                                {item.food_name}
                              </DataTable.Cell>
                              <DataTable.Cell style={{flex: 1.3}}>
                                {item.protienes}
                              </DataTable.Cell>
                              <DataTable.Cell style={{flex: 1.3}}>
                                {item.carb}
                              </DataTable.Cell>
                              <DataTable.Cell>{item.fat}</DataTable.Cell>
                              <DataTable.Cell>{item.calories}</DataTable.Cell>
                              <DataTable.Cell
                                style={{
                                  alignSelf: 'center',
                                  justifyContent: 'flex-end',
                                }}>
                                {' '}
                                <TouchableOpacity
                                  onPress={() => {
                                    // handleDelete(index, 'breakfast');
                                    // handleDeleteApi(item);
                                  }}>
                                  <Image
                                    source={require('../../assets/icons/close1.png')}
                                    color={'#fa9579'}
                                    style={
                                      (styles.data,
                                      {
                                        width: 20,
                                        height: 20,
                                        alignContent: 'center',
                                      })
                                    }
                                    margin={sizes.s}
                                  />
                                </TouchableOpacity>
                              </DataTable.Cell>
                            </DataTable.Row>
                          )}
                        />
                      </DataTable>
                    </Block>
                  </Block>
                </View>
              ))}
          </>
        ) : (
          <Block flex={1}>
            
            <Lottie
                   style={styles.backgroundAnimation}
                    source={require('../../assets/json/notfound.json')}
                   autoPlay
                  />
                  <Text center>No records found</Text>
          </Block>
        )}

        <Block flex={0} style={{paddingTop: 20}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.green}
            blurRadius={10}>
            <Block flex={0}>
              <Text h5 center white>
                Water Tracker
              </Text>
              <Text p center white>
                Target {normal_water_count_ml} ml
              </Text>

              <Block
                row
                style={{justifyContent: 'space-between', paddingTop: 20}}>
                <Block
                  flex={1.8}
                  width={160}
                  height={80}
                  card
                  center
                  marginTop={30}>
                  <Block center flex={0} marginBottom={10} marginRight={20}>
                    <Lottie
                      width={44}
                      height={54}
                      source={require('../../assets/json/water.json')}
                      autoPlay
                      duration={10}
                    />
                  </Block>
                  <Block flex={0} marginLeft={30}>
                    <Text center info h5 bold>
                      {todays_consumed_water_count_ml}
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
                      source={require('../../assets/icons/glass.png')}
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
                        disabled>
                        <Text bold white p>
                          -
                        </Text>
                      </Button>
                    </Block>
                    <Block flex={0}>
                      <Button info marginLeft={5} disabled>
                        <Text bold white>
                          {' '}
                          +{' '}
                        </Text>
                      </Button>
                    </Block>
                  </Block>
                </Block>
                <Block flex={1} center>
                  <Block
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
                  </Block>
                </Block>
              </Block>
            </Block>
          </Image>
        </Block>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  backgroundAnimation:{
    flex: 1,
    // backgroundColor: '#22faa0',
    height:200,
    alignItems:'center',
    alignSelf:'center'
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

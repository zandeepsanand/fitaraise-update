/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RadioButton} from 'react-native-paper';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';
import axios from 'axios';
import {BASE_URL} from '@env';


export default function GainWeight({navigation, route}) {
  const {formData} = route.params;
  console.log(formData , "checking");

  const {assets, sizes} = useTheme();

  const headerHeight = useHeaderHeight();
  const [showModal, setModal] = useState(false);
  const [quantity, setQuantity] = useState('01');
  const [checked, setChecked] = React.useState('');
  const [weeklyGoal, setWeeklyGoal] = React.useState('');
  const [gainDatas , setGainDatas] = React.useState([]);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerBackground: () => (
  //       <Image
  //         radius={0}
  //         resizeMode="cover"
  //         width={sizes.width}
  //         height={headerHeight}
  //         source={assets.header3}
  //       />
  //     ),
  //   });
  // }, [assets.header3, navigation, sizes.width, headerHeight]);
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {

    axios.get(`${BASE_URL}get_weekly_goal/${ formData.weight_want_to }`)
    .then(response => {
      console.log(response.data.data);
      // Handle response from server
      setGainDatas(response.data.data );
      // console.log(customerId);
      
      // const updatedFormData = {
      //   ...formData,
      //   customer_id: customerId,
      //   mobile_number:phoneNumber,
      // };
      // navigation.setParams({formData: updatedFormData});
      // navigation.navigate('OtpPage' , {phoneNumber  , data: JSON.stringify(response ) ,formData:updatedFormData  } );
    
    })
    .catch(error => {
      console.log(error);
      // Handle error from server
    });
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

   


  }, [formData.weight_want_to]);
  const handleWeeklyGoalSelect = (option) => {
    const updatedFormData = {
      ...formData,
      weekly_goal: option,
    };
    setWeeklyGoal(option);
    navigation.setParams({formData: updatedFormData});
    // navigation.navigate('Demo1', {formData: updatedFormData});
  };
  function checkPage() {
    if (formData.weekly_goal) {
      console.log(formData);
      // axios.post(`${BASE_URL}set_personal_datas`, formData)
      //   .then(response => {
      //     console.log(response.data);
      //     // navigation.navigate('goal', {formData});
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });
      navigation.navigate('Demo1', {formData})
    } else {
      alert('Please select one option');
    }
  }
  return (
    <Block safe>
      <Block  style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
        },
      ]}
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block paddingHorizontal={sizes.padding} style={styles.container1}>
          <Block marginTop={sizes.m}>
            <Text h4>What is your weekly goal</Text>
            <Block marginTop={sizes.sm}>
            {gainDatas.map((item, index) => (
              <>
        {/* <View key={index}>
          <RadioButton.Item
            label={item.goal}
            value={item.id}
            status={checked === item.id ? 'checked' : 'unchecked'}
            onPress={() => {setChecked(item.id);handleWeeklyGoalSelect(item.id)}}
          />
        </View> */}
         <Block row justify="space-between" marginBottom={sizes.base}>
         <Block flex={0}>
         <RadioButton.Item
            label={''}
            value={item.id}
            status={checked === item.id ? 'checked' : 'unchecked'}
            onPress={() => {setChecked(item.id);handleWeeklyGoalSelect(item.id)}}
          />
           {/* <RadioButton
             value="first"
             status={checked === 'first' ? 'checked' : 'unchecked'}
             onPress={() => {setChecked('first'); handleWeeklyGoalSelect('1')}}
           /> */}
         </Block>

         <Block flex={1}>
           <Text p semibold marginTop={sizes.s}>
             {item.goal}
           </Text>

           {item.is_recommended === 1 && (
            <Text p marginTop={sizes.s}>
              (Recommended)
            </Text>
          )}
         </Block>
       </Block>
       </>
      ))}
      </Block>

            {/* <Block marginTop={sizes.sm}>
              <Block row justify="space-between" marginBottom={sizes.base}>
                <Block flex={0}>
                  <RadioButton
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => {setChecked('first'); handleWeeklyGoalSelect('1')}}
                  />
                </Block>

                <Block flex={1}>
                  <Text p semibold marginTop={sizes.s}>
                    Gain 0.25 kg per week
                  </Text>
                </Block>
              </Block>
              <Block row justify="space-between" marginBottom={sizes.base}>
                <Block flex={0}>
                  <RadioButton
                    value="second"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => {setChecked('second'); handleWeeklyGoalSelect('1')}}
                  />
                </Block>

                <Block flex={1}>
                  <Text p semibold marginTop={sizes.s}>
                    Gain 0.5 kg per week
                  </Text>
                  <Text p marginTop={sizes.s}>
                    (Recommended)
                  </Text>
                </Block>
              </Block>
              <Block row justify="space-between" marginBottom={sizes.base}>
                <Block flex={0}>
                  <RadioButton
                    value="third"
                    status={checked === 'third' ? 'checked' : 'unchecked'}
                    onPress={() => {setChecked('third'); handleWeeklyGoalSelect('1')}}
                  />
                </Block>

                <Block flex={1}>
                  <Text p semibold marginTop={sizes.s}>
                    Gain 0.75 kg per week
                  </Text>
                </Block>
              </Block>

              <Block
                row
                justify="space-between"
                marginBottom={sizes.base}
                flex={1}>
                <Block row justify="space-between" marginBottom={sizes.base}>
                  <Block flex={0}>
                    <RadioButton
                      value="fourth"
                      status={checked === 'fourth' ? 'checked' : 'unchecked'}
                      onPress={() => {setChecked('fourth'); handleWeeklyGoalSelect('1')}}
                    />
                  </Block>

                  <Block flex={1}>
                    <Text p semibold marginTop={sizes.s}>
                      Gain 1 kg per week
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block> */}
          </Block>
        
         
        </Block>
        <Block style={styles.container3}>
        <Lottie
                   style={styles.backgroundAnimation}
                    marginBottom={sizes.sm}
                    source={require('../assets/json/think.json')}
                    progress={animationProgress.current}
                  />
        </Block>
      
       

       
      </Block>
      <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 30,
            paddingRight:10
          }}>

          <TouchableOpacity  onPress={() => checkPage()}>
          <Image
            source={assets.Button}
         
          />
          </TouchableOpacity>
        </View>
    </Block>
  );
}
const styles = StyleSheet.create({
  backgroundAnimation: {
    position: 'relative',
    zIndex:-10,
    // top: 170,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container1: {
    flex: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  
  },
  container: {
    flex: 1,
    paddingLeft: 30,
  },
 container3:{
flex:2,

zIndex:10,

 },


  img: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {backgroundColor: '', flexDirection: 'row', flex: 1},
  cover: {padding: 30, width: '50%', height: '10%'},
  text: {padding: 30},
  
  container2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    padding: 30,
    
  },

  mainCardBlock: {
    // top:70,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27f29c',
    borderRadius: 35,
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
  subCardBlock: {
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
});

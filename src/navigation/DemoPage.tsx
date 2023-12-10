/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import React, { useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';

import { useData, useTheme, useTranslation } from '../hooks/';
import { Block, Button, Image, Input, Product, Text } from '../components/';

import { StyleSheet,View,SafeAreaView, Platform, TouchableOpacity, TouchableHighlight} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useHeaderHeight } from '@react-navigation/stack';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';

export default function DemoPage({navigation, route}) {
  const {formData} = route.params;
  const { assets, fonts, sizes, gradients, colors } = useTheme();
  const [tab, setTab] = useState<number>(0);
  const headerHeight = useHeaderHeight();
 

  // const [isVegetarian, setIsVegetarian] = useState(false);
  const [ isVegetarian, setIsVegetarian] = useState(
    formData.isVegetarian || null,)
   
  // const [formData, setFormData] = useState({
  //   first_name: '',
  //   last_name: '',
  //   email: '',
  //   mobile_number: '',
  //   height: '',
  //   height_unit: '',
  //   weight: '',
  //   weight_unit: '',
    
  //   acitivity_level: '',
  //   weekly_goal: '',
  //   age: '',
  //   dob: '',
  //   gender: '',
  //   device_token: '',
  //   image: '',
  
  // });

  // useEffect(() => {
    
    
  //   if (isVegetarian !== null) {
  //     setFormData({
  //       ...formData,
  //       is_vegitarian: isVegetarian ? 'Yes' : 'No',
  //     });
  //     // console.log(formData);
     
  //   }
  // }, [isVegetarian]);
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerBackground: () => (
  //       <Image
  //         radius={0}
  //         resizeMode="cover"
  //         width={sizes.width}
  //         height={headerHeight}
  //         source={assets.header4}
  //       />

  //     ),
  //   });
  // }, [assets.header4, navigation, sizes.width, headerHeight]);




  const handleOptionSelect = (option) => {
    const updatedFormData = {
      ...formData,
      is_vegetarian: option,
    };
    setIsVegetarian(option);
    navigation.setParams({formData: updatedFormData});
    navigation.navigate('dietcalculation', {formData: updatedFormData});
  };
 
 
  return (
    <Block>
      <Block style={styles.container} >
        <TouchableOpacity
          
          onPress={() => {
            handleOptionSelect('1');
          }}
        >
          <Block style={styles.mainCardView}
            flex={0}
            radius={46}
            color={'white'}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.subCardView} >
                
               
                 <Lottie
          style={{
            borderRadius: 0,
            height: 200,
            width: 240,
          }}
        marginBottom={sizes.sm}
        source={require('../assets/json/veg.json')}
        progress={animationProgress.current}
      />
              </View>
              <Block style={{ marginLeft: 42 }}>
                <Text
                  p font={fonts.semibold}
                >
                 Vegetarian
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 0,
                    width: "85%",
                  }}
                >

                </View>
              </Block>
            </View>

          </Block>
        </TouchableOpacity>
        <TouchableOpacity
      
    
      onPress={() => {
        handleOptionSelect('0');
      }}
        >
          <Block style={styles.mainCardView}
            flex={0}
            radius={46}
            color={'white'}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.subCardView}>
              <Lottie
          style={{
            borderRadius: 0,
            height: 100,
            width: 240,
          }}
        marginBottom={sizes.sm}
        source={require('../assets/json/nonveg.json')}
        progress={animationProgress.current}
      />
              </View>
              <View style={{ marginLeft: 42 }}>
                <Text
                  p font={fonts.semibold}
                >
                  Non Vegetarian
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 0,
                    width: "85%",
                  }}
                >

                </View>
              </View>
            </View>
          </Block>
        </TouchableOpacity>
       

      </Block>
      <Lottie
        style={{position:'relative'}}
        marginBottom={sizes.sm}
        source={require('../assets/json/food.json')}
        loop
        autoPlay
      />
    <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 30,
            paddingRight:10
          }}>

          {/* <TouchableOpacity  >
          <Image
            source={assets.Button}
         
          />
          </TouchableOpacity> */}
        </View>
    </Block>
  )



}


const styles = StyleSheet.create({
  backgroundAnimation: {
    position: 'absolute',
    zIndex: -10,
    top: 170,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container1: {
    flex: 1,
    backgroundColor: "#22faa0",

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  img: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: { backgroundColor: "", flexDirection: "row", flex: 1 },
  cover: { padding: 30, width: "50%", height: "10%" },
  text: { padding: 30 },
  container: {
    flex: 2,
    // flexDirection: "row", // set elements horizontally, try column.
    padding: 30,
    justifyContent: 'center'

  },
  container2: {
    flex: 2,
    justifyContent: 'flex-end',
    alignContent: 'flex-end', alignSelf: 'flex-end', padding: 30
  },

  mainCardView: {
    // top:70,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27f29c",
    
    borderRadius: 35,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "transparent",
    // borderColor: "green",
    // borderWidth: 1,
    // borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },
});

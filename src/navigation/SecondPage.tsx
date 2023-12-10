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
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {Animated, Easing} from 'react-native';
import Lottie from 'lottie-react-native';

import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
  TouchableHighlight,
  
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';
// const formData = {
    
//   acitivity_level: 'sedentary',
//   age: '29',
//   customer_id: '14',
//   device_token: '',
//   dob: '',
//   email: 'saasaee@gmail.com',
//   first_name: 'vijay',
//   gender: 'male',
//   height: '178',
//   height_unit: 'cm',
//   image: '',
//   is_vegetarian: '1',
//   last_name: '',
//   mobile_number: '8606786699',
//   weekly_goal: '',
//   weight: '65',
//   weight_unit: 'kg',
//   weight_want_to: '',
// };

export default function SecondPage({navigation, route}) {
  const { formData } = route.params ?? {};
  
  console.log(formData ,"formData");
  const [weightWantTo, setSelectedOption] = useState('');
  const {assets, fonts, sizes, gradients, colors} = useTheme();

  const headerHeight = useHeaderHeight();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);

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
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);


  const handleOptionSelect = (option) => {
    const updatedFormData = {
      ...formData,
      weight_want_to: option,
    };
    setSelectedOption(option);
    navigation.setParams({formData: updatedFormData});
    if(option === 'gain'){
      navigation.navigate('gainweight', {formData : updatedFormData});
    } else if (option === 'lose'){
      navigation.navigate('gainweight', {formData : updatedFormData});
    } else {
      navigation.navigate('Demo1', {formData: updatedFormData});
    }
    
    // navigation.navigate('Demo1', {formData: updatedFormData});
  };
  const navigateToNextScreen = () => {
    // navigation.navigate('Ageandheight', {formData});
    // console.log(formData);
  };

  return (
    <Block safe>
    <Block  
      scroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingVertical: sizes.padding}}>
      <Block paddingHorizontal={sizes.padding} style={styles.container1}>
      <TouchableWithoutFeedback
          onPress={() => {
            {handleOptionSelect('lose'); };
          }}>
          <Block
            style={styles.mainCardView}
            flex={0}
            // radius={46}
            gradient={gradients?.[tab === 2 ? 'success' : '#fffff']}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.subCardView}>
                <Image
                  source={require('../assets/icons/lose-weight.png')}

                  resizeMode="contain"
                  style={{
                    height: 40,
                    width: 40,
                  }}
                />
              </View>
              <Block style={{marginLeft: 42}}>
                <Text p font={fonts.semibold}>
                  {'LOSE WEIGHT'}
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 0,
                    width: '85%',
                  }}></View>
              </Block>
            </View>
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
           { handleOptionSelect('gain'); };
          }}>
          <Block
            style={styles.mainCardView}
            flex={0}
            // radius={46}
            gradient={gradients?.[tab === 3 ? 'success' : '#fffff']}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.subCardView}>
                <Image
                  source={assets.fitness2}
                  resizeMode="contain"
                  style={{
                    borderRadius: 0,
                    height: 50,
                    width: 50,
                  }}
                />
              </View>
              <View style={{marginLeft: 42}}>
                <Text p font={fonts.semibold}>
                  {'GAIN WEIGHT'}
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 0,
                    width: '85%',
                  }}></View>
              </View>
            </View>
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            {handleOptionSelect('maintain');};
          }}>
          <Block
            style={styles.mainCardView}
            flex={0}
            // radius={46}
            gradient={gradients?.[tab === 4 ? 'success' : '#fffff']}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.subCardView}>
                <Image
                  // source={require('../../../assets/salad.png')}
                  source={assets.salad}
                  resizeMode="contain"
                  style={{
                    borderRadius: 0,
                    height: 50,
                    width: 50,
                  }}
                />
              </View>
              <View style={{marginLeft: 42}}>
                <Text p font={fonts.semibold}>
                  {'MAINTAIN WEIGHT'}
                </Text>
            
              </View>
            </View>
          </Block>
        </TouchableWithoutFeedback>

       
      </Block>
      <Block style={styles.container3}>
      <Lottie
                 style={styles.backgroundAnimation}
                  marginBottom={sizes.sm}
                  source={require('../assets/json/yoga.json')}
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

          <TouchableWithoutFeedback >
          <Image
            source={assets.Button}
         
          />
          </TouchableWithoutFeedback>
        </View>
    
  </Block>
  );
}
const styles = StyleSheet.create({
  container3:{
    flex:0,
    zIndex:10,
     },
  backgroundAnimation: {
    height:250,
    alignSelf:'center',
    position: 'relative',
    // zIndex:-10,

    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container:{
    position:'relative',
    marginTop:40
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
   position:'absolute',
   bottom:0,
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
});

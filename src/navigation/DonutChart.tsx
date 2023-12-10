/* eslint-disable prettier/prettier */
import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View , Animated} from 'react-native';
import {Block, Image }from '../components';
import CircularProgress from 'react-native-circular-progress-indicator';
import {Circle, G , Text} from 'react-native-svg';
import {PieChart} from 'react-native-svg-charts';
import {BASE_URL} from '@env';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Easing} from 'react-native';
import Lottie from 'lottie-react-native';


const totalCalories = 2000;

// const formData = {
//   customer_id:10,
//   first_name: 'sandeep',
//   last_name: 's anand',
//   email: 'sandeep666@gmail.com',
//   mobile_number: '7859623499',
//   height: '178',
//   height_unit: 'cm',
//   weight: '78',
//   weight_unit: 'kg',
//   acitivity_level: 'sedentary',
//   weekly_goal: '1',
//   is_vegetarian:'1',
//   age: '50',
//   dob: '',
//   gender: '1',
//   device_token: '',
//   image: '',
 
//   weight_want_to:'lose',
  
// };




const Labels = ({slices}) => {
  return slices.map((slice, index) => {
    const {labelCentroid, pieCentroid, data} = slice;
    return (
      <G key={index}>
        <Text
          x={labelCentroid[0]}
          y={labelCentroid[1]}
          fill={'white'}
          textAnchor={'middle'}
          alignmentBaseline={'middle'}
          fontSize={15}
          fontWeight={'bold'}>
          {`${data.value}%`}
        </Text>
      </G>
    );
  });
};
const AnimationPage1 = ({navigation , route })=>{
  const {data} = route.params;
  console.log(data);

 
  useEffect(() => {
    // Start the animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
 

    // Wait for 2 seconds before showing the next page
    const timeout = setTimeout(() => {
      // Navigate to the next page
      navigation.navigate('Progress', {data});
    }, 5000);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

    return(
    <>
    
    
    </>)
  
}




const DonutChart1 = ({navigation, route}) => {
  const [animation] = useState(new Animated.Value(0));
  const {data} = route.params;
  console.log(data);
  useEffect(() => {
    // Start the animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
 

    // Wait for 2 seconds before showing the next page
    const timeout = setTimeout(() => {
      // Navigate to the next page
      navigation.navigate('Progress', {data});
    }, 100);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
     {data ? (
       <Block  center style={{alignItems: 'center'}}>
       <Animated.View
        style={{
          opacity: animation,
        }}
      >
        
        <PieChart
         style={{height: 200, width: 200}}
         valueAccessor={({item}) => item.value}
         data={[
           {
             key: 'protein',
             value: data.protien_percent.replace('%', ''),
             svg: {fill: '#F46655'},
           },
           {
             key: 'carbs',
             value: data.carb_percent.replace('%', ''),
             svg: {fill: '#4CAF50'},
           },
           {
             key: 'fat',
             value: data.fat_percent.replace('%', ''),
             svg: {fill: '#2196F3' },
           },
         ]}
         
         spacing={0}
         outerRadius={'95%'}
         innerRadius={'60%'}>
         <Labels />
       </PieChart>
      
      </Animated.View>
   
 
       
     </Block>
    ) : (
      <Text>Loading data...</Text>
    )}
    </>
   
   
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
  container3:{
    flex:1,
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
  }
});
export default DonutChart1;


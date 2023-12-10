/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import {Animated, Easing, TouchableWithoutFeedback} from 'react-native';


export default function Loader(){
    const animationProgress = useRef(new Animated.Value(0));
    useEffect(() => {
      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }, []);

    return (
        <View style={styles.container}>
         <Lottie
                      
                         
                          source={require('../../../assets/json/loader.json')}
                          progress={animationProgress.current}
                          autoPlay
                        />
        </View>
      );

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});




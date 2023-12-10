/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native';
import TypingText from 'react-native-typing-text';

import * as SplashScreen from 'expo-splash-screen';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import { useNavigation } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function TypingScreen({
    route: {
        params: { formData}
    },
  }
) {
    const navigation = useNavigation();
    useEffect(() => {
        const timer = setTimeout(() => {
          navigation.navigate('Frstpage' , {formData}); // replace 'NextPage' with your next page's name
        }, 3000); // 3000 milliseconds = 3 seconds
    
        return () => clearTimeout(timer);
      }, []);


  return (
   <Block>
   <Block style = { styles.container }>
             
   <Text bold  font='Pacifico' size={50} color={'black'} style={{  paddingTop: 46 }}>
                   Welcome 
                </Text>
                <TypingText  font='Pacifico'
                      text={formData.first_name}
                      // text="Sandeep S Anand"
                 />
                
                
            </Block>
   </Block>
  )
}
const styles = StyleSheet.create(
{
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0,
        fontFamily:'Pacifico',
        
    }
});
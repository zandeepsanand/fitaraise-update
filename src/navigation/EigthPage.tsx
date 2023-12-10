/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import {useScreenOptions, useTranslation} from '../hooks';
import DietPlan from '../screens/DietPlan';
import MealContextProvider from '../hooks/useMeal';
import Components from './FourthPage';
const Stack = createStackNavigator();
 export default function EigthPage(this: any) {
  const {t} = useTranslation();
 
const screenOptions = useScreenOptions();
   return (
    <>
    <MealContextProvider>

    
   <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="DietPlan"
        component={DietPlan}
        options={{title: t('navigation.dietplan') , headerTitleAlign:'center'}}
      />
{/* 
      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      /> */}

      {/* <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      /> */}
        {/* <Stack.Screen
        name="Articles"
        component={SecondPage}
        options={{title: t('navigation.articles')}}
      /> */}


      {/* <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
    </MealContextProvider>
    
         </>
   );
   
 }

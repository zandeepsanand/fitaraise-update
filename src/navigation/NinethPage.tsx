/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useScreenOptions, useTranslation} from '../hooks';

import DietPlanDynamic from '../screens/DietPlanDynamic';
import DietPlanData from '../screens/DietPlanData';
import DietPlan from '../screens/DietPlan';
import MealContextProvider from '../hooks/useMeal';
const Stack = createStackNavigator();
export default function NinethPage(this: any) {
  const {t} = useTranslation();

  const screenOptions = useScreenOptions();

  return (
    <>
      <MealContextProvider>
        <Stack.Navigator screenOptions={screenOptions.stack}>
          <Stack.Screen
            name="pie"
            component={DietPlan}
            options={{title: 'Todays', headerTitleAlign: 'left'}}
          />
          <Stack.Screen
            name="searchfood"
            component={DietPlanDynamic}
            options={{
              title: t('navigation.breakfast'),
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="searchfoodData"
            component={DietPlanData}
            options={{title: 'Nutriotion', headerTitleAlign: 'left'}}
          />
        </Stack.Navigator>
      </MealContextProvider>
    </>
  );
}

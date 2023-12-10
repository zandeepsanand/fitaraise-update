/* eslint-disable prettier/prettier */
import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
// Import your DietPlan component
import LoginContext from '../../hooks/LoginContext';
import { MealContext } from '../../hooks/useMeal';
import DietPlan from '../DietPlan';
// import DietPlan from '../DietPlan';

function YourComponent() {
  const { authenticated} = useContext(LoginContext);
  const {isLoading , breakfastItems} = useContext(MealContext)

  // Check if the user is authenticated and data is loaded
  const shouldRenderDietPlan = authenticated && !isLoading ;

  return (
    <View>
      {shouldRenderDietPlan ? (
        <DietPlan/>
      ) : (
        // Display a loading indicator or a message while loading
        isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          // Display a message indicating that the user is not authenticated or there's no data
          <Text>You are not authenticated or there's no data available.</Text>
        )
      )}
    </View>
  );
}

export default YourComponent;

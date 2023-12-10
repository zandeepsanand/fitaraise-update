/* eslint-disable prettier/prettier */
import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import {BASE_URL} from '@env';
import api from '../../api';
import LoginContext from './LoginContext';
import {Alert} from 'react-native';

interface FoodItem {
  name: string;
  calories: number;
}

interface MealContextType {
  breakfastItems: any[];
  morningSnackItems: any[];
  lunchItems: any[];
  eveningSnackItems: any[];
  dinnerItems: any[];
  mealItems1: any[];
  mealItems2: any[];
  water: any[];
  addBreakfastItem: (food: any) => void;
  addMorningSnackItem: (food: any) => void;
  addEveningSnackItem: (food: any) => void;
  addLunchItem: (food: any) => void;
  addDinnerItem: (food: any) => void;
  addMealItem1: (food: any) => void;
  addMealItem2: (food: any) => void;
  addWater: (plus: any) => void;
  deleteItem: (items: any[], mealType: string) => void;
  clearContextData: () => void;
  totalCalories: number;
  isLoading: boolean;
  updateBreakfastItem: (id: number, updatedDetails: any) => void;
}

export const MealContext = createContext<MealContextType>({
  breakfastItems: [],
  morningSnackItems: [],
  lunchItems: [],
  eveningSnackItems: [],
  dinnerItems: [],
  mealItems1: [],
  mealItems2: [],
  water: [],
  addBreakfastItem: () => {},
  addMorningSnackItem: () => {},
  addEveningSnackItem: () => {},
  addLunchItem: () => {},
  addDinnerItem: () => {},
  addMealItem1: () => {},
  addMealItem2: () => {},
  addWater: () => {},
  deleteItem: () => {},
  clearContextData: () => {},
  isLoading: false,
  totalCalories: 0,
  updateBreakfastItem: (id: number, updatedDetails: any) => {},
});

const MealContextProvider: React.FC = ({children}) => {
  const {authenticated, customerId} = useContext(LoginContext);

  const [breakfastItems, setBreakfastItems] = useState<any[]>([]);
  const [morningSnackItems, setMorningSnackItems] = useState<any[]>([]);
  const [lunchItems, setLunchItems] = useState<any[]>([]);
  const [eveningSnackItems, setEveningSnackItems] = useState<any[]>([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [mealItems1, setMealItems1] = useState<any[]>([]);
  const [mealItems2, setMealItems2] = useState<any[]>([]);
  const [water, setWater] = useState<any[]>(null);
  console.log('====================================');
  console.log(water, 'usemeal data');
  console.log('====================================');
  const [transformedData, setTransformedData] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchDataFlag, setFetchDataFlag] = useState(true);
  // const [customerId, setCustomerId] = useState('');

  console.log(authenticated, 'loged in or not');

  console.log(customerId, 'useMeal customer id ');

  // console.log(transformedData, 'log dinner ');

  // Mapping function to transform API data into the desired format
  function mapApiDataToDesiredFormat(apiResponse) {
    const dietDetails = apiResponse.data.diet_details;
    const waterData = apiResponse.data.water_tracker;

    const dinnerData = dietDetails.find((meal) => meal.meal_type_id === 6);
    const breakfastData = dietDetails.find((meal) => meal.meal_type_id === 1);
    const morningSnackData = dietDetails.find(
      (meal) => meal.meal_type_id === 3,
    );
    const eveningSnackData = dietDetails.find(
      (meal) => meal.meal_type_id === 5,
    );
    const lunchData = dietDetails.find((meal) => meal.meal_type_id === 4);
    const meal1Data = dietDetails.find((meal) => meal.meal_type_id === 7);
    const meal2Data = dietDetails.find((meal) => meal.meal_type_id === 8);

    const result = {};

    if (breakfastData) {
      const mappedBreakfastData = breakfastData.diet_list.map((item) => {
        return {
          added_by: null,
          cal_weight_200: item.calories, // Map calories from the item
          calcium_in_mg: item.calcium,
          calories: item.calories,
          carb_in_g: item.carb,
          cholestrol_in_mg: item.cholestrol,
          details: {
            id: item.id,
            selectedWeight: item.taken_weight,
            multiplication: item.quantity,
            quantity: item.quantity,
            taken_weight: item.final_weight,
            totalCalorie: item.calories,
            totalCarb: item.carb,
            totalCholesterol: item.cholestrol,
            totalFat: item.fat,
            totalFiber: item.fiber,
            totalIron: item.iron,
            totalMonounsaturatedFat: item.monounsaturated_fat,
            totalPolyunsaturatedFat: item.polyunsaturated_fat,
            totalPotassium: item.potassium,
            totalProtein: item.protienes,
            totalSodium: item.sodium,
            totalTransFat: item.trans_fat,
            totalVitaminARAE: item.vitamin_a_rae,
            totalVitaminC: item.vitamin_c,
            totalVitaminD: item.vitamin_d,
            selectedDropDown: item.serving_description,
            totalCalcium: item.calcium,
            totalSaturatedFat: item.saturated_fat,
            totalSugar: item.sugar,
            totalVitaminAIU: item.vitamin_a,
          },
          fat_in_g: item.fat,
          fiber_in_g: item.fiber,
          food_name: item.food_name,
          id: item.food_id,
          image: item.food_image,
          iron_in_mg: item.iron,
          monounsaturated_fat_in_g: item.monounsaturated_fat,
          polyunsaturated_fat_in_g: item.polyunsaturated_fat,
          serving_desc_1: '1 oz', // You can choose an appropriate serving description
          serving_desc_2: '1 piece', // You can choose an appropriate serving description
          serving_desc_3: '3 Piece', // You can choose an appropriate serving description          // ... Map other properties similarly
          protein_in_g: item.protienes,
          potassium_in_mg: item.potassium,
          serving_desc_4: null,
          serving_desc_5: null,
          serving_desc_6: null,
          serving_desc_7: null,
          serving_desc_8: null,
          serving_desc_9: null,
          serving_size: item.taken_weight,
          serving_description_id: item.serving_description_id,
          serving_weight_1: 28,
          serving_weight_2: 50,
          serving_weight_3: 180,
          serving_weight_4: null,
          serving_weight_5: null,
          serving_weight_6: null,
          serving_weight_7: null,
          serving_weight_8: null,
          serving_weight_9: null,
          sodium_in_mg: item.sodium,
          sugar_in_g: item.sugar,
          trans_fat_in_g: item.trans_fat,
          vitamin_a_in_mg: item.vitamin_a,
          vitamin_a_iu: item.vitamin_a,
          vitamin_a_rae_mg: item.vitamin_a_rae,
          vitamin_c_in_mg: item.vitamin_c,
          vitamin_d_mg: item.vitamin_d,
          weight_in_g: item.taken_weight,
        };
      });
      result.breakfastItems = mappedBreakfastData;
    }
    if (morningSnackData) {
      const mappedMorningSnackData = morningSnackData.diet_list.map((item) => {
        return {
          added_by: null,
          cal_weight_200: item.calories, // Map calories from the item
          calcium_in_mg: item.calcium,
          calories: item.calories,
          carb_in_g: item.carb,
          cholestrol_in_mg: item.cholestrol,
          details: {
            id: item.id,
            selectedWeight: item.taken_weight,
            multiplication: item.quantity,
            quantity: item.quantity,
            taken_weight: item.final_weight,
            totalCalorie: item.calories,
            totalCarb: item.carb,
            totalCholesterol: item.cholestrol,
            totalFat: item.fat,
            totalFiber: item.fiber,
            totalIron: item.iron,
            totalMonounsaturatedFat: item.monounsaturated_fat,
            totalPolyunsaturatedFat: item.polyunsaturated_fat,
            totalPotassium: item.potassium,
            totalProtein: item.protienes,
            totalSodium: item.sodium,
            totalTransFat: item.trans_fat,
            totalVitaminARAE: item.vitamin_a_rae,
            totalVitaminC: item.vitamin_c,
            totalVitaminD: item.vitamin_d,
            selectedDropDown: item.serving_description,
            totalCalcium: item.calcium,
            totalSaturatedFat: item.saturated_fat,
            totalSugar: item.sugar,
            totalVitaminAIU: item.vitamin_a,
          },
          fat_in_g: item.fat,
          fiber_in_g: item.fiber,
          food_name: item.food_name,
          id: item.food_id,
          image: item.food_image,
          iron_in_mg: item.iron,
          monounsaturated_fat_in_g: item.monounsaturated_fat,
          polyunsaturated_fat_in_g: item.polyunsaturated_fat,
          serving_desc_1: '1 oz', // You can choose an appropriate serving description
          serving_desc_2: '1 piece', // You can choose an appropriate serving description
          serving_desc_3: '3 Piece', // You can choose an appropriate serving description          // ... Map other properties similarly
          protein_in_g: item.protienes,
          potassium_in_mg: item.potassium,
          serving_desc_4: null,
          serving_desc_5: null,
          serving_desc_6: null,
          serving_desc_7: null,
          serving_desc_8: null,
          serving_desc_9: null,
          serving_size: item.taken_weight,
          serving_description_id: item.serving_description_id,
          serving_weight_1: 28,
          serving_weight_2: 50,
          serving_weight_3: 180,
          serving_weight_4: null,
          serving_weight_5: null,
          serving_weight_6: null,
          serving_weight_7: null,
          serving_weight_8: null,
          serving_weight_9: null,
          sodium_in_mg: item.sodium,
          sugar_in_g: item.sugar,
          trans_fat_in_g: item.trans_fat,
          vitamin_a_in_mg: item.vitamin_a,
          vitamin_a_iu: item.vitamin_a,
          vitamin_a_rae_mg: item.vitamin_a_rae,
          vitamin_c_in_mg: item.vitamin_c,
          vitamin_d_mg: item.vitamin_d,
          weight_in_g: item.taken_weight,
        };
      });
      result.morningSnackItems = mappedMorningSnackData;
    }
    if (eveningSnackData) {
      const mappedEveningSnackData = eveningSnackData.diet_list.map((item) => {
        return {
          added_by: null,
          cal_weight_200: item.calories, // Map calories from the item
          calcium_in_mg: item.calcium,
          calories: item.calories,
          carb_in_g: item.carb,
          cholestrol_in_mg: item.cholestrol,
          details: {
            id: item.id,
            selectedWeight: item.taken_weight,
            multiplication: item.quantity,
            quantity: item.quantity,
            taken_weight: item.final_weight,
            totalCalorie: item.calories,
            totalCarb: item.carb,
            totalCholesterol: item.cholestrol,
            totalFat: item.fat,
            totalFiber: item.fiber,
            totalIron: item.iron,
            totalMonounsaturatedFat: item.monounsaturated_fat,
            totalPolyunsaturatedFat: item.polyunsaturated_fat,
            totalPotassium: item.potassium,
            totalProtein: item.protienes,
            totalSodium: item.sodium,
            totalTransFat: item.trans_fat,
            totalVitaminARAE: item.vitamin_a_rae,
            totalVitaminC: item.vitamin_c,
            totalVitaminD: item.vitamin_d,
            selectedDropDown: item.serving_description,
            totalCalcium: item.calcium,
            totalSaturatedFat: item.saturated_fat,
            totalSugar: item.sugar,
            totalVitaminAIU: item.vitamin_a,
          },
          fat_in_g: item.fat,
          fiber_in_g: item.fiber,
          food_name: item.food_name,
          id: item.food_id,
          image: item.food_image,
          iron_in_mg: item.iron,
          monounsaturated_fat_in_g: item.monounsaturated_fat,
          polyunsaturated_fat_in_g: item.polyunsaturated_fat,
          serving_desc_1: '1 oz', // You can choose an appropriate serving description
          serving_desc_2: '1 piece', // You can choose an appropriate serving description
          serving_desc_3: '3 Piece', // You can choose an appropriate serving description          // ... Map other properties similarly
          protein_in_g: item.protienes,
          potassium_in_mg: item.potassium,
          serving_desc_4: null,
          serving_desc_5: null,
          serving_desc_6: null,
          serving_desc_7: null,
          serving_desc_8: null,
          serving_desc_9: null,
          serving_size: item.taken_weight,
          serving_description_id: item.serving_description_id,
          serving_weight_1: 28,
          serving_weight_2: 50,
          serving_weight_3: 180,
          serving_weight_4: null,
          serving_weight_5: null,
          serving_weight_6: null,
          serving_weight_7: null,
          serving_weight_8: null,
          serving_weight_9: null,
          sodium_in_mg: item.sodium,
          sugar_in_g: item.sugar,
          trans_fat_in_g: item.trans_fat,
          vitamin_a_in_mg: item.vitamin_a,
          vitamin_a_iu: item.vitamin_a,
          vitamin_a_rae_mg: item.vitamin_a_rae,
          vitamin_c_in_mg: item.vitamin_c,
          vitamin_d_mg: item.vitamin_d,
          weight_in_g: item.taken_weight,
        };
      });
      result.eveningSnackItems = mappedEveningSnackData;
    }
    if (lunchData) {
      const mappedLunchData = lunchData.diet_list.map((item) => {
        return {
          added_by: null,
          cal_weight_200: item.calories, // Map calories from the item
          calcium_in_mg: item.calcium,
          calories: item.calories,
          carb_in_g: item.carb,
          cholestrol_in_mg: item.cholestrol,
          details: {
            id: item.id,
            selectedWeight: item.taken_weight,
            multiplication: item.quantity,
            quantity: item.quantity,
            taken_weight: item.final_weight,
            totalCalorie: item.calories,
            totalCarb: item.carb,
            totalCholesterol: item.cholestrol,
            totalFat: item.fat,
            totalFiber: item.fiber,
            totalIron: item.iron,
            totalMonounsaturatedFat: item.monounsaturated_fat,
            totalPolyunsaturatedFat: item.polyunsaturated_fat,
            totalPotassium: item.potassium,
            totalProtein: item.protienes,
            totalSodium: item.sodium,
            totalTransFat: item.trans_fat,
            totalVitaminARAE: item.vitamin_a_rae,
            totalVitaminC: item.vitamin_c,
            totalVitaminD: item.vitamin_d,
            selectedDropDown: item.serving_description,
            totalCalcium: item.calcium,
            totalSaturatedFat: item.saturated_fat,
            totalSugar: item.sugar,
            totalVitaminAIU: item.vitamin_a,
          },
          fat_in_g: item.fat,
          fiber_in_g: item.fiber,
          food_name: item.food_name,
          id: item.food_id,
          image: item.food_image,
          iron_in_mg: item.iron,
          monounsaturated_fat_in_g: item.monounsaturated_fat,
          polyunsaturated_fat_in_g: item.polyunsaturated_fat,
          serving_desc_1: '1 oz', // You can choose an appropriate serving description
          serving_desc_2: '1 piece', // You can choose an appropriate serving description
          serving_desc_3: '3 Piece', // You can choose an appropriate serving description          // ... Map other properties similarly
          protein_in_g: item.protienes,
          potassium_in_mg: item.potassium,
          serving_desc_4: null,
          serving_desc_5: null,
          serving_desc_6: null,
          serving_desc_7: null,
          serving_desc_8: null,
          serving_desc_9: null,
          serving_size: item.taken_weight,
          serving_description_id: item.serving_description_id,
          serving_weight_1: 28,
          serving_weight_2: 50,
          serving_weight_3: 180,
          serving_weight_4: null,
          serving_weight_5: null,
          serving_weight_6: null,
          serving_weight_7: null,
          serving_weight_8: null,
          serving_weight_9: null,
          sodium_in_mg: item.sodium,
          sugar_in_g: item.sugar,
          trans_fat_in_g: item.trans_fat,
          vitamin_a_in_mg: item.vitamin_a,
          vitamin_a_iu: item.vitamin_a,
          vitamin_a_rae_mg: item.vitamin_a_rae,
          vitamin_c_in_mg: item.vitamin_c,
          vitamin_d_mg: item.vitamin_d,
          weight_in_g: item.taken_weight,
        };
      });
      result.lunchItems = mappedLunchData;
    }
    if (meal1Data) {
      const mappedmeal1Data = meal1Data.diet_list.map((item) => {
        return {
          added_by: null,
          cal_weight_200: item.calories, // Map calories from the item
          calcium_in_mg: item.calcium,
          calories: item.calories,
          carb_in_g: item.carb,
          cholestrol_in_mg: item.cholestrol,
          details: {
            id: item.id,
            selectedWeight: item.taken_weight,
            multiplication: item.quantity,
            quantity: item.quantity,
            taken_weight: item.final_weight,
            totalCalorie: item.calories,
            totalCarb: item.carb,
            totalCholesterol: item.cholestrol,
            totalFat: item.fat,
            totalFiber: item.fiber,
            totalIron: item.iron,
            totalMonounsaturatedFat: item.monounsaturated_fat,
            totalPolyunsaturatedFat: item.polyunsaturated_fat,
            totalPotassium: item.potassium,
            totalProtein: item.protienes,
            totalSodium: item.sodium,
            totalTransFat: item.trans_fat,
            totalVitaminARAE: item.vitamin_a_rae,
            totalVitaminC: item.vitamin_c,
            totalVitaminD: item.vitamin_d,
            selectedDropDown: item.serving_description,
            totalCalcium: item.calcium,
            totalSaturatedFat: item.saturated_fat,
            totalSugar: item.sugar,
            totalVitaminAIU: item.vitamin_a,
          },
          fat_in_g: item.fat,
          fiber_in_g: item.fiber,
          food_name: item.food_name,
          id: item.food_id,
          image: item.food_image,
          iron_in_mg: item.iron,
          monounsaturated_fat_in_g: item.monounsaturated_fat,
          polyunsaturated_fat_in_g: item.polyunsaturated_fat,
          serving_desc_1: '1 oz', // You can choose an appropriate serving description
          serving_desc_2: '1 piece', // You can choose an appropriate serving description
          serving_desc_3: '3 Piece', // You can choose an appropriate serving description          // ... Map other properties similarly
          protein_in_g: item.protienes,
          potassium_in_mg: item.potassium,
          serving_desc_4: null,
          serving_desc_5: null,
          serving_desc_6: null,
          serving_desc_7: null,
          serving_desc_8: null,
          serving_desc_9: null,
          serving_size: item.taken_weight,
          serving_description_id: item.serving_description_id,
          serving_weight_1: 28,
          serving_weight_2: 50,
          serving_weight_3: 180,
          serving_weight_4: null,
          serving_weight_5: null,
          serving_weight_6: null,
          serving_weight_7: null,
          serving_weight_8: null,
          serving_weight_9: null,
          sodium_in_mg: item.sodium,
          sugar_in_g: item.sugar,
          trans_fat_in_g: item.trans_fat,
          vitamin_a_in_mg: item.vitamin_a,
          vitamin_a_iu: item.vitamin_a,
          vitamin_a_rae_mg: item.vitamin_a_rae,
          vitamin_c_in_mg: item.vitamin_c,
          vitamin_d_mg: item.vitamin_d,
          weight_in_g: item.taken_weight,
        };
      });
      result.mealItems1 = mappedmeal1Data;
    }
    if (meal2Data) {
      const mappedmeal2Data = meal2Data.diet_list.map((item) => {
        return {
          added_by: null,
          cal_weight_200: item.calories, // Map calories from the item
          calcium_in_mg: item.calcium,
          calories: item.calories,
          carb_in_g: item.carb,
          cholestrol_in_mg: item.cholestrol,
          details: {
            id: item.id,
            selectedWeight: item.taken_weight,
            multiplication: item.quantity,
            quantity: item.quantity,
            taken_weight: item.final_weight,
            totalCalorie: item.calories,
            totalCarb: item.carb,
            totalCholesterol: item.cholestrol,
            totalFat: item.fat,
            totalFiber: item.fiber,
            totalIron: item.iron,
            totalMonounsaturatedFat: item.monounsaturated_fat,
            totalPolyunsaturatedFat: item.polyunsaturated_fat,
            totalPotassium: item.potassium,
            totalProtein: item.protienes,
            totalSodium: item.sodium,
            totalTransFat: item.trans_fat,
            totalVitaminARAE: item.vitamin_a_rae,
            totalVitaminC: item.vitamin_c,
            totalVitaminD: item.vitamin_d,
            selectedDropDown: item.serving_description,
            totalCalcium: item.calcium,
            totalSaturatedFat: item.saturated_fat,
            totalSugar: item.sugar,
            totalVitaminAIU: item.vitamin_a,
          },
          fat_in_g: item.fat,
          fiber_in_g: item.fiber,
          food_name: item.food_name,
          id: item.food_id,
          image: item.food_image,
          iron_in_mg: item.iron,
          monounsaturated_fat_in_g: item.monounsaturated_fat,
          polyunsaturated_fat_in_g: item.polyunsaturated_fat,
          serving_desc_1: '1 oz', // You can choose an appropriate serving description
          serving_desc_2: '1 piece', // You can choose an appropriate serving description
          serving_desc_3: '3 Piece', // You can choose an appropriate serving description          // ... Map other properties similarly
          protein_in_g: item.protienes,
          potassium_in_mg: item.potassium,
          serving_desc_4: null,
          serving_desc_5: null,
          serving_desc_6: null,
          serving_desc_7: null,
          serving_desc_8: null,
          serving_desc_9: null,
          serving_size: item.taken_weight,
          serving_description_id: item.serving_description_id,
          serving_weight_1: 28,
          serving_weight_2: 50,
          serving_weight_3: 180,
          serving_weight_4: null,
          serving_weight_5: null,
          serving_weight_6: null,
          serving_weight_7: null,
          serving_weight_8: null,
          serving_weight_9: null,
          sodium_in_mg: item.sodium,
          sugar_in_g: item.sugar,
          trans_fat_in_g: item.trans_fat,
          vitamin_a_in_mg: item.vitamin_a,
          vitamin_a_iu: item.vitamin_a,
          vitamin_a_rae_mg: item.vitamin_a_rae,
          vitamin_c_in_mg: item.vitamin_c,
          vitamin_d_mg: item.vitamin_d,
          weight_in_g: item.taken_weight,
        };
      });
      result.mealItems2 = mappedmeal2Data;
    }
    if (dinnerData) {
      const mappedDinnerData = dinnerData.diet_list.map((item) => {
        return {
          added_by: null,
          cal_weight_200: item.calories, // Map calories from the item
          calcium_in_mg: item.calcium,
          calories: item.calories,
          carb_in_g: item.carb,
          cholestrol_in_mg: item.cholestrol,
          details: {
            id: item.id,
            selectedWeight: item.taken_weight,
            multiplication: item.quantity,
            quantity: item.quantity,
            taken_weight: item.final_weight,
            totalCalorie: item.calories,
            totalCarb: item.carb,
            totalCholesterol: item.cholestrol,
            totalFat: item.fat,
            totalFiber: item.fiber,
            totalIron: item.iron,
            totalMonounsaturatedFat: item.monounsaturated_fat,
            totalPolyunsaturatedFat: item.polyunsaturated_fat,
            totalPotassium: item.potassium,
            totalProtein: item.protienes,
            totalSodium: item.sodium,
            totalTransFat: item.trans_fat,
            totalVitaminARAE: item.vitamin_a_rae,
            totalVitaminC: item.vitamin_c,
            totalVitaminD: item.vitamin_d,
            selectedDropDown: item.serving_description,
            totalCalcium: item.calcium,
            totalSaturatedFat: item.saturated_fat,
            totalSugar: item.sugar,
            totalVitaminAIU: item.vitamin_a,
          },
          fat_in_g: item.fat,
          fiber_in_g: item.fiber,
          food_name: item.food_name,
          id: item.food_id,
          image: item.food_image,
          iron_in_mg: item.iron,
          monounsaturated_fat_in_g: item.monounsaturated_fat,
          polyunsaturated_fat_in_g: item.polyunsaturated_fat,
          serving_desc_1: '1 oz', // You can choose an appropriate serving description
          serving_desc_2: '1 piece', // You can choose an appropriate serving description
          serving_desc_3: '3 Piece', // You can choose an appropriate serving description          // ... Map other properties similarly
          protein_in_g: item.protienes,
          potassium_in_mg: item.potassium,
          serving_desc_4: null,
          serving_desc_5: null,
          serving_desc_6: null,
          serving_desc_7: null,
          serving_desc_8: null,
          serving_desc_9: null,
          serving_size: item.taken_weight,
          serving_description_id: item.serving_description_id,
          serving_weight_1: 28,
          serving_weight_2: 50,
          serving_weight_3: 180,
          serving_weight_4: null,
          serving_weight_5: null,
          serving_weight_6: null,
          serving_weight_7: null,
          serving_weight_8: null,
          serving_weight_9: null,
          sodium_in_mg: item.sodium,
          sugar_in_g: item.sugar,
          trans_fat_in_g: item.trans_fat,
          vitamin_a_in_mg: item.vitamin_a,
          vitamin_a_iu: item.vitamin_a,
          vitamin_a_rae_mg: item.vitamin_a_rae,
          vitamin_c_in_mg: item.vitamin_c,
          vitamin_d_mg: item.vitamin_d,
          weight_in_g: item.taken_weight,
        };
      });
      result.dinnerItems = mappedDinnerData;
    }
    if (waterData) {
      result.water = waterData;
    }

    // Return an empty array if there is no dinner data
    return result;
  }

  useEffect(() => {
    // Update the isAuthenticated variable when the authenticated state changes
    setIsLoading(authenticated);
  }, [authenticated]);

  useEffect(() => {
    console.log(breakfastItems.length, isLoading, 'the properties');
    // Create a function to fetch and process data

    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1,
        ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
        // Make the API request to get data
        const response = await api.get(apiUrl);
        const responseData = response.data;
        console.log(responseData.data, 'for water');

        const transformedData = mapApiDataToDesiredFormat(responseData);

        if (transformedData.breakfastItems) {
          console.log('Effect is running 2');
          setBreakfastItems(transformedData.breakfastItems);
          // console.log(transformedData.breakfastItems, 'useEffect breakfast');
        }
        if (transformedData.dinnerItems) {
          setDinnerItems(transformedData.dinnerItems);
        }
        if (transformedData.morningSnackItems) {
          setMorningSnackItems(transformedData.morningSnackItems);
        }
        if (transformedData.eveningSnackItems) {
          setEveningSnackItems(transformedData.eveningSnackItems);
        }
        if (transformedData.lunchItems) {
          setLunchItems(transformedData.lunchItems);
        }
        if (transformedData.mealItems1) {
          setMealItems1(transformedData.mealItems1);
        }
        if (transformedData.mealItems2) {
          setMealItems2(transformedData.mealItems2);
        }
        // setWater

        // Move the setWater line here
      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.data) {
          console.error('Server Error Details:', error.response.data);
          // You can set an error state or show an error message to the user here.
        }
      } finally {
        setIsLoading(false);
        setFetchDataFlag(false);
      }
    };

    // Check if data is not already loaded (isLoading is true) and if authenticated
    // Call the data fetch function
    if (isLoading) {
      fetchData();
    }
  }, [breakfastItems, isLoading, authenticated, customerId, setWater]); // Include authenticated in the dependency array
  useEffect(() => {
    // Check if water is null after it has been set
    if (water === null) {
      console.log('====================================');
      console.log('backup code');
      console.log('====================================');
      const redoMealContext = async () => {
        try {
          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_daily_required_calories/${customerId}`;
          // Make the API request to get data
          const response = await api.get(apiUrl);
          const responseData = response.data;
          console.log(responseData.data, 'for water usemeal single ');
          // Move the setWater line here
          setWater(responseData.data.water_datas);
        } catch (error) {
          console.error('Error:', error);
          if (error.response && error.response.data) {
            console.error('Server Error Details:', error.response.data);
            // You can set an error state or show an error message to the user here.
          }
        } finally {
          setIsLoading(false);
          setFetchDataFlag(false);
        }
      };
      if (water === null) {
        redoMealContext();
      }
    }
  }, [water, customerId]);

  const addBreakfastItem = (food: any, details: any) => {
    const existingIndex = breakfastItems.findIndex(
      (item) => item.id === food.id,
    );

    if (existingIndex !== -1) {
      if (food.details && food.details.id !== undefined) {
        // Item already exists, update it
        console.log(food, 'id from db to update food');
        console.log(details, 'details id from db to update');

        const updatedItems = [...breakfastItems];
        updatedItems[existingIndex] = {...food, details};
        // setBreakfastItems(updatedItems);
        var bodyFormData = new FormData();
        bodyFormData.append('id', food.details.id);
        bodyFormData.append('meal_type', details.meal_type);
        bodyFormData.append('food_id', food.id);
        bodyFormData.append('taken_weight', details.selectedWeight);
        bodyFormData.append('quantity', details.multiplication);
        // bodyFormData.append('serving_desc_id', details.serving_description_id);
        bodyFormData.append('desc_num_food_tbl', details.id);

        bodyFormData.append('serving_desc_id', details.id);

        api({
          method: 'post',
          url: `update_diet_data`,
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            // Handle success
            console.log(response.data, 'successfully updated in the database');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
              2,
              '0',
            )}`;
            const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
            // Make the API request to get data
            api
              .get(apiUrl)
              .then((response) => {
                const responseData = response.data;
                const transformedData = mapApiDataToDesiredFormat(responseData);

                console.log(transformedData.breakfastItems, 'breakfast adding');
                // Assuming transformedData contains the breakfast data
                if (transformedData.breakfastItems) {
                  const itemToAdd = transformedData.breakfastItems.find(
                    (item) => item.id === food.id,
                  );
                  // Map and add each item to breakfastItems
                  console.log(itemToAdd, 'the data i want');
                  if (itemToAdd) {
                    console.log(itemToAdd, 'added');
                    // Add the item to breakfastItems
                    const updatedItems = [...breakfastItems];
                    updatedItems[existingIndex] = {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    };
                    setBreakfastItems(updatedItems);
                  }
                }
              })
              .catch(function (error) {
                // Handle error when fetching data from the API
                console.error('Error fetching data from the API:', error);
              });
          })
          .catch(function (error) {
            // Handle error
            console.error(error, 'error');
          });
      } else {
        // Show an alert if food.details or food.details.id is undefined
        Alert.alert('Alert', 'Food Item is already added. please update it', [
          {text: 'OK'},
        ]);
        return; // Exit the function
      }
    } else {
      // Now, you can update the API with the newly added data
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', details.customer_id);
      bodyFormData.append('meal_type', details.meal_type);
      bodyFormData.append('food_id', details.food_id);
      bodyFormData.append('taken_weight', details.taken_weight);
      bodyFormData.append('quantity', details.quantity);
      bodyFormData.append('serving_desc_id', details.serving_desc_id);
      bodyFormData.append('desc', details.desc);
      bodyFormData.append('added_date', details.added_date);

      api({
        method: 'post',
        url: `add_diet_data`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          // Handle success
          console.log(response.data, 'successfully added to the database');

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;

          // Make the API request to get data
          api
            .get(apiUrl)
            .then((response) => {
              const responseData = response.data;
              const transformedData = mapApiDataToDesiredFormat(responseData);

              console.log(transformedData.breakfastItems, 'breakfast adding');
              // Assuming transformedData contains the breakfast data
              if (transformedData.breakfastItems && details.food_id) {
                const itemToAdd = transformedData.breakfastItems.find(
                  (item) => item.id === details.food_id,
                );
                // Map and add each item to breakfastItems
                console.log(itemToAdd, 'the data i want');
                if (itemToAdd) {
                  console.log(itemToAdd, 'added');
                  // Add the item to breakfastItems
                  setBreakfastItems((prevItems) => [
                    ...prevItems,
                    {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    },
                  ]);
                }
              }
            })
            .catch(function (error) {
              // Handle error when fetching data from the API
              console.error('Error fetching data from the API:', error);
            });
        })
        .catch(function (error) {
          // Handle error when adding data to the database
          console.error('Error adding data to the database:', error);
        });
    }
    // setTotalCalories(totalCalories + food.calories);
  };

  const addMorningSnackItem = (food: any, details: any) => {
    const existingIndex = morningSnackItems.findIndex(
      (item) => item.id === food.id,
    );

    if (existingIndex !== -1) {
      if (food.details && food.details.id !== undefined) {
        // Item already exists, update it
        console.log(food, 'id from db to update food');
        console.log(details, 'details id from db to update');

        const updatedItems = [...morningSnackItems];
        updatedItems[existingIndex] = {...food, details};
        // setBreakfastItems(updatedItems);
        var bodyFormData = new FormData();
        bodyFormData.append('id', food.details.id);
        bodyFormData.append('meal_type', details.meal_type);
        bodyFormData.append('food_id', food.id);
        bodyFormData.append('taken_weight', details.selectedWeight);
        bodyFormData.append('quantity', details.multiplication);
        // bodyFormData.append('serving_desc_id', details.serving_description_id);
        bodyFormData.append('desc_num_food_tbl', details.id);

        bodyFormData.append('serving_desc_id', details.id);

        api({
          method: 'post',
          url: `update_diet_data`,
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            // Handle success
            console.log(response.data, 'successfully updated in the database');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
              2,
              '0',
            )}`;
            const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
            // Make the API request to get data
            api
              .get(apiUrl)
              .then((response) => {
                const responseData = response.data;
                const transformedData = mapApiDataToDesiredFormat(responseData);

                console.log(
                  transformedData.morningSnackItems,
                  'breakfast adding',
                );
                // Assuming transformedData contains the breakfast data
                if (transformedData.morningSnackItems) {
                  const itemToAdd = transformedData.morningSnackItems.find(
                    (item) => item.id === food.id,
                  );
                  // Map and add each item to breakfastItems
                  console.log(itemToAdd, 'the data i want');
                  if (itemToAdd) {
                    console.log(itemToAdd, 'added');
                    // Add the item to breakfastItems
                    const updatedItems = [...morningSnackItems];
                    updatedItems[existingIndex] = {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    };
                    setMorningSnackItems(updatedItems);
                  }
                }
              })
              .catch(function (error) {
                // Handle error when fetching data from the API
                console.error('Error fetching data from the API:', error);
              });
          })
          .catch(function (error) {
            // Handle error
            console.error(error, 'error');
          });
      } else {
        // Show an alert if food.details or food.details.id is undefined
        Alert.alert('Alert', 'Food Item is already added. please update it', [
          {text: 'OK'},
        ]);
        return; // Exit the function
      }
    } else {
      // Now, you can update the API with the newly added data
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', details.customer_id);
      bodyFormData.append('meal_type', details.meal_type);
      bodyFormData.append('food_id', details.food_id);
      bodyFormData.append('taken_weight', details.taken_weight);
      bodyFormData.append('quantity', details.quantity);
      bodyFormData.append('serving_desc_id', details.serving_desc_id);
      bodyFormData.append('desc', details.desc);
      bodyFormData.append('added_date', details.added_date);

      api({
        method: 'post',
        url: `add_diet_data`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          // Handle success
          console.log(response.data, 'successfully added to the database');

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;

          // Make the API request to get data
          api
            .get(apiUrl)
            .then((response) => {
              const responseData = response.data;
              const transformedData = mapApiDataToDesiredFormat(responseData);

              console.log(
                transformedData.morningSnackItems,
                'breakfast adding',
              );
              // Assuming transformedData contains the breakfast data
              if (transformedData.morningSnackItems && details.food_id) {
                const itemToAdd = transformedData.morningSnackItems.find(
                  (item) => item.id === details.food_id,
                );
                // Map and add each item to breakfastItems
                console.log(itemToAdd, 'the data i want');
                if (itemToAdd) {
                  console.log(itemToAdd, 'added');
                  // Add the item to breakfastItems
                  setMorningSnackItems((prevItems) => [
                    ...prevItems,
                    {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    },
                  ]);
                }
              }
            })
            .catch(function (error) {
              // Handle error when fetching data from the API
              console.error('Error fetching data from the API:', error);
            });
        })
        .catch(function (error) {
          // Handle error when adding data to the database
          console.error('Error adding data to the database:', error);
        });
    }
    // setTotalCalories(totalCalories + food.calories);
  };
  const addEveningSnackItem = (food: any, details: any) => {
    const existingIndex = eveningSnackItems.findIndex(
      (item) => item.id === food.id,
    );

    if (existingIndex !== -1) {
      if (food.details && food.details.id !== undefined) {
        // Item already exists, update it
        console.log(food, 'id from db to update food');
        console.log(details, 'details id from db to update');

        const updatedItems = [...eveningSnackItems];
        updatedItems[existingIndex] = {...food, details};
        // setBreakfastItems(updatedItems);
        var bodyFormData = new FormData();
        bodyFormData.append('id', food.details.id);
        bodyFormData.append('meal_type', details.meal_type);
        bodyFormData.append('food_id', food.id);
        bodyFormData.append('taken_weight', details.selectedWeight);
        bodyFormData.append('quantity', details.multiplication);
        // bodyFormData.append('serving_desc_id', details.serving_description_id);
        bodyFormData.append('desc_num_food_tbl', details.id);

        bodyFormData.append('serving_desc_id', details.id);

        api({
          method: 'post',
          url: `update_diet_data`,
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            // Handle success
            console.log(response.data, 'successfully updated in the database');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
              2,
              '0',
            )}`;
            const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
            // Make the API request to get data
            api
              .get(apiUrl)
              .then((response) => {
                const responseData = response.data;
                const transformedData = mapApiDataToDesiredFormat(responseData);

                console.log(
                  transformedData.eveningSnackItems,
                  'breakfast adding',
                );
                // Assuming transformedData contains the breakfast data
                if (transformedData.eveningSnackItems) {
                  const itemToAdd = transformedData.eveningSnackItems.find(
                    (item) => item.id === food.id,
                  );
                  // Map and add each item to breakfastItems
                  console.log(itemToAdd, 'the data i want');
                  if (itemToAdd) {
                    console.log(itemToAdd, 'added');
                    // Add the item to breakfastItems
                    const updatedItems = [...eveningSnackItems];
                    updatedItems[existingIndex] = {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    };
                    setEveningSnackItems(updatedItems);
                  }
                }
              })
              .catch(function (error) {
                // Handle error when fetching data from the API
                console.error('Error fetching data from the API:', error);
              });
          })
          .catch(function (error) {
            // Handle error
            console.error(error, 'error');
          });
      } else {
        // Show an alert if food.details or food.details.id is undefined
        Alert.alert('Alert', 'Food Item is already added. please update it', [
          {text: 'OK'},
        ]);
        return; // Exit the function
      }
    } else {
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', details.customer_id);
      bodyFormData.append('meal_type', details.meal_type);
      bodyFormData.append('food_id', details.food_id);
      bodyFormData.append('taken_weight', details.taken_weight);
      bodyFormData.append('quantity', details.quantity);
      bodyFormData.append('serving_desc_id', details.serving_desc_id);
      bodyFormData.append('desc', details.desc);
      bodyFormData.append('added_date', details.added_date);

      api({
        method: 'post',
        url: `add_diet_data`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          // Handle success
          console.log(response.data, 'successfully added to the database');

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;

          // Make the API request to get data
          api
            .get(apiUrl)
            .then((response) => {
              const responseData = response.data;
              const transformedData = mapApiDataToDesiredFormat(responseData);

              // console.log(transformedData.morning, 'breakfast adding');
              // Assuming transformedData contains the breakfast data
              if (transformedData.eveningSnackItems && details.food_id) {
                const itemToAdd = transformedData.eveningSnackItems.find(
                  (item) => item.id === details.food_id,
                );
                // Map and add each item to breakfastItems
                console.log(itemToAdd, 'the data i want');
                if (itemToAdd) {
                  console.log(itemToAdd, 'added');
                  // Add the item to breakfastItems
                  setEveningSnackItems((prevItems) => [
                    ...prevItems,
                    {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    },
                  ]);
                }
              }
            })
            .catch(function (error) {
              // Handle error when fetching data from the API
              console.error('Error fetching data from the API:', error);
            });
        })
        .catch(function (error) {
          // Handle error when adding data to the database
          console.error('Error adding data to the database:', error);
        });
    }
    // setTotalCalories(totalCalories + food.calories);
  };

  const addLunchItem = (food: any, details: any) => {
    const existingIndex = lunchItems.findIndex((item) => item.id === food.id);

    if (existingIndex !== -1) {
      if (food.details && food.details.id !== undefined) {
        // Item already exists, update it
        console.log(food, 'id from db to update food');
        console.log(details, 'details id from db to update');

        const updatedItems = [...lunchItems];
        updatedItems[existingIndex] = {...food, details};
        // setBreakfastItems(updatedItems);
        var bodyFormData = new FormData();
        bodyFormData.append('id', food.details.id);
        bodyFormData.append('meal_type', details.meal_type);
        bodyFormData.append('food_id', food.id);
        bodyFormData.append('taken_weight', details.selectedWeight);
        bodyFormData.append('quantity', details.multiplication);
        bodyFormData.append('serving_desc_id', details.id);
        bodyFormData.append('desc_num_food_tbl', details.id);

        api({
          method: 'post',
          url: `update_diet_data`,
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            // Handle success
            console.log(response.data, 'successfully updated in the database');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
              2,
              '0',
            )}`;
            const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
            // Make the API request to get data
            api
              .get(apiUrl)
              .then((response) => {
                const responseData = response.data;
                const transformedData = mapApiDataToDesiredFormat(responseData);

                console.log(transformedData.lunchItems, 'breakfast adding');
                // Assuming transformedData contains the breakfast data
                if (transformedData.lunchItems) {
                  const itemToAdd = transformedData.lunchItems.find(
                    (item) => item.id === food.id,
                  );
                  // Map and add each item to breakfastItems
                  console.log(itemToAdd, 'the data i want');
                  if (itemToAdd) {
                    console.log(itemToAdd, 'added');
                    // Add the item to breakfastItems
                    const updatedItems = [...lunchItems];
                    updatedItems[existingIndex] = {
                      ...food,
                      details: itemToAdd.details,
                    };
                    setLunchItems(updatedItems);
                  }
                }
              })
              .catch(function (error) {
                // Handle error when fetching data from the API
                console.error('Error fetching data from the API:', error);
              });
          })
          .catch(function (error) {
            // Handle error
            console.error(error, 'error');
          });
      } else {
        // Show an alert if food.details or food.details.id is undefined
        Alert.alert('Alert', 'Food Item is already added. please update it', [
          {text: 'OK'},
        ]);
        return; // Exit the function
      }
    } else {
      console.log(food, 'id from db to update food');
      console.log(details, 'details id from db to update');
      // Now, you can update the API with the newly added data
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', details.customer_id);
      bodyFormData.append('meal_type', details.meal_type);
      bodyFormData.append('food_id', details.food_id);
      bodyFormData.append('taken_weight', details.taken_weight);
      bodyFormData.append('quantity', details.quantity);
      bodyFormData.append('serving_desc_id', details.serving_desc_id);
      bodyFormData.append('desc', details.desc);
      bodyFormData.append('added_date', details.added_date);

      api({
        method: 'post',
        url: `add_diet_data`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          // Handle success
          console.log(response.data, 'successfully added to the database');

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;

          // Make the API request to get data
          api
            .get(apiUrl)
            .then((response) => {
              const responseData = response.data;
              const transformedData = mapApiDataToDesiredFormat(responseData);

              // console.log(transformedData.morning, 'breakfast adding');
              // Assuming transformedData contains the breakfast data
              if (transformedData.lunchItems && details.food_id) {
                const itemToAdd = transformedData.lunchItems.find(
                  (item) => item.id === details.food_id,
                );
                // Map and add each item to breakfastItems
                console.log(itemToAdd, 'the data i want');
                if (itemToAdd) {
                  console.log(itemToAdd, 'added');
                  // Add the item to breakfastItems
                  setLunchItems((prevItems) => [
                    ...prevItems,
                    {...food, details: itemToAdd.details},
                  ]);
                }
              }
            })
            .catch(function (error) {
              // Handle error when fetching data from the API
              console.error('Error fetching data from the API:', error);
            });
        })
        .catch(function (error) {
          // Handle error when adding data to the database
          console.error('Error adding data to the database:', error);
        });
    }
    // setTotalCalories(totalCalories + food.calories);
  };

  const addDinnerItem = (food: any, details: any) => {
    const existingIndex = dinnerItems.findIndex((item) => item.id === food.id);

    if (existingIndex !== -1) {
      if (food.details && food.details.id !== undefined) {
        // Item already exists, update it
        console.log(food, 'id from db to update food');
        console.log(details, 'details id from db to update');

        const updatedItems = [...dinnerItems];
        updatedItems[existingIndex] = {...food, details};
        // setBreakfastItems(updatedItems);
        var bodyFormData = new FormData();
        bodyFormData.append('id', food.details.id);
        bodyFormData.append('meal_type', details.meal_type);
        bodyFormData.append('food_id', food.id);
        bodyFormData.append('taken_weight', details.selectedWeight);
        bodyFormData.append('quantity', details.multiplication);
        // bodyFormData.append('serving_desc_id', details.serving_description_id);
        bodyFormData.append('desc_num_food_tbl', details.id);

        bodyFormData.append('serving_desc_id', details.id);

        api({
          method: 'post',
          url: `update_diet_data`,
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            // Handle success
            console.log(response.data, 'successfully updated in the database');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
              2,
              '0',
            )}`;
            const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
            // Make the API request to get data
            api
              .get(apiUrl)
              .then((response) => {
                const responseData = response.data;
                const transformedData = mapApiDataToDesiredFormat(responseData);

                console.log(transformedData.dinnerItems, 'dinner adding');
                // Assuming transformedData contains the breakfast data
                if (transformedData.dinnerItems) {
                  const itemToAdd = transformedData.dinnerItems.find(
                    (item) => item.id === food.id,
                  );
                  // Map and add each item to breakfastItems
                  console.log(itemToAdd, 'the data i want');
                  if (itemToAdd) {
                    console.log(itemToAdd, 'added');
                    // Add the item to breakfastItems
                    const updatedItems = [...dinnerItems];
                    updatedItems[existingIndex] = {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    };
                    setDinnerItems(updatedItems);
                  }
                }
              })
              .catch(function (error) {
                // Handle error when fetching data from the API
                console.error('Error fetching data from the API:', error);
              });
          })
          .catch(function (error) {
            // Handle error
            console.error(error, 'error');
          });
      } else {
        // Show an alert if food.details or food.details.id is undefined
        Alert.alert('Alert', 'Food Item is already added. please update it', [
          {text: 'OK'},
        ]);
        return; // Exit the function
      }
    } else {
      // Now, you can update the API with the newly added data
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', details.customer_id);
      bodyFormData.append('meal_type', details.meal_type);
      bodyFormData.append('food_id', details.food_id);
      bodyFormData.append('taken_weight', details.taken_weight);
      bodyFormData.append('quantity', details.quantity);
      bodyFormData.append('serving_desc_id', details.serving_desc_id);
      bodyFormData.append('desc', details.desc);
      bodyFormData.append('added_date', details.added_date);

      api({
        method: 'post',
        url: `add_diet_data`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          // Handle success
          console.log(response.data, 'successfully added to the database');

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;

          // Make the API request to get data
          api
            .get(apiUrl)
            .then((response) => {
              const responseData = response.data;
              const transformedData = mapApiDataToDesiredFormat(responseData);

              console.log(transformedData.dinnerItems, 'breakfast adding');
              // Assuming transformedData contains the breakfast data
              if (transformedData.dinnerItems && details.food_id) {
                const itemToAdd = transformedData.dinnerItems.find(
                  (item) => item.id === details.food_id,
                );
                // Map and add each item to breakfastItems
                console.log(itemToAdd, 'the data i want');
                if (itemToAdd) {
                  console.log(itemToAdd, 'added');
                  // Add the item to breakfastItems
                  setDinnerItems((prevItems) => [
                    ...prevItems,
                    {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    },
                  ]);
                }
              }
            })
            .catch(function (error) {
              // Handle error when fetching data from the API
              console.error('Error fetching data from the API:', error);
            });
        })
        .catch(function (error) {
          // Handle error when adding data to the database
          console.error('Error adding data to the database:', error);
        });
    }
    // setTotalCalories(totalCalories + food.calories);
  };

  const addMealItem1 = (food: any, details: any) => {
    const existingIndex = mealItems1.findIndex((item) => item.id === food.id);

    if (existingIndex !== -1) {
      if (food.details && food.details.id !== undefined) {
        // Item already exists, update it
        console.log(food, 'id from db to update food');
        console.log(details, 'details id from db to update');

        const updatedItems = [...mealItems1];
       
      
        updatedItems[existingIndex] = {...food, details};
        // setBreakfastItems(updatedItems);
        var bodyFormData = new FormData();
        bodyFormData.append('id', food.details.id);
        bodyFormData.append('meal_type', details.meal_type);
        bodyFormData.append('food_id', food.id);
        bodyFormData.append('taken_weight', details.selectedWeight);
        bodyFormData.append('quantity', details.multiplication);
        // bodyFormData.append('serving_desc_id', details.serving_description_id);
        bodyFormData.append('desc_num_food_tbl', details.id);

        bodyFormData.append('serving_desc_id', details.id);

        api({
          method: 'post',
          url: `update_diet_data`,
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            // Handle success
            console.log(response.data, 'successfully updated in the database');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
              2,
              '0',
            )}`;
            const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
            // Make the API request to get data
            api
              .get(apiUrl)
              .then((response) => {
                const responseData = response.data;
                const transformedData = mapApiDataToDesiredFormat(responseData);

                console.log(transformedData.mealItems1, 'breakfast adding');
                // Assuming transformedData contains the breakfast data
                if (transformedData.mealItems1) {
                  const itemToAdd = transformedData.mealItems1.find(
                    (item) => item.id === food.id,
                  );
                  // Map and add each item to breakfastItems
                  console.log(itemToAdd, 'the data i want');
                  if (itemToAdd) {
                    console.log(itemToAdd, 'added');
                    // Add the item to breakfastItems
                    const updatedItems = [...mealItems1];
                    updatedItems[existingIndex] = {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    };
                    setMealItems1(updatedItems);
                  }
                }
              })
              .catch(function (error) {
                // Handle error when fetching data from the API
                console.error('Error fetching data from the API:', error);
              });
          })
          .catch(function (error) {
            // Handle error
            console.error(error, 'error');
          });
      } else {
        // Show an alert if food.details or food.details.id is undefined
        Alert.alert('Alert', 'Food Item is already added. please update it', [
          {text: 'OK'},
        ]);
        return; // Exit the function
      }
    } else {
      console.log(food, 'id from db to update food');
      console.log(details, 'details id from db to update');
      // Now, you can update the API with the newly added data
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', details.customer_id);
      bodyFormData.append('meal_type', details.meal_type);
      bodyFormData.append('food_id', details.food_id);
      bodyFormData.append('taken_weight', details.taken_weight);
      bodyFormData.append('quantity', details.quantity);
      bodyFormData.append('serving_desc_id', details.serving_desc_id);
      bodyFormData.append('desc', details.desc);
      bodyFormData.append('added_date', details.added_date);

      api({
        method: 'post',
        url: `add_diet_data`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          // Handle success
          console.log(response.data, 'successfully added to the database');

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;

          // Make the API request to get data
          api
            .get(apiUrl)
            .then((response) => {
              const responseData = response.data;
              const transformedData = mapApiDataToDesiredFormat(responseData);

              // console.log(transformedData.morning, 'breakfast adding');
              // Assuming transformedData contains the breakfast data
              if (transformedData.mealItems1 && details.food_id) {
                const itemToAdd = transformedData.mealItems1.find(
                  (item) => item.id === details.food_id,
                );
                // Map and add each item to breakfastItems
                console.log(itemToAdd, 'the data i want');
                if (itemToAdd) {
                  console.log(itemToAdd, 'added');
                  // Add the item to breakfastItems
                  setMealItems1((prevItems) => [
                    ...prevItems,
                    {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    },
                  ]);
                }
              }
            })
            .catch(function (error) {
              // Handle error when fetching data from the API
              console.error('Error fetching data from the API:', error);
            });
        })
        .catch(function (error) {
          // Handle error when adding data to the database
          console.error('Error adding data to the database:', error);
        });
    }
    // setTotalCalories(totalCalories + food.calories);
  };
  const addMealItem2 = (food: any, details: any) => {
    const existingIndex = mealItems2.findIndex((item) => item.id === food.id);

    if (existingIndex !== -1) {
      if (food.details && food.details.id !== undefined) {
        // Item already exists, update it
        console.log(food, 'id from db to update food');
        console.log(details, 'details id from db to update');

        const updatedItems = [...mealItems2];
        updatedItems[existingIndex] = {...food, details};
        // setBreakfastItems(updatedItems);
        var bodyFormData = new FormData();
        bodyFormData.append('id', food.details.id);
        bodyFormData.append('meal_type', details.meal_type);
        bodyFormData.append('food_id', food.id);
        bodyFormData.append('taken_weight', details.selectedWeight);
        bodyFormData.append('quantity', details.multiplication);
        // bodyFormData.append('serving_desc_id', details.serving_description_id);
        bodyFormData.append('desc_num_food_tbl', details.id);

        bodyFormData.append('serving_desc_id', details.id);

        api({
          method: 'post',
          url: `update_diet_data`,
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            // Handle success
            console.log(response.data, 'successfully updated in the database');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
              2,
              '0',
            )}`;
            const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;
            // Make the API request to get data
            api
              .get(apiUrl)
              .then((response) => {
                const responseData = response.data;
                const transformedData = mapApiDataToDesiredFormat(responseData);

                console.log(transformedData.mealItems2, 'breakfast adding');
                // Assuming transformedData contains the breakfast data
                if (transformedData.mealItems2) {
                  const itemToAdd = transformedData.mealItems2.find(
                    (item) => item.id === food.id,
                  );
                  // Map and add each item to breakfastItems
                  console.log(itemToAdd, 'the data i want');
                  if (itemToAdd) {
                    console.log(itemToAdd, 'added');
                    // Add the item to breakfastItems
                    const updatedItems = [...mealItems2];
                    updatedItems[existingIndex] = {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    };
                    setMealItems2(updatedItems);
                  }
                }
              })
              .catch(function (error) {
                // Handle error when fetching data from the API
                console.error('Error fetching data from the API:', error);
              });
          })
          .catch(function (error) {
            // Handle error
            console.error(error, 'error');
          });
      } else {
        // Show an alert if food.details or food.details.id is undefined
        Alert.alert('Alert', 'Food Item is already added. please update it', [
          {text: 'OK'},
        ]);
        return; // Exit the function
      }
    } else {
      console.log(food, 'id from db to update food');
      console.log(details, 'details id from db to update');
      // Now, you can update the API with the newly added data
      var bodyFormData = new FormData();
      bodyFormData.append('customer_id', details.customer_id);
      bodyFormData.append('meal_type', details.meal_type);
      bodyFormData.append('food_id', details.food_id);
      bodyFormData.append('taken_weight', details.taken_weight);
      bodyFormData.append('quantity', details.quantity);
      bodyFormData.append('serving_desc_id', details.serving_desc_id);
      bodyFormData.append('desc', details.desc);
      bodyFormData.append('added_date', details.added_date);
      api({
        method: 'post',
        url: `add_diet_data`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          // Handle success
          console.log(response.data, 'successfully added to the database');

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
          ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(
            2,
            '0',
          )}`;

          const apiUrl = `get_diet_list_wrt_date/${customerId}/${formattedDate}`;

          // Make the API request to get data
          api
            .get(apiUrl)
            .then((response) => {
              const responseData = response.data;
              const transformedData = mapApiDataToDesiredFormat(responseData);

              // console.log(transformedData.morning, 'breakfast adding');
              // Assuming transformedData contains the breakfast data
              if (transformedData.mealItems2 && details.food_id) {
                const itemToAdd = transformedData.mealItems2.find(
                  (item) => item.id === details.food_id,
                );
                // Map and add each item to breakfastItems
                console.log(itemToAdd, 'the data i want');
                if (itemToAdd) {
                  console.log(itemToAdd, 'added');
                  // Add the item to breakfastItems
                  setMealItems2((prevItems) => [
                    ...prevItems,
                    {
                      ...food,
                      details: itemToAdd.details,
                      serving_description_id: itemToAdd.serving_description_id,
                    },
                  ]);
                }
              }
            })
            .catch(function (error) {
              // Handle error when fetching data from the API
              console.error('Error fetching data from the API:', error);
            });
        })
        .catch(function (error) {
          // Handle error when adding data to the database
          console.error('Error adding data to the database:', error);
        });
    }
    // setTotalCalories(totalCalories + food.calories);
  };
  const addWater = (plus) => {
    // console.log(food, 'water data');
    // var bodyFormData = new FormData();
    // bodyFormData.append('customer_id', details.customer_id);
    // bodyFormData.append('meal_type', details.meal_type);
    api({
      method: 'get',
      url: `update_water_tracker/${customerId}/${plus}`,
      // data: bodyFormData,
      // headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(function (response) {
        console.log(response.data.data, 'set water');

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1,
        ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        const apiUrl = `get_daily_required_calories/${customerId}`;
        api.get(apiUrl).then((response) => {
          const responseData = response.data;
          console.log(responseData.data, 'track data');

          setWater(responseData.data.water_datas);
        });

        // setWater(response.data.data)
      })
      .catch(function (error) {
        // Handle error when fetching data from the API
        console.error('Error fetching data from the API:', error);
      });
  };
  const deleteItem = (items: any[], mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        setBreakfastItems(items);
        break;
      case 'morningSnackItems':
        setMorningSnackItems(items);
        break;
      case 'lunch':
        setLunchItems(items);
        break;
      case 'evening':
        setEveningSnackItems(items);
        break;
      case 'dinner':
        setDinnerItems(items);
        break;
      case 'meal1':
        setMealItems1(items);
        break;
      case 'meal2':
        setMealItems2(items);
        break;
      default:
        break;
    }
  };
  const updateBreakfastItem = (id: number, updatedDetails: any) => {
    const existingIndex = breakfastItems.findIndex((item) => item.id === id);
    if (existingIndex !== -1) {
      const updatedItems = [...breakfastItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        ...updatedDetails,
      };
      setBreakfastItems(updatedItems);
      console.log('updated');
    }
  };
  const clearContextData = () => {
    setBreakfastItems([]);
    setLunchItems([]);
    setMorningSnackItems([]);
    setEveningSnackItems([]);
    setDinnerItems([]);
    setMealItems1([]);
    setMealItems2([]);
    // Reset other state variables as needed
  };

  const value: MealContextType = {
    breakfastItems,
    morningSnackItems,
    eveningSnackItems,
    lunchItems,
    dinnerItems,
    mealItems1,
    mealItems2,
    water,
    addBreakfastItem,
    addMorningSnackItem,
    addEveningSnackItem,
    addLunchItem,
    addDinnerItem,
    addMealItem1,
    addMealItem2,
    addWater,
    clearContextData,
    deleteItem,
    updateBreakfastItem,
    isLoading,
  };

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
};

export default MealContextProvider;

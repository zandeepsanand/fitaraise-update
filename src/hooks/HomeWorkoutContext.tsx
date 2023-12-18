/* eslint-disable prettier/prettier */
// contexts/FavoritesContext.js

import {createContext, useContext, useEffect, useState} from 'react';
import api from '../../api';
import { Text } from '../components';
import LoginContext from './LoginContext';

const HomeWorkoutContext = createContext();

export const useFavorites = () => {
  return useContext(HomeWorkoutContext);
};

export const HomeWorkoutProvider = ({ children }) => {
  const [workout, setWorkout] = useState([]);
  // console.log(workoutData,"homeWo");
  
  const [isLoading, setIsLoading] = useState(true);
  const {
    customerId,
    isLoggedIn,
    token,

    logout,
  } = useContext(LoginContext);
  useEffect(() => {
   
    
    const fetchFavorites = async () => {
      try {
        const userData = await api.get(`get_personal_datas/${customerId}`);
        const user = userData.data.data;
       

        if (user.gender && user.home_workout_level) {
          const homeWorkout = await api.get(
            `get_home_workouts?gender=${user.gender}&level=${user.home_workout_level}`
          );
          const homeWorkoutJSON = homeWorkout.data.data;
          console.log( homeWorkoutJSON ,"hi from homeWorkout Context");
          if (homeWorkoutJSON) {
            setWorkout(homeWorkoutJSON);
          }
        }
      } catch (error) {
        console.error('Error fetching stored data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch favorites when the component mounts
    fetchFavorites();
  }, [customerId]);
  const updateWorkoutData = async () => {
    try {
      const userData = await api.get(`get_personal_datas/${customerId}`);
      const user = userData.data.data;

      if (user.gender && user.home_workout_level) {
        const homeWorkout = await api.get(
          `get_home_workouts?gender=${user.gender}&level=${user.home_workout_level}`
        );
        const homeWorkoutJSON = homeWorkout.data.data;

        if (homeWorkoutJSON) {
          setWorkout(homeWorkoutJSON);
        }
      }
    } catch (error) {
      console.error('Error fetching stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

 

  return (
    <HomeWorkoutContext.Provider value={{ workout, isLoading, updateWorkoutData }}>
      {children}
    </HomeWorkoutContext.Provider>
  );
};

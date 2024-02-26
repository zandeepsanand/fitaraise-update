/* eslint-disable prettier/prettier */
// Initialize your context
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutPathContext = createContext();


export const WorkoutPathProvider = ({ children }) => {
  const [selectedWorkoutPath, setSelectedWorkoutPath] = useState(null);
  const [homeWorkoutData, setHomeWorkoutData] = useState(null);

  useEffect(() => {
    // Load homeWorkoutData from AsyncStorage during app startup
    const loadHomeWorkoutPath = async () => {
      try {
        const storedHomeWorkoutPath = await AsyncStorage.getItem('WorkoutPath');

        if (storedHomeWorkoutPath) {
          const parsedHomeWorkoutPath = JSON.parse(storedHomeWorkoutPath);
          setSelectedWorkoutPath(parsedHomeWorkoutPath);
        }
      } catch (error) {
        console.error('Error loading home workout path from AsyncStorage:', error);
      }
    };

    loadHomeWorkoutPath();
  }, []); // Empty dependency array means this effect runs only once during component mount

  const setWorkoutPath = (path) => {
    setSelectedWorkoutPath(path);
  };

  return (
    <WorkoutPathContext.Provider value={{ selectedWorkoutPath, setWorkoutPath }}>
      {children}
    </WorkoutPathContext.Provider>
  );
};

export const useWorkoutPathContext = () => {
  return useContext(WorkoutPathContext);
};

/* eslint-disable prettier/prettier */
// DataContext.js
import React, { createContext, useContext, useState } from 'react';

const GymDataContext = createContext();

export const GymDataProvider = ({ children }) => {
  const [exerciseData, setGymData] = useState([]);
  const [exerciseDataAll, setGymDataAll] = useState([]);
console.log(exerciseData , "from useContext");

  const value = {
    exerciseData,
    setGymData,
    setGymDataAll,
    exerciseDataAll
  };

  return (
    <GymDataContext.Provider value={value}>
      {children}
    </GymDataContext.Provider>
  );
};

export const usegymData = () => {
  const context = useContext(GymDataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

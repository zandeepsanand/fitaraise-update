/* eslint-disable prettier/prettier */
// DataContext.js
import React, { createContext, useContext, useState } from 'react';

const ChallengeDataContext = createContext();

export const ChallengeDataProvider = ({ children }) => {
  const [exerciseData, setExerciseData] = useState([]);
console.log(exerciseData , "from useContext");

  const value = {
    exerciseData,
    setExerciseData,
  };

  return (
    <ChallengeDataContext.Provider value={value}>
      {children}
    </ChallengeDataContext.Provider>
  );
};

export const useChallengeData = () => {
  const context = useContext(ChallengeDataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

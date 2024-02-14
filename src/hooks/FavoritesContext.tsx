/* eslint-disable prettier/prettier */
// contexts/FavoritesContext.js

import {createContext, useContext, useEffect, useState} from 'react';
import api from '../../api';
import { Text } from '../components';
import LoginContext from './LoginContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    customerId,
    isLoggedIn,
    token,

    logout,
  } = useContext(LoginContext);

  useEffect(() => {
    console.log("fetched once");
    
    const fetchFavorites = async () => {
      try {
        const getFavoritesResponse = await api.get('get_customer_fav_food');
        console.log(getFavoritesResponse.data, "get_customer_fav_food response");
        

        setFavorites(getFavoritesResponse.data.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        // Set isLoading to false regardless of success or failure
        setIsLoading(false);
      }
    };

    // Fetch favorites when the component mounts
    fetchFavorites();
  }, [customerId]); // Empty dependency array ensures it runs only once on mount

  const addToFavorites = async (item) => {
    try {
      // First API call to set_customer_fav_food (assuming it's a POST request)
      const setFavoriteResponse = await api.get(
        `set_customer_fav_food/${item}`,
         // Assuming the server expects an object with an "itemId" property
      );

      console.log(setFavoriteResponse.data, "set_customer_fav_food response");

      if (setFavoriteResponse.data.success) {
        // Second API call to get_customer_fav_food
        const getFavoritesResponse = await api.get('get_customer_fav_food');

        console.log(getFavoritesResponse.data, "get_customer_fav_food response");

        // Update state with the new list of favorites
        setFavorites(getFavoritesResponse.data.data);
      } else {
        console.log('Setting favorite failed.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };
  if (isLoading) {
    return <Text secondary semibold>Loading...</Text> // You can replace this with a loading spinner or any other loading indicator
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

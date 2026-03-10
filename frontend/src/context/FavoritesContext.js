import React, { createContext, useState, useContext, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteIds([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      setFavorites(response.data);
      setFavoriteIds(response.data.map(f => f.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const addFavorite = async (placeId) => {
    try {
      await favoritesAPI.add(placeId);
      await fetchFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (placeId) => {
    try {
      await favoritesAPI.remove(placeId);
      await fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const toggleFavorite = async (placeId) => {
    if (favoriteIds.includes(placeId)) {
      await removeFavorite(placeId);
    } else {
      await addFavorite(placeId);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      favoriteIds, 
      fetchFavorites, 
      addFavorite, 
      removeFavorite,
      toggleFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

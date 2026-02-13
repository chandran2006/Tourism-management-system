import React, { useState, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import { FaHeart } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleRemoveFavorite = async (placeId) => {
    try {
      await favoritesAPI.remove(placeId);
      setFavorites(favorites.filter(f => f.id !== placeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="favorites">
      <div className="favorites-header">
        <h1><FaHeart /> My Favorites</h1>
        <p>Your saved destinations</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <FaHeart size={80} color="#ccc" />
          <h2>No favorites yet</h2>
          <p>Start exploring and save your favorite places!</p>
        </div>
      ) : (
        <div className="places-grid">
          {favorites.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onFavorite={handleRemoveFavorite}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

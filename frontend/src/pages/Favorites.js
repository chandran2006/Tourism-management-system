import React, { useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import PlaceCard from '../components/PlaceCard';
import { FaHeart } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
  const { favorites, favoriteIds, fetchFavorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchFavorites();
  }, []);

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
              onFavorite={toggleFavorite}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

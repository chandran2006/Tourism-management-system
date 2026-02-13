import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import './PlaceCard.css';

const PlaceCard = ({ place, onFavorite, isFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="place-card" onClick={() => navigate(`/place/${place.id}`)}>
      <div className="place-image">
        <img src={place.imageUrl} alt={place.name} />
        <span className="place-category">{place.category}</span>
        {onFavorite && (
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(place.id);
            }}
          >
            <FaHeart />
          </button>
        )}
      </div>
      <div className="place-content">
        <h3>{place.name}</h3>
        <p className="place-location">
          <FaMapMarkerAlt /> {place.location}
        </p>
        <p className="place-description">{place.description?.substring(0, 100)}...</p>
        <div className="place-rating">
          <FaStar color="#ffc107" /> {place.rating}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;

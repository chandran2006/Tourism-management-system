import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { placesAPI, reviewsAPI, favoritesAPI, enhancedAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaStar, FaMapMarkerAlt, FaHeart, FaCloud } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import PlaceCard from '../components/PlaceCard';
import SmartTravelCompanion from '../components/SmartTravelCompanion';
import './PlaceDetails.css';

const PlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [weather, setWeather] = useState(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPlace();
  }, [id]);

  const fetchPlace = async () => {
    try {
      const response = await placesAPI.getById(id);
      setPlace(response.data);
      
      // Fetch nearby places
      if (response.data.latitude && response.data.longitude) {
        const nearbyResponse = await enhancedAPI.getNearby({
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          placeId: id
        });
        setNearbyPlaces(nearbyResponse.data);
        
        // Fetch weather
        const weatherResponse = await enhancedAPI.getWeather(response.data.location.split(',')[0]);
        setWeather(weatherResponse.data);
      }
    } catch (error) {
      console.error('Error fetching place:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to add review');
    try {
      await reviewsAPI.add({ placeId: id, rating, comment });
      setComment('');
      fetchPlace();
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleFavorite = async () => {
    if (!user) return alert('Please login to add favorites');
    try {
      await favoritesAPI.add(id);
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  if (!place) return <div className="loading">Loading...</div>;

  return (
    <div className="place-details">
      <div className="details-header">
        <img src={place.imageUrl} alt={place.name} />
        <div className="header-overlay">
          <h1>{place.name}</h1>
          <p><FaMapMarkerAlt /> {place.location}</p>
          <div className="header-actions">
            <span className="rating"><FaStar /> {place.rating}</span>
            <button onClick={handleFavorite} className="favorite-btn">
              <FaHeart /> Add to Favorites
            </button>
          </div>
        </div>
      </div>

      <div className="details-content">
        <section className="description">
          <h2>{t('about')}</h2>
          <p>{place.description}</p>
          <span className="category-badge">{place.category}</span>
        </section>

        {weather && (
          <section className="weather-info">
            <h2><FaCloud /> {t('weather')}</h2>
            <div className="weather-card">
              <div className="weather-temp">{weather.temp}°C</div>
              <div className="weather-desc">{weather.description}</div>
              <div className="weather-humidity">Humidity: {weather.humidity}%</div>
            </div>
          </section>
        )}

        {place.latitude && place.longitude && (
          <section className="location-map">
            <h2>{t('location')}</h2>
            <MapContainer center={[place.latitude, place.longitude]} zoom={13} style={{ height: '400px' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[place.latitude, place.longitude]} />
            </MapContainer>
          </section>
        )}

        <SmartTravelCompanion place={place} />

        {nearbyPlaces.length > 0 && (
          <section className="nearby-section">
            <h2>📍 {t('nearby')}</h2>
            <div className="nearby-grid">
              {nearbyPlaces.map(nearbyPlace => (
                <PlaceCard key={nearbyPlace.id} place={nearbyPlace} />
              ))}
            </div>
          </section>
        )}

        <section className="reviews">
          <h2>{t('reviews')}</h2>
          {user && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit">{t('addReview')}</button>
            </form>
          )}

          <div className="reviews-list">
            {place.reviews?.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <strong>{review.userName}</strong>
                  <span className="review-rating">
                    {[...Array(review.rating)].map((_, i) => <FaStar key={i} color="#ffc107" />)}
                  </span>
                </div>
                <p>{review.comment}</p>
                <small>{new Date(review.created_at).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlaceDetails;

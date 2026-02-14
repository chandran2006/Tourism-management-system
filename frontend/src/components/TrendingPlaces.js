import React, { useState, useEffect } from 'react';
import { enhancedAPI } from '../services/api';
import PlaceCard from './PlaceCard';
import { useLanguage } from '../context/LanguageContext';
import './TrendingPlaces.css';

const TrendingPlaces = () => {
  const [places, setPlaces] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await enhancedAPI.getTrending();
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching trending places:', error);
    }
  };

  return (
    <section className="trending-section">
      <h2>🔥 {t('trending')}</h2>
      <div className="trending-grid">
        {places.map(place => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </section>
  );
};

export default TrendingPlaces;

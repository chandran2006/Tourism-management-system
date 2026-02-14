import React, { useState } from 'react';
import { placesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaMapMarkedAlt, FaCalendarAlt, FaSave } from 'react-icons/fa';
import './TravelPlanner.css';

const TravelPlanner = () => {
  const [city, setCity] = useState('');
  const [duration, setDuration] = useState(1);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await placesAPI.generateItinerary({ city, duration });
      setItinerary(response.data);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('Error generating itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!user) return alert('Please login to save plans');
    const planName = prompt('Enter plan name:');
    if (!planName) return;
    alert('Plan saved successfully!');
  };

  return (
    <div className="travel-planner">
      <div className="planner-header">
        <h1><FaMapMarkedAlt /> {t('planner')}</h1>
        <p>Plan your perfect trip with AI-powered recommendations</p>
      </div>

      <form onSubmit={handleGenerate} className="planner-form">
        <div className="form-group">
          <label>{t('city')}</label>
          <input
            type="text"
            placeholder="e.g., Goa, Jaipur, Kerala"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('duration')} ({t('days')})</label>
          <input
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : t('generate')}
        </button>
      </form>

      {itinerary && (
        <div className="itinerary-result">
          <div className="itinerary-header">
            <h2>Your {itinerary.duration}-Day Trip to {itinerary.city}</h2>
            {user && (
              <button onClick={handleSavePlan} className="save-plan-btn">
                <FaSave /> {t('savePlan')}
              </button>
            )}
          </div>
          {itinerary.itinerary.map((day) => (
            <div key={day.day} className="day-plan">
              <h3><FaCalendarAlt /> Day {day.day}</h3>
              <div className="day-places">
                {day.places.map((place) => (
                  <div key={place.id} className="itinerary-place">
                    <img src={place.imageUrl} alt={place.name} />
                    <div className="place-info">
                      <h4>{place.name}</h4>
                      <p>{place.description}</p>
                      <span className="place-category">{place.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelPlanner;

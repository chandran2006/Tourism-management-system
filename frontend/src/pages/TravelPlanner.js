import React, { useState } from 'react';
import { placesAPI } from '../services/api';
import { FaMapMarkedAlt, FaCalendarAlt } from 'react-icons/fa';
import './TravelPlanner.css';

const TravelPlanner = () => {
  const [city, setCity] = useState('');
  const [duration, setDuration] = useState(1);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="travel-planner">
      <div className="planner-header">
        <h1><FaMapMarkedAlt /> Smart Travel Planner</h1>
        <p>Plan your perfect trip with AI-powered recommendations</p>
      </div>

      <form onSubmit={handleGenerate} className="planner-form">
        <div className="form-group">
          <label>Destination City</label>
          <input
            type="text"
            placeholder="e.g., Goa, Jaipur, Kerala"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Trip Duration (days)</label>
          <input
            type="number"
            min="1"
            max="7"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </form>

      {itinerary && (
        <div className="itinerary-result">
          <h2>Your {itinerary.duration}-Day Trip to {itinerary.city}</h2>
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

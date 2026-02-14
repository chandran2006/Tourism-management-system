import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placesAPI } from '../services/api';
import OptimizedImage from '../components/OptimizedImage';
import { FaClock, FaMapMarkerAlt, FaLightbulb, FaUtensils, FaHotel } from 'react-icons/fa';
import './TripTimeline.css';

const TripTimeline = () => {
  const [city, setCity] = useState('');
  const [duration, setDuration] = useState('1');
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await placesAPI.generateTimeline({ city, duration });
      setTimeline(response.data);
    } catch (error) {
      console.error('Error generating timeline:', error);
      alert('Error generating timeline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-timeline-page">
      <div className="timeline-header">
        <h1>📅 Dynamic Smart Trip Timeline</h1>
        <p>Plan your perfect day-by-day itinerary</p>
      </div>

      <form onSubmit={handleGenerate} className="timeline-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Enter city (e.g., Goa, Jaipur)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            {[...Array(30)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1} Day{i > 0 ? 's' : ''} Trip</option>
            ))}
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Timeline'}
          </button>
        </div>
      </form>

      {timeline && timeline.timeline.length > 0 && (
        <div className="timeline-result">
          <h2>Your {duration}-Day Trip to {timeline.city}</h2>
          
          <div className="timeline-container">
            {timeline.timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  {index < timeline.timeline.length - 1 && <div className="marker-line"></div>}
                </div>
                
                <div className="timeline-content">
                  <div className="timeline-time">
                    <FaClock /> {item.time}
                    <span className="day-badge">{item.day}</span>
                  </div>
                  
                  <div className="timeline-card" onClick={() => navigate(`/place/${item.place.id}`)}>
                    <OptimizedImage 
                      src={item.place.imageUrl} 
                      alt={item.place.name}
                      width="100%"
                      height="200px"
                      className="timeline-image"
                    />
                    
                    <div className="timeline-info">
                      <h3>{item.place.name}</h3>
                      <p className="timeline-category">{item.place.category}</p>
                      <p className="timeline-description">{item.place.description}</p>
                      
                      <div className="timeline-meta">
                        <span><FaClock /> {item.place.visitDuration}</span>
                        <span><FaMapMarkerAlt /> {item.place.location}</span>
                      </div>
                      
                      {item.suggestedActivity && (
                        <div className="timeline-activity">
                          <strong>Activity:</strong> {item.suggestedActivity}
                        </div>
                      )}
                      
                      {item.mealSuggestion && (
                        <div className="timeline-meal">
                          <FaUtensils /> <strong>Meal:</strong> {item.mealSuggestion}
                        </div>
                      )}
                      
                      {item.accommodation && (
                        <div className="timeline-hotel">
                          <FaHotel /> <strong>Stay:</strong> {item.accommodation}
                        </div>
                      )}
                      
                      {item.place.travelTips && (
                        <div className="timeline-tips">
                          <FaLightbulb /> <strong>Tip:</strong> {item.place.travelTips.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {timeline && timeline.timeline.length === 0 && (
        <div className="no-results">
          <p>No places found for {timeline.city}. Try another city!</p>
        </div>
      )}
    </div>
  );
};

export default TripTimeline;

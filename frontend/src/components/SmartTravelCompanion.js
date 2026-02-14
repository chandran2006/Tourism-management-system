import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaUsers, FaLightbulb, FaUtensils, FaArrowRight } from 'react-icons/fa';
import './SmartTravelCompanion.css';

const SmartTravelCompanion = ({ place }) => {
  const navigate = useNavigate();

  if (!place.bestTime) return null;

  const getCrowdColor = (level) => {
    switch(level) {
      case 'Low': return '#27ae60';
      case 'Medium': return '#f39c12';
      case 'High': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <section className="smart-companion">
      <h2>🧭 Smart Travel Companion</h2>
      
      <div className="companion-grid">
        <div className="companion-card">
          <div className="card-icon" style={{background: '#3498db'}}>
            <FaClock />
          </div>
          <h3>Best Time to Visit</h3>
          <p>{place.bestTime}</p>
        </div>

        <div className="companion-card">
          <div className="card-icon" style={{background: '#9b59b6'}}>
            <FaClock />
          </div>
          <h3>Visit Duration</h3>
          <p>{place.visitDuration}</p>
        </div>

        <div className="companion-card">
          <div className="card-icon" style={{background: getCrowdColor(place.crowdLevel)}}>
            <FaUsers />
          </div>
          <h3>Crowd Level</h3>
          <p className="crowd-badge" style={{color: getCrowdColor(place.crowdLevel)}}>
            {place.crowdLevel}
          </p>
        </div>
      </div>

      {place.travelTips && (
        <div className="companion-tips">
          <div className="tips-header">
            <FaLightbulb /> <h3>Travel Tips</h3>
          </div>
          <p>{place.travelTips}</p>
        </div>
      )}

      {place.nearbyFood && (
        <div className="companion-food">
          <div className="food-header">
            <FaUtensils /> <h3>Nearby Food & Rest Places</h3>
          </div>
          <p>{place.nearbyFood}</p>
        </div>
      )}

      {place.nextPlace && (
        <div className="companion-next">
          <h3>Suggested Next Destination</h3>
          <div className="next-card" onClick={() => navigate(`/place/${place.nextPlace.id}`)}>
            <img src={place.nextPlace.imageUrl} alt={place.nextPlace.name} />
            <div className="next-info">
              <h4>{place.nextPlace.name}</h4>
              <p>{place.nextPlace.location}</p>
              <span className="next-category">{place.nextPlace.category}</span>
            </div>
            <FaArrowRight className="next-arrow" />
          </div>
        </div>
      )}
    </section>
  );
};

export default SmartTravelCompanion;

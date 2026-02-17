import React, { useState } from 'react';
import axios from 'axios';
import './TransportCalculator.css';

const TransportCalculator = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    transportMode: 'all'
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const transportIcons = {
    cab: '🚗',
    bus: '🚌',
    train: '🚆',
    auto: '🛺',
    flight: '✈️'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const calculateDistance = async () => {
    if (!formData.from || !formData.to) {
      setError('Please enter both source and destination');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/transport/calculate`, {
        from: formData.from,
        to: formData.to,
        transportMode: formData.transportMode === 'all' ? undefined : formData.transportMode
      });

      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (err) {
      console.error('Error calculating route:', err);
      setError(err.response?.data?.message || 'Failed to calculate route. Route may not be available.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const formatTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} mins`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="transport-calculator">
      <div className="calculator-header">
        <h1>Transport Calculator</h1>
        <p>Find the best way to travel between cities</p>
      </div>

      <div className="calculator-card">
        <form className="calculator-form" onSubmit={(e) => { e.preventDefault(); calculateDistance(); }}>
          <div className="form-row">
            <div className="form-group">
              <label>From (Source City)</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                placeholder="e.g., Mumbai"
                required
              />
            </div>

            <div className="form-group">
              <label>To (Destination City)</label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="e.g., Pune"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Transport Mode</label>
            <select
              name="transportMode"
              value={formData.transportMode}
              onChange={handleInputChange}
            >
              <option value="all">Show All Options</option>
              <option value="cab">Cab</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="auto">Auto Rickshaw</option>
              <option value="flight">Flight</option>
            </select>
          </div>

          <div className="form-group full-width">
            <button 
              type="submit" 
              className="calculate-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Calculating...' : 'Calculate Route'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {isLoading && (
        <div className="loading">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p>Calculating best routes...</p>
        </div>
      )}

      {results && !isLoading && (
        <div className="results-section">
          <h2>Available Transport Options</h2>

          <div className="route-info">
            <div className="route-points">
              <div className="point">
                <span>📍</span>
                <span>{results.from}</span>
              </div>
              <div className="arrow-icon">→</div>
              <div className="point">
                <span>📍</span>
                <span>{results.to}</span>
              </div>
            </div>
            <div className="distance-badge">
              {results.distanceKm} km
            </div>
          </div>

          <div className="transport-options">
            {results.options && results.options.length > 0 ? (
              results.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`transport-option ${option.recommended ? 'recommended' : ''}`}
                >
                  <div className="option-header">
                    <span className="transport-icon">
                      {transportIcons[option.mode] || '🚗'}
                    </span>
                    {option.recommended && (
                      <span className="recommended-badge">Best Choice</span>
                    )}
                  </div>

                  <div className="transport-name">{option.mode}</div>

                  <div className="transport-details">
                    <div className="detail-row">
                      <span className="detail-label">Travel Time:</span>
                      <span className="detail-value">
                        {formatTime(option.travelTimeHours)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cost:</span>
                      <span className="detail-value cost-highlight">
                        {formatCurrency(option.cost)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : results.cost ? (
              <div className="transport-option">
                <div className="option-header">
                  <span className="transport-icon">
                    {transportIcons[results.mode] || '🚗'}
                  </span>
                </div>

                <div className="transport-name">{results.mode}</div>

                <div className="transport-details">
                  <div className="detail-row">
                    <span className="detail-label">Travel Time:</span>
                    <span className="detail-value">
                      {formatTime(results.travelTimeHours)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Cost:</span>
                    <span className="detail-value cost-highlight">
                      {formatCurrency(results.cost)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportCalculator;

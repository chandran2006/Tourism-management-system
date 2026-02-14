import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => (
  <div className={`spinner-container spinner-${size}`}>
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

export default LoadingSpinner;

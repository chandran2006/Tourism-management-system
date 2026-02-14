import React, { useState } from 'react';
import './OptimizedImage.css';

const OptimizedImage = ({ src, alt, width, height, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div 
      className={`optimized-image-wrapper ${className}`}
      style={{ width: width || '100%', height: height || 'auto' }}
    >
      {!loaded && !error && (
        <div className="image-placeholder">
          <div className="placeholder-shimmer"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: loaded ? 1 : 0 }}
        className="optimized-image"
      />
      {error && <div className="image-error">Failed to load</div>}
    </div>
  );
};

export default OptimizedImage;

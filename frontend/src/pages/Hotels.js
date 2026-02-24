import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hotels.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    search: '',
    sortBy: 'rating_desc'
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    loadCities();
    loadHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, hotels]);

  const loadCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/hotels/cities`);
      if (response.data.success) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/hotels`);
      if (response.data.success) {
        setHotels(response.data.data.hotels);
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...hotels];

    // City filter
    if (filters.city) {
      filtered = filtered.filter(h => 
        h.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Price range
    if (filters.minPrice) {
      filtered = filtered.filter(h => 
        parseFloat(h.price_per_night) >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(h => 
        parseFloat(h.price_per_night) <= parseFloat(filters.maxPrice)
      );
    }

    // Rating filter
    if (filters.minRating) {
      filtered = filtered.filter(h => 
        parseFloat(h.rating) >= parseFloat(filters.minRating)
      );
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(searchLower) ||
        h.city.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    switch(filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => parseFloat(a.price_per_night) - parseFloat(b.price_per_night));
        break;
      case 'price_desc':
        filtered.sort((a, b) => parseFloat(b.price_per_night) - parseFloat(a.price_per_night));
        break;
      case 'rating_desc':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'rating_asc':
        filtered.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
        break;
      default:
        break;
    }

    setFilteredHotels(filtered);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      search: '',
      sortBy: 'rating_desc'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('½');
    }
    return stars.join('');
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const parseAmenities = (amenities) => {
    try {
      if (typeof amenities === 'string') {
        return JSON.parse(amenities);
      }
      return Array.isArray(amenities) ? amenities : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="hotels-page">
      <div className="hotels-header">
        <h1>Find Your Perfect Stay</h1>
        <p>Discover the best hotels for your next adventure</p>
      </div>

      <div className="hotels-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name or city..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city.city} value={city.city}>
                  {city.city} ({city.hotel_count})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range (per night)</label>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            <div className="rating-filter">
              {[4.5, 4.0, 3.5, 3.0].map(rating => (
                <label key={rating} className="rating-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating.toString()}
                    onChange={() => setFilters({ ...filters, minRating: rating.toString() })}
                  />
                  <span>{rating}+ ★</span>
                </label>
              ))}
            </div>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </aside>

        {/* Hotels Content */}
        <div className="hotels-content">
          <div className="hotels-toolbar">
            <div className="results-count">
              {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
            </div>
            <select
              className="sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="rating_desc">Rating: High to Low</option>
              <option value="rating_asc">Rating: Low to High</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {isLoading ? (
            <div className="loading">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p>Loading hotels...</p>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3>No Hotels Found</h3>
              <p>Try adjusting your filters to see more results</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {filteredHotels.map(hotel => (
                <div key={hotel.id} className="hotel-card">
                  <img
                    src={hotel.image_url || 'https://via.placeholder.com/400x200'}
                    alt={hotel.name}
                    className="hotel-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                  <div className="hotel-info">
                    <h3 className="hotel-name">{hotel.name}</h3>
                    
                    <div className="hotel-location">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{hotel.city}</span>
                      {hotel.distance_from_center && (
                        <span style={{ color: '#999' }}>
                          • {hotel.distance_from_center} km from center
                        </span>
                      )}
                    </div>

                    <div className="hotel-rating">
                      <span className="stars">{renderStars(hotel.rating)}</span>
                      <span className="rating-value">{hotel.rating}</span>
                    </div>

                    <div className="hotel-amenities">
                      {parseAmenities(hotel.amenities).slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>

                    <div className="hotel-footer">
                      <div className="hotel-price">
                        <span className="price-amount">{formatPrice(hotel.price_per_night)}</span>
                        <span className="price-label">per night</span>
                      </div>
                      <button className="view-details-btn">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hotels;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { placesAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PlaceCard from '../components/PlaceCard';
import { FaFilter, FaMap, FaList } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Explore.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid');
  const { user } = useAuth();

  // Optimized: Debounced search and memoized fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 300); // Debounce search by 300ms
    
    return () => clearTimeout(timer);
  }, [category, location, search]);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  const fetchPlaces = async () => {
    try {
      const params = { limit: 100 }; // Add limit for performance
      if (category) params.category = category;
      if (location) params.location = location;
      if (search) params.search = search;
      const response = await placesAPI.getAll(params);
      setPlaces(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaces([]);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      setFavorites(response.data.map(f => f.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleFavorite = async (placeId) => {
    if (!user) return alert('Please login to add favorites');
    try {
      if (favorites.includes(placeId)) {
        await favoritesAPI.remove(placeId);
        setFavorites(favorites.filter(id => id !== placeId));
      } else {
        await favoritesAPI.add(placeId);
        setFavorites([...favorites, placeId]);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  return (
    <div className="explore">
      <div className="explore-header">
        <h1>Explore Destinations</h1>
        <div className="view-toggle">
          <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>
            <FaList /> Grid
          </button>
          <button onClick={() => setViewMode('map')} className={viewMode === 'map' ? 'active' : ''}>
            <FaMap /> Map
          </button>
        </div>
      </div>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Nature">Nature</option>
          <option value="Temple">Temple</option>
          <option value="Beach">Beach</option>
          <option value="Food">Food</option>
          <option value="Adventure">Adventure</option>
          <option value="Heritage">Heritage</option>
        </select>
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search places..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {viewMode === 'grid' ? (
        <div className="places-grid">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onFavorite={handleFavorite}
              isFavorite={favorites.includes(place.id)}
            />
          ))}
        </div>
      ) : (
        <div className="map-view">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '600px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {places.map((place) => (
              place.latitude && place.longitude && (
                <Marker key={place.id} position={[place.latitude, place.longitude]}>
                  <Popup>
                    <strong>{place.name}</strong><br />
                    {place.location}<br />
                    Rating: {place.rating} ⭐
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Explore;

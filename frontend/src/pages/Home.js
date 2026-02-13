import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { placesAPI } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import { FaSearch, FaMountain, FaUmbrellaBeach, FaUtensils, FaLandmark, FaTree, FaHiking } from 'react-icons/fa';
import './Home.css';

const categories = [
  { name: 'Nature', icon: <FaTree /> },
  { name: 'Temple', icon: <FaLandmark /> },
  { name: 'Beach', icon: <FaUmbrellaBeach /> },
  { name: 'Food', icon: <FaUtensils /> },
  { name: 'Adventure', icon: <FaHiking /> },
  { name: 'Heritage', icon: <FaMountain /> },
];

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await placesAPI.getAll({ limit: 8 });
      setPlaces(response.data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?search=${search}`);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore amazing tourist destinations with smart recommendations</p>
          <form onSubmit={handleSearch} className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search destinations, cities, or attractions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="categories">
        <h2>Explore by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              onClick={() => navigate(`/explore?category=${cat.name}`)}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="popular-places">
        <h2>Popular Destinations</h2>
        <div className="places-grid">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { placesAPI } from '../services/api';
import HeroSlider from '../components/HeroSlider';
import PlaceCard from '../components/PlaceCard';
import { FaMountain, FaUmbrellaBeach, FaUtensils, FaLandmark, FaTree, FaHiking } from 'react-icons/fa';
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await placesAPI.getAll();
      console.log('Places response:', response.data);
      if (Array.isArray(response.data)) {
        setPlaces(response.data.slice(0, 12));
      } else {
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaces([]);
    }
  };

  return (
    <div className="home">
      <HeroSlider />

      <section className="categories scroll-animate">
        <div className="section-header">
          <h2>Explore by Category</h2>
          <p>Choose your perfect travel experience</p>
        </div>
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

      <section className="popular-places scroll-animate">
        <div className="section-header">
          <h2>Popular Destinations</h2>
          <p>Discover the most loved places by travelers</p>
        </div>
        <div className="places-grid">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
        <button className="view-all-btn" onClick={() => navigate('/explore')}>
          View All Destinations
        </button>
      </section>
    </div>
  );
};

export default Home;

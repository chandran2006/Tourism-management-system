import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSlider.css';

const HeroSlider = () => {
  const navigate = useNavigate();

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80',
      title: 'Discover Incredible India',
      subtitle: 'Explore the rich heritage and diverse culture of our beautiful nation'
    },
    {
      url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=80',
      title: 'Experience Divine Temples',
      subtitle: 'Journey through ancient spiritual destinations and sacred sites'
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      title: 'Breathtaking Natural Beauty',
      subtitle: 'Immerse yourself in pristine landscapes and scenic wonders'
    },
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
      title: 'Coastal Paradise Awaits',
      subtitle: 'Relax on golden beaches with turquoise waters and palm trees'
    },
    {
      url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=80',
      title: 'Adventure & Thrills',
      subtitle: 'Create unforgettable memories with exciting outdoor activities'
    },
    {
      url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=80',
      title: 'Majestic Mountain Ranges',
      subtitle: 'Witness the grandeur of Himalayan peaks and hill stations'
    }
  ];

  return (
    <div className="hero-slider-container">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="hero-swiper"
      >
        {heroImages.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="hero-slide">
              <div className="hero-image-wrapper">
                <img 
                  src={slide.url} 
                  alt={slide.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <button 
                  className="hero-btn"
                  onClick={() => navigate('/explore')}
                >
                  Explore Destinations
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;

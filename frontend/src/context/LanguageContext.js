import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    home: 'Home',
    explore: 'Explore',
    planner: 'Trip Planner',
    favorites: 'Favorites',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    search: 'Search destinations...',
    categories: 'Categories',
    trending: 'Trending Places',
    nearby: 'Nearby Attractions',
    weather: 'Weather',
    budget: 'Budget Estimator',
    savePlan: 'Save Plan',
    myPlans: 'My Plans',
    reviews: 'Reviews',
    addReview: 'Add Review',
    rating: 'Rating',
    location: 'Location',
    about: 'About',
    city: 'City',
    duration: 'Duration',
    days: 'days',
    generate: 'Generate Itinerary',
    travelType: 'Travel Type',
    budget_type: 'Budget',
    moderate: 'Moderate',
    luxury: 'Luxury',
    calculate: 'Calculate',
    total: 'Total',
    perPerson: 'Per Person',
    accommodation: 'Accommodation',
    transport: 'Transport',
    food: 'Food',
    activities: 'Activities'
  },
  ta: {
    home: 'முகப்பு',
    explore: 'ஆராய்',
    planner: 'பயண திட்டம்',
    favorites: 'விருப்பங்கள்',
    admin: 'நிர்வாகி',
    login: 'உள்நுழை',
    logout: 'வெளியேறு',
    search: 'இடங்களைத் தேடு...',
    categories: 'வகைகள்',
    trending: 'பிரபலமான இடங்கள்',
    nearby: 'அருகிலுள்ள இடங்கள்',
    weather: 'வானிலை',
    budget: 'செலவு மதிப்பீடு',
    savePlan: 'திட்டத்தை சேமி',
    myPlans: 'என் திட்டங்கள்',
    reviews: 'விமர்சனங்கள்',
    addReview: 'விமர்சனம் சேர்',
    rating: 'மதிப்பீடு',
    location: 'இடம்',
    about: 'பற்றி',
    city: 'நகரம்',
    duration: 'காலம்',
    days: 'நாட்கள்',
    generate: 'பயண திட்டம் உருவாக்கு',
    travelType: 'பயண வகை',
    budget_type: 'சிக்கனம்',
    moderate: 'மிதமான',
    luxury: 'ஆடம்பரம்',
    calculate: 'கணக்கிடு',
    total: 'மொத்தம்',
    perPerson: 'ஒரு நபருக்கு',
    accommodation: 'தங்குமிடம்',
    transport: 'போக்குவரத்து',
    food: 'உணவு',
    activities: 'செயல்பாடுகள்'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

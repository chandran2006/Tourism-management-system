import React, { useState } from 'react';
import { enhancedAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import './BudgetEstimator.css';

const BudgetEstimator = () => {
  const [formData, setFormData] = useState({
    places: 3,
    travelType: 'moderate',
    duration: 3
  });
  const [budget, setBudget] = useState(null);
  const { t } = useLanguage();

  const handleCalculate = async () => {
    try {
      const response = await enhancedAPI.calculateBudget(formData);
      setBudget(response.data);
    } catch (error) {
      console.error('Error calculating budget:', error);
    }
  };

  return (
    <div className="budget-estimator">
      <h3>💰 {t('budget')}</h3>
      <div className="budget-form">
        <label>
          {t('duration')} ({t('days')}):
          <input
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
          />
        </label>
        <label>
          Number of Places:
          <input
            type="number"
            min="1"
            value={formData.places}
            onChange={(e) => setFormData({...formData, places: parseInt(e.target.value)})}
          />
        </label>
        <label>
          {t('travelType')}:
          <select
            value={formData.travelType}
            onChange={(e) => setFormData({...formData, travelType: e.target.value})}
          >
            <option value="budget">{t('budget_type')}</option>
            <option value="moderate">{t('moderate')}</option>
            <option value="luxury">{t('luxury')}</option>
          </select>
        </label>
        <button onClick={handleCalculate}>{t('calculate')}</button>
      </div>

      {budget && (
        <div className="budget-result">
          <h4>{t('total')}: ₹{budget.total.toLocaleString()}</h4>
          <div className="budget-breakdown">
            <p>{t('accommodation')}: ₹{budget.breakdown.accommodation.toLocaleString()}</p>
            <p>{t('transport')}: ₹{budget.breakdown.transport.toLocaleString()}</p>
            <p>{t('food')}: ₹{budget.breakdown.food.toLocaleString()}</p>
            <p>{t('activities')}: ₹{budget.breakdown.activities.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetEstimator;

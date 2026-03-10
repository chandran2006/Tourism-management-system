import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TripPlanner.css';

const TripPlanner = () => {
  const [activeTab, setActiveTab] = useState('my-trips');
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    plannedBudget: '',
    transportMode: 'cab',
    preferences: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (activeTab === 'my-trips') {
      loadTrips();
    }
  }, [activeTab]);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTrips(response.data.data);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
      alert('Failed to load trips. Please login again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = getAuthToken();
      const payload = {
        tripName: formData.tripName,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        plannedBudget: parseFloat(formData.plannedBudget),
        transportMode: formData.transportMode,
        preferences: formData.preferences ? JSON.parse(formData.preferences) : {}
      };

      const response = await axios.post(
        `${API_URL}/trips`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Trip created successfully!');
        setFormData({
          tripName: '',
          destination: '',
          startDate: '',
          endDate: '',
          plannedBudget: '',
          transportMode: 'cab',
          preferences: ''
        });
        setActiveTab('my-trips');
        loadTrips();
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      alert(error.response?.data?.message || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (tripId) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSelectedTrip(response.data.data);
        setActiveTab('details');
      }
    } catch (error) {
      console.error('Error loading trip details:', error);
      alert('Failed to load trip details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Trip deleted successfully');
      loadTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const getBudgetPercentage = (spent, planned) => {
    return Math.round((spent / planned) * 100);
  };

  const getBudgetClass = (percentage) => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 75) return 'warning';
    return '';
  };

  const renderCreateTripForm = () => (
    <div className="create-trip-form">
      <form onSubmit={handleCreateTrip}>
        <div className="form-grid">
          <div className="form-group">
            <label>Trip Name *</label>
            <input
              type="text"
              name="tripName"
              value={formData.tripName}
              onChange={handleInputChange}
              placeholder="e.g., Summer Vacation 2024"
              required
            />
          </div>

          <div className="form-group">
            <label>Destination *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., Goa, Mumbai"
              required
            />
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Planned Budget (₹) *</label>
            <input
              type="number"
              name="plannedBudget"
              value={formData.plannedBudget}
              onChange={handleInputChange}
              placeholder="e.g., 50000"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Preferred Transport Mode</label>
            <select
              name="transportMode"
              value={formData.transportMode}
              onChange={handleInputChange}
            >
              <option value="cab">Cab</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="flight">Flight</option>
              <option value="auto">Auto Rickshaw</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Preferences (JSON format, optional)</label>
            <textarea
              name="preferences"
              value={formData.preferences}
              onChange={handleInputChange}
              placeholder='{"hotelType": "budget", "interests": ["beaches", "nightlife"]}'
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('my-trips')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderMyTrips = () => (
    <div className="trips-container">
      {isLoading ? (
        <div className="loading-state">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="empty-trips">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3>No Trips Yet</h3>
          <p>Create your first trip to get started!</p>
          <button className="btn btn-primary" onClick={() => setActiveTab('create')}>
            Create Trip
          </button>
        </div>
      ) : (
        <div className="trips-list">
          {trips.map(trip => {
            const budgetPercentage = trip.total_spent 
              ? getBudgetPercentage(trip.total_spent, trip.planned_budget)
              : 0;

            return (
              <div key={trip.id} className="trip-card">
                <div className="trip-card-header">
                  <div className="trip-card-title">
                    <h3>{trip.trip_name}</h3>
                    <div className="trip-destination">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{trip.destination}</span>
                    </div>
                  </div>
                  <span className={`trip-status status-${trip.status}`}>{trip.status}</span>
                </div>

                <div className="trip-card-body">
                  <div className="trip-dates">
                    <div className="date-item">
                      <span className="date-label">Start</span>
                      <span className="date-value">{formatDate(trip.start_date)}</span>
                    </div>
                    <div className="date-separator">→</div>
                    <div className="date-item">
                      <span className="date-label">End</span>
                      <span className="date-value">{formatDate(trip.end_date)}</span>
                    </div>
                  </div>

                  <div className="trip-budget">
                    <div className="budget-header">
                      <span>Budget</span>
                      <span className={`budget-percentage ${getBudgetClass(budgetPercentage)}`}>
                        {budgetPercentage}% used
                      </span>
                    </div>
                    <div className="budget-bar">
                      <div 
                        className={`budget-fill ${getBudgetClass(budgetPercentage)}`}
                        style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="budget-amounts">
                      <span>{formatCurrency(trip.total_spent || 0)}</span>
                      <span>{formatCurrency(trip.planned_budget)}</span>
                    </div>
                  </div>
                </div>

                <div className="trip-card-footer">
                  <button className="btn btn-outline" onClick={() => handleViewDetails(trip.id)}>
                    View Details
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteTrip(trip.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderTripDetails = () => {
    if (!selectedTrip) return null;

    return (
      <div className="trip-details">
        <button className="btn btn-back" onClick={() => setActiveTab('my-trips')}>
          ← Back to Trips
        </button>
        
        <div className="trip-details-header">
          <h2>{selectedTrip.trip_name}</h2>
          <span className={`trip-status status-${selectedTrip.status}`}>{selectedTrip.status}</span>
        </div>

        <div className="trip-details-grid">
          <div className="detail-card">
            <h3>Trip Information</h3>
            <div className="detail-item">
              <span className="detail-label">Destination:</span>
              <span className="detail-value">{selectedTrip.destination}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Start Date:</span>
              <span className="detail-value">{formatDate(selectedTrip.start_date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">End Date:</span>
              <span className="detail-value">{formatDate(selectedTrip.end_date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Transport:</span>
              <span className="detail-value">{selectedTrip.transport_mode}</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>Budget Summary</h3>
            <div className="detail-item">
              <span className="detail-label">Planned Budget:</span>
              <span className="detail-value">{formatCurrency(selectedTrip.planned_budget)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Spent:</span>
              <span className="detail-value">{formatCurrency(selectedTrip.expenseSummary?.total || 0)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Remaining:</span>
              <span className="detail-value">{formatCurrency(selectedTrip.expenseSummary?.remaining || selectedTrip.planned_budget)}</span>
            </div>
          </div>
        </div>

        {selectedTrip.expenses && selectedTrip.expenses.length > 0 && (
          <div className="expenses-section">
            <h3>Expenses</h3>
            <div className="expenses-list">
              {selectedTrip.expenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <span className="expense-category">{expense.category}</span>
                    <span className="expense-description">{expense.description}</span>
                    <span className="expense-date">{formatDate(expense.expense_date)}</span>
                  </div>
                  <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="trip-planner-page">
      <div className="trip-planner-header">
        <h1>Trip Planner</h1>
        <p>Plan and manage your trips efficiently</p>
      </div>

      <div className="trip-planner-tabs">
        <button 
          className={`tab ${activeTab === 'my-trips' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-trips')}
        >
          My Trips
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create New Trip
        </button>
      </div>

      <div className="trip-planner-content">
        {activeTab === 'my-trips' && renderMyTrips()}
        {activeTab === 'create' && renderCreateTripForm()}
        {activeTab === 'details' && renderTripDetails()}
      </div>
    </div>
  );
};

export default TripPlanner;

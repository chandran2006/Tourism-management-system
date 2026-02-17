import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpenseTracker.css';

const ExpenseTracker = ({ tripId }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const categories = ['Food', 'Hotel', 'Transport', 'Entry', 'Shopping', 'Other'];
  const categoryColors = {
    Food: '#f59e0b',
    Hotel: '#3b82f6',
    Transport: '#10b981',
    Entry: '#ec4899',
    Shopping: '#6366f1',
    Other: '#6b7280'
  };

  useEffect(() => {
    loadExpenses();
    if (tripId) {
      loadTripSummary();
    }
  }, [tripId]);

  const loadExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = tripId 
        ? `${API_URL}/expenses?tripId=${tripId}`
        : `${API_URL}/expenses`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setExpenses(response.data.data.expenses);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const loadTripSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/expenses/trip/${tripId}/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        tripId: tripId || null,
        amount: parseFloat(formData.amount)
      };

      if (editingExpense) {
        // Update expense
        await axios.put(
          `${API_URL}/expenses/${editingExpense.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create expense
        await axios.post(
          `${API_URL}/expenses`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Reload data
      await loadExpenses();
      if (tripId) {
        await loadTripSummary();
      }

      // Reset form
      setFormData({
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingExpense(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert(error.response?.data?.message || 'Failed to save expense');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      amount: expense.amount,
      description: expense.description || '',
      date: expense.expense_date.split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await loadExpenses();
      if (tripId) {
        await loadTripSummary();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const getCategoryBreakdown = () => {
    if (!expenses.length) return [];

    const breakdown = {};
    expenses.forEach(exp => {
      const cat = exp.category;
      breakdown[cat] = (breakdown[cat] || 0) + parseFloat(exp.amount);
    });

    return Object.entries(breakdown).map(([category, total]) => ({
      category,
      total,
      color: categoryColors[category]
    }));
  };

  const getTotalSpent = () => {
    return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="expense-tracker">
      <div className="expense-tracker-header">
        <h2>Expense Tracker</h2>
        <button className="add-expense-btn" onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <>
          {summary.isOverBudget && (
            <div className="warning-banner danger">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>⚠️ You have exceeded your budget by {formatCurrency(Math.abs(summary.remaining))}!</p>
            </div>
          )}

          <div className="expense-summary">
            <div className="summary-card">
              <h3>Planned Budget</h3>
              <div className="amount">{formatCurrency(summary.plannedBudget)}</div>
              <div className="label">{summary.tripName || 'Total Budget'}</div>
            </div>

            <div className="summary-card">
              <h3>Total Spent</h3>
              <div className={`amount ${summary.percentageUsed > 90 ? 'danger' : summary.percentageUsed > 75 ? 'warning' : 'success'}`}>
                {formatCurrency(summary.totalExpense)}
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${summary.percentageUsed > 90 ? 'danger' : summary.percentageUsed > 75 ? 'warning' : ''}`}
                  style={{ width: `${Math.min(summary.percentageUsed, 100)}%` }}
                ></div>
              </div>
              <div className="label">{summary.percentageUsed.toFixed(1)}% of budget</div>
            </div>

            <div className="summary-card">
              <h3>Remaining</h3>
              <div className={`amount ${summary.remaining < 0 ? 'danger' : 'success'}`}>
                {formatCurrency(summary.remaining)}
              </div>
              <div className="label">{summary.totalTransactions} transactions</div>
            </div>
          </div>
        </>
      )}

      {!summary && tripId === null && expenses.length > 0 && (
        <div className="expense-summary">
          <div className="summary-card">
            <h3>Total Spent</h3>
            <div className="amount success">{formatCurrency(getTotalSpent())}</div>
            <div className="label">{expenses.length} transactions</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="expense-content">
        {/* Expense List */}
        <div className="expense-list-section">
          <div className="section-header">
            <h3>Recent Expenses</h3>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4>No Expenses Yet</h4>
              <p>Start tracking your expenses by adding one above</p>
            </div>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <span className={`expense-category ${expense.category.toLowerCase()}`}>
                    {expense.category}
                  </span>
                  <div className="expense-description">
                    {expense.description || 'No description'}
                  </div>
                  <div className="expense-date">{formatDate(expense.expense_date)}</div>
                </div>
                <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                <div className="expense-actions">
                  <button className="icon-btn" onClick={() => handleEdit(expense)} title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(expense.id)} title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Category Breakdown */}
        <div className="expense-chart-section">
          <h3>Category Breakdown</h3>
          {expenses.length > 0 ? (
            <div className="category-legend">
              {getCategoryBreakdown().map(item => {
                const percentage = (item.total / getTotalSpent()) * 100;
                return (
                  <div key={item.category} className="legend-item">
                    <div className="legend-info">
                      <div className="legend-color" style={{ background: item.color }}></div>
                      <span className="legend-name">{item.category}</span>
                    </div>
                    <div>
                      <span className="legend-amount">{formatCurrency(item.total)}</span>
                      <span className="legend-name" style={{ marginLeft: '8px' }}>
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No data to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="expense-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="expense-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
            </div>

            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What was this expense for?"
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                    setFormData({
                      category: 'Food',
                      amount: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0]
                    });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : editingExpense ? 'Update' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;

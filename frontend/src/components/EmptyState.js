import React from 'react';
import './EmptyState.css';

const EmptyState = ({ message, icon, action }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon || '📭'}</div>
    <h3>{message || 'No items found'}</h3>
    {action && (
      <button onClick={action.onClick} className="empty-action">
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;

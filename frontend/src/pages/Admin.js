import React, { useState, useEffect } from 'react';
import { placesAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Admin.css';

const Admin = () => {
  const [places, setPlaces] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Nature',
    location: '',
    imageUrl: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await placesAPI.getAll();
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await placesAPI.update(editingId, formData);
        alert('Place updated successfully!');
      } else {
        await placesAPI.create(formData);
        alert('Place created successfully!');
      }
      resetForm();
      fetchPlaces();
    } catch (error) {
      alert('Error saving place');
    }
  };

  const handleEdit = (place) => {
    setFormData(place);
    setEditingId(place.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await placesAPI.delete(id);
        alert('Place deleted successfully!');
        fetchPlaces();
      } catch (error) {
        alert('Error deleting place');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Nature',
      location: '',
      imageUrl: '',
      latitude: '',
      longitude: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          <FaPlus /> Add New Place
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>{editingId ? 'Edit Place' : 'Add New Place'}</h2>
          <input name="name" placeholder="Place Name" value={formData.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Nature">Nature</option>
            <option value="Temple">Temple</option>
            <option value="Beach">Beach</option>
            <option value="Food">Food</option>
            <option value="Adventure">Adventure</option>
            <option value="Heritage">Heritage</option>
          </select>
          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
          <input name="latitude" type="number" step="any" placeholder="Latitude" value={formData.latitude} onChange={handleChange} />
          <input name="longitude" type="number" step="any" placeholder="Longitude" value={formData.longitude} onChange={handleChange} />
          <div className="form-actions">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="places-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id}>
                <td>{place.name}</td>
                <td>{place.category}</td>
                <td>{place.location}</td>
                <td>{place.rating}</td>
                <td>
                  <button onClick={() => handleEdit(place)} className="edit-btn">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(place.id)} className="delete-btn">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;

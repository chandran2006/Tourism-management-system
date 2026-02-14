import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, placesAPI } from '../services/api';
import { FaHome, FaMapMarkedAlt, FaUsers, FaPlus, FaBars, FaTimes, FaSignOutAlt, FaUser, FaEdit, FaTrash, FaSearch, FaBell, FaChartLine } from 'react-icons/fa';
import io from 'socket.io-client';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [searchPlace, setSearchPlace] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('newUser', (data) => {
      setNotifications(prev => [{ type: 'user', message: `New user: ${data.name}`, time: new Date() }, ...prev].slice(0, 10));
    });

    socket.on('newPlace', (data) => {
      setNotifications(prev => [{ type: 'place', message: `New place: ${data.name}`, time: new Date() }, ...prev].slice(0, 10));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'places') fetchPlaces();
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'overview') fetchStats();
      if (activeTab === 'places') fetchPlaces();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers(searchUser);
      setUsers(response.data.users || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await placesAPI.getAll();
      const filtered = searchPlace 
        ? response.data.filter(p => p.name.toLowerCase().includes(searchPlace.toLowerCase()))
        : response.data;
      setPlaces(filtered);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        fetchUsers();
        alert('User deleted');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleChangeRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Change role to ${newRole.toUpperCase()}?`)) {
      try {
        await adminAPI.changeRole(id, newRole);
        fetchUsers();
        alert('Role updated');
      } catch (error) {
        alert(error.response?.data?.message || 'Error changing role');
      }
    }
  };

  const handleDeletePlace = async (id) => {
    if (window.confirm('Delete this place?')) {
      try {
        await placesAPI.delete(id);
        fetchPlaces();
        alert('Place deleted');
      } catch (error) {
        alert('Error deleting place');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-profile" onClick={() => navigate('/admin/profile')} style={{cursor: 'pointer'}}>
            <div className="admin-avatar"><FaUser /></div>
            <div>
              <h2>🛡️ Admin Panel</h2>
              <p style={{fontSize: '0.85rem', opacity: 0.8, margin: '5px 0 0 0'}}>Click to edit profile</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'active' : ''}>
            <FaHome /> Dashboard
          </button>
          <button onClick={() => setActiveTab('places')} className={activeTab === 'places' ? 'active' : ''}>
            <FaMapMarkedAlt /> Manage Places
          </button>
          <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>
            <FaUsers /> Manage Users
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {loading ? <div className="loading">Loading...</div> : (
          <>
            {activeTab === 'overview' && stats && (
              <div className="overview-section">
                <div className="dashboard-header">
                  <h1>Dashboard Overview</h1>
                  <div className="notification-bell">
                    <FaBell />
                    {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
                  </div>
                </div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Places</h3>
                    <p className="stat-number">{stats.totalPlaces}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Reviews</h3>
                    <p className="stat-number">{stats.totalReviews}</p>
                  </div>
                  <div className="stat-card popular">
                    <h3>Most Popular</h3>
                    <p className="stat-name">{stats.mostPopular?.name || 'N/A'}</p>
                    <small>Rating: {stats.mostPopular?.rating || 0}</small>
                  </div>
                  <div className="stat-card">
                    <h3>Active Users</h3>
                    <p className="stat-number">{stats.activeToday || 0}</p>
                    <small>Today</small>
                  </div>
                </div>
                <div className="quick-actions">
                  <button onClick={() => navigate('/admin')} className="action-btn">
                    <FaPlus /> Add New Place
                  </button>
                  <button onClick={() => setActiveTab('places')} className="action-btn">
                    <FaMapMarkedAlt /> View All Places
                  </button>
                  <button onClick={() => setActiveTab('users')} className="action-btn">
                    <FaUsers /> View All Users
                  </button>
                </div>
                <div className="recent-activity">
                  <h2><FaChartLine /> Recent Activity</h2>
                  <div className="activity-list">
                    {notifications.slice(0, 5).map((notif, i) => (
                      <div key={i} className="activity-item">
                        <span className={`activity-dot ${notif.type}`}></span>
                        <div className="activity-content">
                          <p>{notif.message}</p>
                          <small>{new Date(notif.time).toLocaleTimeString()}</small>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && <p className="no-activity">No recent activity</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h1>Manage Users</h1>
                  <div className="search-box">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    <button onClick={fetchUsers}>Search</button>
                  </div>
                </div>
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td><span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span></td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleChangeRole(user.id, user.role)} className="btn-role">
                              Change Role
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="btn-delete">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'places' && (
              <div className="places-section">
                <div className="section-header">
                  <h1>Manage Tourist Places</h1>
                  <div className="header-actions">
                    <div className="search-box">
                      <FaSearch />
                      <input
                        type="text"
                        placeholder="Search places..."
                        value={searchPlace}
                        onChange={(e) => setSearchPlace(e.target.value)}
                      />
                      <button onClick={fetchPlaces}>Search</button>
                    </div>
                    <button onClick={() => navigate('/admin')} className="btn-add">
                      <FaPlus /> Add New Place
                    </button>
                  </div>
                </div>
                <div className="places-grid">
                  {places.map(place => (
                    <div key={place.id} className="place-admin-card">
                      <img src={place.imageUrl} alt={place.name} />
                      <div className="place-admin-info">
                        <h3>{place.name}</h3>
                        <p className="place-location">{place.location}</p>
                        <span className="category-tag">{place.category}</span>
                        <div className="place-meta">
                          <span>⭐ {place.rating || 0}</span>
                          <span>👁️ Views: {place.views || 0}</span>
                        </div>
                        <div className="place-admin-actions">
                          <button onClick={() => navigate(`/admin?edit=${place.id}`)} className="btn-edit">
                            <FaEdit /> Edit
                          </button>
                          <button onClick={() => handleDeletePlace(place.id)} className="btn-delete">
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';
import TransportCalculator from './components/TransportCalculator';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PlaceDetails from './pages/PlaceDetails';
import TravelPlanner from './pages/TravelPlanner';
import TripTimeline from './pages/TripTimeline';
import Favorites from './pages/Favorites';
import Hotels from './pages/Hotels';
import TripPlanner from './pages/TripPlanner';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const UserRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    return <Navigate to="/admin-dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Admin Routes - No Navbar */}
                <Route path="/admin-dashboard" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute><Admin /></AdminRoute>
                } />
                <Route path="/admin/profile" element={
                  <AdminRoute><Profile /></AdminRoute>
                } />
                
                {/* User Routes - With Navbar */}
                <Route path="/*" element={
                  <>
                    <Navbar />
                    <AIChatbot />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/place/:id" element={<PlaceDetails />} />
                      <Route path="/planner" element={<TravelPlanner />} />
                      <Route path="/timeline" element={<TripTimeline />} />
                      <Route path="/hotels" element={<Hotels />} />
                      <Route path="/transport" element={<TransportCalculator />} />
                      <Route path="/trips" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
                      <Route path="/login" element={<Auth />} />
                      <Route path="/admin-register" element={<AdminRegister />} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </>
                } />
              </Routes>
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

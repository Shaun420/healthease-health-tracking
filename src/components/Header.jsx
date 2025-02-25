import React from 'react';
import { useNavigate } from "react-router-dom";
import './Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  return (
    <header className="header">
      <div className="header-left">
        <h1>HealthEase - Fitness Tracker</h1>
      </div>
      <div className="header-right">
        {isAuthenticated ? (
          <div>
            <span>Welcome Back, User!</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
          <span>Welcome, New User!</span>
          <button><a href="/newpatient">Register</a></button>
          <button><a href="/login">Login</a></button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
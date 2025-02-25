import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HealthForm from './components/HealthForm';
import HealthChart from './components/HealthChart';
import Login from './components/Login';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="dashboard">
        <>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="main-content">
            {/* Header */}
            <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

            {/* Dashboard Cards */}
            <div className="dashboard-cards">

              <div className="card">
                <HealthChart />
              </div>

            </div>

          </div>
        </>
    </div>
  );
};

export default Dashboard;
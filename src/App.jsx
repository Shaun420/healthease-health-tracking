import { useState } from 'react'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import HealthForm from "./components/HealthForm";
import PatientProfile from "./components/PatientProfile";
import Report from "./components/Report";
import Dashboard from "./dashboard";
//import Records from "./components/Records";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/input" element={<HealthForm />} />
        <Route path="/newpatient" element={<PatientProfile />} />
        <Route path="/reports" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;

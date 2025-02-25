import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientProfile.css"; // Add styles in a separate CSS file if needed

const PatientProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    number: "",
    doctorName: "",
    diagnosis: "",
    prevCheckup: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-patient-profile", formData);
      console.log(response.data); // Handle response
      navigate("/login");
      alert("Profile Saved Successfully!");
    } catch (error) {
      console.error("Error saving profile", error);
      alert("Error saving profile");
    }
  };

  return (
    <div className="container">
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input type="text" name="name" placeholder="Patient Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
        <input type="number" name="number" placeholder="Mobile Number" value={formData.number} onChange={handleChange} required />
        <input type="text" name="doctorName" placeholder="Doctor's Name" value={formData.doctorName} onChange={handleChange} required />
        <input type="text" name="diagnosis" placeholder="Diagnosis" value={formData.diagnosis} onChange={handleChange} />
        <input type="date" name="prevCheckup" placeholder="Previous Checkup Date" value={formData.prevCheckup} onChange={handleChange} />
        
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default PatientProfile;

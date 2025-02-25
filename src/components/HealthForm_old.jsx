import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const HealthForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: localStorage.getItem("authToken"),
    blood_pressure: "",
    heart_rate: "",
    glucose_level: "",
    temperature: "",
  });

  // Function to convert Markdown table to HTML table
  function markdownTableToHtml(mdTable) {
    const rows = mdTable.trim().split("\n").slice(1); // Remove header separator row
    let html = "<table>";

    rows.forEach((row, index) => {
      let columns = row.split("|").map(col => col.trim()).filter(col => col);
      if (columns.length > 0) {
        html += index === 0 ? "<thead><tr>" : "<tr>";
        columns.forEach(col => {
          html += index === 0 ? `<th>${col}</th>` : `<td>${col}</td>`;
        });
        html += index === 0 ? "</tr></thead><tbody>" : "</tr>";
      }
    });

    html += "</tbody></table>";
    return html;
  }

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      // Call Disease Prediction API
      const predictionResponse = await axios.post("http://localhost:5000/predict-disease", {
        blood_pressure: formData.blood_pressure,
        heart_rate: formData.heart_rate,
        glucose_level: formData.glucose_level,
        temperature: formData.temperature,
      });

      const response = await axios.post("http://localhost:5000/add-health-data", formData);
      alert("Health data submitted!");

      setPrediction(predictionResponse.data.prediction);
    } catch (error) {
      alert("Error submitting data or fetching prediction.");
    }
    
    setLoading(false);
  };

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />
      <div className="main-content">
        <h2>Enter Health Data</h2>
        <form onSubmit={handleSubmit}>
          <label>Blood Pressure (e.g., 120/80):</label>
          <input type="text" name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} required />

          <label>Heart Rate (BPM):</label>
          <input type="number" name="heart_rate" value={formData.heart_rate} onChange={handleChange} required />

          <label>Glucose Level (mg/dL):</label>
          <input type="number" name="glucose_level" value={formData.glucose_level} onChange={handleChange} required />

          <label>Temperature (°C):</label>
          <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required />

          <button type="submit" style={{ width: "max-content" }} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Show Disease Prediction */}
        {prediction && (
          <div className="prediction-result">
            <h3>Predicted Disease:</h3>
            <div dangerouslySetInnerHTML={{ __html: prediction }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthForm;

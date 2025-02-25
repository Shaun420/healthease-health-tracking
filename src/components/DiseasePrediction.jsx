import React, { useState } from "react";
import axios from "axios";

const DiseasePrediction = () => {
  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSymptoms(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const response = await axios.post("http://localhost:5000/add-patient-profile", {
        name: "Test User", // Dummy data
        age: "25",
        gender: "Male",
        number: "1234567890",
        doctorName: "Dr. John Doe",
        symptoms,
        prevCheckup: "2025-01-01",
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      setPrediction("Error fetching prediction.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Disease Prediction</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter Symptoms:</label>
        <textarea
          name="symptoms"
          placeholder="e.g., Fever, cough, headache"
          value={symptoms}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Get Prediction"}
        </button>
      </form>

      {prediction && (
        <div className="result">
          <h3>Prediction:</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default DiseasePrediction;

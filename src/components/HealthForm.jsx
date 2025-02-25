import React, { useState } from 'react';
import axios from 'axios';  // Make sure axios is imported

const HealthForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bmi: '',
    weight: '',
    height: '',
    heartRate: '',
    bp: '',
    glucose: '',
    temperature: '',
  });

  const [prediction, setPrediction] = useState(null); // State for prediction

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form submission reload

    try {
      // Call Disease Prediction API
      const predictionResponse = await axios.post("http://localhost:5000/predict-disease", {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        bmi: formData.bmi,
        weight: formData.weight,
        height: formData.height,
        blood_pressure: formData.bp,  
        heart_rate: formData.heartRate,  
        glucose_level: formData.glucose,  
        temperature: formData.temperature,
      });

      let predictionResult = predictionResponse.data.prediction; // Store prediction

      predictionResult = predictionResult.slice(7, -4);

      let jsonData;
      try {
        jsonData = JSON.parse(predictionResult);
        console.log(jsonData);
      } catch (error) {
        console.error("Invalid JSON string:", error);
      }
      
      setPrediction(jsonData); // Update state to show on UI

      // Include prediction in formData
      const dataToStore = { ...formData, predictionResult };

      // Send data to database
      await axios.post("http://localhost:5000/add-health-data", dataToStore);
      alert("Health data submitted!");

    } catch (error) {
      alert("Error submitting data or fetching prediction.");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Medical Report</h1>
      <div>
        <h2>Enter Your Details</h2>
        <input type="text" placeholder="Enter your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        <input type="number" placeholder="Enter your age" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
        <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <h2>Enter Your Medical Parameters</h2>
        <input type="number" placeholder="Enter your BMI" value={formData.bmi} onChange={e => setFormData({ ...formData, bmi: e.target.value })} />
        <input type="number" placeholder="Enter your weight" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
        <input type="number" placeholder="Enter your height" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
        <input type="number" placeholder="Enter your heart rate" value={formData.heartRate} onChange={e => setFormData({ ...formData, heartRate: e.target.value })} />
        <input type="text" placeholder="Enter your BP" value={formData.bp} onChange={e => setFormData({ ...formData, bp: e.target.value })} />
        <input type="number" placeholder="Enter your glucose level" value={formData.glucose} onChange={e => setFormData({ ...formData, glucose: e.target.value })} />
        <input type="number" placeholder="Enter your temperature" value={formData.temperature} onChange={e => setFormData({ ...formData, temperature: e.target.value })} />
        
        <button onClick={handleSubmit}>Generate Report</button>

        {prediction && (
          <div>
            <h2>Prediction Result</h2>
            <table border="1">
                <thead>
                    <tr>
                    <th>Possible Disease</th>
                    <th>Causes</th>
                    <th>Prevention Steps</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>{prediction["Possible Disease"]}</td>
                    <td>{prediction["Causes"]}</td>
                    <td>{prediction["Prevention Steps"]}</td>
                    </tr>
                </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthForm;

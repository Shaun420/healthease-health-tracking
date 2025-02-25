import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Report.css';
import Sidebar from './Sidebar';

function FetchHealthData() {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedData, setSelectedData] = useState(null); // State to hold selected row data
  const [predictionData, setPredictionData] = useState(null); // State to hold selected predictionData

  // State to store status and remedies for each health parameter
  const [statusData, setStatusData] = useState({
    bmi: { status: '', remedy: '' },
    weight: { status: '', remedy: '' },
    heartRate: { status: '', remedy: '' },
    bp: { status: '', remedy: '' },
    glucose: { status: '', remedy: '' },
    temperature: { status: '', remedy: '' },
  });

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-health-data');
        setHealthData(response.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  const handleRowClick = (data) => {
    let jsonData;
    try {
      jsonData = JSON.parse(data.prediction);
    } catch (error) {
      console.error('Invalid JSON string:', error);
    }
    setPredictionData(jsonData);
    setSelectedData(data); // Set selected row data
    setShowModal(true); // Show the modal
    checkAbnormalValues(data);
  };

  const closeModal = () => {
    setPredictionData(null);
    setShowModal(false); // Hide the modal
    setSelectedData(null); // Reset selected data
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const idealValues = {
    bmi: { min: 18.5, max: 24.9 },
    weight: 60, // For height of 160 cm
    heartRate: { min: 70, max: 75 },
    bp: { systolic: 120, diastolic: 80 },
    glucose: { min: 75, max: 100 },
    temperature: { min: 37, max: 39 }, // in Celsius
  };

  function getHomeRemedy(param, value) {
    const remedies = {
      bmi: 'Try to maintain a balanced diet and exercise regularly to achieve a healthy BMI.',
      weight: 'Try incorporating more physical activity into your daily routine, and consider consulting a nutritionist.',
      heartRate: 'To lower heart rate, try relaxation techniques like deep breathing or consult a doctor if symptoms persist.',
      bp: 'If high blood pressure, reduce salt intake, manage stress, and exercise regularly. Consult a doctor if needed.',
      glucose: 'For high glucose, avoid sugary foods, increase fiber intake, and consider consulting your healthcare provider.',
      temperature: 'For high temperature, drink plenty of fluids, rest, and monitor symptoms closely. Consult a doctor if fever persists.',
    };
    return remedies[param] || 'Consult a healthcare professional for advice.';
  }

  function checkAbnormalValues(data) {
    const updatedStatusData = { ...statusData };

    const { bmi, weight, heartRate, blood_pressure, glucose_level, temperature } = data;

    function setStatus(param, value) {
      const status = value === 'Abnormal' ? 'Abnormal' : 'Normal';
      const remedy = value === 'Abnormal' ? getHomeRemedy(param, value) : 'No remedy needed';
      updatedStatusData[param] = { status, remedy };
    }

    // Check if values are abnormal and update status
    setStatus('bmi', bmi < idealValues.bmi.min || bmi > idealValues.bmi.max ? 'Abnormal' : 'Normal');
    setStatus('weight', weight !== idealValues.weight ? 'Abnormal' : 'Normal');
    setStatus('heartRate', heartRate < idealValues.heartRate.min || heartRate > idealValues.heartRate.max ? 'Abnormal' : 'Normal');
    setStatus('bp', blood_pressure.split('/')[0] !== idealValues.bp.systolic || blood_pressure.split('/')[1] !== idealValues.bp.diastolic ? 'Abnormal' : 'Normal');
    setStatus('glucose', glucose_level < idealValues.glucose.min || glucose_level > idealValues.glucose.max ? 'Abnormal' : 'Normal');
    setStatus('temperature', temperature < idealValues.temperature.min || temperature > idealValues.temperature.max ? 'Abnormal' : 'Normal');

    setStatusData(updatedStatusData); // Update status data state
  }

  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <h2>Health Data</h2>
        {healthData.length > 0 ? (
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>BMI</th>
                <th>Blood Pressure</th>
                <th>Heart Rate</th>
                <th>Glucose Level</th>
                <th>Temperature</th>
                <th>Record Date</th>
                <th>View Report</th>
              </tr>
            </thead>
            <tbody>
              {healthData.map((data) => (
                <tr key={data.id} onClick={() => handleRowClick(data)}>
                  <td>{data.name}</td>
                  <td>{data.age}</td>
                  <td>{data.gender}</td>
                  <td>{data.bmi}</td>
                  <td>{data.blood_pressure}</td>
                  <td>{data.heart_rate}</td>
                  <td>{data.glucose_level}</td>
                  <td>{data.temperature}</td>
                  <td>{new Date(data.record_date).toLocaleString()}</td>
                  <td>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No health records found</p>
        )}
      </div>

      {showModal && selectedData && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h3>Health Report</h3>
            <table>
              <tbody>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <th>Name</th>
                  <th>{selectedData.name}</th>
                </tr>
                <tr>
                  <th>Age</th>
                  <th>{selectedData.age}</th>
                </tr>
                <tr>
                  <th>Gender</th>
                  <th>{selectedData.gender}</th>
                </tr>
                <tr>
                  <th>Date of Report</th>
                  <th>{new Date(selectedData.record_date).toLocaleString()}</th>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Home Remedy</th>
                </tr>
                <tr>
                  <td>BMI</td>
                  <td>{selectedData.bmi}</td>
                  <td className={statusData.bmi.status === 'Abnormal' ? 'abnormal blinking' : ''}>{statusData.bmi.status}</td>
                  <td>{statusData.bmi.remedy}</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>{selectedData.weight}</td>
                  <td className={statusData.weight.status === 'Abnormal' ? 'abnormal blinking' : ''}>{statusData.weight.status}</td>
                  <td>{statusData.weight.remedy}</td>
                </tr>
                <tr>
                  <td>Heart Rate</td>
                  <td>{selectedData.heart_rate}</td>
                  <td className={statusData.heartRate.status === 'Abnormal' ? 'abnormal blinking' : ''}>{statusData.heartRate.status}</td>
                  <td>{statusData.heartRate.remedy}</td>
                </tr>
                <tr>
                  <td>Blood Pressure</td>
                  <td>{selectedData.blood_pressure}</td>
                  <td className={statusData.bp.status === 'Abnormal' ? 'abnormal blinking' : ''}>{statusData.bp.status}</td>
                  <td>{statusData.bp.remedy}</td>
                </tr>
                <tr>
                  <td>Glucose Level</td>
                  <td>{selectedData.glucose_level}</td>
                  <td className={statusData.glucose.status === 'Abnormal' ? 'abnormal blinking' : ''}>{statusData.glucose.status}</td>
                  <td>{statusData.glucose.remedy}</td>
                </tr>
                <tr>
                  <td>Body Temperature</td>
                  <td>{selectedData.temperature}</td>
                  <td className={statusData.temperature.status === 'Abnormal' ? 'abnormal blinking' : ''}>{statusData.temperature.status}</td>
                  <td>{statusData.temperature.remedy}</td>
                </tr>

              </tbody>
            </table>
            {predictionData && (
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
                      <td>{predictionData['Possible Disease']}</td>
                      <td>{predictionData['Causes']}</td>
                      <td>{predictionData['Prevention Steps']}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FetchHealthData;

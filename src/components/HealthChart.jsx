import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import axios from "axios";
import Alerts from './Alerts';
import "./HealthChart.css";
import ErrorBoundary from "./ErrorBoundary";

// Register necessary chart elements
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const HealthChart = () => {
  const [bloodPressureData, setBloodPressureData] = useState({ labels: [], data: [] });
  const [heartRateData, setHeartRateData] = useState({ labels: [], data: [] });
  const [glucoseData, setGlucoseData] = useState({ labels: [], data: [] });
  const [temperatureData, setTemperatureData] = useState({ labels: [], data: [] });
  const [alerts, setAlerts] = useState([]);  // Store alerts state here

  // Normal ranges for health parameters (you can modify these as per the medical standards)
  const normalRanges = {
    bloodPressure: { min: 90, max: 120 }, // Systolic
    heartRate: { min: 60, max: 100 }, // BPM
    glucose: { min: 70, max: 140 }, // mg/dL
    temperature: { min: 36.5, max: 37.5 }, // °C
  };

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get-health-data"); // Backend endpoint to fetch data
        const fetchedData = response.data;
  
        const labels = fetchedData.map(item => new Date(item.record_date).toLocaleString());
  
        const bloodPressure = fetchedData.map(item => item.blood_pressure);
        const heartRate = fetchedData.map(item => item.heart_rate);
        const glucose = fetchedData.map(item => item.glucose_level);
        const temperature = fetchedData.map(item => item.temperature);
  
        // Check for deviations from normal ranges
        let newAlerts = [];
        fetchedData.forEach((item, index) => {
          const recordTime = new Date(item.record_date).toLocaleString();

          if (item.blood_pressure < normalRanges.bloodPressure.min || item.blood_pressure > normalRanges.bloodPressure.max) {
            newAlerts.push({
              message: `Blood Pressure deviation detected: ${item.blood_pressure}`,
              type: "warning",
              date: recordTime,
            });
          }
  
          if (item.heart_rate < normalRanges.heartRate.min || item.heart_rate > normalRanges.heartRate.max) {
            newAlerts.push({
              message: `Heart Rate deviation detected: ${item.heart_rate} BPM`,
              type: "warning",
              date: recordTime,
            });
          }
  
          if (item.glucose_level < normalRanges.glucose.min || item.glucose_level > normalRanges.glucose.max) {
            newAlerts.push({
              message: `Glucose Level deviation detected: ${item.glucose_level} mg/dL`,
              type: "warning",
              date: recordTime,
            });
          }
  
          if (item.temperature < normalRanges.temperature.min || item.temperature > normalRanges.temperature.max) {
            newAlerts.push({
              message: `Temperature deviation detected: ${item.temperature} °C`,
              type: "warning",
              date: recordTime,
            });
          }
        });
  
        // Sort alerts by date in descending order (latest first)
        newAlerts.sort((a, b) => b.date - a.date);
  
        // Fetch the latest 5 alerts
        setAlerts(newAlerts.slice(0, 5));

        // Update the state for each parameter
        setBloodPressureData({ labels, data: bloodPressure });
        setHeartRateData({ labels, data: heartRate });
        setGlucoseData({ labels, data: glucose });
        setTemperatureData({ labels, data: temperature });
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };
  
    fetchHealthData();
  }, []);  

  const generateChartOptions = (label) => ({
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index", // Tooltip will display for both lines on the same index
        intersect: false, // Show tooltips when hovering anywhere over the lines
        callbacks: {
          title: (tooltipItems) => `Date: ${tooltipItems[0].label}`,
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw;
            return `${datasetLabel}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: label },
        beginAtZero: false,
      },
    },
  });

  return (
    <div>
        <h2>Health Trends</h2>
        <div className="health-chart">
            <div className="chart-container">
                <h3>Blood Pressure (Systolic)</h3>
                <Line
                data={{
                    labels: bloodPressureData.labels,
                    datasets: [
                    {
                        label: "Blood Pressure (Systolic)",
                        data: bloodPressureData.data,
                        borderColor: "red",
                        fill: false,
                    },
                    ],
                }}
                options={generateChartOptions("Blood Pressure")}
                />
            </div>

            <div className="chart-container">
                <h3>Heart Rate (BPM)</h3>
                <Line
                data={{
                    labels: heartRateData.labels,
                    datasets: [
                    {
                        label: "Heart Rate (BPM)",
                        data: heartRateData.data,
                        borderColor: "blue",
                        fill: false,
                    },
                    ],
                }}
                options={generateChartOptions("Heart Rate")}
                />
            </div>

            <div className="chart-container">
                <h3>Glucose Level (mg/dL)</h3>
                <Line
                data={{
                    labels: glucoseData.labels,
                    datasets: [
                    {
                        label: "Glucose Level",
                        data: glucoseData.data,
                        borderColor: "green",
                        fill: false,
                    },
                    ],
                }}
                options={generateChartOptions("Glucose Level")}
                />
            </div>

            <div className="chart-container">
                <h3>Temperature (°C)</h3>
                <Line
                data={{
                    labels: temperatureData.labels,
                    datasets: [
                    {
                        label: "Temperature (°C)",
                        data: temperatureData.data,
                        borderColor: "orange",
                        fill: false,
                    },
                    ],
                }}
                options={generateChartOptions("Temperature")}
                />
            </div>
            {/* Alerts and Family Tracking Section */}
            <div className="dashboard-cards">
                {/* Alerts Card */}
                <div className="card alerts-card">
                    <h2>Alerts & Reminders</h2>
                    <Alerts alerts={alerts} />
                </div>
            </div>
        </div>
    </div>
    );
};

export default HealthChart;

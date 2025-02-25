import React from 'react';
import './Alerts.css';

const Alerts = ({ alerts }) => {
  // Sample alerts data
  /*
  const alerts = [
    {
      id: 1,
      message: 'High Blood Pressure detected!',
      date: '2023-10-01',
      type: 'warning',
    },
    {
      id: 2,
      message: 'Reminder: Check glucose levels.',
      date: '2023-10-02',
      type: 'reminder',
    },
    {
      id: 3,
      message: 'Low Heart Rate detected!',
      date: '2023-10-03',
      type: 'warning',
    },
  ];*/

  return (
    <div className="alerts">
      <ul className="alerts-list">
        {alerts.map((alert, index) => (
          <li key={index} className={`alert-item ${alert.type}`}>
            <div className="alert-message">{alert.message}</div>
            <div className="alert-date">{alert.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
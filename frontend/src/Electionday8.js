import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Electionday8.css';

const Electionday8 = () => {
  const [nic, setNic] = useState('');
  const navigate = useNavigate();

  const handleAttendance = () => {
    console.log('Attendance clicked. NIC:', nic);
    // Redirect to electionday10 page, passing NIC if needed
    navigate('/electionday10', { state: { nic } });
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log('Next clicked. NIC:', nic);
    navigate('/electionday5', { state: { nic } });
  };

  return (
    <div className="login-wrapper">
      <div className="page-title">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      <div className="login-card">
        <h1>Voter's</h1>
        <form onSubmit={handleNext}>
          <label htmlFor="nic">NIC :</label>
          <input
            id="nic"
            type="text"
            placeholder="Enter your NIC"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
          <div className="button-group">
            <button
              type="button"
              className="btn-attendance"
              onClick={handleAttendance}
            >
              Attendance
            </button>
            <button type="submit" className="btn-next">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Electionday8;

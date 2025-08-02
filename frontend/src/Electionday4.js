import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import './Css/Electionday4.css';

export default function Test1Login() {
  const [nic, setNic] = useState('');
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleNext = (e) => {
    e.preventDefault();
    console.log('NIC:', nic);

    // ✅ Navigate to Electionday5 and pass NIC if needed
    navigate('/electionday5', { state: { nic } });
  };

  return (
    <div className="login-wrapper">
      

      <div className="page-title">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      <div className="login-card">
        <h1>Testing</h1>
        <h1>NIC Login</h1>
        <form onSubmit={handleNext}>
          <label htmlFor="nic">NIC :</label>
          <input
            id="nic"
            type="text"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
          <button type="submit">Next</button>
        </form>
      </div>
    </div>
  );
}

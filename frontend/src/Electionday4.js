import React, { useState } from 'react';
import './Css/Electionday4.css';

export default function Test1Login() {
  const [nic, setNic] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    console.log('NIC:', nic);
    // Add validation or navigation here
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Test 1</h1>
        <form onSubmit={handleNext}>
          <label htmlFor="nic">NIC :</label>
          <input
            id="nic"
            type="text"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
          <button type="submit">NEXT</button>
        </form>
      </div>
    </div>
  );
}

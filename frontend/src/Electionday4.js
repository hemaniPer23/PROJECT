import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Electionday4.css';
import API from './API'; // ✅ Import your API instance

// The component name can remain Test1Login if you prefer
export default function Electionday4() { 
  const [nic, setNic] = useState('');
  const navigate = useNavigate();
  
  //Add state for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  //handleNext function now calls the backend
  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Use the API to send a GET request to your backend endpoint
      const res = await API.get(`/api/voter/verify_voter.php?nic=${nic}`);
      
      if (res.data.status === 'success') {
        // If the voter is found, navigate to Electionday5
        // and pass the voter's data using the 'state' option.
        navigate('/electionday5', { state: { voter: res.data.data } });
      }
    } catch (err) {
      // If there's an error (like voter not found), set the message
      setMessage(err.response?.data?.message || 'An error occurred.');
    } finally {
      // This will run whether the API call succeeds or fails
      setIsLoading(false);
    }
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
            disabled={isLoading} // ✅ Disable input while loading
          />
          {/* ✅ Update button text and state based on loading status */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Next'}
          </button>
        </form>
        {/* ✅ Show feedback message to the user */}
        {message && <p style={{ marginTop: '15px', color: 'red' }}>{message}</p>}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from './API'; 
import './Css/Electionday6.css';
import loadingGif from './image/Loading.gif'; // Your loading GIF

// It's better to rename the component to reflect its purpose
export default function WaitingForVote() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const voter = location.state?.voter;
  const [message, setMessage] = useState('');

  // This useEffect hook will run continuously to check the voter's status
  useEffect(() => {

const pollingInterval = setInterval(() => {
  const checkStatus = async () => {
    try {
      // Call the API endpoint to get the current vote status (latest by Timestamp)
      const res = await API.get('/api/voter/get_vote_status.php');
      if (res.data.status === 'success' && res.data.vote_status === 'Voted') {
        setMessage('Vote cast successfully! Redirecting...');
        clearInterval(pollingInterval);
        setTimeout(() => {
          navigate('/electionday7');
        }, 2000);
      }
    } catch (err) {
      console.error("Polling for vote status failed:", err);
    }
  };
  checkStatus();
}, 3000);

    // Cleanup function: This is a crucial part of useEffect.
    // It stops the interval if the user navigates away from this page, preventing memory leaks.
    return () => clearInterval(pollingInterval);

  }, [voter, navigate]); // Dependencies: The hook re-runs if these values change.

  return (
    <div className="container">
      <div className="title-section">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      {/* The content is no longer conditional on a simple timer, but always shows the waiting UI */}
      <div className="loader">
        <img src={loadingGif} alt="Waiting..." />
        <h2 style={{ marginTop: '20px' }}>Waiting for Vote</h2>
        {voter && <p>Voter NIC: {voter.nic}</p>}
        <p>{message}</p>
      </div>
    </div>
  );
}

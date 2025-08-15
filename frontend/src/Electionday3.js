import React, { useState } from 'react';
import './Css/Electionday3.css';
import API from './API.js'; 
import { useNavigate } from 'react-router-dom';

export default function ElectionTimer() {
  
  
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [message, setMessage] = useState('');  // To show feedback messages
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Router's function to navigate between pages
  const navigate = useNavigate();

  
  // This function runs when the "START" button is clicked
  const handleStart = async (e) => {
   
    e.preventDefault();  // Prevents the browser from reloading the page

    const isConfirmed = window.confirm(
      `Are you sure you want to set the election time from ${startTime} to ${endTime}?`
    );

    //clicked "OK" on the pop-up
    if (isConfirmed) {
      setIsSubmitting(true);
      setMessage('Activating election, please wait...');

      //Prepare the data object to be sent to the backend API
     const electionData = {
      Start_time: startTime,
      End_time: endTime
    };

      
      try {
        const res = await API.put('/api/election/set_time.php', electionData);
        
        if (res.data.status === 'success') {
          setMessage('Election has been successfully activated! Redirecting...');
          setTimeout(() => {
            navigate('/Electionday4'); // Navigates to the next page in the flow
          }, 3000); //3 sec

        } else {
          setMessage(res.data.message || 'Failed to start election.');
          setIsSubmitting(false); // Re-enable the form so the user can try again
        }
      } catch (err) {
        setMessage(err.response?.data?.message || 'An error occurred while contacting the server.');
        setIsSubmitting(false);// Re-enable the form so the user can try again
      }
    } else {
      //clicks "Cancel" in the confirmation pop-up
      setMessage('');
    }
  };

  
  return (
    <div className="timer-container">
      <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
      <h2 className="title-english">Election Commission 2025</h2>

      <div className="timer-setup">
        <h2>Set Election Time</h2>
        <form onSubmit={handleStart}>
          <div className="time-inputs">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              disabled={isSubmitting} // Input is disabled while submitting
            />
            <span>TO</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              disabled={isSubmitting} // Input is disabled while submitting
            />
          </div>

          {/* The button's text and disabled state change based on 'isSubmitting' */}
          <button className="start-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'START'}
          </button>
        </form>

      </div>

      {/* This area shows feedback messages to the user */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

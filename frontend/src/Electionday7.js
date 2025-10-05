import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Electionday7.css';
import API from './API';

export default function Electionday7() {
  const navigate = useNavigate();

  // Make the function async to use await
  const handleDone = async () => {
    try {
      // Parse the JSON response from the API
      const result = await API.get('/api/election/test_one.php').then(response => response.data);

      // Check the custom status from your API's response
      if (result.status === 'success') {
        console.log('API call successful:', result.message);
        // Navigate to the next page only on success
        navigate('/electionday9');
      } else {
        // Handle cases where the API reports an error (e.g., no rows deleted)
        console.error('API Error:', result.message);
        alert(`Failed to process request: ${result.message}`);
      }

    } catch (error) {
      // Handle network errors or other issues with the fetch call
      console.error('There was a problem with the fetch operation:', error);
      alert('Could not connect to the server. Please try again.');
    }
  };

  return (
    <div className="main-container">
      <div className="titles">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      <div className="popup-box">
        <p className="popup-text">
          <strong>Testing 1</strong> &nbsp; Successful
        </p>
        <button className="done-button" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Electionday4.css";
import API from "./API"; // Import your API instance

export default function Electionday4() {
  const [nic, setNic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle Next Button
  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

  try {
      // Use the API to send a GET request to your backend endpoint
      const res = await API.get(`/api/voter/verify_voter.php?nic=${nic}`);
      
      if (res.data.status === 'success') {
        // If the voter is found, navigate to Electionday5
        // and pass the voter's data using the 'state' option.
        navigate('/electionday11', { state: { voter: res.data.data } });
      }
    } catch (err) {
      // If there's an error (like voter not found), set the message
      setMessage(err.response?.data?.message || 'An error occurred.');
    } finally {
      // This will run whether the API call succeeds or fails
      setIsLoading(false);
    }

  };

  const handleView = () => {
    navigate('/electionday10');
  };


  return (
    <div className="login-wrapper-e4">
      {/* Titles */}
      <div className="page-title-e4">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <br />
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      {/* Login Card */}
      <div className="login-card-e4">
       <h1>Voter</h1>
        <h1>NIC Verification</h1>

        <form onSubmit={handleNext}>
          <label htmlFor="nic">Enter NIC :</label>
          <input
            id="nic"
            type="text"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
            disabled={isLoading}

          />

          <div className="button-row-e4">
          </div>
            <div className="button-group-8">
            <button type="submit" className="btn-next" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Next'}
            </button>
            <button type="button" className="btn-view" onClick={handleView}>
              View
            </button>
          </div>

        </form>

        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}

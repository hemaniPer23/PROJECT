import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Electionday4.css";
import API from "./API"; // Import your API instance

export default function Electionday4() {
  const [nic, setNic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isElectionOver, setIsElectionOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkElectionStatus = async () => {
      try {
        const res = await API.get("/api/election/get_election_end_time.php");
        if (res.data.End_Time) {
          const electionEndTime = new Date(res.data.End_Time);
          const currentTime = new Date();

          if (currentTime > electionEndTime) {
            setIsElectionOver(true);
            setMessage("Election has ended.");
            // Navigate to homepage after a short delay
            setTimeout(() => {
              navigate('/');
            }, 3000); // 3-second delay before redirecting
          }
        } 
      } catch (err) {
        console.error("Error fetching election end time:", err);
        setMessage("Could not verify election time.");
        setIsElectionOver(true); // Disable form if backend fails
      }
    };

    checkElectionStatus();

    // Set up an interval to re-check every 30 seconds
    const interval = setInterval(checkElectionStatus, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [navigate]);

  const handleNext = async (e) => {
    e.preventDefault();

    if (isElectionOver) {
      return; // Do nothing if the election is over
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await API.get(`/api/voter/verify_voter.php?nic=${nic}`);
      if (res.data.status === 'success') {
        navigate('/electionday11', { state: { voter: res.data.data } });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = () => {
    navigate('/electionday10');
  };

  return (
    <div className="login-wrapper-e4">
      <div className="page-title-e4">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <br />
        <h2 className="title-english">Election Commission 2025</h2>
      </div>
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
            disabled={isLoading || isElectionOver}
          />
          <div className="button-row-e4"></div>
          <div className="button-group-8">
            <button
              type="submit"
              className="btn-next"
              disabled={isLoading || isElectionOver}
            >
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
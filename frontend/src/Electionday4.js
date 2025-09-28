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
      const res = await API.get(`/api/voter/verify_voter.php?nic=${nic}`);
      if (res.data.status === "success") {
        navigate("/electionday5", { state: { voter: res.data.data } });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
          />

          <div className="button-row">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Next"}
            </button>
           
          </div>
        </form>

        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}

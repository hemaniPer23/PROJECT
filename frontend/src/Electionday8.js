import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Electionday8.css";
import API from "./API"; // Import your API instance

export default function Electionday8() {
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
    <div className="login-wrapper-e8">
      {/* Titles */}
      <div className="page-title-e8">
        <h1 className="title-sinhala-e8">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english-e8">Election Commission 2025</h2>
      </div>

      {/* Login Card */}
      <div className="login-card-e8">
        <h1 className="card-title-e8">Voter</h1>
        <h1 className="card-title-e8">NIC Login</h1>

        <form onSubmit={handleNext} className="form-e8">
          <label htmlFor="nic" className="label-e8">NIC :</label>
          <input
            id="nic"
            type="text"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
            disabled={isLoading}
            className="input-e8"
          />

          {/* Buttons Row */}
          <div className="button-row-e8">
            <button type="submit" disabled={isLoading} className="next-btn-e8">
              {isLoading ? "Searching..." : "Next"}
            </button>
          </div>

          {/* Attendance Button Below */}
          <div className="attendance-row-e8">
            <button
              type="button"
              className="attendance-btn-e8"
              onClick={() => navigate("/attendance")}
            >
              Attendance
            </button>
          </div>
        </form>

        {message && <p className="error-message-e8">{message}</p>}
      </div>
    </div>
  );
}

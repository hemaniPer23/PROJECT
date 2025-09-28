import React, { useState } from "react";
import "./Css/Electionday3.css";
import API from "./API.js";
import { useNavigate } from "react-router-dom";

export default function ElectionTimer() {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [message, setMessage] = useState(""); // To show feedback messages
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(
      `Are you sure you want to set the election time from ${startTime} to ${endTime}?`
    );

    if (isConfirmed) {
      setIsSubmitting(true);
      setMessage("Activating election, please wait...");

      const electionData = {
        Start_time: startTime,
        End_time: endTime,
      };

      try {
        const res = await API.put("/api/election/set_time.php", electionData);

        if (res.data.status === "success") {
          setMessage("Election has been successfully activated! Redirecting...");
          setTimeout(() => {
            navigate("/Electionday4");
          }, 3000);
        } else {
          setMessage(res.data.message || "Failed to start election.");
          setIsSubmitting(false);
        }
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
            "An error occurred while contacting the server."
        );
        setIsSubmitting(false);
      }
    } else {
      setMessage("");
    }
  };

  return (
    <div className="timer-container">
      <div className="timer-box">
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
                disabled={isSubmitting}
              />
              <span>TO</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              className="start-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "START"}
            </button>
          </form>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

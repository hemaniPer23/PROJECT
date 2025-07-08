import React, { useState, useEffect } from 'react';
import './Electionday3.css';

export default function ElectionTimer() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [electionStart, setElectionStart] = useState(null);
  const [electionEnd, setElectionEnd] = useState(null);
  const [now, setNow] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState('');
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    if (timerStarted) {
      const timer = setInterval(() => {
        setNow(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerStarted]);

  useEffect(() => {
    if (electionStart && electionEnd) {
      if (now < electionStart) {
        const diff = electionStart - now;
        setTimeLeft(formatDuration(diff) + ' until election starts');
      } else if (now >= electionStart && now <= electionEnd) {
        const diff = electionEnd - now;
        setTimeLeft(formatDuration(diff) + ' left to vote');
      } else {
        setTimeLeft('The election has ended.');
      }
    }
  }, [now, electionStart, electionEnd]);

  function formatDuration(ms) {
    if (ms <= 0) return '0h 0m 0s';
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function handleStart() {
    if (startTime && endTime) {
      setElectionStart(new Date(startTime));
      setElectionEnd(new Date(endTime));
      setTimerStarted(true);
    } else {
      alert('Please enter both start and end times.');
    }
  }

  return (
    <div className="timer-container">
      {!timerStarted ? (
        <div className="timer-setup">
          <h2>Set Election Time</h2>
          <div className="time-inputs">
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span>TO</span>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <button className="start-button" onClick={handleStart}>Start</button>
        </div>
      ) : (
        <div className="timer-display">
          <p>{timeLeft}</p>
        </div>
      )}
    </div>
  );
}

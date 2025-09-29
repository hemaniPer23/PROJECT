import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Electionday9.css";
import API from "./API.js"; 

const Electiondaylogin = ({ setAdmin }) => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // State to hold the election start time fetched from the API
  const [startTime, setStartTime] = useState(null);
  
  // State to control whether the login form is enabled or disabled
  const [isLoginAllowed, setIsLoginAllowed] = useState(false);
  
  // State to hold the countdown string (e.g., "01:23:45")
  const [countdown, setCountdown] = useState('');
  
  // Effect hook to fetch the election start time from the backend
  useEffect(() => {
    async function fetchStartTime() {
      try {
        // This call is currently failing. Check your start_time.php script and DB connection.
        const res = await API.get('/api/election/start_time.php');
        
        if (res.data.status === 'success') {
          // This part will run once the backend is fixed
          const electionStart = new Date(`${res.data.date}T${res.data.start_time}`);
          setStartTime(electionStart);
        } else {
          // This is the error you are currently seeing
          setError("Could not retrieve election time.");
        }
      } catch (err) {
        setError("Cannot fetch election start time from the server.");
      }
    }
    fetchStartTime();
  }, []); 

  // Effect hook to handle the countdown logic
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      //setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const diff = startTime - now;

      if (diff <= 0) {
        setCountdown('');
        setIsLoginAllowed(true);
        clearInterval(interval);
      } else {
        setIsLoginAllowed(false);
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setCountdown(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const loginData = {
      Admin_ID: adminId,
      Admin_Password: password
    };

    try {
      const res = await API.post('/api/admin/login.php', loginData);

      if (res.data.status === 'success') {
        if (typeof setAdmin === 'function') {
          setAdmin(true);
        }
        localStorage.setItem('admin_logged_in', 'true');

        const role = res.data.role;
        if (role === 'Officer') {
          
          navigate('/electionday8'); 
        } else {
          setError(' unauthorized or login failed.');
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Cannot connect to the server. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">මැතිවරණ කොමිෂන් සභාව</h1>
      <br />
      <h2 className="title">Election Commission</h2>
      <div className="login-box">
        <h3 className="login-title">Login</h3>

        {/* Countdown Display Area */}
        {!isLoginAllowed && startTime && (
          <p style={{ color: 'red', textAlign: 'center', lineHeight: '1.5' }}>
              <span>
                
                {countdown && <span>Time Remaining: <b>{countdown}</b></span>}
              </span>
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <input
            type="text"
            name="adminId"
            placeholder="පරිපාලක හැඳුනුම්පත / Admin ID"
            required
            value={adminId}
            onChange={e => setAdminId(e.target.value)}
            disabled={!isLoginAllowed}
          />
          <input
            type="password"
            name="password"
            placeholder="මුර පදය / Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={!isLoginAllowed}
          />
          <button type="submit" className="lang-btn" disabled={!isLoginAllowed}>
            Login
          </button>
        </form>
      </div>
      <footer className="footer">
        &copy; 2025 Election Commission of Sri Lanka
      </footer>
    </div>
  );
};

export default Electiondaylogin;
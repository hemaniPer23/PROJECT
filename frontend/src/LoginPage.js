// src/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/LoginPage.css";
import API from "./API.js";

const LoginPage = ({ setAdmin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // ✅ Added error state

  // handleSubmit function with this one
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');

    const loginData = {
        Admin_ID: adminId,
        Admin_Password: password
    };
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

try {
      const res = await API.post('/api/admin/login.php', loginData);

      if (res.data.status === 'success') {
        // Common actions for any successful admin login
        if(typeof setAdmin === 'function') {
            setAdmin(true);
        }
        localStorage.setItem('admin_logged_in', 'true');

        const role = res.data.role;

        //Role-based navigation
        if (role === 'Presiding Officer') {
            navigate('/electionday1');
        } else if (role === 'Officer') {
            navigate('/officer-dashboard');
        } else if (role === 'Result') {
            navigate('/electionday5');
        } else if (role === 'commission') { 
            navigate('/choose');
        } else {
            setError('Logged in, but role is undefined.');
        }

      }
    } catch(err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError(res.data.message || 'Login failed'); // ✅ set error state
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in. Please try again."); // ✅ set error
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">මැතිවරණ කොමිෂන් සභාව</h1>
      <br />
      <h2 className="title">Election Commission</h2>

      <div className="login-box">
        <h3 className="login-title">Login</h3>
        <form onSubmit={handleSubmit}>

          {/* ✅ Error message display */}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <input
            type="text"
            name="adminId"
            placeholder="පරිශීලක නාමය / Admin ID" 
            required
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="මුර පදය / Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="lang-btn">
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

export default LoginPage;

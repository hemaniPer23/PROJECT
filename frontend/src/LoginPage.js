import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Css/LoginPage.css";
import API from "./API.js"; // Import the API instance

const LoginPage = ({setAdmin}) => {
  const navigate = useNavigate();
  // We use 'adminId' to be more specific, but it will hold the username or ID
  const [adminId, setAdminId] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
        setError("Cannot connect to the server. Please check your connection.");
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
        <form onSubmit={handleSubmit}>
          
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          <input
            type="text"
            name="adminId"
            placeholder="පරිශීලක නාමය / Admin ID" 
            required
            value={adminId}
            onChange={e => setAdminId(e.target.value)} 
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

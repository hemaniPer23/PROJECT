import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Css/LoginPage.css";
import API from "./API.js"; // Import the API instance

const LoginPage = ({setAdmin}) => {
  const navigate = useNavigate();
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try{
      const res= await API.post('/admin_login.php',{username,password});
      if (res.data.status === 'success' && res.data.role === 'commission') {
        setAdmin(true);
        localStorage.setItem('admin_logged_in', 'true');
        navigate('/choose'); // Go to main menu after login
      } else {
        alert(res.data.message || 'Login failed');
    }
    }catch(error){
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again.");
      return;
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">මැතිවරණ කොමිෂන් සභාව</h1>
      <h2 className="title">Election Commission</h2>

      <div className="login-box">
        <h3 className="login-title">Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="පරිශීලක නාමය / Username"
            required
             onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="මුර පදය / Password"
            required
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
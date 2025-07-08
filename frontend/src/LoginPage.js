import React from "react";
import { useNavigate } from "react-router-dom";
import "./Css/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can validate login credentials here if needed

    // Navigate to Category page on submit
    navigate("/category"); // ✅ Changed to Category page
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
          />
          <input
            type="password"
            name="password"
            placeholder="මුර පදය / Password"
            required
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

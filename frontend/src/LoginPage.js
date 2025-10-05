import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Css/Registrationlogin.css";
import API from "./API.js"; // Import the API instance

const LoginPage = ({ setAdmin }) => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const loginData = {
      Admin_ID: adminId,
      Admin_Password: password,
    };

    try {
      const res = await API.post("/api/admin/login.php", loginData);

      if (res.data.status === "success") {
        if (typeof setAdmin === "function") {
          setAdmin(true);
        }
        localStorage.setItem("admin_logged_in", "true");

        const role = res.data.role;

        
        if (role === "Result") {
          navigate("/newpage");
        
        } else {
          setError(" Unauthorized or login failed.");
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
    <div className="registration-login-container">
      {/* Titles */}
      <h1 className="registration-title">මැතිවරණ කොමිෂන් සභාව</h1>
      <h2 className="registration-title">Election Commission</h2>

      <div className="login-box">
        <h3 className="login-title">Login</h3>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <input
            type="text"
            name="adminId"
            placeholder="පරිපාලක හැඳුනුම්පත / Admin ID"
            required
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="මුර පදය / Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

         <div className="registration-button-row">
            <button type="submit" className="registration-lang-btn">
              Login
            </button>

            {/* 🔴 New Back Button */}
            <button
              type="button"
              className="registration-back-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <footer className="footer21">
        &copy; 2025 Election Commission of Sri Lanka
      </footer>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Electionday2.css';

export default function Electionday2() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`ID: ${id}\nPassword: ${password}`);
    navigate('/electionday3');
  };

  return (
    <div className="page-container">
      <div className="content">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Login</h3>

          <label htmlFor="userId">ID</label>
          <input
            id="userId"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your ID"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

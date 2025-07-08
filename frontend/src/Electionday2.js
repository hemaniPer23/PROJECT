import React, { useState } from 'react';
import './Electionday2.css';

export default function Electionday2() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just log values, can be replaced with actual login logic
    alert(`ID: ${id}\nPassword: ${password}`);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

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
  );
}

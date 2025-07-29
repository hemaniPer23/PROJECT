import React from 'react';
import './Electionday5.css'; // optional styling

export default function NicModalPage() {
  return (
    <div className="nic-page">
      <h2>Enter NIC Number</h2>
      <form>
        <input
          type="text"
          placeholder="Enter NIC"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Electionday5.css';

export default function NicDetailsPage() {
  const { nic } = useParams(); // ex: /electionday5/200012345678
  const [voter, setVoter] = useState(null);

  // Fake data map (you can add more if needed)
  const mockVoters = {
    '200012345678': {
      nic: '200012345678',
      name: 'Herath Mudiyanselage Chandrakumara',
    },
    '123456789V': {
      nic: '123456789V',
      name: 'Kumara Perera',
    },
  };

  useEffect(() => {
    // Simulate database lookup
    const found = mockVoters[nic];
    setTimeout(() => {
      setVoter(found || null);
    }, 500); // simulate delay
  }, [nic]);

  if (voter === null) {
    return (
      <div className="nic-page">
        <h2 style={{ color: 'red' }}>Voter Not Found</h2>
      </div>
    );
  }

  return (
    <div className="nic-page">
      <header className="header">
        <h2>මැතිවරණ කොමිෂන් සභාව 2025</h2>
        <h3>Election Commission 2025</h3>
      </header>

      <div className="voter-card">
        <label>ID Number</label>
        <input type="text" value={voter.nic.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, 'xxx xxx xxx x')} readOnly />

        <label>Name</label>
        <input type="text" value={voter.name} readOnly />

        <button className="confirm-btn">Confirm</button>
      </div>
    </div>
  );
}

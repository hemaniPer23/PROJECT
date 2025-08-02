import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigation
import './Electionday5.css';

const Electionday5 = () => {
  const [voterData, setVoterData] = useState({
    idNumber: '',
    name: '',
  });

  const navigate = useNavigate(); // ✅ initialize

  useEffect(() => {
    // Simulate fetching from backend
    const fetchData = async () => {
      const response = {
        idNumber: 'xxx xxx xxx x',
        name: 'Herath Mudiyanselage Chandrakumara',
      };
      setVoterData(response);
    };

    fetchData();
  }, []);

  const handleConfirm = () => {
    console.log('Confirming Voter:', voterData);

    // ✅ Redirect to Electionday6
    navigate('/electionday6', { state: { voterData } });
  };

  return (
    <div className="confirmation-wrapper">
      <div className="page-title">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      <div className="confirmation-card">
        <label>ID Number</label>
        <p className="id-display">{voterData.idNumber}</p>

        <label>Name</label>
        <p className="name-display">{voterData.name}</p>

        <button className="btn-confirm" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Electionday5;

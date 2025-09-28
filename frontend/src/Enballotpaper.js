import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './image/bg3.jpg';

const Enballotpaper = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedRanks, setSelectedRanks] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const candidates = [
    {
      id: 1,
      name: 'Shantha Handapana',
      icon: '/icon/Freedom_And_Wisdom_Alliance.jpeg',
      photo: '/Photor/Shantha_Handapana.jpg'
    },
    {
      id: 2,
      name: 'Parama Piwithuru Kusalarachchi',
      icon: '/icon/National_Unity_Front.jpeg',
      photo: '/Photor/Parama_Piwithuru_Kusalarachchi.jpg'
    },
    {
      id: 3,
      name: 'Arunachalam Perera',
      icon: '/icon/National_Dawn_Front.jpeg',
      photo: '/Photor/Arunachalam_Perera.jpg'
    },
    {
      id: 4,
      name: 'Sumana Boralugoda',
      icon: '/icon/Independent_Women_Party.jpeg',
      photo: '/Photor/Sumana_Boralugoda.jpg'
    }
  ];

  const handleSingleSelect = (id) => {
    setSelectedCandidate(id);
    setSubmitted(true);
  };

  const handleRankClick = (candidateId, rank) => {
    const updated = { ...selectedRanks };
    Object.entries(updated).forEach(([key, value]) => {
      if (value === rank) delete updated[key];
    });
    updated[candidateId] = rank;
    setSelectedRanks(updated);
  };

  const handleSubmit = () => {
    const selectedCount = Object.keys(selectedRanks).length;
    if (selectedCount < 3) {
      alert("Please give your preference in order of preference for a candidate or Candidates.");
      return;
    }
    setSubmitted(true);
  };

  const styles = {
    container: {
      maxWidth: 1000,
      margin: "20px auto",
      padding: 10,
      border: "2px solid #ccc",
      borderRadius: 12,
      backgroundColor: "rgba(123, 235, 235, 0.9)",
      fontFamily: "sans-serif"
    },
    ballot: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    },
    candidateRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: "10px 20px",
      borderRadius: 6,
      border: "1px solid #ccc",
      cursor: "pointer"
    },
    iconImage: {
      width: 60,
      height: 60
    },
    rankButtons: {
      display: "flex",
      gap: 5
    },
    rankButton: (active) => ({
      padding: "6px 12px",
      borderRadius: 6,
      border: "1px solid #666",
      backgroundColor: active ? "#007bff" : "#fff",
      color: active ? "#fff" : "#000",
      cursor: "pointer"
    }),
    button: {
      marginTop: 30,
      padding: 12,
      backgroundColor: "#0000ff",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 18,
      width:400
    },
    result: {
      textAlign: "center",
      padding: 10
    },
    profileImage: {
      width: 160,
      height: 180,
      borderRadius: "80%",
      objectFit: "cover",
      marginBottom: 30,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)"
    }
  };

  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%',
    position: 'relative'
  };

  return (
    <div style={style}>
      <nav className="nav">
        
        <a href="enballotpaper">Back</a>
        
      </nav>

      <div style={styles.container}>
        {!submitted ? (
          <>
            <h2 style={{ textAlign: 'center' }}>Choose A Candidate Or Cast Your Vote</h2>
            <div style={styles.ballot}>
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  style={styles.candidateRow}
                  onClick={() => handleSingleSelect(candidate.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={candidate.icon} alt="symbol" style={styles.iconImage} />
                    <span>{candidate.name}</span>
                  </div>
                  <div style={styles.rankButtons} onClick={(e) => e.stopPropagation()}>
                    {[1, 2, 3].map((rank) => (
                      <button
                        key={rank}
                        style={styles.rankButton(selectedRanks[candidate.id] === rank)}
                        onClick={() => handleRankClick(candidate.id, rank)}
                      >
                        {rank}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{display: "flex", justifyContent: "center"}}>
              <button style={styles.button} onClick={handleSubmit}> Next</button>
              </div>
            </div>
              
          </>
        ) : (
          <div style={styles.result}>
            {selectedCandidate ? (
              <>
                <h2>Your Choosen Candidate</h2>
                <div style={{ display: 'flex',flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <img 
          src={candidates.find(c => c.id === selectedCandidate)?.photo} 
          alt="selected" 
          style={styles.profileImage} 
        />
       
        <img 
          src={candidates.find(c => c.id === selectedCandidate)?.icon} 
          alt="icon"
          style={{ width: 60, height: 60 }}
        />
      </div>
      <p style={{ fontSize: 26 }}>
        {candidates.find(c => c.id === selectedCandidate)?.name}
      </p>
      <button style={styles.button} onClick={() => navigate('/thankyou')}>
        Confirm
      </button>
    </>
            ) : (
              <>
                <h2>Your Order Of Preference</h2>
                {Object.entries(selectedRanks)
                  .sort(([, a], [, b]) => a - b)
                  .map(([id, rank]) => {
                    const c = candidates.find((cand) => cand.id.toString() === id);
                    return (
                       <div key={id} style={{ marginBottom: 20, display: 'flex',flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              
              <img src={c.photo} alt="selected" style={styles.profileImage} />
              
              <img 
                src={c.icon} 
                alt="icon" 
                style={{ width: 60, height: 60 }}
              />
              <p style={{ fontSize: 26 }}>
                {rank} - {c.name}
              </p>
            </div>
          );
        })}
      <button style={styles.button} onClick={() => navigate('/thankyou')}>
        Confirm
         </button>
         </>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Enballotpaper;
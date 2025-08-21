import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './image/bg3.jpg';
import API from './API.js'; 

const Ballotpaper = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedRanks, setSelectedRanks] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    API.get('/api/candidate/get_candidates.php')
      .then(response => {
        if (response.data.data) {
          setCandidates(response.data.data);
        }
      })
      .catch(error => console.error('Error fetching candidates:', error));
  }, []);

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
      alert("කරුණාකර අපේක්ෂකයෙකු හෝ කැමැත්ත මත අනුපිලිවෙලින් මනාප ලබා දෙන්න.");
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
      cursor: "pointer",
      fontSize: 24,
      
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
      fontSize: 18
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
    backgroundSize: '1370px 650px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%'
  };

  return (
    <div style={style}>
      <nav class="nav"> 
            <a href="/">Home</a>
            <a href="ballotpaper">Previas</a>
            <a href="Contact">Contact</a>
           </nav>

      <div style={styles.container}>
        {!submitted ? (
          <>
            <h2 style={{ textAlign: 'center' }}>අපේක්ෂකයෙකු තෝරන්න හෝ මනාප සපයන්න</h2>
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
              <button style={styles.button} onClick={handleSubmit}>ඉදිරියට යන්න</button>
            </div>
          </>
        ) : (
      <div style={styles.result}>
  {selectedCandidate ? (
    <>
      <h2>ඔබ තෝරාගත් අපේක්ෂකයා</h2>
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
        නිවැරදි
      </button>
    </>
  ) : (
    <>
      <h2>ඔබගේ මනාප අනුපිළිවෙල</h2>
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
        නිවැරදි
         </button>
         </>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ballotpaper;
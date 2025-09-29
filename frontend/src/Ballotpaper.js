import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './image/bg3.jpg';
import API from './API.js'; // Axios instance configured with baseURL

const Ballotpaper = () => {
  const navigate = useNavigate();
  const [selectedRanks, setSelectedRanks] = useState({}); // { candidateId: rank }
  const [submitted, setSubmitted] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Assumes NIC stored in localStorage under 'nic'
  const nic = localStorage.getItem('nic');

  useEffect(() => {
    API.get('/api/candidate/get_candidates.php')
      .then(response => {
        if (response.data && response.data.data) {
          setCandidates(response.data.data);
        }
      })
      .catch(error => console.error('Error fetching candidates:', error));
  }, []);

  // Helpers to check if ranks exist
  const hasRank = (rank) => {
    return Object.values(selectedRanks).includes(rank);
  };



  const handleRankClick = (candidateId, rank) => {
    // Enforce rules:
    // 1) Can't choose rank 2 without a rank 1 already chosen
    // 2) Can't choose rank 3 without a rank 2 already chosen
    // 3) If attempting to remove rank1 while rank2 exists -> block (must remove dependent ranks first)
    //    Similarly for removing rank2 while rank3 exists.
    const updated = { ...selectedRanks };

    // If trying to set rank 2 but there is no rank 1 selected yet -> block
    if (rank === 2 && !hasRank(1)) {
      alert('ඔබ පළමු මනාපය තෝරා නොමැති බැවින් දෙවන මනාපය තේරීම සිදුකල නොහැක. Please choose 1st preference first.');
      return;
    }

    // If trying to set rank 3 but there is no rank 2 selected yet -> block
    if (rank === 3 && !hasRank(2)) {
      alert('ඔබ දෙවන මනාපය තෝරා නොමැති බැවින් තෙවන මනාපය තේරීම සිදුකල නොහැක. Please choose 2nd preference first.');
      return;
    }

    // Toggle behavior with dependency checks:
    if (updated[candidateId] === rank) {
      // Attempting to remove this rank
      // Prevent removing rank1 if rank2 exists
      if (rank === 1 && hasRank(2)) {
        alert('ඔබ දෙවන මනාපය ඉවත් කරන්නේ නැතිනම් පළමු මනාපය ඉවත් කල නොහැක. Remove 2nd preference first.');
        return;
      }
      // Prevent removing rank2 if rank3 exists
      if (rank === 2 && hasRank(3)) {
        alert('ඔබ තෙවන මනාපය ඉවත් කරන්නේ නැතිනම් දෙවන මනාපය ඉවත් කල නොහැක. Remove 3rd preference first.');
        return;
      }

      // If no blocking dependent ranks, remove the rank
      delete updated[candidateId];
    } else {
      // Assign rank to this candidate, but ensure that only one candidate holds this rank
      Object.entries(updated).forEach(([key, value]) => {
        if (value === rank) delete updated[key];
      });

      // Also: if assigning rank 1, that's allowed anytime (but will replace any existing rank1).
      // If assigning rank 2, ensure no one else already has it (we removed above).
      // If assigning rank 3 likewise.

      // Assign the rank
      updated[candidateId] = rank;
    }

    setSelectedRanks(updated);
  };

  // Build preferences payload: { preference: candidateId }
  const buildPreferencesPayload = () => {
    const prefs = {};
    Object.entries(selectedRanks).forEach(([candidateId, rank]) => {
      prefs[rank] = candidateId; // e.g., { "1": "CANDIDATE1", "2": "CANDIDATE2" }
    });
    return prefs;
  };

  const handleProceed = () => {
    if (!nic) {
      alert('NIC not found in localStorage. Make sure voter NIC is available.');
      return;
    }
    // Enforce: first (1st) preference must be chosen before proceed
    if (!hasRank(1)) {
      alert('පළමු මනාපය තෝරාගෙන නැත. Please select a 1st preference before proceeding.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleSubmit = async () => {
    if (!nic) {
      alert('NIC not found in localStorage. Make sure voter NIC is available.');
      return;
    }

    // Ensure 1st preference exists before submitting (extra safety)
    if (!hasRank(1)) {
      alert('පළමු මනාපය අවශ්‍ය වේ. Please select a 1st preference before submitting.');
      return;
    }

    const preferences = buildPreferencesPayload(); // May have 1..3 entries

    setLoading(true);
    try {
      const payload = {
        nic,
        preferences
      };

      const res = await API.post('/api/voter/record_votes_bulk.php', payload);
      if (res.data && res.data.status === 'success') {
        setSubmitted(true);
        alert('ඔබගේ මනාප සාර්ථකව රෙකෝඩ් විය.'); // "Your vote has been recorded successfully."
        navigate('/thankyou');
      } else {
        const msg = res.data && res.data.message ? res.data.message : 'Unknown error';
        alert('Failed to record votes: ' + msg);
      }
    } catch (err) {
      console.error('Axios error:', err);
      alert('Error recording votes. Check console for details.');
    } finally {
      setLoading(false);
    }
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
      color: "#000"
      
    },
    iconImage: {
      width: 60,
      height: 60
    },
    rankButtons: {
      display: "flex",
      gap: 5
    },
    rankButton: (active, disabled) => ({
      padding: "6px 12px",
      borderRadius: 6,
      border: "1px solid #666",
      backgroundColor: active ? "#007bff" : "#fff",
      color: active ? "#fff" : "#000",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }),
    button: {
      marginTop: 30,
      width:400,
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
      padding: 10,
      color:'black'
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
    position:'relative',
    minHeight: '100vh',
    width: '100%'
  };

  return (
    <div style={style}>
      <nav className="nav">
        
        <a href="/ballotpaper">Back</a>
        
      </nav>

      <div style={styles.container}>
        {!showConfirmation && !submitted ? (
          <>
            <h2 style={{ textAlign: 'center', color:'black' }}>අපේක්ෂකයෙකු තෝරන්න හෝ මනාප සපයන්න</h2>
            <div style={styles.ballot}>
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  style={styles.candidateRow}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={candidate.icon} alt="symbol" style={styles.iconImage} />
                    <span>{candidate.name}</span>
                  </div>
                  <div style={styles.rankButtons} onClick={(e) => e.stopPropagation()}>
                    {[1, 2, 3].map((rank) => {
                      // Compute disable state:
                      const disableRank2 = rank === 2 && !hasRank(1);
                      const disableRank3 = rank === 3 && !hasRank(2);
                      const disabled = (rank === 2 && disableRank2) || (rank === 3 && disableRank3);
                      return (
                        <button
                          key={rank}
                          style={styles.rankButton(selectedRanks[candidate.id] === rank, disabled)}
                          onClick={() => !disabled && handleRankClick(candidate.id, rank)}
                          disabled={disabled}
                          title={
                            disabled
                              ? rank === 2
                                ? "Select a 1st preference before choosing 2nd."
                                : "Select a 2nd preference before choosing 3rd."
                              : ""
                          }
                        >
                          {rank}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{display: "flex", justifyContent: "center"}}>
              <button
                style={styles.button}
                onClick={handleProceed}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'ඉදිරියට යන්න'}
              </button>
              </div>
              
            </div>
          </>
        ) : !submitted ? (
          <div style={styles.result}>
            <h2>ඔබගේ මනාප අනුපිළිවෙල</h2>
            {Object.entries(selectedRanks)
              .sort(([, a], [, b]) => a - b)
              .map(([id, rank]) => {
                const c = candidates.find((cand) => cand.id === id);
                return (
                  <div key={id} style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
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
            {Object.keys(selectedRanks).length === 0 && (
              <p>ඔබ කිසිදු මනාපයක් තෝරාගෙන නොමැත. (No preferences selected)</p>
            )}
            <button
              style={styles.button}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'නිවැරදි'}
            </button>
          </div>
        ) : (
          <div style={styles.result}>
            <h2>ඔබගේ ඡන්දය ලබා දී ඇත</h2>
            <p>ඔබගේ මනාප සාර්ථකව රෙකෝඩ් විය.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ballotpaper;

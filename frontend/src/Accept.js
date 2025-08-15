import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './API'; 
import backgroundImage from './image/bg3.jpg';
 
const Accept = () => {
  const navigate = useNavigate();
  
  // State to hold the details of the voter who is ready to vote
  const [verifiedVoter, setVerifiedVoter] = useState(null);
  // State to show messages like "Waiting for next voter..."
  const [message, setMessage] = useState('Waiting for authorization from the main device...');
  
  
  //continuously to check for a verified voter

  useEffect(() => {
    // This interval will call the API every 3 seconds
    const pollingInterval = setInterval(() => {

      if (!verifiedVoter) {
        const checkForVoter = async () => {
          try {
            const res = await API.get('/api/voter/get_verified_voter.php');
            
            if (res.data.status === 'success') {
              setVerifiedVoter(res.data.data); //verified voter is found, update the state
              setMessage('');  // Clear the waiting message
              clearInterval(pollingInterval); // Stop the interval
            }

          } catch (err) {
            // This error is normal when no pending voter is found
          setMessage('Waiting for authorization from the main device...');
          }
        };
        
        checkForVoter();
      }
    }, 3000); // Polls every 3 seconds


    // Cleanup function: This stops the interval 
    return () => clearInterval(pollingInterval);

  }, [verifiedVoter]);


  const handleAccess = async () => {

    // If a verified voter is found, update their status to 'Voted'
    await API.put('/api/voter/change_voter_status.php', { nic: verifiedVoter.nic });

    // Navigate to the ballot paper
    navigate('/ballotpaper', { state: { voter: verifiedVoter } });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background Layer */}
      <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        filter: 'blur(6px)',
        height: '100vh',
        width: '100%',
        position: 'absolute',
        zIndex: 1
      }} />

      {/* Foreground Modal */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2
      }}>
        <div style={{
          backgroundColor: '#fff', padding: '30px 40px', borderRadius: 12,
          textAlign: 'center', boxShadow: '0px 8px 20px rgba(0,0,0,0.25)',
          width: '90%', maxWidth: '450px'
        }}>
          
        {/* If a verified voter is found, show their details */}
          {verifiedVoter ? (
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: 10 }}>Voter Details Received</h2>
              <p><strong>NIC:</strong> {verifiedVoter.nic}</p>
              <p><strong>Name:</strong> {verifiedVoter.name}</p>
              <button onClick={handleAccess} style={{
                marginTop: '20px', padding: '10px 20px', fontSize: '16px',
                backgroundColor: '#1c3cb0ff', color: '#fff', border: 'none',
                borderRadius: '6px', cursor: 'pointer'
              }}>
                Accept and Proceed to Vote
              </button>
            </div>
          ) : (
            // If no verified voter, show the waiting message
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: 10 }}>Waiting for Voter</h2>
              <p style={{ fontSize: '16px', color: '#333' }}>{message}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Accept;
import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Css/Electionday5.css'; 
import API from './API';

const Electionday5 = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const voterData = location.state?.voter;
    
    const [message, setMessage] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    React.useEffect(() => {
        if (!voterData) {
            navigate('/electionday4');
        }
    }, [voterData, navigate]);

    // Cancel button handler
    const handleCancel = () => {
        // Navigate back to the NIC entry page
        navigate('/electionday4');
    };

    //Confirm button handler
    const handleConfirm = async () => {
        //Create a confirmation message
        const confirmationMessage = `Please confirm the voter's details:\n\nNIC: ${voterData.nic}\nName: ${voterData.name}\n\nAre you sure you want to confirm this voter?`;

        //Show the confirmation dialog to the user.
        const isConfirmed = window.confirm(confirmationMessage);

        //Only proceed if the user clicks "OK" in the dialog.
        if (isConfirmed) {
            setIsConfirming(true);
            setMessage('Confirming voter... Please wait.');

            try {
                // Call the API endpoint to update the status to 'Voted'
                const res1 = await API.put('/api/voter/change_voter_status.php', { nic: voterData.nic });
                const res2 = await API.post('/api/voter/initiate_vote.php', { nic: voterData.nic });
                if (res1.data.status === 'success' && res2.data.status === 'success') {
                  navigate('/electionday6'); // Navigate to the next page
                } else {
                    setMessage(res1.data.message || res2.data.message || 'Failed to confirm voter.');
                    setIsConfirming(false); // Re-enable button on failure
                }
            } catch (err) {
                setMessage(err.response?.data?.message || 'An error occurred.');
                setIsConfirming(false); // Re-enable button on error
            }
        } else {
            // If the user clicks "Cancel", do nothing.
            console.log("Voter confirmation was cancelled.");
        }
    };

  
    if (!voterData) {
        return <p>Loading...</p>; 
    }
 
    // Render the component UI
    return (
        <div className="confirmation-wrapper">
            <div className="page-title">
                <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
                <h2 className="title-english">Election Commission 2025</h2>
            </div>

            <div className="confirmation-card">
                <div className="detail-item">
                    <label>ID Number</label>
                    {/* Display the NIC*/}
                    <p className="id-display">{voterData.nic}</p> 
                </div>

                <div className="detail-item">
                    <label>Name</label>
                    {/* Display the Name*/}
                    <p className="name-display">{voterData.name}</p>
                </div>

                <div className="detail-item">
                    <label>Address</label>
                    {/* Display the Address*/}
                    <p className="name-display">{voterData.address}</p>
                </div>
                
                <div className="button-group">
                    {/* Buttons are disabled in confirmation is processing */}
                    <button className="btn-cancel" onClick={handleCancel} disabled={isConfirming}>
                      Cancel
                    </button>
                    <button className="btn-confirm" onClick={handleConfirm} disabled={isConfirming}>
                      {isConfirming ? 'Confirming...' : 'Confirm'}
                    </button>
                </div>
            </div>
            
            {/* Display feedback messages to the user */}
            {message && <p className="feedback-message">{message}</p>}
        </div>
    );

};

export default Electionday5;

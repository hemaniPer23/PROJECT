import React, { useState } from 'react';
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
        navigate('/electionday4');
    };

    // Confirm button handler
    const handleConfirm = async () => {
        const confirmationMessage = `Please confirm the voter's details:\n\nNIC: ${voterData.nic}\nName: ${voterData.name}\n\nAre you sure you want to confirm this voter?`;

        const isConfirmed = window.confirm(confirmationMessage);

        if (isConfirmed) {
            setIsConfirming(true);
            setMessage('Confirming voter... Please wait.');

            try {
                const res1 = await API.put('/api/voter/change_voter_status.php', { nic: voterData.nic });
                const res2 = await API.post('/api/voter/initiate_vote.php', { nic: voterData.nic });

                if (res1.data.status === 'success' && res2.data.status === 'success') {
                    navigate('/electionday6');
                } else {
                    setMessage(res1.data.message || res2.data.message || 'Failed to confirm voter.');
                    setIsConfirming(false);
                }
            } catch (err) {
                setMessage(err.response?.data?.message || 'An error occurred.');
                setIsConfirming(false);
            }
        } else {
            console.log("Voter confirmation was cancelled.");
        }
    };

    if (!voterData) {
        return <p>Loading...</p>; 
    }

    return (
        <div className="confirmation-wrapper-e5">
            <div className="page-title-e5">
                <h1 className="title-sinhala-e5">මැතිවරණ කොමිෂන් සභාව 2025</h1>
                <h2 className="title-english-e5">Election Commission 2025</h2>
            </div>

            <div className="confirmation-card-e5">
                <div className="detail-item-e5">
                    <label>ID Number</label>
                    <p className="id-display-e5">{voterData.nic}</p> 
                </div>

                <div className="detail-item-e5">
                    <label>Name</label>
                    <p className="name-display-e5">{voterData.name}</p>
                </div>

                <div className="detail-item-e5">
                    <label>Address</label>
                    <p className="address-display-e5">{voterData.address}</p>
                </div>
                
                <div className="button-group-e5">
                    <button className="btn-confirm-e5" onClick={handleConfirm} disabled={isConfirming}>
                        {isConfirming ? 'Confirming...' : 'Confirm'}
                    </button>
                    <button className="btn-cancel-e5" onClick={handleCancel} disabled={isConfirming}>
                        Cancel
                    </button>
                    
                </div>
            </div>
            
            {message && <p className="feedback-message-e5">{message}</p>}
        </div>
    );
};

export default Electionday5;

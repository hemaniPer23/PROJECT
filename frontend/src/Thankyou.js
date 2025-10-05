import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import backgroundImage from './image/bg3.jpg';

const Thankyou = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // useEffect hook to handle the timed navigation
  useEffect(() => {
    // Set a timer for 3000 milliseconds (3 seconds)
    const timer = setTimeout(() => {
      // Navigate to the '/acceptence' route after the timer ends
      // Make sure you have a route set up for '/acceptence' in your router configuration
      navigate('/accept'); 
    }, 3000);

    // Cleanup function: This will clear the timer if the component
    // unmounts before the 3 seconds are up. This is a best practice
    // to prevent memory leaks.
    return () => clearTimeout(timer);
  }, [navigate]); // The effect depends on the navigate function

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background Layer with Blur */}
      <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '30px 40px',
          borderRadius: 12,
          textAlign: 'center',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.25)',
          width: '90%',
          maxWidth: '450px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: 10,color:'black' }}>Thank you</h2>
          <p style={{ fontSize: '16px', color: '#333' }}>
            Voting Successful <br></br>✅
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Thankyou;
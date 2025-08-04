import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './image/bg3.jpg';

const Accept = () => {
  const navigate = useNavigate();

  const candidates = [
    {
      id: 1,
      name: 'මිචෙල් රූලි',
      icon: '/icon/Ruli.png',
      photo: '/Photor/Michael Rulli.png'
    },
    {
      id: 2,
      name: 'මිචෙල් එල්. ක්‍රිප්චාක්',
      icon: '/icon/Kripchark.png',
      photo: '/Photor/Michael L Kripchak.png'
    },
    {
      id: 3,
      name: 'ඇන්ඩෘ ග්‍රෑන්ට්',
      icon: '/icon/Andrew.png',
      photo: '/Photor/Andrew Grant.png'
    },
    {
      id: 4,
      name: 'ජෝන් ඔසොෆ්',
      icon: '/icon/Jon.png',
      photo: '/Photor/Jon Ossoff.png'
    }
  ];

  const handleAccess = () => {
    navigate('/ballotpaper', { state: { candidates } });
  };

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
          <h2 style={{ fontSize: '24px', marginBottom: 10 }}>ඇතුල්වීම අවශ්‍යයි</h2>
          <p style={{ fontSize: '16px', color: '#333' }}>
            ප්‍රධාන යන්ත්‍රය මඟින් ලබාදුන් අවසරය පිළිගන්න.
          </p>
          <button onClick={handleAccess} style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accept;
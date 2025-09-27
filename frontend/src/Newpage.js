import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Css/newpage.css";
import backgroundImage from './image/bg4.jpg';

function Newpage() {
  const navigate = useNavigate();
     const style = {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: '1370px 650px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              minHeight: '100vh',
              width: '100%',
            } 
  return (
   
    <div>
       <div style={style}>
         <nav class="nav"> 
            <a href="/">Home</a>
            <a href="About">About</a>
            <a href="Contact">Contact</a>
           </nav>

   
           <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
        මැතිවරණ කොමිෂන් සභාව <strong>2025</strong>
      </h1>
      <h2 style={{ textAlign: 'center', marginTop: '1rem' }}>
        Election Commission 2025
      </h2>

      <br></br><br></br>
      <div className="buttons">
        <button className="main-button"onClick={() => navigate('/island')}>සමස්ත ප්‍රතිඵලය<br></br>Whole Island</button>
        <br></br>
        <button className="main-button" onClick={() => navigate('/election')}>දිස්ත්‍රික්ක ප්‍රතිඵලය<br />District</button>
      </div>
      </div>
    </div>
  );
}

export default Newpage;
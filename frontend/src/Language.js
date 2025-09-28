import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Css/language.css";
import backgroundImage from './image/bg4.jpg';

function Language() {
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

   
           <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center' }}>
        භාෂාව තෝරන්න
      </h1>
      <h2 style={{ textAlign: 'center', marginTop: '1rem' }}>
        Select the Language
      </h2>

      <br></br><br></br>
      <div className="language-buttons">
        <button className="language1-main-button"onClick={() => navigate('/language')}> <strong>සිංහල</strong></button>
        <br></br>
        <button className="language-main-button" onClick={() => navigate('/enballotpaper')}>English</button>
      </div>
      </div>
    </div>
  );
}

export default Language;
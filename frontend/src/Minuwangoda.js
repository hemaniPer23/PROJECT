import React from "react";
import "./island.css";
import backgroundImage from './image/bg4.jpg';

const candidates = [
  {
    name: "Michael Rulli",
    votes: "634,915",
    percentage: "42.31%",
    color: "#b30059",
    image: '/Photor/Michael Rulli.png',
  },
  {
    name: "Michael L Kripchak",
    votes: "363,035",
    percentage: "32.76%",
    color: "#2ddadaff",
    image: '/Photor/Michael L Kripchak.png',
  },
  {
    name: "Andrew Grant",
    votes: "299,767",
    percentage: "17.26%",
    color: "#009933",
    image: '/Photor/Andrew Grant.png',
  },
  {
    name: "Jon Ossoff",
    votes: "42,781",
    percentage: "2.57%",
    color: "#800000",
    image: '/Photor/Jon Ossoff.png',
  },
];

const Minuwangoda = () => {
     const style = {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: '1250px 650px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              minHeight: '100vh',
              width: '100%',
            } 
  return (
    <div style={style}>
     <nav class="nav"> 
            <a href="/">Home</a>
            <a href="About">About</a>
            <a href="Contact">Contact</a>
           </nav>

      <div className="title">
        <h1>මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h1>මිනුවන්ගොඩ ප්‍රතිඵලය</h1>
      </div>

      <div className="card-container">
        {candidates.map((candidate, index) => (
          <div
            key={index}
            className="candidate-card"
            style={{ backgroundColor: candidate.color }}
          >
            <img src={candidate.image} alt={candidate.name} />
            <h4>{candidate.name}</h4>
            <p className="votes">{candidate.votes}</p>
            <p className="percentage">{candidate.percentage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Minuwangoda;
import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const candidates = [
  {
    name: "ශාන්ත හඳපාන",
    votes: "634,915",
    percentage: "42.31%",
    color: "#da6c12ff",
    image: '/Photor/Shantha_Handapana.jpg',
    icon: '/icon/Freedom_And_Wisdom_Alliance.jpeg',
  },
  {
    name: "පරම පිවිතුරු කුසලාරච්චි",
    votes: "363,035",
    percentage: "32.76%",
    color: "#150ba5ff",
    image: '/Photor/Parama_Piwithuru_Kusalarachchi.jpg',
    icon: '/icon/National_Unity_Front.jpeg',
  },
  {
    name: "අරුණාචලම් පෙරේරා",
    votes: "299,767",
    percentage: "17.26%",
    color: "#009933",
    image: '/Photor/Arunachalam_Perera.jpg',
    icon: '/icon/National_Dawn_Front.jpeg',
  },
  {
    name: "සුමනා බොරලුගොඩ",
    votes: "42,781",
    percentage: "2.57%",
    color: "#800000",
    image: '/Photor/Sumana_Boralugoda.jpg',
    icon: '/icon/Independent_Women_Party.jpeg',
  },
];

export default function Infopage() {
   const navigate = useNavigate();
  const { district, selection } = useParams();

  return (
    <div>
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center">
      <h1 className="title">මැතිවරණ දිස්ත්‍රික් සහ ආසන ප්‍රතිඵල</h1> {/* Title ටිකක් ලොකු */}
      <p className="text-2xl">
        ඔබ තෝරාගෙන ඇත: <strong className="text-3xl text-red-600">{district}</strong> දිස්ත්‍රික්කය <br />
        ආසනය: <strong className="text-3xl text-blue-600">{selection}</strong>
      </p>
    </div>
    <div className="card-container">
        {candidates.map((candidate, index) => (
          <div
            key={index}
            className="candidate-card"
            style={{ backgroundColor: candidate.color }}
          >
            <img src={candidate.image} alt={candidate.name} />
              <img src={candidate.icon} alt={candidate.name} 
            style={{ width: 50, height: 50 }}/>
            <h4>{candidate.name}</h4>
            <p className="votes">{candidate.votes}</p>
            <p className="percentage">{candidate.percentage}</p>
          </div>
        ))}
      </div>
      <div className="buttons">
        <button className="button"onClick={() => navigate('/election')}>Back<br></br>ආපසු</button>
         </div>
    </div>
    
  );
}
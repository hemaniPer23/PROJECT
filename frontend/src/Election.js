import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from './image/bg4.jpg';
import './election.css'; // CSS එක import කරන්න අමතක කරන්න එපා


const districtOptions = {
  "Vavnia": [" Vavuniya","Vavuniya North","Vavuniya South","Nedunkeni"],
  "Mannar": ["Mannar","Madhu","Musali"],
  "Nuwara Eliya": ["Kotmale","Hanguranketha","Walapane","Hatton","Talawakele"],
  "Kaluthara": ["Beruwala","Kalutara","Panadura","Bandaragama","Matugama"],
  "Colombo": ["Borella","Kaduwela","Dehiwala","Ratmalana","Moratuwa","Homagama"],
  "Trincomalee": ["Trincomalee Town","Kantalai","Kinniya","Muttur"],
  "Mulativu": ["Puthukkudiyiruppu","Oddusuddanය"],
  "Kurunegala": ["Panduwasnuwara","Nikaweratiya","Pannala","Kuliyapitiya","Hettipola"],
  "Jaffna": ["Point Pedro","Chavakachcheri","Nallur","Jaffna","Kilinochchi"],
   "Batticoloa": ["Batticaloa","Kattankudy","Eravur","Valachchenai","Valaichenai"],
  "Rathnapura": ["Ratnapura","Kuruwita","Balangoda","Embilipitiya","Kolonna","Pelmadulla"],
  "Monaragala": ["Wellawaya","Bibile","Madulla","Siyambalanduwa","Badalkumbura"],
  "Kilinochchi": ["Kandavalai","Karachchi"],
  "Hambantota": ["Tangalle","Beliatta","Walasmulla","Weeraketiya","Ambalantota"],
  "Badulla": ["Badulla","Bandarawela","Welimada","Hali Ela","Passara"],
  "Puttalam": ["Chilaw","Puttalam","Wennappuwa","Nattandiya","Anamaduwa"],
  "Matara": ["Kamburupitiya","Hakmana","Weligama","Akuressa","Dikwella"],
   "Kegalle":  ["Ruwanwella","Dehiowita","Yatiyantota","Aranayaka","Mawanella"],
  "Gampaha": ["Minuwangoda","Gampaha","Dompe","Attanagalla","Ja-Ela"],
  "Anuradhapura": ["Kekirawa","Mihintale","Medawachchiya","Thambuttegama","Horowpothana"],
  "Polonnaruwa": ["Medirigiriya","Lankapura","Dimbulagala","Hingurakgoda","Polonnaruwa"],
  "Matale": ["Rattota","Ukuwela","Yatawatta","Ambanganga Korale","Laggala-Pallegama"],
  "Kandy": ["Gampola","Nawalapitiya","Udunuwara","Yatinuwara","Senkadagala"],
  "Galle": ["Ambalangoda","Karandeniya","Bentara-Elpitiya","Hiniduma","Ratgama"],
  "Ampara": ["Ampara","Kalmunai","Samanthurai","Akkaraipattu","Pottuvil"]
};

export default function Election() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selection, setSelection] = useState("");
  const navigate = useNavigate();

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    setSelection("");
  };

  const handleSubmit = () => {
    if (selectedDistrict && selection) {
      navigate(`/district/${selectedDistrict}/${selection}`);
    }
  };

  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: '1250px 650px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '2rem'
  };

  return (
    <div style={style}>
        <nav class="nav"> 
            <a href="/">Home</a>
            <a href="About">About</a>
            <a href="Contact">Contact</a>
           </nav>
      <h1 className="title">දිස්ත්‍රික් සහ ආසන මට්ටමේ ප්‍රතිඵල</h1>

      <div className="district-grid">
        {Object.keys(districtOptions).map((district) => (
          <button
            key={district}
            className={`district-button ${
              selectedDistrict === district ? "selected" : ""
            }`}
            onClick={() => handleDistrictClick(district)}
          >
            {
              {
                "Northern": "උතුරු පළාත",
                "Vavnia": "වවුනියාව",
                "Mannar": "මන්නාරම",
                "Nuwara Eliya": "නුවර එළිය",
                "Kaluthara": "කළුතර",
                "Colombo": "කොළඹ",
                "Trincomalee":"ත්‍රිකුණාමලය",
                "Mulativu": "මුලතිව්",
                "Kurunegala":"කුරුණෑගල",
                "Jaffna": "යාපනය",
                "Batticoloa": "මඩකලපුව",
                "Rathnapura": "රත්නපුර",
                "Monaragala": "මොණරාගල",
                "Kilinochchi": "කිළිනොච්චිය",
                "Hambantota": "හම්බන්තොට",
                "Badulla": "බදුල්ල",
                "Puttalam": "පුත්තලම",
                "Matara": "මාතර",
                "Kegalle": "කෑගල්ල",
                "Gampaha": "ගම්පහ",
                "Anuradhapura": "අනුරාධපුර",
                "Polonnaruwa": "පොළොන්නරුව",
                "Matale": "මාතලේ",
                "Kandy": "මහනුවර",
                "Galle": "ගාල්ල",
                "Ampara": "අම්පාර"
              }[district]
            }
            <br />
            <span className="eng">{district}</span>
          </button>
        ))}
      </div>

      {selectedDistrict && (
        <div className="option-box">
          <label>
            "{selectedDistrict}" සඳහා ආසනය තෝරන්න:
          </label>
          <select
            value={selection}
            onChange={(e) => setSelection(e.target.value)}
          >
            <option value="">තෝරන්න...</option>
            {districtOptions[selectedDistrict].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <br />
          <button className="submit-button" onClick={handleSubmit}>
            ඉදිරියට යන්න
          </button>
        </div>
      )}
    </div>
  );
}
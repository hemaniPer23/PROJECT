import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from './image/bg4.jpg';
import './Css/election.css'; // CSS එක import කරන්න අමතක කරන්න එපා


const districtOptions = {
  "Vavnia": [" District"," Vavuniya","Vavuniya North","Vavuniya South","Nedunkeni"],
  "Mannar": [" District","Mannar","Madhu","Musali"],
  "Nuwara Eliya": [" District","Kotmale","Hanguranketha","Walapane","Hatton","Talawakele"],
  "Kaluthara": [" District","Beruwala","Kalutara","Panadura","Bandaragama","Matugama"],
  "Colombo": [" District","Borella","Kaduwela","Dehiwala","Ratmalana","Moratuwa","Homagama"],
  "Trincomalee": [" District","Trincomalee Town","Kantalai","Kinniya","Muttur"],
  "Mulativu": [" District","Puthukkudiyiruppu","Oddusuddanය"],
  "Kurunegala": [" District","Panduwasnuwara","Nikaweratiya","Pannala","Kuliyapitiya","Hettipola"],
  "Jaffna": [" District","Point Pedro","Chavakachcheri","Nallur","Jaffna","Kilinochchi"],
   "Batticoloa": [" District","Batticaloa","Kattankudy","Eravur","Valachchenai","Valaichenai"],
  "Rathnapura": [" District","Ratnapura","Kuruwita","Balangoda","Embilipitiya","Kolonna","Pelmadulla"],
  "Monaragala": [" District","Wellawaya","Bibile","Madulla","Siyambalanduwa","Badalkumbura"],
  "Kilinochchi": [" District","Kandavalai","Karachchi"],
  "Hambantota": [" District","Tangalle","Beliatta","Walasmulla","Weeraketiya","Ambalantota"],
  "Badulla": [" District","Badulla","Bandarawela","Welimada","Hali Ela","Passara"],
  "Puttalam": [" District","Chilaw","Puttalam","Wennappuwa","Nattandiya","Anamaduwa"],
  "Matara": [" District","Kamburupitiya","Hakmana","Weligama","Akuressa","Dikwella"],
   "Kegalle":  [" District","Ruwanwella","Dehiowita","Yatiyantota","Aranayaka","Mawanella"],
  "Gampaha": [" District","Minuwangoda","Gampaha","Dompe","Attanagalla","Ja-Ela"],
  "Anuradhapura": [" District","Kekirawa","Mihintale","Medawachchiya","Thambuttegama","Horowpothana"],
  "Polonnaruwa": [" District","Medirigiriya","Lankapura","Dimbulagala","Hingurakgoda","Polonnaruwa"],
  "Matale": [" District","Rattota","Ukuwela","Yatawatta","Ambanganga Korale","Laggala-Pallegama"],
  "Kandy": [" District","Gampola","Nawalapitiya","Udunuwara","Yatinuwara","Senkadagala"],
  "Galle": [" District","Ambalangoda","Karandeniya","Bentara-Elpitiya","Hiniduma","Ratgama"],
  "Ampara": [" District","Ampara","Kalmunai","Samanthurai","Akkaraipattu","Pottuvil"]
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
    backgroundSize: '1370px 650px',
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
            <a href="newpage">Previas</a>
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
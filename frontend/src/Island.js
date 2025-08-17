// import React from "react";
// import "./island.css";
// import backgroundImage from './image/bg4.jpg';

// const candidates = [
//   {
//     name: "ශාන්ත හඳපාන",
//     votes: "5,634,915",
//     percentage: "42.31%",
//     color: "#b30059",
//     image: '/Photor/Shantha_Handapana.jpg',
//   },
//   {
//     name: "පරම පිවිතුරු කුසලාරච්චි",
//     votes: "4,363,035",
//     percentage: "32.76%",
//     color: "#2ddadaff",
//     image: '/Photor/Parama_Piwithuru_Kusalarachchi.jpg',
//   },
//   {
//     name: "අරුණාචලම් පෙරේරා",
//     votes: "2,299,767",
//     percentage: "17.26%",
//     color: "#009933",
//     image: '/Photor/Arunachalam_Perera.jpg',
//   },
//   {
//     name: "සුමනා බොරලුගොඩ",
//     votes: "342,781",
//     percentage: "2.57%",
//     color: "#800000",
//     image: '/Photor/Sumana_Boralugoda.jpg',
//   },
// ];

// const Island = () => {
//       const style = {
//               backgroundImage: `url(${backgroundImage})`,
//               backgroundSize: '1370px 650px',
//               backgroundRepeat: 'no-repeat',
//               backgroundPosition: 'center',
//               minHeight: '100vh',
//               width: '100%',
//             } 
//   return (
//      <div style={style}>
//      <nav class="nav"> 
//             <a href="/">Home</a>
//             <a href="About">About</a>
//             <a href="Contact">Contact</a>
//            </nav>

//       <div className="title">
//         <h1>මැතිවරණ කොමිෂන් සභාව 2025</h1>
//         <h1>සමස්ත ප්‍රතිඵලය</h1>
//       </div>

//       <div className="card-container">
//         {candidates.map((candidate, index) => (
//           <div
//             key={index}
//             className="candidate-card"
//             style={{ backgroundColor: candidate.color }}
//           >
//             <img src={candidate.image} alt={candidate.name} />
//             <h4>{candidate.name}</h4>
//             <p className="votes">{candidate.votes}</p>
//             <p className="percentage">{candidate.percentage}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Island;

// import React, { useEffect, useState } from "react";
// import API from "./API";
// import "./island.css";
// import backgroundImage from './image/bg4.jpg';

// const Island = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     API.get("/api/admin/overallResults.php")
//       .then((res) => {
//         if (res.data.status === "success") {
//           setCandidates(res.data.data); // because results are in res.data.data
//         } else {
//           console.error("Backend error:", res.data.message);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("API error:", err);
//         setLoading(false);
//       });
//   }, []);

//   const style = {
//     backgroundImage: `url(${backgroundImage})`,
//     backgroundSize: '1370px 650px',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     minHeight: '100vh',
//     width: '100%',
//   };

//   if (loading) {
//     return <div style={style}><h2 style={{color: "white"}}>Loading results...</h2></div>;
//   }

//   return (
//     <div style={style}>
//       <nav className="nav"> 
//         <a href="/">Home</a>
//         <a href="About">About</a>
//         <a href="Contact">Contact</a>
//       </nav>

//       <div className="title">
//         <h1>මැතිවරණ කොමිෂන් සභාව 2025</h1>
//         <h1>සමස්ත ප්‍රතිඵලය</h1>
//       </div>

//       <div className="card-container">
//         {candidates.map((candidate, index) => (
//           <div
//             key={index}
//             className="candidate-card"
//             style={{ backgroundColor: `${candidate.Party_Colour}` }} // can change per candidate
//           >
//             <img
//             src={`http://localhost/PROJECT/backend/uploads/candidate_images/${candidate.Candidate_image.split('\\').pop()}`}
//             alt={candidate.Candidate_name}
//           />
//           <img
//                 src={`http://localhost/PROJECT/backend/uploads/candidate_symbols/${candidate.Candidate_symbol.split('\\').pop()}`}
//                 alt={`${candidate.Candidate_name} Symbol`}
//                 className="candidate-symbol"
//               />

//             <h4>{candidate.Candidate_name}</h4>
//             <p className="votes">{candidate.Vote_count.toLocaleString()}</p>
//             <p className="percentage">{candidate.Percentage}%</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Island;
import React, { useEffect, useState } from "react";
import API from "./API";
import "./island.css";
import backgroundImage from './image/Flag3.jpg';

const Island = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/admin/overallResults.php")
      .then((res) => {
        if (res.data.status === "success") {
          setCandidates(res.data.data);
        } else {
          console.error("Backend error:", res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: '1370px 650px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%',
  };

  if (loading) {
    return <div style={style}><h2 style={{ color: "white" }}>Loading results...</h2></div>;
  }

  return (
    <div style={style}>
      <nav className="nav"> 
        <a href="/">Home</a>
        <a href="About">About</a>
        <a href="Contact">Contact</a>
      </nav>

      <div className="title">
        <h1>මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h1>සමස්ත ප්‍රතිඵලය</h1>
      </div>

      <div className="card-container">
        {candidates.map((candidate, index) => (
          <div
            key={index}
            className="candidate-card"
            style={{ backgroundColor: candidate.Party_Colour }}
          >
            {/* Candidate Image */}
            <img
              src={`http://localhost/PROJECT/backend/uploads/candidate_images/${candidate.Candidate_image.split('\\').pop()}`}
              alt={candidate.Candidate_name}
            />

            {/* Party Logo (Symbol) */}
            <img
              src={`http://localhost/PROJECT/backend/uploads/candidate_symbols/${candidate.Party_logo.split('\\').pop()}`}
              alt={candidate.Party_name}
              style={{ width: 50, height: 50, marginTop: "5px" }}
            />

            <h4>{candidate.Candidate_name}</h4>
            <p className="votes">{candidate.Vote_count.toLocaleString()}</p>
            <p className="percentage">{candidate.Percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Island;
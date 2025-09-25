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
  const [needSecondVote, setNeedSecondVote] = useState(false);
  const [secondVoteResult, setSecondVoteResult] = useState(null);
  const [showSecondVote, setShowSecondVote] = useState(false);

  useEffect(() => {
    // 1️⃣ Load overall results
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

    // 2️⃣ Check second vote requirement (only flag here, no details yet)
    API.get("/api/admin/secondVoteResult.php")
      .then((res) => {
        if (res.data.status === "success") {
          setNeedSecondVote(res.data.need_second_vote);
        } else {
          console.error("Second vote backend error:", res.data.message);
        }
      })
      .catch((err) => {
        console.error("Second vote API error:", err);
      });
  }, []);

  const handleShowSecondVote = () => {
    API.get("/api/admin/secondVoteResult.php")
      .then((res) => {
        if (res.data.status === "success" && res.data.need_second_vote) {
          setSecondVoteResult(res.data.second_vote_result);
          setShowSecondVote(true);
        }
      })
      .catch((err) => {
        console.error("Second vote API error:", err);
      });
  };

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

  // 🔹 Prepare top-two results if second vote is shown
  let topTwoDisplay = [];
  if (showSecondVote && secondVoteResult) {
  const enriched = secondVoteResult.top_two.map((cand) => {
    // ✅ Use the correct keys from your overallResults.php
    const firstVoteCand = candidates.find(c => c.Candidate_Id === cand.candidate_id);
    const firstVotes = firstVoteCand ? firstVoteCand.Vote_count : 0;
    const totalVotes = firstVotes + cand.second_vote_count;
    return {
      candidate_id: cand.candidate_id,
      candidate_name: cand.candidate_name,
      first_votes: firstVotes,
      second_votes: cand.second_vote_count,
      total_votes: totalVotes,
    };
  });

  const sumTopTwo = enriched.reduce((acc, c) => acc + c.total_votes, 0);

  topTwoDisplay = enriched.map(c => ({
    ...c,
    percentage: ((c.total_votes / sumTopTwo) * 100).toFixed(2)
  }));

  }

  return (
    <div >
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

      {/* 🔹 Show button if backend says second vote is needed */}
      {needSecondVote && !showSecondVote && (
        <div className="secondVote">
          <button 
            onClick={handleShowSecondVote} 
            className="second-vote-btn"
          >
            Show Second Vote Results
          </button>
        </div>
      )}

      {/* 🔹 Show results after clicking */}
      {showSecondVote && secondVoteResult && (
        <div className="second-vote-results">
          <h2 className="secVotRes">Second Vote Results (Top Two)</h2>
          <div className="card-container">
            {topTwoDisplay.map((cand) => (
              <div key={cand.candidate_id} className="candidate-card">
                <h4>{cand.candidate_name}</h4>
                <p>First Votes: {cand.first_votes}</p>
                <p>Second Votes: {cand.second_votes}</p>
                <p>Total: {cand.total_votes}</p>
                <p className="percentage">{cand.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Island;

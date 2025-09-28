import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Infopage() {
  const navigate = useNavigate();
  const { district, selection } = useParams();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Fetch data from backend API
    fetch(
      `http://localhost/PROJECT/backend/api/admin/districtResults.php?electoralDivision=${district}&pollingDivision=${selection}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCandidates(data);
        } else if (data?.data) {
          setCandidates(data.data); // in case backend wraps inside {status, message, data}
        }
      })
      .catch((err) => console.error("Error fetching results:", err));
  }, [district, selection]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center">
      <h1 className="title text-3xl font-bold my-4">
        මැතිවරණ දිස්ත්‍රික් සහ ආසන ප්‍රතිඵල
      </h1>
      <p className="text-2xl mb-6">
        ඔබ තෝරාගෙන ඇත:{" "}
        <strong className="text-3xl text-red-600">{district}</strong> දිස්ත්‍රික්කය
        <br />
        ආසනය:{" "}
        <strong className="text-3xl text-blue-600">{selection}</strong>
      </p>

      {/* Cards */}
      <div className="card-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-6">
        {candidates.map((candidate, index) => (
          <div
            key={index}
            className="candidate-card rounded-2xl shadow-lg p-4 text-white text-bold flex flex-col items-center"
            style={{ backgroundColor: candidate.Party_Colour }} // default card color, you can assign based on Party_Id
          >
            {/* Candidate image */}
            <img
              src={
                "http://localhost/PROJECT/backend/uploads/candidate_images/" +
                candidate.Image.split("\\").pop()
              }
              alt={candidate.Candidate_UserName_Sinhala}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />

            <h4 className="text-xl font-bold mb-2">
              {candidate.Candidate_UserName_Sinhala}
            </h4>
            <p className="votes text-lg">Votes: {candidate.total_votes}</p>
            <p className="party text-sm mt-1">Percentage: {candidate.percentage_votes}%</p>
            <p className="party text-sm mt-1">Party: {candidate.PartyName_Sinhala}</p>
          </div>
        ))}
      </div>

      <div className="buttons my-8">
        <button
          className="button bg-red-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-red-600"
          onClick={() => navigate("/election")}
        >
          Back <br />
          ආපසු
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { useParams } from "react-router-dom";

export default function Infopage() {
  const { district, selection } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
      <h2 className="text-3xl font-bold mb-4">තොරතුරු පිටුව</h2>
      <p className="text-xl">
        ඔබ තෝරාගෙන ඇත: <strong>{district}</strong> දිස්ත්‍රික්කය <br />
        ආසනය: <strong>{selection}</strong>
      </p>
    </div>
  );
}
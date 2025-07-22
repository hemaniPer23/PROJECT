import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./LoginPage"; // adjust path if needed
import LoginHome from "./LoginHome"; // ✅ use capital L and H
import RegistrationVoter from "./RegistrationVoter";
import RegistrationCandidate from "./RegistrationCandidate";
import Choose from "./Choose";
import Category from "./Category";
import Electionday1 from "./Electionday1"; 
import Electionday2 from "./Electionday2";
import Electionday3 from "./Electionday3";
import Electionday4 from "./Electionday4";// Fixed: Changed from Choose to Category and lowercase to uppercase
import Electionday5 from "./Electionday5";
import Electionday6 from "./Electionday6";

function App() {
  const [admin, setAdmin] = useState(localStorage.getItem('admin_logged_in'));
  
  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return admin ? children : <LoginHome />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginHome />} />
        <Route path="/loginhome" element={<LoginPage setAdmin={setAdmin}/>} />
        <Route path="/registrationvoter" element={
          <ProtectedRoute>
            <RegistrationVoter />
          </ProtectedRoute>
        } />
        <Route path="/registrationcandidate" element={
          <ProtectedRoute>
            <RegistrationCandidate />
          </ProtectedRoute>
        } />
        <Route path="/choose" element={
          <ProtectedRoute>
            <Choose />
          </ProtectedRoute>
        } />
        <Route path="/category" element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        } /> 
        <Route path="/electionday1" element={
          <ProtectedRoute>
            <Electionday1 />
          </ProtectedRoute>
        } />{/* Fixed: Changed from category to Category */}
         <Route path="/electionday2" element={
          <ProtectedRoute>
            <Electionday2 />
          </ProtectedRoute>
        } />
          <Route path="/electionday3" element={
          <ProtectedRoute>
            <Electionday3 />
          </ProtectedRoute>
        } />
          <Route path="/electionday4" element={
          <ProtectedRoute>
            <Electionday4 />
          </ProtectedRoute>
        } />
          <Route path="/electionday5" element={<Electionday5 />} />
          <Route path="/electionday6" element={<Electionday6 />} />

      </Routes>
    </Router>
  );
}

export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./LoginPage"; // adjust path if needed
import LoginHome from "./LoginHome"; // ✅ use capital L and H
import Regestation from "./Regestation";
import RegestationCandidate from "./RegestationCandidate";
import Choose from "./Choose";
import Category from "./Category";
import Electionday1 from "./Electionday1"; 
import Electionday2 from "./Electionday2";
import Electionday3 from "./Electionday3";// Fixed: Changed from Choose to Category and lowercase to uppercase

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginHome />} />
        <Route path="/loginhome" element={<LoginPage />} />
        <Route path="/registration" element={<Regestation />} />
        <Route path="/registrationcandidate" element={<RegestationCandidate />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/category" element={<Category />} /> 
        <Route path="/electionday1" element={<Electionday1 />} />{/* Fixed: Changed from category to Category */}
         <Route path="/electionday2" element={<Electionday2 />} />
          <Route path="/electionday3" element={<Electionday3 />} />

      </Routes>
    </Router>
  );
}

export default App;
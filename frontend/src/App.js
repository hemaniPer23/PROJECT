import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages and Components
import LoginPage from "./LoginPage";
import LoginHome from "./LoginHome";
import RegistrationVoter from "./RegistrationVoter";
import RegistrationCandidate from "./RegistrationCandidate";
import RegistrationLogin from "./Registrationlogin";
import Choose from "./Choose";
import Category from "./Category";
import Electionday1 from "./Electionday1";
import Electionday2 from "./Electionday2";
import Electionday3 from "./Electionday3";
import Electionday4 from "./Electionday4";
import Electionday5 from "./Electionday5";
import Electionday6 from "./Electionday6";
import Electionday7 from "./Electionday7";
import Electionday8 from "./Electionday8";
import Electionday9 from "./Electionday9"; 
import Electionday10 from "./Electionday10";
import Electionday11 from "./Electionday11";// Assuming this is a new file
import Accept from "./Accept";
import Ballotpaper from "./Ballotpaper";
import Thankyou from "./Thankyou";
import Newpage from "./Newpage";
import Island from "./Island";
import Election from "./Election";
import Infopage from "./Infopage";


import Viewresults1 from "./Viewresults1";

function App() {
  const [admin, setAdmin] = useState(localStorage.getItem("admin_logged_in"));

  // ✅ Protected route logic
  const ProtectedRoute = ({ children }) => {
    return admin ? children : <LoginHome />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginHome />} />
        <Route path="/loginhome" element={<LoginPage setAdmin={setAdmin} />} />

        <Route
          path="/registrationvoter"
          element={
            <ProtectedRoute>
              <RegistrationVoter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrationcandidate"
          element={
            <ProtectedRoute>
              <RegistrationCandidate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrationlogin"
          element={
            <ProtectedRoute>
              <RegistrationLogin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/choose"
          element={
            <ProtectedRoute>
              <Choose />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electionday1"
          element={
            <ProtectedRoute>
              <Electionday1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electionday2"
          element={
            <ProtectedRoute>
              <Electionday2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electionday3"
          element={
            <ProtectedRoute>
              <Electionday3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electionday4"
          element={
            <ProtectedRoute>
              <Electionday4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electionday5"
          element={
            <ProtectedRoute>
              <Electionday5 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electionday6"
          element={
            <ProtectedRoute>
              <Electionday6 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electionday7"
          element={
            <ProtectedRoute>
              <Electionday7 />
            </ProtectedRoute>
          }
        />

         <Route
          path="/electionday8"
          element={
            <ProtectedRoute>
              <Electionday8 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/electionday9"
          element={
            <ProtectedRoute>
              <Electionday9 />
            </ProtectedRoute>
          }
        />

         <Route
          path="/electionday10"
          element={
            <ProtectedRoute>
              <Electionday10 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/electionday11"
          element={
            <ProtectedRoute>
              <Electionday11 />
            </ProtectedRoute>
          }
        />
            <Route
          path="/accept"
          element={
            <ProtectedRoute>
              <Accept />
            </ProtectedRoute>
          }
        />
           <Route
          path="/ballotpaper"
          element={
            <ProtectedRoute>
              <Ballotpaper />
            </ProtectedRoute>
          }
        />
         <Route
          path="/thankyou"
          element={
            <ProtectedRoute>
              <Thankyou />
            </ProtectedRoute>
          }
        />
          <Route
          path="/newpage"
          element={
            <ProtectedRoute>
              <Newpage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/island"
          element={
            <ProtectedRoute>
              <Island />
            </ProtectedRoute>
          }
        />
          <Route
          path="/election"
          element={
            <ProtectedRoute>
              <Election />
            </ProtectedRoute>
          }
        />
           <Route
          path="//district/:district/:selection"
          element={
            <ProtectedRoute>
              <Infopage />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/viewresults1"
          element={
            <ProtectedRoute>
              <Viewresults1 />
            </ProtectedRoute>
          }
        />

        {/* 👇 Optional: remove or fix this duplicate */}
        <Route
          path="/LoginPage"
          element={
            <ProtectedRoute>
              <LoginPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

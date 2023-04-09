import "./App.css";
import React from "react";
import LandingPage from "./components/sections/LandingPage";
import { Routes, Route } from "react-router-dom";
import ClubDashboard from "./components/sections/ClubDashboard";
//import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/AppBar";
//import SignUp from "./components/SignUp";
import styled from "styled-components";
import SignUp from "./components/sections/SignUpPage";
import AuthLoading from "./components/AuthLoading";
import UserDashboard from "./components/sections/UserDashboard";

function App() {
  return (
    <>
      <TopBar></TopBar>
      <MainContent>
        <AuthLoading>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            {/*
            <Route
              path="/clubdashboard"
              element={<ProtectedRoute element={<ClubDashboard />} />}
            />
            */}
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/clubdashboard" element={<ClubDashboard />} />
          </Routes>
        </AuthLoading>
      </MainContent>
    </>
  );
}

export default App;

const MainContent = styled.div`
  padding-top: 64px; // Adjust the padding value based on the AppBar height
`;
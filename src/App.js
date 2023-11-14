import "./App.css";
import React from "react";
import LandingPage from "./components/clubSection/LandingPage";
import { Routes, Route } from "react-router-dom";
import ClubDashboard from "./components/clubSection/ClubDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/navigation/AppBar";
import styled from "styled-components";
import SignUp from "./components/signUpAndLogin/SignUpPage";
import AuthLoading from "./components/AuthLoading";
import UserDashboard from "./components/UserSection/UserDashboard";
import { MarketPlace } from "./components/NewUserSection/MarketPlace";

function App() {
  return (
    <AppContainer>
      <TopBar></TopBar>
      <MainContent>
        <AuthLoading>
          <Routes>
            <Route path="/" element={<MarketPlace />} />
            <Route path="/login" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/userdashboard"
              element={
                <ProtectedRoute routeType="user" element={<UserDashboard />} />
              }
            />
            <Route
              path="/clubdashboard"
              element={
                <ProtectedRoute routeType="club" element={<ClubDashboard />} />
              }
            />
          </Routes>
        </AuthLoading>
      </MainContent>
    </AppContainer>
  );
}

export default App;

const MainContent = styled.div`
  margin-top: 64px; // Adjust the padding value based on the AppBar height
`;

const AppContainer = styled.div``;


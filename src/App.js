import "./App.css";
import React from "react";
import LandingPage from "./components/sections/LandingPage";
import { Routes, Route } from "react-router-dom";
import CreateProject from "./components/sections/CreateProject";
import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/AppBar";
import SignUp from "./components/SignUp";
import styled from "styled-components";

function App() {
  return (
    <>
      <TopBar></TopBar>
      <MainContent>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/createproject"
            element={<ProtectedRoute element={<CreateProject />} />}
          />
        </Routes>
      </MainContent>
    </>
  );
}

export default App;

const MainContent = styled.div`
  padding-top: 64px; // Adjust the padding value based on the AppBar height
`;
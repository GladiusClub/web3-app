import "./App.css";
import React from "react";
import LandingPage from "./components/sections/LandingPage";
import { Routes, Route } from "react-router-dom";
import CreateProject from "./components/sections/CreateProject";
import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/AppBar";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <TopBar></TopBar>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/create-project"
          element={<ProtectedRoute element={<CreateProject />} />}
        />
      </Routes>
    </>
  );
}

export default App;
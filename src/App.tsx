import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AboutMe from "./pages/AboutMe.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/about-me" replace />} />
                <Route path="/about-me" element={<AboutMe />} />
            </Routes>
        </Router>
    );
}

export default App;

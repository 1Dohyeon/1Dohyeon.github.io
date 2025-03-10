import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AboutMe from "./pages/AboutMe.tsx";
import Blogs from "./pages/Blogs.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/about-me" replace />} />
                <Route path="/about-me" element={<AboutMe />} />
                <Route path="/blogs" element={<Blogs />} />
            </Routes>
        </Router>
    );
}

export default App;

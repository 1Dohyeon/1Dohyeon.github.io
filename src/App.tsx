import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./pages/BlogList.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import Home from "./pages/Home.tsx";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs/category/:category" element={<BlogList />} />
                <Route path="/blogs/category/:category/:filename" element={<BlogDetail />} />
            </Routes>
        </Router>
    );
}

export default App;

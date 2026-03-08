import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./pages/BlogList.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import Home from "./pages/Home.tsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.tsx";
import ScrollToTop from "./components/common/ScrollToTop.tsx";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:name" element={<ProjectDetailPage />} />
                <Route path="/blogs/category/:category" element={<BlogList />} />
                <Route path="/blogs/category/:category/:filename" element={<BlogDetail />} />
            </Routes>
            <ScrollToTop />
        </Router>
    );
}

export default App;

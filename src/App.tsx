import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import BlogList from "./pages/BlogList.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import Home from "./pages/Home.tsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.tsx";
import ScrollToTop from "./components/common/ScrollToTop.tsx";
import "./App.css";

function AppRoutes() {
    const location = useLocation();
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:name" element={<ProjectDetailPage />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
            </Routes>
            {location.pathname === "/" && <ScrollToTop />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;

import React from "react";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import "../App.css";
import "../styles/Blogs.css";

function Blogs() {
    return (
        <div className="app">
            <Header />
            <section className="blogs-section">
                <a href="https://ehgusdev.tistory.com/">TSTORY BLOGS</a>
            </section>
            <Footer />
        </div>
    );
}

export default Blogs;

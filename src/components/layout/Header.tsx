import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="wrapper" id="header-wrapper">
                <Link to="/#" className="logo">
                    {/* <img src="/dotu_text_logo_white.png" alt="DOforTU Logo" /> */}
                    <h2>1Dohyeon</h2>
                </Link>
                <button className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`menu-section ${isMenuOpen ? "open" : ""}`}>
                    <div>
                        <a href="/blogs/category/TULOG" className="go-blog">
                            Blog
                        </a>
                    </div>
                    <div>
                        <Link
                            to="https://ehgusdev.tistory.com/"
                            className={location.pathname === "/about-me" ? "active" : ""}
                        >
                            Tistory
                        </Link>
                    </div>
                    <div>
                        <a href="https://github.com/1Dohyeon" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

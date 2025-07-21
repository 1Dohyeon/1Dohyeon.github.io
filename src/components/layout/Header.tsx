import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        <Link
                            to="https://ehgusdev.tistory.com/"
                            className={location.pathname === "/about-me" ? "active" : ""}
                        >
                            Blog
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

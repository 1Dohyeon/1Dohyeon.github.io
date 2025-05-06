import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

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
                    Dohyeon
                </Link>
                <button className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`menu-section ${isMenuOpen ? "open" : ""}`}>
                    <div>
                        <Link to="/about-me" className={location.pathname === "/about-me" ? "active" : ""}>
                            About me
                        </Link>
                    </div>
                    <div>
                        <Link to="/blogs" className={location.pathname === "/blogs" ? "active" : ""}>
                            Blogs
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

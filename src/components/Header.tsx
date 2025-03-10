import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <Link to="/#" className="logo">
                1Dohyeon
            </Link>
            <div className="menu-section">
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
        </header>
    );
};

export default Header;

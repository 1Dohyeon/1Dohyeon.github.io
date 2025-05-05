import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <div className="wrapper" id="header-wrapper">
                <Link to="/#" className="logo">
                    Dohyeon
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
            </div>
        </header>
    );
};

export default Header;

import React from "react";
import "../styles/Header.css";

const Header = () => {
    return (
        <header className="header">
            <h2>Dohyeon</h2>
            <div className="menu-section">
                <div>
                    <p>About me</p>
                </div>

                <div>
                    <p>Blogs</p>
                </div>
            </div>
        </header>
    );
};

export default Header;

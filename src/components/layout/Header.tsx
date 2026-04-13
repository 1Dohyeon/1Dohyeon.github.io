import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-top-border"></div>

      <div className="header-masthead">
        <h1 className="header-name">원도현(Dohyeon Won) / Backend Developer</h1>

        <div className="header-contact-info">
          <p className="contact-line">
            <span className="contact-label">Contact:</span>
            <a href="mailto:dh1072005@gmail.com">dh1072005@gmail.com</a>
          </p>

          <p className="contact-line">
            <span className="contact-label">Github:</span>
            <a
              href="https://github.com/1Dohyeon"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/1Dohyeon
            </a>
          </p>
          <p className="contact-line">
            <span className="contact-label">Study:</span>
            <a
              href="https://github.com/1Dohyeon/cs-study/"
              target="_blank"
              rel="noopener noreferrer"
            >
              cs study (github)
            </a>
          </p>
        </div>
      </div>

      <div className="header-bottom-border"></div>
    </header>
  );
};

export default Header;

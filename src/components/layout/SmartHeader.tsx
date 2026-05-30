import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/SmartHeader.css";

const HomeIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const SmartHeader: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY < lastScrollY.current || currentY < 60) {
                setVisible(true);
            } else {
                setVisible(false);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`smart-header${visible ? "" : " smart-header--hidden"}`}>
            <div className="smart-header-inner">
                <Link to="/" className="smart-header-home">
                    <HomeIcon />
                    <span className="smart-header-name">원도현 Dohyeon Won</span>
                </Link>
                <Link to="/blog" className="smart-header-blog">
                    Blog
                </Link>
            </div>
        </header>
    );
};

export default SmartHeader;

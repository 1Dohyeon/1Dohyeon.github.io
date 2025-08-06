import React, { useState, useEffect } from "react";
import "../../styles/ScrollToTop.css";

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // 스크롤 위치를 감지하여 버튼 표시/숨김 처리
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 30) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // 맨 위로 스크롤하는 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <button className="scroll-to-top" onClick={scrollToTop} aria-label="맨 위로 이동">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7 14L12 9L17 14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
        </>
    );
};

export default ScrollToTop;

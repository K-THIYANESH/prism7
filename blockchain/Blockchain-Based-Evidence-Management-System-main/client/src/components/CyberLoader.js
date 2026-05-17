import React from 'react';
import '../CSS/CyberLoader.css';

const CyberLoader = ({ message = "PROCESSING...", overlay = false }) => {
    return (
        <div className={`cyber-loader-container ${overlay ? 'overlay' : ''}`}>
            <div className="cyber-loader-ring">
                <div className="ring-inner"></div>
                <div className="ring-outer"></div>
            </div>
            <div className="cyber-loader-text">{message}</div>
        </div>
    );
};

export default CyberLoader;

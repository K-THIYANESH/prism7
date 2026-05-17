import React, { Component } from 'react';
import '../CSS/policeHome.css';
import CaseList from './CaseList';


class PoliceHome extends Component {
    render() {
        return (
            <div>
                <nav className="nav-wrapper grey darken-4 navbar">
                    <div className="container">
                        <b><a href="/" className="brand-logo">PRISM7</a></b>
                        <ul className="right">
                            <li><a href="/police">Home</a></li>
                            <li><a href="/newfir">New FIR</a></li>
                            <li><a href="/">Log out</a></li>
                        </ul>
                    </div>

                </nav>
                <h3 className="cyber-title" style={{ marginTop: '50px', marginBottom: '30px' }}>List of pending cases</h3>
                <div className="container homeList" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="card headers" style={{ backgroundColor: "rgba(0, 217, 54, 0.1)", border: "1px solid var(--accent-green)", marginBottom: "10px", width: "100%" }}>
                        <div className="row" style={{ marginBottom: 0, display: "flex", width: "100%" }}>
                            <div className="col s3 white-text"><h6>Crime ID</h6></div>
                            <div className="col s3 white-text"><h6>Offense Code</h6></div>
                            <div className="col s3 white-text"><h6>Description</h6></div>
                            <div className="col s3 white-text"><h6>Created Timestamp</h6></div>
                        </div>
                    </div>
                    <div style={{ width: "100%" }}>
                        <CaseList />
                    </div>
                </div>
            </div>
        )
    }
}

export default PoliceHome;
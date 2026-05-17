import React, { Component } from 'react';
import ViewCase from './ViewCase';
import { Link } from 'react-router';
import { getContractInstance } from "../utils/contractLoader";
import getWeb3 from "../utils/getWeb3";
import CyberLoader from './CyberLoader'; // Import Loader

import '../CSS/policeList.css';

class CaseList extends Component {

    state = {
        details: [],
        getDetailsOf: null,
        loading: true // Start in loading state
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const instance = await getContractInstance(web3, "SimpleStorage");

            // Set web3, accounts, and contract to the state
            this.setState({ web3, accounts, contract: instance }, this.getVal);

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
            this.setState({ loading: false });
        }
    };

    getVal = async () => {
        const { contract } = this.state;
        try {
            // Set a timeout to stop loading if it takes too long
            const timeout = setTimeout(() => {
                if (this.state.loading) this.setState({ loading: false });
            }, 2000);

            // Get the total number of crimes
            const count = await contract.methods.getCrimeCount().call();
            const details = [];

            // Loop through and fetch each crime details
            for (let i = 0; i < count; i++) {
                const crime = await contract.methods.getCrimeBlock(i).call();
                details.push({
                    crime_id: crime[0],
                    timestamp: crime[1],
                    offense_code: crime[2],
                    description: crime[3]
                });
            }

            clearTimeout(timeout);
            this.setState({ details, loading: false });
        } catch (error) {
            console.error("Error fetching crime details:", error);
            this.setState({ loading: false });
        }
    };

    render() {
        const { details, loading } = this.state;

        if (loading) {
            return (
                <div className="cyber-container">
                    <CyberLoader message="ACCESSING RECORDS..." />
                </div>
            );
        }

        const crimes = details.length ? (
            details.map((crime, index) => {
                var toLink = "/forensicUpdate/" + crime.crime_id;
                return (
                    <Link to={toLink} key={index} style={{ textDecoration: 'none', display: 'block' }}>
                        <div className="card list-card" style={{ backgroundColor: "rgba(10, 10, 10, 0.8)", border: "1px solid var(--border-color)", marginBottom: "10px" }}>
                            <div className="row" style={{ marginBottom: 0, padding: "15px", display: "flex", alignItems: "center", color: "#e0e0e0" }}>
                                <div className="col s3 truncate">
                                    <span style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--accent-blue)" }}>{crime.crime_id}</span>
                                </div>
                                <div className="col s3 truncate">
                                    <span style={{ fontFamily: "'Roboto Mono', monospace" }}>{crime.offense_code}</span>
                                </div>
                                <div className="col s3 truncate">
                                    <span>{crime.description}</span>
                                </div>
                                <div className="col s3 truncate">
                                    <span style={{ color: "#888", fontSize: "0.9rem" }}>{crime.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })
        ) : (
            <div className="cyber-empty-state">
                <p>NO CRIMINAL RECORDS FOUND.</p>
            </div>
        );

        return (
            <div className="cyber-container" style={{ maxWidth: "100%", padding: "0" }}>
                <div className="cyber-list-view">
                    {crimes}
                </div>
            </div>
        );
    }
}

export default CaseList;
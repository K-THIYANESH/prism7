import React, { Component } from 'react';
import '../CSS/newFIR.css';
import GenericNavbar from './Navbar/GenericNavbar';

import { getContractInstance } from "../utils/contractLoader";
import getWeb3 from "../utils/getWeb3";
import CyberLoader from './CyberLoader'; // Import Loader
import ipfs from '../ipfs'; // Import IPFS

class NewFIR extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null,
        crime_id: '',
        timestamp: '',
        offense_code: '',
        description: '',
        buffer: null, // For file storage
        loading: false
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onGetDate = this.onGetDate.bind(this);
        this.captureFile = this.captureFile.bind(this);
    }

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const instance = await getContractInstance(web3, "SimpleStorage");
            this.setState({ web3, accounts, contract: instance }, this.onGetDate);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
    };

    captureFile(event) {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({ buffer: reader.result });
        };
    }

    onSubmit(event) {
        const { accounts, contract, crime_id, timestamp, offense_code, description, buffer } = this.state;
        event.preventDefault();

        if (contract) {
            this.setState({ loading: true });

            // 1. Upload to IPFS first (if buffer exists, otherwise send empty string)
            if (buffer) {
                const options = {
                    pinataMetadata: { name: 'fir-' + crime_id },
                    pinataOptions: { cidVersion: 0 }
                };
                const body = { message: buffer };

                ipfs.pinJSONToIPFS(body, options).then((result) => {
                    this.sendTransaction(result.IpfsHash);
                }).catch((err) => {
                    console.error("IPFS Error:", err);
                    this.setState({ loading: false });
                    alert("Digital Evidence Upload Failed.");
                });
            } else {
                // No file, send empty hash
                this.sendTransaction("");
            }
        } else {
            console.error("Contract instance is not available.");
        }
    }

    sendTransaction(ipfsHash) {
        const { accounts, contract, crime_id, timestamp, offense_code, description } = this.state;

        contract.methods.addCrimeReport(crime_id, timestamp, offense_code, description, ipfsHash)
            .send({ from: accounts[0] })
            .then(result => {
                console.log("Transaction successful:", result);
                this.setState({ loading: false });
                alert("FIR and Evidence Filed Successfully!");
            })
            .catch(error => {
                console.error("Error in transaction:", error);
                this.setState({ loading: false });
                alert("Transaction Failed. Check console.");
            });
    }

    onGetDate() {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 101).toString().substring(1);
        const day = (date.getDate() + 100).toString().substring(1);
        const hour = (date.getHours() + 100).toString().substring(1);
        const mins = (date.getMinutes() + 100).toString().substring(1);
        const sec = (date.getSeconds() + 100).toString().substring(1);
        this.setState({
            timestamp: `${year}-${month}-${day} ${hour}:${mins}:${sec}`
        });
    }

    render() {
        const { loading } = this.state;

        return (
            <div className="">
                <GenericNavbar />
                {loading && <CyberLoader message="UPLOADING EVIDENCE TO BLOCKCHAIN..." overlay={true} />}
                <div className="container">
                    <div className="row">
                        <div className="col s6">
                            <div className="card reportCard">
                                <div className="card-title cardTitle2">
                                    <h4 className="cardTitle">PRISM7 FIR</h4>
                                </div>
                                <div className="card-content">
                                    <form onSubmit={this.onSubmit}>
                                        <div className="input-field">
                                            <input type="number" id="caseId" onChange={(evt) => { this.setState({ crime_id: evt.target.value }); }} required className="form-control" />
                                            <label htmlFor="caseId">Case ID</label>
                                        </div>
                                        <div className="input-field">
                                            <input value={this.state.timestamp} type="text" id="timestamp" readOnly required className="form-control" />
                                        </div>
                                        <div className="input-field">
                                            <input type="text" id="offCode" onChange={(evt) => { this.setState({ offense_code: evt.target.value }); }} required className="form-control" />
                                            <label htmlFor="offCode">Offense Code</label>
                                        </div>

                                        <div className="form-submit center">
                                            <button type="submit" className="btn-hover color-1">Upload</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s6">
                            <div className="card reportCard">
                                <div className="card-title cardTitle">
                                    <h5 className="cardTitle">Additional Details</h5>
                                </div>
                                <div className="card-content">
                                    <div className="input-field">
                                        <label htmlFor="report">Description</label>
                                        <textarea id="report" className="textAreaHeight form-control" style={{ height: '100px', paddingTop: '10px' }} onChange={(evt) => { this.setState({ description: evt.target.value }); }} required></textarea>
                                    </div>
                                    <div className="input-field" style={{ marginTop: '30px' }}>
                                        <label style={{ position: 'static', fontSize: '0.9rem' }}>Digital Evidence (Zip/Rar/Img)</label>
                                        <input type="file" onChange={this.captureFile} className="form-control" style={{ paddingTop: '10px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewFIR;

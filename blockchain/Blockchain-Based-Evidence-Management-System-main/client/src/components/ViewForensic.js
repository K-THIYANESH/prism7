import React, { Component } from 'react';
import ViewCaseNav from './Navbar/ViewForensic.js';
import CrimeScenePhotographs from './CrimeScenePhotographs';

import { getContractInstance } from "../utils/contractLoader";
import getWeb3 from "../utils/getWeb3";
import CyberLoader from './CyberLoader'; // Import Loader

import ipfs from '../ipfs';


class ViewForensic extends Component {
  state = {
    ipfsHash: '',
    buffer: null,
    web3: null,
    accounts: null,
    contract: null,
    case_id: '',
    exhibit_name: '',
    desc: '',
    timestamp: '',
    loading: false // Add loading state
  };

  constructor(props) {
    super(props);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const instance = await getContractInstance(web3, "ForensicContract");
      this.setState({
        web3,
        accounts,
        contract: instance,
        case_id: this.props.routeParams.caseId // Set the initial case_id
      }, this.onGetDate);
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
      console.log('buffer', this.state.buffer);
    };
  }

  onSubmit(event) {
    const { accounts, contract, buffer, case_id, exhibit_name, desc, timestamp } = this.state;
    event.preventDefault();

    if (!case_id || !exhibit_name || !desc || !timestamp || !buffer) {
      alert('Please fill in all the fields.');
      return;
    }

    this.setState({ loading: true }); // Start loading

    const options = {
      pinataMetadata: {
        name: 'ems-' + Date.now()
      },
      pinataOptions: {
        cidVersion: 0
      }
    };

    const body = {
      message: buffer,
    };

    ipfs.pinJSONToIPFS(body, options).then((result) => {
      console.log(result);
      console.log("case id", case_id);
      console.log("exhibit name", exhibit_name);
      console.log("desc", desc);
      console.log("time", timestamp);
      console.log("ipfsHash", result.IpfsHash);

      contract.methods.addReport(case_id, exhibit_name, desc, timestamp, result.IpfsHash).send({ from: accounts[0] })
        .then(() => {
          this.setState({ loading: false }); // Stop loading
          alert("Forensic Report Uploaded!");
        })
        .catch((err) => {
          console.error(err);
          this.setState({ loading: false });
          alert("Transaction Failed.");
        });

    }).catch((err) => {
      console.log(err);
      this.setState({ loading: false });
      alert("IPFS Upload Failed.");
    });
  }

  onGetDate = () => {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    const hour = (date.getHours() + 100).toString().substring(1);
    const mins = (date.getMinutes() + 100).toString().substring(1);
    const sec = (date.getSeconds() + 100).toString().substring(1);
    this.setState({
      timestamp: year + "-" + month + "-" + day + " " + hour + ":" + mins + ":" + sec
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.routeParams.caseId !== prevState.case_id) {
      return { case_id: nextProps.routeParams.caseId };
    }
    return null;
  }

  render() {
    const { timestamp, case_id, exhibit_name, desc, loading } = this.state;
    console.log(this.props);

    return (
      <div>
        <ViewCaseNav crimeId={case_id} />
        {loading && <CyberLoader message="UPLOADING EVIDENCE..." overlay={true} />}
        <h4 className="title-styled" style={{ marginTop: "40px", marginLeft: "235px", marginBottom: "25px" }}>Upload Forensic Reports</h4>
        <div className="container">
          <form onSubmit={this.onSubmit} id="donateForm" className="donate-form">
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group required">
                  <label htmlFor="case_id">CASE ID</label>
                  <input className="form-control" readOnly value={case_id} type="text" id="case_id" name="case_id" required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <div className="form-group required">
                  <label htmlFor="exhibit_name">EXHIBIT NAME - CODE</label>
                  <input className="form-control" type="text" id="exhibit_name" name="exhibit_name" value={exhibit_name} placeholder="Type and code of uploaded exhibit." onChange={(evt) => this.setState({ exhibit_name: evt.target.value })} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <div className="form-group required">
                  <label htmlFor="desc">DESCRIPTION</label>
                  <input className="form-control" type="text" id="desc" name="desc" value={desc} placeholder="One line description" onChange={(evt) => this.setState({ desc: evt.target.value })} required />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                <div className="form-group required">
                  <label htmlFor="file">Documents (upload in .zip or .rar format)</label>
                  <input className="form-control" type="file" accept="application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream" onChange={this.captureFile} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <div className="form-group required">
                  <label htmlFor="timestamp">TIMESTAMP</label>
                  <input value={timestamp} className="form-control" readOnly type="text" id="timestamp" name="timestamp" placeholder="2019-08-03 20:45" required />
                </div>
              </div>
              <div className="form-submit">
                <button type="submit" className="dropbtn1" style={{ marginTop: "10px" }}>Upload</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default ViewForensic;

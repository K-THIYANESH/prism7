import React, { Component } from 'react';
import '../CSS/login.css'
import notesCover from '../Images/bgimg.jpeg';
import { browserHistory } from 'react-router';

class Login extends Component {
    componentDidMount() {
        document.title = "Login"
    };
    state = {
        username: '',
        password: ''
    };
    validate = (state) => {
        var uname = this.state.username;
        var pass = this.state.password;
        if (uname == null || uname == '' || pass == null || pass == '') {
            alert("Username / Password Missing!!!");
        }
        else {
            if ((uname == "PO1234") && (pass == "1234")) {
                browserHistory.push('/police');
            }
            else if ((uname == "FO1234") && (pass == "1234")) {
                browserHistory.push('/forensichome');
            }
            else {
                alert("Wrong Username or Password");
                browserHistory.push('/');
            }
        }
    };
    render() {
        return (
            <div className="login-page-wrapper">
                <div className="card signInCard compact-login">
                    <div className="prism-logo-container">
                        <h1 className="prism-logo-text">PRISM7</h1>
                        <div className="prism-logo-subtext">INTELLIGENCE NETWORK</div>
                    </div>
                    <div className="signInContainer card-content center" style={{ paddingTop: 0 }}>
                        <h5 className="grey-text card-title-compact">AUTHENTICATION GATEWAY</h5>
                        <form onSubmit={this.submitted} className="signInForm">
                            <div className="input-field compact-field">
                                <i className="material-icons prefix grey-text text-darken-3">fingerprint</i>
                                <input className="white-text" type="text" id="email" value={this.state.username} onChange={(evt) => { this.setState({ username: evt.target.value }); }} />
                                <label htmlFor="loginID">Login ID</label>
                            </div>
                            <div className="input-field compact-field">
                                <i className="material-icons prefix grey-text text-darken-3">lock</i>
                                <input className="white-text" id="password" type="password" value={this.state.password} onChange={(evt) => { this.setState({ password: evt.target.value }); }}></input>
                                <label htmlFor="password" >Password</label>
                            </div>
                            <div className="input-field row center" style={{ display: "flex", justifyContent: "center" }}>
                                <p className="col s4">
                                    <label>
                                        <input name="dept" type="radio" value="police" />
                                        <span>Police</span>
                                    </label>
                                </p>
                                <p className="col s4">
                                    <label>
                                        <input name="dept" type="radio" value="forensics" />
                                        <span>Forensics</span>
                                    </label>
                                </p>
                                {/* <p className="col s4">
                          <label>
                              <input name="dept" type = "radio" value = "hospital"/>
                              <span>Hospital</span>
                          </label>
                      </p> */}
                            </div>
                            <div className="input-field center card-action">
                                <button className="btn-hover color-8" color="white" onClick={this.validate}>Sign In!</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;
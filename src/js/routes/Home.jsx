import React, { Component } from "react";
import { Button, Input } from "react-bootstrap";
import { Link } from "react-router";

import * as cookies from "../utils/cookies";


export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
            device_verified: cookies.getItem("voter_device_id") ? true : false,
			voter_count: null,
			organization_count: null
		};

        if (this.state.device_verified)
            location.href="ballot";
	}

	static getProps() {
		return {};
	}

	componentDidMount() {
        // this._assign_device_id();
        // this._getVoterLocation();
	}

    /**
     * verify the device id of the the active user
     * @return {undefined}
     */
    _assign_voter_device_id() {
        deviceIdGenerate(function (err, res) {
            if (res.ok) {
                console.log(res.body);
                cookies.setItem("voter_device_id", res.body.voter_device_id);
            }
            else console.log(err);
        });
    }

    /**
     * get the location of the active user
     * @return {undefined}
     */
    _getVoterLocation() {

    }

	getVoterCount() {
        this.setState({
             voter_count: "1001am"
        });
	}

    getOrganizationCount() {
        this.setState({
            organization_count: "a lot"
        });

    }

	render() {
        console.log(this.state);
        let view = this.state.device_verified ? (
			<div className="box-loader">
				<i className="fa fa-spinner fa-pulse"></i>
				<p>Loading ... One Moment</p>
			</div>
        ) : 
        (
        <div className="container-fluid well well-90">
        <h2 className="text-center">We Vote Social Voter Guide</h2>
		<ul className="list-group">
			<li className="list-group-item">Research ballot items</li>
			<li className="list-group-item">Learn from friends</li>
			<li className="list-group-item">Take to the polls</li>
		</ul>

		<ul className="list-group">
			<li className="list-group-item"><span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>&nbsp;Neutral and private</li>
			<li className="list-group-item"><span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>&nbsp;{this.state.voter_count} voters</li>
			<li className="list-group-item"><span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>&nbsp;{this.state.organization_count} not-for-profit organizations</li>
			<li className="list-group-item"><span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>&nbsp;and you.</li>
		</ul>
		<label htmlFor="address">My Ballot Location</label><br />
		<span className="small">This is our best guess - feel free to change</span>
		<Input type="text" name="address" className="form-control" defaultValue="Oakland, CA" />
		<Link to="intro_opinions">
			<Button bsStyle="primary">Go</Button>
		</Link>
		<br />
		<br />
		</div> 
		);

		return view;
	}
}

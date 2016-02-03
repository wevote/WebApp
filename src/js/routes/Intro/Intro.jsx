'use strict';
import React, { Component, PropTypes } from 'react';

import { Button, Input } from 'react-bootstrap';
import { Link } from 'react-router';

const request = require('superagent');
const web_app_config = require('../../config');

export default class Intro extends Component {
	static propTypes = {
		children: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			voterCount: null,
			orgCount: null
		}
	}

	static getProps() {
		return {};
	}

	componentDidMount() {
		this.getVoterCount();
		this.getOrgCount();
	}

	getVoterCount () {
		request
			.get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}voterCount/`)
			.end( (err, res) => {
				if (err) throw err;

				this.setState({
					voterCount: res.body.voter_count
				});
			})
	}

	getOrgCount () {
		request
			.get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}organizationCount/`)
			.end( (err, res) => {
				if (err) throw err;

				this.setState({
					orgCount: res.body.organization_count
				});
			})
	}

	componentWillUnmount() {
		// TODO
	}


	render() {
		return (
			<div>
			{ this.props.children ||
				<div className="container-fluid well well-90">
					<h2 className="text-center">We Vote Social Voter Guide</h2>
				    <ul className="list-group">
				    <li className="list-group-item">Research ballot items</li>
				    <li className="list-group-item">Learn from friends</li>
				    <li className="list-group-item">Take to the polls</li>
				    </ul>

				    <ul className="list-group">
				     	<li className="list-group-item">
						  	<span className="glyphicon glyphicon-small glyphicon-ok-sign">
							</span> &nbsp;Neutral and private
						</li>
				      	<li className="list-group-item">
					  		<span className="glyphicon glyphicon-small glyphicon-ok-sign">
							</span> &nbsp; {this.state.voterCount} voters
						</li>
				        {/* TODO When we upgrade to react@0.14.0 we can use react-intl@2.0.0-beta-1
				        <li className="list-group-item"><span className="glyphicon glyphicon-small glyphicon-ok-sign"></span>&nbsp;
				    <FormattedNumber value={this.state.voterCount} /> {' '}
				    <FormattedPlural value={this.state.voterCount}
				        one="voter"
				        other="voters"
				    /></li>*/}
						<li className="list-group-item">
							<span className="glyphicon glyphicon-small glyphicon-ok-sign">
							</span>&nbsp; {this.state.orgCount} not-for-profit organizations
						</li>
						<li className="list-group-item">
						  	<span className="glyphicon glyphicon-small glyphicon-ok-sign">
							</span>&nbsp;and you.
						</li>
					</ul>
				    <label htmlFor="address">
						My Ballot Location
					</label>
					<br/>
				    <span className="small">
						This is our best guess - feel free to change
					</span>
				    <Input
						type="text"
						name="address"
						className="form-control"
						defaultValue="Oakland, CA"
					/>
				    <Link to="/intro/opinions">
				        <Button bsStyle="primary">
							Go
						</Button>
				    </Link>
				    <br/>
				    <br/>
				</div>
			}
		</div>
		);
    }
}

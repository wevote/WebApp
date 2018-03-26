import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import Helmet from "react-helmet";
import { renderLog } from "../../utils/logging";
import Main from "../../components/Facebook/Main";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479656 */

export default class EmailBallot extends Component {
	constructor (props) {
		super(props);
	}

	static getProps () {
		return {};
	}

	render () {
    renderLog(__filename);

		const emailBallot =
			<div>
				<Helmet title="Email Your Ballot - We Vote" />
				<div className="container-fluid well">
					<h2 className="text-center">Print, Save or Email Ballot</h2>
					<div>
						<label htmlFor="last-name">Email your ballot to yourself so you can print or save</label><br />
						<input type="text"
								name="email_address"
								className="form-control"
								placeholder="Enter your email address"
						/>
						Email your ballot to yourself so you can print it, or come back
						to it later. We will never sell your email address.
						See <Link to="privacy">privacy policy</Link>.
						<br />
						<Link to="add_friends_confirmed">
							<Button bsStyle="primary">Send</Button>
						</Link><br />
						<br />
						<br />
						OR
						<br />
						<br />
						<Link to="add_friends_confirmed">
							<span><Button bsStyle="primary">Sign in with Facebook</Button><br /></span>
							<Button bsStyle="primary">Sign in with Twitter</Button>
						</Link>
						<br />
					</div>
				</div>
				<Main />
			</div>;

		return emailBallot;
	}
}

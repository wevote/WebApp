import axios from "axios";
import BottomContinueNavigation from "components/navigation/BottomContinueNavigation";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Button, ButtonToolbar, Input, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesOrganizationEmailVerifyPage extends React.Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
		return (
			<div>
				<HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"< Back"} link_route={"guides_organization_email"} />
				<div className="container-fluid well well-90">
					<h4>Verification Email Sent</h4>
					<ProgressBar striped bsStyle="success" now={40} label="%(percent)s% Complete" />
					<div>
						<p>Thank you, an email has been sent to "email@email.com" with the subject "Please verify your email address".</p>
						<br />
						<br />
						<br />
					</div>
				</div>
				<BottomContinueNavigation link_route_continue={"guides_organization_add_search"} continue_text={"Continue >"} link_route_cancel={"guides_voter"} cancel_text={"cancel"} />
			</div>
		);
	}
}

import axios from "axios";
import BottomContinueNavigation from "components/navigation/BottomContinueNavigation";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Button, ButtonToolbar, Input, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesOrganizationAddExistingLinkPage extends React.Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
		return (
			<div>
				<HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"Cancel"} link_route={"guides_voter"} />
				<div className="container-fluid well well-90">
					<h4>Existing Voter Guide</h4>
					<ProgressBar striped bsStyle="success" now={20} label="%(percent)s% Complete" />
					<form className="form-horizontal">
						<p>Does your organization already publish a voter guide on the web?</p>
						<Input type="text" label="Voter&nbsp;Guide URL" name="existing_link" labelClassName="col-xs-3" wrapperClassName="col-xs-9"
							placeholder="Enter the URL of the existing voter guide" /><br />
						<br />
						<br />
						<br />
					</form>
				</div>
				<BottomContinueNavigation link_route_continue={"guides_organization_email"} continue_text={"Continue >"} link_route_cancel={"guides_voter"} cancel_text={"cancel"} />
			</div>
		);
	}
}

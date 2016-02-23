import axios from "axios";
import BottomContinueNavigation from "components/navigation/BottomContinueNavigation";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Button, ButtonToolbar, Input, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesOrganizationBallotResultsPage extends React.Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
		var floatRight = {
			float: "right"
		};
		return (
			<div>
				<HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"< Back"} link_route={"guides_organization_ballot_search"} />
				<div className="container-fluid well well-90">
					<h4>Select Ballot Items for your Guide</h4>
					<ProgressBar striped bsStyle="success" now={90} label="%(percent)s% Complete" />
					<p>Choose all of the items you would like to add to your voter guide.
					</p>
					<br />
					<br />
				</div>
				<BottomContinueNavigation link_route_continue={"guides_organization_ballot_add_items"} params={{guide_id: 27}} continue_text={"Continue >"} link_route_cancel={"guides_voter"} cancel_text={"cancel"} />
			</div>
		);
	}
}

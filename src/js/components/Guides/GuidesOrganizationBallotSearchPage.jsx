import axios from "axios";
import BottomContinueNavigation from "components/navigation/BottomContinueNavigation";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Button, ButtonToolbar, Input, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesOrganizationBallotSearchPage extends React.Component {
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
				<HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"< Back"} link_route={"guides_organization_choose_election"} />
				<div className="container-fluid well well-90">
					<h4>Find Ballot Items for your Guide</h4>
					<ProgressBar striped bsStyle="success" now={90} label="%(percent)s% Complete" />
					<p>Search for a specific ballot item to include in your voter guide.
					</p>
					<Input type="text" name="ballot_item_keyword" className="form-control"
						placeholder="Enter keywords to search for" />
					<span style={floatRight}>
						<Link to="guides_organization_ballot_results">
							<Button bsStyle="primary">Search</Button>
						</Link>
					</span>
					<br />
					<br />
					Or<br />
					<br />
					<br />
					<p>Search for all ballot items for a specific location.
					</p>
					<Input type="text" name="ballot_item_keyword" className="form-control"
						placeholder="Enter ZIP code, city or full address" />
					<span style={floatRight}>
						<Link to="guides_organization_ballot_results">
							<Button bsStyle="primary">Search</Button>
						</Link>
					</span>
					<br />
					<br />
				</div>
				<BottomContinueNavigation link_route_continue={"guides_organization_ballot_add_items"} params={{guide_id: 27}} continue_text={"Search Later >"} link_route_cancel={"guides_voter"} cancel_text={"cancel"} />
			</div>
		);
	}
}

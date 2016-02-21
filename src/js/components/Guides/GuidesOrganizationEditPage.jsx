import axios from "axios";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Button, ButtonToolbar, Input, Navbar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesOrganizationEditPagePage extends React.Component {
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
				<HeaderBackNavigation header_text={"Edit Voter Guide"} back_to_text={"< Back to Guides"} link_route={"guides_voter"} />
				<div className="container-fluid well well-90">
					<Link to="guides_organization_add_existing_link" />

					<h4>Edit Guide</h4>
					<p>Search for more ballot items to include.
					</p>
					<Input type="text" name="ballot_item_keyword" className="form-control"
						placeholder="Enter keywords, or a location" />
					<span style={floatRight}>
						<Link to="guides_organization_ballot_add_items" params={{guide_id: 27}}>
							<Button bsStyle="primary">Search</Button>
						</Link>
					</span>
					<br />
					<br />
				</div>
			</div>
		);
	}
}

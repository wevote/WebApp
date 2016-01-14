import HeaderBackNavigation from "components/Navigation/HeaderBackNavigation";
import OrganizationsToFollowList from "components/OrganizationsToFollowList";
import React, {Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router";

{/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */}

export default class BallotOpinions extends Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
	    return (
<div>
	<HeaderBackNavigation back_to_text={"< Back to My Ballot"} />
	<div className="container-fluid well well-90">
		<h2 className="text-center">More Opinions I Can Follow</h2>
			<input type="text" name="search_opinions" className="form-control"
				   placeholder="Search by name or twitter handle." /><br />

		These organizations and public figures have opinions about items on your
              ballot. Click the 'Follow' button to pay attention to them.

		<OrganizationsToFollowList />
	</div>
</div>
		);
	}
}

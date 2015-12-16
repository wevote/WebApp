import axios from 'axios';
import BottomContinueNavigation from "components/navigation/BottomContinueNavigation";
import ElectionsListNavigation from "components/base/ElectionsListNavigation";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Button, ButtonToolbar, Input, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesOrganizationChooseElectionPage extends React.Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
	    return (
<div>
    <HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"< Back"} link_route={'guides_organization_add'} />
	<div className="container-fluid well well-90">
        <h4>Choose Election</h4>
        <ProgressBar striped bsStyle="success" now={80} label="%(percent)s% Complete" />
		<p>Which election are you creating a voter guide for?</p>
		<form>
        <ElectionsListNavigation link_route={'guides_organization_ballot_search'} />
		</form>
	</div>
    <BottomContinueNavigation link_route_continue={'guides_organization_ballot_search'} continue_text={'Continue >'} link_route_cancel={'guides_voter'} cancel_text={"cancel"} />
</div>
		);
	}
}

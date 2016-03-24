import BottomContinueNavigation from "components/navigation/BottomContinueNavigation";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Alert, Button, ButtonToolbar, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesAddOrganizationResultsPage extends React.Component {
	constructor (props) {
		super(props);
	}

	static getProps () {
		return {};
	}

	render () {
		var floatRight = {
			float: "right"
		};
		return <div>
				<HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"< Back"} link_route={'guides_organization_add_search'} />
				<div className="container-fluid well well-90">
					<h4>Existing Organizations Found</h4>
					<ProgressBar striped bsStyle="success" now={60} label="%(percent)s% Complete" />
					<Alert bsStyle="success">
						We found these organizations. Is one of them the organization you are adding? If not, click the 'Create New Voter Guide' button.
					</Alert>

					<ul className="list-group">
						<li className="list-group-item">
							<span style={floatRight}>
								<ButtonToolbar>
									<Link to="guides_organization_confirm_ownership"><Button bsStyle="info">Choose</Button></Link>
								</ButtonToolbar>
							</span>
							<Link to="org_endorsements" params={{org_id: 27}}>
								<span className="glyphicon glyphicon-small glyphicon-tower"></span>&nbsp;Organization Name<br />{/* TODO icon-org-placeholder */}
									<span className="small">
										@OrgName1<br />
										http://www.SomeOrg.org
									</span>
							</Link>
						</li>
						<li className="list-group-item">
							<span style={floatRight}>
								<ButtonToolbar>
									<Link to="guides_organization_confirm_ownership"><Button bsStyle="info">Choose</Button></Link>
								</ButtonToolbar>
							</span>
							<Link to="org_endorsements" params={{org_id: 27}}>
								<span className="glyphicon glyphicon-small glyphicon-tower"></span>&nbsp;Another Organization<br />{/* TODO icon-org-placeholder */}
									<span className="small">
										@OrgName2<br />
										http://www.SomeOrg.org
									</span>
							</Link>
						</li>
					</ul>
					<br />
					<br />
					<br />
				</div>
				<BottomContinueNavigation link_route_continue={'guides_organization_add'} continue_text={'Create New Voter Guide'} link_route_cancel={'guides_voter'} cancel_text={"cancel"} />
			</div>;
	}
}

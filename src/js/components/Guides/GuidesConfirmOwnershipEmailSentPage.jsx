import axios from "axios";
import BottomContinueNavigation from "components/navigation/BottomContinueNavigation";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Alert, Button, ButtonToolbar, Input, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesConfirmOwnershipEmailSentPage extends React.Component {
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
				<HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"< Back"} link_route={"guides_organization_confirm_ownership"} />
				<div className="container-fluid well well-90">
					<h4>Verification Email Sent</h4>
					<ProgressBar striped bsStyle="success" now={80} label="%(percent)s% Complete" />

					<div>
						Please check your email for the verification email, so you can click the link to confirm that you have
						access to the email address "email@orgemail.org". Or request another verification email.
						<span>
							<ButtonToolbar>
								<Link to="guides_organization_confirm_ownership" >
									<Button bsStyle="primary">&lt; Request Another Verification Email</Button>
								</Link>
							</ButtonToolbar>
						</span>
					</div>
					<br />
					<br />
				</div>
				<BottomContinueNavigation link_route_continue={"guides_organization_ownership_confirmed"} continue_text={"Continue >"} link_route_cancel={"guides_voter"} cancel_text={"cancel"} />
			</div>
					);
				}
			}

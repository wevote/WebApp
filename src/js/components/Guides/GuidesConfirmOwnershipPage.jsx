import axios from 'axios';
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Alert, Button, ButtonToolbar, Input, ProgressBar } from "react-bootstrap";
import { Link } from "react-router";

export default class GuidesConfirmOwnershipPage extends React.Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
        var floatRight = {
            float: 'right'
        };
	    return (
<div>
    <HeaderBackNavigation header_text={"Create Voter Guide"} back_to_text={"< Back"} link_route={'guides_organization_add_results'} />
	<div className="container-fluid well well-90">
        <h4>Confirm You Speak for this Organization</h4>
        <ProgressBar striped bsStyle="success" now={70} label="%(percent)s% Complete" />

        <div>
            <h5>Method 1</h5>
            <span style={floatRight}>
                <ButtonToolbar>
                    <Link to="guides_organization_confirm_ownership"><Button bsStyle="primary">Sign In With Twitter ></Button></Link>
                </ButtonToolbar>
            </span>
            Sign in with this organization's Twitter account, @orgHandle.
        </div>
        <hr />
        <div>
            <h5>Method 2</h5>
            Verify that you can receive email at this organization's domain, @webaddress.org.
            <Input type="text" addonBefore="@" name="add_friends_message" className="form-control"
				   placeholder="Enter @webaddress.org email address" />
			We never sell email addresses. See <Link to="privacy">privacy policy</Link>.
            <span style={floatRight}>
                <ButtonToolbar>
                    <Link to="guides_organization_confirm_ownership_email_sent"><Button bsStyle="primary">Send Email ></Button></Link>
                </ButtonToolbar>
            </span>
        </div>

        <br />
        <br />
	</div>
</div>
		);
	}
}

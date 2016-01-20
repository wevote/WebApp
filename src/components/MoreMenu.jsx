import React, { PropTypes, Component } from "react";
import { Link } from "react-router";

import LanguageSwitchNavigation from "components/LanguageSwitchNavigation";

export default class MoreMenu extends Component {
	static propTypes = {
		children: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
	    return (
			<div>
			    <div className="device-menu--large container-fluid well well-90">
			        <LanguageSwitchNavigation />
			        <h4 className="text-left">My Ballot</h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/email_ballot">Print, Save or Email Ballot</Link></li>
			            <li className="list-group-item"><Link to="/ask_or_share">Share with Friends</Link></li>
			            <li className="list-group-item"><Link to="/guides">My Voter Guides</Link></li>
			            <li className="list-group-item"><Link to="/more/opinions/followed">Public Opinions I Follow</Link></li>
			        </ul>
			        <h4 className="text-left">My Profile Settings</h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/friends">My Friends</Link></li>
			            <li className="list-group-item"><Link to="/settings">Account Settings</Link></li>
						<li className="list-group-item"><Link to="/settings/location">My Ballot Location</Link></li>
			        </ul>
			        <h4 className="text-left">About</h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/about">About We Vote</Link></li>
			            <li className="list-group-item"><Link to="/more/donate">Donate</Link></li>
			            <li className="list-group-item"><Link to="/more/volunteer">Volunteer</Link></li>
			            <li className="list-group-item"><Link to="/privacy">Terms and Policies</Link></li>
			            <li className="list-group-item"><a href="http://localhost:8000/admin/" target="_blank">Admin</a></li>
			        </ul>
			    </div>
			</div>
		);
	}
}

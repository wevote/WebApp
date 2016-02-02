import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import LanguageSwitchNavigation from "components/LanguageSwitchNavigation";
import VoterStore from 'stores/VoterStore';
const voterPhotoURL = VoterStore.voter_photo_url;

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
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/sign_in">Sign In</Link></li>
			        </ul>
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/email_ballot">Print, Save or Email Ballot</Link></li>
			            <li className="list-group-item"><Link to="/more/opinions/followed">Opinions I Follow</Link></li>
						<li className="list-group-item"><Link to="/settings/location">My Ballot Location</Link></li>
			        </ul>
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/about">About We Vote</Link></li>
			            <li className="list-group-item"><Link to="/more/privacy">Terms &amp; Policies</Link></li>
			            <li className="list-group-item"><a href="http://localhost:8000/admin/" target="_blank">Admin</a></li>
			        </ul>
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/settings">Account Settings</Link></li>
			            <li className="list-group-item"><Link to="/signout">Sign Out</Link></li>
			        </ul>
					<ul className="list-group">
			            <li className="list-group-item">
			        		<LanguageSwitchNavigation />
						</li>
			        </ul>
			    </div>
			</div>
		);
	}
}

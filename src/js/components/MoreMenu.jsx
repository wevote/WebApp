const web_app_config = require('../config');
import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import LanguageSwitchNavigation from "../components/LanguageSwitchNavigation";
import VoterStore from '../stores/VoterStore';

export default class MoreMenu extends Component {
  static propTypes = {
   	email: PropTypes.string,
   	first_name: PropTypes.string,
    signed_in_personal: PropTypes.bool,
   	voter_photo_url: PropTypes.string
  };

  constructor(props) {
	super(props);
   	this.state = {};
  }
  componentDidMount () {
    console.log("MoreMenu componentDidMount, props.signed_in_personal: " + this.props.signed_in_personal + ", state.signed_in_personal: " + this.state.signed_in_personal)
  }

  static getProps() {
	return {};
  }

  render() {

	    return (
			<div>
			    <div className="device-menu--large container-fluid well well-90">
					{this.props.signed_in_personal ?
						<span></span>
						:
						<span>
							<ul className="list-group">
								<li className="list-group-item"><Link to="/more/sign_in">Sign In</Link></li>
							</ul>
							<h4 className="text-left"></h4>
						</span>
						}
					<ul className="list-group">
			            <li className="list-group-item"><Link to="/more/email_ballot">Print or Email Ballot</Link></li>
			            <li className="list-group-item"><Link to="/more/opinions/followed">Opinions I Follow</Link></li>
						<li className="list-group-item"><Link to="/settings/location">My Ballot Location</Link></li>
			        </ul>
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/about">About We Vote</Link></li>
			            <li className="list-group-item"><Link to="/more/privacy">Terms &amp; Policies</Link></li>
			            <li className="list-group-item"><a href={ web_app_config.WE_VOTE_SERVER_ADMIN_ROOT_URL }
														   target="_blank">Admin</a></li>
			        </ul>
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/sign_in">Account Settings</Link></li>
						{this.props.signed_in_personal ?
							<li className="list-group-item"><Link to="/signout">Sign Out</Link></li>
							:
							<span></span>
						}
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

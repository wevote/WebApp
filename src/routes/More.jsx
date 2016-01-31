import React, { PropTypes, Component } from "react";

import { Link } from "react-router";

import LanguageSwitchNavigation from "components/LanguageSwitchNavigation";

export default class More extends Component {
	static propTypes = {
		children: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	/* DALE 2015-01-13 I believe we will want to deprecate this file in favor of /src/components/MoreMenu.jsx */
	render() {
	    return (
			<div>
			    <div className="container-fluid well well-90">
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/email_ballot">Print, Save or Email Ballot</Link></li>
			            <li className="list-group-item"><Link to="/more/opinions/followed">Opinions I Follow</Link></li>
			        </ul>
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
						<li className="list-group-item"><Link to="/settings/location">My Ballot Location</Link></li>
			        </ul>
			        <h4 className="text-left"></h4>
			        <ul className="list-group">
			            <li className="list-group-item"><Link to="/more/about">About We Vote</Link></li>
			            <li className="list-group-item"><Link to="/more/privacy">Terms and Policies</Link></li>
			            <li className="list-group-item"><a href="http://localhost:8000/admin/" target="_blank">Admin</a></li>
			        </ul>
			        <LanguageSwitchNavigation />
			    </div>
			</div>
		);
	}
}

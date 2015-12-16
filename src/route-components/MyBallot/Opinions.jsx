import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, ButtonToolbar } from 'react-bootstrap';

import OrganizationsToFollowList from 'components/OrganizationsToFollowList';
import HeaderBackNavigation from 'components/Navigation/HeaderBackNavigation';

{/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */}

export default class Opinions extends Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
	    return (
			<div>
				<Link to="/myballot">
					&lt; Back to my ballot
				</Link>
				<div className="container-fluid well well-90">
					<h2 className="text-center">
						More Opinions I Can Follow
					</h2>
					<input
						type="text"
						name="search_opinions"
						className="form-control"
						placeholder="Search by name or twitter handle."
					/>
					<br />

					These organizations and public figures have opinions about items on your
			              ballot. Click the 'Follow' button to pay attention to them.

					<OrganizationsToFollowList />
				</div>
			</div>
		);
	}
}

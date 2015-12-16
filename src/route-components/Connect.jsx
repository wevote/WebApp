import React, { Component } from 'react';
import { Link } from 'react-router';

import { Button } from 'react-bootstrap';

import OrganizationsToFollowList from 'components/OrganizationsToFollowList';

{/* VISUAL DESIGN HERE: https://invis.io/E45246B2C */}

export default class Connect extends Component {
    static propTypes = {

    }

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
				<div className="container-fluid well well-90">
					<h4 className="text-left">Add Friends</h4>
			        <span style={floatRight}>
			            <Link to="/connect/add"><Button bsStyle="primary">Next &gt;</Button></Link>
			        </span>
			        <p>Friends can see what you support and oppose. We never sell emails.<br />
			        <br /></p>

					<h4 className="text-left">Follow More Opinions</h4>
					<input type="text" name="search_opinions" className="form-control"
						   placeholder="Search by name or twitter handle." />
			        <Link to="add_friends_message"><Button bsStyle="primary">Select from those I Follow on Twitter &gt;</Button></Link>
					<OrganizationsToFollowList />

					<h4 className="text-left">Create Voter Guide</h4>
			        <p>To share your opinions publicly, create a voter guide.</p>
			        <Link to="guides_voter"><Button bsStyle="primary">Create Public Voter Guide &gt;</Button></Link>
			        <br />
			        <br />
				</div>
			</div>
		);
	}
}

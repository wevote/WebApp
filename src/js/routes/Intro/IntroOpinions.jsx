import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import OrganizationsToFollowList from '../../components/OrganizationsToFollowList';

export default class IntroOpinionsPage extends Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
		var float = {
			right: {
				float: 'right'
			},
			left: {
				float: 'left'
			}
		};

	    return (
            <div className="container-fluid">
                <h1>Here's the idea - Learn from Community</h1>

                <div className="well well-100">
                    <p>&nbsp;</p>
                    <p>You have organizations and friends you trust when it comes time to
                      vote. Follow them so you can see what they endorse on your ballot.</p>
                    <p className="clearfix">Or skip this.
                        <span style={float.right}>
                            <Link to="/intro/contests">
                                <Button bsStyle="primary" bsSize="small">
                                    Start on My Own >
                                </Button>
                            </Link>
                        </span>
                    </p>
                    <div>
                        <label htmlFor="search_opinions">
                            Follow Like-Minded Organizations
                        </label>
                        <br/>
                        <input
                            type="text"
                            name="search_opinions"
                            className="form-control"
                            placeholder="Search by name or twitter handle."
                        />
                        <br/>
                        <OrganizationsToFollowList />
                    </div>
                </div>
				<Link style={float.left} to="/intro">
                    <Button bsStyle="primary" bsSize="small">Back</Button>
                </Link>
				<Link style={float.right} to="/intro/contests">
                    <Button bsStyle="primary" bsSize="small">Next</Button>
                </Link>

            </div>
		);
	}
}

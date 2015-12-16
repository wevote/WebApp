import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import OrganizationsToFollowList from 'components/OrganizationsToFollowList';

export default class IntroOpinionsPage extends React.Component {
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
            <div className="container-fluid">
                <h1>Here's the idea - Learn from Community</h1>

                <div className="well well-95">
                    <p>&nbsp;</p>
                    <p>You have organizations and friends you trust when it comes time to
                      vote. Follow them so you can see what they endorse on your ballot.</p>
                    <p className="clearfix">Or skip this.
                        <span style={floatRight}>
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
                <Link to="/intro/contests">
                    Next
                </Link>

            </div>
		);
	}
}

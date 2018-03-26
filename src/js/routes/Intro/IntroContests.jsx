import React, { Component } from "react";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import { renderLog } from "../../utils/logging";

import InfoIconAction from "../../components/InfoIconAction";

export default class IntroBallotContests extends Component {
	constructor (props) {
		super(props);
	}

	static getProps () {
		return {};
	}

	render () {
    renderLog(__filename);
    let float = {
			right: {
                float: "right"
			},
			left: {
                float: "left"
			}
        };

        return <div className="container-fluid">
                <div className="well-100">
                    <p>We have found your ballot for this location:</p>

                    <div>
                        <Link to="/settings/location">
                            Oakland, CA (click to change)
                        </Link>
                    </div>

                    <p>
                        Below you can learn more about specific races or measures.
                        Or you can go straight to your full ballot.
                    </p>

                    <span style={float.right}>
                        <Link to="/ballot">
                            <Button bsStyle="primary">
                                Show me the ballot >
                            </Button>
                        </Link>
                    </span>
                    <br/>

                    <a name="candidates" />
                    <h4 className="h4">Candidates</h4>
                    <a href="#measures">Jump to Measures</a>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <Link to="/ballot">US House - District 12</Link>
                            <InfoIconAction we_vote_id="wvcand001" />
                            <br />
                            You will choose one candidate from among three that are running for this office.<br />
                            <span style={float.right}><Link to="/ballot">
                                <Button bsStyle="primary" bsSize="xsmall">Go to Candidates ></Button>
                            </Link></span>
                            <br />
                        </li>

                        <li className="list-group-item">
                            <Link to="/ballot">Governor</Link>
                            <InfoIconAction we_vote_id="wvcand001" />
                            <br />
                            You will rank your top two choices from among three that are running for this office.<br />
                            <span style={float.right}><Link to="/ballot">
                                <Button bsStyle="primary" bsSize="xsmall">Go to Candidates ></Button>
                            </Link></span>
                            <br />
                        </li>

                        <li className="list-group-item">
                            <Link to="/ballot">Mayor</Link>
                            <InfoIconAction we_vote_id="wvcand001" />
                            <br />
                            You will rank your top three choices from among seven that are running for this office.<br />
                            <span style={float.right}><Link to="/ballot">
                                <Button bsStyle="primary" bsSize="xsmall">Go to Candidates ></Button>
                            </Link></span>
                            <br />
                        </li>
                    </ul>

                    <a name="measures" />
                    <h4 className="h4">Measures</h4>
                    <a href="#candidates">Jump to Candidates</a>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <Link to="/ballot">Measure AA</Link>
                            <InfoIconAction we_vote_id="wvcand001" />
                            <br />
                            You will vote Yes or No on this Measure.<br />
                            <span style={float.right}><Link to="/ballot">
                                <Button bsStyle="primary" bsSize="xsmall">Go to this Measure ></Button>
                            </Link></span>
                            <br />
                        </li>

                        <li className="list-group-item">
                            <Link to="/ballot">Measure BB</Link>
                            <InfoIconAction we_vote_id="wvcand001" />
                            <br />
                            You will vote Yes or No on this Measure.<br />
                            <span style={float.right}><Link to="/ballot">
                                <Button bsStyle="primary" bsSize="xsmall">Go to this Measure ></Button>
                            </Link></span>
                            <br />
                        </li>

                        <li className="list-group-item">
                            <Link to="/ballot">Measure CC</Link>
                            <InfoIconAction we_vote_id="wvcand001" />
                            <br />
                            You will vote Yes or No on this Measure.<br />
                            <span style={float.right}><Link to="/ballot">
                                <Button bsStyle="primary" bsSize="xsmall">Go to this Measure ></Button>
                            </Link></span>
                            <br />
                        </li>
                    </ul>
                </div>
				<Link style={float.left} to="/intro/opinions">
					<Button bsStyle="primary" bsSize="small">
						Back
					</Button>
				</Link>
                <Link style={float.right} to="/ballot">
					<Button bsStyle="primary" bsSize="small">
                        Show me my ballot!
					</Button>
                </Link>
            </div>;
	}
}

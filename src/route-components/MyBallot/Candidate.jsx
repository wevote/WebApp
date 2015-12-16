import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import StarAction from 'components/StarAction';
import InfoIconAction from 'components/InfoIconAction';
import AskOrShareAction from 'components/AskOrShareAction';

export default class Candidate extends Component {
    static propTypes = {
        support_on: PropTypes.object,
        oppose_on: PropTypes.object
    }

    constructor(props) {
        super(props);
    }

    render() {
        var support_item = this.props.support_on ? <Link to="ballot"> 7
                <span className="glyphicon glyphicon-small glyphicon-arrow-up">
                </span>
            </Link> : <Link to="ballot"> 7
                <span className="glyphicon glyphicon-small glyphicon-arrow-up">
                </span>
            </Link>;

        var oppose_item = this.props.oppose_on ? <Link to="ballot"> 3
                <span className="glyphicon glyphicon-small glyphicon-arrow-down">
                </span>
            </Link> : <Link to="ballot"> 3
                <span className="glyphicon glyphicon-small glyphicon-arrow-down">
                </span>
            </Link>;

	    return (
            <div>
                <Link to="/myballot">
                    &lt; Back to my ballot
                </Link>
                <div className="container-fluid well well-90">
                    <ul className="list-group">
                        <li className="list-group-item">
                            <StarAction we_vote_id={'wvcand001'} />
                            <i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>
                            &nbsp;Fictional Candidate
                            {/* TODO icon-person-placeholder */}
                            <br/>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Curabitur posuere vulputate massa ut efficitur.
                            Duis a eros fringilla, dictum leo vitae, vulputate mi.
                             Nunc vitae neque nec erat fermentum... (more)
                            <br/>
                            Courtesy of Ballotpedia.org
                            <br/>
                            <StarAction we_vote_id={'wvcand001'} />
                            Running for US House - District 12
                            <InfoIconAction we_vote_id={'wvcand001'} />
                            <br/>
                            {support_item} &nbsp;&nbsp;&nbsp;
                            {oppose_item} &nbsp;&nbsp;&nbsp;
                            <AskOrShareAction />
                            <br/>
                            <div>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    defaultValue="What do you think?"
                                />
                                <Link to="ballot_candidate" params={{id: 2}}>
                                    <Button className="btn btn-small">
                                        Post Privately
                                    </Button>
                                </Link>
                            </div>
                        </li>
                    </ul>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <div className="row">
                                <div className="pull-left col-xs-2 col-md-4">
                                    <Link to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}}>
                                        <i className="iconMedium icon-icon-org-placeholder-6-2 icon-light"></i>
                                    </Link>
                                </div>
                                <div className="pull-right col-xs-10  col-md-8">
                                    <h4 className="bufferNone">
                                        <Link className="linkLight" to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}}>
                                        Organization Name<br />{/* TODO icon-org-placeholder */}
                                        </Link>
                                    </h4>
                                    <p className="typeMedium">
                                        supports
                                        <span className="small">
                                            Yesterday at 7:18 PM
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
                                Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
                            </div>
                            <br/>
                            23 Likes
                            <br/>
                        </li>
                        <li className="list-group-item">
                            <span className="glyphicon glyphicon-small glyphicon-tower">
                            </span>
                            &nbsp;Another Organization <br/>{/* TODO icon-org-placeholder */}
                            <span>
                                opposes
                            </span>
                            <span>
                                Yesterday at 2:34 PM
                            </span>
                            <br/>
                              Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
                              Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)<br />
                              5 Likes
                            <br/>
                        </li>
                    </ul>
                </div>
            </div>
		);
    }
}

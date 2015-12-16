import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import StarAction from 'components/StarAction';
import InfoIconAction from 'components/InfoIconAction';
import BallotFeedItemActionBar from 'components/BallotFeedItemActionBar';

export default class BallotList extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <div className="well well-sm split-top-skinny">
                    <StarAction we_vote_id={'wvcand001'} />
                    US House - District 12
                    <InfoIconAction we_vote_id={'wvcand001'} />
                    <ul className="list-group">
                    <li className="list-group-item">
                        <StarAction we_vote_id={'wvcand001'} />
                        <div className="row">
                          <div className="pull-left col-xs-4 col-md-4">
                            <i className="iconXlarge icon-icon-person-placeholder-6-1 icon-light"></i>
                          </div>
                          <div className="pull-right col-xs-8  col-md-8">
                            <h4 className="bufferNone">
                              <Link className="linkLight" to="candidate/2">
                                Fictional Candidate{/* TODO icon-person-placeholder */}
                              </Link>
                            </h4>
                            <p className="typeXLarge">7 support <span className="small">(more)</span></p>
                            <p className="bufferNone">3 oppose</p>
                          </div>
                        </div>
                        <BallotFeedItemActionBar />
                    </li>
                    <li className="list-group-item">
                      <StarAction we_vote_id={'wvcand001'} />
                      <div className="row">
                        <div className="pull-left col-xs-4 col-md-4">
                          <i className="iconXlarge icon-icon-person-placeholder-6-1 icon-light"></i>
                        </div>
                        <div className="pull-right col-xs-8  col-md-8">
                          <h4 className="bufferNone">
                            <Link className="linkLight" to="ballot_candidate" params={{id: 2}}>
                              Another Candidate{/* TODO icon-person-placeholder */}
                            </Link>
                          </h4>
                          <p className="bufferNone">1 support <span className="small">(more)</span></p>
                          <p className="typeXLarge">8 oppose</p>
                        </div>
                      </div>
                      <BallotFeedItemActionBar />
                    </li>
                    </ul>
                    </div>

                    <div className="well well-sm split-top-skinny">
                        <StarAction we_vote_id={'wvcand001'} />
                        <Link to="measure/2">
                        Measure AA
                        </Link>
                        <InfoIconAction we_vote_id={'wvcand001'} />
                        <ul className="list-group">
                          <li className="list-group-item">
                            <p className="bufferNone">1 support <span className="small">(more)</span></p>
                            <p className="typeXLarge">8 oppose</p>
                            <BallotFeedItemActionBar />
                          </li>
                        </ul>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum sem eu leo rutrum condimentum.
                        Maecenas nibh odio, auctor eget arcu et, auctor vehicula odio. Sed mollis id odio et volutpat.</p>
                    </div>
                </div>
        );
    }

}

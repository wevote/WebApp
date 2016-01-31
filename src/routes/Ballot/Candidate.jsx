import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import BallotStore from 'stores/BallotStore';
import CandidateDetail from 'components/Ballot/CandidateDetail';

export default class Candidate extends Component {
  static propTypes = {
    history: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    var candidate = BallotStore
      .getCandidateByWeVoteId(`${this.props.params.we_vote_id}`);


    // no candidate exists... go to ballot
    if (Object.keys(candidate).length === 0)
      this.props.history.replace('/ballot')

    return (
      <div className='candidate-detail-route'>
        <header className="row">
          <div className="col-xs-6 col-md-6 text-center">
            <Link to='/ballot'>
              &lt; Back to My Ballot
            </Link>
          </div>
          <div className="col-xs-6 col-md-6 text-center">
            <i className="icon-icon-more-opinions-2-2 icon-light icon-medium">
            </i>
            <Link
              to="/ballot/opinions"
              className="font-darkest fluff-left-narrow">
                More Opinions
            </Link>
          </div>
        </header>

        <CandidateDetail {...candidate} />

      </div>

    );

  }

  _onChange () { }
}

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import BallotStore from 'stores/BallotStore';
import BallotItem from 'components/Ballot/BallotItem';

export default class BallotList extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    BallotStore.initialize( ballot_list => this.setState({ ballot_list }));
  }

  render () {
    return (
        <div className="ballot-list">
          {
            this.state.ballot_list ?
            this.state.ballot_list.map( item =>
              <BallotItem key={item.we_vote_id} {...item} />
            ) : 'loading...'
          }
        </div>
    );
  }
};

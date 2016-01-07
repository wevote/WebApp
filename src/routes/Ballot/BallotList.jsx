import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import BallotStore from 'stores/BallotStore';

import BallotItem from 'components/Ballot/BallotItem';

export default class BallotList extends Component {
  static propTypes = {
    children: PropTypes.object,
    ballotStore: PropTypes.object
  };

    constructor(props) {
        super(props);
        this.state = {
          ballot_items: this.props.ballotStore.getOrderedBallotItems()
        }
    }

    componentDidMount () {
      this.props.ballotStore._addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount () {
      this.props.ballotStore._removeChangeListener(this._onChange.bind(this));
    }

    render () {
        var ballotList = [];
        this.state.ballot_items.forEach( item => 
            ballotList.push(
                <BallotItem
                    data={item}
                    candidates={BallotStore.getCandidateByBallotId(item.we_vote_id)}
                    key={item.we_vote_id} />
            )
        );

        return (
            <div className="ballot-list">
              { ballotList }
            </div>
        );
    }

    _onChange(data) {
      this.setState({
        ballot_items: this.props.ballotStore.getOrderedBallotItems()
      });
    }
};

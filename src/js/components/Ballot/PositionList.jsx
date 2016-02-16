import React, { Component, PropTypes } from 'react';
import BallotStore from '../../stores/BallotStore';
import PositionItem from './PositionItem';

export default class PositionList extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { position_list: [] };
  }
    // no candidate exists... go to ballot
  componentDidMount(){
    BallotStore.fetchCandidatePositionsByWeVoteId(this.props.we_vote_id)
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount(){
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange(){
    this.setState({ position_list: BallotStore.getCandidateByWeVoteId(this.props.we_vote_id).position_list });
    console.log(this.state.position_list);
  }

  render() {
    return (
      <ul className="list-group">
        { this.state.position_list.map( item =>
            <PositionItem key={item.position_we_vote_id} position_we_vote_id={item.position_we_vote_id} speaker_label={item.speaker_label}/> )
        }
      </ul>
    );
  }
}

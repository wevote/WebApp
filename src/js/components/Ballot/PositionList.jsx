import React, { Component, PropTypes } from "react";
import BallotStore from "../../stores/BallotStore";
import PositionItem from "./PositionItem";

export default class PositionList extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { position_list: [] };
  }

  componentDidMount (){
    BallotStore.fetchCandidatePositions(this.props.we_vote_id);
    this.changeListener = this._onChange.bind(this);
    BallotStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount (){
    BallotStore.removeChangeListener(this.changeListener);
  }

  _onChange (){
    this.setState({ position_list: BallotStore.getCandidateByWeVoteId(this.props.we_vote_id).position_list });
  }

  render () {
    if (!this.state.position_list){
      return <div></div>;
    }
    return <ul className="list-group">
      { this.state.position_list.map( item =>
          <PositionItem key={item.position_we_vote_id}
          position_we_vote_id={item.position_we_vote_id}
          speaker_display_name={item.speaker_display_name}
          speaker_image_url_https={item.speaker_image_url_https}
          last_updated={item.last_updated}/> )
      }
    </ul>;
  }
}

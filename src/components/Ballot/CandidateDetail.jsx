import React, { Component, PropTypes } from 'react';

export default class CandidateDetail extends Component {
  static propTypes = {
    
  };

  render () {
    let {
      ballot_item_display_name,
      candidate_photo_url,
      id,
      order_on_ballot
    } = this.props;

    return (
      <div className="candidate-detail">
        <div className="candidate-detail-photo">
          <img src="{candidate_photo_url}"></img>
        </div>
        <h1> {ballot_item_display_name} </h1>
        { console.log(this.props) }
      </div>
    );
  }
}

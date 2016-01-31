import React, { Component, PropTypes } from 'react';

export default class CandidateDetail extends Component {
  // some of these PropTypes can
  // eventually be removed, most likely..
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    candidate_email: PropTypes.string,
    candidate_phone: PropTypes.string,
    candidate_photo_url: PropTypes.string,
    candidate_url: PropTypes.string,
    contest_office_id: PropTypes.string,
    contest_office_we_vote_id: PropTypes.string,
    facebook_url: PropTypes.string,
    google_civic_election_id: PropTypes.string,
    google_plus_url: PropTypes.string,
    id: PropTypes.number,
    kind_of_ballot_item: PropTypes.string,
    maplight_id: PropTypes.number,
    ocd_division_id: PropTypes.string,
    order_on_ballot: PropTypes.string,
    party: PropTypes.string,
    politician_id: PropTypes.number,
    politician_we_vote_id: PropTypes.string,
    state_code: PropTypes.string,
    status: PropTypes.string,
    twitter_handle: PropTypes.string,
    twitter_url: PropTypes.string,
    we_vote_id: PropTypes.string,
    youtube_url: PropTypes.string,
  };

  render () {
    let {
      ballot_item_display_name,
      candidate_email,
      candidate_phone,
      candidate_photo_url,
      candidate_url,
      contest_office_id,
      contest_office_we_vote_id,
      facebook_url,
      google_civic_election_id,
      google_plus_url,
      id,
      kind_of_ballot_item,
      maplight_id,
      ocd_division_id,
      order_on_ballot,
      party,
      politician_id,
      politician_we_vote_id,
      state_code,
      status,
      twitter_handle,
      twitter_url,
      we_vote_id,
      youtube_url,
    } = this.props;

    return (
      <div className="candidate-detail">
        <h1> {ballot_item_display_name} </h1>

        <div className="candidate-detail-photo">
          <img src={candidate_photo_url}></img>
        </div>

        <div>
          { ballot_item_display_name } <br/>
          { candidate_email } <br/>
          { candidate_phone } <br/>
          { candidate_photo_url } <br/>
          { candidate_url } <br/>
          { contest_office_id } <br/>
          { contest_office_we_vote_id } <br/>
          { facebook_url } <br/>
          { google_civic_election_id } <br/>
          { google_plus_url } <br/>
          { id } <br/>
          { kind_of_ballot_item } <br/>
          { maplight_id } <br/>
          { ocd_division_id } <br/>
          { order_on_ballot } <br/>
          { party } <br/>
          { politician_id } <br/>
          { politician_we_vote_id } <br/>
          { state_code } <br/>
          { status } <br/>
          { twitter_handle } <br/>
          { twitter_url } <br/>
          { we_vote_id } <br/>
          { youtube_url } <br/>
        </div>

      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import BallotStore from "../../stores/BallotStore";
import { shortenText } from "../../utils/textFormat";

export default class BallotLocationButton extends Component {
  static propTypes = {
    ballot_location: PropTypes.object,
    goToDifferentBallot: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    let ballot_location = this.props.ballot_location;

    if (ballot_location.ballot_item_display_name !== "" || ballot_location.text_for_map_search !== "") {
      let ballot_location_shortcut_of_retrieved_ballot = "";
      let ballot_location_shortcut_matches = false;
      let ballot_returned_we_vote_id_of_retrieved_ballot = "";
      let ballot_returned_we_vote_id_matches = false;
      let ballot_location_display_name = "";
      if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_location_shortcut) {
        ballot_location_shortcut_of_retrieved_ballot = BallotStore.ballot_properties.ballot_location_shortcut;
        if (ballot_location.ballot_location_shortcut && ballot_location_shortcut_of_retrieved_ballot) {
          if (ballot_location.ballot_location_shortcut === ballot_location_shortcut_of_retrieved_ballot) {
            ballot_location_shortcut_matches = true;
          }
        }
      }
      if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_returned_we_vote_id) {
        ballot_returned_we_vote_id_of_retrieved_ballot = BallotStore.ballot_properties.ballot_returned_we_vote_id;
        if (ballot_location.ballot_returned_we_vote_id && ballot_returned_we_vote_id_of_retrieved_ballot) {
          if (ballot_location.ballot_returned_we_vote_id === ballot_returned_we_vote_id_of_retrieved_ballot) {
            ballot_returned_we_vote_id_matches = true;
          }
        }
      }
      // console.log("ballot_location");
      if (ballot_location.ballot_location_display_name && ballot_location.ballot_location_display_name !== "") {
        ballot_location_display_name = ballot_location.ballot_location_display_name;
      } else if (ballot_location.text_for_map_search !== "") {
        const maximum_address_display_length = 25;
        ballot_location_display_name = shortenText(ballot_location.text_for_map_search, maximum_address_display_length);
      } else {
        ballot_location_display_name = "My Address";
      }
      return <span className="u-push--md">
        <Button bsStyle={ballot_location_shortcut_matches || ballot_returned_we_vote_id_matches ? "info" : "default"}
                onClick={() => { this.props.goToDifferentBallot(ballot_location.ballot_returned_we_vote_id, ballot_location.ballot_location_shortcut); }} >
          <span>{ballot_location_display_name}</span>
        </Button>
      </span>;
    } else {
      return <span />;
    }
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import BallotStore from "../../stores/BallotStore";
import { shortenText } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";


// Note from Dale: We may need to use this in the future
export default class BallotLocationButton extends Component {
  static propTypes = {
    ballot_location: PropTypes.object,
    goToDifferentBallot: PropTypes.func.isRequired,
  };

  render () {
    renderLog(__filename);
    const { ballot_location: ballotLocation } = this.props;

    if (ballotLocation.ballot_item_display_name !== "" || ballotLocation.text_for_map_search !== "") {
      let ballotLocationShortcutOfRetrievedBallot = "";
      let ballotLocationShortcutMatches = false;
      let ballotReturnedWeVoteIdOfRetrievedBallot = "";
      let ballotReturnedWeVoteIdMatches = false;
      let ballotLocationDisplayName = "";
      if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_location_shortcut) {
        ballotLocationShortcutOfRetrievedBallot = BallotStore.ballotProperties.ballot_location_shortcut;
        if (ballotLocation.ballot_location_shortcut && ballotLocationShortcutOfRetrievedBallot) {
          if (ballotLocation.ballot_location_shortcut === ballotLocationShortcutOfRetrievedBallot) {
            ballotLocationShortcutMatches = true;
          }
        }
      }
      if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_returned_we_vote_id) {
        ballotReturnedWeVoteIdOfRetrievedBallot = BallotStore.ballotProperties.ballot_returned_we_vote_id;
        if (ballotLocation.ballot_returned_we_vote_id && ballotReturnedWeVoteIdOfRetrievedBallot) {
          if (ballotLocation.ballot_returned_we_vote_id === ballotReturnedWeVoteIdOfRetrievedBallot) {
            ballotReturnedWeVoteIdMatches = true;
          }
        }
      }
      // console.log("ballotLocation");
      // DALE 2018-07-31 The ballotLocationDisplayName isn't very clear. Ideally we would
      //   show only the city, state zip (instead of the full text_for_map_search), but this will require more
      //   work on the API server side to make this data available.
      // if (ballotLocation.ballot_location_display_name && ballotLocation.ballot_location_display_name !== "") {
      //   ballotLocationDisplayName = ballotLocation.ballot_location_display_name;
      // } else
      if (ballotLocation.text_for_map_search !== "") {
        const maximumAddressDisplayLength = 25;
        ballotLocationDisplayName = shortenText(ballotLocation.text_for_map_search, maximumAddressDisplayLength);
      } else {
        ballotLocationDisplayName = "My Address";
      }

      return (
        <span className="u-push--md">
          <Button
            variant={ballotLocationShortcutMatches || ballotReturnedWeVoteIdMatches ? "info" : "default"}
            onClick={() => { this.props.goToDifferentBallot(ballotLocation.ballot_returned_we_vote_id, ballotLocation.ballot_location_shortcut); }}
          >
            <span>{ballotLocationDisplayName}</span>
          </Button>
        </span>
      );
    } else {
      return <span />;
    }
  }
}

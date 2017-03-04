import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
// import EditPositionAboutCandidateModal from "../../components/VoterGuide/EditPositionAboutCandidateModal";
import FriendsOnlyIndicator from "../../components/Widgets/FriendsOnlyIndicator";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
const moment = require("moment");

export default class PositionItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    organization: PropTypes.object,  //.isRequired,
    position: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    // this.state = { showEditPositionModal: false };
  }

  // closeEditPositionModal () {
  //   this.setState({ showEditPositionModal: false });
  // }
  //
  // openEditPositionModal () {
  //   this.setState({ showEditPositionModal: true });
  // }

  render () {
    var position = this.props.position;
    var dateStr = position.last_updated;
    var dateText = moment(dateStr).startOf("day").fromNow();
    // TwitterHandle-based link
    var speakerLink = position.speaker_twitter_handle ? "/" + position.speaker_twitter_handle : "/voterguide/" + position.speaker_we_vote_id;

    let image_placeholder = "";
    if (position.speaker_type === "O") {
        image_placeholder = <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color" />;
    } else if (position.speaker_type === "V") {
        image_placeholder = <i className="icon-org-lg icon-icon-person-placeholder-6-1 icon-org-resting-color" />;
    }

    let position_description = "";
    const is_on_ballot_item_page = true;
    if (position.vote_smart_rating) {
        position_description =
          <PositionRatingSnippet {...position} />;
    } else if (position.is_support || position.is_oppose) {
      position_description = <PositionSupportOpposeSnippet {...position} is_on_ballot_item_page={is_on_ballot_item_page} />;
    } else if (position.is_information_only) {
      position_description = <PositionInformationOnlySnippet {...position} is_on_ballot_item_page={is_on_ballot_item_page} />;
    } else if (position.speaker_type === "V") {
        position_description = <p className="">
          <span>{this.props.ballot_item_display_name}</span>
          <span className="small"> { dateText }</span>
          </p>;
    }

    var show_position = true;
    var nothing_to_display = null;

    var one_position_on_this_candidate = <li className="card-child position-item">
      {/* One Position on this Candidate */}
        <div className="card-child__media-object-anchor">
          <Link to={speakerLink} className="u-no-underline">
            { position.speaker_image_url_https ?
              <ImageHandler className="card-child__avatar"
                    sizeClassName="icon-lg "
                    imageUrl={position.speaker_image_url_https}
              /> :
            image_placeholder }
          </Link>
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
          <div className="u-flex">
              <h4 className="card-child__display-name">
                <Link to={speakerLink}>
                  { position.speaker_display_name }
                </Link>
              </h4>
              <FriendsOnlyIndicator isFriendsOnly={!position.is_public_position} />
            </div>
            {/* edit_mode ?
              edit_position_description :
              position_description */}
              {position_description}
          </div>
        </div>
      </li>;

      if (show_position) {
          return one_position_on_this_candidate;
      } else {
          return nothing_to_display;
      }
  }
}

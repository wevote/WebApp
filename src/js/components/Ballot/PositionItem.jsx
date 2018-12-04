import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import moment from "moment";
import ImageHandler from "../ImageHandler";
// import EditPositionAboutCandidateModal from "../../components/VoterGuide/EditPositionAboutCandidateModal";
import FriendsOnlyIndicator from "../Widgets/FriendsOnlyIndicator";
import { renderLog } from "../../utils/logging";
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from "../../utils/organization-functions";
import PositionRatingSnippet from "../Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../Widgets/PositionSupportOpposeSnippet";


export default class PositionItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    organization: PropTypes.object, // .isRequired,
    position: PropTypes.object.isRequired,
  };

  render () {
    renderLog(__filename);
    const position = this.props.position;
    const dateStr = position.last_updated;
    const dateText = moment(dateStr).startOf("day").fromNow();
    // TwitterHandle-based link
    const speakerLink = position.speaker_twitter_handle ? `/${position.speaker_twitter_handle}` : `/voterguide/${position.speaker_we_vote_id}`;

    let image_placeholder = "";
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      image_placeholder = <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color" />;
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
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
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
      position_description = (
        <p className="">
          <span>{this.props.ballot_item_display_name}</span>
          <span className="small">
            {" "}
            { dateText }
          </span>
        </p>
      );
    }

    const show_position = true;
    const nothing_to_display = null;

    const one_position_on_this_candidate = (
      <li className="card-child position-item">
        {/* One Position on this Candidate */}
        <div className="card-child__media-object-anchor">
          <Link to={speakerLink} className="u-no-underline">
            { position.speaker_image_url_https_large ? (
              <ImageHandler
                className="card-child__avatar"
                sizeClassName="icon-lg "
                imageUrl={position.speaker_image_url_https_large}
              />
            ) :
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
      </li>
    );

    if (show_position) {
      return one_position_on_this_candidate;
    } else {
      return nothing_to_display;
    }
  }
}

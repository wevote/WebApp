import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
const moment = require("moment");

export default class PositionItem extends Component {
  static propTypes = {
    candidate_display_name: PropTypes.string.isRequired,
    last_updated: PropTypes.string,
    more_info_url: PropTypes.string,
    position_we_vote_id: PropTypes.string.isRequired,
    speaker_display_name: PropTypes.string.isRequired,
    speaker_image_url_https: PropTypes.string,
    speaker_type: PropTypes.string,
    speaker_twitter_handle: PropTypes.string.isRequired,
    statement_text: PropTypes.string,
    vote_smart_rating: PropTypes.string,
    vote_smart_time_span: PropTypes.string
  };

  render () {
    var position = this.props;
    var dateStr = this.props.last_updated;
    var dateText = moment(dateStr).startOf("day").fromNow();
    // TwitterHandle-based link
    var speakerLink = position.speaker_twitter_handle ? "/" + position.speaker_twitter_handle : "/voterguide/" + position.speaker_we_vote_id;

    let image_placeholder = "";
    if (this.props.speaker_type === "O") {
        image_placeholder = <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color position-item__avatar"></i>;
    } else if (this.props.speaker_type === "V") {
        image_placeholder = <i className="icon-org-lg icon-icon-person-placeholder-6-1 icon-org-resting-color position-item__avatar"></i>;
    }

    let position_description = "";
    const is_on_candidate_page = true;
    if (position.vote_smart_rating) {
        position_description =
          <PositionRatingSnippet {...position} />;
    } else if (position.is_support || position.is_oppose) {
      position_description = <PositionSupportOpposeSnippet {...position} is_on_candidate_page={is_on_candidate_page} />;
    } else if (position.is_information_only) {
      position_description = <PositionInformationOnlySnippet {...position} is_on_candidate_page={is_on_candidate_page} />;
    } else if (position.speaker_type === "V") {
        position_description = <p className="">
          <span>{this.props.candidate_display_name}</span>
          <span className="small"> { dateText }</span>
          </p>;
    }

    var show_position = true;
    // For now, do not show the voter's position. We will show a voter's position when can have comments.
    if (position.speaker_type === "V")
        show_position = false;

    var nothing_to_display = null;

    var one_position_on_this_candidate = <li className="position-item">
      {/* One Position on this Candidate */}
          { this.props.speaker_image_url_https ?
            <img className="bs-img-square position-item__avatar"
                  src={this.props.speaker_image_url_https}
                  width="50px"
            /> :
          image_placeholder }
        <div className="position-item__content">
          <h4 className="position-item__display-name">
            <Link to={speakerLink}>
              { this.props.speaker_display_name }
            </Link>
          </h4>
            { position_description }
        </div>
        {/* Likes coming in a later version
        <br />
        23 Likes<br />
        */}
      </li>;

      if (show_position) {
          return one_position_on_this_candidate;
      } else {
          return nothing_to_display;
      }
  }
}

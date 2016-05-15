import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
const moment = require("moment");

export default class PositionItem extends Component {
  static propTypes = {
    position_we_vote_id: PropTypes.string.isRequired,
    last_updated: PropTypes.string,
    speaker_type: PropTypes.string,
    speaker_image_url_https: PropTypes.string,
    candidate_display_name: PropTypes.string.isRequired,
    speaker_display_name: PropTypes.string.isRequired
  };

  render () {
    var position = this.props;
    var dateStr = this.props.last_updated;
    var dateText = moment(dateStr).startOf("day").fromNow();
    var speaker_we_vote_id_link = "/voterguide/" + position.speaker_we_vote_id;

    let image_placeholder = "";
    if (this.props.speaker_type === "O") {
        image_placeholder = <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color position-item__avatar"></i>;
    } else if (this.props.speaker_type === "V") {
        image_placeholder = <i className="icon-org-lg icon-icon-person-placeholder-6-1 icon-org-resting-color position-item__avatar"></i>;
    }

    let position_description = null;
    if (!position.vote_smart_rating && (position.is_support || position.is_oppose)) {
      position_description = <p className="">
        { position.is_support ? "[support icon]" : "[oppose icon]" }
        <span className="position-item__position-label">
          { position.is_support ? "Supports" : "Opposes" }
          {this.props.candidate_display_name}
        </span>
      </p>;
    } else if (position.vote_smart_rating) {
        position_description = <div className="position-rating">
          {/* Rating Icon */}
          <div className="position-rating__text">
            <span className="position-rating__percentage" data-percentage={position.vote_smart_rating}>{position.vote_smart_rating}% </span> rating
            <span className="position-rating__timestamp">
              { position.vote_smart_time_span ?
                <span> in {position.vote_smart_time_span} </span> :
                <span>{ dateText } </span>
              }
            </span>
            { position.vote_smart_rating ? <span className="position-item__position-source">(source: VoteSmart.org)</span> : null }
          </div>
        </div>;
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

    var nothing_to_display = <span></span>;

    var one_position_on_this_candidate = <li className="position-item">
      {/* One Position on this Candidate */}
          { this.props.speaker_image_url_https ?
            <img className="img-square position-item__avatar"
                  src={this.props.speaker_image_url_https}
                  width="50px"
            /> :
          image_placeholder }
        <div className="position-item__content">
            <h4 className="position-item__name">
              <Link to={speaker_we_vote_id_link}>
                { this.props.speaker_display_name }
              </Link>
              { position.is_support && !position.vote_smart_rating ? <span>
                  &nbsp;support</span> : null }
              { position.is_oppose && !position.vote_smart_rating ? <span>
                  &nbsp;oppose</span> : <span></span> }
            </h4>
              { position_description }
        </div>
        {/* Likes coming in a later version
        <br />
        23 Likes<br />
        */}
      </li>

      if (show_position) {
          return one_position_on_this_candidate;
      } else {
          return nothing_to_display;
      }
  }
}

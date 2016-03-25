import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
const moment = require("moment");

export default class PositionItem extends Component {
  static propTypes = {
    position_we_vote_id: PropTypes.string.isRequired,
    last_updated: PropTypes.string,
    speaker_image_url_https: PropTypes.string,
    candidate_display_name: PropTypes.string.isRequired,
    speaker_display_name: PropTypes.string.isRequired
  };

  render () {
    var position = this.props;
    var dateStr = this.props.last_updated;
    var dateText = moment(dateStr).startOf("day").fromNow();
    var speaker_we_vote_id_link = "/voterguide/" + position.speaker_we_vote_id;

    return <div className="position-item">
      {/* One organization's Position on this Candidate */}
      <li className="list-group-item">
        <Link to={speaker_we_vote_id_link}>
          <div className="row">
            <div className="col-xs-3 col-md-2">
                { this.props.speaker_image_url_https ?
                 <span><img className="img-square"
                        src={this.props.speaker_image_url_https}
                        width="50px"
                  /></span> :
                <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color"></i> }
            </div>
            <div className="col-xs-9 col-md-10">
                <h4 className="">
                    { this.props.speaker_display_name }<br />
                </h4>
                <p className="">rates {this.props.candidate_display_name}
                  { position.vote_smart_rating
                      ? <span> {position.vote_smart_rating}%</span>
                      : <span></span> }
                  { position.vote_smart_time_span
                      ? <span> in {position.vote_smart_time_span}</span>
                      : <span className="small">{ dateText }</span> }
                    </p>
            </div>
          </div>
        </Link>
          <div className="row">
              {position.statement_text}
              { position.vote_smart_rating
                  ? <span className="position-source"> (source: VoteSmart.org)</span>
                  : <span></span> }
          </div>
          {/* Likes coming in a later version
          <br />
          23 Likes<br />
          */}
      </li>
      </div>;
  }
}

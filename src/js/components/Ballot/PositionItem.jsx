import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
const moment = require("moment");

export default class PositionItem extends Component {
  static propTypes = {
    position_we_vote_id: PropTypes.string.isRequired,
    last_updated: PropTypes.string
  };

  constructor (props) {
    super(props);
  }

  render () {
    var position = this.props;

    var dateStr = this.props.last_updated;
    var dateText = moment(dateStr).startOf("day").fromNow();

    return <div className="position-item">
      {/* One organization"s Position on this Candidate */}
      <li className="list-group-item">
          <div className="row">
            <div className="col-xs-3 col-md-2">
                <Link to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}} className="transparent">
                    { this.props.speaker_image_url_https
                    ? <span><img className="img-square"
                            src={this.props.speaker_image_url_https}
                            width="50px"
                      /></span>
                    : <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color"></i> }
                </Link>
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
                    : <span className="small">{ dateText }</span>
                  }
                </p>
            </div>
          </div>
          <div className="row">
              {position.statement_text}
              <span className="position-source"> (source: VoteSmart.org)</span>
          </div>
          {/* Likes coming in a later version
          <br />
          23 Likes<br />
          */}
      </li>
      </div>;
  }
}

import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import PositionStore from "../../stores/PositionStore";
const moment = require('moment');

export default class PositionItem extends Component {
  static propTypes = {
    position_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { position: {} };
  }

  componentDidMount () {
    this.changeListener = this._onChange.bind(this);
    PositionStore.retrievePositionByWeVoteId(this.props.position_we_vote_id);
    PositionStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount () {
    PositionStore.removeChangeListener(this.changeListener);
  }

  _onChange () {
    var position = PositionStore.getLocalPositionByWeVoteId(this.props.position_we_vote_id);
    this.setState({ position: position });
    console.log(this.state.position);
  }

  render () {
    var position = this.state.position;
    if (position.hasOwnProperty('is_oppose') && position.hasOwnProperty('is_support') && position.is_oppose === position.is_support){
      console.log("Both positions true:", this.props.position_we_vote_id)
      var supportText = "Unknown";
    }
    else if (position.is_oppose){
      var supportText = "Opposes";
    } else if (position.is_support){
      var supportText = "Supports";
    }

    var dateStr = this.props.last_updated;
    var dateText = moment(dateStr).startOf('day').fromNow();

    return <div>
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
                <p className="">{supportText} {this.props.candidate_display_name} <span className="small">{ dateText }</span></p>
            </div>
          </div>
          <div className="row">
              {position.statement_text}
          </div>
          {/* Likes coming in a later version
          <br />
          23 Likes<br />
          */}
      </li>
      </div>;
  }
}

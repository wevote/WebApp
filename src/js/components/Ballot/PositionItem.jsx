import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import PositionStore from "../../stores/PositionStore";
import Formatter from "../../utils/formatter";

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
    this.setState({ position: PositionStore.getLocalPositionByWeVoteId(this.props.position_we_vote_id) });
  }

  render () {
    var position = this.state.position;
    var supportText = position.is_oppose ? "Opposes" : "Supports";
    var dateText = Formatter.formatDate(this.props.last_updated);

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
                <p className="">{supportText} <span className="small">{ dateText }</span></p>
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

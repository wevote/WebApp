import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import PositionActions from '../../actions/PositionActions';
import PositionStore from '../../stores/PositionStore';

export default class PositionItem extends Component {
  static propTypes = {
    position_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { position: {}, organization: {} };
  }

  componentDidMount () {
    PositionStore.retrievePositionByWeVoteId(this.props.position_we_vote_id);
    PositionStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    PositionStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    this.setState({ position: PositionStore.getLocalPositionByWeVoteId(this.props.position_we_vote_id) });
    console.log("Position:")
    console.log(this.state.position);
  }

  render () {
    var position = this.state.position;
    var supportText = position.is_oppose ? "Opposes" : "Supports";
    return (
        <div>
        {/* One organization's Position on this Candidate */}
        <li className="list-group-item">
            <div className="row">
              <div className="col-xs-3 col-md-2">
                  <Link to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}} className="transparent">
                    <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color"></i>
                  </Link>
              </div>
              <div className="col-xs-9 col-md-10">
                  <h4 className="">
                      <Link className="" to="ballot_candidate_one_org_position" params={{id: position.speaker_id, org_id: position.speaker_we_vote_id}}>
                            { this.props.speaker_label }<br />{/* TODO icon-org-placeholder */}
                      </Link>
                  </h4>
                  <p className="">supports <span className="small">Yesterday at 7:18 PM</span></p>
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
        </div>
    );
  }
}

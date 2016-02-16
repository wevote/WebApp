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
    this.state = { position: {} };
  }

  componentDidMount () {
    console.log("Position Item Component Mounted with wevoteid:")
    console.log(this.props.position_we_vote_id);
    PositionStore.retrievePositionByWeVoteId(this.props.position_we_vote_id);
    PositionStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    PositionStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    this.setState({ position: PositionStore.getLocalPositionByWeVoteId(this.props.position_we_vote_id) });
    console.log("This Position Item:")
    console.log(this.state.position);
  }

  render() {
    // console.log(this.state.position);
    var position = this.state.position;
    var supportText = position.is_oppose ? "Opposes" : "Supports";
    return (
        <div>
        <li className="list-group-item">
                <div className="row">
                  <div className="pull-left col-xs-2 col-md-4">
                      <Link to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}}>
                        <i className={"icon-icon-org-placeholder-6-2 icon-light"}></i>
                      </Link>
                  </div>
                  <div className="pull-right col-xs-10  col-md-8">
                      <h4 className="">
                          <Link className="" to="ballot_candidate_one_org_position"
                          params={{id: position.speaker_id, org_id: position.speaker_we_vote_id}}>
                            { position.speaker_label }
                          </Link>
                      </h4>
                      <p className="">{supportText} <span className="small">Yesterday at 7:18 PM</span></p>
                  </div>
                </div>
                <div className="row">
                    {position.statement_text}
                </div>
                <br />
                23 Likes<br />
            </li>
        </div>
    );
  }
}

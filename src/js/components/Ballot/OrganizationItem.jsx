import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';

export default class OrganizationItem extends Component {
  static propTypes = {
    position_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { organization: this.props};
  }

  componentDidMount () {
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    // this.setState({ organization: BallotStore.getOrganization(this.props.candidate_we_vote_id, this.props.item.position_we_vote_id) });
  }

  render() {
    var organization = this.state.organization;
    var supportText = organization.is_oppose ? "Opposes" : "Supports";
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
                          params={{id: organization.speaker_id, org_id: organization.speaker_we_vote_id}}>
                            { organization.speaker_label }
                          </Link>
                      </h4>
                      <p className="">{supportText} <span className="small">Yesterday at 7:18 PM</span></p>
                  </div>
                </div>
                <div className="row">
                    Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
                    Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
                </div>
                <br />
                23 Likes<br />
            </li>
        </div>
    );
  }
}

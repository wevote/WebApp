import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import GuideStore from "../../stores/GuideStore";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterStore from "../../stores/VoterStore";

export default class FollowToggle extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    hide_stop_following_button: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {
        we_vote_id: ""
      }
    };
  }

  componentDidMount (){
    // We need the guideStoreListener until we take the follow functions out of OrganizationActions and GuideStore
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this._onOrganizationStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this._onVoterStoreChange();
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onGuideStoreChange (){
    // console.log("FollowToggle, _onGuideStoreChange, organization_we_vote_id: ", this.props.we_vote_id);
    this.setState({ is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.we_vote_id)});
  }

  _onOrganizationStoreChange (){
    // console.log("FollowToggle, _onOrganizationStoreChange, organization_we_vote_id: ", this.props.we_vote_id);
    this.setState({ is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.we_vote_id)});
  }

  _onVoterStoreChange (){
    this.setState({ voter: VoterStore.getVoter()});
  }

  toggleFollow () {
    this.state.is_following = !this.state.is_following;
  }

  render () {
    if (!this.state) { return <div />; }
    let we_vote_id = this.props.we_vote_id;
    let is_following = this.state.is_following;
    let is_looking_at_self = this.state.voter.linked_organization_we_vote_id === we_vote_id;
    // You should not be able to follow yourself
    if (is_looking_at_self) { return <div />; }


    const followFunc = OrganizationActions.organizationFollow.bind(this, we_vote_id);
    const stopFollowingFunc = OrganizationActions.organizationStopFollowing.bind(this, we_vote_id);

    var stopFollowingInstantly = function () {
      is_following = false;
      stopFollowingFunc();
    };

    var followInstantly = function () {
      is_following = true;
      followFunc();
    };

    return is_following ?
        <span>
      { this.props.hide_stop_following_button ?
        null :
        <Button bsStyle="warning"
                bsSize="small"
                className="pull-right"
                onClick={stopFollowingInstantly}>
                <span>Unfollow</span>
        </Button> }
        </span> :
        <Button bsStyle="info" bsSize="small" className="pull-right" onClick={followInstantly}><span>Follow</span></Button>;
  }
}

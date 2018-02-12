import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import VoterGuideStore from "../../stores/VoterGuideStore";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import VoterStore from "../../stores/VoterStore";


export default class FollowToggle extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    hide_stop_following_button: PropTypes.bool,
    classNameOverride: PropTypes.string,
    organization_for_display: PropTypes.object,
    opposesThisBallotItem: PropTypes.bool,
    supportsThisBallotItem: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {
        we_vote_id: "",
      }
    };
  }

  componentDidMount () {
    // console.log("componentDidMount, this.props: ", this.props);
    this._onOrganizationStoreChange();
    this._onVoterStoreChange();
    this.onVoterGuideStoreChange();
    // We need the voterGuideStoreListener until we take the follow functions out of OrganizationActions and VoterGuideStore
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    // console.log("componentWillUnmount, this.props.we_vote_id: ", this.props.we_vote_id);
    this.voterGuideStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // console.log("FollowToggle, onVoterGuideStoreChange, organization_we_vote_id: ", this.props.we_vote_id);
    this.setState({ is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.we_vote_id) });
  }

  _onOrganizationStoreChange () {
    // console.log("FollowToggle, _onOrganizationStoreChange, organization_we_vote_id: ", this.props.we_vote_id);
    this.setState({ is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.we_vote_id) });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  toggleFollow () {
    this.state.is_following = !this.state.is_following;
  }

  render () {
    if (!this.state) { return <div />; }

    let { we_vote_id, organization_for_display } = this.props;
    let classNameOverride = this.props.classNameOverride || "";
    let { is_following } = this.state;

    let is_looking_at_self = this.state.voter.linked_organization_we_vote_id === we_vote_id;
    // You should not be able to follow yourself
    if (is_looking_at_self) { return <div />; }

    const followFunc = OrganizationActions.organizationFollow.bind(this, we_vote_id);
    const stopFollowingFunc = OrganizationActions.organizationStopFollowing.bind(this, we_vote_id);

    const stopFollowingInstantly = () => {
      is_following = false;
      stopFollowingFunc();
      showToastError("No longer following!");
    };
    const followInstantly = () => {
      is_following = true;
      followFunc();
      showToastSuccess("Now following!");
    };

    if (organization_for_display) {
      return <span onClick={followInstantly}>
        <OrganizationTinyDisplay {...organization_for_display}
                                 showPlaceholderImage
                                 toFollow
                                 showSupport={this.props.supportsThisBallotItem}
                                 showOppose={this.props.opposesThisBallotItem} />
      </span>;
    }

    return is_following ?
      <span className="hidden-print">
        { this.props.hide_stop_following_button ?
          null :
          <Button bsStyle="warning"
                  bsSize="small"
                  className={classNameOverride.length ? classNameOverride : "pull-right"}
                  onClick={stopFollowingInstantly}>
            <span>Listening</span>
          </Button>
        }
      </span> :
      <span className="hidden-print">
        <Button bsStyle="success"
                bsSize="small"
                className={classNameOverride.length ? classNameOverride : "pull-right"}
                onClick={followInstantly}>
          <span>Listen</span>
        </Button>
      </span>;
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsAccount from "../Settings/SettingsAccount";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideBallot from "./VoterGuideBallot";
import VoterGuideFollowers from "./VoterGuideFollowers";
import VoterGuideFollowing from "./VoterGuideFollowing";
import VoterGuidePositions from "./VoterGuidePositions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { arrayContains } from "../../utils/textFormat";

export default class OrganizationVoterGuideTabs extends Component {
  static propTypes = {
    active_route: PropTypes.string,
    organization: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeRoute: "",
      currentOrganizationWeVoteId: "",
      organization: {},
      voter: {},
      voterGuideFollowedList: [],
      voterGuideFollowersList: [],
    };

    this.voterGuideBallotReference = {};
  }

  componentDidMount () {
    // console.log("OrganizationVoterGuideTabs, componentDidMount, organization: ", this.props.organization);
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.organization.organization_we_vote_id);
    VoterGuideActions.voterGuideFollowersRetrieve(this.props.organization.organization_we_vote_id);
    VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(this.props.organization.organization_we_vote_id, VoterStore.electionId());
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, false, true);

    // console.log("OrganizationVoterGuideTabs, componentDidMount, this.props.active_route: ", this.props.active_route);
    this.setState({
      activeRoute: this.props.active_route || "ballot",
      currentOrganizationWeVoteId: this.props.organization.organization_we_vote_id,
      organization: this.props.organization,
      pathname: this.props.location.pathname,
      voter: VoterStore.getVoter(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("OrganizationVoterGuideTabs, componentWillReceiveProps, nextProps: ", nextProps);
    // When a new organization is passed in, update this component to show the new data
    // let different_election = this.state.current_google_civic_election_id !== VoterStore.electionId();
    const differentOrganization = this.state.currentOrganizationWeVoteId !== nextProps.organization.organization_we_vote_id;
    if (differentOrganization) {
      OrganizationActions.organizationsFollowedRetrieve();
      VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(nextProps.organization.organization_we_vote_id);
      VoterGuideActions.voterGuideFollowersRetrieve(nextProps.organization.organization_we_vote_id);
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(nextProps.organization.organization_we_vote_id, VoterStore.electionId());
      // DALE 2017-12-24 Causes too much churn when here
      // Positions for this organization, for this voter / election
      OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, true);
      // Positions for this organization, NOT including for this voter / election
      OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, false, true);
      this.setState({
        currentOrganizationWeVoteId: nextProps.organization.organization_we_vote_id,
        organization: nextProps.organization,
      });
    }
    // console.log("OrganizationVoterGuideTabs, componentWillReceiveProps, nextProps.active_route: ", nextProps.active_route);
    if (nextProps.active_route) {
      const { activeRoute } = this.state;
      this.setState({
        activeRoute: nextProps.active_route || activeRoute,
      });
    }
    this.setState({
      pathname: nextProps.location.pathname,
    });
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // console.log("OrganizationVoterGuideTabs, onVoterGuideStoreChange, organization: ", this.state.organization);
    const { organization_we_vote_id: organizationWeVoteId } = this.state.organization;
    this.setState({
      voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(organizationWeVoteId),
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(organizationWeVoteId),
    });
  }

  _onOrganizationStoreChange () {
    // console.log("VoterGuidePositions _onOrganizationStoreChange, org_we_vote_id: ", this.state.organization.organization_we_vote_id);
    const { organization_we_vote_id: organizationWeVoteId } = this.state.organization;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  switchTab (destinationTab) {
    const availableTabsArray = ["ballot", "following", "followers", "positions"];
    if (arrayContains(destinationTab, availableTabsArray)) {
      this.setState({
        activeRoute: destinationTab,
      });
      // This is an expensive action as it reloads quite a bit of data from the API server
      const currentUrl = this.state.pathname;
      const arrayLength = availableTabsArray.length;
      let modifiedUrl = this.state.pathname;
      let formerTabLength = 0;
      let formerTabLengthWithSlash = 0;
      for (let i = 0; i < arrayLength; i++) {
        // Remove any values in availableTabsArray from the end of the URL
        if (currentUrl.endsWith(availableTabsArray[i])) {
          formerTabLength = availableTabsArray[i].length;
          formerTabLengthWithSlash = formerTabLength + 1;
          modifiedUrl = currentUrl.slice(0, -formerTabLengthWithSlash);
          // break;
        }
      }
      modifiedUrl = `${modifiedUrl}/${destinationTab}`;
      historyPush(modifiedUrl);
    }
  }

  render () {
    if (!this.state.pathname || !this.state.activeRoute || !this.state.organization || !this.state.voter) {
      return <div>{LoadingWheel}</div>;
    }

    let lookingAtSelf = false;
    if (this.state.voter) {
      lookingAtSelf = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }
    let positionsTitle = "";
    let followingTitleLong = "";
    let followingTitleShort = "";
    let followersTitle = "";
    let voterGuideFollowersList = this.state.voterGuideFollowersList || [];
    if (this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id) {
      // If looking at your own voter guide, filter out your own entry as a follower
      voterGuideFollowersList = voterGuideFollowersList.filter(oneVoterGuide => (oneVoterGuide.organization_we_vote_id !== this.state.voter.linked_organization_we_vote_id ? oneVoterGuide : null));
    }
    if (lookingAtSelf) {
      positionsTitle = "Your Positions";
      followingTitleLong = this.state.voterGuideFollowedList.length === 0 ?
        "You Are Listening To" : `You Are Listening To ${this.state.voterGuideFollowedList.length}`;
      followingTitleShort = "Listening To";
      followersTitle = voterGuideFollowersList.length === 0 ?
        "Listeners" : `${voterGuideFollowersList.length} Listeners`;
    } else {
      positionsTitle = "All Positions";
      followingTitleLong = this.state.voterGuideFollowedList.length === 0 ?
        "Listening To" : `Listening To ${this.state.voterGuideFollowedList.length}`;
      followingTitleShort = "Listening To";
      followersTitle = voterGuideFollowersList.length === 0 ?
        "Listeners" : `${voterGuideFollowersList.length} Listeners`;
    }

    let voterGuideComponentToDisplay = null;
    switch (this.state.activeRoute) {
      default:
      case "ballot":
        voterGuideComponentToDisplay = (
          <VoterGuideBallot
            organization={this.state.organization}
            active_route={this.state.activeRoute}
            location={this.props.location}
            params={this.props.params}
            ref={(ref) => { this.voterGuideBallotReference = ref; }}
          />
        );
        break;
      case "positions":
        voterGuideComponentToDisplay = (
          <div>
            { lookingAtSelf && !this.state.voter.is_signed_in ?
              <SettingsAccount /> :
              null }
            <VoterGuidePositions
              organization={this.state.organization}
              active_route={this.state.activeRoute}
              location={this.props.location}
              params={this.props.params}
            />
          </div>
        );
        break;
      case "following":
        voterGuideComponentToDisplay = <VoterGuideFollowing organization={this.state.organization} />;
        break;
      case "followers":
        voterGuideComponentToDisplay = <VoterGuideFollowers organization={this.state.organization} />;
        break;
    }

    return (
      <div className="">
        <div className="tabs__tabs-container-wrap">
          <div className="tabs__tabs-container d-print-none">
            <ul className="nav tabs__tabs">
              <li className="tab-item">
                <a onClick={() => this.switchTab("ballot")} className={this.state.activeRoute === "ballot" ? "tab tab-active" : "tab tab-default"}>
                  <span>Your Ballot</span>
                </a>
              </li>

              <li className="tab-item">
                <a onClick={() => this.switchTab("positions")} className={this.state.activeRoute === "positions" ? "tab tab-active" : "tab tab-default"}>
                  <span>{positionsTitle}</span>
                </a>
              </li>

              <li className="tab-item">
                <a onClick={() => this.switchTab("following")} className={this.state.activeRoute === "following" ? "tab tab-active" : "tab tab-default"}>
                  <span>
                    <span className="d-none d-sm-block">{followingTitleLong}</span>
                    <span className="d-block d-sm-none">{followingTitleShort}</span>
                  </span>
                </a>
              </li>

              <li className="tab-item">
                <a onClick={() => this.switchTab("followers")} className={this.state.activeRoute === "followers" ? "tab tab-active" : "tab tab-default"}>
                  <span>{followersTitle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        {voterGuideComponentToDisplay}
      </div>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import Icon from "react-svg-icons";
import BallotStore from "../../stores/BallotStore";
import BookmarkStore from "../../stores/BookmarkStore";
import CandidateStore from "../../stores/CandidateStore";
import cookies from "../../utils/cookies";
import { historyPush, isIPhoneX, isWebApp } from "../../utils/cordovaUtils";
import HeaderBarProfilePopUp from "./HeaderBarProfilePopUp";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import { isSpeakerTypeOrganization } from "../../utils/organization-functions";
import { renderLog } from "../../utils/logging";
import SearchAllBox from "../../components/Search/SearchAllBox";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterSessionActions from "../../actions/VoterSessionActions";
import { shortenText } from "../../utils/textFormat";

export default class HeaderBackToBar extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string,
    voter: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      profilePopUpOpen: false,
      bookmarks: [],
      candidateWeVoteId: "",
      office_we_vote_id: "",
      organization: {},
      organizationWeVoteId: "",
      voter: {},
    };
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
  }

  componentDidMount () {
    // console.log("HeaderBackToBar componentDidMount, this.props: ", this.props);
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this.onBallotStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onBallotStoreChange();

    let candidateWeVoteId;
    let officeWeVoteId;
    let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (this.props.params) {
      candidateWeVoteId = this.props.params.candidate_we_vote_id || "";
      if (candidateWeVoteId && candidateWeVoteId !== "") {
        let candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log("HeaderBackToBar, candidateWeVoteId:", candidateWeVoteId, ", candidate:", candidate);
        officeWeVoteId = candidate.contest_officeWeVoteId;
        officeName = candidate.contest_office_name;
      }

      organizationWeVoteId = this.props.params.organization_we_vote_id || "";
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== "" && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }

    // console.log("candidateWeVoteId: ", candidateWeVoteId);
    // console.log("organizationWeVoteId: ", organizationWeVoteId);

    let weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    let weVoteBrandingOffFromCookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      candidateWeVoteId: candidateWeVoteId,
      officeName: officeName,
      officeWeVoteId: officeWeVoteId,
      organization: organization,
      organizationWeVoteId: organizationWeVoteId,
      voter: this.props.voter,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("HeaderBackToBar componentWillReceiveProps, nextProps: ", nextProps);
    let candidateWeVoteId;
    let officeWeVoteId;
    let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (nextProps.params) {
      candidateWeVoteId = nextProps.params.candidate_we_vote_id || "";
      if (candidateWeVoteId && candidateWeVoteId !== "") {
        let candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log("HeaderBackToBar, candidateWeVoteId:", candidateWeVoteId, ", candidate:", candidate);
        officeWeVoteId = candidate.contest_office_we_vote_id;
        officeName = candidate.contest_office_name;
      }

      organizationWeVoteId = nextProps.params.organization_we_vote_id || "";
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== "" && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }

    // console.log("candidateWeVoteId: ", candidateWeVoteId);
    // console.log("organizationWeVoteId: ", organizationWeVoteId);

    let weVoteBrandingOffFromUrl = nextProps.location.query ? nextProps.location.query.we_vote_branding_off : 0;
    let weVoteBrandingOffFromCookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      candidateWeVoteId: candidateWeVoteId,
      officeName: officeName,
      officeWeVoteId: officeWeVoteId,
      organization: organization,
      organizationWeVoteId: organizationWeVoteId,
      voter: nextProps.voter,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onBallotStoreChange () {
    this.setState({ bookmarks: BallotStore.bookmarks });
  }

  onCandidateStoreChange () {
    // console.log("Candidate onCandidateStoreChange");

    let officeName;
    let officeWeVoteId;
    if (this.state.candidateWeVoteId && this.state.candidateWeVoteId !== "") {
      let candidate = CandidateStore.getCandidate(this.state.candidateWeVoteId);

      // console.log("HeaderBackToBar -- onCandidateStoreChange, candidateWeVoteId:", this.state.candidateWeVoteId, ", candidate:", candidate);
      officeName = candidate.contest_office_name;
      officeWeVoteId = candidate.contest_office_we_vote_id;
    }

    this.setState({
      candidate: CandidateStore.getCandidate(this.state.candidateWeVoteId),
      officeName: officeName,
      officeWeVoteId: officeWeVoteId,
    });
  }

  onOrganizationStoreChange () {
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organizationWeVoteId),
    });
  }

  toggleAccountMenu () {
    this.setState({ profilePopUpOpen: !this.state.profilePopUpOpen });
  }

  hideAccountMenu () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideAccountMenu () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  imagePlaceholder (speakerType) {
    let imagePlaceholderString = "";
    if (isSpeakerTypeOrganization(speakerType)) {
      imagePlaceholderString = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    } else {
      imagePlaceholderString = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    }

    return imagePlaceholderString;
  }

  getVoterGuideLink () {
    // Steve 2/16/18, the following messed up code -- replaced below
    // let organization_twitter_handle;
    // return organization_twitter_handle ? "/" + organization_twitter_handle : "/voterguide/" + this.state.organizationWeVoteId;
    return "/voterguide/" + this.state.organizationWeVoteId;
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== "") {
      return "/office/" + this.state.officeWeVoteId + "/btvg/" + this.state.organizationWeVoteId;
    } else {
      return "/office/" + this.state.officeWeVoteId + "/b/btdb/";
    }
  }

  toggleProfilePopUp () {
    this.setState({ profilePopUpOpen: !this.state.profilePopUpOpen });
  }

  hideProfilePopUp () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  render () {
    renderLog(__filename);
    let voterPhotoUrlMedium = this.state.voter.voter_photo_url_medium;
    let speakerType = "V";  // TODO DALE make this dynamic

    let backToLink;
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== "") {
      backToLink = this.getVoterGuideLink(); // Default to this when there is an organizationWeVoteId
    } else if (this.state.officeWeVoteId) {
      backToLink = `/ballot#${this.state.officeWeVoteId}`;
    } else if (this.props.params.measure_we_vote_id) {
      backToLink = `/ballot#${this.props.params.measure_we_vote_id}`;
    } else {
      backToLink = "/ballot"; // Default to this
    }

    if (this.props.params.back_to_variable === "bto" || this.props.params.back_to_variable === "btdo") {
      backToLink = this.getOfficeLink();
    }

    let backToOrganizationLinkText;
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== "") {
      backToOrganizationLinkText = "Back to Voter Guide";
    } else {
      backToOrganizationLinkText = "Back to Ballot";
    }

    if (this.props.params.back_to_variable === "bto" || this.props.params.back_to_variable === "btdo") {
      if (this.state.officeName) {
        backToOrganizationLinkText = "Back to " + this.state.officeName;
      } else {
        backToOrganizationLinkText = "Back";
      }
    } else if (this.state.organization && this.state.organization.organization_name) {
      backToOrganizationLinkText = "Back to " + this.state.organization.organization_name;
    }

    let backToOrganizationLinkTextMobile = shortenText(backToOrganizationLinkText, 30);

    return (
      <header className={ isWebApp() ? "page-header" : isIPhoneX() ? "page-header page-header__cordova-iphonex" : "page-header page-header__cordova" }>
        <Button className={"btn btn-sm btn-default page-header__backToButton  hidden-xs"}
                onClick={ () => historyPush(backToLink) }>
          <span className="fa fa-arrow-left"/> {backToOrganizationLinkText}
        </Button>
        <Button className={"btn btn-sm btn-default page-header__backToButton visible-xs"}
                onClick={ () => historyPush(backToLink) }>
          <span className="fa fa-arrow-left"/> {backToOrganizationLinkTextMobile}
        </Button>

        <span className="hidden-xs">
          <SearchAllBox />
        </span>

        {this.state.profilePopUpOpen &&
          <HeaderBarProfilePopUp {...this.props}
            onClick={this.toggleProfilePopUp}
            profilePopUpOpen={this.state.profilePopUpOpen}
            bookmarks={this.state.bookmarks}
            weVoteBrandingOff={this.state.we_vote_branding_off}
            toggleProfilePopUp={this.toggleProfilePopUp.bind(this)}
            hideProfilePopUp={this.hideProfilePopUp.bind(this)}
            transitionToYourVoterGuide={this.transitionToYourVoterGuide.bind(this)}
            signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp.bind(this)}
          />
        }

        {isWebApp() &&
          <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleAccountMenu}>
            {voterPhotoUrlMedium ?
              <div id="js-header-avatar" className="header-nav__avatar-container">
                <img className="header-nav__avatar"
                     src={voterPhotoUrlMedium}
                     height={34}
                     width={34}
                />
              </div> : this.imagePlaceholder(speakerType)}
          </div>
        }

      </header>
    );
  }
}

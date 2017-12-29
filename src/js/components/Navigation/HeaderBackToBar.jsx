import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BookmarkStore from "../../stores/BookmarkStore";
import CandidateStore from "../../stores/CandidateStore";
import cookies from "../../utils/cookies";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import { isSpeakerTypeOrganization } from "../../utils/organization-functions";
import SearchAllBox from "../SearchAllBox";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterSessionActions from "../../actions/VoterSessionActions";
var Icon = require("react-svg-icons");
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
      about_menu_open: false,
      accountMenuOpen: false,
      bookmarks: [],
      candidate_we_vote_id: "",
      office_we_vote_id: "",
      organization: {},
      organization_we_vote_id: "",
      voter: {},
    };
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
  }

  componentDidMount () {
    // console.log("HeaderBackToBar componentDidMount, this.props: ", this.props);
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this.onBallotStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onBallotStoreChange();

    let candidate_we_vote_id;
    let office_we_vote_id;
    let office_name;
    let organization = {};
    let organization_we_vote_id;
    if (this.props.params) {
      candidate_we_vote_id = this.props.params.candidate_we_vote_id || "";
      if (candidate_we_vote_id && candidate_we_vote_id !== "") {
        let candidate = CandidateStore.getCandidate(candidate_we_vote_id);
        // console.log("HeaderBackToBar, candidate_we_vote_id:", candidate_we_vote_id, ", candidate:", candidate);
        office_we_vote_id = candidate.contest_office_we_vote_id;
        office_name = candidate.contest_office_name;
      }
      organization_we_vote_id = this.props.params.organization_we_vote_id || "";
      organization = OrganizationStore.getOrganizationByWeVoteId(organization_we_vote_id);
      if (organization_we_vote_id && organization_we_vote_id !== "" && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organization_we_vote_id);
      }
    }
    // console.log("candidate_we_vote_id: ", candidate_we_vote_id);
    // console.log("organization_we_vote_id: ", organization_we_vote_id);

    let we_vote_branding_off_from_url = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    let we_vote_branding_off_from_cookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      candidate_we_vote_id: candidate_we_vote_id,
      office_name: office_name,
      office_we_vote_id: office_we_vote_id,
      organization: organization,
      organization_we_vote_id: organization_we_vote_id,
      voter: this.props.voter,
      we_vote_branding_off: we_vote_branding_off_from_url || we_vote_branding_off_from_cookie,
    });
  }

  componentWillReceiveProps (nextProps){
    // console.log("HeaderBackToBar componentWillReceiveProps, nextProps: ", nextProps);
    let candidate_we_vote_id;
    let office_we_vote_id;
    let office_name;
    let organization = {};
    let organization_we_vote_id;
    if (nextProps.params) {
      candidate_we_vote_id = nextProps.params.candidate_we_vote_id || "";
      if (candidate_we_vote_id && candidate_we_vote_id !== "") {
        let candidate = CandidateStore.getCandidate(candidate_we_vote_id);
        // console.log("HeaderBackToBar, candidate_we_vote_id:", candidate_we_vote_id, ", candidate:", candidate);
        office_we_vote_id = candidate.contest_office_we_vote_id;
        office_name = candidate.contest_office_name;
      }
      organization_we_vote_id = nextProps.params.organization_we_vote_id || "";
      organization = OrganizationStore.getOrganizationByWeVoteId(organization_we_vote_id);
      if (organization_we_vote_id && organization_we_vote_id !== "" && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organization_we_vote_id);
      }
    }
    // console.log("candidate_we_vote_id: ", candidate_we_vote_id);
    // console.log("organization_we_vote_id: ", organization_we_vote_id);

    let we_vote_branding_off_from_url = nextProps.location.query ? nextProps.location.query.we_vote_branding_off : 0;
    let we_vote_branding_off_from_cookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      candidate_we_vote_id: candidate_we_vote_id,
      office_name: office_name,
      office_we_vote_id: office_we_vote_id,
      organization: organization,
      organization_we_vote_id: organization_we_vote_id,
      voter: nextProps.voter,
      we_vote_branding_off: we_vote_branding_off_from_url || we_vote_branding_off_from_cookie,
    });
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onBallotStoreChange (){
    this.setState({bookmarks: BallotStore.bookmarks });
  }

  onCandidateStoreChange (){
    // console.log("Candidate onCandidateStoreChange");

    let office_name;
    let office_we_vote_id;
    if (this.state.candidate_we_vote_id && this.state.candidate_we_vote_id !== "") {
      let candidate = CandidateStore.getCandidate(this.state.candidate_we_vote_id);
      // console.log("HeaderBackToBar -- onCandidateStoreChange, candidate_we_vote_id:", this.state.candidate_we_vote_id, ", candidate:", candidate);
      office_name = candidate.contest_office_name;
      office_we_vote_id = candidate.contest_office_we_vote_id;
    }
    this.setState({
      candidate: CandidateStore.getCandidate(this.state.candidate_we_vote_id),
      office_name: office_name,
      office_we_vote_id: office_we_vote_id,
    });
  }

  onOrganizationStoreChange (){
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization_we_vote_id),
    });
  }

  accountMenu () {
    var { is_signed_in, linked_organization_we_vote_id, signed_in_facebook, signed_in_twitter, twitter_screen_name } = this.state.voter;

    let show_your_page_from_twitter = signed_in_twitter && twitter_screen_name;
    let show_your_page_from_facebook = signed_in_facebook && linked_organization_we_vote_id && !show_your_page_from_twitter;

    let accountMenuOpen = this.state.accountMenuOpen ? "account-menu--open" : "";

    return (
      <div className={accountMenuOpen}>
      <div className="page-overlay" onClick={this.hideAccountMenu} />
      <div className="account-menu">
          <ul className="nav nav-stacked">
            <li>
              <div><span className="we-vote-promise">Our Promise: We'll never sell your email.</span></div>
            </li>
          </ul>
          <h4 className="text-left" />
          <ul className="nav nav-stacked">
            { show_your_page_from_twitter ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide.bind(this)} to={"/" + twitter_screen_name}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { show_your_page_from_facebook ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide.bind(this)} to={"/voterguide/" + linked_organization_we_vote_id}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { !show_your_page_from_twitter && !show_your_page_from_facebook && is_signed_in ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide.bind(this)} to="/yourpage">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { this.state.voter && this.state.voter.is_signed_in ?
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Account</span>
                  </div>
                </Link>
              </li> :
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign In</span>
                  </div>
                </Link>
              </li> }
            { this.state.voter && this.state.voter.is_signed_in ?
              <li>
                <Link onClick={this.signOutAndHideAccountMenu.bind(this)} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign Out</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { this.state.bookmarks && this.state.bookmarks.length ?
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to="/bookmarks">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Bookmarked Items</span>
                  </div>
                </Link>
              </li> :
              null }
            { this.state.we_vote_branding_off ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/howtouse">
                  <div>
                    <span className="header-slide-out-menu-text-left">Getting Started</span>
                  </div>
                </Link>
              </li>
            }
            { this.state.we_vote_branding_off ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/about">
                  <div>
                    <span className="header-slide-out-menu-text-left">About We Vote</span>
                  </div>
                </Link>
              </li>
            }
            { this.state.we_vote_branding_off ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/donate">
                  <div>
                    <span className="header-slide-out-menu-text-left">Donate</span>
                  </div>
                </Link>
              </li>
            }
          </ul>
          <span className="terms-and-privacy">
            <br />
            <Link onClick={this.hideAccountMenu.bind(this)} to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link onClick={this.hideAccountMenu.bind(this)} to="/more/privacy">Privacy Policy</Link>
          </span>
        </div>
      </div>
    );
  }

  toggleAccountMenu () {
    this.setState({accountMenuOpen: !this.state.accountMenuOpen});
  }

  hideAccountMenu () {
    this.setState({accountMenuOpen: false});
  }

  signOutAndHideAccountMenu () {
    VoterSessionActions.voterSignOut();
    this.setState({accountMenuOpen: false});
  }

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter / election
    OrganizationActions.retrievePositions(this.state.voter.linked_organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.retrievePositions(this.state.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
    this.setState({accountMenuOpen: false});
  }

  imagePlaceholder (speaker_type) {
    let image_placeholder = "";
    if (isSpeakerTypeOrganization(speaker_type)) {
        image_placeholder = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    } else {
        image_placeholder = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    }
    return image_placeholder;
  }

  getVoterGuideLink () {
    let organization_twitter_handle;
    return organization_twitter_handle ? "/" + organization_twitter_handle : "/voterguide/" + this.state.organization_we_vote_id;
  }

  getOfficeLink () {
    if (this.state.organization_we_vote_id && this.state.organization_we_vote_id !== "") {
      return "/office/" + this.state.office_we_vote_id + "/btvg/" + this.state.organization_we_vote_id;
    } else {
      return "/office/" + this.state.office_we_vote_id + "/b/btdb/";
    }
  }

  render () {
    let { voter_photo_url_medium } = this.state.voter;
    let speaker_type = "V";  // TODO DALE make this dynamic

    let back_to_link;
    if (this.state.organization_we_vote_id && this.state.organization_we_vote_id !== "") {
      back_to_link = this.getVoterGuideLink(); // Default to this when there is an organization_we_vote_id
    } else {
      back_to_link = "/ballot"; // Default to this
    }
    if (this.props.params.back_to_variable === "bto" || this.props.params.back_to_variable === "btdo") {
      back_to_link = this.getOfficeLink();
    }

    let back_to_organization_link_text;
    if (this.state.organization_we_vote_id && this.state.organization_we_vote_id !== "") {
      back_to_organization_link_text = "Back to Voter Guide";
    } else {
      back_to_organization_link_text = "Back to Ballot";
    }
    if (this.props.params.back_to_variable === "bto" || this.props.params.back_to_variable === "btdo") {
      if (this.state.office_name) {
        back_to_organization_link_text = "Back to " + this.state.office_name;
      } else {
        back_to_organization_link_text = "Back";
      }
    } else if (this.state.organization && this.state.organization.organization_name) {
      back_to_organization_link_text = "Back to " + this.state.organization.organization_name;
    }
    let back_to_organization_link_text_mobile = shortenText(back_to_organization_link_text, 30);

    return (
      <header className="page-header">
        <Link to={back_to_link} className="page-logo page-logo-full-size h4 hidden-xs">
          &lt; {back_to_organization_link_text}
        </Link>
        <Link to={back_to_link} className="page-logo page-logo-full-size h4 visible-xs">
          &lt; {back_to_organization_link_text_mobile}
        </Link>

        <span className="hidden-xs">
          <SearchAllBox />
        </span>

        <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleAccountMenu}>
          {voter_photo_url_medium ?
            <div id="js-header-avatar" className="header-nav__avatar-container">
                <img className="header-nav__avatar"
                      src={voter_photo_url_medium}
                      height={34}
                      width={34}
                 />
            </div> : this.imagePlaceholder(speaker_type)}
         </div>
        {this.accountMenu()}
      </header>
    );
  }
}

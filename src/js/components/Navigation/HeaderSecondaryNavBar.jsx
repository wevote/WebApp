import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotIntroFollowIssues from "../../components/Ballot/BallotIntroFollowIssues";
import BallotIntroFollowAdvisers from "../../components/Ballot/BallotIntroFollowAdvisers";
import BallotIntroVerifyAddress from "../../components/Ballot/BallotIntroVerifyAddress";
import { cordovaDot, hasIPhoneNotch, isWebApp } from "../../utils/cordovaUtils";
import SecondaryNavBarItem from "./SecondaryNavBarItem";
import EmailBallotModal from "../Ballot/EmailBallotModal";
import EmailBallotToFriendsModal from "../Ballot/EmailBallotToFriendsModal";
import FacebookBallotModal from "../Ballot/FacebookBallotModal";
import FacebookBallotToFriendsModal from "../Ballot/FacebookBallotToFriendsModal";
import PollingPlaceLocatorModal from "../../routes/Ballot/PollingPlaceLocatorModal";
import Slider from "react-slick";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";
import webAppConfig from "../../config";

export default class HeaderSecondaryNavBar extends Component {

  static propTypes = {
    hideGettingStartedIssuesButton: PropTypes.bool,
    hideGettingStartedOrganizationsButton: PropTypes.bool,
    voter: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this._toggleBallotIntroFollowIssues = this._toggleBallotIntroFollowIssues.bind(this);
    this._toggleBallotIntroOrganizations = this._toggleBallotIntroOrganizations.bind(this);
    this._toggleEmailModal = this._toggleEmailModal.bind(this);
    this._toggleFacebookModal = this._toggleFacebookModal.bind(this);
    this._togglePollingLocatorModal = this._togglePollingLocatorModal.bind(this);
    this._nextSliderPage = this._nextSliderPage.bind(this);
    this.afterChangeHandler = this.afterChangeHandler.bind(this);
    this.ballotEmailWasSent = this.ballotEmailWasSent.bind(this);
    this.ballotFacebookEmailWasSent = this.ballotFacebookEmailWasSent.bind(this);
    this.state = {
      ballot_intro_issues_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ISSUES_COMPLETED),
      ballot_intro_organizations_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ORGANIZATIONS_COMPLETED),
      ballot_intro_positions_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_POSITIONS_COMPLETED),
      ballot_intro_friends_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_FRIENDS_COMPLETED),
      ballot_intro_share_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_SHARE_COMPLETED),
      ballot_intro_vote_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_VOTE_COMPLETED),
      current_page_index: 0,
      showBallotIntroFollowIssues: false,
      showBallotIntroOrganizations: false,
      showEmailModal: false,
      showFacebookModal: false,
      showPollingLocatorModal: false,
      successMessage: undefined,  //Used by EmailBallotModal and EmailBallotToFriendsModal
      sender_email_address: "",   //Used by EmailBallotModal and EmailBallotToFriendsModal
      verification_email_sent: false, //Used by EmailBallotModal and EmailBallotToFriendsModal
      sender_email_address_from_email_ballot_modal: "", //Used by FacebookBallotModal and FacebookBallotToFriendsModal
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }

    if (this.state.showBallotIntroFollowIssues === true || nextState.showBallotIntroFollowIssues === true) {
      // console.log("shouldComponentUpdate: this.state.showBallotIntroFollowIssues", this.state.showBallotIntroFollowIssues, ", nextState.showBallotIntroFollowIssues", nextState.showBallotIntroFollowIssues);
      return true;
    }

    if (this.state.showBallotIntroOrganizations === true || nextState.showBallotIntroOrganizations === true) {
      // console.log("shouldComponentUpdate: this.state.showBallotIntroOrganizations", this.state.showBallotIntroOrganizations, ", nextState.showBallotIntroOrganizations", nextState.showBallotIntroOrganizations);
      return true;
    }

    if (this.state.showEmailModal === true || nextState.showEmailModal === true) {
      // console.log("shouldComponentUpdate: this.state.showEmailModal", this.state.showEmailModal, ", nextState.showEmailModal", nextState.showEmailModal);
      return true;
    }

    if (this.state.showFacebookModal === true || nextState.showFacebookModal === true) {
      // console.log("shouldComponentUpdate: this.state.showFacebookModal", this.state.showFacebookModal, ", nextState.showFacebookModal", nextState.showFacebookModal);
      return true;
    }

    if (this.state.showPollingLocatorModal === true || nextState.showPollingLocatorModal === true) {
      // console.log("shouldComponentUpdate: this.state.showPollingLocatorModal", this.state.showPollingLocatorModal, ", nextState.showPollingLocatorModal", nextState.showPollingLocatorModal);
      return true;
    }

    return false;
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      ballot_intro_issues_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ISSUES_COMPLETED),
      ballot_intro_organizations_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ORGANIZATIONS_COMPLETED),
      ballot_intro_positions_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_POSITIONS_COMPLETED),
      ballot_intro_friends_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_FRIENDS_COMPLETED),
      ballot_intro_share_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_SHARE_COMPLETED),
      ballot_intro_vote_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_VOTE_COMPLETED),
    });
  }

  _openPrintModal () {
    window.print();
  }

  _toggleEmailModal () {
    this.setState({ showEmailModal: !this.state.showEmailModal });
  }

  _toggleFacebookModal () {
    this.setState({ showFacebookModal: !this.state.showFacebookModal });
  }

  _togglePollingLocatorModal () {
    this.setState({ showPollingLocatorModal: !this.state.showPollingLocatorModal });
  }

  _toggleBallotIntroFollowIssues () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    if (!this.state.showBallotIntroFollowIssues) {
      AnalyticsActions.saveActionModalIssues(VoterStore.election_id());
    }

    this.setState({ showBallotIntroFollowIssues: !this.state.showBallotIntroFollowIssues });
  }

  _toggleBallotIntroOrganizations () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    if (!this.state.showBallotIntroOrganizations) {
      // Save action when going from off to on
      AnalyticsActions.saveActionModalOrganizations(VoterStore.election_id());
    }

    this.setState({ showBallotIntroOrganizations: !this.state.showBallotIntroOrganizations });
  }

  _nextSliderPage () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    this.refs.slider.slickNext();
  }

  afterChangeHandler (index) {
    this.setState({
      current_page_index: index,
    });
  }

  /**
   * Method that passes data between EmailBallotModal to EmailBallotToFriendsModal
   */
  ballotEmailWasSent (successMessage, senderEmailAddress, verificationEmailSent, shouldChangeSlide = true) {
    this.setState({
      successMessage,
      senderEmailAddress,
      verificationEmailSent,
    });
    if (shouldChangeSlide) {
      this.refs.slider.slickNext();
    }
  }

  /**
   * Method that passes data between FacebookBallotModal to FacebookBallotToFriendsModal
   */
  ballotFacebookEmailWasSent (successMessage, senderEmailAddress, verificationEmailSent, shouldChangeSlide = true) {
    this.setState({
      successMessage,
      senderEmailAddress,
      verificationEmailSent,
    });
    if (shouldChangeSlide) {
      this.refs.slider.slickNext();
    }
  }

  render () {
    renderLog(__filename);
    let sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      afterChange: this.afterChangeHandler,
      arrows: false,
    };
    let sliderSettingsWithSwipe = { ...sliderSettings, swipe: true };

    let voterThoroughOrientationComplete = false;  // Have all of the 3 (this once was 6) major steps been taken?
    const BallotIntroFollowIssuesModal =
      <Modal bsPrefix="background-brand-blue modal"
             id="ballotIntroFollowIssuesId"
             show={this.state.showBallotIntroFollowIssues}
             onHide={this._toggleBallotIntroFollowIssues}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroFollowIssues} className={`intro-modal__close-anchor ${hasIPhoneNotch() ? "intro-modal__close-anchor-iphonex" : ""}`}>
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height intro-modal__height-full" ref="slider" {...sliderSettings}>
            <div className="intro-modal__height-full" key={1}><BallotIntroFollowIssues next={this._nextSliderPage}/></div>
            <div className="intro-modal__height-full" key={2}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
            <div className="intro-modal__height-full" key={3}><BallotIntroVerifyAddress next={this._toggleBallotIntroFollowIssues} manualFocus={this.state.current_page_index === 2} /></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const SendEmailModal = <Modal bsPrefix="background-brand-blue modal"
                                  show={this.state.showEmailModal}
                                  onHide={() => this._toggleEmailModal(this)}>
      <Modal.Body>
       <div className="intro-modal__close">
         <a onClick={this._toggleEmailModal}
            className={`intro-modal__close-anchor ${hasIPhoneNotch() ? "intro-modal__close-anchor-iphonex" : ""}`}>
           <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
         </a>
       </div>
        <Slider dotsClass="slick-dots intro-modal__gray-dots" ref="slider" {...sliderSettingsWithSwipe}>
          <div key={1} className="share-modal__calc-height">
            <EmailBallotModal ballot_link={this.props.pathname}
                              next={this._nextSliderPage}
                              ballotEmailWasSent={this.ballotEmailWasSent} />
          </div>
          <div key={2} className="share-modal__calc-height">
            <EmailBallotToFriendsModal ballot_link={this.props.pathname}
                                       ballotEmailWasSent={this.ballotEmailWasSent}
                                       sender_email_address_from_email_ballot_modal={this.state.senderEmailAddress}
                                       success_message={this.state.successMessage}
                                       verification_email_sent={this.state.verificationEmailSent}
                                      />
          </div>
        </Slider>
      </Modal.Body>
    </Modal>;

    const SendFacebookModal = <Modal bsPrefix="background-brand-blue modal"
                                  show={this.state.showFacebookModal}
                                  onHide={() => this._toggleFacebookModal(this)}>
      <Modal.Body>
        <div className="intro-modal__close">
          <a onClick={this._toggleFacebookModal}
             className={`intro-modal__close-anchor ${hasIPhoneNotch() ? "intro-modal__close-anchor-iphonex" : ""}`}>
            <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
          </a>
        </div>
        <Slider dotsClass="slick-dots intro-modal__gray-dots" ref="slider" {...sliderSettingsWithSwipe}>
          <div key={1} className="share-modal__calc-height">
            <FacebookBallotModal ballot_link={this.props.pathname}
                                 next={this._nextSliderPage}
                                 ballotFacebookEmailWasSent={this.ballotFacebookEmailWasSent}/>
          </div>
          <div key={2} className="share-modal__calc-height">
            <FacebookBallotToFriendsModal ballot_link={this.props.pathname}
                                          ballotFacebookEmailWasSent={this.ballotFacebookEmailWasSent}
                                          sender_email_address_from_email_ballot_modal={this.state.senderEmailAddress}
                                          success_message={this.state.successMessage}
                                          verification_email_sent={this.state.verificationEmailSent} />

          </div>
        </Slider>
      </Modal.Body>
    </Modal>;

    // October, 2018 - Bootstrap4: See https://react-bootstrap.netlify.com/components/modal
    const ShowPollingLocatorModal = <PollingPlaceLocatorModal show={this.state.showPollingLocatorModal}
                                                              onExit={this._togglePollingLocatorModal}/>;

    let currentPathname = this.props.pathname ? this.props.pathname : "/ballot";
    let ballotBaseUrl = webAppConfig.WE_VOTE_URL_PROTOCOL + (isWebApp() ? webAppConfig.WE_VOTE_HOSTNAME : "WeVote.US") + currentPathname;

    // We want to add a tracking code here so we can count shares. Vote.org does it this way: https://www.vote.org/#.WpiRvFhU3V4.twitter
    let encodedMessage = encodeURIComponent("I am getting ready to vote @WeVote. Join me!");
    let twitterIntent = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(ballotBaseUrl) + "&text=" + encodedMessage + "&hashtags=Vote,Voting,WeVote";
    let searchStyle = isWebApp() ? "page-secondary-nav-header" : "page-secondary-nav-header page-header-cordova-secondary-nav";

    return <div className="page-secondary-nav-header-background">
      { voterThoroughOrientationComplete ?
        null :
        <header className={searchStyle}>
          <div className={`header-secondary-nav ${hasIPhoneNotch() ? "header-secondary-nav__iphone-x-vertical-spacing" : ""}`}>
            {/* Issues Icon & Modal */}
            {/* {!this.props.hideGettingStartedIssuesButton ? null : null } No longer hiding Issue Button */}
            {/* completed={this.state.ballot_intro_issues_completed} No longer using completed state */}
            <SecondaryNavBarItem show={this._toggleBallotIntroFollowIssues}
                                 source={cordovaDot("/img/global/svg-icons/nav/issues-16.svg")}
                                 title="Issues" />

            <SecondaryNavBarItem show={this._openPrintModal}
                                 source={cordovaDot("/img/global/svg-icons/nav/print-16.svg")}
                                 title="Print"
                                 iconPrint/>

            <SecondaryNavBarItem show={this._toggleEmailModal}
                                 source={cordovaDot("/img/global/svg-icons/nav/email-16.svg")}
                                 title="Email Ballot"/>

            {/* July 10, 2018 Steve:  Disable Share Ballot via Facebook, in Cordova, until it is fixed for the Webapp */}
            {isWebApp() &&
              <SecondaryNavBarItem show={this._toggleFacebookModal}
                                   title="Share Ballot"
                                   iconFacebook/>
            }

            <span className="d-block d-sm-none">
              <SecondaryNavBarItem url={twitterIntent}
                                   title="Tweet"
                                   iconTwitter
                                   isExternal/>
            </span>
            <span className="d-none d-sm-block">
              <SecondaryNavBarItem url={twitterIntent}
                                   title="Tweet Ballot"
                                   iconTwitter
                                   isExternal/>
            </span>
            <div>
              <SecondaryNavBarItem show={this._togglePollingLocatorModal}
                                   source={cordovaDot("/img/global/svg-icons/nav/location-16.svg")}
                                   titleDesktop="Polling Location"
                                   titleMobile="Vote"/>
            </div>
          </div>
        </header>
      }
      { this.state.showBallotIntroFollowIssues ? BallotIntroFollowIssuesModal : null }
      { this.state.showEmailModal ? SendEmailModal : null }
      { this.state.showFacebookModal ? SendFacebookModal : null }
      { this.state.showPollingLocatorModal ? ShowPollingLocatorModal : null }
    </div>;
  }
}

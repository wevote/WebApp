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
    this._openEmailModal = this._openEmailModal.bind(this);
    this._openFacebookModal = this._openFacebookModal.bind(this);
    this._openPollingLocatorModal = this._openPollingLocatorModal.bind(this);
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

  _openEmailModal () {
    this.setState({ showEmailModal: !this.state.showEmailModal });
  }

  _openFacebookModal () {
    this.setState({ showFacebookModal: !this.state.showFacebookModal });
  }

  _openPollingLocatorModal () {
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

    // Have all of the 6 major steps been taken?
    let voterThoroughOrientationComplete = false;
    const BallotIntroFollowIssuesModal = <Modal bsClass="background-brand-blue modal"
                                                id="ballotIntroFollowIssuesId"
                                                show={this.state.showBallotIntroFollowIssues}
                                                onHide={() => this._toggleBallotIntroFollowIssues(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroFollowIssues}
               className={`intro-modal__close-anchor ${hasIPhoneNotch() ? "intro-modal__close-anchor-iphonex" : ""}`}>
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...sliderSettings}>
            <div key={1}><BallotIntroFollowIssues next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
            <div key={3}><BallotIntroVerifyAddress next={this._toggleBallotIntroFollowIssues} manualFocus={this.state.current_page_index === 2} /></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const SendEmailModal = <Modal bsClass="background-brand-blue modal"
                                  show={this.state.showEmailModal}
                                  onHide={() => this._openEmailModal(this)}>
      <Modal.Body>
       <div className="intro-modal__close">
         <a onClick={this._openEmailModal}
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

    const SendFacebookModal = <Modal bsClass="background-brand-blue modal"
                                  show={this.state.showFacebookModal}
                                  onHide={() => this._openFacebookModal(this)}>
      <Modal.Body>
        <div className="intro-modal__close">
          <a onClick={this._openFacebookModal}
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
          <div className="header-secondary-nav">
            {/* Issues Icon & Modal */}
            {/* {!this.props.hideGettingStartedIssuesButton ? null : null } No longer hiding Issue Button */}
            {/* completed={this.state.ballot_intro_issues_completed} No longer using completed state */}
            <SecondaryNavBarItem show={this._toggleBallotIntroFollowIssues}
                                 source={cordovaDot("/img/global/svg-icons/issues-v1-64x42.svg")}
                                 title="Issues" />

            <SecondaryNavBarItem show={this._openPrintModal}
                                 title="Print"
                                 iconPrint/>

            <SecondaryNavBarItem show={this._openEmailModal}
                                 title="Email Ballot"
                                 iconEmail/>

            {/* July 10, 2018 Steve:  Disable Share Ballot via Facebook, in Cordova, until it is fixed for the Webapp */}
            {isWebApp() &&
              <SecondaryNavBarItem show={this._openFacebookModal}
                                   title="Share Ballot"
                                   iconFacebook/>
            }

            <span className="visible-xs">
              <SecondaryNavBarItem url={twitterIntent}
                                   title="Tweet"
                                   iconTwitter
                                   isExternal/>
            </span>
            <span className="hidden-xs">
              <SecondaryNavBarItem url={twitterIntent}
                                   title="Tweet Ballot"
                                   iconTwitter
                                   isExternal/>
            </span>
            <div>
              <SecondaryNavBarItem show={this._openPollingLocatorModal}
                                   titleDesktop="Polling Location"
                                   titleMobile="Vote"
                                   iconMapMarker/>
            </div>
          </div>
        </header>
      }
      { BallotIntroFollowIssuesModal }
      {/* this.state.showBallotIntroOrganizations ? BallotIntroOrganizationsModal : null */}
      { this.state.showEmailModal ? SendEmailModal : null }
      { this.state.showFacebookModal ? SendFacebookModal : null }
      { this.state.showPollingLocatorModal &&
        <PollingPlaceLocatorModal show={this.state.showPollingLocatorModal}
                                  onHide={() => this._openPollingLocatorModal(this)}/>
      }
    </div>;
  }
}

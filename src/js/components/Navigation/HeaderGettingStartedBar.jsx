import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotIntroFollowIssues from "../../components/Ballot/BallotIntroFollowIssues";
import BallotIntroFollowAdvisers from "../../components/Ballot/BallotIntroFollowAdvisers";
import BallotIntroFriends from "../../components/Ballot/BallotIntroFriends";
import BallotIntroPositions from "../../components/Ballot/BallotIntroPositions";
import BallotIntroIssuesSuccess from "../../components/Ballot/BallotIntroIssuesSuccess";
import BallotIntroShare from "../../components/Ballot/BallotIntroShare";
import BallotIntroVote from "../../components/Ballot/BallotIntroVote";
import { cordovaDot, isWebApp } from "../../utils/cordovaUtils";
import GettingStartedBarItem from "./GettingStartedBarItem";
import EmailBallotModal from "../Ballot/EmailBallotModal";
import EmailBallotToFriendsModal from "../Ballot/EmailBallotToFriendsModal";
import FacebookBallotModal from "../Ballot/FacebookBallotModal";
import FacebookBallotToFriendsModal from "../Ballot/FacebookBallotToFriendsModal";
import PollingPlaceLocatorModal from "../../routes/Ballot/PollingPlaceLocatorModal";
import Slider from "react-slick";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";
const webAppConfig = require("../../config");

export default class HeaderGettingStartedBar extends Component {
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
    this._toggleBallotIntroPositions = this._toggleBallotIntroPositions.bind(this);
    this._toggleBallotIntroFriends = this._toggleBallotIntroFriends.bind(this);
    this._toggleBallotIntroShare = this._toggleBallotIntroShare.bind(this);
    this._toggleBallotIntroVote = this._toggleBallotIntroVote.bind(this);
    this._openEmailModal = this._openEmailModal.bind(this);
    this._openFacebookModal = this._openFacebookModal.bind(this);
    this._openPollingLocatorModal = this._openPollingLocatorModal.bind(this);
    this._nextSliderPage = this._nextSliderPage.bind(this);
    this.state = {
      ballot_intro_issues_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ISSUES_COMPLETED),
      ballot_intro_organizations_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ORGANIZATIONS_COMPLETED),
      ballot_intro_positions_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_POSITIONS_COMPLETED),
      ballot_intro_friends_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_FRIENDS_COMPLETED),
      ballot_intro_share_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_SHARE_COMPLETED),
      ballot_intro_vote_completed: VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_VOTE_COMPLETED),
      showBallotIntroFollowIssues: false,
      showBallotIntroOrganizations: false,
      showBallotIntroPositions: false,
      showBallotIntroFriends: false,
      showBallotIntroShare: false,
      showBallotIntroVote: false,
      showEmailModal: false,
      showFacebookModal: false,
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
      // Save action when going from off to on
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

  _toggleBallotIntroPositions () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    if (!this.state.showBallotIntroPositions) {
      // Save action when going from off to on
      AnalyticsActions.saveActionModalPositions(VoterStore.election_id());
    }

    this.setState({ showBallotIntroPositions: !this.state.showBallotIntroPositions });
  }

  _toggleBallotIntroFriends () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    if (!this.state.showBallotIntroFriends) {
      // Save action when going from off to on
      AnalyticsActions.saveActionModalFriends(VoterStore.election_id());
    }

    this.setState({ showBallotIntroFriends: !this.state.showBallotIntroFriends });
  }

  _toggleBallotIntroShare () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    if (!this.state.showBallotIntroShare) {
      // Save action when going from off to on
      AnalyticsActions.saveActionModalShare(VoterStore.election_id());
    }

    this.setState({ showBallotIntroShare: !this.state.showBallotIntroShare });
  }

  _toggleBallotIntroVote () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    if (!this.state.showBallotIntroVote) {
      // Save action when going from off to on
      AnalyticsActions.saveActionModalVote(VoterStore.election_id());
    }

    this.setState({ showBallotIntroVote: !this.state.showBallotIntroVote });
  }

  _nextSliderPage () {
    VoterActions.voterUpdateRefresh(); // Grab the latest voter information which includes interface_status_flags
    this.refs.slider.slickNext();
  }

  render () {
    let sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      arrows: false,
    };

    // Have all of the 6 major steps been taken?
    let voterThoroughOrientationComplete = false;
    const BallotIntroFollowIssuesModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroFollowIssues}
                                    onHide={() => this._toggleBallotIntroFollowIssues(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroFollowIssues} className="intro-modal__close-anchor">
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...sliderSettings}>
            <div key={1}><BallotIntroFollowIssues next={this._nextSliderPage}/></div>
            {/* <div key={2}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div> */}
            <div key={3}><BallotIntroIssuesSuccess next={this._toggleBallotIntroFollowIssues}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    // Consider using /components/Ballot/BallotIntroOrganizations instead of BallotIntroFollowAdvisers
    const BallotIntroOrganizationsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroOrganizations}
                                    onHide={() => this._toggleBallotIntroOrganizations(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroOrganizations} className="intro-modal__close-anchor">
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...sliderSettings}>
            <div key={1}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroIssuesSuccess next={this._toggleBallotIntroOrganizations}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroPositionsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroPositions}
                                    onHide={() => this._toggleBallotIntroPositions(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroPositions} className="intro-modal__close-anchor">
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...sliderSettings}>
            <div key={1}><BallotIntroPositions next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroIssuesSuccess next={this._toggleBallotIntroPositions}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroFriendsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroFriends}
                                    onHide={() => this._toggleBallotIntroFriends(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroFriends} className="intro-modal__close-anchor">
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...sliderSettings}>
            <div key={1}><BallotIntroFriends next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroIssuesSuccess next={this._toggleBallotIntroFriends}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroShareModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroShare}
                                    onHide={() => this._toggleBallotIntroShare(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroShare} className="intro-modal__close-anchor">
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...sliderSettings}>
            <div key={1}><BallotIntroShare next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroIssuesSuccess next={this._toggleBallotIntroShare}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroVoteModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroVote}
                                    onHide={() => this._toggleBallotIntroVote(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroVote} className="intro-modal__close-anchor">
              <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...sliderSettings}>
            <div key={1}><BallotIntroVote next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroIssuesSuccess next={this._toggleBallotIntroVote}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

      const SendEmailModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showEmailModal}
                                    onHide={() => this._openEmailModal(this)}>
        <Modal.Body>
         <div className="intro-modal__close">
           <a onClick={this._openEmailModal} className="intro-modal__close-anchor">
             <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
           </a>
         </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" ref="slider" {...sliderSettings}>
            <div key={1} className="share-modal-calc-height"><EmailBallotModal next={this._nextSliderPage} ballot_link={this.props.pathname}/></div>
            <div key={2} className="share-modal-calc-height"><EmailBallotToFriendsModal ballot_link={this.props.pathname}/></div>
          </Slider>
        </Modal.Body>
    </Modal>;

    const SendFacebookModal = <Modal bsClass="background-brand-blue modal"
                                  show={this.state.showFacebookModal}
                                  onHide={() => this._openFacebookModal(this)}>
      <Modal.Body>
        <div className="intro-modal__close">
          <a onClick={this._openFacebookModal} className="intro-modal__close-anchor">
            <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close" />
          </a>
        </div>
        <Slider dotsClass="slick-dots intro-modal__gray-dots" ref="slider" {...sliderSettings}>
          <div key={1} className="share-modal-calc-height"><FacebookBallotModal next={this._nextSliderPage} ballot_link={this.props.pathname}/></div>
          <div key={2} className="share-modal-calc-height"><FacebookBallotToFriendsModal ballot_link={this.props.pathname}/></div>
        </Slider>
      </Modal.Body>
    </Modal>;

    let currentPathname = this.props.pathname ? this.props.pathname : "/ballot";
    let ballotBaseUrl = webAppConfig.WE_VOTE_URL_PROTOCOL + (isWebApp() ? webAppConfig.WE_VOTE_HOSTNAME : "WeVote.US") + currentPathname;

    // We want to add a tracking code here so we can count shares. Vote.org does it this way: https://www.vote.org/#.WpiRvFhU3V4.twitter
    let encodedMessage = encodeURIComponent("I am reviewing my ballot, and getting ready to vote @WeVote.");
    let twitterIntent = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(ballotBaseUrl) + "&text=" + encodedMessage + "&hashtags=Vote,Voting,WeVote";
    let searchStyle = isWebApp() ? "page-getting-started-header" : "page-getting-started-header page-header-cordova-getting-started";

    return <div className="page-getting-started-header-background">
      { voterThoroughOrientationComplete ?
        null :
        <header className={searchStyle}>
          <div className="header-getting-started-nav">
            {/* Issues Icon & Modal */}
            {!this.props.hideGettingStartedIssuesButton ?
              <GettingStartedBarItem show={this._toggleBallotIntroFollowIssues}
                                     source={cordovaDot("/img/global/svg-icons/issues-v1-64x42.svg")}
                                     title="Issues"
                                     completed={this.state.ballot_intro_issues_completed} /> :
              null }
            <GettingStartedBarItem show={this._openPrintModal}
                                   title="Print"
                                   printIcon/>
            <GettingStartedBarItem show={this._openEmailModal}
                                   title="Email"
                                   emailIcon/>
            {/* February 2018, Facebook and Magic Email disabled for Cordova */}
            { isWebApp() && <div>
            <GettingStartedBarItem show={this._openFacebookModal}
                                   title="Share Ballot"
                                   facebookIcon
                                    />
            </div>}
            <GettingStartedBarItem url={twitterIntent}
                                   title="Tweet Ballot"
                                   twitterIcon
                                   isExternal/>
            {/* February 2018, Facebook and Magic Email disabled for Cordova -- In this case it is the PollingLocator with the iFrame */}
            { isWebApp() && <div>
              <GettingStartedBarItem show={this._openPollingLocatorModal}
                                     titleDesktop="Polling Location"
                                     titleMobile="Vote"
                                     mapMarkerIcon/>
              </div>
            }
            </div>
        </header>
      }
      { this.state.showBallotIntroFollowIssues ? BallotIntroFollowIssuesModal : null }
      { this.state.showBallotIntroOrganizations ? BallotIntroOrganizationsModal : null }
      { this.state.showBallotIntroPositions ? BallotIntroPositionsModal : null }
      { this.state.showBallotIntroFriends ? BallotIntroFriendsModal : null }
      { this.state.showBallotIntroShare ? BallotIntroShareModal : null }
      { this.state.showBallotIntroVote ? BallotIntroVoteModal : null }
      { this.state.showEmailModal ? SendEmailModal : null }
      { this.state.showFacebookModal ? SendFacebookModal : null }
      { this.state.showPollingLocatorModal &&
        <PollingPlaceLocatorModal show={this.state.showPollingLocatorModal}
                                  onHide={() => this._openPollingLocatorModal(this)}/>
      }
    </div>;
  }
}

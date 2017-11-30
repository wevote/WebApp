import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BallotIntroFollowIssues from "../../components/Ballot/BallotIntroFollowIssues";
import BallotIntroFollowAdvisers from "../../components/Ballot/BallotIntroFollowAdvisers";
import BallotIntroFriends from "../../components/Ballot/BallotIntroFriends";
// import BallotIntroOrganizations from "../../components/Ballot/BallotIntroOrganizations";
import BallotIntroPositions from "../../components/Ballot/BallotIntroPositions";
import BallotIntroPositionBar from "../../components/Ballot/BallotIntroPositionBar";
import BallotIntroShare from "../../components/Ballot/BallotIntroShare";
import BallotIntroVote from "../../components/Ballot/BallotIntroVote";
import GettingStartedBarItem from "./GettingStartedBarItem";
import EmailBallotModal from "../Ballot/EmailBallotModal";
import Slider from "react-slick";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";

export default class HeaderGettingStartedBar extends Component {
  static propTypes = {
    voter: PropTypes.object,
    pathname: PropTypes.string
  };

  constructor (props){
    super(props);
    this._toggleBallotIntroFollowIssues = this._toggleBallotIntroFollowIssues.bind(this);
    this._toggleBallotIntroOrganizations = this._toggleBallotIntroOrganizations.bind(this);
    this._toggleBallotIntroPositions = this._toggleBallotIntroPositions.bind(this);
    this._toggleBallotIntroFriends = this._toggleBallotIntroFriends.bind(this);
    this._toggleBallotIntroShare = this._toggleBallotIntroShare.bind(this);
    this._toggleBallotIntroVote = this._toggleBallotIntroVote.bind(this);
    this._openEmailModal = this._openEmailModal.bind(this);
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
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
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
    var slider_settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      //react-slick default left & right nav arrows
      arrows: false,
    };

    // Have all of the 6 major steps been taken?
    let voter_thorough_orientation_complete = false;
    const SendEmailModal = <Modal bsClass="background-brand-blue modal"
                      show={this.state.showEmailModal}
                      onHide={() => this._openEmailModal(this)}>
      <Modal.Body>
        <div className="intro-modal__close">
          <a onClick={this._openEmailModal} className="intro-modal__close-anchor">
            <img src="/img/global/icons/x-close.png" alt="close" />
          </a>
        </div>
        <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
          <div key={1}><EmailBallotModal ballot_link={this.props.pathname} next={this._nextSliderPage}/></div>
        </Slider>
      </Modal.Body>
    </Modal>;

    const BallotIntroFollowIssuesModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroFollowIssues}
                                    onHide={() => this._toggleBallotIntroFollowIssues(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroFollowIssues} className="intro-modal__close-anchor">
              <img src="/img/global/icons/x-close.png" alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroFollowIssues next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
            <div key={3}><BallotIntroPositionBar next={this._toggleBallotIntroFollowIssues}/></div>
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
              <img src="/img/global/icons/x-close.png" alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._toggleBallotIntroOrganizations}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroPositionsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroPositions}
                                    onHide={() => this._toggleBallotIntroPositions(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroPositions} className="intro-modal__close-anchor">
              <img src="/img/global/icons/x-close.png" alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroPositions next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._toggleBallotIntroPositions}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroFriendsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroFriends}
                                    onHide={() => this._toggleBallotIntroFriends(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroFriends} className="intro-modal__close-anchor">
              <img src="/img/global/icons/x-close.png" alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroFriends next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._toggleBallotIntroFriends}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroShareModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroShare}
                                    onHide={() => this._toggleBallotIntroShare(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroShare} className="intro-modal__close-anchor">
              <img src="/img/global/icons/x-close.png" alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroShare next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._toggleBallotIntroShare}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroVoteModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroVote}
                                    onHide={() => this._toggleBallotIntroVote(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._toggleBallotIntroVote} className="intro-modal__close-anchor">
              <img src="/img/global/icons/x-close.png" alt="close" />
            </a>
          </div>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroVote next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._toggleBallotIntroVote}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    return <div className="page-getting-started-header-background">
      { voter_thorough_orientation_complete ?
        null :
        <header className="page-getting-started-header">
          <div className="header-getting-started-nav">
            {/* Issues Icon & Modal */}
            <GettingStartedBarItem show={this._toggleBallotIntroFollowIssues}
              source="/img/global/svg-icons/issues-v1-64x42.svg"
              title="Issues"
              completed={this.state.ballot_intro_issues_completed} />
            {/* Organizations Icon & Modal */}
            <GettingStartedBarItem show={this._toggleBallotIntroOrganizations}
              source="/img/global/svg-icons/organizations-v2-31x26.svg"
              title="Organizations"
              completed={this.state.ballot_intro_organizations_completed} />
            <GettingStartedBarItem show={this._openPrintModal}
                                   title="Print"
                                   printIcon/>
            <GettingStartedBarItem show={this._openEmailModal}
                                   title="Email"
                                   emailIcon/>
            {/* Positions Icon & Modal */}
            {/* <GettingStartedBarItem show={this._toggleBallotIntroPositions}
              source="/img/global/svg-icons/stance-v1-59x32.svg"
              title="Positions"
              completed={this.state.ballot_intro_positions_completed} /> */}
            {/* Friends Icon & Modal */}
            {/* <GettingStartedBarItem show={this._toggleBallotIntroFriends}
              source="/img/global/svg-icons/friends-v2-59x28.svg"
              title="Friends"
              completed={this.state.ballot_intro_friends_completed} /> */}
            {/* Share Icon & Modal */}
            {/* <GettingStartedBarItem show={this._toggleBallotIntroShare}
              source="/img/global/svg-icons/share-v2-28x24.svg"
              title="Share"
              completed={this.state.ballot_intro_share_completed} /> */}
            {/* Vote Icon & Modal */}
            {/* <GettingStartedBarItem show={this._toggleBallotIntroVote}
              source="/img/global/svg-icons/vote-v6-28x28.svg"
              title="Vote"
              completed={this.state.ballot_intro_vote_completed} /> */}
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
    </div>;
  }
}

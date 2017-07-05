import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router";
import BallotIntroFollowIssues from "../../components/Ballot/BallotIntroFollowIssues";
import BallotIntroFollowAdvisers from "../../components/Ballot/BallotIntroFollowAdvisers";
import BallotIntroFriends from "../../components/Ballot/BallotIntroFriends";
import BallotIntroOrganizations from "../../components/Ballot/BallotIntroOrganizations";
import BallotIntroPositions from "../../components/Ballot/BallotIntroPositions";
import BallotIntroPositionBar from "../../components/Ballot/BallotIntroPositionBar";
import BallotIntroShare from "../../components/Ballot/BallotIntroShare";
import BallotIntroVote from "../../components/Ballot/BallotIntroVote";
import cookies from "../../utils/cookies";
import Slider from "react-slick";
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
    this._nextSliderPage = this._nextSliderPage.bind(this);
    this.state = {
      ballot_intro_issues_completed: false,
      ballot_intro_organizations_completed: false,
      ballot_intro_positions_completed: false,
      ballot_intro_friends_completed: false,
      ballot_intro_share_completed: false,
      ballot_intro_vote_completed: false,
      showBallotIntroFollowIssues: false,
      showBallotIntroOrganizations: false,
      showBallotIntroPositions: false,
      showBallotIntroFriends: false,
      showBallotIntroShare: false,
      showBallotIntroVote: false,
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

  _toggleBallotIntroFollowIssues () {
    this.setState({ showBallotIntroFollowIssues: !this.state.showBallotIntroFollowIssues });
  }

  _toggleBallotIntroOrganizations () {
    this.setState({ showBallotIntroOrganizations: !this.state.showBallotIntroOrganizations });
  }

  _toggleBallotIntroPositions () {
    this.setState({ showBallotIntroPositions: !this.state.showBallotIntroPositions });
  }

  _toggleBallotIntroFriends () {
    this.setState({ showBallotIntroFriends: !this.state.showBallotIntroFriends });
  }

  _toggleBallotIntroShare () {
    this.setState({ showBallotIntroShare: !this.state.showBallotIntroShare });
  }

  _toggleBallotIntroVote () {
    this.setState({ showBallotIntroVote: !this.state.showBallotIntroVote });
  }

  _nextSliderPage () {
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

    let voter_is_signed_in = this.props.voter && this.props.voter.is_signed_in;
    let voter_orientation_complete = cookies.getItem("voter_orientation_complete") || voter_is_signed_in;

    const BallotIntroFollowIssuesModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroFollowIssues}
                                    onHide={()=>{this._toggleBallotIntroFollowIssues(this);}}>
        <Modal.Body>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroFollowIssues next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
            <div key={3}><BallotIntroPositionBar next={this._nextSliderPage}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroOrganizationsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroOrganizations}
                                    onHide={()=>{this._toggleBallotIntroOrganizations(this);}}>
        <Modal.Body>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroOrganizations next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._nextSliderPage}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroPositionsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroPositions}
                                    onHide={()=>{this._toggleBallotIntroPositions(this);}}>
        <Modal.Body>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroPositions next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._nextSliderPage}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroFriendsModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroFriends}
                                    onHide={()=>{this._toggleBallotIntroFriends(this);}}>
        <Modal.Body>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroFriends next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._nextSliderPage}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroShareModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroShare}
                                    onHide={()=>{this._toggleBallotIntroShare(this);}}>
        <Modal.Body>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroShare next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._nextSliderPage}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    const BallotIntroVoteModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showBallotIntroVote}
                                    onHide={()=>{this._toggleBallotIntroVote(this);}}>
        <Modal.Body>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroVote next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroPositionBar next={this._nextSliderPage}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    return <div>
      { voter_orientation_complete ?
          <header className="page-getting-started-header">
            <div className="header-getting-started-nav">
              {/* Issues Icon & Modal */}
              <Link onClick={this._toggleBallotIntroFollowIssues} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
                <span title="Issues">
                  <img className="glyphicon" src="/img/global/svg-icons/issues-v1-64x42.svg" />
                </span>
                <span className="header-getting-started-nav__label">
                  Issues{ this.state.ballot_intro_issues_completed ? "*" : null }
                  </span>
              </Link>
              {/* Organizations Icon & Modal */}
              <Link onClick={this._toggleBallotIntroOrganizations} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
                <span title="Organizations">
                  <img className="glyphicon" src="/img/global/svg-icons/organizations-v2-31x26.svg" />
                </span>
                <span className="header-getting-started-nav__label">
                  Organizations{ this.state.ballot_intro_organizations_completed ? "*" : null }
                  </span>
              </Link>
              {/* Positions Icon & Modal */}
              <Link onClick={this._toggleBallotIntroPositions} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
                <span title="Positions">
                  <img className="glyphicon" src="/img/global/svg-icons/stance-v1-59x32.svg" />
                </span>
                <span className="header-getting-started-nav__label">
                  Positions{ this.state.ballot_intro_positions_completed ? "*" : null }
                  </span>
              </Link>
              {/* Friends Icon & Modal */}
              <Link onClick={this._toggleBallotIntroFriends} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
                <span title="Friends">
                  <img className="glyphicon" src="/img/global/svg-icons/friends-v2-59x28.svg" />
                </span>
                <span className="header-getting-started-nav__label">
                  Friends{ this.state.ballot_intro_friends_completed ? "*" : null }
                  </span>
              </Link>
              {/* Share Icon & Modal */}
              <Link onClick={this._toggleBallotIntroShare} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
                <span title="Share">
                  <img className="glyphicon" src="/img/global/svg-icons/share-v2-28x24.svg" />
                </span>
                <span className="header-getting-started-nav__label">
                  Share{ this.state.ballot_intro_share_completed ? "*" : null }
                  </span>
              </Link>
              {/* Vote Icon & Modal */}
              <Link onClick={this._toggleBallotIntroVote} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
                <span title="Vote">
                  <img className="glyphicon" src="/img/global/svg-icons/vote-v6-25x25.svg" />
                </span>
                <span className="header-getting-started-nav__label">
                  Vote{ this.state.ballot_intro_vote_completed ? "*" : null }
                  </span>
              </Link>
            </div>
          </header> :
          null
      }
      { this.state.showBallotIntroFollowIssues ? BallotIntroFollowIssuesModal : null }
      { this.state.showBallotIntroOrganizations ? BallotIntroOrganizationsModal : null }
      { this.state.showBallotIntroPositions ? BallotIntroPositionsModal : null }
      { this.state.showBallotIntroFriends ? BallotIntroFriendsModal : null }
      { this.state.showBallotIntroShare ? BallotIntroShareModal : null }
      { this.state.showBallotIntroVote ? BallotIntroVoteModal : null }
    </div>;
  }
}

import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import Slider from "react-slick";
// import BallotIntroMission from "./BallotIntroMission";
import BallotIntroFollowIssues from "./BallotIntroFollowIssues";
import BallotIntroFollowAdvisers from "./BallotIntroFollowAdvisers";
import BallotIntroPositionBar from "./BallotIntroPositionBar";
import VoterActions from "../../actions/VoterActions";


export default class BallotIntroModal extends Component {
  // This Modal is shown to the user, when user visits the ballot page for first time only

  static propTypes = {
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this._nextSliderPage = this._nextSliderPage.bind(this);
  }

  _nextSliderPage () {
    VoterActions.voterUpdateRefresh();
    this.refs.slider.slickNext();
  }

  render () {
    const slider_settings = {
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

    return <Modal bsClass="background-brand-blue modal"
                  show={this.props.show}
                  onHide={this.props.toggleFunction}>
      <Modal.Body>
        <div className="intro-modal__close">
          <a onClick={this.props.toggleFunction} className="intro-modal__close-anchor">
            <img src="/img/global/icons/x-close.png" alt="close" />
          </a>
        </div>
        <Slider dotsClass="slick-dots intro-modal__gray-dots"
                className="calc-height intro-modal__height-full"
                ref="slider" {...slider_settings}>
          {/* <div className="intro-modal__height-full" key={1}><BallotIntroMission next={this._nextSliderPage}/></div>*/}
          <div className="intro-modal__height-full" key={2}><BallotIntroFollowIssues next={this._nextSliderPage}/></div>
          <div className="intro-modal__height-full" key={3}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
          <div className="intro-modal__height-full" key={4}><BallotIntroPositionBar next={this.props.toggleFunction}/></div>
        </Slider>
      </Modal.Body>
    </Modal>;
  }
}

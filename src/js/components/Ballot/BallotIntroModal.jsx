import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Slider from 'react-slick';
import BallotIntroFollowAdvisers from './BallotIntroFollowAdvisers';
import BallotIntroFollowIssues from './BallotIntroFollowIssues';
import BallotIntroVerifyAddress from './BallotIntroVerifyAddress';
import { cordovaDot, hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';
import closeIcon from '../../../img/global/icons/x-close.png';

export default class BallotIntroModal extends Component {
  // This Modal is shown to the user, when user visits the ballot page for first time only

  static propTypes = {
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      current_page_index: 0,
    };
    this._nextSliderPage = this._nextSliderPage.bind(this);
    this.afterChangeHandler = this.afterChangeHandler.bind(this);
  }

  // componentDidMount () {
  // }

  _nextSliderPage () {
    VoterActions.voterUpdateRefresh();
    this.refs.slider.slickNext(); // eslint-disable-line react/no-string-refs
  }

  afterChangeHandler (index) {
    this.setState({
      current_page_index: index,
    });
  }

  render () {
    renderLog(__filename);
    const sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      afterChange: this.afterChangeHandler,

      // react-slick default left & right nav arrows
      arrows: false,
    };

    return (
      <Modal
        bsPrefix="background-brand-blue modal"
        show={this.props.show}
        onHide={this.props.toggleFunction}
      >
        <Modal.Body>
          <div className="intro-modal__close">
            <button type="button" onClick={this.props.toggleFunction} className={`intro-modal__close-anchor ${hasIPhoneNotch() ? 'intro-modal__close-anchor-iphonex' : ''}`}>
              <img src={cordovaDot(closeIcon)} alt="close" />
            </button>
          </div>
          <Slider
            dotsClass="slick-dots intro-modal__gray-dots"
            className="calc-height intro-modal__height-full"
            ref="slider" // eslint-disable-line react/no-string-refs
            {...sliderSettings}
          >
            <div className="intro-modal__height-full" key={1}><BallotIntroFollowIssues next={this._nextSliderPage} /></div>
            <div className="intro-modal__height-full" key={2}><BallotIntroFollowAdvisers next={this._nextSliderPage} /></div>
            <div className="intro-modal__height-full" key={3}><BallotIntroVerifyAddress next={this.props.toggleFunction} manualFocus={this.state.current_page_index === 2} /></div>
          </Slider>
        </Modal.Body>
      </Modal>
    );
  }
}

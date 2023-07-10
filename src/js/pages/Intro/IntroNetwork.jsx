import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Slider from 'react-slick';
import IntroNetworkBallotIsNext from '../../components/Intro/IntroNetworkBallotIsNext';
import IntroNetworkDefinition from '../../components/Intro/IntroNetworkDefinition';
import IntroNetworkSafety from '../../components/Intro/IntroNetworkSafety';
import { getAndroidSize, isAndroid } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';

const closeIcon = '../../../img/global/icons/x-close.png';


export default class IntroNetwork extends Component {
  static goToReadyLink () {
    const readyLink = '/ready';
    historyPush(readyLink);
  }

  constructor (props) {
    super(props);
    this.state = {};

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.slider = React.createRef();
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
    document.body.style.backgroundColor = '#A3A3A3';
    document.body.className = 'story-view';
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = '';
  }

  next () {
    this.slider.current.slickNext();
  }

  previous () {
    this.slider.current.slickPrev();
  }

  overrideMediaQueryForAndroidTablets () {
    // Media queries in CSS often don't work as expected in Cordova, due to window.devicePixelRatio greater than one
    if (isAndroid()) {
      const sizeString = getAndroidSize();
      if (sizeString === '--xl') {
        return {
          maxHeight: 'unset',
          maxWidth: 'unset',
        };
      }
    }
    return {};
  }

  render () {
    renderLog('IntroNetwork');  // Set LOG_RENDER_EVENTS to log all renders

    // These are settings for the react-slick slider
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      arrows: false,
    };

    return (
      <div>
        <Helmet title="Welcome to We Vote" />
        <div className="intro-story container-fluid well u-inset--md" style={this.overrideMediaQueryForAndroidTablets()}>
          <span onClick={IntroNetwork.goToReadyLink}>
            <img
              src={normalizedImagePath(closeIcon)}
              className={isWebApp() ? 'x-close' : 'x-close x-close__cordova'}
              alt="close"
            />
          </span>
          <Slider dots={settings.dots} infinite={settings.infinite} speed={settings.speed} slidesToShow={settings.slidesToShow} slidesToScroll={settings.slidesToScroll} swipe={settings.swipe} accesibility={settings.accessibility} arrows={settings.arrows} dotsClass="slick-dots intro-modal__gray-dots" ref={this.slider}>
            <div key={1}><IntroNetworkSafety next={this.next} /></div>
            <div key={2}><IntroNetworkDefinition next={this.next} /></div>
            <div key={3}><IntroNetworkBallotIsNext next={this.next} /></div>
          </Slider>
        </div>
      </div>
    );
  }
}

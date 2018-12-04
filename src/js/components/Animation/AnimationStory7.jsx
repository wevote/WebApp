import React, { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

export default class AnimationStory7 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      animation_complete: false,
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentDidUpdate () {
    //  This will start the GreenSock animation
    if (this.state.voter && !this.state.animation_complete) {
      this.props.timeline.from(this.refs.header1, 0.75, { left: 100, autoAlpha: 0 })
        .from(this.refs.header2, 0.50, { left: 100, autoAlpha: 0 })
        .from(this.refs.header3, 0.50, { left: 100, autoAlpha: 0 })
        .from(this.refs.signInBtn, 0.50, { left: 100, autoAlpha: 0, onComplete: this.setState({ animation_complete: true }) });
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  goToGetStarted () {
    const getStartedNow = "/intro/get_started";
    historyPush(getStartedNow);
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <div className="intro-story__background background--image7">
        <div ref="header1" className="intro-story__h1--alt">We Vote Informed</div>
        <div ref="header2" className="intro-story__h1--alt">We Vote Together</div>
        <div ref="header3" className="intro-story__h1--alt">We Vote with Confidence</div>
        <div ref="signInBtn">
          <div className="intro-story__padding-btn">
            <button
              type="button"
              className="btn btn-lg btn-success"
              onClick={this.goToGetStarted}
            >
              Get Started&nbsp;&nbsp;&gt;
            </button>
          </div>
        </div>
      </div>
    );
  }
}


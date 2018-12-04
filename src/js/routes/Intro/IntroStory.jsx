/* global TimelineLite */
import React, { Component } from "react";
import Helmet from "react-helmet";
import Slider from "react-slick";
import AnimationStory1 from "../../components/Animation/AnimationStory1";
import AnimationStory2 from "../../components/Animation/AnimationStory2";
import AnimationStory3 from "../../components/Animation/AnimationStory3";
import AnimationStory4 from "../../components/Animation/AnimationStory4";
import AnimationStory5 from "../../components/Animation/AnimationStory5";
import AnimationStory7 from "../../components/Animation/AnimationStory7";
import cookies from "../../utils/cookies";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
// import AnimationStory6 from "../../components/Animation/AnimationStory6";

export default class IntroStory extends Component {

  constructor (props) {
    super(props);
    this.state = {};

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.slider = React.createRef();
  }

  next () {
    this.slider.current.slickNext();
  }

  previous () {
    this.slider.current.slickPrev();
  }

  goToBallotLink () {
    const sampleBallotLink = "/intro/sample_ballot";
    historyPush(sampleBallotLink);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";

    // Once you have visited this page, set a cookie recording that you have visited this page
    cookies.setItem("intro_story_watched", "1", Infinity, "/");
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
  }

  render () {
    renderLog(__filename);
    // These are GreenSock animation instances
    const timeline = new TimelineLite();

    // These are settings for the react-slick slider
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      // react-slick default left & right nav arrows
      arrows: true,
      beforeChange () {
        timeline.restart();
      },
    };

    return (
      <div>
        <Helmet title="Welcome to We Vote" />
        <div className="intro-story container-fluid well u-inset--md">
          <img src={cordovaDot("/img/global/icons/x-close.png")} onClick={this.goToBallotLink} className="x-close" alt="close" />
          <Slider ref={this.slider} {...settings}>
            <div key={1}><AnimationStory1 next={this.next} /></div>
            <div key={2}><AnimationStory2 next={this.next} /></div>
            <div key={3}><AnimationStory3 next={this.next} /></div>
            <div key={4}><AnimationStory4 next={this.next} /></div>
            <div key={5}><AnimationStory5 next={this.next} /></div>
            {/* <div key={6}><AnimationStory6 next={this.next}/></div> */}
            <div key={7}><AnimationStory7 next={this.next} timeline={timeline} /></div>
          </Slider>
        </div>
      </div>
    );
  }
}

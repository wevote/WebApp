/* global TimelineLite */
import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";
import AnimationStory1 from "../../components/Animation/AnimationStory1";
import AnimationStory2 from "../../components/Animation/AnimationStory2";
import AnimationStory3 from "../../components/Animation/AnimationStory3";
import AnimationStory4 from "../../components/Animation/AnimationStory4";
import AnimationStory5 from "../../components/Animation/AnimationStory5";
// import AnimationStory6 from "../../components/Animation/AnimationStory6";
import AnimationStory7 from "../../components/Animation/AnimationStory7";
import cookies from "../../utils/cookies";
var Slider = require("react-slick");

export default class IntroStory extends Component {

  constructor (props) {
    super(props);
    this.state = {};

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next () {
    this.refs.slider.slickNext();
  }

  previous () {
    this.refs.slider.slickPrev();
  }

  goToBallotLink () {
    var sampleBallotLink = "/intro/sample_ballot";
    browserHistory.push(sampleBallotLink);
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
    //These are GreenSock animation instances
    var timeline = new TimelineLite();

    //These are settings for the react-slick slider
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      //react-slick default left & right nav arrows
      arrows: true,
      beforeChange: function () {
        timeline.restart();
      }
    };

    return <div>
      <Helmet title="Welcome to We Vote" />
      <div className="intro-story container-fluid well u-inset--md">
        <img src={"/img/global/icons/x-close.png"} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
        <Slider ref="slider" {...settings}>
          <div key={1}><AnimationStory1 next={this.next}/></div>
          <div key={2}><AnimationStory2 next={this.next}/></div>
          <div key={3}><AnimationStory3 next={this.next}/></div>
          <div key={4}><AnimationStory4 next={this.next}/></div>
          <div key={5}><AnimationStory5 next={this.next}/></div>
          {/*<div key={6}><AnimationStory6 next={this.next}/></div>*/}
          <div key={7}><AnimationStory7 next={this.next} timeline={timeline}/></div>
       </Slider>
      </div>
    </div>;
  }
}

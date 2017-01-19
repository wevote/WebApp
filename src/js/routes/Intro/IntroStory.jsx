import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";
// import TimelineLite from "gsap";
import AnimationStory1 from "../../components/Animation/AnimationStory1";
import AnimationStory2 from "../../components/Animation/AnimationStory2";
import AnimationStory3 from "../../components/Animation/AnimationStory3";
var Slider = require("react-slick");

export default class IntroStory extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  nextSlide () {
//    console.log("current slide " + this.refs.slider.currentSlide);

  }

  goToBallotLink () {
    var sampleBallotLink = "/intro/sample_ballot";
    browserHistory.push(sampleBallotLink);
  }

  render () {

//These are GreenSock animation instances
    var timeline1 = new TimelineLite({onComplete: this.nextSlide.bind(this)});
    var timeline2 = new TimelineLite();
    var timeline3 = new TimelineLite();

//These are settings for the react-slick slider
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      arrows: false,
      beforeChange: function () {
        timeline1.restart();
        timeline2.restart();
        timeline3.restart();
      }
    };

    return <div>
      <Helmet title="Welcome to We Vote" />
      <div className="intro-story container-fluid well fluff-full1">
        <img src={"/img/global/icons/close-x.png"} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
        <Slider ref="slider" {...settings}>
          <div key={1}><AnimationStory1 timeline1={timeline1}/></div>
          <div key={2}><AnimationStory2 timeline2={timeline2}/></div>
          <div key={3}><AnimationStory3 timeline3={timeline3}/></div>
          <div key={4}><p>This will be an image</p></div>
         </Slider>
      </div>
    </div>;
  }
}


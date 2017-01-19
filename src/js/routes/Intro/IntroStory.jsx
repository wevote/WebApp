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

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next () {
    console.log("next slide");
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
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
  }

  render () {

//These are GreenSock animation instances
    var timeline1 = new TimelineLite();
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
      afterChange: function () {
      //This needs to be reconfigured at some point
        timeline1.restart();
        timeline2.restart();
        timeline3.restart();
      }
    };

    return <div>
      <Helmet title="Welcome to We Vote" />
      <div className="intro-story container-fluid well fluff-full1">
        <span onClick={this.next} className="glyphicon glyphicon-menu-right intro-story__menu-right" aria-hidden="true"/>
        <span onClick={this.previous} className="glyphicon glyphicon-menu-left intro-story__menu-left" aria-hidden="true"/>
        <img src={"/img/global/icons/x-close.png"} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
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


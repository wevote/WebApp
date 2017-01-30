import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";
import AnimationStory1 from "../../components/Animation/AnimationStory1";
import AnimationStory2 from "../../components/Animation/AnimationStory2";
import AnimationStory3 from "../../components/Animation/AnimationStory3";
import AnimationStory4 from "../../components/Animation/AnimationStory4";
import AnimationStory5 from "../../components/Animation/AnimationStory5";
import AnimationStory6 from "../../components/Animation/AnimationStory6";
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
    cookies.setItem("intro_story_watched", '1', Infinity, "/");
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
  }

  render () {

//These are GreenSock animation instances
    var timeline1 = new TimelineLite();
    var timeline2 = new TimelineLite();
    var timeline3 = new TimelineLite();
    var timeline4 = new TimelineLite();
    var timeline5 = new TimelineLite();
    var timeline6 = new TimelineLite();
    var timeline7 = new TimelineLite();


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
        timeline4.restart();
        timeline5.restart();
        timeline6.restart();
        timeline7.restart();

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
          <div key={4}><AnimationStory4 timeline4={timeline4}/></div>
          <div key={5}><AnimationStory5 timeline5={timeline5}/></div>
          <div key={6}><AnimationStory6 timeline6={timeline6}/></div>
          <div key={7}><AnimationStory7 timeline7={timeline7}/></div>
       </Slider>
      </div>
    </div>;
  }
}


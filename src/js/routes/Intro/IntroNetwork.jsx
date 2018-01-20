import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";
import IntroNetworkSafety from "../../components/Intro/IntroNetworkSafety";
import IntroNetworkDefinition from "../../components/Intro/IntroNetworkDefinition";
import IntroNetworkScore from "../../components/Intro/IntroNetworkScore";
import IntroNetworkBallotIsNext from "../../components/Intro/IntroNetworkBallotIsNext";
var Slider = require("react-slick");

export default class IntroNetwork extends Component {

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
    var ballotLink = "/ballot";
    browserHistory.push(ballotLink);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
  }

  render () {
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
      }
    };

    return <div>
      <Helmet title="Welcome to We Vote" />
      <div className="intro-story container-fluid well u-inset--md">
        <img src={"/img/global/icons/x-close.png"} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
        <Slider ref="slider" {...settings}>
          <div key={1}><IntroNetworkSafety next={this.next}/></div>
          <div key={2}><IntroNetworkDefinition next={this.next}/></div>
          <div key={3}><IntroNetworkScore next={this.next}/></div>
          <div key={4}><IntroNetworkBallotIsNext next={this.next}/></div>
       </Slider>
      </div>
    </div>;
  }
}

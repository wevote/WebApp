import React, { Component } from "react";
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

  componentWillMount (){
//  TODO: Research how to do this in a react-friendly way
    document.body.style.backgroundColor = "#A3A3A3";
  }

  componentWillUnmount (){
//  TODO: Research how to do this in a react-friendly way
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
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      slide: true,
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
      <div className="container-fluid well u-gutter__top--small fluff-full1 intro-story">
        <Slider {...settings}>
          <div><AnimationStory1 timeline1={timeline1}/></div>
          <div><AnimationStory2 timeline2={timeline2}/></div>
          <div><AnimationStory3 timeline3={timeline3}/></div>
          <div><p>This will be an image</p></div>
         </Slider>
      </div>
    </div>;
  }
}


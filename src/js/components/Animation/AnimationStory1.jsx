import React, { Component, PropTypes } from "react";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";

const imgUrl = "/img/global/animations/3.1/flag_background_lg.png";
const divStyle = {
  backgroundImage: "url(" + imgUrl + ")",
};

export default class AnimationStory1 extends Component {
  static propTypes = {
    history: PropTypes.object,
    timeline1: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {img: "/img/global/animations/3.1/3.1.3.png"};
  }

//  This will start the GreenSock animation
  componentDidMount () {
    this.props.timeline1.from(this.refs.header1, 1, {left: 100, autoAlpha: 0})
    .from(this.refs.header2, 2, {left: 100, autoAlpha: 0, paddingBottom: 40})
    .from(this.refs.signInBtn, 1, {left: 100, autoAlpha: 0})
    .to(this.refs.header1, 0.50, {left: 100, autoAlpha: 0, paddingBottom: 0})
    .from(this.refs.header3, 1, {left: 100, autoAlpha: 0})
    .from(this.refs.ballotImg, 1.5, {autoAlpha: 0, paddingTop: 20, onComplete: this.updateImg.bind(this)}).duration(4)
    .to(this.refs.header3, 1, {left: 100, autoAlpha: 0});
    }

  updateImg () {
//    var num = 3;
//    if(num < 12) {
//      num++;
//    };
//    var imgUrl = "/img/global/animations/3.1/3.1." + num + ".png";
    var image = "/img/global/animations/3.1/3.1.4b.png";
    this.setState({img: image});

    console.log("imgUrl: " + imgUrl + "new state: " + this.state.img);
  }

  render () {
    return <div style={divStyle} className="background-image">
      <div className="row">
        <div ref="header1" className="example-header">Welcome to We Vote!</div>
      </div>
      <div className="row">
        <div ref="header2" className="example-header2">We Vote Informed</div>
      </div>
      <div className="row">
        <div ref="ballotImg"><img className="animation-images" src={this.state.img}/></div>
      </div>
      <div className="row">
         <div ref="electionImg"/>
      </div>
      <div className="row">
        <div ref="header3" className="example-header">Find candidates & measures</div>
      </div>
      <div className="row" ref="signInBtn">
        <div className="col-xs-6 col-md-6 pull-left"><FacebookSignIn /></div>
        <div className="col-xs-6 col-md-6 pull-right"><TwitterSignIn /></div>
      </div>
    </div>;
  }
}


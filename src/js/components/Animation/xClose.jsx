import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class xClose extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  goToLink () {
    var link;
    browserHistory.push(link);
  }

  render () {

  return <div>
     <img src={"/img/global/icons/close-x.png"} onClick={this.goToLink} className="x-close" alt={"close"}/>
   </div>;
  }
}


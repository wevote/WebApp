import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class TwitterSignIn extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {

    return <Link className="btn btn-social btn-lg btn-twitter" to="/twittersigninprocess/signinstart" >
      <i className="fa fa-twitter"></i>Sign in with Twitter
    </Link>;
  }
}

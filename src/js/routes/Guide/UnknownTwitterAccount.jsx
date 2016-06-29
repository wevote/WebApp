import { Button } from "react-bootstrap";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import TwitterAccountCard from "../../components/Twitter/TwitterAccountCard";

export default class UnknownTwitterAccount extends Component {
  static propTypes = {
    twitter_handle: PropTypes.string
  };

  constructor (props) {
    super(props);
  }

  render () {
    let {twitter_handle} = this.props;

    return <div>
      <TwitterAccountCard {...this.props}/>
      <Link to={`/verifythisisme/${twitter_handle}`}><Button bsClass="bs-btn" bsStyle="primary">This is Me</Button></Link>
    </div>;
  }
}

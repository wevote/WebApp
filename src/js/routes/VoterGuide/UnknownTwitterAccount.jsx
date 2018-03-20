import React, { Component } from "react";
import PropTypes from "prop-types";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import TwitterAccountCard from "../../components/Twitter/TwitterAccountCard";

export default class UnknownTwitterAccount extends Component {
  static propTypes = {
    twitter_handle: PropTypes.string,
    twitter_name: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    let {twitter_handle, twitter_name} = this.props;

    return <div>
        <TwitterAccountCard {...this.props}/>
        <br />
        <ThisIsMeAction twitter_handle_being_viewed={twitter_handle}
                        name_being_viewed={twitter_name} />
        <br />
      </div>;
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import TwitterAccountCard from "../../components/Twitter/TwitterAccountCard";

export default class UnknownTwitterAccount extends Component {
  static propTypes = {
    twitter_handle: PropTypes.string,
    twitter_name: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    const { twitter_handle: twitterHandle, twitter_name: twitterName } = this.props;

    return (
      <div>
        <TwitterAccountCard twitterHandle={twitterHandle}
                            twitterName={twitterName}
        />
        <br />
        <ThisIsMeAction
          twitter_handle_being_viewed={twitterHandle}
          name_being_viewed={twitterName}
        />
        <br />
      </div>
    );
  }
}

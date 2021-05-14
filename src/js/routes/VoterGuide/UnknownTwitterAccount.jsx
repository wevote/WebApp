import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TwitterAccountCard from '../../components/Twitter/TwitterAccountCard';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';
import { renderLog } from '../../utils/logging';

export default class UnknownTwitterAccount extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('UnknownTwitterAccount');  // Set LOG_RENDER_EVENTS to log all renders
    const { twitterHandle, twitterName } = this.props;

    return (
      <div>
        <TwitterAccountCard twitterHandle={twitterHandle}
                            twitterName={twitterName}
        />
        <br />
        <ThisIsMeAction
          twitterHandleBeingViewed={twitterHandle}
          nameBeingViewed={twitterName}
        />
        <br />
      </div>
    );
  }
}
UnknownTwitterAccount.propTypes = {
  twitterHandle: PropTypes.string,
  twitterName: PropTypes.string,
};

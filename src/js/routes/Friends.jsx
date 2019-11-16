import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Info from '@material-ui/icons/Info';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import FriendsCurrentPreview from '../components/Friends/FriendsCurrentPreview';
import FriendInvitationsSentByMePreview from '../components/Friends/FriendInvitationsSentByMePreview';
import FriendInvitationsSentToMePreview from '../components/Friends/FriendInvitationsSentToMePreview';
import SuggestedFriendsPreview from '../components/Friends/SuggestedFriendsPreview';
import TwitterSignInCard from '../components/Twitter/TwitterSignInCard';
import VoterStore from '../stores/VoterStore';

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

class Friends extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog('Friends');  // Set LOG_RENDER_EVENTS to log all renders
    const { voter } = this.state;
    const { classes } = this.props;

    if (!voter) {
      return LoadingWheel;
    }

    return (
      <span>
        <Helmet title="Friends - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <FriendInvitationsSentToMePreview />
            <SuggestedFriendsPreview />
            <section className="card">
              <div className="card-main">
                <SectionTitle>
                  Add Friends
                </SectionTitle>
                <Icon>
                  <Tooltip
                    classes={{ root: classes.tooltip }}
                    title="These friends will see what you support, oppose, and which opinions you follow.
                    We will never sell your email."
                  >
                    <Info />
                  </Tooltip>
                </Icon>

                <SectionSubtitle>
                  Invite Friends by email or phone
                </SectionSubtitle>
                <AddFriendsByEmail />
              </div>
            </section>
            <FriendsCurrentPreview />
            {voter.signed_in_twitter ? null : (
              <div className="u-show-mobile">
                <TwitterSignInCard />
              </div>
            )}
            <FriendInvitationsSentByMePreview />
          </div>
          <div className="col-md-4 d-none d-md-block">
            {voter.signed_in_twitter ? null : (
              <TwitterSignInCard />
            )}
          </div>
        </div>
      </span>
    );
  }
}

const styles = () => ({
  tooltip: {
    display: 'inline !important',
  },
});

const SectionTitle = styled.h2`
  width: fit-content;
  font-weight: bolder;
  font-size: 20px;
  margin-bottom: 4px;
`;

const Icon = styled.span`
  position: absolute;
  left: 136px;
  top: 16px;
  * {
    color: #777;
  }
`;

const SectionSubtitle = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 16px;
`;

export default withStyles(styles)(Friends);

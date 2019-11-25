import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Info from '@material-ui/icons/Info';
import { Tooltip, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import FirstAndLastNameRequiredAlert from '../components/Widgets/FirstAndLastNameRequiredAlert';
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
      value: '',
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());

    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    this.setState({ value: this.props.params.tabItem || 'requests' });
  }

  // shouldComponentUpdate (nextState) {
  //   if (this.state.mobileMode !== nextState.mobileMode) return true;
  //   return false;
  // }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

    handleResize () {
    this.setState({
      windowWidth: window.innerWidth,
    });

    if (window.innerWidth < 769) {
      this.setState({ mobileMode: true });
    } else {
      this.setState({ mobileMode: false });
    }
  }

  render () {
    renderLog('Friends');  // Set LOG_RENDER_EVENTS to log all renders
    const { voter, value } = this.state;
    const { classes } = this.props;

    if (!voter) {
      return LoadingWheel;
    }
    const { is_signed_in: voterIsSignedIn } = voter;

    return (
      <span>
        {this.state.mobileMode ? (
          <>
            <Helmet title="Friends - We Vote" />
              <Paper elevation={1}>
                <Tabs
                  value={value}
                  // onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab value="requests" label="Requests" onClick={() => {
                    this.setState({ value: 'requests' });
                    window.history.pushState({ tabItem: 'requests' }, '', '/friends/requests');
                  }} />
                  <Tab value="suggested" label="Suggested" onClick={() => {
                    this.setState({ value: 'suggested' });
                    window.history.pushState({ tabItem: 'suggested' }, '', '/friends/suggested');
                  }} />
                  <Tab value="invite" label="Add Contacts" onClick={() => {
                    this.setState({ value: 'invite' });
                    window.history.pushState({ tabItem: 'invite' }, '', '/friends/invite');
                  }} />
                  <Tab value="current" label="Friends" onClick={() => {
                    this.setState({ value: 'current' });
                    window.history.pushState({ tabItem: 'current' }, '', '/friends/current');
                  }} />
                  <Tab value="sent-requests" label="Sent Requests" onClick={() => {
                    this.setState({ value: 'sent-requests' });
                    window.history.pushState({ tabItem: 'sent-requests' }, '', '/friends/sent-requests');
                  }} />
                </Tabs>         
              </Paper>
          </>
        ) : (
          <>
            <Helmet title="Friends - We Vote" />
            <BrowserPushMessage incomingProps={this.props} />
            <div className="row">
              <div className="col-sm-12 col-lg-8">
                <FriendInvitationsSentToMePreview />
                <SuggestedFriendsPreview />
                {voterIsSignedIn && (
                  <FirstAndLastNameRequiredAlert />
                )}
                <FriendsCurrentPreview />
                {voter.signed_in_twitter ? null : (
                  <div className="u-show-mobile">
                    <TwitterSignInCard />
                  </div>
                )}
                {voterIsSignedIn && (
                  <FriendInvitationsSentByMePreview />
                )}
              </div>
              <div className="col-md-12 col-lg-4 d-none d-md-block">
                {voterIsSignedIn ? (
                  <section className="card">
                    <div className="card-main">
                      <SectionTitle>
                        Invite Friends
                      </SectionTitle>
                      <Icon>
                        <Tooltip
                          classes={{ tooltip: classes.tooltip }}
                          title="These friends will see what you support and oppose."
                        >
                          <Info />
                        </Tooltip>
                      </Icon>
                      <AddFriendsByEmail />
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          </>
        )}
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
  font-size: 18px;
  margin-bottom: 4px;
`;

const Icon = styled.span`
  position: absolute;
  left: 158px;
  top: 16px;
  * {
    color: #777;
  }
`;

export default withStyles(styles)(Friends);

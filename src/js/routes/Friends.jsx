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
import FriendActions from '../actions/FriendActions';
import FriendStore from '../stores/FriendStore';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import FirstAndLastNameRequiredAlert from '../components/Widgets/FirstAndLastNameRequiredAlert';
import FriendsCurrentPreview from '../components/Friends/FriendsCurrentPreview';
import FriendInvitationsSentByMePreview from '../components/Friends/FriendInvitationsSentByMePreview';
import FriendInvitationsSentToMePreview from '../components/Friends/FriendInvitationsSentToMePreview';
import FriendsPromoBox from '../components/Friends/FriendsPromoBox';
import SuggestedFriendsPreview from '../components/Friends/SuggestedFriendsPreview';
import TwitterSignInCard from '../components/Twitter/TwitterSignInCard';
import VoterStore from '../stores/VoterStore';
import testimonialImage from '../../img/global/photos/Dale_McGrew-200x200.jpg';
import { cordovaDot } from '../utils/cordovaUtils';
import FriendInvitationsSentToMe from './Friends/FriendInvitationsSentToMe';
import SuggestedFriends from './Friends/SuggestedFriends';
import FriendsCurrent from './Friends/FriendsCurrent';
import InviteByEmail from './Friends/InviteByEmail';
import FriendInvitationsSentByMe from './Friends/FriendInvitationsSentByMe';

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = cordovaDot(testimonialImage);
const testimonial = 'Instead of sending my friends a list of who they should vote for, I can add them as friends on We Vote.';

class Friends extends Component {
  static propTypes = {
    classes: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      mobileValue: '',
      desktopValue: '',
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());

    FriendActions.suggestedFriendList();
    FriendActions.currentFriends();
    FriendActions.friendInvitationsSentToMe();
    FriendActions.friendInvitationsSentByMe();
    this.setState({
      suggestedFriendList: FriendStore.suggestedFriendList(),
      // currentFriendList: FriendStore.currentFriends(),
      // friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      // friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));

    if (window.innerWidth < 769) {
      this.setState({ mobileMode: true, mobileValue: this.props.params.tabItem || 'requests' });
    } else {
      this.setState({ mobileMode: false, desktopValue: this.props.params.tabItem === undefined ? 'all' : this.props.params.tabItem });
    }

    window.addEventListener('resize', this.handleResize);
  }

  // shouldComponentUpdate (nextState) {
  //   if (this.state.mobileMode !== nextState.mobileMode) return true;
  //   return false;
  // }

  componentDidUpdate () {
    if (window.innerWidth >= 770 && this.props.params.tabItem !== this.state.desktopValue) {
      this.setState({ desktopValue: this.props.params.tabItem });
    }
    // if (window.innerWidth < 769 && this.props.params.tabItem !== this.state.mobileValue) {
    //   this.setState({ mobileValue: this.props.params.tabItem });
    // }
  }

  // shouldComponentUpdate (nextProps) {
  //   if (this.props.params.tabItem !== nextProps.params.tabItem) return true;
  //   return false;
  // }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.friendStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onFriendStoreChange () {
    this.setState({
      suggestedFriendList: FriendStore.suggestedFriendList(),
    });
  }

  handleResize () {
    const previousValue = this.state.mobileValue;

    if (window.innerWidth < 769) {
      this.setState({ mobileMode: true, mobileValue: previousValue || 'requests' });
      window.history.pushState({ tabItem: this.state.mobileValue }, '', `/friends/${this.state.mobileValue}`);
    } else {
      this.setState({ mobileMode: false });
      if (this.state.desktopValue) {
        window.history.pushState({ tabItem: this.state.desktopValue }, '', `/friends/${this.state.desktopValue}`);
      } else {
        window.history.pushState({ tabItem: '' }, '', '/friends');
      }
    }
  }

  render () {
    renderLog('Friends');  // Set LOG_RENDER_EVENTS to log all renders
    const { voter, mobileValue } = this.state;  // , desktopValue
    const { classes } = this.props;

    // console.log('Desktop value: ', desktopValue);
    // console.log('Mobile value: ', mobileValue);

    if (!voter) {
      return LoadingWheel;
    }
    const { is_signed_in: voterIsSignedIn } = voter;

    let mobileContentToDisplay;
    let desktopContentToDisplay;

    switch (mobileValue) {
      case 'requests':
        mobileContentToDisplay = (
          <FriendInvitationsSentToMe />
        );
        break;
      case 'suggested':
        mobileContentToDisplay = (
          <SuggestedFriends />
        );
        break;
      case 'invite':
        mobileContentToDisplay = (
          <>
            <InviteByEmail />
            <FriendsPromoBox
              imageUrl={imageUrl}
              testimonialAuthor={testimonialAuthor}
              testimonial={testimonial}
              isMobile
            />
          </>
        );
        break;
      case 'current':
        mobileContentToDisplay = (
          <FriendsCurrent />
        );
        break;
      case 'sent-requests':
        mobileContentToDisplay = (
          <FriendInvitationsSentByMe />
        );
        break;
      default:
        mobileContentToDisplay = (
          <FriendInvitationsSentToMe />
        );
    }

    switch (this.props.params.tabItem) {
      case 'requests':
        desktopContentToDisplay = (
          <FriendInvitationsSentToMe />
        );
        break;
      case 'suggested':
        desktopContentToDisplay = (
          <SuggestedFriends />
        );
        break;
      case 'invite':
        desktopContentToDisplay = (
          <InviteByEmail />
        );
        break;
      case 'current':
        desktopContentToDisplay = (
          <FriendsCurrent />
        );
        break;
      case 'sent-requests':
        desktopContentToDisplay = (
          <FriendInvitationsSentByMe />
        );
        break;
      default:
        desktopContentToDisplay = (
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
                {voter.signed_in_twitter ? null : (
                  <TwitterSignInCard />
                )}
                <FriendsPromoBox
                  imageUrl={imageUrl}
                  testimonialAuthor={testimonialAuthor}
                  testimonial={testimonial}
                />
              </div>
            </div>
          </>
        );
    }

    return (
      <span>
        {this.state.mobileMode ? (
          <>
            <Helmet title="Friends - We Vote" />
            <Paper elevation={1}>
              <Tabs
                value={mobileValue}
                // onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab
                  value="requests"
                  label="Requests"
                  onClick={() => {
                    this.setState({ mobileValue: 'requests' });
                    window.history.pushState({ tabItem: 'requests' }, '', '/friends/requests');
                  }}
                />
                {this.state.suggestedFriendList.length > 0 || mobileValue === 'suggested' ? (
                  <Tab
                    value="suggested"
                    label="Suggested"
                    onClick={() => {
                      this.setState({ mobileValue: 'suggested' });
                      window.history.pushState({ tabItem: 'suggested' }, '', '/friends/suggested');
                    }}
                  />
                ) : (
                  null
                )}
                <Tab
                  value="invite"
                  label="Add Contacts"
                  onClick={() => {
                    this.setState({ mobileValue: 'invite' });
                    window.history.pushState({ tabItem: 'invite' }, '', '/friends/invite');
                  }}
                />
                <Tab
                  value="current"
                  label="Friends"
                  onClick={() => {
                    this.setState({ mobileValue: 'current' });
                    window.history.pushState({ tabItem: 'current' }, '', '/friends/current');
                  }}
                />
                <Tab
                  value="sent-requests"
                  label="Sent Requests"
                  onClick={() => {
                    this.setState({ mobileValue: 'sent-requests' });
                    window.history.pushState({ tabItem: 'sent-requests' }, '', '/friends/sent-requests');
                  }}
                />
              </Tabs>
            </Paper>
            <br />
            {mobileContentToDisplay}
          </>
        ) : (
          <>
            {desktopContentToDisplay}
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

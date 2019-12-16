import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Link } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
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
import { cordovaDot, historyPush } from '../utils/cordovaUtils';
import FriendInvitationsSentToMe from './Friends/FriendInvitationsSentToMe';
import SuggestedFriends from './Friends/SuggestedFriends';
import FriendsCurrent from './Friends/FriendsCurrent';
import InviteByEmail from './Friends/InviteByEmail';
import FriendInvitationsSentByMe from './Friends/FriendInvitationsSentByMe';
import MessageCard from '../components/Widgets/MessageCard';

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
    this.state = {};

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
      currentFriends: FriendStore.currentFriends(),
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
    });

    const defaultTabItem = 'requests';

    // if (FriendStore.friendInvitationsSentToMe().length > 0) {
    //   defaultTabItem = 'requests';
    // } else if (FriendStore.friendInvitationsSentByMe().length > 0) {
    //   defaultTabItem = 'sent-requests';
    // } else if (FriendStore.suggestedFriendList().length > 0) {
    //   defaultTabItem = 'suggested';
    // } else {
    //   defaultTabItem = "invite";
    // }

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));

    if (window.innerWidth < 769) {
      this.setState({ mobileMode: true });
    } else {
      this.setState({ mobileMode: false });
    }

    window.addEventListener('resize', this.handleResize);
  }

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
      currentFriends: FriendStore.currentFriends(),
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
    });
  }

  handleResize () {
    if (window.innerWidth < 769) {
      this.setState({ mobileMode: true });
    } else {
      this.setState({ mobileMode: false });
    }
  }

  handleNavigation = to => historyPush(to);

  getSelectedTab () {
    return this.props.params.tabItem || this.state.defaultTabItem;
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

    switch (this.props.params.tabItem) {
      case 'requests':
        mobileContentToDisplay = (
          <>
            {this.state.friendInvitationsSentToMe.length > 0 ? (
              <FriendInvitationsSentToMe />
            ) : (
              <>
                {this.state.suggestedFriendList.length > 0 ? (
                  <MessageCard
                    mainText="You currently have no incoming requests. Check out your suggested friends."
                    buttonText="View Suggestions"
                    buttonURL="/friends/suggested"
                  />
                ) : (
                  <MessageCard
                    mainText="You currently have no incoming requests. Send some invites to connect with your friends!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}              
              </>
            )}
          </>
        );
        break;
      case 'suggested':
        mobileContentToDisplay = (
          <>
            {this.state.suggestedFriendList.length > 0 ? (
              <SuggestedFriends />
            ) : (
              <>
                {this.state.friendInvitationsSentToMe.length > 0 ? (
                  <MessageCard
                    mainText="You currently have no suggested friends. Check out your incoming friend requests!"
                    buttonText="View Requests"
                    buttonURL="/friends/requests"
                  />
                ) : (
                  <MessageCard
                    mainText="You currently have no suggested friends. Send some invites to connect with your friends!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}              
              </>
            )}
          </>
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
          <>
            {this.state.currentFriends.length > 0 ? (
              <CurrentFriends />
            ) : (
              <>
                {this.state.friendInvitationsSentToMe.length > 0 ? (
                  <MessageCard
                    mainText="You currently have no friends on We Vote, but you do have friend requests. Check them out!"
                    buttonText="View Requests"
                    buttonURL="/friends/requests"
                  />
                ) : (
                  <MessageCard
                    mainText="You currently have no friends on We Vote. Send some invites to connect with your friends!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}              
              </>
            )}
          </>
        );
        break;
      case 'sent-requests':
        mobileContentToDisplay = (
          <>
            {this.state.friendInvitationsSentByMe.length > 0 ? (
              <FriendInvitationsSentToMe />
            ) : (
              <MessageCard
                mainText="You currently have no sent requests. Send some now!"
                buttonText="Invite Friends"
                buttonURL="/friends/invite"
              />             
            )}
          </>
        );
        break;
      default:
        mobileContentToDisplay = (
          <>
            {this.state.friendInvitationsSentToMe.length > 0 ? (
              <FriendInvitationsSentToMe />
            ) : (
              <>
                {this.state.suggestedFriendList.length > 0 ? (
                  <MessageCard
                    mainText="You currently have no incoming requests. Check out your suggested friends."
                    buttonText="View Suggestions"
                    buttonURL="/friends/suggested"
                  />
                ) : (
                  <MessageCard
                    mainText="You currently have no incoming requests. Send some invites to connect with your friends!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}              
              </>
            )}
          </>
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
                value={this.getSelectedTab()}
                // onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {this.state.friendInvitationsSentToMe.length > 0 || mobileValue === 'requests' ? (
                  <Tab
                    classes={{ root: classes.navigationTab }}
                    value="requests"
                    label="Requests"
                    onClick={() => {
                      this.handleNavigation('/friends/requests');
                    }}
                  />
                ) : (
                  null
                )}
                {this.state.suggestedFriendList.length > 0 || mobileValue === 'suggested' ? (
                  <Tab
                    classes={{ root: classes.navigationTab }}
                    value="suggested"
                    label="Suggested"
                    onClick={() => {
                      this.handleNavigation('/friends/suggested');
                    }}
                  />
                ) : (
                  null
                )}
                <Tab
                  classes={{ root: classes.navigationTab }}
                  value="invite"
                  label={window.innerWidth > 500 ? "Add Friends" : "Invite"}
                  onClick={() => {
                    this.handleNavigation('/friends/invite');
                  }}
                />
                {this.state.currentFriends.length > 0 || mobileValue === 'current' ? (
                  <Tab
                    classes={{ root: classes.navigationTab }}
                    value="current"
                    label="Friends"
                    onClick={() => {
                      this.handleNavigation('/friends/current');
                    }}
                  />
                ) : (
                  null
                )}
                {this.state.friendInvitationsSentByMe.length > 0 || mobileValue === 'sent-requests' ? (
                  <Tab
                    classes={{ root: classes.navigationTab }}
                    value="sent-requests"
                    label="Sent Requests"
                    onClick={() => {
                      this.handleNavigation('/friends/sent-requests');
                    }}
                  />
                ) : (
                  null
                )}
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
  navigationTab: {
    minWidth: '0px !important',
    width: 'fit-content !important',
    height: '40px !important',
    maxHeight: '40px !important',
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

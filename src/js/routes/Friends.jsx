import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Tabs from '@material-ui/core/esm/Tabs';
import Tab from '@material-ui/core/esm/Tab';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/esm/Tooltip';
import { withStyles } from '@material-ui/core/esm/styles';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import FirstAndLastNameRequiredAlert from '../components/Widgets/FirstAndLastNameRequiredAlert';
import FriendActions from '../actions/FriendActions';
import FriendInvitationsSentByMePreview from '../components/Friends/FriendInvitationsSentByMePreview';
import FriendInvitationsSentToMePreview from '../components/Friends/FriendInvitationsSentToMePreview';
import FriendStore from '../stores/FriendStore';
import FriendsCurrentPreview from '../components/Friends/FriendsCurrentPreview';
import isMobileScreenSize from '../utils/isMobileScreenSize';
import FriendsPromoBox from '../components/Friends/FriendsPromoBox';
import SuggestedFriendsPreview from '../components/Friends/SuggestedFriendsPreview';
import TwitterSignInCard from '../components/Twitter/TwitterSignInCard';
import VoterStore from '../stores/VoterStore';
import testimonialImage from '../../img/global/photos/Dale_McGrew-200x200.jpg';
import { cordovaDot, historyPush, isWebApp } from '../utils/cordovaUtils';
import FriendInvitationsSentToMe from './Friends/FriendInvitationsSentToMe';
import SuggestedFriends from './Friends/SuggestedFriends';
import FriendsCurrent from './Friends/FriendsCurrent';
import InviteByEmail from './Friends/InviteByEmail';
import FriendInvitationsSentByMe from './Friends/FriendInvitationsSentByMe';
import MessageCard from '../components/Widgets/MessageCard';
import AppStore from '../stores/AppStore';
import { cordovaBallotFilterTopMargin } from '../utils/cordovaOffsets';
import displayFriendsTabs from '../utils/displayFriendsTabs';

const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = cordovaDot(testimonialImage);
const testimonial = 'Instead of sending my friends a list of who they should vote for, I can add them as friends on We Vote.';

class Friends extends Component {
  static getDerivedStateFromProps (props, state) {
    const { defaultTabItem } = state;
    // console.log('Friends getDerivedStateFromProps defaultTabItem:', defaultTabItem, ', this.props.params.tabItem:', props.params.tabItem);
    // We only redirect when in mobile mode (when "displayFriendsTabs()" is true), a tab param has not been passed in, and we have a defaultTab specified
    // This solves an edge case where you re-click the Friends Footer tab when you are in the friends section
    if (displayFriendsTabs() && props.params.tabItem === undefined && defaultTabItem) {
      historyPush(`/friends/${defaultTabItem}`);
    }
    return null;
  }

  static propTypes = {
    classes: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      currentFriends: [],
      defaultTabItem: '',
      friendInvitationsSentByMe: [],
      friendInvitationsSentToMe: [],
      friendsHeaderUnpinned: false,
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    // console.log('Friends componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    FriendActions.currentFriends();
    FriendActions.friendInvitationsSentToMe();
    FriendActions.friendInvitationsSentByMe();
    FriendActions.suggestedFriendList();
    const friendInvitationsSentByMe = FriendStore.friendInvitationsSentByMe();
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const suggestedFriendList = FriendStore.suggestedFriendList();

    this.setState({
      currentFriends: FriendStore.currentFriends(),
      friendInvitationsSentToMe,
      friendInvitationsSentByMe,
      suggestedFriendList,
      voter: VoterStore.getVoter(),
    });
    this.resetDefaultTabForMobile(friendInvitationsSentToMe, suggestedFriendList, friendInvitationsSentByMe);
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.friendStoreListener.remove();
    this.appStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onFriendStoreChange () {
    const { currentFriends, friendInvitationsSentByMe, friendInvitationsSentToMe, suggestedFriendList } = this.state;
    if (currentFriends.length !== FriendStore.currentFriends().length) {
      this.setState({ currentFriends: FriendStore.currentFriends() });
      // console.log('currentFriends has changed');
    }
    if (friendInvitationsSentByMe.length !== FriendStore.friendInvitationsSentByMe().length) {
      this.setState({ friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe() });
      // console.log('friendInvitationsSentByMe has changed');
      this.resetDefaultTabForMobile(FriendStore.friendInvitationsSentToMe(), FriendStore.suggestedFriendList(), FriendStore.friendInvitationsSentByMe());
    }
    if (friendInvitationsSentToMe.length !== FriendStore.friendInvitationsSentToMe().length) {
      this.setState({ friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe() });
      // console.log('friendInvitationsSentToMe has changed');
      this.resetDefaultTabForMobile(FriendStore.friendInvitationsSentToMe(), FriendStore.suggestedFriendList(), FriendStore.friendInvitationsSentByMe());
    }
    if (suggestedFriendList.length !== FriendStore.suggestedFriendList().length) {
      this.setState({ suggestedFriendList: FriendStore.suggestedFriendList() });
      // console.log('suggestedFriends has changed');
      this.resetDefaultTabForMobile(FriendStore.friendInvitationsSentToMe(), FriendStore.suggestedFriendList(), FriendStore.friendInvitationsSentByMe());
    }
  }

  onAppStoreChange () {
    this.setState({
      friendsHeaderUnpinned: AppStore.getScrolledDown(),
    });
  }

  getSelectedTab () {
    const { currentFriends, defaultTabItem, friendInvitationsSentByMe, friendInvitationsSentToMe, suggestedFriendList } = this.state;
    // console.log('getSelectedTab this.props.params.tabItem:', this.props.params.tabItem, ', defaultTabItem:', defaultTabItem);
    let selectedTab = this.props.params.tabItem || defaultTabItem;
    // Don't return a selected tab if the tab isn't available
    if (String(selectedTab) === 'requests') {
      if (friendInvitationsSentToMe.length < 1) {
        selectedTab = 'invite';
      }
    } else if (String(selectedTab) === 'suggested') {
      if (suggestedFriendList.length < 1) {
        selectedTab = 'invite';
      }
    } else if (String(selectedTab) === 'friends') {
      if (currentFriends.length < 1) {
        selectedTab = 'invite';
      }
    } else if (String(selectedTab) === 'sent-requests') {
      if (friendInvitationsSentByMe.length < 1) {
        selectedTab = 'invite';
      }
    }
    return selectedTab;
  }

  handleNavigation = to => historyPush(to);

  resetDefaultTabForMobile (friendInvitationsSentToMe, suggestedFriendList, friendInvitationsSentByMe) {
    let defaultTabItem;
    if (this.props.params.tabItem) {
      // If the voter is directed to a friends tab, make that the default
      defaultTabItem = this.props.params.tabItem;
    } else if (friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0) {
      defaultTabItem = 'requests';
    } else if (suggestedFriendList && suggestedFriendList.length > 0) {
      defaultTabItem = 'suggested';
    } else if (friendInvitationsSentByMe && friendInvitationsSentByMe.length > 0) {
      defaultTabItem = 'sent-requests';
    } else {
      defaultTabItem = 'invite';
    }
    this.setState({ defaultTabItem });
    // console.log('resetDefaultTabForMobile defaultTabItem:', defaultTabItem, ', this.props.params.tabItem:', this.props.params.tabItem);
    // We only redirect when in mobile mode, when "displayFriendsTabs()" is true
    if (displayFriendsTabs() && defaultTabItem !== this.props.params.tabItem) {
      this.handleNavigation(`/friends/${defaultTabItem}`);
    }
  }

  render () {
    renderLog('Friends');  // Set LOG_RENDER_EVENTS to log all renders
    const { currentFriends, friendsHeaderUnpinned, friendInvitationsSentByMe, friendInvitationsSentToMe, suggestedFriendList, voter } = this.state;
    const { classes } = this.props;

    // console.log('friendsHeaderUnpinned', friendsHeaderUnpinned);

    if (!voter) {
      return LoadingWheel;
    }
    const { is_signed_in: voterIsSignedIn } = voter;

    let mobileContentToDisplay;
    let desktopContentToDisplay;
    const friendActivityExists = currentFriends.length || friendInvitationsSentByMe.length || friendInvitationsSentToMe.length || suggestedFriendList.length;

    // Generate mobileContentToDisplay
    switch (this.props.params.tabItem) {
      case 'requests':
        mobileContentToDisplay = (
          <>
            {friendInvitationsSentToMe.length > 0 ? (
              <FriendInvitationsSentToMe />
            ) : (
              <>
                {suggestedFriendList.length > 0 ? (
                  <MessageCard
                    mainText="You have no incoming friend requests. Check out people you may know."
                    buttonText="View Suggested Friends"
                    buttonURL="/friends/suggested"
                  />
                ) : (
                  <MessageCard
                    mainText="You have no incoming friend requests. Send some invites to connect with your friends!"
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
            {suggestedFriendList.length > 0 ? (
              <>
                {voterIsSignedIn && (
                  <FirstAndLastNameRequiredAlert />
                )}
                <SuggestedFriends />
              </>
            ) : (
              <>
                {friendInvitationsSentToMe.length > 0 ? (
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
            {voterIsSignedIn && (
              <FirstAndLastNameRequiredAlert />
            )}
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
            {currentFriends.length > 0 ? (
              <FriendsCurrent />
            ) : (
              <>
                {friendInvitationsSentToMe.length > 0 ? (
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
            {friendInvitationsSentByMe.length > 0 ? (
              <FriendInvitationsSentByMe />
            ) : (
              <MessageCard
                mainText="Invite more friends now!"
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
            {friendInvitationsSentToMe.length > 0 ? (
              <FriendInvitationsSentToMe />
            ) : (
              <>
                {suggestedFriendList.length > 0 ? (
                  <MessageCard
                    mainText="You have no incoming friend requests. Check out your suggested friends."
                    buttonText="View Suggested Friends"
                    buttonURL="/friends/suggested"
                  />
                ) : (
                  <MessageCard
                    mainText="You have no incoming friend requests. Send some invites to connect with your friends!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}
              </>
            )}
          </>
        );
    }

    // Generate desktopContentToDisplay
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
                <>
                  {voterIsSignedIn && (
                    <FirstAndLastNameRequiredAlert />
                  )}
                  {!(friendActivityExists) && (
                    <InviteByEmail />
                  )}
                  <FriendInvitationsSentToMePreview />
                  <SuggestedFriendsPreview />
                  <FriendsCurrentPreview />
                  {voter.signed_in_twitter ? null : (
                    <div className="u-show-mobile">
                      <TwitterSignInCard />
                    </div>
                  )}
                  {voterIsSignedIn && (
                    <FriendInvitationsSentByMePreview />
                  )}
                </>
              </div>
              <div className="col-md-12 col-lg-4 d-none d-md-block">
                {!!(voterIsSignedIn && friendActivityExists) && (
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
                )}
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

    const tabsHTML = (
      <Tabs
        value={this.getSelectedTab()}
        // onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {friendInvitationsSentToMe.length > 0 && (
          <Tab
            classes={{ root: classes.navigationTab }}
            value="requests"
            label="Requests"
            onClick={() => {
              this.handleNavigation('/friends/requests');
            }}
          />
        )}
        {suggestedFriendList.length > 0 && (
          <Tab
            classes={{ root: classes.navigationTab }}
            value="suggested"
            label="Suggested"
            onClick={() => {
              this.handleNavigation('/friends/suggested');
            }}
          />
        )}
        <Tab
          classes={{ root: classes.navigationTab }}
          value="invite"
          label={isMobileScreenSize() ? 'Invite' : 'Invite Friends'}
          onClick={() => {
            this.handleNavigation('/friends/invite');
          }}
        />
        {currentFriends.length > 0 && (
          <Tab
            classes={{ root: classes.navigationTab }}
            value="current"
            label="Friends"
            onClick={() => {
              this.handleNavigation('/friends/current');
            }}
          />
        )}
        {friendInvitationsSentByMe.length > 0 && (
          <Tab
            classes={{ root: classes.navigationTab }}
            value="sent-requests"
            label="Requests Sent"
            onClick={() => {
              this.handleNavigation('/friends/sent-requests');
            }}
          />
        )}
      </Tabs>
    );

    return (
      <span>
        {displayFriendsTabs() ? (
          <>
            <div className={`friends__heading ${friendsHeaderUnpinned && isWebApp() ? 'friends__heading__unpinned' : ''}`}>
              <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <Helmet title="Friends - We Vote" />
                      {tabsHTML}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
              <div className="container-fluid">
                <Wrapper>
                  {mobileContentToDisplay}
                </Wrapper>
              </div>
            </div>
          </>
        ) : (
          <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
            <div className="container-fluid">
              <div className="container-main">
                {desktopContentToDisplay}
              </div>
            </div>
          </div>
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

const Wrapper = styled.div`
  padding-top: 60px;
  padding-bottom: 90px;
`;

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

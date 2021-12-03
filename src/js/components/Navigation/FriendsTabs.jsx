import { Tab, Tabs } from '@material-ui/core';
import { styled as muiStyled } from '@material-ui/styles';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import historyPush from '../../common/utils/historyPush';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import { normalizedHref } from '../../utils/hrefUtils';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';


class FriendsTabs extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      defaultTabItem: '',
      friendInvitationsSentByMe: [],
      friendInvitationsSentToMe: [],
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    // console.log('FriendsTabs componentDidMount');
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    FriendActions.currentFriends();
    FriendActions.friendInvitationsSentToMe();
    FriendActions.friendInvitationsSentByMe();
    FriendActions.suggestedFriendList();
    const friendInvitationsSentByMe = FriendStore.friendInvitationsSentByMe();
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);

    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      currentFriendList,
      friendInvitationsSentToMe,
      friendInvitationsSentByMe,
      suggestedFriendList,
    });
    this.resetDefaultTabForMobile(friendInvitationsSentToMe, suggestedFriendList, friendInvitationsSentByMe);
    ActivityActions.activityNoticeListRetrieve();
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    let {
      currentFriendList,
      friendInvitationsSentByMe, friendInvitationsSentToMe, suggestedFriendList,
    } = this.state;
    let resetDefaultTab = false;
    if (currentFriendList && currentFriendList.length !== FriendStore.currentFriends().length) {
      const currentFriendListUnsorted = FriendStore.currentFriends();
      currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
      this.setState({ currentFriendList });
      // console.log('currentFriendList has changed, currentFriendList:', currentFriendList);
    }
    if (friendInvitationsSentByMe && friendInvitationsSentByMe.length !== FriendStore.friendInvitationsSentByMe().length) {
      friendInvitationsSentByMe = FriendStore.friendInvitationsSentByMe();
      this.setState({ friendInvitationsSentByMe });
      // console.log('friendInvitationsSentByMe has changed, friendInvitationsSentByMe:', friendInvitationsSentByMe);
      resetDefaultTab = true;
    }
    if (friendInvitationsSentToMe && friendInvitationsSentToMe.length !== FriendStore.friendInvitationsSentToMe().length) {
      friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
      this.setState({ friendInvitationsSentToMe });
      // console.log('friendInvitationsSentToMe has changed, friendInvitationsSentToMe:', friendInvitationsSentToMe);
      resetDefaultTab = true;
    }
    if (suggestedFriendList && suggestedFriendList.length !== FriendStore.suggestedFriendList().length) {
      const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
      suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
      this.setState({ suggestedFriendList });
      // console.log('suggestedFriends has changed, suggestedFriendList:', suggestedFriendList);
      resetDefaultTab = true;
    }
    if (resetDefaultTab) {
      this.resetDefaultTabForMobile(FriendStore.friendInvitationsSentToMe(), FriendStore.suggestedFriendList(), FriendStore.friendInvitationsSentByMe());
    }
  }

  getSelectedTab () {
    const tabItem = this.getPageFromUrl();
    const { currentFriendList, defaultTabItem, friendInvitationsSentByMe, friendInvitationsSentToMe, suggestedFriendList } = this.state;
    // console.log('getSelectedTab tabItem:', tabItem, ', defaultTabItem:', defaultTabItem);
    let selectedTab = tabItem || defaultTabItem;

    if (selectedTab === 'request') selectedTab = 'sent-requests';   /// Hack Oct 17, 2021

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
      if (currentFriendList.length < 1) {
        selectedTab = 'invite';
      }
    } else if (String(selectedTab) === 'sent-requests') {
      if (friendInvitationsSentByMe.length < 1) {
        selectedTab = 'invite';
      }
    }
    return selectedTab;
  }

  handleNavigation = (to) => historyPush(to);

  getPageFromUrl () {
    const href = normalizedHref();
    // console.log('------------ in FriendsTabs getPageFromUrl', href);
    if (href === '/friends') {
      // console.log('------------ in FriendsTabs tabItem: invite');
      return 'invite';
    }
    return href.replace('/friends/', '');
  }

  resetDefaultTabForMobile (friendInvitationsSentToMe, suggestedFriendList, friendInvitationsSentByMe) {
    const tabItem = this.getPageFromUrl();

    let defaultTabItem;
    if (tabItem) {
      // If the voter is directed to a friends tab, make that the default
      defaultTabItem = tabItem;
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
    // console.log('resetDefaultTabForMobile defaultTabItem:', defaultTabItem, ', tabItem:', tabItem);
    // We only redirect when in mobile mode, when "displayFriendsTabs()" is true
    if (displayFriendsTabs() && defaultTabItem !== tabItem) {
      this.handleNavigation(`/friends/${defaultTabItem}`);
    }
  }

  render () {
    renderLog('FriendsTabs');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      currentFriendList, friendInvitationsSentByMe,
      friendInvitationsSentToMe, suggestedFriendList, /* voter, */
    } = this.state;

    return (
      <div className="row" id="friendsHorizontalMenu">
        <div className="col-md-12">
          <Helmet title="Friends - We Vote" />
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
              <FriendsNavTab
                value="requests"
                label="Requests"
                onClick={() => {
                  this.handleNavigation('/friends/requests');
                }}
              />
            )}
            {suggestedFriendList.length > 0 && (
              <FriendsNavTab
                value="suggested"
                label="Suggested"
                onClick={() => {
                  this.handleNavigation('/friends/suggested');
                }}
              />
            )}
            <FriendsNavTab
              value="invite"
              label={isMobileScreenSize() ? 'Invite' : 'Invite Friends'}
              onClick={() => {
                this.handleNavigation('/friends/invite');
              }}
            />
            {currentFriendList.length > 0 && (
              <FriendsNavTab
                value="current"
                label="Friends"
                onClick={() => {
                  this.handleNavigation('/friends/current');
                }}
              />
            )}
            {friendInvitationsSentByMe.length > 0 && (
              <FriendsNavTab
                value="sent-requests"
                label="Requests Sent"
                onClick={() => {
                  this.handleNavigation('/friends/sent-requests');
                }}
              />
            )}
          </Tabs>
        </div>
      </div>
    );
  }
}

// Styled Mui Component, Tab example:
const FriendsNavTab = muiStyled(Tab)({
  minWidth: '0px !important',
  width: 'fit-content !important',
  height: '40px !important',
  maxHeight: '40px !important',
});

export default FriendsTabs;

import { Badge, Tab, Tabs } from '@mui/material';
import { styled as muiStyled } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { isIPhoneMiniOrSmaller } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';


class FriendsTabs extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      defaultTabItem: 'requests',
      friendInvitationsSentByMe: [],
      friendInvitationsSentToMe: [],
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    // console.log('FriendsTabs componentDidMount');
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
    }
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
    this.resetDefaultTabForMobile();
    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }
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
      this.resetDefaultTabForMobile();
    }
  }

  getSelectedTab () {
    const tabItem = this.getPageFromUrl();
    const { defaultTabItem } = this.state;
    let selectedTab = tabItem || defaultTabItem;

    if (selectedTab === 'request') selectedTab = 'sent-requests';   /// Hack Oct 17, 2021
    if (selectedTab === 'sent-requests') selectedTab = 'requests';
    if (selectedTab === 'all') selectedTab = 'requests';

    // console.log('getSelectedTab tabItem:', tabItem, ', defaultTabItem:', defaultTabItem, ', selectedTab:', selectedTab);
    return selectedTab;
  }

  handleNavigation = (to) => historyPush(to);

  getPageFromUrl () {
    const href = normalizedHref();
    // console.log('------------ in FriendsTabs getPageFromUrl', href);
    if (href === '/friends') {
      // console.log('------------ in FriendsTabs tabItem: invite');
      return 'requests';
    }
    return href.replace('/friends/', '');
  }

  resetDefaultTabForMobile () {
    const tabItem = this.getPageFromUrl();

    let defaultTabItem;
    if (tabItem) {
      // If the voter is directed to a friends tab, make that the default
      defaultTabItem = tabItem;
    } else {
      defaultTabItem = 'requests';
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
    const { classes } = this.props;
    const { friendInvitationsSentToMe } = this.state;

    return (
      <div className="row" id="friendsHorizontalMenu">
        <div className="col-md-12">
          <Tabs
            value={this.getSelectedTab()}
            // onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <RequestsNavTab
              value="requests"
              label={(
                <>
                  {friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 ? (
                    <Badge
                      badgeContent={friendInvitationsSentToMe.length}
                      classes={{ badge: classes.headerBadge }}
                      color="primary"
                      max={9}
                    >
                      Requests
                      {isWebApp() && '&nbsp;&nbsp;'}
                    </Badge>
                  ) : (
                    <>Requests</>
                  )}
                </>
              )}
              onClick={() => {
                this.handleNavigation('/friends/requests');
              }}
            />
            <FriendsNavTab
              value="suggested"
              label="Suggested"
              onClick={() => {
                this.handleNavigation('/friends/suggested');
              }}
            />
            {this.getSelectedTab() === 'invite' && (
              <FriendsNavTab
                value="invite"
                label={isMobileScreenSize() ? (
                  <>
                    Invite
                  </>
                ) : (
                  <span className="u-no-break">
                    Invite Friends
                  </span>
                )}
                onClick={() => {
                  this.handleNavigation('/friends/invite');
                }}
              />
            )}
            <FriendsNavTab
              value="current"
              label={isMobileScreenSize() ? (
                <>
                  Friends
                </>
              ) : (
                <span className="u-no-break">
                  Your Friends
                </span>
              )}
              onClick={() => {
                this.handleNavigation('/friends/current');
              }}
            />
            <FriendsNavTab
              value="remind"
              label={isMobileScreenSize() ? (
                <>
                  Remind
                </>
              ) : (
                <span className="u-no-break">
                  Remind Contacts
                </span>
              )}
              onClick={() => {
                this.handleNavigation('/friends/remind');
              }}
            />
          </Tabs>
        </div>
      </div>
    );
  }
}
FriendsTabs.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  headerBadge: {
    // backgroundColor: 'rgba(250, 62, 62)',
    fontSize: 10,
    right: 0,
    top: 11,
  },
});

/* eslint-disable no-nested-ternary */
const FriendsNavTab = styled(Tab)`
  min-width: 0 !important;
  height: 40px !important;
  max-height: 40px !important;
  width: ${() => (isIPhoneMiniOrSmaller() ? '80px !important' : (isMobileScreenSize() ? '90px !important' : 'fit-content !important'))};
`;


// Styled Mui Component, Tab example:
// eslint-disable-next-line no-nested-ternary
// const FriendsNavTab = muiStyled(Tab)(isIPhoneMiniOrSmaller() ? {
//   minWidth: '0px !important',
//   width: '80px !important',
//   height: '40px !important',
//   maxHeight: '40px !important',
// } : (isMobileScreenSize() ? {
//   minWidth: '0px !important',
//   width: '90px !important',
//   height: '40px !important',
//   maxHeight: '40px !important',
// } : {
//   minWidth: '0px !important',
//   width: 'fit-content !important',
//   height: '40px !important',
//   maxHeight: '40px !important',
// }));

const RequestsNavTab = muiStyled(Tab)({
  minWidth: '0px !important',
  width: 'fit-content !important',
  height: '40px !important',
  maxHeight: '40px !important',
});

export default withStyles(styles)(FriendsTabs);

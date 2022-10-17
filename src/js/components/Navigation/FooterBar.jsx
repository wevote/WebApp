import { Home, HowToVote, Info, People, QuestionAnswer, VerifiedUser } from '@mui/icons-material';
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { isAndroid, isIOS } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFooterHeight } from '../../utils/cordovaOffsets';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';


class FooterBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMeCount: 0,
      // inPrivateLabelMode: false, // setState onAppObservableStoreChange is not working sometimes for some reason
      showingOneCompleteYourProfileModal: false,
      showSignInModal: false,
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSharedItemModal = AppObservableStore.showSharedItemModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const friendInvitationsSentToMeCount = (friendInvitationsSentToMe) ? friendInvitationsSentToMe.length : 0;
    this.setState({
      friendInvitationsSentToMeCount,
      // inPrivateLabelMode: AppObservableStore.getHideWeVoteLogo(), // Using this setting temporarily // setState onAppObservableStoreChange is not working sometimes for some reason

      showingOneCompleteYourProfileModal,
      showShareModal,
      showSharedItemModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const showActivityTidbitDrawer = AppObservableStore.showActivityTidbitDrawer();
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSharedItemModal = AppObservableStore.showSharedItemModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    this.setState({
      // inPrivateLabelMode: AppObservableStore.getHideWeVoteLogo(), // Using this setting temporarily // setState onAppObservableStoreChange is not working sometimes for some reason
      showActivityTidbitDrawer,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSharedItemModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  onFriendStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('FooterBar, onFriendStoreChange');
      const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
      const friendInvitationsSentToMeCount = (friendInvitationsSentToMe) ? friendInvitationsSentToMe.length : 0;
      this.setState({
        friendInvitationsSentToMeCount,
      });
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in || false;
    this.setState({
      voterIsSignedIn,
    });
  }

  handleChange = (event, value) => {
    if (isCordova()) {
      const { impact } = window.TapticEngine;
      impact({
        style: 'heavy', // light | medium | heavy
      });
    }
    // In browser mobile, we can offer donate footer link
    // In Cordova, we cannot currently offer donate footer link
    // If NOT signed in, turn Discuss off and How It Works on
    // Regardless of whether visible or not the option's numerical position remains the same
    switch (value) {
      case 0:
        return historyPush('/ready');
      case 1:
        return historyPush('/ballot');
      case 2:
        return historyPush('/friends');
      case 3:
        return historyPush('/news');
      case 4:
        return historyPush('/more/donate');
      case 5:
        return this.openHowItWorksModal();
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const pathname = normalizedHref();
    if (pathname === '/') return 0;  // readyLight has no path
    if (stringContains('/ready', pathname.toLowerCase())) return 0;
    if (stringContains('/ballot', pathname.toLowerCase())) return 1;
    if (stringContains('/friends', pathname.toLowerCase())) return 2;
    if (stringContains('/news', pathname.toLowerCase())) return 3;
    if (stringContains('/more/donate', pathname.toLowerCase())) return 4;
    return -1;
  };

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

  render () {
    renderLog('FooterBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      friendInvitationsSentToMeCount,
      showActivityTidbitDrawer, showingOneCompleteYourProfileModal, showShareModal,
      showSharedItemModal, showSignInModal, showVoterPlanModal, voterIsSignedIn,
    } = this.state;
    const inPrivateLabelMode = AppObservableStore.getHideWeVoteLogo(); // setState onAppObservableStoreChange is not working sometimes for some reason
    // const badgeStyle = {
    //   display: 'inline-block',
    // };
    const hideFooterBehindModal = showActivityTidbitDrawer || showingOneCompleteYourProfileModal || showShareModal || showSharedItemModal || showSignInModal || showVoterPlanModal;
    const bigIcons = {
      '& .MuiBottomNavigationAction-root.Mui-selected, svg': {
        fontSize: 37,
      },
      '& .MuiBottomNavigationAction-label.Mui-selected': {
        fontSize: 18,
      },
      '& .MuiBottomNavigationAction-root, svg': {
        fontSize: 35,
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: 16,
      },
    };

    // console.log('friendInvitationsSentToMeCount:', friendInvitationsSentToMeCount);
    // If NOT signed in, turn Discuss off and How It Works on
    let discussVisible;
    let donateVisible;
    let howItWorksVisible;
    if (isCordova() || inPrivateLabelMode) {
      discussVisible = true;
      donateVisible = false;
      howItWorksVisible = true;
    } else if (voterIsSignedIn) {
      // If signed in, turn Discuss on, and How It Works off
      discussVisible = true;
      donateVisible = true;
      howItWorksVisible = false;
    } else {
      discussVisible = false;
      donateVisible = true;
      howItWorksVisible = true;
    }
    return (
      <FooterBarWrapper>
        <div
          className={`footer-container u-show-mobile-tablet ${hideFooterBehindModal ? ' u-z-index-1000' : ' u-z-index-9000'}`}
          style={cordovaFooterHeight()}
        >
          <BottomNavigation
            value={this.getSelectedTab()}
            onChange={this.handleChange}
            showLabels
            style={{ width: `${isIOS() ? '95%' : ''}`, height: `${isAndroid() ? '70px' : ''}`  }}
          >
            <BottomNavigationAction className="no-outline" id="readyTabFooterBar" label="Home" showLabel icon={<Home />} sx={bigIcons} />
            <BottomNavigationAction className="no-outline" id="ballotTabFooterBar" label="Ballot" showLabel icon={<HowToVote />} sx={bigIcons} />
            <BottomNavigationAction
              className="no-outline"
              id="friendsTabFooterBar"
              label="Friends"
              showLabel
              sx={bigIcons}
              icon={friendInvitationsSentToMeCount > 0 ? (
                <Badge
                  badgeContent={<BadgeCountWrapper>{friendInvitationsSentToMeCount}</BadgeCountWrapper>}
                  classes={{
                    badge: classes.footerFriendsNotificationBadge,
                  }}
                  color="primary"
                  max={9}
                  style={{
                    fontSize: 10,
                    right: 0,
                    top: 4,
                  }}
                >
                  <People />
                </Badge>
              ) : (
                <People />
              )}
            />
            {discussVisible && (
              <BottomNavigationAction className="no-outline" id="newsTabFooterBar" label="Discuss" showLabel icon={<QuestionAnswer />} sx={bigIcons} />
            )}
            {donateVisible && (
              <BottomNavigationAction className="no-outline" id="donateTabFooterBar" label="Donate" showLabel icon={<VerifiedUser />} sx={bigIcons} />
            )}
            {howItWorksVisible && (
              <BottomNavigationAction
                className="no-outline u-no-break"
                id="howItWorksFooterBar"
                label={isMobileScreenSize() ? 'Intro' : 'How It Works'}
                showLabel
                icon={<Info />}
                sx={bigIcons}
              />
            )}
          </BottomNavigation>
        </div>
      </FooterBarWrapper>
    );
  }
}
FooterBar.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  footerFriendsNotificationBadge: {
    backgroundColor: 'rgba(250, 62, 62)',
    fontSize: 10,
    height: 15,
    marginRight: 0,
    marginTop: 5,
    minWidth: 15,
    width: 15,
  },
});

const BadgeCountWrapper = styled('span')(({ theme }) => (`
  display: flex;
  justify-content: center;
  margin-bottom: 3px;
  padding-top: 0;
  ${theme.breakpoints.down('md')} {
    padding-top: 1px;
  }
`));

const FooterBarWrapper = styled('div')`
  @media print{
    display: none;
  }
`;

export default withStyles(styles)(FooterBar);

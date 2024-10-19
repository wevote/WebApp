import { Groups, Home, HowToVote, Info, People, QuestionAnswer, VerifiedUser } from '@mui/icons-material';
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import { isIOS } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isAndroid, isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import stringContains from '../../common/utils/stringContains';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFooterHeight } from '../../utils/cordovaOffsets';
// import webAppConfig from '../../config';

// It's not ideal to have two images, but this is a complex svg, and I couldn't figure out how to change the fill color with a variable
const capitalBuilding = '/img/global/svg-icons/capital-building.svg';
const capitalBuildingSelected = '/img/global/svg-icons/capital-building-selected.svg';
// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

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
        return historyPush('/cs/');
      case 3:
        return historyPush('/friends');
      case 4:
        return historyPush('/challenges');  // was "/squads"
      case 5:
        return historyPush('/news');
      case 6:
        return historyPush('/donate');
      case 7:
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
    if (pathname.toLowerCase().endsWith('/cs/')) return 2;
    if (stringContains('/friends', pathname.toLowerCase())) return 3;
    if (stringContains('/challenges', pathname.toLowerCase())) return 4;
    if (stringContains('/+/', pathname)) return 4;
    if (stringContains('/squads', pathname.toLowerCase())) return 4;
    if (stringContains('/news', pathname.toLowerCase())) return 5;
    if (stringContains('/donate', pathname.toLowerCase())) return 6;
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
    const defaultIconStyles = {
      '& .MuiBottomNavigationAction-root.Mui-selected, svg': {
        fontSize: 37,
      },
      '& .MuiBottomNavigationAction-label.Mui-selected': {
        fontSize: 16,
        fontWeight: 600,
      },
      '& .MuiBottomNavigationAction-root, svg': {
        fontSize: 35,
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: 16,
      },
    };
    const donateIconStyles = {
      '& .MuiBottomNavigationAction-root.Mui-selected, svg': {
        fontSize: 32,
      },
      '& .MuiBottomNavigationAction-label.Mui-selected': {
        fontSize: 16,
        fontWeight: 600,
      },
      '& .MuiBottomNavigationAction-root, svg': {
        fontSize: 30,
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: 16,
        marginBottom: '-4px',
      },
    };
    const groupsIconStyles = {
      '& .MuiBottomNavigationAction-root.Mui-selected, svg': {
        fontSize: 44,
      },
      '& .MuiBottomNavigationAction-label.Mui-selected': {
        fontSize: 16,
        fontWeight: 600,
        marginBottom: '4px',
        marginTop: '-5px',
      },
      '& .MuiBottomNavigationAction-root, svg': {
        fontSize: 42,
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: 16,
        marginBottom: '3px',
        marginTop: '-5px',
      },
    };

    // console.log('friendInvitationsSentToMeCount:', friendInvitationsSentToMeCount);
    // If NOT signed in, turn Discuss off and How It Works on
    let discussVisible;
    let donateVisible;
    const friendsVisible = false; // 2023-09-04 Dale We are turning off Friends footer icon for now
    const squadsVisible = isWebApp();
    // const squadsVisible = false;
    // let howItWorksVisible;
    const howItWorksVisible = false;
    if (isCordova() || inPrivateLabelMode) {
      discussVisible = false; // 2023-09-04 Dale We are turning off Discuss footer icon for now
      donateVisible = false;  // Can't have donations in iOS
      // howItWorksVisible = true;
    } else if (voterIsSignedIn) {
      // If signed in, turn Discuss on, and How It Works off
      discussVisible = false; // 2023-09-04 Dale We are turning off Discuss footer icon for now
      donateVisible = true;
      // howItWorksVisible = false;
    } else {
      discussVisible = false;
      donateVisible = true; // 2022-12 Donate not used for now
      // howItWorksVisible = true;
    }
    return (
      <FooterBarWrapper>
        <FooterContainer
          className={`u-show-mobile-tablet ${hideFooterBehindModal ? ' u-z-index-1000' : ' u-z-index-9000'}`}
          id="footer-container"
          style={cordovaFooterHeight()}
        >
          <BottomNavigation
            value={this.getSelectedTab()}
            onChange={this.handleChange}
            showLabels
            style={{ width: `${isIOS() ? '95%' : ''}`, height: `${isAndroid() ? '70px' : ''}`  }}
          >
            <BottomNavigationAction
              className="no-outline"
              icon={<Home />}
              id="readyTabFooterBar"
              label="Home"
              showLabel
              sx={defaultIconStyles}
            />
            <BottomNavigationAction
              className="no-outline"
              icon={<HowToVote />}
              id="ballotTabFooterBar"
              label="Ballot"
              showLabel
              sx={defaultIconStyles}
              style={{
                marginLeft: '-4px',
                paddingLeft: 0,
              }}
            />
            <BottomNavigationAction
              className="no-outline"
              id="candidatesTabFooterBar"
              icon={(this.getSelectedTab() === 2) ? (
                <img
                  alt=""
                  src={normalizedImagePath(capitalBuildingSelected)}
                  style={{
                    marginTop: '-2px',
                  }}
                  width={36}
                  height={36}
                />
              ) : (
                <img
                  alt=""
                  src={normalizedImagePath(capitalBuilding)}
                  style={{
                    marginTop: '-2px',
                  }}
                  width={36}
                  height={36}
                />
              )}
              label="Candidates"
              style={{
                marginLeft: '-4px',
              }}
              showLabel
              sx={defaultIconStyles}
            />
            {friendsVisible && (
              <BottomNavigationAction
                className="no-outline"
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
                id="friendsTabFooterBar"
                label="Friends"
                showLabel
                sx={defaultIconStyles}
              />
            )}
            {squadsVisible && (
              <BottomNavigationAction
                className="no-outline"
                icon={<Groups />}
                id="squadTabFooterBar"
                label="Challenges"
                showLabel
                style={{
                  marginLeft: '4px',
                }}
                sx={groupsIconStyles}
              />
            )}
            {discussVisible && (
              <BottomNavigationAction
                className="no-outline"
                icon={<QuestionAnswer />}
                id="newsTabFooterBar"
                label="Discuss"
                showLabel
                style={{
                  paddingLeft: '0px',
                }}
                sx={defaultIconStyles}
              />
            )}
            {donateVisible && (
              <BottomNavigationAction
                className="no-outline"
                id="donateTabFooterBar"
                label="Donate"
                showLabel
                icon={<VerifiedUser />}
                sx={donateIconStyles}
              />
            )}
            {howItWorksVisible && (
              <BottomNavigationAction
                className="no-outline u-no-break"
                id="howItWorksFooterBar"
                label={isMobileScreenSize() ? 'Intro' : 'How It Works'}
                showLabel
                icon={<Info />}
                sx={defaultIconStyles}
              />
            )}
          </BottomNavigation>
        </FooterContainer>
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

const FooterContainer = styled('div')`
  background: #fff;
  border-top: 1px solid #eee;
  bottom: 0;
  box-shadow: 0 -4px 4px -1px rgba(0, 0, 0, 0.2), 0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: 0;
  position: fixed;
  width: 100%;
  left: 0;
`;

export default withStyles(styles)(FooterBar);

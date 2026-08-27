import { Article, CalendarMonth, Groups, Home, HowToVote, Info, MoreHoriz, People, QuestionAnswer, Support, VerifiedUser } from '@mui/icons-material';
import { Badge, BottomNavigation, BottomNavigationAction, ClickAwayListener } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import DelayedLoad from '../../common/components/Widgets/DelayedLoad';
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import { isIOS } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isAndroid, isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import stringContains from '../../common/utils/stringContains';
import webAppConfig from '../../config';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFooterHeight } from '../../utils/cordovaOffsets';
import ShareButtonFooter from '../Share/ShareButtonFooter';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

// It's not ideal to have two images, but this is a complex svg, and I couldn't figure out how to change the fill color with a variable
const capitalBuilding = '/img/global/svg-icons/capital-building.svg';
const capitalBuildingSelected = '/img/global/svg-icons/capital-building-selected.svg';
const weVoteIcon = '/img/global/svg-icons/we-vote-icon-square-color-grey.svg';
const weVoteIconSelected = '/img/global/svg-icons/we-vote-icon-square-color-dark.svg';
const weVoteHelpUrl = 'https://help.wevote.us/hc/en-us';


function MoreMenuOverlay ({ anchorRef, classes, friendInvitationsSentToMeCount, onClose }) {
  const pathname = normalizedHref();
  const isAbout = pathname.includes('/more/faq');
  const isChallenges = pathname.includes('/challenges');
  const isDiscuss = pathname.includes('/news');
  const isElectionFinder = pathname.includes('/election-finder');
  const isFriends = pathname.includes('/friends');
  const isManage = pathname.includes('/manage') || pathname.includes('/no-candidates-claimed');

  // Ignore clicks on the More anchor so the button's own onChange owns toggling.
  const handleClickAway = (event) => {
    if (anchorRef && anchorRef.current && anchorRef.current.contains(event.target)) return;
    onClose();
  };

  return (
    <ClickAwayListener disableReactTree onClickAway={handleClickAway}>
      <Overlay>
        <MenuItem id="FooterBarAbout" $active={isAbout} onClick={() => { onClose(); historyPush('/more/faq'); }}>
          <img
            alt=""
            src={isAbout ? normalizedImagePath(weVoteIconSelected) : normalizedImagePath(weVoteIcon)}
            style={{ width: 40, height: 40, marginBottom: 6 }}
          />
          About &amp; FAQ
        </MenuItem>
        <MenuItem id="FooterBarHowItWorks" onClick={() => { AppObservableStore.setShowHowItWorksModal(true); }}>
          <Info />
          How it works
        </MenuItem>
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="footerBarHelp"
            url={weVoteHelpUrl}
            target="_blank"
            trackingOn
            body={(
              <MenuItem id="FooterBarHelp" onClick={() => { onClose(); }}>
                <Support />
                Help
              </MenuItem>
            )}
          />
        </Suspense>
        {nextReleaseFeaturesEnabled && (
          <MenuItem id="FooterBarCandidatesManaging" $active={isManage} onClick={() => { onClose(); historyPush('/no-candidates-claimed'); }}>
            <img
              alt=""
              src={isManage ? '/img/global/svg-icons/capital-building-selected.svg' : '/img/global/svg-icons/capital-building.svg'}
              style={{ width: 40, height: 40, marginBottom: 6 }}
            />
            Candidates
            <br />
            I&apos;m managing
          </MenuItem>
        )}
        <MenuItem id="FooterBarElectionFinder" $active={isElectionFinder} onClick={() => { onClose(); historyPush('/election-finder'); }}>
          <CalendarMonth />
          Election Finder
        </MenuItem>
        <MenuItem id="FooterBarFriends" $active={isFriends} onClick={() => { onClose(); historyPush('/friends'); }}>
          {friendInvitationsSentToMeCount > 0 ? (
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
          Friends
        </MenuItem>
        <MenuItem id="FooterBarDiscuss" $active={isDiscuss} onClick={() => { onClose(); historyPush('/news'); }}>
          <QuestionAnswer />
          Discuss
        </MenuItem>
        {nextReleaseFeaturesEnabled && (
          <MenuItem id="FooterBarChallenges" $active={isChallenges} onClick={() => { onClose(); historyPush('/challenges'); }}>
            <Groups />
            Challenges
          </MenuItem>
        )}
        {isWebApp() && (
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute="footerLinkBlog"
              url="https://blog.wevote.us/"
              target="_blank"
              body={(
                <MenuItem id="FooterBarBlog">
                  <Article />
                  Blog
                </MenuItem>
              )}
            />
          </Suspense>
        )}
      </Overlay>
    </ClickAwayListener>
  );
}
MoreMenuOverlay.propTypes = {
  anchorRef: PropTypes.shape({ current: PropTypes.any }),
  classes: PropTypes.object.isRequired,
  friendInvitationsSentToMeCount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

class FooterBar extends React.Component {
  constructor (props) {
    super(props);
    this.anchorRef = React.createRef();
    this.state = {
      friendInvitationsSentToMeCount: 0,
      // inPrivateLabelMode: false, // setState onAppObservableStoreChange is not working sometimes for some reason
      showingOneCompleteYourProfileModal: false,
      showSignInModal: false,
      // voterIsSignedIn: false,
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
    // const voter = VoterStore.getVoter();
    // const voterIsSignedIn = voter.is_signed_in || false;
    // this.setState({
    //   voterIsSignedIn,
    // });
  }

  handleChange = (event, value) => {
    if (isCordova()) {
      const { impact } = window.TapticEngine;
      impact({
        style: 'heavy', // light | medium | heavy
      });
    }
    // In browser mobile, we can offer donate footer link
    // If NOT signed in, turn Discuss off and How It Works on
    // Regardless of whether visible or not the option's numerical position remains the same
    // console.log('FooterBar, handleChange value:', value);
    const showMoreMenuCurrentState = this.state.showMoreMenu || false;
    switch (value) {
      case 0:
        return historyPush('/ready');
      case 1:
        return historyPush('/ballot');
      case 2:
        return historyPush('/cs/');
      case 3:
        return historyPush('/donate');
      case 4:
        return this.setState({ showMoreMenu: !showMoreMenuCurrentState });
      default:
        return null;
    }
  };

  getSelectedTab = () => {
    const pathname = normalizedHref();
    const pathnameLowerCase = pathname.toLowerCase();
    if (pathname === '/') return 0;  // readyLight has no path
    if (stringContains('/ready', pathnameLowerCase)) return 0;
    if (stringContains('/ballot', pathnameLowerCase)) return 1;
    if (pathnameLowerCase.endsWith('/cs/')) return 2;
    if (stringContains('/donate', pathnameLowerCase)) return 3;
    // Treat these as "More" so the More tab stays highlighted
    if (stringContains('/managecandidates', pathnameLowerCase)) return 4;
    if (stringContains('/no-candidates-claimed', pathnameLowerCase)) return 4;
    if (stringContains('/friends', pathnameLowerCase)) return 4;
    if (stringContains('/challenges', pathnameLowerCase)) return 4;
    if (stringContains('/+/', pathname) || stringContains('/++/', pathname)) return 4;
    if (stringContains('/squads', pathnameLowerCase)) return 4;
    if (stringContains('/news', pathnameLowerCase)) return 4;
    if (stringContains('/more', pathnameLowerCase)) return 4;
    return -1;
  };

  render () {
    renderLog('FooterBar');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      friendInvitationsSentToMeCount,
      showActivityTidbitDrawer, showingOneCompleteYourProfileModal,
      showMoreMenu, showShareModal,
      showSharedItemModal, showSignInModal, showVoterPlanModal,
    } = this.state;
    const pathname = normalizedHref();
    const showShareButtonFooter = stringContains('/ballot', pathname.toLowerCase());
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

    // console.log('friendInvitationsSentToMeCount:', friendInvitationsSentToMeCount);
    // If NOT signed in, turn Discuss off and How It Works on
    let donateVisible;
    if (inPrivateLabelMode) {
      donateVisible = false; // Turn off donate link if an org has private labeled WeVote
    } else {
      donateVisible = true; // 2025-06-17 Enabling donations, we hear it is now permissible for nonprofits in iOS & Android
      // console.log('--------- Footer bar donateVisible ', donateVisible, 'squadsVisible', squadsVisible);
    }

    return (
      <FooterBarWrapperFooterBar>
        {showShareButtonFooter && (
          <DelayedLoad waitBeforeShow={3000}>
            <ShareButtonFooter />
          </DelayedLoad>
        )}
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
            <BottomNavigationAction
              className="no-outline"
              id="moreTabFooterBar"
              label="More"
              ref={this.anchorRef}
              showLabel
              icon={<MoreHoriz />}
              sx={defaultIconStyles}
            />
          </BottomNavigation>
          {showMoreMenu && (
            <MoreMenuOverlay
              anchorRef={this.anchorRef}
              classes={classes}
              friendInvitationsSentToMeCount={friendInvitationsSentToMeCount}
              onClose={() => {
                this.setState({ showMoreMenu: false });
              }}
            />
          )}
        </FooterContainer>
      </FooterBarWrapperFooterBar>
    );
  }
}
FooterBar.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  footerFriendsNotificationBadge: {
    backgroundColor: DesignTokenColors.alert400,
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

const FooterBarWrapperFooterBar = styled('div')`
  @media print{
    display: none;
  }
`;

const FooterContainer = styled('div')`
  background: ${DesignTokenColors.whiteUI}; ;
  border-top: 1px solid ${DesignTokenColors.neutralUI50};
  bottom: 0;
  box-shadow: 0 -4px 4px -1px rgba(0, 0, 0, 0.2), 0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12);
  padding-left: 0;
  position: fixed;
  width: 100%;
  left: 0;
  ${!isAndroid() ? 'padding-bottom: env(safe-area-inset-bottom)' : ''};
`;

const Overlay = styled.div`
  align-items: stretch;
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 10px;
  bottom: 56px;
  box-shadow: 0 8px 24px rgba(0,0,0,.1);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  position: fixed;
  right: 8px;
  transition: opacity .2s ease;
  z-index: 9999;
`;

const MenuItem = styled.div`
  border-radius: 10px;
  color: ${({ $active }) => ($active ? 'rgb(32, 109, 179)' : DesignTokenColors.neutralUI600)};
  cursor: pointer;
  align-items: center;
  display: inline-flex;
  flex-direction: column;
  font-size: 16px;
  justify-content: center;
  line-height: 1.2;
  min-height: 84px;
  min-width: 88px;
  padding: 8px 10px;
  text-align: center;
  svg {
    height: 40px;
    width: 40px;
    margin-bottom: 6px;
  }
  img {
    width: 40px;
  }
`;

export default withStyles(styles)(FooterBar);

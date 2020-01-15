import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppBar from '@material-ui/core/esm/AppBar';
import Toolbar from '@material-ui/core/esm/Toolbar';
import Tabs from '@material-ui/core/esm/Tabs';
import Tab from '@material-ui/core/esm/Tab';
import Button from '@material-ui/core/esm/Button';
import IconButton from '@material-ui/core/esm/IconButton';
import Tooltip from '@material-ui/core/esm/Tooltip';
import PlaceIcon from '@material-ui/icons/Place';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/esm/styles';
import Badge from '@material-ui/core/esm/Badge';
import { historyPush, isWebApp, isCordova, hasIPhoneNotch } from '../../utils/cordovaUtils';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BallotActions from '../../actions/BallotActions';
import cookies from '../../utils/cookies';
import FriendStore from '../../stores/FriendStore';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import HeaderBarLogo from './HeaderBarLogo';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import PaidAccountUpgradeModal from '../Settings/PaidAccountUpgradeModal';
import SelectBallotModal from '../Ballot/SelectBallotModal';
import SignInModal from '../Widgets/SignInModal';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import VoterStore from '../../stores/VoterStore';
import { shortenText, stringContains } from '../../utils/textFormat';
import shouldHeaderRetreat from '../../utils/shouldHeaderRetreat';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import ShareModal from '../Ballot/ShareModal';

// const webAppConfig = require('../../config');


class HeaderBar extends Component {
  static goToGetStarted () {
    const getStartedNow = '/ballot';
    historyPush(getStartedNow);
  }

  static propTypes = {
    location: PropTypes.object,
    voter: PropTypes.object,
    pathname: PropTypes.string,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      // aboutMenuOpen: false,
      chosenSiteLogoUrl: '',
      componentDidMountFinished: false,
      friendInvitationsSentToMe: 0,
      hideWeVoteLogo: false,
      paidAccountUpgradeMode: '',
      profilePopUpOpen: false,
      scrolledDown: false,
      showEditAddressButton: false,
      showSelectBallotModal: false,
      showSignInModal: false,
      showPaidAccountUpgradeModal: false,
      showShareModal: false,
      shareModalStep: 'options',
      voter: {},
      voterFirstName: '',
    };
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // this.onBallotStoreChange();

    const voterFirstName = VoterStore.getFirstName();
    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      componentDidMountFinished: true,
      chosenSiteLogoUrl: AppStore.getChosenSiteLogoUrl(),
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      hideWeVoteLogo: AppStore.getHideWeVoteLogo(),
      scrolledDown: AppStore.getScrolledDown(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
      showSignInModal: AppStore.showSignInModal(),
      voter: this.props.voter,
      voterFirstName,
      voterIsSignedIn: this.props.voter && this.props.voter.is_signed_in,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.profilePopUpOpen !== nextState.profilePopUpOpen) {
      // console.log("shouldComponentUpdate: this.state.profilePopUpOpen", this.state.profilePopUpOpen, ", nextState.profilePopUpOpen", nextState.profilePopUpOpen);
      return true;
    }
    if (this.state.aboutMenuOpen !== nextState.aboutMenuOpen) {
      // console.log("shouldComponentUpdate: this.state.aboutMenuOpen", this.state.aboutMenuOpen, ", nextState.aboutMenuOpen", nextState.aboutMenuOpen);
      return true;
    }
    if (this.state.chosenSiteLogoUrl !== nextState.chosenSiteLogoUrl) {
      // console.log("shouldComponentUpdate: this.state.chosenSiteLogoUrl", this.state.chosenSiteLogoUrl, ", nextState.chosenSiteLogoUrl", nextState.chosenSiteLogoUrl);
      return true;
    }
    if (this.state.hideWeVoteLogo !== nextState.hideWeVoteLogo) {
      // console.log("shouldComponentUpdate: this.state.hideWeVoteLogo", this.state.hideWeVoteLogo, ", nextState.hideWeVoteLogo", nextState.hideWeVoteLogo);
      return true;
    }
    if (this.state.friendInvitationsSentToMe !== nextState.friendInvitationsSentToMe) {
      // console.log("shouldComponentUpdate: this.state.friendInvitationsSentToMe", this.state.friendInvitationsSentToMe, ", nextState.friendInvitationsSentToMe", nextState.friendInvitationsSentToMe);
      return true;
    }
    if (this.state.showEditAddressButton !== nextState.showEditAddressButton) {
      return true;
    }
    if (this.state.showPaidAccountUpgradeModal !== nextState.showPaidAccountUpgradeModal) {
      return true;
    }
    if (this.state.showShareModal !== nextState.showShareModal) {
      return true;
    }
    if (this.state.shareModalStep !== nextState.shareModalStep) {
      return true;
    }
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      return true;
    }
    if (this.state.showSignInModal !== nextState.showSignInModal) {
      return true;
    }
    if (this.state.voterFirstName !== nextState.voterFirstName) {
      // console.log('this.state.voterFirstName: ', this.state.voterFirstName, ', nextState.voterFirstName', nextState.voterFirstName);
      return true;
    }
    if (this.state.voter && nextState.voter && this.state.voter.is_signed_in !== nextState.voter.is_signed_in) {
      // console.log('HeaderBar voter.isSignedIn shouldComponentUpdate true');
      return true;
    }
    if (this.state.showSelectBallotModal !== nextState.showSelectBallotModal) {
      return true;
    }
    const currentPathnameExists = this.props.location && this.props.location.pathname;
    const nextPathnameExists = nextProps.location && nextProps.location.pathname;
    // One exists, and the other doesn't
    if ((currentPathnameExists && !nextPathnameExists) || (!currentPathnameExists && nextPathnameExists)) {
      // console.log("HeaderBar shouldComponentUpdate: PathnameExistsDifference");
      return true;
    }
    if (currentPathnameExists && nextPathnameExists && this.props.location.pathname !== nextProps.location.pathname) {
      // console.log("HeaderBar shouldComponentUpdate: this.props.location.pathname", this.props.location.pathname, ", nextProps.location.pathname", nextProps.location.pathname);
      return true;
    }
    const thisVoterExists = this.state.voter !== undefined;
    const nextVoterExists = nextState.voter !== undefined;
    if (nextVoterExists && !thisVoterExists) {
      // console.log("HeaderBar shouldComponentUpdate: thisVoterExists", thisVoterExists, ", nextVoterExists", nextVoterExists);
      return true;
    }
    if (thisVoterExists && nextVoterExists) {
      if (this.state.voter.voter_photo_url_medium !== nextState.voter.voter_photo_url_medium) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.voter_photo_url_medium', this.state.voter.voter_photo_url_medium, ', nextState.voter.voter_photo_url_medium', nextState.voter.voter_photo_url_medium);
        return true;
      }
      if (this.state.voter.signed_in_twitter !== nextState.voter.signed_in_twitter) {
        // console.log("HeaderBar shouldComponentUpdate: this.state.voter.signed_in_twitter", this.state.voter.signed_in_twitter, ", nextState.voter.signed_in_twitter", nextState.voter.signed_in_twitter);
        return true;
      }
      if (this.state.voter.signed_in_facebook !== nextState.voter.signed_in_facebook) {
        // console.log("HeaderBar shouldComponentUpdate: this.state.voter.signed_in_facebook", this.state.voter.signed_in_facebook, ", nextState.voter.signed_in_facebook", nextState.voter.signed_in_facebook);
        return true;
      }
      if (this.state.voter.signed_in_with_email !== nextState.voter.signed_in_with_email) {
        return true;
      }
    }
    // console.log('HeaderBar shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    const paidAccountUpgradeMode = AppStore.showPaidAccountUpgradeModal() || '';
    // console.log('HeaderBar paidAccountUpgradeMode:', paidAccountUpgradeMode);
    const showPaidAccountUpgradeModal = paidAccountUpgradeMode && paidAccountUpgradeMode !== '';
    // console.log('HeaderBar onAppStoreChange showPaidAccountUpgradeModal:', showPaidAccountUpgradeModal);
    this.setState({
      chosenSiteLogoUrl: AppStore.getChosenSiteLogoUrl(),
      hideWeVoteLogo: AppStore.getHideWeVoteLogo(),
      paidAccountUpgradeMode,
      scrolledDown: AppStore.getScrolledDown(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showPaidAccountUpgradeModal,
      showShareModal: AppStore.showShareModal(),
      shareModalStep: AppStore.shareModalStep(),
      showSignInModal: AppStore.showSignInModal(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
    });
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter.is_signed_in || false;

    this.setState({
      voter,
      voterFirstName,
      voterIsSignedIn,
      showSignInModal: AppStore.showSignInModal(),
      showShareModal: AppStore.showShareModal(),
    });
  }

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains('/ballot/vote', pathname.toLowerCase())) return 3;
    if (pathname && pathname.toLowerCase().startsWith('/ballot')) return 0;
    if (stringContains('/value', pathname.toLowerCase())) return 1; // '/values'
    if (stringContains('/friends', pathname.toLowerCase())) return 2;

    return false;
  };

  handleNavigation = to => historyPush(to);

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  toggleSelectBallotModal (destinationUrlForHistoryPush = '') {
    const { showSelectBallotModal } = this.state;
    // console.log('HeaderBar toggleSelectBallotModal, destinationUrlForHistoryPush:', destinationUrlForHistoryPush, ', prior showSelectBallotModal:', showSelectBallotModal);
    if (showSelectBallotModal && destinationUrlForHistoryPush && destinationUrlForHistoryPush !== '') {
      historyPush(destinationUrlForHistoryPush);
    } else if (!showSelectBallotModal) {
      // console.log('Ballot toggleSelectBallotModal, BallotActions.voterBallotListRetrieve()');
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }
    AppActions.setShowSelectBallotModal(!showSelectBallotModal);
  }

  closeNewVoterGuideModal () {
    // console.log('HeaderBar closeNewVoterGuideModal');
    AppActions.setShowNewVoterGuideModal(false);
    // signInModalGlobalState.set('isShowingSignInModal', false);
    HeaderBar.goToGetStarted();
  }

  closeSignInModal () {
    AppActions.setShowSignInModal(false);
    // signInModalGlobalState.set('isShowingSignInModal', false);
    HeaderBar.goToGetStarted();
  }

  toggleSignInModal () {
    // console.log('HeaderBar toggleSignInModal');
    const { showSignInModal } = this.state;
    AppActions.setShowSignInModal(!showSignInModal);
  }

  hideProfilePopUp () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter/election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    // const googleCivicElectionId = 0;
    // if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(googleCivicElectionId, this.state.voter.linked_organization_we_vote_id)) {
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, false, true);
    // }
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  closePaidAccountUpgradeModal () {
    AppActions.setShowPaidAccountUpgradeModal(false);
  }

  closeShareModal () {
    AppActions.setShowShareModal(false);
  }

  render () {
    renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.componentDidMountFinished) {
      return null;
    }
    const { classes, pathname, location } = this.props;
    const {
      chosenSiteLogoUrl, friendInvitationsSentToMe, hideWeVoteLogo, paidAccountUpgradeMode, scrolledDown,
      showEditAddressButton, showPaidAccountUpgradeModal, showShareModal, shareModalStep, showSelectBallotModal,
      showSignInModal, voter, voterFirstName, voterIsSignedIn,
    } = this.state;
    // console.log('Header Bar, showSignInModal ', showSignInModal);
    const ballotBaseUrl = '/ballot';
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    const numberOfIncomingFriendRequests = friendInvitationsSentToMe.length || 0; // DALE: FRIENDS TEMPORARILY DISABLED
    const showFullNavigation = true;
    const weVoteBrandingOff = this.state.we_vote_branding_off;
    const showingBallot = stringContains(ballotBaseUrl, pathname.toLowerCase().slice(0, 7));
    const showingFriendsTabs = displayFriendsTabs();
    const editAddressButtonHtml = (
      <Tooltip title="Change my location or election" aria-label="Change Address or Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
        <span>
          <IconButton
            classes={{ root: classes.iconButtonRoot }}
            id="changeAddressHeaderBar"
            onClick={this.toggleSelectBallotModal}
          >
            <PlaceIcon />
          </IconButton>
          <Button
            color="primary"
            classes={{ root: classes.addressButtonRoot }}
            id="changeAddressHeaderBarText"
            onClick={this.toggleSelectBallotModal}
          >
            <span className="u-show-desktop-tablet">
              Address & Elections
            </span>
            <span className="u-show-mobile">
              Address
            </span>
          </Button>
        </span>
      </Tooltip>
    );

    const doNotShowWeVoteLogo = weVoteBrandingOff || hideWeVoteLogo;
    const showWeVoteLogo = !doNotShowWeVoteLogo;
    const cordovaOverrides = isWebApp() ? {} : { marginLeft: 0, padding: '4px 0 0 8px', right: 'unset' };

    return (
      <Wrapper hasNotch={hasIPhoneNotch()} scrolledDown={scrolledDown && isWebApp() && shouldHeaderRetreat(pathname)}>
        <AppBar position="relative"
                color="default"
                className={`page-header${!isWebApp() ? ' page-header__cordova' : ''}${showingBallot || showingFriendsTabs ? ' page-header__ballot' : ''}`}
                style={cordovaOverrides}
        >
          <Toolbar className="header-toolbar" disableGutters>
            {(showWeVoteLogo || chosenSiteLogoUrl) && (
              <HeaderBarLogo
                chosenSiteLogoUrl={chosenSiteLogoUrl}
                showFullNavigation={!!showFullNavigation}
                isBeta={showWeVoteLogo && !chosenSiteLogoUrl}
              />
            )}
            <div className="header-nav">
              <Tabs
                className="u-show-desktop"
                value={this.getSelectedTab()}
                indicatorColor="primary"
                classes={{ indicator: classes.indicator }}
              >
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRootBallot }} id="ballotTabHeaderBar" label="Ballot" onClick={() => this.handleNavigation('/ballot')} />
                )}
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRootDefault }} id="valuesTabHeaderBar" label="My Values" onClick={() => this.handleNavigation('/values')} />
                )}
                { showFullNavigation && (
                  <Tab
                    classes={(numberOfIncomingFriendRequests > 0) ? { root: classes.tabRootIncomingFriendRequests } : { root: classes.tabRootDefault }}
                    id="friendsTabHeaderBar"
                    label={(
                      <Badge
                        classes={{ badge: classes.headerBadge }}
                        badgeContent={numberOfIncomingFriendRequests}
                        color="primary"
                        max={9}
                      >
                        My Friends
                      </Badge>
                    )}
                    onClick={() => this.handleNavigation('/friends')}
                  />
                )}
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRootVote }} id="voteTabHeaderBar" label="Vote" onClick={() => this.handleNavigation('/ballot/vote')} />
                )}
              </Tabs>
            </div>
            {
              voterIsSignedIn && voterPhotoUrlMedium ? (
                <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none">
                  {
                    showEditAddressButton && editAddressButtonHtml
                  }
                  <span id="profileAvatarHeaderBar"
                    className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                    onClick={this.toggleProfilePopUp}
                  >
                    <img
                      className="header-nav__avatar"
                      src={voterPhotoUrlMedium}
                      style={{
                        marginLeft: 16,
                      }}
                      height={34}
                      width={34}
                      alt="Your Settings"
                    />
                  </span>
                  {this.state.profilePopUpOpen && voterIsSignedIn && (
                    <HeaderBarProfilePopUp
                      hideProfilePopUp={this.hideProfilePopUp}
                      onClick={this.toggleProfilePopUp}
                      profilePopUpOpen={this.state.profilePopUpOpen}
                      signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                      toggleProfilePopUp={this.toggleProfilePopUp}
                      toggleSignInModal={this.toggleSignInModal}
                      transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                      voter={voter}
                      weVoteBrandingOff={this.state.we_vote_branding_off}
                    />
                  )}
                </div>
              ) : (
                voterIsSignedIn && (
                  <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none">
                    {showEditAddressButton && editAddressButtonHtml}
                    <IconButton
                      classes={{ root: classes.iconButtonRoot }}
                      id="profileAvatarHeaderBar"
                      onClick={this.toggleProfilePopUp}
                    >
                      <FirstNameWrapper>
                        {shortenText(voterFirstName, 9)}
                      </FirstNameWrapper>
                      <AccountCircleIcon />
                    </IconButton>
                    {this.state.profilePopUpOpen && voterIsSignedIn && (
                      <HeaderBarProfilePopUp
                        hideProfilePopUp={this.hideProfilePopUp}
                        onClick={this.toggleProfilePopUp}
                        profilePopUpOpen={this.state.profilePopUpOpen}
                        signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                        toggleProfilePopUp={this.toggleProfilePopUp}
                        toggleSignInModal={this.toggleSignInModal}
                        transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                        voter={voter}
                        weVoteBrandingOff={this.state.we_vote_branding_off}
                      />
                    )}
                  </div>
                )
              )
            }
            {
              !voterIsSignedIn && (
              <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none d-print-none">
                {showEditAddressButton && editAddressButtonHtml}
                <Button
                  color="primary"
                  classes={{ root: classes.headerButtonRoot }}
                  id="signInHeaderBar"
                  onClick={this.toggleSignInModal}
                >
                  Sign In
                </Button>
              </div>
              )
            }
          </Toolbar>
        </AppBar>
        {showSignInModal && (
          <SignInModal
            show={showSignInModal}
            closeFunction={this.closeSignInModal}
          />
        )}
        {showSelectBallotModal && (
          <SelectBallotModal
            ballotBaseUrl="/ballot"
            location={location}
            pathname={pathname}
            show={showSelectBallotModal}
            toggleFunction={this.toggleSelectBallotModal}
          />
        )}
        {showPaidAccountUpgradeModal && (
          <PaidAccountUpgradeModal
            initialPricingPlan={paidAccountUpgradeMode}
            pathname={pathname}
            show={showPaidAccountUpgradeModal}
            toggleFunction={this.closePaidAccountUpgradeModal}
          />
        )}
        {showShareModal && (
          <ShareModal
            isSignedIn={this.state.voter.is_signed_in}
            pathname={pathname}
            show={showShareModal}
            step={shareModalStep}
            toggleFunction={this.closeShareModal}
          />
        )}
      </Wrapper>
    );
  }
}

const styles = theme => ({
  headerBadge: {
    right: -15,
    top: 9,
  },
  padding: {
    padding: `0 ${theme.spacing(2)}px`,
  },
  addressButtonRoot: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'rgba(17, 17, 17, .5)',
    outline: 'none !important',
    paddingRight: 20,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 6,
      marginLeft: 2,
      paddingLeft: 0,
    },
  },
  headerButtonRoot: {
    paddingTop: 2,
    paddingBottom: 2,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'rgb(6, 95, 212)',
    marginLeft: '1rem',
    outline: 'none !important',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 12,
      paddingLeft: 0,
    },
  },
  iconButtonRoot: {
    paddingTop: 2,
    paddingRight: 0,
    paddingBottom: 2,
    paddingLeft: 0,
    color: 'rgba(17, 17, 17, .4)',
    outline: 'none !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  tooltipPlacementBottom: {
    marginTop: 0,
  },
  outlinedPrimary: {
    minWidth: 36,
    marginRight: '.5rem',
    [theme.breakpoints.down('md')]: {
      padding: 2,
    },
  },
  tabRootBallot: {
    minWidth: 90,
  },
  tabRootDefault: {
    minWidth: 110,
  },
  tabRootIncomingFriendRequests: {
    minWidth: 130,
  },
  tabRootVote: {
    minWidth: 70,
  },
  indicator: {
    height: 4,
  },
});

const Wrapper = styled.div`
  margin-top: ${({ hasNotch }) => (hasNotch ? '1.5rem' : '0')};
  transition: all 50ms ease-in;
  ${({ scrolledDown }) => (scrolledDown ? 'transform: translateY(-100%);' : '')}
`;

const FirstNameWrapper = styled.div`
  font-size: 14px;
  padding-right: 4px;
`;

export default withStyles(styles)(HeaderBar);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PlaceIcon from '@material-ui/icons/Place';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';
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
import { stringContains } from '../../utils/textFormat';
import shouldHeaderRetreat from '../../utils/shouldHeaderRetreat';
// import Badge from '@material-ui/core/Badge'; // DALE: FRIENDS TEMPORARILY DISABLED

class HeaderBar extends Component {
  static propTypes = {
    location: PropTypes.object,
    voter: PropTypes.object,
    pathname: PropTypes.string,
    classes: PropTypes.object,
  };

  static goToGetStarted () {
    const getStartedNow = '/ballot';
    historyPush(getStartedNow);
  }

  constructor (props) {
    super(props);
    this.state = {
      aboutMenuOpen: false,
      componentDidMountFinished: false,
      profilePopUpOpen: false,
      friendInvitationsSentToMe: 0,
      showEditAddressButton: false,
      showSelectBallotModal: false,
      showSignInModal: false,
      scrolledDown: false,
    };
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    // this.onBallotStoreChange();

    // this.props.location &&
    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      componentDidMountFinished: true,
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      scrolledDown: AppStore.getScrolledDown(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
      showSignInModal: AppStore.showSignInModal(),
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.profilePopUpOpen === true || nextState.profilePopUpOpen === true) {
      // console.log("shouldComponentUpdate: this.state.profilePopUpOpen", this.state.profilePopUpOpen, ", nextState.profilePopUpOpen", nextState.profilePopUpOpen);
      return true;
    }
    if (this.state.aboutMenuOpen === true || nextState.aboutMenuOpen === true) {
      // console.log("shouldComponentUpdate: this.state.aboutMenuOpen", this.state.aboutMenuOpen, ", nextState.aboutMenuOpen", nextState.aboutMenuOpen);
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
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      return true;
    }
    if (this.state.showSignInModal !== nextState.showSignInModal) {
      return true;
    }
    if (this.state.showSelectBallotModal !== nextState.showSelectBallotModal) {
      return true;
    }
    const currentPathnameExists = this.props.location && this.props.location.pathname;
    const nextPathnameExists = nextProps.location && nextProps.location.pathname;
    // One exists, and the other doesn't
    if ((currentPathnameExists && !nextPathnameExists) || (!currentPathnameExists && nextPathnameExists)) {
      // console.log("shouldComponentUpdate: PathnameExistsDifference");
      return true;
    }
    if (currentPathnameExists && nextPathnameExists && this.props.location.pathname !== nextProps.location.pathname) {
      // console.log("shouldComponentUpdate: this.props.location.pathname", this.props.location.pathname, ", nextProps.location.pathname", nextProps.location.pathname);
      return true;
    }
    const thisVoterExists = this.props.voter !== undefined;
    const nextVoterExists = nextProps.voter !== undefined;
    if (nextVoterExists && !thisVoterExists) {
      // console.log("shouldComponentUpdate: thisVoterExists", thisVoterExists, ", nextVoterExists", nextVoterExists);
      return true;
    }
    if (thisVoterExists && nextVoterExists && this.props.voter.signed_in_twitter !== nextProps.voter.signed_in_twitter) {
      // console.log("shouldComponentUpdate: this.props.voter.signed_in_twitter", this.props.voter.signed_in_twitter, ", nextProps.voter.signed_in_twitter", nextProps.voter.signed_in_twitter);
      return true;
    }
    if (thisVoterExists && nextVoterExists && this.props.voter.signed_in_facebook !== nextProps.voter.signed_in_facebook) {
      // console.log("shouldComponentUpdate: this.props.voter.signed_in_facebook", this.props.voter.signed_in_facebook, ", nextProps.voter.signed_in_facebook", nextProps.voter.signed_in_facebook);
      return true;
    }
    if (thisVoterExists && nextVoterExists && this.props.voter.signed_in_with_email !== nextProps.voter.signed_in_with_email) {
      return true;
    }
    if (thisVoterExists && nextVoterExists && this.props.voter.is_signed_in !== nextProps.voter.is_signed_in) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.appStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  onAppStoreChange () {
    const paidAccountUpgradeMode = AppStore.showPaidAccountUpgradeModal();
    // console.log('HeaderBar paidAccountUpgradeMode:', paidAccountUpgradeMode);
    const showPaidAccountUpgradeModal = paidAccountUpgradeMode && paidAccountUpgradeMode !== '';
    // console.log('HeaderBar showPaidAccountUpgradeModal:', showPaidAccountUpgradeModal);
    this.setState({
      scrolledDown: AppStore.getScrolledDown(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showPaidAccountUpgradeModal,
      paidAccountUpgradeMode,
      showSignInModal: AppStore.showSignInModal(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
    });
  }

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains('/ballot/vote', pathname.toLowerCase())) return 2; // DALE: FRIENDS TEMPORARILY DISABLED - Switch back to "3"
    if (pathname && pathname.toLowerCase().startsWith('/ballot')) return 0;
    if (stringContains('/value', pathname.toLowerCase())) return 1; // '/values'
    // if (stringContains('/friends', pathname.toLowerCase())) return 2; // DALE: FRIENDS TEMPORARILY DISABLED

    return false;
  };

  handleNavigation = to => historyPush(to);

  toggleProfilePopUp () {
    if (isWebApp()) {
      const { profilePopUpOpen } = this.state;
      this.setState({ profilePopUpOpen: !profilePopUpOpen });
    } else {
      this.handleNavigation('/settings/hamburger');
    }
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
  }

  closeSignInModal () {
    AppActions.setShowSignInModal(false);
  }

  toggleSignInModal () {
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
    OrganizationActions.positionListForOpinionMaker(this.props.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    // const googleCivicElectionId = 0;
    // if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(googleCivicElectionId, this.props.voter.linked_organization_we_vote_id)) {
    OrganizationActions.positionListForOpinionMaker(this.props.voter.linked_organization_we_vote_id, false, true);
    // }
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.props.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  render () {
    // console.log('HeaderBar render, this.state.showSelectBallotModal:', this.state.showSelectBallotModal, ', this.state.componentDidMountFinished:', this.state.componentDidMountFinished);
    if (!this.state.componentDidMountFinished) {
      return null;
    }
    renderLog(__filename);
    const { voter, classes, pathname, location } = this.props;
    const { paidAccountUpgradeMode, scrolledDown, showEditAddressButton, showPaidAccountUpgradeModal, showSelectBallotModal } = this.state;
    const ballotBaseUrl = '/ballot';
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    // const numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length || 0; // DALE: FRIENDS TEMPORARILY DISABLED
    const voterIsSignedIn = this.props.voter && this.props.voter.is_signed_in;
    const showFullNavigation = true;
    const weVoteBrandingOff = this.state.we_vote_branding_off;
    const showingBallot = stringContains(ballotBaseUrl, pathname.toLowerCase().slice(0, 7));
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

    return (
      <Wrapper hasNotch={hasIPhoneNotch()} scrolledDown={scrolledDown && isWebApp() && shouldHeaderRetreat(pathname)}>
        <AppBar position="relative" color="default" className={`page-header${!isWebApp() ? ' page-header__cordova' : ''}${showingBallot ? ' page-header__ballot' : ''}`}>
          <Toolbar className="header-toolbar" disableGutters>
            {!weVoteBrandingOff && <HeaderBarLogo showFullNavigation={!!showFullNavigation} isBeta />}
            <div className="header-nav">
              <Tabs
                className="u-show-desktop"
                value={this.getSelectedTab()}
                indicatorColor="primary"
                classes={{ indicator: classes.indicator }}
              >
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRoot }} id="ballotTabHeaderBar" label="Ballot" onClick={() => this.handleNavigation('/ballot')} />
                )
                }
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRoot }} id="valuesTabHeaderBar" label="My Values" onClick={() => this.handleNavigation('/values')} />
                )
                }
                {/* showFullNavigation && (
                  <Tab classes={{ root: classes.tabRoot }} id="friendsTabHeaderBar" label={<Badge classes={{ badge: classes.headerBadge }} badgeContent={numberOfIncomingFriendRequests} color="primary" max={9}>My Friends</Badge>} onClick={() => this.handleNavigation('/friends')} />
                )
                */}
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRoot }} id="voteTabHeaderBar" label="Vote" onClick={() => this.handleNavigation('/ballot/vote')} />
                )
                }
              </Tabs>
            </div>
            {
              voterIsSignedIn && voterPhotoUrlMedium ? (
                <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none">
                  {
                    showEditAddressButton && editAddressButtonHtml
                  }
                  <span className="u-show-desktop-tablet">
                    <span id="profileAvatarHeaderBar"
                      className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                      onClick={this.toggleProfilePopUp}
                    >
                      <img
                        className="header-nav__avatar"
                        style={{
                          marginLeft: 16,
                        }}
                        src={voterPhotoUrlMedium}
                        height={34}
                        width={34}
                        alt="Your Settings"
                      />
                    </span>
                  </span>
                  <span className="u-show-mobile">
                    <div
                      id="profileAvatarHeaderBar"
                      className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                      onClick={() => this.handleNavigation('/settings/hamburger')}
                    >
                      <img
                        className="header-nav__avatar"
                        style={{
                          marginLeft: 16,
                        }}
                        src={voterPhotoUrlMedium}
                        height={34}
                        width={34}
                        alt="Your Settings"
                      />
                    </div>
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
                      voter={this.props.voter}
                      weVoteBrandingOff={this.state.we_vote_branding_off}
                    />
                  )}
                </div>
              ) : (
                voterIsSignedIn && (
                  <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex">
                    {showEditAddressButton && editAddressButtonHtml}
                    <span className="u-show-desktop-tablet">
                      <IconButton
                        classes={{ root: classes.iconButtonRoot }}
                        id="profileAvatarHeaderBar"
                        onClick={this.toggleProfilePopUp}
                      >
                        <AccountCircleIcon />
                      </IconButton>
                    </span>
                    <span className="u-show-mobile">
                      <IconButton
                        classes={{ root: classes.iconButtonRoot }}
                        id="profileAvatarHeaderBar"
                        onClick={() => this.handleNavigation('/settings/hamburger')}
                      >
                        <AccountCircleIcon />
                      </IconButton>
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
                        voter={this.props.voter}
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
        <SignInModal
          show={this.state.showSignInModal}
          toggleFunction={this.closeSignInModal}
        />
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
            location={location}
            pathname={pathname}
            show={showPaidAccountUpgradeModal}
            toggleFunction={this.closePaidAccountUpgradeModal}
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
    [theme.breakpoints.down('sm')]: {
      paddingTop: 6,
      marginLeft: 2,
      paddingLeft: 0,
      paddingRight: 0,
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
  tabRoot: {
    minWidth: 130,
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

export default withStyles(styles)(HeaderBar);

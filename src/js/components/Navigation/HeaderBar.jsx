import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import PlaceIcon from '@material-ui/icons/Place';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';
import BallotStore from '../../stores/BallotStore';
import { historyPush, isWebApp, hasIPhoneNotch } from '../../utils/cordovaUtils';
import cookies from '../../utils/cookies';
import FriendStore from '../../stores/FriendStore';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import HeaderBarLogo from './HeaderBarLogo';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import SignInModal from '../Widgets/SignInModal';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import { stringContains } from '../../utils/textFormat';
import shouldHeaderRetreat from '../../utils/shouldHeaderRetreat';

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
      showEditAddressButton: AppStore.showEditAddressButton(),
      showSignInModal: AppStore.showSignInModal(),
      scrolledDown: AppStore.getScrolledDown(),
    };
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    // this.onBallotStoreChange();

    // this.props.location &&
    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      componentDidMountFinished: true,
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
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
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      return true;
    }
    if (this.state.showSignInModal !== nextState.showSignInModal) {
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
      // console.log("shouldComponentUpdate: this.props.voter.signed_in_with_email", this.props.voter.signed_in_with_email, ", nextProps.voter.signed_in_with_email", nextProps.voter.signed_in_with_email);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.friendStoreListener.remove();
    this.appStoreListener.remove();
  }

  onBallotStoreChange () {
    // this.setState({ bookmarks: BallotStore.bookmarks });
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  onAppStoreChange () {
    this.setState({
      scrolledDown: AppStore.getScrolledDown(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showSignInModal: AppStore.showSignInModal(),
    });
  }

  getSelectedTab = () => {
    const { pathname } = this.props;
    // if (pathname.indexOf('/ballot') === 0) return 0; // If '/ballot' is found any
    if (pathname && pathname.startsWith('/ballot')) return 0;
    if (stringContains('/value', pathname)) return 1; // '/values'
    if (stringContains('/friends', pathname)) return 2;

    return false;
  }

  handleNavigation = to => historyPush(to);

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  toggleSelectBallotModal () {
    AppActions.setShowSelectBallotModal(true);
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
    OrganizationActions.positionListForOpinionMaker(this.props.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.props.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  render () {
    // console.log('HeaderBar render, this.state.showSignInModal:', this.state.showSignInModal);
    renderLog(__filename);
    const { voter, classes, pathname } = this.props;
    const { showEditAddressButton, scrolledDown } = this.state;
    const ballotBaseUrl = '/ballot';
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    const numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length || 0;
    const voterIsSignedIn = this.props.voter && this.props.voter.is_signed_in;
    const showFullNavigation = cookies.getItem('show_full_navigation') || voterIsSignedIn;
    const weVoteBrandingOff = this.state.we_vote_branding_off;
    const showingBallot = stringContains(ballotBaseUrl, pathname.slice(0, 7));

    return (
      <Wrapper hasNotch={hasIPhoneNotch()} scrolledDown={scrolledDown && shouldHeaderRetreat(pathname)}>
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
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRoot }} id="friendsTabHeaderBar" label={<Badge classes={{ badge: classes.headerBadge }} badgeContent={numberOfIncomingFriendRequests} color="primary" max={9}>My Friends</Badge>} onClick={() => this.handleNavigation('/friends')} />
                )
                }
                {/* showFullNavigation && isWebApp() && <Tab className="u-show-desktop" label="Vote" /> */}
              </Tabs>
            </div>

            {/* (showFullNavigation || isCordova()) && <SearchAllBox /> */}

            {(!showFullNavigation || !voterIsSignedIn) && (
              <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none">
                {
                  showEditAddressButton && (
                    <Tooltip title="Change my location" aria-label="Change Address" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
                      <IconButton
                        classes={{ root: classes.iconButtonRoot }}
                        id="changeAddressHeaderBar"
                        onClick={this.toggleSelectBallotModal}
                      >
                        <PlaceIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
                <Link id="settingsLinkHeaderBar" to="/settings/menu" className="header-link">
                  <Tooltip title="Settings" aria-label="settings" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
                    <IconButton
                      classes={{ root: classes.iconButtonRoot }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
                <Button
                  color="primary"
                  classes={{ root: classes.headerButtonRoot }}
                  id="signInHeaderBar"
                  onClick={this.toggleSignInModal}
                >
                  Sign In
                </Button>
              </div>
            )}

            {
              (showFullNavigation && voterIsSignedIn) && (
                <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none">
                  {
                    showEditAddressButton && (
                      <Tooltip title="Change my location" aria-label="Change Address" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
                        <IconButton
                          classes={{ root: classes.iconButtonRoot }}
                          id="changeAddressHeaderBar"
                          onClick={this.toggleSelectBallotModal}
                        >
                          <PlaceIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                  <Link id="settingsLinkHeaderBar" to="/settings/menu" className="header-link">
                    <Tooltip title="Settings" aria-label="settings" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
                      <IconButton
                        classes={{ root: classes.iconButtonRoot }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>
                  {voterPhotoUrlMedium ? (
                    <div id="profileAvatarHeaderBar" className="header-nav__avatar-container" onClick={this.toggleProfilePopUp}>
                      <img
                        className="header-nav__avatar"
                        src={voterPhotoUrlMedium}
                        height={34}
                        width={34}
                        alt="generic avatar"
                      />
                    </div>
                  ) : (
                    <div>
                      <IconButton
                        classes={{ root: classes.iconButtonRoot }}
                        id="profileAvatarHeaderBar"
                        onClick={this.toggleProfilePopUp}
                      >
                        <AccountCircleIcon />
                      </IconButton>
                    </div>
                  )
                  }
                  {/* Was AccountMenu */}
                  {this.state.profilePopUpOpen && voter.is_signed_in && (
                    <HeaderBarProfilePopUp
                      {...this.props}
                      onClick={this.toggleProfilePopUp}
                      profilePopUpOpen={this.state.profilePopUpOpen}
                      weVoteBrandingOff={this.state.we_vote_branding_off}
                      toggleProfilePopUp={this.toggleProfilePopUp}
                      hideProfilePopUp={this.hideProfilePopUp}
                      transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                      signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                    />
                  )}
                </div>
              )}
          </Toolbar>
        </AppBar>
        {
          this.state.showSignInModal ? (
            <SignInModal
              show
              toggleFunction={this.toggleSignInModal}
            />
          ) : null
        }
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
    padding: `0 ${theme.spacing.unit * 2}px`,
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
    [theme.breakpoints.down('md')]: {
      marginLeft: '.1rem',
    },
  },
  iconButtonRoot: {
    color: 'rgba(17, 17, 17, .4)',
    outline: 'none !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.down('md')]: {
      padding: 4,
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

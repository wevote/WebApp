import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import Headroom from 'react-headroom';
import { withStyles } from '@material-ui/core/styles';
import BallotStore from '../../stores/BallotStore';
import { historyPush, isWebApp, hasIPhoneNotch } from '../../utils/cordovaUtils';
import cookies from '../../utils/cookies';
import FriendStore from '../../stores/FriendStore';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import HeaderBarLogo from './HeaderBarLogo';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import AppActions from '../../actions/AppActions';
import { stringContains } from '../../utils/textFormat';

const styles = theme => ({
  headerBadge: {
    right: '-25px',
    top: '-2px',
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  headerButtonRoot: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  outlinedPrimary: {
    minWidth: 36,
    padding: 2,
    marginRight: '.5rem',
  },
});

const Wrapper = styled.div`
  margin-top: ${({ hasNotch }) => (hasNotch ? '1.5rem' : '0')};
`;

const headroomWrapperStyle = {
  maxHeight: 0,
};

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
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.onHeadroomUnpin = this.onHeadroomUnpin.bind(this);
    this.state = {
      aboutMenuOpen: false,
      componentDidMountFinished: false,
      profilePopUpOpen: false,
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // this.onBallotStoreChange();

    // this.props.location &&
    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      componentDidMountFinished: true,
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
  }

  onBallotStoreChange () {
    // this.setState({ bookmarks: BallotStore.bookmarks });
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  onHeadroomUnpin (unpinned) {
    AppActions.setHeadroomUnpinned(unpinned);
  }

  getSelectedTab = () => {
    const { pathname } = this.props;
    if (stringContains('/ballot', pathname)) return 0;
    if (stringContains('/more/network/friends', pathname)) return 2;
    if (stringContains('/more/network', pathname)) return 1;
    return false;
  }

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  toggleSelectBallotModal () {
    AppActions.setShowSelectBallotModal(true);
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
    renderLog(__filename);
    const { voter, classes, pathname } = this.props;
    const ballotBaseUrl = '/ballot';
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    const numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length || 0;
    const voterIsSignedIn = this.props.voter && this.props.voter.is_signed_in;
    const showFullNavigation = cookies.getItem('show_full_navigation') || voterIsSignedIn;
    const weVoteBrandingOff = this.state.we_vote_branding_off;
    const showingBallot = stringContains(ballotBaseUrl, pathname);

    return (
      <Headroom
        onUnpin={() => this.onHeadroomUnpin(true)}
        onPin={() => this.onHeadroomUnpin(false)}
        wrapperStyle={headroomWrapperStyle}
        disable={!showingBallot}
      >
        <Wrapper hasNotch={hasIPhoneNotch()}>
          <AppBar position="relative" color="default" className={`page-header${!isWebApp() ? ' page-header__cordova' : ''}${showingBallot ? ' page-header__ballot' : ''}`}>
            <Toolbar className="header-toolbar" disableGutters>
              {!weVoteBrandingOff && <HeaderBarLogo showFullNavigation={!!showFullNavigation} isBeta />}
              <div className="header-nav">
                <Tabs
              value={this.getSelectedTab()}
              indicatorColor="primary"
                >
                  {showFullNavigation && <Link to="/ballot" className="header-link u-show-desktop"><Tab label="Ballot" /></Link>}
                  {showFullNavigation && <Link to="/more/network/issues" className="header-link u-show-desktop"><Tab label="My Values" /></Link>}
                  {showFullNavigation && <Link to="/more/network/friends" className="header-link u-show-desktop"><Tab label={<Badge classes={{ badge: classes.headerBadge }} badgeContent={numberOfIncomingFriendRequests} color="primary" max={9} invisible={!numberOfIncomingFriendRequests}>My Friends</Badge>} /></Link>}
                  {/* showFullNavigation && isWebApp() && <Tab className="u-show-desktop" label="Vote" /> */}
                </Tabs>

                { !showFullNavigation && (
                  <div>
                    {
                    stringContains(ballotBaseUrl, pathname) && (
                    <Tooltip title="Change my location" aria-label="Change Address">
                      <Button
                        variant="outlined"
                        color="primary"
                        classes={{ root: classes.headerButtonRoot, outlinedPrimary: classes.outlinedPrimary }}
                        onClick={this.toggleSelectBallotModal}
                      >
                        <EditLocationIcon />
                      </Button>
                    </Tooltip>
                    )
                    }
                    <Link to="/settings/account" className="header-link">
                      <Button
                        color="primary"
                        variant="outlined"
                        classes={{ root: classes.headerButtonRoot }}
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* (showFullNavigation || isCordova()) && <SearchAllBox /> */}

              {
            showFullNavigation && (
            <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleProfilePopUp}>
              {voterPhotoUrlMedium ? (
                <div id="js-header-avatar" className="header-nav__avatar-container">
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
                  {
                    stringContains(ballotBaseUrl, pathname) && (
                    <Tooltip title="Change my location" aria-label="Change Address">
                      <Button
                        variant="outlined"
                        color="primary"
                        classes={{ root: classes.headerButtonRoot, outlinedPrimary: classes.outlinedPrimary }}
                        onClick={this.toggleSelectBallotModal}
                      >
                        <EditLocationIcon />
                      </Button>
                    </Tooltip>
                    )
                  }
                  <Link to="/settings/account" className="header-link">
                    <Button
                        color="primary"
                        variant="outlined"
                        classes={{ root: classes.headerButtonRoot }}
                    >
                        Sign In
                    </Button>
                  </Link>
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
        </Wrapper>
      </Headroom>
    );
  }
}

export default withStyles(styles)(HeaderBar);

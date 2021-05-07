import { AppBar, Button, IconButton, Toolbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle, Close, Menu } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import AppStore from '../../stores/AppStore';
import VoterStore from '../../stores/VoterStore';
import cookies from '../../utils/cookies';
import { cordovaWelcomeAppToolbarTop } from '../../utils/cordovaOffsets';
import { historyPush } from '../../utils/cordovaUtils';
import LazyImage from '../../utils/LazyImage';
import { renderLog } from '../../utils/logging';
import { shortenText } from '../../utils/textFormat';
import { voterPhoto } from '../../utils/voterPhoto';
import { Divider, LogoContainer, MobileNavDivider, MobileNavigationMenu, Navigation, NavLink, NavRow } from '../Welcome/navigationStyles';

const HeaderBarLogo = React.lazy(() => import('./HeaderBarLogo'));
const HeaderBarProfilePopUp = React.lazy(() => import('./HeaderBarProfilePopUp'));
// TODO: Backport "@stripe/react-stripe-js" use from Campaigns
// const PaidAccountUpgradeModal = React.lazy(() => import('../Settings/PaidAccountUpgradeModal'));
const SignInModal = React.lazy(() => import('../Widgets/SignInModal'));
const anonymous = '../../../img/global/icons/avatar-generic.png';


class WelcomeAppbar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      paidAccountUpgradeMode: '',
      profilePopUpOpen: false,
      showMobileNavigationMenu: false,
      showPaidAccountUpgradeModal: false,
      showSignInModal: AppStore.showSignInModal(),
      voterFirstName: '',
    };
    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.linkedOrganizationWeVoteId !== nextState.linkedOrganizationWeVoteId) {
      // console.log('this.state.linkedOrganizationWeVoteId', this.state.linkedOrganizationWeVoteId, ', nextState.linkedOrganizationWeVoteId', nextState.linkedOrganizationWeVoteId);
      return true;
    }
    if (this.state.paidAccountUpgradeMode !== nextState.paidAccountUpgradeMode) {
      // console.log('this.state.paidAccountUpgradeMode', this.state.paidAccountUpgradeMode, ', nextState.paidAccountUpgradeMode', nextState.paidAccountUpgradeMode);
      return true;
    }
    if (this.state.showPaidAccountUpgradeModal !== nextState.showPaidAccountUpgradeModal) {
      // console.log('this.state.showPaidAccountUpgradeModal', this.state.showPaidAccountUpgradeModal, ', nextState.showPaidAccountUpgradeModal', nextState.showPaidAccountUpgradeModal);
      return true;
    }
    if (this.state.showMobileNavigationMenu !== nextState.showMobileNavigationMenu) {
      // console.log('this.state.showMobileNavigationMenu', this.state.showMobileNavigationMenu, ', nextState.showMobileNavigationMenu', nextState.showMobileNavigationMenu);
      return true;
    }
    if (this.state.showSignInModal !== nextState.showSignInModal) {
      // console.log('this.state.showSignInModal', this.state.showSignInModal, ', nextState.showSignInModal', nextState.showSignInModal);
      return true;
    }
    if (this.state.profilePopUpOpen !== nextState.profilePopUpOpen) {
      // console.log('this.state.profilePopUpOpen', this.state.profilePopUpOpen, ', nextState.profilePopUpOpen', nextState.profilePopUpOpen);
      return true;
    }
    if (this.state.voterFirstName !== nextState.voterFirstName) {
      // console.log('this.state.voterFirstName: ', this.state.voterFirstName, ', nextState.voterFirstName', nextState.voterFirstName);
      return true;
    }
    if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
      return true;
    }
    if (this.state.voterPhotoUrlMedium !== nextState.voterPhotoUrlMedium) {
      // console.log('this.state.voterPhotoUrlMedium', this.state.voterPhotoUrlMedium, ', nextState.voterPhotoUrlMedium', nextState.voterPhotoUrlMedium);
      return true;
    }
    if (this.props.pathname !== nextProps.pathname) {
      // console.log('this.state.pathname', this.state.pathname, ', nextState.pathname', nextState.pathname);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html boundary
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onAppStoreChange () {
    const paidAccountUpgradeMode = AppStore.showPaidAccountUpgradeModal() || '';
    // console.log('HeaderBar paidAccountUpgradeMode:', paidAccountUpgradeMode);
    const showPaidAccountUpgradeModal = paidAccountUpgradeMode && paidAccountUpgradeMode !== '';
    this.setState({
      paidAccountUpgradeMode,
      showPaidAccountUpgradeModal,
      showSignInModal: AppStore.showSignInModal(),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterFirstName = VoterStore.getFirstName();
    const { linked_organization_we_vote_id: linkedOrganizationWeVoteId, is_signed_in: voterIsSignedIn, voter_photo_url_medium: voterPhotoUrlMedium } = voter;
    this.setState({
      linkedOrganizationWeVoteId,
      voter,
      voterFirstName,
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }

  handleShowMobileNavigation = (show) => {
    if (show) {
      // If the voter opens the mobile drop-down, set the sign_in_start_full_url
      cookies.removeItem('sign_in_start_full_url', '/');
      cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
      AppActions.storeSignInStartFullUrl();
    }
    this.setState({ showMobileNavigationMenu: show });
    if (show) {
      document.querySelector('body').style.overflow = 'hidden';
      return;
    }
    document.querySelector('body').style.overflow = '';
  }

  handleToPageFromMobileNav = (destination) => {
    this.handleShowMobileNavigation(false);
    historyPush(destination);
  }

  handleSignInFromMobileNav = () => {
    this.handleShowMobileNavigation(false);
    this.toggleSignInModal();
  }

  hideProfilePopUp = () => {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp = () => {
    this.handleShowMobileNavigation(false);
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  toggleProfilePopUp = () => {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  toggleSignInModal = () => {
    const { showSignInModal } = this.state;
    AppActions.setShowSignInModal(!showSignInModal);
  }

  transitionToYourVoterGuide = () => {
    // Positions for this organization, for this voter/election
    const { linkedOrganizationWeVoteId } = this.state;
    OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(linkedOrganizationWeVoteId);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(linkedOrganizationWeVoteId);
    this.setState({ profilePopUpOpen: false });
  };

  closePaidAccountUpgradeModal () {
    AppActions.setShowPaidAccountUpgradeModal(false);
  }

  closeSignInModal () {
    AppActions.setShowSignInModal(false);
  }

  render () {
    renderLog('WelcomeAppbar');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, pathname } = this.props;
    const { /* paidAccountUpgradeMode, */ showMobileNavigationMenu, /* showPaidAccountUpgradeModal, */ showSignInModal, voterFirstName, voterIsSignedIn, voter } = this.state;
    const voterPhotoUrlMedium = voterPhoto(voter);
    let showWelcomeForVoters = false;
    let showWelcomeForOrganizations = false;
    let showWelcomeForCampaigns = false;
    let showForCampaignsDesktop = false;
    let showForOrganizations = false;
    let showForOrganizationsDesktop = false;
    let showForVoters = false;
    let showHowItWorksForCampaigns = false;
    let showHowItWorksForOrganizations = false;
    let showHowItWorksForVoters = false;
    if (String(pathname) === '/how' || String(pathname) === '/how/for-voters') {
      showWelcomeForVoters = true;
    } else if (String(pathname) === '/how/for-organizations') {
      showWelcomeForOrganizations = true;
    } else if (String(pathname) === '/how/for-campaigns') {
      showWelcomeForCampaigns = true;
    }
    if (String(pathname) === '/welcome') {
      showForOrganizations = true;
    }
    if (typeof pathname !== 'undefined' && pathname &&
      !pathname.startsWith('/how') &&
      String(pathname) !== '/welcome' &&
      String(pathname) !== '/more/credits' &&
      !pathname.startsWith('/more/donate') &&
      !pathname.startsWith('/more/pricing')) {
      showForVoters = true;
    }
    if (typeof pathname !== 'undefined' && pathname &&
      !pathname.startsWith('/how') &&
      (String(pathname) === '/for-campaigns' ||
        String(pathname) === '/more/about' ||
        String(pathname) === '/more/credits' ||
        pathname.startsWith('/more/donate') ||
        pathname.startsWith('/more/pricing'))) {
      showForOrganizationsDesktop = true;
    }
    if (typeof pathname !== 'undefined' && pathname &&
      !pathname.startsWith('/how') &&
      (String(pathname) === '/welcome' ||
        String(pathname) === '/for-organizations' ||
        String(pathname) === '/more/credits' ||
        pathname.startsWith('/more/donate') ||
        pathname.startsWith('/more/pricing'))) {
      showForCampaignsDesktop = true;
    }
    if (typeof pathname !== 'undefined' && pathname &&
      String(pathname) === '/for-campaigns') {
      showHowItWorksForCampaigns = true;
    }
    if (typeof pathname !== 'undefined' && pathname &&
      String(pathname) === '/for-organizations') {
      showHowItWorksForOrganizations = true;
    }
    if (typeof pathname !== 'undefined' && pathname &&
      (String(pathname) === '/welcome' || String(pathname) === '/more/about')) {
      showHowItWorksForVoters = true;
    }
    return (
      <AppBar position="relative" classes={{ root: classes.appBarRoot }}>
        <Toolbar classes={{ root: classes.toolbar }} disableGutters style={{ top: cordovaWelcomeAppToolbarTop() }}>
          <LogoContainer>
            <HeaderBarLogo light />
          </LogoContainer>
          <Navigation>
            <DesktopView>
              {showWelcomeForVoters &&
                <NavLink id="welcomePageLink" to="/welcome">Welcome</NavLink>}
              {showWelcomeForOrganizations &&
                <NavLink id="welcomePageLink" to="/for-organizations">Welcome</NavLink>}
              {showWelcomeForCampaigns &&
                <NavLink id="welcomePageLink" to="/for-campaigns">Welcome</NavLink>}
              {/* Don't show 'For Organizations' or 'For Voters' when on How It Works page */}
              {showForOrganizations &&
                <NavLink id="welcomeForOrganizations" to="/for-organizations">For Organizations</NavLink>}
              {showForVoters &&
                <NavLink id="welcomeForVoters" to="/welcome">For Voters</NavLink>}
              {/* Don't show 'For Organizations' or 'For Campaigns' when on How It Works page */}
              { (showWelcomeForVoters || showWelcomeForOrganizations || showWelcomeForCampaigns || showForOrganizations || showForVoters) &&
                <Divider />}
              { showForOrganizationsDesktop &&
                <NavLink id="welcomeForOrganizations" to="/for-organizations">For Organizations</NavLink>}
              { showForOrganizationsDesktop && showForCampaignsDesktop &&
                <Divider />}
              { showForCampaignsDesktop &&
                <NavLink id="welcomeForCampaigns" to="/for-campaigns">For Campaigns</NavLink>}
              {/* Turn off How It Works link on that page */}
              { (showForOrganizationsDesktop || showForCampaignsDesktop) &&
                <Divider />}
              {/* Change the How It Works link depending on which welcome page you are on */}
              { showHowItWorksForVoters &&
                <NavLink id="welcomeHowItWorks" to="/how/for-voters">How It Works</NavLink>}
              { showHowItWorksForCampaigns &&
                <NavLink id="welcomeHowItWorks" to="/how/for-campaigns">How It Works</NavLink>}
              { showHowItWorksForOrganizations &&
                <NavLink id="welcomeHowItWorks" to="/how/for-organizations">How It Works</NavLink>}
              { (showHowItWorksForVoters || showHowItWorksForCampaigns || showHowItWorksForOrganizations) &&
                <Divider />}
              <NavLink id="welcomeYourBallot" to="/ready">Your Ballot</NavLink>
              <Divider />
              {!voterIsSignedIn && <NavLink id="welcomeSignIn" to="" onClick={() => this.toggleSignInModal()}>Sign In</NavLink> }
              {voterIsSignedIn && (
                <div>
                  {voterPhotoUrlMedium ? (
                    <div
                      id="profileAvatarHeaderBar"
                      className="header-nav__avatar-container"
                      onClick={this.toggleProfilePopUp}
                    >
                      <LazyImage
                        className="header-nav__avatar"
                        src={voterPhotoUrlMedium}
                        placeholder={anonymous}
                        height={34}
                        width={34}
                        alt="generic avatar"
                      />
                    </div>
                  ) : (
                    <ProfileIconWrapper>
                      <IconButton
                        classes={{ root: classes.iconButtonRoot }}
                        id="profileAvatarHeaderBar"
                        onClick={this.toggleProfilePopUp}
                      >
                        <FirstNameWrapper>
                          {shortenText(voterFirstName, 9)}
                        </FirstNameWrapper>
                        <AccountCircle />
                      </IconButton>
                    </ProfileIconWrapper>
                  )}
                  {this.state.profilePopUpOpen && voterIsSignedIn && (
                    <HeaderBarProfilePopUp
                      onClick={this.toggleProfilePopUp}
                      hideProfilePopUp={this.hideProfilePopUp}
                      profilePopUpOpen={this.state.profilePopUpOpen}
                      signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                      toggleProfilePopUp={this.toggleProfilePopUp}
                      toggleSignInModal={this.toggleSignInModal}
                      transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                      voter={this.state.voter}
                    />
                  )}
                </div>
              )}
            </DesktopView>
            <MobileTabletView>
              <NavLink id="welcomeYourBallotMobile" to="/ballot">Your Ballot</NavLink>
              {voterIsSignedIn && (
                <div>
                  {voterPhotoUrlMedium ? (
                    <ProfileImageWrapper
                      id="profileAvatarHeaderBar"
                      onClick={this.toggleProfilePopUp}
                    >
                      <LazyImage
                        className="header-nav__avatar"
                        src={voterPhotoUrlMedium}
                        placeholder={anonymous}
                        height={24}
                        width={24}
                        alt="generic avatar"
                      />
                    </ProfileImageWrapper>
                  ) : (
                    <ProfileIconWrapper>
                      <IconButton
                        classes={{ root: classes.iconProfileButtonRoot }}
                        id="profileAvatarHeaderBar"
                        onClick={this.toggleProfilePopUp}
                      >
                        <AccountCircle />
                      </IconButton>
                    </ProfileIconWrapper>
                  )}
                  {this.state.profilePopUpOpen && voterIsSignedIn && (
                    <HeaderBarProfilePopUp
                      onClick={this.toggleProfilePopUp}
                      hideProfilePopUp={this.hideProfilePopUp}
                      isWelcomeMobilePage
                      profilePopUpOpen={this.state.profilePopUpOpen}
                      signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                      toggleProfilePopUp={this.toggleProfilePopUp}
                      toggleSignInModal={this.toggleSignInModal}
                      transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                      voter={this.state.voter}
                    />
                  )}
                </div>
              )}
              <IconButton
                classes={{ root: classes.iconButton }}
                id="hamburgerMenuHeaderBar"
                onClick={() => this.handleShowMobileNavigation(true)}
              >
                <Menu />
              </IconButton>
              {
                showMobileNavigationMenu && (
                  <MobileNavigationMenu>
                    <NavRow>
                      <Close
                        classes={{ root: classes.navClose }}
                        onClick={() => this.handleShowMobileNavigation(false)}
                      />
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <NavLink id="welcomeForVotersMobile" onClick={() => this.handleToPageFromMobileNav('/welcome')} to="">For Voters</NavLink>
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <NavLink id="welcomeForOrganizationsMobile" onClick={() => this.handleToPageFromMobileNav('/for-organizations')} to="">For Organizations</NavLink>
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <NavLink id="welcomeForCampaignsMobile" onClick={() => this.handleToPageFromMobileNav('/for-campaigns')} to="">For Campaigns</NavLink>
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <NavLink id="welcomeHowItWorksMobile" onClick={() => this.handleToPageFromMobileNav('/how')} to="">How It Works</NavLink>
                    </NavRow>
                    <MobileNavDivider />
                    <NavRow>
                      <Button
                        variant="outlined"
                        classes={{ root: classes.navButtonOutlined }}
                        id="welcomeYourBallotMobile"
                        onClick={() => this.handleToPageFromMobileNav('/ready')}
                      >
                        Your Ballot
                      </Button>
                      { voterIsSignedIn ?
                        (
                          <Button
                            variant="outlined"
                            classes={{ root: classes.navButtonOutlined }}
                            id="welcomeSignOutMobile"
                            onClick={() => this.signOutAndHideProfilePopUp()}
                          >
                            Sign Out
                          </Button>
                        ) :
                        (
                          <Button
                            variant="outlined"
                            classes={{ root: classes.navButtonOutlined }}
                            id="welcomeSignInMobile"
                            onClick={() => this.handleSignInFromMobileNav()}
                          >
                            Sign In
                          </Button>
                        )}
                    </NavRow>
                  </MobileNavigationMenu>
                )
              }
            </MobileTabletView>
          </Navigation>
        </Toolbar>
        {showSignInModal && (
          <SignInModal
            show={showSignInModal}
            closeFunction={this.closeSignInModal}
          />
        )}
        {/* TODO: Backport "@stripe/react-stripe-js" use from Campaigns */}
        {/* {showPaidAccountUpgradeModal && ( */}
        {/*  <PaidAccountUpgradeModal */}
        {/*    initialPaidAccountProcessStep="payForPlan" */}
        {/*    initialPricingPlan={paidAccountUpgradeMode} */}
        {/*    pathname={pathname} */}
        {/*    show={showPaidAccountUpgradeModal} */}
        {/*    toggleFunction={this.closePaidAccountUpgradeModal} */}
        {/*  /> */}
        {/* )} */}
      </AppBar>
    );
  }
}
WelcomeAppbar.propTypes = {
  classes: PropTypes.object,
  pathname: PropTypes.string,
};

const styles = (theme) => ({
  appBarRoot: {
    background: 'transparent',
    alignItems: 'center',
    boxShadow: 'none',
  },
  toolbar: {
    width: 960,
    maxWidth: '95%',
    justifyContent: 'space-between',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  },
  iconButton: {
    color: 'white',
  },
  iconButtonRoot: {
    color: 'rgba(255, 255, 255, .9)',
    outline: 'none !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconProfileButtonRoot: {
    color: 'rgba(255, 255, 255, .9)',
    outline: 'none !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 8,
      paddingRight: 0,
    },
  },
  navButtonOutlined: {
    height: 32,
    borderRadius: 32,
    color: 'white',
    border: '1px solid white',
    marginBottom: '1em',
    fontWeight: '300',
    width: '47%',
    fontSize: 12,
    padding: '5px 0',
    marginTop: 8,
  },
  navClose: {
    position: 'fixed',
    right: 16,
    cursor: 'pointer',
  },
});

const DesktopView = styled.div`
  display: inherit;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const FirstNameWrapper = styled.div`
  font-size: 14px;
  padding-right: 4px;
`;

const MobileTabletView = styled.div`
  display: inherit;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const ProfileIconWrapper = styled.div`
  color: white;
`;

const ProfileImageWrapper = styled.div`
  margin-top: 7px;
  margin-left: 6px;
`;

export default withStyles(styles)(WelcomeAppbar);

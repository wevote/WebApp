import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AccountCircleIcon from '@material-ui/core/SvgIcon/SvgIcon';
import Appbar from '@material-ui/core/AppBar/index';
import Toolbar from '@material-ui/core/Toolbar/index';
import Button from '@material-ui/core/Button/index';
import IconButton from '@material-ui/core/IconButton/index';
import { withStyles } from '@material-ui/core/styles/index';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import cookies from '../../utils/cookies';
import Navigation, { LogoContainer, Divider, NavLink, MobileNavigationMenu, MobileNavDivider, NavRow } from '../Welcome/Navigation';
import HeaderBarLogo from './HeaderBarLogo';
import { historyPush } from '../../utils/cordovaUtils';
import AppStore from '../../stores/AppStore';
import AppActions from '../../actions/AppActions';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import OrganizationActions from '../../actions/OrganizationActions';
import SignInModal from '../Widgets/SignInModal';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterStore from '../../stores/VoterStore';
import VoterSessionActions from '../../actions/VoterSessionActions';

class WelcomeAppbar extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      profilePopUpOpen: false,
      showMobileNavigationMenu: false,
      showSignInModal: AppStore.showSignInModal(),
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      showSignInModal: AppStore.showSignInModal(),
    });
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  handleShowMobileNavigation = (show) => {
    if (show) {
      // If the voter opens the mobile drop-down, set the sign_in_start_path
      cookies.removeItem('sign_in_start_path', '/');
      AppActions.storeSignInStartPath();
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
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  closeSignInModal () {
    AppActions.setShowSignInModal(false);
  }

  render () {
    const { classes, pathname } = this.props;
    // console.log('WelcomeAppbar, pathname: ', pathname);
    const { showMobileNavigationMenu, voter } = this.state;
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
    if (pathname === '/how' || pathname === '/how/for-voters') {
      showWelcomeForVoters = true;
    } else if (pathname === '/how/for-organizations') {
      showWelcomeForOrganizations = true;
    } else if (pathname === '/how/for-campaigns') {
      showWelcomeForCampaigns = true;
    }
    if (pathname === '/welcome') {
      showForOrganizations = true;
    }
    if (!pathname.startsWith('/how') && pathname !== '/welcome' && pathname !== '/more/pricing') {
      showForVoters = true;
    }
    if (!pathname.startsWith('/how') && (pathname === '/for-campaigns' || pathname === '/more/about' || pathname === '/more/pricing')) {
      showForOrganizationsDesktop = true;
    }
    if (!pathname.startsWith('/how') && (pathname === '/welcome' || pathname === '/for-organizations' || pathname === '/more/pricing')) {
      showForCampaignsDesktop = true;
    }
    if (pathname === '/for-campaigns') {
      showHowItWorksForCampaigns = true;
    }
    if (pathname === '/for-organizations') {
      showHowItWorksForOrganizations = true;
    }
    if (pathname === '/welcome' || pathname === '/more/about') {
      showHowItWorksForVoters = true;
    }
    const voterIsSignedIn = voter && voter.is_signed_in;
    const voterPhotoUrlMedium = voter && voter.voter_photo_url_medium;
    return (
      <Appbar position="relative" classes={{ root: classes.appBarRoot }}>
        <Toolbar classes={{ root: classes.toolbar }} disableGutters>
          <LogoContainer>
            <HeaderBarLogo light />
          </LogoContainer>
          <Navigation>
            <DesktopView>
              {showWelcomeForVoters &&
                <NavLink id="welcomePageLink" to="/welcome">Welcome</NavLink>
              }
              {showWelcomeForOrganizations &&
                <NavLink id="welcomePageLink" to="/for-organizations">Welcome</NavLink>
              }
              {showWelcomeForCampaigns &&
                <NavLink id="welcomePageLink" to="/for-campaigns">Welcome</NavLink>
              }
              {/* Don't show 'For Organizations' or 'For Voters' when on How It Works page */}
              {showForOrganizations &&
                <NavLink id="welcomeForOrganizations" to="/for-organizations">For Organizations</NavLink>
              }
              {showForVoters &&
                <NavLink id="welcomeForVoters" to="/welcome">For Voters</NavLink>
              }
              {/* Don't show 'For Organizations' or 'For Campaigns' when on How It Works page */}
              { (showWelcomeForVoters || showWelcomeForOrganizations || showWelcomeForCampaigns || showForOrganizations || showForVoters) &&
                <Divider />
              }
              { showForOrganizationsDesktop &&
                <NavLink id="welcomeForOrganizations" to="/for-organizations">For Organizations</NavLink>
              }
              { showForOrganizationsDesktop && showForCampaignsDesktop &&
                <Divider />
              }
              { showForCampaignsDesktop &&
                <NavLink id="welcomeForCampaigns" to="/for-campaigns">For Campaigns</NavLink>
              }
              {/* Turn off How It Works link on that page */}
              { (showForOrganizationsDesktop || showForCampaignsDesktop) &&
                <Divider />
              }
              {/* Change the How It Works link depending on which welcome page you are on */}
              { showHowItWorksForVoters &&
                <NavLink id="welcomeHowItWorks" to="/how/for-voters">How It Works</NavLink>
              }
              { showHowItWorksForCampaigns &&
                <NavLink id="welcomeHowItWorks" to="/how/for-campaigns">How It Works</NavLink>
              }
              { showHowItWorksForOrganizations &&
                <NavLink id="welcomeHowItWorks" to="/how/for-organizations">How It Works</NavLink>
              }
              { (showHowItWorksForVoters || showHowItWorksForCampaigns || showHowItWorksForOrganizations) &&
                <Divider />
              }
              <NavLink id="welcomeYourBallot" to="/ballot">Your Ballot</NavLink>
              <Divider />
              {!voterIsSignedIn && <NavLink id="welcomeSignIn" to="" onClick={() => this.toggleSignInModal()}>Sign In</NavLink> }
              {voterIsSignedIn &&
              (
                <div>
                  {voterPhotoUrlMedium ? (
                    <div
                      id="profileAvatarHeaderBar"
                      className="header-nav__avatar-container"
                      onClick={this.toggleProfilePopUp}
                    >
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
                      weVoteBrandingOff={this.state.we_vote_branding_off}
                    />
                  )}
                </div>
              )
              }
            </DesktopView>
            <MobileTabletView>
              <NavLink id="welcomeYourBallotMobile" to="/ballot">Your Ballot</NavLink>
              <IconButton
                classes={{ root: classes.iconButton }}
                id="profileAvatarHeaderBar"
                onClick={() => this.handleShowMobileNavigation(true)}
              >
                <MenuIcon />
              </IconButton>
              {
                showMobileNavigationMenu && (
                  <MobileNavigationMenu>
                    <NavRow>
                      <CloseIcon
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
                        onClick={() => this.handleToPageFromMobileNav('/ballot')}
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
                        )
                      }
                    </NavRow>
                  </MobileNavigationMenu>
                )
              }
            </MobileTabletView>
          </Navigation>
        </Toolbar>
        <SignInModal
          show={this.state.showSignInModal}
          toggleFunction={this.closeSignInModal}
        />
      </Appbar>
    );
  }
}

const styles = ({
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

const MobileTabletView = styled.div`
  display: inherit;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export default withStyles(styles)(WelcomeAppbar);

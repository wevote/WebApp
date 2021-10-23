import { IconButton, Toolbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import LazyImage from '../../common/components/LazyImage';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { avatarGeneric, normalizedHref } from '../../utils/applicationUtils';
import { historyPush, isCordova, isIOSAppOnMac, isIPad, isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { AppBarForBackTo, TopRowOneRightContainer } from '../../utils/pageLayoutStyles';
import { shortenText, stringContains } from '../../utils/textFormat';
import { voterPhoto } from '../../utils/voterPhoto';
import SignInButton from '../Widgets/SignInButton';
import HeaderBackToButton from './HeaderBackToButton';

const HeaderBarProfilePopUp = React.lazy(() => import(/* webpackChunkName: 'HeaderBarProfilePopUp' */ './HeaderBarProfilePopUp'));
const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../Widgets/SignInModal'));

const appleSiliconDebug = false;


class HeaderBackTo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      backToLink: '',
      backToLinkText: '',
      profilePopUpOpen: false,
      showSignInModal: AppObservableStore.showSignInModal(),
      voter: {},
      voterFirstName: '',
      voterWeVoteId: '',
    };
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
  }

  componentDidMount () {
    // console.log('HeaderBackTo componentDidMount, this.props: ', this.props);
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    const voter = VoterStore.getVoter();
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter.is_signed_in;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    const voterWeVoteId = voter.we_vote_id;
    this.setState({
      backToLink: this.props.backToLink,
      backToLinkText: this.props.backToLinkText,
      voter,
      voterFirstName,
      voterIsSignedIn,
      voterPhotoUrlMedium,
      voterWeVoteId: voter.we_vote_id || voterWeVoteId,
    });
    if (isIOSAppOnMac() && appleSiliconDebug) {
      console.log('before dummpCss headerBackToAppBar');
      dumpCssFromId('headerBackToAppBar');
    }
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // WARN: Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.
    // console.log('HeaderBackTo componentWillReceiveProps, nextProps: ', nextProps);
    const voter = VoterStore.getVoter();
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter.is_signed_in;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    this.setState({
      backToLink: nextProps.backToLink,
      backToLinkText: nextProps.backToLinkText,
      voter,
      voterFirstName,
      voterIsSignedIn,
      voterPhotoUrlMedium,
      voterWeVoteId: voter.we_vote_id || nextProps.voterWeVoteId,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.backToLink !== nextState.backToLink) {
      // console.log('this.state.backToLink: ', this.state.backToLink, ', nextState.backToLink', nextState.backToLink);
      return true;
    }
    if (this.state.backToLinkText !== nextState.backToLinkText) {
      // console.log('this.state.backToLinkText: ', this.state.backToLinkText, ', nextState.backToLinkText', nextState.backToLinkText);
      return true;
    }
    if (this.state.profilePopUpOpen !== nextState.profilePopUpOpen) {
      // console.log('this.state.profilePopUpOpen: ', this.state.profilePopUpOpen, ', nextState.profilePopUpOpen', nextState.profilePopUpOpen);
      return true;
    }
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      // console.log('this.state.scrolledDown: ', this.state.scrolledDown, ', nextState.scrolledDown', nextState.scrolledDown);
      return true;
    }
    if (this.state.showSignInModal !== nextState.showSignInModal) {
      // console.log('this.state.showSignInModal: ', this.state.showSignInModal, ', nextState.showSignInModal', nextState.showSignInModal);
      return true;
    }
    if (this.state.voterFirstName !== nextState.voterFirstName) {
      // console.log('this.state.voterFirstName: ', this.state.voterFirstName, ', nextState.voterFirstName', nextState.voterFirstName);
      return true;
    }
    if (this.state.voterWeVoteId !== nextState.voterWeVoteId) {
      // console.log('this.state.voterWeVoteId: ', this.state.voterWeVoteId, ', nextState.voterWeVoteId', nextState.voterWeVoteId);
      return true;
    }
    const { voter, voterIsSignedIn, voterPhotoUrlMedium } = this.state;
    const { voter: nextVoter, voterIsSignedIn: nextVoterIsSignedIn, voterPhotoUrlMedium: nextVoterPhotoUrlMedium } = nextState;
    if (!voter && nextVoter) {
      // console.log('FIRST VOTER, voter: ', voter, ', nextVoter: ', nextVoter);
      return true;
    }
    if (voterIsSignedIn !== nextVoterIsSignedIn) {
      // console.log('voterIsSignedIn: ', voterIsSignedIn, ', nextVoterIsSignedIn: ', nextVoterIsSignedIn);
      return true;
    }
    if (voterPhotoUrlMedium !== nextVoterPhotoUrlMedium) {
      // console.log('voterPhotoUrlMedium: ', voterPhotoUrlMedium, ', nextVoterPhotoUrlMedium: ', nextVoterPhotoUrlMedium);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.setState({
      showSignInModal: AppObservableStore.showSignInModal(),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter.is_signed_in;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    this.setState({
      voter,
      voterFirstName,
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }

  handleNavigation = (to) => historyPush(to);

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  hideAccountMenu () {
    this.setState({ profilePopUpOpen: false });
  }

  toggleAccountMenu () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  closeSignInModal () {
    AppObservableStore.setShowSignInModal(false);
  }

  toggleSignInModal () {
    const { showSignInModal } = this.state;
    this.setState({ profilePopUpOpen: false });
    AppObservableStore.setShowSignInModal(!showSignInModal);
  }

  hideProfilePopUp () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  render () {
    renderLog('HeaderBackTo');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('HeaderBackTo render');
    const { classes } = this.props;
    const {
      backToLink, backToLinkText, profilePopUpOpen, showSignInModal,
      voter, voterFirstName, voterIsSignedIn,
    } = this.state;
    const voterPhotoUrlMedium = voterPhoto(voter);

    // const headerClassName = (function header () {
    //   if (isWebApp()) {
    //     return 'page-header';
    //   } else {
    //     return hasIPhoneNotch() ? 'page-header page-header__cordova-iphonex' : 'page-header page-header__cordova';
    //   }
    // }());

    const pathname = normalizedHref();
    const shareButtonInHeader = pathname && stringContains('/office', pathname.toLowerCase());
    const cordovaOverrides = isWebApp() ? {} : { marginLeft: 0, paddingLeft: '15px', right: 'unset' };
    if (isIOSAppOnMac() || isIPad()) {
      cordovaOverrides.height = shareButtonInHeader ? '87px !important' : '68px';
    }
    // dumpObjProps('cordovaOverrides', cordovaOverrides);

    return (
      <AppBarForBackTo
        id="headerBackToAppBar"
        color="default"
        style={cordovaOverrides}
        elevation={0}
      >
        <Toolbar className="header-toolbar header-backto-toolbar" disableGutters>
          <HeaderBackToButton
            backToLink={backToLink}
            backToLinkText={backToLinkText}
            className="HeaderBackTo"
            id="backToLinkTabHeaderBackTo"
          />

          {isWebApp() && (
          <TopRowOneRightContainer
            className="u-cursor--pointer"
            style={{ paddingLeft: `${isCordova() ? '0 !important' : ''}` }}
          >
            <HeaderNotificationMenu />
            {voterIsSignedIn ? (
              <span>
                {voterPhotoUrlMedium ? (
                  <span>
                    <div
                      id="profileAvatarHeaderBar"
                      className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                      onClick={this.toggleProfilePopUp}
                    >
                      <LazyImage
                        className="header-nav__avatar"
                        src={voterPhotoUrlMedium}
                        placeholder={avatarGeneric()}
                        height={34}
                        width={34}
                        alt="Your Settings"
                      />
                    </div>
                  </span>
                ) : (
                  <span>
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
                  </span>
                )}
                {profilePopUpOpen && (
                <HeaderBarProfilePopUp
                  hideProfilePopUp={this.hideProfilePopUp}
                  onClick={this.toggleProfilePopUp}
                  profilePopUpOpen={profilePopUpOpen}
                  signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                  toggleProfilePopUp={this.toggleProfilePopUp}
                  toggleSignInModal={this.toggleSignInModal}
                  transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                  voter={voter}
                />
                )}
              </span>
            ) : (
              <SignInButton toggleSignInModal={this.toggleSignInModal} />
            )}
          </TopRowOneRightContainer>
          )}
        </Toolbar>
        {showSignInModal && (
          <SignInModal
            show={showSignInModal}
            closeFunction={this.closeSignInModal}
          />
        )}
      </AppBarForBackTo>
    );
  }
}
HeaderBackTo.propTypes = {
  backToLink: PropTypes.string,
  backToLinkText: PropTypes.string,
  classes: PropTypes.object,
  voterWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
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
    paddingRight: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  stackedReturnAndShare: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const FirstNameWrapper = styled.div`
  font-size: 14px;
  padding-right: 4px;
`;

// const NotificationsAndProfileWrapper = styled.div`
//   display: flex;
//   z-index: 3; //to float above the account/ProfilePopUp menu option grey div
//   @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
//     padding-left: calc(100% - 154px);
//   }
// `;

export default withStyles(styles)(HeaderBackTo);


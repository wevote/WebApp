import { AccountCircle } from '@mui/icons-material';
import { IconButton, Toolbar } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LazyImage from '../../common/components/LazyImage';
import apiCalming from '../../common/utils/apiCalming';
import { hasDynamicIsland, isIOS, isIOSAppOnMac, isIPad } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import voterPhoto from '../../common/utils/voterPhoto';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { avatarGeneric } from '../../utils/applicationUtils';
import { AppBarForBackTo, TopRowOneRightContainer } from '../Style/pageLayoutStyles';
import SignInButton from '../Widgets/SignInButton';
import HeaderBackToButton from './HeaderBackToButton';

const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));

const appleSiliconDebug = false;


class HeaderBackTo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      backToLink: '',
      backToLinkText: '',
      showSignInModal: AppObservableStore.showSignInModal(),
      voter: {},
      voterFirstName: '',
      voterWeVoteId: '',
    };
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
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
  }

  goToSettings () {
    if (isMobileScreenSize()) {
      historyPush('/settings/hamburger');
    } else {
      historyPush('/settings/profile');
    }
  }

  closeSignInModal () {
    AppObservableStore.setShowSignInModal(false);
  }

  toggleSignInModal () {
    const { showSignInModal } = this.state;
    AppObservableStore.setShowSignInModal(!showSignInModal);
  }

  render () {
    renderLog('HeaderBackTo');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('HeaderBackTo render');
    const { classes } = this.props;
    const {
      backToLink, backToLinkText, showSignInModal,
      voter, voterIsSignedIn,
    } = this.state;
    const voterPhotoUrlMedium = voterPhoto(voter);
    const pathname = normalizedHref();
    const shareButtonInHeader = pathname && stringContains('/office', pathname.toLowerCase());
    let pad = isIOS() ? '34px 15px 0 0' : '0 15px 0 0';
    if (hasDynamicIsland()) {
      pad = '56px 15px 0 0';
    }
    const cordovaStyles = {
      marginLeft: 0,
      padding: pad,
      right: 'unset',
    };
    const cordovaOverrides = isWebApp() ? { paddingRight: 15 } : cordovaStyles;
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

          <TopRowOneRightContainer
            className="u-cursor--pointer"
            style={{ paddingLeft: `${isCordova() ? '0 !important' : ''}` }}
          >
            {voterIsSignedIn && (
              <Suspense fallback={<></>}>
                <HeaderNotificationMenu />
              </Suspense>
            )}
            {voterIsSignedIn ? (
              <span onClick={this.goToSettings}>
                {voterPhotoUrlMedium ? (
                  <span>
                    <div
                      id="profileAvatarHeaderBar"
                    >
                      <LazyImage
                        isAvatar
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
                      size="large"
                    >
                      <AccountCircle />
                    </IconButton>
                  </span>
                )}
              </span>
            ) : (
              <SignInButton toggleSignInModal={this.toggleSignInModal} />
            )}
          </TopRowOneRightContainer>
        </Toolbar>
        {showSignInModal && (
          <Suspense fallback={<></>}>
            <SignInModal
              signInTitle="Sign In or Join"
              signInSubTitle=""
              toggleOnClose={this.closeSignInModal}
              uponSuccessfulSignIn={this.closeSignInModal}
            />
          </Suspense>
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

export default withStyles(styles)(HeaderBackTo);


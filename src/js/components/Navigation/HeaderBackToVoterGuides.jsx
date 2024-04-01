import { AccountCircle, Place } from '@mui/icons-material';
import { AppBar, Button, IconButton, Toolbar, Tooltip } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LazyImage from '../../common/components/LazyImage';
import apiCalming from '../../common/utils/apiCalming';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import voterPhoto from '../../common/utils/voterPhoto';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import isMobile from '../../utils/isMobile';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../common/utils/textFormat';
import VoterGuideChooseElectionModal from '../VoterGuide/VoterGuideChooseElectionModal';
import SignInButton from '../Widgets/SignInButton';
import EndorsementModeTabs from './EndorsementModeTabs';
import HeaderBackToButton from './HeaderBackToButton';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));


class HeaderBackToVoterGuides extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showNewVoterGuideModal: false,
      showSignInModal: false,
      voter: {},
      voterIsSignedIn: false,
    };
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.toggleVoterGuideModal = this.toggleVoterGuideModal.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
  }

  componentDidMount () {
    // console.log('HeaderBackToVoterGuides componentDidMount, this.props: ', this.props);
    const { params } = this.props;
    if (params && params.voter_guide_we_vote_id) {
      // Jan 2021: Did this ever work?  We receive organization_we_vote_id in the params
      // This is an example of why "Prop spreading" is a good thing to forbid
      this.setState({
        voterGuideWeVoteId: params.voter_guide_we_vote_id,
      });
    }
    let voterGuide;
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
      }
    }
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
    this.onBallotStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    // let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (params) {
      organizationWeVoteId = params.organization_we_vote_id || '';
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }

    // console.log('organizationWeVoteId: ', organizationWeVoteId);
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      showNewVoterGuideModal: AppObservableStore.showNewVoterGuideModal(),
      showSignInModal: AppObservableStore.showSignInModal(),
      voter,
      voterIsSignedIn,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // WARN: Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.
    // console.log('HeaderBackToVoterGuides componentWillReceiveProps, nextProps: ', nextProps);
    // let officeName;
    let organization = {};
    let organizationWeVoteId;
    const { params: nextParams } = nextProps;
    if (nextParams) {
      organizationWeVoteId = nextParams.organization_we_vote_id || '';
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }

    // console.log('organizationWeVoteId: ', organizationWeVoteId);

    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterIsSignedIn,
      voterGuideWeVoteId: nextParams ? nextParams.voter_guide_we_vote_id : undefined,
    });

    let voterGuide;
    if (nextParams && nextParams.voter_guide_we_vote_id && isProperlyFormattedVoterGuideWeVoteId(nextParams.voter_guide_we_vote_id)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextParams.voter_guide_we_vote_id);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
      }
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.setState({
      showNewVoterGuideModal: AppObservableStore.showNewVoterGuideModal(),
      showSignInModal: AppObservableStore.showSignInModal(),
    });
  }

  onBallotStoreChange () {
    // this.setState({ bookmarks: BallotStore.bookmarks });
  }

  onOrganizationStoreChange () {
    this.setState();
  }

  onVoterGuideStoreChange () {
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          voterGuide,
        });
      }
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterIsSignedIn,
    });
  }

  goToVoterGuideDisplay = () => {
    let voterGuideDisplay = '/ballot';
    if (this.state.voterGuide) {
      voterGuideDisplay = `/voterguide/${this.state.voterGuide.organization_we_vote_id}/ballot/election/${this.state.voterGuide.google_civic_election_id}/positions`;
    }
    historyPush(voterGuideDisplay);
  }

  goToSettings () {
    if (isMobileScreenSize()) {
      historyPush('/settings/hamburger');
    } else {
      historyPush('/settings/general');
    }
  }

  transitionToYourVoterGuide () {
    const { voter } = this.state;
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(voter.linked_organization_we_vote_id, false, true);
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    VoterGuideActions.voterGuideFollowersRetrieve(voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voter.linked_organization_we_vote_id);
  }

  closeSignInModal () {
    AppObservableStore.setShowSignInModal(false);
  }

  toggleSignInModal () {
    const { showSignInModal } = this.state;
    AppObservableStore.setShowSignInModal(!showSignInModal);
  }

  toggleVoterGuideModal () {
    // console.log('toggleVoterGuideModal');
    const { showNewVoterGuideModal } = this.state;
    AppObservableStore.setShowNewVoterGuideModal(!showNewVoterGuideModal);
  }

  render () {
    renderLog('HeaderBackToVoterGuides');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      showNewVoterGuideModal, showSignInModal,
      voter, voterIsSignedIn,
    } = this.state;
    const { classes } = this.props;
    const pathname = normalizedHref();
    const voterPhotoUrlMedium = voterPhoto(voter);

    let backToLink = '/settings/voterguidelist'; // default
    let backToOrganizationLinkText = 'Voter Guides'; // Back to

    if (stringContains('/settings/menu', pathname)) {
      backToOrganizationLinkText = ''; // Back to 'Your Endorsements'
      if (isWebApp()) {
        backToLink = isMobile() ? '/settings/voterguidesmenu' : '/settings/voterguidelist';
      } else {
        backToLink = '/settings/voterguidesmenu';
      }
    } else if (stringContains('/settings/general', pathname)) {
      // const voterGuideWeVoteId = params.voter_guide_we_vote_id;
      backToOrganizationLinkText = ''; // Back to 'Your Endorsements'
      backToLink = '/settings/voterguidelist';
    } else if (stringContains('/settings/positions', pathname)) {
      backToOrganizationLinkText = 'Your Endorsements';
      backToLink = '/settings/voterguidelist';
    } else if (stringContains('/vg/', pathname) && stringContains('/settings', pathname)) {
      backToOrganizationLinkText = ''; // Back to 'Your Endorsements'
      backToLink = '/settings/voterguidelist';
    }
    const electionName = BallotStore.currentBallotElectionName;
    // const atLeastOnePositionFoundForThisElection = positionListForOneElection && positionListForOneElection.length !== 0;

    const changeElectionButtonHtml = isMobileScreenSize() ? (<span />) : (
      <Tooltip title="Change Election" aria-label="Change Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
        <span>
          <IconButton
            classes={{ root: classes.iconButtonRoot }}
            id="changeVoterGuideElectionHeaderBar"
            onClick={this.toggleVoterGuideModal}
            size="large"
          >
            <Place />
          </IconButton>
          <Button
            color="primary"
            classes={{ root: classes.addressButtonRoot }}
            id="changeVoterGuideElectionHeaderBarText"
            onClick={this.toggleVoterGuideModal}
          >
            <span className="u-show-desktop-tablet">Change Election</span>
            <span className="u-show-mobile-bigger-than-iphone5">Change Election</span>
            <span className="u-show-mobile-iphone5-or-smaller">Election</span>
          </Button>
        </span>
      </Tooltip>
    );

    let appBarCname = 'page-header page-header__voter-guide-creator';
    if (hasIPhoneNotch()) {
      appBarCname = 'page-header page-header__cordova-iphonex page-header__voter-guide-creator';
    } else if (isCordova()) {
      appBarCname = 'page-header page-header__cordova page-header__voter-guide-creator';
    }

    return (
      <AppBar
        id="headerBackToVoterGuidesAppBar"
        className={appBarCname}
        color="default"
        classes={{ root: classes.stackedReturnAndShare }}
        elevation={0}
      >
        <Toolbar className="header-toolbar header-backto-toolbar" disableGutters>
          <HeaderBackToButton
            backToLink={backToLink}
            backToLinkText={backToOrganizationLinkText}
            className="HeaderBackToVoterGuides"
            id="backToLinkTabHeaderBackToVoterGuides"
          />

          <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex">
            { changeElectionButtonHtml }
            {voterIsSignedIn ? (
              <span onClick={this.goToSettings}>
                {voterPhotoUrlMedium ? (
                  <div
                    id="profileAvatarHeaderBar"
                    className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                  >
                    <LazyImage
                      isAvatar
                      src={voterPhotoUrlMedium}
                      placeholder={avatarGeneric()}
                      style={{
                        marginLeft: 16,
                      }}
                      height={34}
                      width={34}
                      alt="Your Settings"
                    />
                  </div>
                ) : (
                  <div>
                    <IconButton
                      classes={{ root: classes.iconButtonRoot }}
                      id="profileAvatarHeaderBar"
                      size="large"
                    >
                      <AccountCircle />
                    </IconButton>
                  </div>
                )}
              </span>
            ) : (
              <SignInButton toggleSignInModal={this.toggleSignInModal} />
            )}
          </div>
        </Toolbar>
        <VoterGuideTitle className="header-toolbar">
          {electionName}
        </VoterGuideTitle>
        <EndorsementModeSwitch className="header-toolbar">
          <EndorsementModeTabs />
          <PreviewButtonWrapper className="u-show-desktop-tablet">
            <Button
              classes={{ root: classes.previewButton }}
              color="primary"
              id="voterGuideSettingsPositionsSeeFullBallot"
              onClick={this.goToVoterGuideDisplay}
              variant="contained"
            >
              See Preview&nbsp;&nbsp;&gt;
            </Button>
          </PreviewButtonWrapper>
        </EndorsementModeSwitch>
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
        {showNewVoterGuideModal && (
          <VoterGuideChooseElectionModal
            show={showNewVoterGuideModal}
            toggleFunction={this.toggleVoterGuideModal}
            pathname={pathname}
          />
        )}
      </AppBar>
    );
  }
}
HeaderBackToVoterGuides.propTypes = {
  classes: PropTypes.object,
  params: PropTypes.object,
};

const styles = (theme) => ({
  headerBadge: {
    right: -15,
    top: 9,
  },
  padding: {
    padding: `0 ${theme.spacing(2)}`,
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
    marginTop: 4,
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
  previewButton: {
    height: 27,
    marginBottom: 3,
    padding: '2px 16px',
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
  stackedReturnAndShare: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const PreviewButtonWrapper = styled('div')`
  margin-right: 30px;
`;

const VoterGuideTitle = styled('div')`
  margin-left: calc((100vw - 960px)/2);
  width: 100%;
`;

const EndorsementModeSwitch = styled('div')`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-left: calc((100vw - 960px)/2);
  width: 100%;
`;

export default withStyles(styles)(HeaderBackToVoterGuides);

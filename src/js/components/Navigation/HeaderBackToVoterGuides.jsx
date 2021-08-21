import { AppBar, Button, IconButton, Toolbar, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle, Place } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { hasIPhoneNotch, historyPush, isCordova, isWebApp } from '../../utils/cordovaUtils';
import isMobile from '../../utils/isMobile';
import LazyImage from '../../common/components/LazyImage';
import { renderLog } from '../../utils/logging';
import { isProperlyFormattedVoterGuideWeVoteId, shortenText, stringContains } from '../../utils/textFormat';
import { voterPhoto } from '../../utils/voterPhoto';
import VoterGuideChooseElectionModal from '../VoterGuide/VoterGuideChooseElectionModal';
import EndorsementModeTabs from './EndorsementModeTabs';
import HeaderBackToButton from './HeaderBackToButton';

const HeaderBarProfilePopUp = React.lazy(() => import(/* webpackChunkName: 'HeaderBarProfilePopUp' */ './HeaderBarProfilePopUp'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../Widgets/SignInModal'));

const anonymous = '../../../img/global/icons/avatar-generic.png';


class HeaderBackToVoterGuides extends Component {
  constructor (props) {
    super(props);
    this.state = {
      profilePopUpOpen: false,
      showNewVoterGuideModal: false,
      showSignInModal: false,
      voter: {},
      voterFirstName: '',
      voterIsSignedIn: false,
    };
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
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
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      showNewVoterGuideModal: AppObservableStore.showNewVoterGuideModal(),
      showSignInModal: AppObservableStore.showSignInModal(),
      voter,
      voterFirstName,
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
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterFirstName,
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
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterFirstName,
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

  transitionToYourVoterGuide () {
    const { voter } = this.state;
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voter.linked_organization_we_vote_id);
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

  toggleVoterGuideModal () {
    // console.log('toggleVoterGuideModal');
    const { showNewVoterGuideModal } = this.state;
    AppObservableStore.setShowNewVoterGuideModal(!showNewVoterGuideModal);
  }

  render () {
    renderLog('HeaderBackToVoterGuides');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      profilePopUpOpen, showNewVoterGuideModal, showSignInModal,
      voter, voterFirstName, voterIsSignedIn,
    } = this.state;
    const { classes } = this.props;
    const { location: { pathname } } = window;
    const voterPhotoUrlMedium = voterPhoto(voter);

    let backToLink = '/settings/voterguidelist'; // default
    let backToOrganizationLinkText = 'Voter Guides'; // Back to
    const pathnameLowerCase = pathname.toLowerCase() || '';

    if (stringContains('/settings/menu', pathnameLowerCase)) {
      backToOrganizationLinkText = ''; // Back to 'Your Endorsements'
      if (isWebApp()) {
        backToLink = isMobile() ? '/settings/voterguidesmenu' : '/settings/voterguidelist';
      } else {
        backToLink = '/settings/voterguidesmenu';
      }
    } else if (stringContains('/settings/general', pathnameLowerCase)) {
      // const voterGuideWeVoteId = params.voter_guide_we_vote_id;
      backToOrganizationLinkText = ''; // Back to 'Your Endorsements'
      backToLink = '/settings/voterguidelist';
    } else if (stringContains('/settings/positions', pathnameLowerCase)) {
      backToOrganizationLinkText = 'Your Endorsements';
      backToLink = '/settings/voterguidelist';
    } else if (stringContains('/vg/', pathnameLowerCase) && stringContains('/settings', pathnameLowerCase)) {
      backToOrganizationLinkText = ''; // Back to 'Your Endorsements'
      backToLink = '/settings/voterguidelist';
    }
    const electionName = BallotStore.currentBallotElectionName;
    // const atLeastOnePositionFoundForThisElection = positionListForOneElection && positionListForOneElection.length !== 0;

    const changeElectionButtonHtml = (
      <Tooltip title="Change Election" aria-label="Change Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
        <span>
          <IconButton
            classes={{ root: classes.iconButtonRoot }}
            id="changeVoterGuideElectionHeaderBar"
            onClick={this.toggleVoterGuideModal}
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
            id="backToLinkTabHeader"
          />

          <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex">
            { changeElectionButtonHtml }
            {voterIsSignedIn ? (
              <span>
                {voterPhotoUrlMedium ? (
                  <div
                    id="profileAvatarHeaderBar"
                    className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                    onClick={this.toggleProfilePopUp}
                  >
                    <LazyImage
                      className="header-nav__avatar"
                      src={voterPhotoUrlMedium}
                      placeholder={anonymous}
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
                      onClick={this.toggleProfilePopUp}
                    >
                      <FirstNameWrapper>
                        {shortenText(voterFirstName, 9)}
                      </FirstNameWrapper>
                      <AccountCircle />
                    </IconButton>
                  </div>
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
              <Button
                className="header-sign-in"
                classes={{ root: classes.headerButtonRoot }}
                color="primary"
                id="signInHeaderBar"
                onClick={this.toggleSignInModal}
                variant="text"
              >
                <span className="u-no-break">Sign In</span>
              </Button>
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
          <SignInModal
            show={showSignInModal}
            closeFunction={this.closeSignInModal}
          />
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

const FirstNameWrapper = styled.div`
  font-size: 14px;
  padding-right: 4px;
`;

const PreviewButtonWrapper = styled.div`
  margin-right: 30px;
`;

const VoterGuideTitle = styled.div`
  margin-left: calc((100vw - 960px)/2);
  width: 100%;
`;

const EndorsementModeSwitch = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-left: calc((100vw - 960px)/2);
  width: 100%;
`;

export default withStyles(styles)(HeaderBackToVoterGuides);

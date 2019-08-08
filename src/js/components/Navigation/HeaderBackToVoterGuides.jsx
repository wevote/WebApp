import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';
import AppStore from '../../stores/AppStore';
import AppActions from '../../actions/AppActions';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import cookies from '../../utils/cookies';
import { isWebApp } from '../../utils/cordovaUtils';
import EndorsementModeTabs from './EndorsementModeTabs';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import isMobile from '../../utils/isMobile';
import { renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import HeaderBackToButton from './HeaderBackToButton';
import SignInModal from '../Widgets/SignInModal';
import VoterGuideChooseElectionModal from '../VoterGuide/VoterGuideChooseElectionModal';

class HeaderBackToVoterGuides extends Component {
  static propTypes = {
    classes: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string,
    voter: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      profilePopUpOpen: false,
      candidateWeVoteId: '',
      organizationWeVoteId: '',
      showNewVoterGuideModal: false,
      showSignInModal: false,
      voter: {},
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
    this.onBallotStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    let candidateWeVoteId;
    let officeWeVoteId;
    // let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (this.props.params) {
      candidateWeVoteId = this.props.params.candidate_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log('HeaderBackToVoterGuides, candidateWeVoteId:', candidateWeVoteId, ', candidate:', candidate);
        officeWeVoteId = candidate.contest_officeWeVoteId;
        // officeName = candidate.contest_office_name;
      }

      organizationWeVoteId = this.props.params.organization_we_vote_id || '';
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }

    // console.log('candidateWeVoteId: ', candidateWeVoteId);
    // console.log('organizationWeVoteId: ', organizationWeVoteId);

    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      candidateWeVoteId,
      officeWeVoteId,
      organizationWeVoteId,
      showNewVoterGuideModal: AppStore.showNewVoterGuideModal(),
      showSignInModal: AppStore.showSignInModal(),
      voter: this.props.voter,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('HeaderBackToVoterGuides componentWillReceiveProps, nextProps: ', nextProps);
    let candidateWeVoteId;
    let officeWeVoteId;
    // let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (nextProps.params) {
      candidateWeVoteId = nextProps.params.candidate_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log('HeaderBackToVoterGuides, candidateWeVoteId:', candidateWeVoteId, ', candidate:', candidate);
        officeWeVoteId = candidate.contest_office_we_vote_id;
        // officeName = candidate.contest_office_name;
      }

      organizationWeVoteId = nextProps.params.organization_we_vote_id || '';
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
      }
    }

    // console.log('candidateWeVoteId: ', candidateWeVoteId);
    // console.log('organizationWeVoteId: ', organizationWeVoteId);

    const weVoteBrandingOffFromUrl = nextProps.location.query ? nextProps.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      candidateWeVoteId,
      officeWeVoteId,
      organizationWeVoteId,
      voter: nextProps.voter,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.ballotStoreListener.remove();
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      showNewVoterGuideModal: AppStore.showNewVoterGuideModal(),
      showSignInModal: AppStore.showSignInModal(),
    });
  }

  onBallotStoreChange () {
    // this.setState({ bookmarks: BallotStore.bookmarks });
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.state;
    // console.log('Candidate onCandidateStoreChange');

    // let officeName;
    let officeWeVoteId;
    if (candidateWeVoteId && candidateWeVoteId !== '') {
      const candidate = CandidateStore.getCandidate(candidateWeVoteId);

      // console.log('HeaderBackToVoterGuides -- onCandidateStoreChange, candidateWeVoteId:', this.state.candidateWeVoteId, ', candidate:', candidate);
      // officeName = candidate.contest_office_name;
      officeWeVoteId = candidate.contest_office_we_vote_id;
    }

    this.setState({
      officeWeVoteId,
    });
  }

  onOrganizationStoreChange () {
    this.setState();
  }

  getOfficeLink () {
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== '') {
      return `/office/${this.state.officeWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      return `/office/${this.state.officeWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  getVoterGuideLink () {
    return `/voterguide/${this.state.organizationWeVoteId}`;
  }

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

  signOutAndHideAccountMenu () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  toggleVoterGuideModal () {
    // console.log('toggleVoterGuideModal');
    const { showNewVoterGuideModal } = this.state;
    AppActions.setShowNewVoterGuideModal(!showNewVoterGuideModal);
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const { showNewVoterGuideModal, voter } = this.state;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;

    let backToLink = '/settings/voterguidelist'; // default
    let backToOrganizationLinkText = 'Voter Guides'; // Back to
    const { pathname } = this.props;
    const pathnameLowerCase = pathname.toLowerCase() || '';

    if (stringContains('/settings/menu', pathnameLowerCase)) {
      backToOrganizationLinkText = 'Your Voter Guides'; // Back to
      if (isWebApp()) {
        backToLink = isMobile() ? '/settings/voterguidesmenu' : '/settings/voterguidelist';
      } else {
        backToLink = '/settings/voterguidesmenu';
      }
    } else if (stringContains('/settings/general', pathnameLowerCase) || stringContains('/settings/positions', pathnameLowerCase)) {
      // const voterGuideWeVoteId = this.props.params.voter_guide_we_vote_id;
      backToOrganizationLinkText = 'Your Voter Guides';
      backToLink = '/settings/voterguidelist';
    } else if (stringContains('/vg/', pathnameLowerCase) && stringContains('/settings', pathnameLowerCase)) {
      backToOrganizationLinkText = 'Your Voter Guides'; // Back to
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
            <PlaceIcon />
          </IconButton>
          <span className="u-show-desktop-tablet">
            <Button
              color="primary"
              classes={{ root: classes.addressButtonRoot }}
              id="changeVoterGuideElectionHeaderBarText"
              onClick={this.toggleVoterGuideModal}
            >
              Change Election
            </Button>
          </span>
        </span>
      </Tooltip>
    );

    return (
      <AppBar className={isWebApp() ? 'page-header page-header__voter-guide-creator' : 'page-header page-header__cordova page-header__voter-guide-creator'} color="default">
        <Toolbar className="header-toolbar header-backto-toolbar" disableGutters>
          <HeaderBackToButton
            backToLink={backToLink}
            backToLinkText={backToOrganizationLinkText}
            id="backToLinkTabHeader"
          />

          {this.state.profilePopUpOpen && voter.is_signed_in && (
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

          {isWebApp() && (
          <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none">
            { changeElectionButtonHtml }
            {voterPhotoUrlMedium ? (
              <div id="profileAvatarHeaderBar" className="header-nav__avatar-container" onClick={this.toggleAccountMenu}>
                <img
                  className="header-nav__avatar"
                  alt="profile avatar"
                  src={voterPhotoUrlMedium}
                  height={34}
                  width={34}
                />
              </div>
            ) : (
              <Button
                className="header-sign-in"
                color="primary"
                id="signInHeaderBar"
                onClick={this.toggleSignInModal}
                variant="text"
              >
              Sign In
              </Button>
            )}
          </div>
          )}
        </Toolbar>
        <VoterGuideTitle className="header-toolbar">
          {electionName}
        </VoterGuideTitle>
        <EndorsementModeSwitch className="header-toolbar">
          <EndorsementModeTabs />
        </EndorsementModeSwitch>
        <SignInModal
          show={this.state.showSignInModal}
          toggleFunction={this.closeSignInModal}
        />
        {showNewVoterGuideModal && (
          <VoterGuideChooseElectionModal
            show={showNewVoterGuideModal}
            toggleFunction={this.toggleVoterGuideModal}
          />
        )}
      </AppBar>
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
    [theme.breakpoints.down('sm')]: {
      paddingRight: 10,
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

const VoterGuideTitle = styled.div`
  align-items: left;
  margin-left: 30px;
  width: 100%;
`;

const EndorsementModeSwitch = styled.div`
  align-items: left;
  margin-left: 30px;
  width: 100%;
`;

export default withStyles(styles)(HeaderBackToVoterGuides);

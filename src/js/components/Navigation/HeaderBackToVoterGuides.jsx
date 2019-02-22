import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import cookies from '../../utils/cookies';
import { hasIPhoneNotch, historyPush, isWebApp } from '../../utils/cordovaUtils';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import isMobile from '../../utils/isMobile';
import { renderLog } from '../../utils/logging';
import { shortenText, stringContains } from '../../utils/textFormat';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';

export default class HeaderBackToVoterGuides extends Component {
  static propTypes = {
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
      voter: {},
    };
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
  }

  componentDidMount () {
    // console.log("HeaderBackToBar componentDidMount, this.props: ", this.props);
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onBallotStoreChange();

    let candidateWeVoteId;
    let officeWeVoteId;
    // let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (this.props.params) {
      candidateWeVoteId = this.props.params.candidate_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log("HeaderBackToBar, candidateWeVoteId:", candidateWeVoteId, ", candidate:", candidate);
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

    // console.log("candidateWeVoteId: ", candidateWeVoteId);
    // console.log("organizationWeVoteId: ", organizationWeVoteId);

    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      candidateWeVoteId,
      officeWeVoteId,
      organizationWeVoteId,
      voter: this.props.voter,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("HeaderBackToBar componentWillReceiveProps, nextProps: ", nextProps);
    let candidateWeVoteId;
    let officeWeVoteId;
    // let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (nextProps.params) {
      candidateWeVoteId = nextProps.params.candidate_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log("HeaderBackToBar, candidateWeVoteId:", candidateWeVoteId, ", candidate:", candidate);
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

    // console.log("candidateWeVoteId: ", candidateWeVoteId);
    // console.log("organizationWeVoteId: ", organizationWeVoteId);

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
    this.ballotStoreListener.remove();
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onBallotStoreChange () {
    // this.setState({ bookmarks: BallotStore.bookmarks });
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.state;
    // console.log("Candidate onCandidateStoreChange");

    // let officeName;
    let officeWeVoteId;
    if (candidateWeVoteId && candidateWeVoteId !== '') {
      const candidate = CandidateStore.getCandidate(candidateWeVoteId);

      // console.log("HeaderBackToBar -- onCandidateStoreChange, candidateWeVoteId:", this.state.candidateWeVoteId, ", candidate:", candidate);
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

  toggleAccountMenu () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  hideAccountMenu () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideAccountMenu () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
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

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  hideProfilePopUp () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  render () {
    renderLog(__filename);
    const { voter } = this.state;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;

    let backToLink = '/settings/voterguidelist'; // default
    let backToOrganizationLinkText = 'Back to Voter Guides';

    if (stringContains('/settings/menu', this.props.pathname)) {
      backToOrganizationLinkText = 'Back to Your Voter Guides';
      if (isWebApp()) {
        backToLink = isMobile() ? '/settings/voterguidesmenu' : '/settings/voterguidelist';
      } else {
        backToLink = '/settings/voterguidesmenu';
      }
    } else if (stringContains('/settings/general', this.props.pathname) || stringContains('/settings/positions', this.props.pathname)) {
      const voterGuideWeVoteId = this.props.params.voter_guide_we_vote_id;
      if (isMobile()) {
        backToOrganizationLinkText = 'Voter Guide Options';

        backToLink = voterGuideWeVoteId && voterGuideWeVoteId !== '' ?
          `/vg/${voterGuideWeVoteId}/settings/menu` :
          '/settings/voterguidesmenu';
      } else {
        backToOrganizationLinkText = 'Back to Your Voter Guides';

        backToLink = '/settings/voterguidelist';
      }
    } else if (stringContains('/vg/', this.props.pathname) && stringContains('/settings', this.props.pathname)) {
      backToOrganizationLinkText = 'Back to Your Voter Guides';

      backToLink = '/settings/voterguidelist';
    }

    const backToOrganizationLinkTextMobile = shortenText(backToOrganizationLinkText, 20);

    return (
      <AppBar className={isWebApp() ? 'page-header' : 'page-header page-header__cordova'} color="default">
        <Toolbar className="header-toolbar header-backto-toolbar" disableGutters>
          <Button
          variant="contained"
          color="primary"
          className={`page-header__backToButton ${hasIPhoneNotch() ? 'page-header__backToButtonIPhoneX' : ''}`}
          onClick={() => historyPush(backToLink)}
          >
            <ion-icon name="arrow-back" />
            &nbsp;
            {backToOrganizationLinkTextMobile}
          </Button>

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

          {isWebApp() && (
          <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleAccountMenu}>
            {voterPhotoUrlMedium ? (
              <div id="js-header-avatar" className="header-nav__avatar-container">
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
              variant="text"
              color="primary"
              href="/settings/account"
              >
              Sign In
              </Button>
            )}
          </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

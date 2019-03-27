import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import cookies from '../../utils/cookies';
import { hasIPhoneNotch, historyPush, isWebApp } from '../../utils/cordovaUtils';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import { shortenText } from '../../utils/textFormat';

const styles = theme => ({
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
});

class HeaderBackToSettings extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string,
    voter: PropTypes.object,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      profilePopUpOpen: false,
      candidateWeVoteId: '',
      organization: {},
      organizationWeVoteId: '',
      voter: {},
    };
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
  }

  componentDidMount () {
    // console.log("HeaderBackToSettings componentDidMount, this.props: ", this.props);
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onBallotStoreChange();

    let candidateWeVoteId;
    let officeWeVoteId;
    let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (this.props.params) {
      candidateWeVoteId = this.props.params.candidate_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log("HeaderBackToSettings, candidateWeVoteId:", candidateWeVoteId, ", candidate:", candidate);
        officeWeVoteId = candidate.contest_officeWeVoteId;
        officeName = candidate.contest_office_name;
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
      officeName,
      officeWeVoteId,
      organization,
      organizationWeVoteId,
      voter: this.props.voter,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("HeaderBackToSettings componentWillReceiveProps, nextProps: ", nextProps);
    let candidateWeVoteId;
    let officeWeVoteId;
    let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (nextProps.params) {
      candidateWeVoteId = nextProps.params.candidate_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidate(candidateWeVoteId);

        // console.log("HeaderBackToSettings, candidateWeVoteId:", candidateWeVoteId, ", candidate:", candidate);
        officeWeVoteId = candidate.contest_office_we_vote_id;
        officeName = candidate.contest_office_name;
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
      officeName,
      officeWeVoteId,
      organization,
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
    // console.log("Candidate onCandidateStoreChange");
    const { candidateWeVoteId } = this.state;
    let officeName;
    let officeWeVoteId;
    if (candidateWeVoteId && candidateWeVoteId !== '') {
      const candidate = CandidateStore.getCandidate(candidateWeVoteId);

      // console.log("HeaderBackToSettings -- onCandidateStoreChange, candidateWeVoteId:", this.state.candidateWeVoteId, ", candidate:", candidate);
      officeName = candidate.contest_office_name;
      officeWeVoteId = candidate.contest_office_we_vote_id;
    }

    this.setState({
      officeName,
      officeWeVoteId,
    });
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
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

  render () {
    renderLog(__filename);
    const { voter } = this.state;
    const { classes } = this.props;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    const backToLink = isWebApp() ? '/settings/menu' : '/more/hamburger';

    let backToOrganizationLinkText;
    if (this.state.organizationWeVoteId && this.state.organizationWeVoteId !== '') {
      backToOrganizationLinkText = 'Voter Guide'; // Back to
    } else {
      backToOrganizationLinkText = 'Settings'; // Back to
    }

    if (this.props.params.back_to_variable === 'bto' || this.props.params.back_to_variable === 'btdo') { // back-to-default-office
      if (this.state.officeName) {
        backToOrganizationLinkText = `${this.state.officeName}`; // Back to
      } else {
        backToOrganizationLinkText = 'Back';
      }
    } else if (this.state.organization && this.state.organization.organization_name) {
      backToOrganizationLinkText = `Back to ${this.state.organization.organization_name}`;
    }

    const backToOrganizationLinkTextMobile = shortenText(backToOrganizationLinkText, 20);
    const headerClassName = (function header () {
      if (isWebApp()) {
        return 'page-header';
      } else {
        return hasIPhoneNotch() ? 'page-header page-header__cordova-iphonex' : 'page-header page-header__cordova';
      }
    }());


    return (
      <AppBar className={headerClassName} color="default">
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
              classes={{ root: classes.headerButtonRoot }}
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

export default withStyles(styles)(HeaderBackToSettings);


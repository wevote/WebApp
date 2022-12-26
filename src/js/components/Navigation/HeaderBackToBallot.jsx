import { AccountCircle } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LazyImage from '../../common/components/LazyImage';
import apiCalming from '../../common/utils/apiCalming';
import { isIOSAppOnMac, isIPadGiantSize } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref, normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import voterPhoto from '../../common/utils/voterPhoto';
import webAppConfig from '../../config';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import OfficeStore from '../../stores/OfficeStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { avatarGeneric } from '../../utils/applicationUtils';
import { AppBarForBackTo, OfficeShareWrapper, TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer, TopRowTwoRightContainer } from '../Style/pageLayoutStyles';
import SignInButton from '../Widgets/SignInButton';
import HeaderBackToButton from './HeaderBackToButton';

const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));
const ShareButtonDesktopTablet = React.lazy(() => import(/* webpackChunkName: 'ShareButtonDesktopTablet' */ '../Share/ShareButtonDesktopTablet'));
const ShareModal = React.lazy(() => import(/* webpackChunkName: 'ShareModal' */ '../Share/ShareModal'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../SignIn/SignInModal'));

const appleSiliconDebug = false;
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


class HeaderBackToBallot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      backToCandidateWeVoteId: '',
      backToMeasure: {},
      backToMeasureWeVoteId: '',
      backToVariable: '',
      candidateWeVoteId: '',
      googleCivicElectionId: '',
      measureWeVoteId: '',
      officeName: '',
      officeWeVoteId: '',
      organization: {},
      organizationHasBeenRetrievedOnce: {},
      organizationWeVoteId: '',
      showShareModal: false,
      showSignInModal: false,
      scrolledDown: false,
      voter: {},
    };
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
  }

  componentDidMount () {
    // console.log('HeaderBackToBallot componentDidMount, this.props: ', this.props);
    const { params } = this.props;
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.officeStoreListener = OfficeStore.addListener(this.onOfficeStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    let candidateWeVoteId;
    let googleCivicElectionId;
    let measureWeVoteId;
    let officeWeVoteId;
    let officeName;
    let organization = {};
    let organizationWeVoteId;

    // Steve: 9/21/21, this HeaderBackToBallot component does not receive any props called params
    if (Object.keys(params).length) {
      candidateWeVoteId = params.candidate_we_vote_id || '';
      measureWeVoteId = params.measure_we_vote_id || '';
      officeWeVoteId = params.office_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
        // console.log('HeaderBackToBallot, candidateWeVoteId:', candidateWeVoteId, ', candidate:', candidate);
        if (candidate) {
          const mostLikelyOfficeDict = CandidateStore.getMostLikelyOfficeDictFromCandidateWeVoteId(candidateWeVoteId);
          if (mostLikelyOfficeDict.google_civic_election_id) {
            this.setState({
              googleCivicElectionId: mostLikelyOfficeDict.google_civic_election_id,
            });
          }
          if (mostLikelyOfficeDict.contest_office_we_vote_id) {
            this.setState({
              officeWeVoteId: mostLikelyOfficeDict.contest_office_we_vote_id,
            });
          }
          if (mostLikelyOfficeDict.contest_office_name) {
            this.setState({
              officeName: mostLikelyOfficeDict.contest_office_name,
            });
          }
        } else {
          googleCivicElectionId = VoterStore.electionId();
          this.setState({
            googleCivicElectionId,
          });
        }
        this.setState({
          candidate,
          candidateWeVoteId,
        });
      } else if (officeWeVoteId && officeWeVoteId !== '') {
        const office = OfficeStore.getOffice(officeWeVoteId);
        if (office) {
          officeName = office.ballot_item_display_name;
          if (VoterStore.electionId()) {
            googleCivicElectionId = VoterStore.electionId();
          } else {
            googleCivicElectionId = office.google_civic_election_id;
          }
        } else {
          googleCivicElectionId = VoterStore.electionId();
        }
        this.setState({
          googleCivicElectionId,
          officeName,
          officeWeVoteId,
        });
      }
      const backToCandidateWeVoteId = params.back_to_cand_we_vote_id || '';
      const backToMeasureWeVoteId = params.back_to_meas_we_vote_id || '';
      if (backToMeasureWeVoteId) {
        const backToMeasure = MeasureStore.getMeasure(backToMeasureWeVoteId);
        const { ballot_item_display_name: name } = backToMeasure;
        this.setState({
          backToMeasure,
          measureName: name,
        });
      }
      const backToVariable = params.back_to_variable || '';
      organizationWeVoteId = params.organization_we_vote_id || '';
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
        const { organizationHasBeenRetrievedOnce } = this.state;
        organizationHasBeenRetrievedOnce[organizationWeVoteId] = true;
        this.setState({
          organizationHasBeenRetrievedOnce,
        });
      }
      // console.log('backToMeasureWeVoteId: ', backToMeasureWeVoteId);
      this.setState({
        backToCandidateWeVoteId,
        backToMeasureWeVoteId,
        backToVariable,
        measureWeVoteId,
        organization,
        organizationWeVoteId,
      });
    }
    // Steve: 9/21/21, end of: this HeaderBackToBallot component does not receive any props called params


    this.updatePageBasedState();  // Workaround, but maybe permanent, for https://github.com/wevote/WebApp/issues/3305

    // console.log('candidateWeVoteId: ', candidateWeVoteId);
    // console.log('organizationWeVoteId: ', organizationWeVoteId);

    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    this.setState({
      scrolledDown: AppObservableStore.getScrolledDown(),
      showShareModal: AppObservableStore.showShareModal(),
      showSignInModal: AppObservableStore.showSignInModal(),
      voter,
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });

    if (isIOSAppOnMac() && appleSiliconDebug) {
      dumpCssFromId('headerBackToBallotAppBar');
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    // WARN: Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-unsafe-component-lifecycles for details.
    // console.log('HeaderBackToBallot componentWillReceiveProps, nextProps: ', nextProps);
    const { params } = this.props;
    const { params: nextParams } = nextProps;
    let candidateWeVoteId;
    let googleCivicElectionId;
    let measureWeVoteId;
    let officeWeVoteId;
    let officeName;
    let organization = {};
    let organizationWeVoteId;
    if (nextParams) {
      candidateWeVoteId = nextParams.candidate_we_vote_id || '';
      measureWeVoteId = params.measure_we_vote_id || '';
      officeWeVoteId = nextParams.office_we_vote_id || '';
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
        // console.log('HeaderBackToBallot, candidateWeVoteId:', candidateWeVoteId, ', candidate:', candidate);
        if (candidate) {
          const mostLikelyOfficeDict = CandidateStore.getMostLikelyOfficeDictFromCandidateWeVoteId(candidateWeVoteId);
          if (mostLikelyOfficeDict.google_civic_election_id) {
            this.setState({
              googleCivicElectionId: mostLikelyOfficeDict.google_civic_election_id,
            });
          }
          if (mostLikelyOfficeDict.contest_office_we_vote_id) {
            this.setState({
              officeWeVoteId: mostLikelyOfficeDict.contest_office_we_vote_id,
            });
          }
          if (mostLikelyOfficeDict.contest_office_name) {
            this.setState({
              officeName: mostLikelyOfficeDict.contest_office_name,
            });
          }
        } else {
          googleCivicElectionId = VoterStore.electionId();
          this.setState({
            googleCivicElectionId,
          });
        }
        this.setState({
          candidate,
          candidateWeVoteId,
        });
      } else if (officeWeVoteId && officeWeVoteId !== '') {
        const office = OfficeStore.getOffice(officeWeVoteId);
        if (office) {
          officeName = office.ballot_item_display_name;
          if (VoterStore.electionId()) {
            googleCivicElectionId = VoterStore.electionId();
          } else {
            googleCivicElectionId = office.google_civic_election_id;
          }
        } else {
          googleCivicElectionId = VoterStore.electionId();
        }
        this.setState({
          googleCivicElectionId,
          officeName,
          officeWeVoteId,
        });
      }
      const backToCandidateWeVoteId = nextParams.back_to_cand_we_vote_id || '';
      const backToMeasureWeVoteId = nextParams.back_to_meas_we_vote_id || '';
      if (backToMeasureWeVoteId) {
        const backToMeasure = MeasureStore.getMeasure(backToMeasureWeVoteId);
        this.setState({
          backToMeasure,
        });
      }
      const backToVariable = nextParams.back_to_variable || '';
      organizationWeVoteId = nextParams.organization_we_vote_id || '';
      organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organizationWeVoteId && organizationWeVoteId !== '' && !organization.organization_we_vote_id) {
        // Retrieve the organization object
        if (!this.localOrganizationHasBeenRetrievedOnce(organizationWeVoteId)) {
          OrganizationActions.organizationRetrieve(organizationWeVoteId);
          const { organizationHasBeenRetrievedOnce } = this.state;
          organizationHasBeenRetrievedOnce[organizationWeVoteId] = true;
          this.setState({
            organizationHasBeenRetrievedOnce,
          });
        }
      }
      // console.log('backToMeasureWeVoteId: ', backToMeasureWeVoteId);
      this.setState({
        backToCandidateWeVoteId,
        backToMeasureWeVoteId,
        backToVariable,
        measureWeVoteId,
        organization,
        organizationWeVoteId,
      });
    }

    // console.log('organizationWeVoteId: ', organizationWeVoteId);

    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    this.setState({
      showShareModal: AppObservableStore.showShareModal(),
      voter,
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }
  // eslint-enable camelcase,react/sort-comp,react/prop-types

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.backToCandidateWeVoteId !== nextState.backToCandidateWeVoteId) {
      // console.log('this.state.backToCandidateWeVoteId: ', this.state.backToCandidateWeVoteId, ', nextState.backToCandidateWeVoteId', nextState.backToCandidateWeVoteId);
      return true;
    }
    if (this.state.backToMeasureWeVoteId !== nextState.backToMeasureWeVoteId) {
      // console.log('this.state.backToMeasureWeVoteId: ', this.state.backToMeasureWeVoteId, ', nextState.backToMeasureWeVoteId', nextState.backToMeasureWeVoteId);
      return true;
    }
    if (this.state.backToVariable !== nextState.backToVariable) {
      // console.log('this.state.backToVariable: ', this.state.backToVariable, ', nextState.backToVariable', nextState.backToVariable);
      return true;
    }
    if (this.state.candidateWeVoteId !== nextState.candidateWeVoteId) {
      // console.log('this.state.candidateWeVoteId: ', this.state.candidateWeVoteId, ', nextState.candidateWeVoteId', nextState.candidateWeVoteId);
      return true;
    }
    if (this.state.googleCivicElectionId !== nextState.googleCivicElectionId) {
      // console.log('this.state.googleCivicElectionId: ', this.state.googleCivicElectionId, ', nextState.googleCivicElectionId', nextState.googleCivicElectionId);
      return true;
    }
    if (this.state.measureWeVoteId !== nextState.measureWeVoteId) {
      // console.log('this.state.measureWeVoteId: ', this.state.measureWeVoteId, ', nextState.measureWeVoteId', nextState.measureWeVoteId);
      return true;
    }
    if (this.state.officeName !== nextState.officeName) {
      // console.log('this.state.officeName: ', this.state.officeName, ', nextState.officeName', nextState.officeName);
      return true;
    }
    if (this.state.officeWeVoteId !== nextState.officeWeVoteId) {
      // console.log('this.state.officeWeVoteId: ', this.state.officeWeVoteId, ', nextState.officeWeVoteId', nextState.officeWeVoteId);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId: ', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      // console.log('this.state.scrolledDown: ', this.state.scrolledDown, ', nextState.scrolledDown', nextState.scrolledDown);
      return true;
    }
    if (this.state.showModalStep !== nextState.showModalStep) {
      // console.log('this.state.showModalStep: ', this.state.showModalStep, ', nextState.showModalStep', nextState.showModalStep);
      return true;
    }
    if (this.state.showShareModal !== nextState.showShareModal) {
      // console.log('this.state.showShareModal: ', this.state.showShareModal, ', nextState.showShareModal', nextState.showShareModal);
      return true;
    }
    if (this.state.showSignInModal !== nextState.showSignInModal) {
      // console.log('this.state.showSignInModal: ', this.state.showSignInModal, ', nextState.showSignInModal', nextState.showSignInModal);
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

  componentDidUpdate (prevState) {
    const page = normalizedHrefPage();
    if (page !== prevState.page) {
      this.updatePageBasedState();
    }
  }

  componentWillUnmount () {
    // this.ballotStoreListener.remove();
    this.appStateSubscription.unsubscribe();
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    this.officeStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.setState({
      scrolledDown: AppObservableStore.getScrolledDown(),
      showShareModal: AppObservableStore.showShareModal(),
      showSignInModal: AppObservableStore.showSignInModal(),
    });
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId, officeWeVoteId } = this.state;
    let { googleCivicElectionId } = this.state;
    // console.log('Candidate onCandidateStoreChange');
    let officeName;
    if (candidateWeVoteId && candidateWeVoteId !== '') {
      const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
      // console.log('HeaderBackToBallot -- onCandidateStoreChange, candidateWeVoteId:', this.state.candidateWeVoteId, ', candidate:', candidate);
      if (candidate) {
        const mostLikelyOfficeDict = CandidateStore.getMostLikelyOfficeDictFromCandidateWeVoteId(candidateWeVoteId);
        if (mostLikelyOfficeDict.google_civic_election_id) {
          this.setState({
            googleCivicElectionId: mostLikelyOfficeDict.google_civic_election_id,
          });
        }
        if (mostLikelyOfficeDict.contest_office_we_vote_id) {
          this.setState({
            officeWeVoteId: mostLikelyOfficeDict.contest_office_we_vote_id,
          });
        }
        if (mostLikelyOfficeDict.contest_office_name) {
          this.setState({
            officeName: mostLikelyOfficeDict.contest_office_name,
          });
        }
      } else {
        googleCivicElectionId = VoterStore.electionId();
        this.setState({
          googleCivicElectionId,
        });
      }
      this.setState({
        candidate,
      });
    } else if (officeWeVoteId && officeWeVoteId !== '') {
      const office = OfficeStore.getOffice(officeWeVoteId);
      if (office) {
        officeName = office.ballot_item_display_name;
        if (VoterStore.electionId()) {
          googleCivicElectionId = VoterStore.electionId();
        } else {
          googleCivicElectionId = office.google_civic_election_id;
        }
        this.setState({
          googleCivicElectionId,
          officeName,
        });
      }
    } else {
      googleCivicElectionId = VoterStore.electionId();
      if (googleCivicElectionId) {
        this.setState({
          googleCivicElectionId,
        });
      }
    }
  }

  onMeasureStoreChange () {
    const { backToMeasureWeVoteId } = this.state;
    if (backToMeasureWeVoteId && backToMeasureWeVoteId !== '') {
      const backToMeasure = MeasureStore.getMeasure(backToMeasureWeVoteId);
      this.setState({
        backToMeasure,
      });
    }
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  onOfficeStoreChange () {
    const { officeWeVoteId } = this.state;
    let { googleCivicElectionId } = this.state;
    let officeName;
    if (officeWeVoteId && officeWeVoteId !== '') {
      const office = OfficeStore.getOffice(officeWeVoteId);
      // googleCivic = office ? office.ballot_item_display_name : '';
      if (office) {
        officeName = office.ballot_item_display_name;
        if (VoterStore.electionId()) {
          googleCivicElectionId = VoterStore.electionId();
        } else {
          googleCivicElectionId = office.google_civic_election_id;
        }
        this.setState({
          googleCivicElectionId,
          officeName,
        });
      }
    }
  }

  onVoterStoreChange () {
    let candidateWeVoteId;  // Will not receive this param if you reload the page in the browser with Cmd+Shift+R
    if (this.props.params) {
      const { params: { candidate_we_vote_id: candID } } = this.props;
      candidateWeVoteId = candID;
    }
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    let googleCivicElectionId;
    if (candidateWeVoteId || '') {
      if (candidateWeVoteId && candidateWeVoteId !== '') {
        const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
        // console.log('HeaderBackToBallot, candidateWeVoteId:', candidateWeVoteId, ', candidate:', candidate);
        if (candidate) {
          const mostLikelyOfficeDict = CandidateStore.getMostLikelyOfficeDictFromCandidateWeVoteId(candidateWeVoteId);
          googleCivicElectionId = mostLikelyOfficeDict.google_civic_election_id;
          const officeWeVoteId = mostLikelyOfficeDict.contest_office_we_vote_id;
          if (googleCivicElectionId) {
            this.setState({
              googleCivicElectionId,
            });
          }
          if (officeWeVoteId) {
            this.setState({
              officeWeVoteId,
            });
          }
        }
      }
    }
    if (!googleCivicElectionId) {
      googleCivicElectionId = VoterStore.electionId();
      if (googleCivicElectionId) {
        this.setState({
          googleCivicElectionId,
        });
      }
    }
    this.setState({
      voter,
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }

  getOfficeLink () {
    const { officeWeVoteId, organizationWeVoteId } = this.state;
    if (organizationWeVoteId && organizationWeVoteId !== '') {
      return `/office/${officeWeVoteId}/btvg/${organizationWeVoteId}`;
    } else {
      return `/office/${officeWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  // getVoterGuideLink () {
  //   const { googleCivicElectionId, organizationWeVoteId } = this.state;
  //   return `/voterguide/${organizationWeVoteId}/ballot/election/${googleCivicElectionId}`;
  // }

  closeShareModal = () => {
    AppObservableStore.setShowShareModal(false);
    // AppObservableStore.setWhatAndHowMuchToShare('');
    const pathname = normalizedHref();

    if (stringContains('/modal/share', pathname) && isWebApp()) {
      const pathnameWithoutModalShare = pathname.replace('/modal/share', '');
      // console.log('navigation closeShareModal ', pathnameWithoutModalShare);
      historyPush(pathnameWithoutModalShare);
    }
  }

  closeSignInModal () {
    AppObservableStore.setShowSignInModal(false);
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

  goToSettings () {
    if (isMobileScreenSize()) {
      historyPush('/settings/hamburger');
    } else {
      historyPush('/settings/profile');
    }
  }

  toggleSignInModal () {
    const { showSignInModal } = this.state;
    AppObservableStore.setShowSignInModal(!showSignInModal);
  }

  localOrganizationHasBeenRetrievedOnce (organizationWeVoteId) {
    if (organizationWeVoteId) {
      const { organizationHasBeenRetrievedOnce } = this.state;
      return organizationHasBeenRetrievedOnce[organizationWeVoteId];
    }
    return false;
  }

  updatePageBasedState () {
    const [, page, id, , backToVariable] = normalizedHref().split('/');

    if (page === 'office') {
      const office = OfficeStore.getOffice(id);  //  "office/wv02off35729/b/btdb"
      if (office) {
        const { ballot_item_display_name: name } = office;
        // console.log(office);
        this.setState({
          backToVariable,
          officeName: name,
          officeWeVoteId: id,
          page,
        });
      }
    } else if (page === 'measure') {
      const measure = MeasureStore.getMeasure(id);
      if (measure) {
        const { ballot_item_display_name: name } = measure;
        // console.log(measure);
        this.setState({
          backToVariable,
          measureName: name,
          measureWeVoteId: id,
          page,
        });
      }
    } else if (page === 'candidate') {
      // console.log('found candidate');
      this.setState({
        backToVariable,
        measureName: '',
        officeName: '',
        measureWeVoteId: '',
        officeWeVoteId: '',
        page,
      });
    }
  }


  render () {
    renderLog('HeaderBackToBallot');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      backToCandidateWeVoteId, backToMeasure, backToMeasureWeVoteId, backToVariable,
      candidate, measureName, officeName,
      organization, page, showSignInModal,
      showShareModal, voter, voterIsSignedIn,
    } = this.state;
    const voterPhotoUrlMedium = voterPhoto(voter);
    const { classes } = this.props;

    // console.log('HeaderBackToBallot googleCivicElectionId:', googleCivicElectionId);

    let backToLink;
    let backToLinkText;
    // Workaround 9/23/21
    // if (backToCandidateWeVoteId) {
    //   backToLink = `/candidate/${backToCandidateWeVoteId}/b/${backToVariable}`;
    // } else if (backToMeasureWeVoteId) {
    //   backToLink = `/measure/${backToMeasureWeVoteId}/b/${backToVariable}`;
    // } else if ((['bto', 'btdo'].includes(backToVariable)) && !['candidate'].includes(page)) { // back-to-default-office
    //   backToLink = this.getOfficeLink();
    // } else if (organizationWeVoteId && candidate && candidate.google_civic_election_id) {
    //   backToLink = this.getVoterGuideLink(); // Default to this when there is an organizationWeVoteId
    // } else if (googleCivicElectionId) {
    //   backToLink = `/ballot/election/${googleCivicElectionId}`;
    // } else if (measureWeVoteId) {
    //   backToLink = `/ballot#${measureWeVoteId}`;
    // } else {
    // eslint-disable-next-line prefer-const
    backToLink = '/ballot'; // Default to this
    // }

    if (backToCandidateWeVoteId) {
      if (candidate && candidate.ballot_item_display_name) {
        backToLinkText = candidate.ballot_item_display_name;
      } else {
        backToLinkText = 'Back to Candidate';
      }
    } else if (backToMeasureWeVoteId) {  // 9/21/21 Purposefully not set if doing the workaround
      if (backToMeasure && backToMeasure.ballot_item_display_name) {
        // backToLinkText = backToMeasure.ballot_item_display_name;
        backToLinkText = measureName;
      } else {
        backToLinkText = 'Back to Measure';
      }
    } else if (['bto', 'btdo'].includes(backToVariable)) { // back-to-default-office
      if (officeName) {
        backToLinkText = `${officeName}`; // Back to
      } else {
        backToLinkText = 'Back';
      }
    } else if (organization && organization.organization_name) {
      backToLinkText = `${organization.organization_name}`; // Back to
    } else {
      backToLinkText = 'Ballot'; // Back to
    }

    // const headerClassName = (function header () {
    //   let cname = 'page-header';
    //   if (['candidate', 'office', 'measure'].includes(page)) {
    //     if (isWebApp()) {
    //       cname = `page-header ${!isMobileScreenSize() ? 'page-header__back-to-ballot' : ''}`;
    //     } else if (hasIPhoneNotch()) {
    //       cname = 'page-header page-header__back-to-ballot-cordova  page-header__cordova-iphonex';
    //     } else {
    //       cname = 'page-header page-header__back-to-ballot-cordova  page-header__cordova';
    //     }
    //   }
    //   return cname;
    // }());

    // let appBarClasses = {};
    // if (scrolledDown && ['candidate', 'measure'].includes(page)) {
    //   appBarClasses = { root: classes.noBoxShadow };
    // } else if (['office'].includes(page) && !isMobileScreenSize()) {
    //   appBarClasses = { root: classes.stackedReturnAndShare };
    // }

    const shareButtonInHeader = ['office'].includes(page);

    return (
      <AppBarForBackTo
        id="headerBackToBallotAppBar"
        // className={headerClassName}
        color="default"
        // classes={appBarClasses}
        elevation={0}
      >
        <TopOfPageHeader>
          <TopRowOneLeftContainer>
            <HeaderBackToButton
              backToLink={backToLink}
              backToLinkText={backToLinkText}
              id="backToLinkTabHeaderBackToBallot"
            />
          </TopRowOneLeftContainer>
          <TopRowOneMiddleContainer />
          <TopRowOneRightContainer className="u-cursor--pointer" cordova={isCordova()}>
            {voterIsSignedIn && (
              <Suspense fallback={<></>}>
                <HeaderNotificationMenu />
              </Suspense>
            )}
            {voterIsSignedIn ? (
              <span onClick={this.goToSettings}>
                {voterPhotoUrlMedium ? (
                  <span
                    id="profileAvatarHeaderBar"
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
          {(officeName || measureName) && (
          <TopRowTwoLeftContainer>
            <OfficeOrMeasureTitle>{officeName || measureName}</OfficeOrMeasureTitle>
          </TopRowTwoLeftContainer>
          )}
          {(nextReleaseFeaturesEnabled && shareButtonInHeader) && (
          <TopRowTwoRightContainer>
            <OfficeShareWrapper className="u-show-desktop-tablet">
              <Suspense fallback={<></>}>
                <ShareButtonDesktopTablet officeShare />
              </Suspense>
            </OfficeShareWrapper>
          </TopRowTwoRightContainer>
          )}
          {showSignInModal && (
            <Suspense fallback={<></>}>
              <SignInModal
                signInTitle="Sign In Or Sign Up"
                signInSubTitle=""
                toggleOnClose={this.closeSignInModal}
                uponSuccessfulSignIn={this.closeSignInModal}
              />
            </Suspense>
          )}
          {showShareModal && (
            <Suspense fallback={<></>}>
              <ShareModal
                show={showShareModal}
                closeShareModal={this.closeShareModal}
              />
            </Suspense>
          )}
        </TopOfPageHeader>
      </AppBarForBackTo>
    );
  }
}
HeaderBackToBallot.propTypes = {
  classes: PropTypes.object,
  params: PropTypes.object,
};

const styles = (theme) => ({
  noBoxShadow: {
    boxShadow: '0 0 0 0',
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


const OfficeOrMeasureTitle = styled('div')`
  font-size: 16px;
  font-weight: 500;
  height: 19px;
  margin-left: ${() => (isIPadGiantSize() ? '42px' : '')};
`;

export default withStyles(styles)(HeaderBackToBallot);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import AddressBox from '../AddressBox';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BallotActions from '../../actions/BallotActions';
import BallotElectionList from '../Ballot/BallotElectionList';
import BallotStore from '../../stores/BallotStore';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import { calculateBallotBaseUrl } from '../../utils/textFormat';
import cookies from '../../utils/cookies';
import {
  historyPush, isCordova, isWebApp,
} from '../../utils/cordovaUtils';
import ElectionActions from '../../actions/ElectionActions';
import ElectionStore from '../../stores/ElectionStore';
import EndorsementCard from '../Widgets/EndorsementCard';
import isMobile from '../../utils/isMobile';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import { openSnackbar } from '../Widgets/SnackNotifier';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import PledgeToSupportOrganizationButton from './PledgeToSupportOrganizationButton';
import PledgeToSupportOrganizationStatusBar from './PledgeToSupportOrganizationStatusBar';
import { renderLog } from '../../utils/logging';
import SelectBallotModal from '../Ballot/SelectBallotModal';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import ThisIsMeAction from '../Widgets/ThisIsMeAction';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideBallotItemCompressed from './VoterGuideBallotItemCompressed';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';


// Related to WebApp/src/js/routes/Ballot/Ballot.jsx
class VoterGuideBallot extends Component {
  static propTypes = {
    activeRoute: PropTypes.string,
    classes: PropTypes.object,
    location: PropTypes.object,
    organizationWeVoteId: PropTypes.string.isRequired,
    params: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotElectionList: [],
      ballotLength: 0,
      ballotRemainingChoicesLength: 0,
      ballotWithAllItems: [],
      ballotWithOrganizationEndorsements: [],
      ballotWithOrganizationEndorsementsLength: 0,
      ballotReturnedWeVoteId: '',
      ballotLocationShortcut: '',
      candidateForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      componentDidMountFinished: false,
      lastHashUsedInLinkScroll: '',
      measureForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      mounted: false,
      organization: {},
      organizationWeVoteId: '',
      positionListForOneElectionLength: 0,
      showBallotIntroModal: false,
      showSelectBallotModal: false,
      voterBallotList: [],
      voterGuideOnStage: undefined,
      voterIsAdmin: false,
      voterIsVerifiedVolunteer: false,
      isSearching: false,
      ballotSearchResults: [],
    };

    this.ballotItems = {};
    this.toggleBallotIntroModal = this.toggleBallotIntroModal.bind(this);
    this.ballotItemsCompressedReference = {};
    this.pledgeToVoteWithVoterGuide = this.pledgeToVoteWithVoterGuide.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
  }

  componentDidMount () {
    const ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    // console.log('VoterGuideBallot componentDidMount, ballotBaseUrl', ballotBaseUrl);

    this.setState({
      componentDidMountFinished: true,
      mounted: true,
      showBallotIntroModal: false,
    });

    const ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType('all');
    const ballotWithOrganizationEndorsements = this.updateBallotWithOrganizationEndorsements(ballotWithAllItems);
    const ballotWithOrganizationEndorsementsLength = ballotWithOrganizationEndorsements.length;
    this.setState({
      ballotWithAllItems,
      ballotWithOrganizationEndorsements,
      ballotWithOrganizationEndorsementsLength,
    });

    let googleCivicElectionIdFromUrl = this.props.params.google_civic_election_id || 0;

    // console.log('googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = this.props.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;

    // console.log('this.props.params.ballot_returned_we_vote_id: ', this.props.params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = this.props.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    ballotLocationShortcut = ballotLocationShortcut === 'none' ? '' : ballotLocationShortcut;
    let googleCivicElectionId = 0;

    // console.log('componentDidMount, BallotStore.ballotProperties: ', BallotStore.ballotProperties);
    if (googleCivicElectionIdFromUrl !== 0) {
      googleCivicElectionIdFromUrl = parseInt(googleCivicElectionIdFromUrl, 10);

      // googleCivicElectionId = googleCivicElectionIdFromUrl;
    } else if (BallotStore.ballotProperties && BallotStore.ballotProperties.google_civic_election_id) {
      googleCivicElectionId = BallotStore.ballotProperties.google_civic_election_id;
    }

    // console.log('ballotReturnedWeVoteId: ', ballotReturnedWeVoteId, ', ballotLocationShortcut:', ballotLocationShortcut, ', googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    if (ballotReturnedWeVoteId || ballotLocationShortcut || googleCivicElectionIdFromUrl) {
      if (ballotLocationShortcut !== '') {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, '', ballotLocationShortcut);

        // Change the URL to match
        historyPush(`${ballotBaseUrl}/${ballotLocationShortcut}`);
      } else if (ballotReturnedWeVoteId !== '') {
        // Change the ballot on load to make sure we are getting what we expect from the url
        BallotActions.voterBallotItemsRetrieve(0, ballotReturnedWeVoteId, '');

        // Change the URL to match
        historyPush(`${ballotBaseUrl}/id/${ballotReturnedWeVoteId}`);
      } else if (googleCivicElectionIdFromUrl !== 0) {
        // Change the ballot on load to make sure we are getting what we expect from the url
        if (googleCivicElectionId !== googleCivicElectionIdFromUrl) {
          BallotActions.voterBallotItemsRetrieve(googleCivicElectionIdFromUrl, '', '');

          // Change the URL to match
          let ballotElectionUrl = `${ballotBaseUrl}/election/${googleCivicElectionIdFromUrl}`;
          if (this.props.activeRoute && this.props.activeRoute !== '') {
            ballotElectionUrl += `/${this.props.activeRoute}`;
          }
          historyPush(ballotElectionUrl);
        }

        // No change to the URL needed
        // Now set googleCivicElectionId
        googleCivicElectionId = googleCivicElectionIdFromUrl;
      } else if (googleCivicElectionId !== 0) {
        // No need to retrieve data again
        // Change the URL to match the current googleCivicElectionId
        let ballotElectionUrl2 = `${ballotBaseUrl}/election/${googleCivicElectionId}`;
        if (this.props.activeRoute && this.props.activeRoute !== '') {
          ballotElectionUrl2 += `/${this.props.activeRoute}`;
        }
        historyPush(ballotElectionUrl2);
      }
    // DALE NOTE 2018-1-18 Commented this out because it will take voter away from voter guide. Needs further testing.
    // else if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false){ // No ballot found
    //   // console.log('if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false');
    //   historyPush('/settings/location');
    }

    // We need a ballotStoreListener here because we want the ballot to display before positions are received
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();

    // June 2018: Avoid hitting this same api multiple times, if we already have the data
    if (!SupportStore.isSupportAlreadyInCache()) {
      SupportActions.positionsCountForAllBallotItems(googleCivicElectionId);
    }

    BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));

    // Once a voter hits the ballot, they have gone through orientation
    cookies.setItem('ballot_has_been_visited', '1', Infinity, '/');
    cookies.setItem('show_full_navigation', '1', Infinity, '/');

    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    OrganizationActions.organizationsFollowedRetrieve();

    if (googleCivicElectionId && googleCivicElectionId !== 0) {
      AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
    } else {
      AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
    }

    const { location } = this.props;
    const { pathname } = location;
    // console.log('VoterGuideBallot organizationWeVoteId:', this.props.organizationWeVoteId);
    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
      ballotReturnedWeVoteId,
      ballotLocationShortcut,
      googleCivicElectionId: parseInt(googleCivicElectionId, 10),
      location,
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.organizationWeVoteId),
      organizationWeVoteId: this.props.organizationWeVoteId,
      pathname,
      voterGuideOnStage: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(this.props.organizationWeVoteId, VoterStore.electionId()),
    });

    const { hash } = location;
    if (location && hash) {
      // this.hashLinkScroll();
      this.setState({ lastHashUsedInLinkScroll: hash });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log('VoterGuideBallot componentWillReceiveProps, nextProps: ', nextProps);

    // We don't want to let the googleCivicElectionId disappear
    const googleCivicElectionId = nextProps.params.google_civic_election_id || this.state.googleCivicElectionId;
    let ballotReturnedWeVoteId = nextProps.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
    let ballotLocationShortcut = nextProps.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();

    // Were there any actual changes?
    if (ballotReturnedWeVoteId !== this.state.ballotReturnedWeVoteId ||
        ballotLocationShortcut !== this.state.ballotLocationShortcut ||
        googleCivicElectionId !== this.state.googleCivicElectionId) {
      this.setState({
        ballotReturnedWeVoteId,
        ballotLocationShortcut,
        googleCivicElectionId: parseInt(googleCivicElectionId, 10),
        location: nextProps.location,
        pathname: nextProps.location.pathname,
      });

      // if (googleCivicElectionId && googleCivicElectionId !== 0) {
      //   AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
      // } else {
      //   AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
      // }
    }
    const ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType('all');
    const ballotWithOrganizationEndorsements = this.updateBallotWithOrganizationEndorsements(ballotWithAllItems);
    const ballotWithOrganizationEndorsementsLength = ballotWithOrganizationEndorsements.length;
    this.setState({
      ballotWithAllItems,
      ballotWithOrganizationEndorsements,
      ballotWithOrganizationEndorsementsLength,
      organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organizationWeVoteId),
      organizationWeVoteId: nextProps.organizationWeVoteId,
      voterGuideOnStage: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(nextProps.organizationWeVoteId, VoterStore.electionId()),
    });

    if (nextProps.location && nextProps.location.hash) {
      // this.hashLinkScroll();
      this.setState({ lastHashUsedInLinkScroll: nextProps.location.hash });
    }
    this.onVoterStoreChange();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }
    if (this.state.ballotLength !== nextState.ballotLength) {
      // console.log('shouldComponentUpdate: this.state.ballotLength', this.state.ballotLength, ', nextState.ballotLength', nextState.ballotLength);
      return true;
    }
    if (this.state.ballotRemainingChoicesLength !== nextState.ballotRemainingChoicesLength) {
      // console.log('shouldComponentUpdate: this.state.ballotRemainingChoicesLength', this.state.ballotRemainingChoicesLength, ', nextState.ballotRemainingChoicesLength', nextState.ballotRemainingChoicesLength);
      return true;
    }
    if (this.state.ballotLocationShortcut !== nextState.ballotLocationShortcut) {
      // console.log('shouldComponentUpdate: this.state.ballotLocationShortcut', this.state.ballotLocationShortcut, ', nextState.ballotLocationShortcut', nextState.ballotLocationShortcut);
      return true;
    }
    if (this.state.ballotReturnedWeVoteId !== nextState.ballotReturnedWeVoteId) {
      // console.log('shouldComponentUpdate: this.state.ballotReturnedWeVoteId', this.state.ballotReturnedWeVoteId, ', nextState.ballotReturnedWeVoteId', nextState.ballotReturnedWeVoteId);
      return true;
    }
    if (this.state.ballotWithOrganizationEndorsementsLength !== nextState.ballotWithOrganizationEndorsementsLength) {
      // console.log('shouldComponentUpdate: this.state.ballotWithOrganizationEndorsementsLength', this.state.ballotWithOrganizationEndorsementsLength, ', nextState.ballotWithOrganizationEndorsementsLength', nextState.ballotWithOrganizationEndorsementsLength);
      return true;
    }
    if (this.state.googleCivicElectionId !== nextState.googleCivicElectionId) {
      // console.log('shouldComponentUpdate: this.state.googleCivicElectionId', this.state.googleCivicElectionId, ', nextState.googleCivicElectionId', nextState.googleCivicElectionId);
      return true;
    }
    if (this.state.lastHashUsedInLinkScroll !== nextState.lastHashUsedInLinkScroll) {
      // console.log('shouldComponentUpdate: this.state.lastHashUsedInLinkScroll', this.state.lastHashUsedInLinkScroll, ', nextState.lastHashUsedInLinkScroll', nextState.lastHashUsedInLinkScroll);
      return true;
    }
    if (this.state.location !== nextState.location) {
      // console.log('shouldComponentUpdate: this.state.location', this.state.location, ', nextState.location', nextState.location);
      return true;
    }
    if (this.state.mounted !== nextState.mounted) {
      // console.log('shouldComponentUpdate: this.state.mounted', this.state.mounted, ', nextState.mounted', nextState.mounted);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('shouldComponentUpdate: this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.pathname !== nextState.pathname) {
      // console.log('shouldComponentUpdate: this.state.pathname', this.state.pathname, ', nextState.pathname', nextState.pathname);
      return true;
    }
    if (this.state.positionListForOneElectionLength !== nextState.positionListForOneElectionLength) {
      // console.log('shouldComponentUpdate: this.state.positionListForOneElectionLength', this.state.positionListForOneElectionLength, ', nextState.positionListForOneElectionLength', nextState.positionListForOneElectionLength);
      return true;
    }
    if (this.state.showSelectBallotModal !== nextState.showSelectBallotModal) {
      // console.log('shouldComponentUpdate: this.state.showSelectBallotModal', this.state.showSelectBallotModal, ', nextState.showSelectBallotModal', nextState.showSelectBallotModal);
      return true;
    }
    if (this.state.isSearching !== nextState.isSearching) {
      return true;
    }
    if (this.state.ballotSearchResults !== nextState.ballotSearchResults) {
      return true;
    }
    if (this.state.voterIsAdmin !== nextState.voterIsAdmin) {
      // console.log('shouldComponentUpdate: this.state.voterIsAdmin', this.state.voterIsAdmin, ', nextState.voterIsAdmin', nextState.voterIsAdmin);
      return true;
    }
    if (this.state.voterIsVerifiedVolunteer !== nextState.voterIsVerifiedVolunteer) {
      // console.log('shouldComponentUpdate: this.state.voterIsVerifiedVolunteer', this.state.voterIsVerifiedVolunteer, ', nextState.voterIsVerifiedVolunteer', nextState.voterIsVerifiedVolunteer);
      return true;
    }
    // console.log('shouldComponentUpdate no changes');
    return false;
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('VoterGuideBallot componentDidUpdate');
    if (this.state.lastHashUsedInLinkScroll && this.state.lastHashUsedInLinkScroll !== prevState.lastHashUsedInLinkScroll) {
      this.hashLinkScroll();
    }
  }

  componentWillUnmount () {
    // console.log('VoterGuideBallot componentWillUnmount');
    this.setState({
      mounted: false,
    });

    this.ballotStoreListener.remove();
    this.electionListListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
    this.appStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a 'Oh snap' page
    return { hasError: true };
  }

  onAppStoreChange () {
    this.setState({
      // ballotHeaderUnpinned: AppStore.headroomIsUnpinned(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
    });
  }

  onBallotStoreChange () {
    // console.log('VoterGuideBallot.jsx onBallotStoreChange, BallotStore.ballotProperties: ', BallotStore.ballotProperties);
    const { ballot, ballotProperties } = BallotStore;
    const {
      mounted,
    } = this.state;
    if (mounted) {
      if (ballotProperties && ballotProperties.ballot_found && ballot && ballot.length === 0) {
        // Ballot is found but ballot is empty. We want to stay put.
      } else {
        // Find ballot items this organization is highlighting
        const ballotWithAllItems = BallotStore.getBallotByCompletionLevelFilterType('all');
        const ballotWithOrganizationEndorsements = this.updateBallotWithOrganizationEndorsements(ballotWithAllItems);
        const ballotWithOrganizationEndorsementsLength = ballotWithOrganizationEndorsements.length;
        this.setState({
          ballotWithAllItems,
          ballotWithOrganizationEndorsements,
          ballotWithOrganizationEndorsementsLength,
        });
      }
    }

    if (ballotProperties) {
      this.setState({
        ballotReturnedWeVoteId: ballotProperties.ballot_returned_we_vote_id || '',
        ballotLocationShortcut: ballotProperties.ballot_location_shortcut || '',
        googleCivicElectionId: parseInt(ballotProperties.google_civic_election_id, 10),
      });
    }
    this.setState({
      ballotElectionList: BallotStore.ballotElectionList(),
    });

    if (this.state.ballotLength !== BallotStore.ballotLength) {
      this.setState({
        ballotLength: BallotStore.ballotLength,
      });
    }
    if (this.state.ballotRemainingChoicesLength !== BallotStore.ballotRemainingChoicesLength) {
      this.setState({
        ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
      });
    }
  }

  onVoterStoreChange () {
    // console.log('VoterGuideBallot.jsx onVoterStoreChange');
    if (this.state.mounted) {
      if (this.state.waitUntilVoterSignInCompletes) {
        if (this.state.voter && this.state.voter.is_signed_in) {
          this.setState({
            waitUntilVoterSignInCompletes: undefined,
          });
          // console.log('onVoterStoreChange, about to historyPush(this.state.pathname):', this.state.pathname);
          historyPush(this.state.pathname);
        }
      }
      const voter = VoterStore.getVoter();
      this.setState({
        googleCivicElectionId: parseInt(VoterStore.electionId(), 10),
        voter,
        voterIsAdmin: voter.is_admin,
        voterIsVerifiedVolunteer: voter.is_verified_volunteer,
      });
    }
  }

  onElectionStoreChange () {
    // console.log('Elections, onElectionStoreChange');
    const electionsList = ElectionStore.getElectionList();
    // const electionsLocationsList = [];
    let voterBallot; // A different format for much of the same data
    const voterBallotList = [];
    let oneBallotLocation;
    let ballotLocationShortcut;
    let ballotReturnedWeVoteId;

    for (let i = 0; i < electionsList.length; i++) {
      const election = electionsList[i];
      // electionsLocationsList.push(election);
      ballotReturnedWeVoteId = '';
      ballotLocationShortcut = '';
      if (election.ballot_location_list && election.ballot_location_list.length) {
        // We want to add the shortcut and we_vote_id for the first ballot location option
        oneBallotLocation = election.ballot_location_list[0]; // eslint-disable-line prefer-destructuring
        ballotLocationShortcut = oneBallotLocation.ballot_location_shortcut || '';
        ballotLocationShortcut = ballotLocationShortcut.trim();
        ballotReturnedWeVoteId = oneBallotLocation.ballot_returned_we_vote_id || '';
        ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
      }

      voterBallot = {
        google_civic_election_id: election.google_civic_election_id,
        election_description_text: election.election_name,
        election_day_text: election.election_day_text,
        original_text_for_map_search: '',
        ballot_location_shortcut: ballotLocationShortcut,
        ballot_returned_we_vote_id: ballotReturnedWeVoteId,
      };
      voterBallotList.push(voterBallot);
    }

    this.setState({
      // electionsLocationsList,
      voterBallotList,
    });
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuideBallot onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.position_list_for_one_election) {
        const positionListForOneElection = organization.position_list_for_one_election;
        const positionListForOneElectionLength = positionListForOneElection.length || 0;
        this.setState({
          positionListForOneElectionLength,
        });
      }
      this.setState({
        organization,
      });
    }
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuideBallot onSupportStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.position_list_for_one_election) {
        const positionListForOneElection = organization.position_list_for_one_election;
        const positionListForOneElectionLength = positionListForOneElection.length || 0;
        this.setState({
          positionListForOneElectionLength,
        });
      }
      this.setState({
        organization,
      });
    }
  }

  onVoterGuideStoreChange () {
    // console.log('VoterGuideBallot onVoterGuideStoreChange');
    // Update the data for the modal to include the position of the organization related to this ballot item
    const { candidateForModal, measureForModal, organizationWeVoteId } = this.state;
    if (candidateForModal) {
      this.setState({
        candidateForModal: {
          ...candidateForModal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
        voterGuideOnStage: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(organizationWeVoteId, VoterStore.electionId()),
      });
    } else if (measureForModal) {
      this.setState({
        measureForModal: {
          ...measureForModal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
        voterGuideOnStage: VoterGuideStore.getVoterGuideForOrganizationIdAndElection(organizationWeVoteId, VoterStore.electionId()),
      });
    }
  }

  updateBallotWithOrganizationEndorsements = (ballotWithAllItems) => {
    // console.log('updateBallotWithOrganizationEndorsements');
    if (!ballotWithAllItems) return [];
    const ballotWithOrganizationEndorsements = [];
    let alreadyPushed;
    let oneContest;
    let oneCandidate;
    for (let contestIndex = 0; contestIndex < ballotWithAllItems.length; contestIndex++) {
      alreadyPushed = false;
      oneContest = ballotWithAllItems[contestIndex];
      // console.log('oneContest:', oneContest);
      // Measures
      if (!alreadyPushed && oneContest && oneContest.we_vote_id && this.localDoesOrganizationHavePositionOnBallotItem(oneContest.we_vote_id)) {
        ballotWithOrganizationEndorsements.push(oneContest);
        alreadyPushed = true;
      }
      // Offices
      if (!alreadyPushed && oneContest && oneContest.candidate_list) {
        for (let candidateIndex = 0; candidateIndex < oneContest.candidate_list.length; candidateIndex++) {
          oneCandidate = oneContest.candidate_list[candidateIndex];
          // console.log('oneCandidate:', oneCandidate);
          // console.log('alreadyPushed:', alreadyPushed);
          if (!alreadyPushed && oneCandidate && oneCandidate.we_vote_id && this.localDoesOrganizationHavePositionOnBallotItem(oneCandidate.we_vote_id)) {
            ballotWithOrganizationEndorsements.push(oneContest);
            alreadyPushed = true;
          }
        }
      }
    }
    return ballotWithOrganizationEndorsements;
  }

  handleSearch = (filteredItems) => {
    this.setState({ ballotSearchResults: filteredItems });
  };

  handleToggleSearchBallot = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching });
  };

  toggleBallotIntroModal () {
    const { showBallotIntroModal, location, pathname } = this.state;
    if (location.hash.includes('#')) {
      // Clear out any # from anchors in the URL
      historyPush(pathname);
    }

    this.setState({ showBallotIntroModal: !showBallotIntroModal });
  }

  toggleSelectBallotModal (destinationUrlForHistoryPush = '') {
    const { showSelectBallotModal } = this.state;
    if (showSelectBallotModal) {
      if (destinationUrlForHistoryPush && destinationUrlForHistoryPush !== '') {
        historyPush(destinationUrlForHistoryPush);
      }
    } else {
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }

    AppActions.setShowSelectBallotModal(!showSelectBallotModal);
  }

  // Needed to scroll to anchor tags based on hash in url (as done for bookmarks)
  hashLinkScroll () {
    const { hash } = window.location;
    if (hash !== '') {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
          const positionY = element.offsetTop;
          if (isMobile()) {
            window.scrollTo(0, positionY + 250);
          } else {
            window.scrollTo(0, positionY + 196);
          }
        }
      }, 0);
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('VoterGuideBallot caught error: ', `${error} with info: `, info);
  }

  localDoesOrganizationHavePositionOnBallotItem (contestWeVoteId) {
    const { organizationWeVoteId } = this.state;
    // console.log('localDoesOrganizationHavePositionOnBallotItem organizationWeVoteId: ', organizationWeVoteId, ', contestWeVoteId: ', contestWeVoteId);
    return OrganizationStore.doesOrganizationHavePositionOnBallotItem(organizationWeVoteId, contestWeVoteId);
  }

  pledgeToVoteWithVoterGuide () {
    // console.log('VoterGuideBallot pledgeToVoteWithVoterGuide, this.state.voterGuideOnStage:', this.state.voterGuideOnStage);
    const toastMessage = `Now you match what ${this.state.organization.organization_name} supports or opposes`;
    VoterGuideActions.pledgeToVoteWithVoterGuide(this.state.voterGuideOnStage.we_vote_id);
    openSnackbar({ message: toastMessage });
  }

  render () {
    renderLog('VoterGuideBallot');  // Set LOG_RENDER_EVENTS to log all renders
    const ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    const {
      ballotWithAllItems, ballotWithOrganizationEndorsements, ballotWithOrganizationEndorsementsLength, organization, organizationWeVoteId, voterIsAdmin, voterIsVerifiedVolunteer,
    } = this.state;
    if (!ballotWithAllItems) {
      return (
        <div className="ballot container-fluid well u-stack--md u-inset--md">
          <div className={`ballot__header ${isWebApp() ? 'ballot__header__top-cordova' : ''}`}>
            <BrowserPushMessage incomingProps={this.props} />
            <p className="ballot__date_location">
              If your ballot does not appear momentarily, please
              {' '}
              <Link to="/settings/location">change your address</Link>
              .
            </p>
          </div>
          <BallotElectionList
            ballotBaseUrl={ballotBaseUrl}
            ballotElectionList={this.state.voterBallotList}
            organization_we_vote_id={organizationWeVoteId}
          />
        </div>
      );
    }

    const voterAddressMissing = this.state.location === null;

    // const ballot_caveat = BallotStore.ballotProperties.ballot_caveat; // ballotProperties might be undefined
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    const sourcePollingLocationWeVoteId = BallotStore.currentBallotPollingLocationSource;
    const organizationAdminUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}org/${organizationWeVoteId}/pos/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;
    const ballotReturnedAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}pl/${sourcePollingLocationWeVoteId}/summary/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    const emptyBallotButton = voterAddressMissing ? (
      <div className="container-fluid well u-stack--md u-inset--md">
        <Helmet title="Enter Your Address - We Vote" />
        <h3 className="h3">
          Enter address where you are registered to vote
        </h3>
        <div>
          <AddressBox {...this.props} saveUrl={ballotBaseUrl} />
        </div>
      </div>
    ) : (
      <span>
        {/* <Link to={ballotBaseUrl}>
              <Button variant="primary">View Full Ballot</Button>
          </Link> */}
      </span>
    );

    const emptyBallot = ballotWithAllItems.length === 0 ? (
      <div>
        {emptyBallotButton}
        <div className="container-fluid well u-stack--md u-inset--md">
          <BallotElectionList
            ballotBaseUrl={ballotBaseUrl}
            ballotElectionList={this.state.voterBallotList}
            organization_we_vote_id={organizationWeVoteId}
          />
        </div>
      </div>
    ) : null;

    const electionDayTextFormatted = electionDayText ? <span>{moment(electionDayText).format('MMM Do, YYYY')}</span> : <span />;

    return (
      <div className="ballot">
        { this.state.showSelectBallotModal ? (
          <SelectBallotModal
            ballotElectionList={this.state.ballotElectionList}
            ballotBaseUrl={ballotBaseUrl}
            location={this.state.location}
            organization_we_vote_id={organizationWeVoteId}
            pathname={this.state.pathname}
            show={this.state.showSelectBallotModal}
            toggleFunction={this.toggleSelectBallotModal}
          />
        ) : null }
        <div className="card">
          <div className="card-main">
            <Helmet title={`${organization.organization_name} - We Vote`} />
            <BrowserPushMessage incomingProps={this.props} />
            <header className="ballot__header__group">
              <h1 className={isCordova() ? 'ballot__header__title__cordova' : 'ballot__header__title'}>
                { electionName ? (
                  <span className={isWebApp() ? 'u-push--sm' : 'ballot__header__title__cordova-text'}>
                    {electionName}
                    {' '}
                    <span className="d-none d-sm-inline">&mdash; </span>
                    <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
                  </span>
                ) : (
                  <span className="u-push--sm">
                         Loading Election...
                  </span>
                )}
              </h1>
            </header>

            <div className="d-print-none">
              { ballotWithOrganizationEndorsementsLength ?
                <PledgeToSupportOrganizationStatusBar organization={organization} /> :
                null
              }
            </div>

            <div className="d-print-none">
              { ballotWithOrganizationEndorsementsLength ? (
                <PledgeToSupportOrganizationButton
                  organization={organization}
                  pledgeToVoteAction={this.pledgeToVoteWithVoterGuide}
                />
              ) : null
              }
            </div>
          </div>
        </div>

        <div className="page-content-container">
          <div className="container-fluid">
            {emptyBallot}
            <div className="row ballot__body-vg">
              <div className="col-xs-12 col-md-12">
                {/* The ballot items the organization wants to promote */}
                <div>
                  {ballotWithOrganizationEndorsementsLength > 0 && (
                    <div className={isWebApp() ? 'BallotList' : 'BallotList__cordova'}>
                      {ballotWithOrganizationEndorsements.map(item => (
                        <VoterGuideBallotItemCompressed
                          key={item.we_vote_id}
                          organization={organization}
                          organizationWeVoteId={organizationWeVoteId}
                          location={this.props.location}
                          urlWithoutHash={this.props.location.pathname + this.props.location.search}
                          {...item}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <EndorsementCard
                  bsPrefix="u-stack--xs"
                  variant="primary"
                  buttonText="ENDORSEMENTS MISSING?"
                  text={`Are there endorsements from ${organization.organization_name} that you expected to see?`}
                  title="Endorsements Missing?"
                />
                {organization.organization_twitter_handle && (
                  <ThisIsMeAction
                    twitterHandleBeingViewed={organization.organization_twitter_handle}
                    nameBeingViewed={organization.organization_name}
                    kindOfOwner="ORGANIZATION"
                  />
                )}

                {/* Show links to this candidate in the admin tools */}
                { (voterIsAdmin || voterIsVerifiedVolunteer) && organizationWeVoteId && (
                  <span className="u-wrap-links d-print-none">
                    <span>Admin:</span>
                    <OpenExternalWebSite
                      url={organizationAdminUrl}
                      target="_blank"
                      body={(
                        <span>
                          Open this organization in Admin interface (&quot;
                          {organizationWeVoteId}
                          &quot;)
                        </span>
                      )}
                    />
                  </span>
                )}
                {/* Show links to the polling location this was copied from in the admin tools */}
                { sourcePollingLocationWeVoteId && (voterIsAdmin || voterIsVerifiedVolunteer) ? (
                  <div className="u-wrap-links d-print-none">
                    Admin link:
                    <OpenExternalWebSite
                      url={ballotReturnedAdminEditUrl}
                      target="_blank"
                      body={(
                        <span>
                        This ballot copied from polling location &quot;
                          {sourcePollingLocationWeVoteId}
                          &quot;
                        </span>
                      )}
                    />
                  </div>
                ) : null
                }
                {
                  this.state.showSelectBallotModal ? (
                    <SelectBallotModal
                      ballotElectionList={this.state.ballotElectionList}
                      ballotBaseUrl={ballotBaseUrl}
                      location={this.props.location}
                      pathname={this.props.pathname}
                      show={this.state.showSelectBallotModal}
                      toggleFunction={this.toggleSelectBallotModal}
                    />
                  ) : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  badge: {
    top: 13,
    minWidth: 16,
    width: 20,
    right: 14,
    background: 'rgba(46, 60, 93, 0.08)',
    color: '#333',
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
      width: 16,
      height: 16,
      top: 11,
      right: 11,
    },
  },
  badgeColorPrimary: {
    background: theme.palette.primary.main,
    color: 'white',
  },
  chipRoot: {
    height: 26,
    [theme.breakpoints.down('md')]: {
      height: 22.5,
    },
  },
  iconRoot: {
    position: 'absolute',
    left: 3,
    top: 1,
    color: theme.palette.primary.main,
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
      top: 3,
    },
  },
});

export default withStyles(styles)(VoterGuideBallot);

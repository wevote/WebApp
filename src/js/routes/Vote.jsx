import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import moment from 'moment';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import BallotIcon from '@material-ui/icons/Ballot';
import Button from '@material-ui/core/Button';
import AddEndorsements from '../components/Widgets/AddEndorsements';
import BallotActions from '../actions/BallotActions';
import BallotSearch from '../components/Ballot/BallotSearch';
import BallotStore from '../stores/BallotStore';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import cookies from '../utils/cookies';
import {
  cordovaBallotFilterTopMargin,
  historyPush, isCordova, isWebApp,
} from '../utils/cordovaUtils';
import ElectionActions from '../actions/ElectionActions';
import IssueActions from '../actions/IssueActions';
import IssueStore from '../stores/IssueStore';
import OrganizationActions from '../actions/OrganizationActions';
import { renderLog } from '../utils/logging';
import SupportActions from '../actions/SupportActions';
import SupportStore from '../stores/SupportStore';
import VoterActions from '../actions/VoterActions';
import VoterGuideStore from '../stores/VoterGuideStore';
import AppStore from '../stores/AppStore';
import VoterStore from '../stores/VoterStore';
import ReturnOfficialBallot from '../components/Vote/ReturnOfficialBallot';
import BallotItemReadyToVote from '../components/Ballot/BallotItemReadyToVote';


class Vote extends Component {
  static propTypes = {
    location: PropTypes.object,
    pathname: PropTypes.string,
    params: PropTypes.object,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemUnfurledTracker: {},
      ballotLength: 0,
      ballotWithItemsFromCompletionFilterType: [],
      ballotReturnedWeVoteId: '',
      ballotLocationShortcut: '',
      candidateForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      measureForModal: {
        voter_guides_to_follow_for_latest_ballot_item: [],
        position_list: [],
      },
      mounted: false,
      ballotHeaderUnpinned: false,
      isSearching: false,
      ballotSearchResults: [],
    };

    this.updateOfficeDisplayUnfurledTracker = this.updateOfficeDisplayUnfurledTracker.bind(this);
  }

  componentDidMount () {
    const ballotBaseUrl = '/ballot';
    const hideIntroModalFromUrl = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
    const hideIntroModalFromCookie = cookies.getItem('hide_intro_modal') || 0;
    const waitUntilVoterSignInCompletes = this.props.location.query ? this.props.location.query.wait_until_voter_sign_in_completes : 0;
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));

    if (waitUntilVoterSignInCompletes !== undefined ||
        hideIntroModalFromCookie ||
        hideIntroModalFromUrl) {
      this.setState({
        mounted: true,
      });
    } else {
      this.setState({
        mounted: true,
      });
    }

    const completionLevelFilterType = 'filterDecided';
    const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
    if (ballotWithItemsFromCompletionFilterType !== undefined) {
      // console.log('ballotWithItemsFromCompletionFilterType !== undefined');
      this.setState({
        ballotWithItemsFromCompletionFilterType,
      });
    }

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
          const ballotElectionUrl = `${ballotBaseUrl}/election/${googleCivicElectionIdFromUrl}`;
          historyPush(ballotElectionUrl);
        }

        // No change to the URL needed
        // Now set googleCivicElectionId
        googleCivicElectionId = googleCivicElectionIdFromUrl;
      } else if (googleCivicElectionId !== 0) {
        // No need to retrieve data again
        // Change the URL to match the current googleCivicElectionId
        const ballotElectionUrl2 = `${ballotBaseUrl}/election/${googleCivicElectionId}`;
        historyPush(ballotElectionUrl2);
      }
    } else if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false) { // No ballot found
      // console.log('if (BallotStore.ballotProperties && BallotStore.ballotProperties.ballot_found === false');
      historyPush('/settings/location');
    } else if (ballotWithItemsFromCompletionFilterType === undefined) {
      // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      BallotActions.voterBallotItemsRetrieve(0, '', '');
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
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onBallotStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // Once a voter hits the ballot, they have gone through orientation
    cookies.setItem('ballot_has_been_visited', '1', Infinity, '/');

    ElectionActions.electionsRetrieve();
    OrganizationActions.organizationsFollowedRetrieve();
    VoterActions.voterRetrieve(); // This is needed to update the interface status settings

    // if (googleCivicElectionId && googleCivicElectionId !== 0) {
    //   AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
    // } else {
    //   AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
    // }

    const { location } = this.props;
    const { pathname } = location;
    this.setState({
      completionLevelFilterType,
      ballotReturnedWeVoteId,
      ballotLocationShortcut,
      googleCivicElectionId: parseInt(googleCivicElectionId, 10),
      hideIntroModalFromUrl,
      hideIntroModalFromCookie,
      pathname,
      waitUntilVoterSignInCompletes,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('Ballot componentWillReceiveProps');

    // We don't want to let the googleCivicElectionId disappear
    const googleCivicElectionId = nextProps.params.google_civic_election_id || this.state.googleCivicElectionId;
    let ballotReturnedWeVoteId = nextProps.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
    let ballotLocationShortcut = nextProps.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    const completionLevelFilterType = 'filterDecided';

    // Were there any actual changes?
    if (ballotReturnedWeVoteId !== this.state.ballotReturnedWeVoteId ||
        ballotLocationShortcut !== this.state.ballotLocationShortcut ||
        googleCivicElectionId !== this.state.googleCivicElectionId ||
        completionLevelFilterType !== this.state.completionLevelFilterType) {
      // console.log('Ballot componentWillReceiveProps changes found');
      this.setState({
        ballotWithItemsFromCompletionFilterType: BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType),
        ballotReturnedWeVoteId,
        ballotLocationShortcut,
        completionLevelFilterType,
        googleCivicElectionId: parseInt(googleCivicElectionId, 10),
        pathname: nextProps.location.pathname,
      });

      // if (googleCivicElectionId && googleCivicElectionId !== 0) {
      //   AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
      // } else {
      //   AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
      // }
    } else {
      // console.log('Ballot componentWillReceiveProps NO changes found');
    }
  }

  componentWillUnmount () {
    // console.log('Ballot componentWillUnmount');
    this.setState({
      mounted: false,
    });

    this.ballotStoreListener.remove();
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
      ballotHeaderUnpinned: AppStore.getScrolledDown(),
    });
  }

  onVoterStoreChange () {
    // console.log('Ballot.jsx onVoterStoreChange, voter: ', VoterStore.getVoter());
    if (this.state.mounted) {
      let considerOpeningBallotIntroModal = true;
      if (this.state.waitUntilVoterSignInCompletes) {
        considerOpeningBallotIntroModal = false;
        if (this.state.voter && this.state.voter.is_signed_in) {
          considerOpeningBallotIntroModal = true;
          this.setState({
            waitUntilVoterSignInCompletes: undefined,
          });
          // console.log('onVoterStoreChange, about to historyPush(this.state.pathname):', this.state.pathname);
          historyPush(this.state.pathname);
        }
      }

      const issuesVoterCanFollow = IssueStore.getIssuesVoterCanFollow(); // Check to see if the issues have been retrieved yet
      const issuesVoterCanFollowExist = issuesVoterCanFollow && issuesVoterCanFollow.length;
      // console.log('Ballot onVoterStoreChange issuesVoterCanFollowExist: ', issuesVoterCanFollowExist);

      if (this.state.hideIntroModalFromCookie || this.state.hideIntroModalFromUrl || !issuesVoterCanFollowExist) {
        considerOpeningBallotIntroModal = false;
      }

      // console.log('Ballot.jsx onVoterStoreChange VoterStore.getVoter: ', VoterStore.getVoter());
      if (considerOpeningBallotIntroModal) {
        this.setState({
          voter: VoterStore.getVoter(),
          googleCivicElectionId: parseInt(VoterStore.electionId(), 10),
        });
      } else {
        this.setState({
          voter: VoterStore.getVoter(),
          googleCivicElectionId: parseInt(VoterStore.electionId(), 10),
        });
      }
    }
  }

  onBallotStoreChange () {
    // console.log('Ballot.jsx onBallotStoreChange');
    const completionLevelFilterType = 'filterDecided';
    const { ballot, ballotProperties } = BallotStore;
    // console.log('Ballot.jsx onBallotStorechange, ballotProperties: ', ballotProperties);
    const {
      issuesRetrievedFromGoogleCivicElectionId,
      issuesRetrievedFromBallotReturnedWeVoteId, issuesRetrievedFromBallotLocationShortcut,
    } = this.state;

    if (ballotProperties && ballotProperties.ballot_found && ballot && ballot.length === 0) {
      // Ballot is found but ballot is empty. We want to stay put.
      // console.log('onBallotStoreChange: ballotWithItemsFromCompletionFilterType is empty');
    } else {
      // console.log('completionLevelFilterType: ', completionLevelFilterType);
      const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
      this.setState({
        ballotWithItemsFromCompletionFilterType,
      });
    }
    if (ballotProperties) {
      // If the incoming googleCivicElectionId, ballotReturnedWeVoteId, or ballotLocationShortcut are different, call issuesRetrieveForElection
      if (parseInt(ballotProperties.google_civic_election_id, 10) !== issuesRetrievedFromGoogleCivicElectionId ||
          ballotProperties.ballot_returned_we_vote_id !== issuesRetrievedFromBallotReturnedWeVoteId ||
          ballotProperties.ballot_location_shortcut !== issuesRetrievedFromBallotLocationShortcut) {
        // console.log('onBallotStoreChange, Calling issuesRetrieveForElection');

        if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
          IssueActions.issuesRetrieveForElection(ballotProperties.google_civic_election_id, ballotProperties.ballot_location_shortcut, ballotProperties.ballot_returned_we_vote_id);
        }

        this.setState({
          issuesRetrievedFromGoogleCivicElectionId: parseInt(BallotStore.ballotProperties.google_civic_election_id, 10),
          issuesRetrievedFromBallotReturnedWeVoteId: BallotStore.ballotProperties.ballot_returned_we_vote_id,
          issuesRetrievedFromBallotLocationShortcut: BallotStore.ballotProperties.ballot_location_shortcut,
        });
      }

      this.setState({
        ballotReturnedWeVoteId: ballotProperties.ballot_returned_we_vote_id || '',
        ballotLocationShortcut: ballotProperties.ballot_location_shortcut || '',
        googleCivicElectionId: parseInt(ballotProperties.google_civic_election_id, 10),
      });
    }
    this.setState({
      completionLevelFilterType,
    });

    if (this.state.ballotLength !== BallotStore.ballotLength) {
      this.setState({
        ballotLength: BallotStore.ballotLength,
        // raceLevelFilterType: 'Federal',
      });
    }
  }

  onVoterGuideStoreChange () {
    // console.log('Ballot onVoterGuideStoreChange');
    // Update the data for the modal to include the position of the organization related to this ballot item
    const { candidateForModal, measureForModal } = this.state;
    if (candidateForModal) {
      this.setState({
        candidateForModal: {
          ...candidateForModal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
      });
    } else if (measureForModal) {
      this.setState({
        measureForModal: {
          ...measureForModal,
          voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
        },
      });
    }
  }

  handleSearch = (filteredItems) => {
    this.setState({ ballotSearchResults: filteredItems });
  };

  handleToggleSearchBallot = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching });
  };

  hideLocationsGuessComponent () {
    document.getElementById('location_guess').style.display = 'none';
  }

  // componentDidCatch (error, info) {
  //   // We should get this information to Splunk!
  //   console.error('Ballot caught error: ', `${error} with info: `, info);
  // }

  updateOfficeDisplayUnfurledTracker (weVoteId, status) {
    const { ballotItemUnfurledTracker } = this.state;
    const newBallotItemUnfurledTracker = { ...ballotItemUnfurledTracker, [weVoteId]: status };
    BallotActions.voterBallotItemOpenOrClosedSave(newBallotItemUnfurledTracker);
    this.setState({
      ballotItemUnfurledTracker: newBallotItemUnfurledTracker,
    });
  }

  render () {
    // console.log('Vote render');
    renderLog(__filename);
    const {
      ballotWithItemsFromCompletionFilterType,
      ballotHeaderUnpinned, isSearching, ballotSearchResults,
    } = this.state;
    const { classes } = this.props;

    // const ballot_caveat = BallotStore.ballotProperties.ballot_caveat; // ballotProperties might be undefined
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    // console.log("electionName: ", electionName, ", electionDayTextFormatted: ", electionDayText);

    const electionDayTextFormatted = electionDayText ? <span>{moment(electionDayText).format('MMM Do, YYYY')}</span> : <span />;

    return (
      <VoteContainer>
        <div className={`ballot__heading ${ballotHeaderUnpinned ? 'ballot__heading__unpinned' : ''}`}>
          <div className="page-content-container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <Helmet title="Vote - We Vote" />
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
                  <div className="ballot__filter__container" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
                    <BallotFilterRow>
                      <div className="ballot__item-filter-tabs">
                        { ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length ? (
                          <React.Fragment>
                            <BallotSearch
                              isSearching={isSearching}
                              onToggleSearch={this.handleToggleSearchBallot}
                              items={ballotWithItemsFromCompletionFilterType}
                              onBallotSearch={this.handleSearch}
                              alwaysOpen
                            />
                          </React.Fragment>
                        ) : null
                        }
                      </div>
                    </BallotFilterRow>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-content-container">
          <div className="container-fluid" style={{ marginTop: `${cordovaBallotFilterTopMargin()}` }}>
            <Wrapper cordova={isCordova()}>
              <div className="row ballot__body__ready-to-vote">
                <BrowserPushMessage incomingProps={this.props} />
                <div className="col-sm-12 col-lg-8">
                  <div className="u-show-mobile-tablet">
                    <AddEndorsements />
                  </div>
                  {ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length ? (
                    <div>
                      <ReturnOfficialBallot />
                      <TitleText>Your Choices</TitleText>
                      <Card>
                        {(isSearching && ballotSearchResults.length ? ballotSearchResults : ballotWithItemsFromCompletionFilterType).map(item => <BallotItemReadyToVote key={item.we_vote_id} {...item} />)}
                      </Card>
                    </div>
                  ) : /* No items decided */ (
                    <Card>
                      <EmptyBallotMessageContainer>
                        <BallotIcon classes={{ root: classes.ballotIconRoot }} />
                        <EmptyBallotText>You haven&apos;t chosen any candidates or measures yet. Go to &quot;Ballot&quot; to decide what to vote for.</EmptyBallotText>
                        <Button
                          classes={{ root: classes.ballotButtonRoot }}
                          color="primary"
                          variant="contained"
                          onClick={() => historyPush('/ballot')}
                        >
                          <BallotIcon classes={{ root: classes.ballotButtonIconRoot }} />
                          Go to &quot;Ballot&quot;
                        </Button>
                      </EmptyBallotMessageContainer>
                    </Card>
                  )
                  }
                </div>

                {/* Right column */}
                <div className="col-lg-4 d-none d-lg-block sidebar-menu">
                  <AddEndorsements />
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
      </VoteContainer>
    );
  }
}

const VoteContainer = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 -16px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 -32px;
  }
`;

const Wrapper = styled.div`
  padding-top: ${({ cordova }) => (cordova ? '100px' : 0)};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em 0;
  }
`;

const TitleText = styled.h3`
  font-weight: bold;
  font-size: 24px;
`;

// If we want to turn off filter tabs navigation bar:  ${({ showFilterTabs }) => !showFilterTabs && 'height: 0;'}
const BallotFilterRow = styled.div`
  display: flex;
`;

const EmptyBallotMessageContainer = styled.div`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(Vote);

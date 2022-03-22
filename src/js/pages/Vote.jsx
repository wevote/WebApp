import { Ballot } from '@mui/icons-material';
import { Button, Card } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import BallotActions from '../actions/BallotActions';
import ElectionActions from '../actions/ElectionActions';
import IssueActions from '../actions/IssueActions';
import OrganizationActions from '../actions/OrganizationActions';
import SupportActions from '../actions/SupportActions';
import VoterActions from '../actions/VoterActions';
import historyPush from '../common/utils/historyPush';
import { isWebApp } from '../common/utils/isCordovaOrWebApp';
import Cookies from '../common/utils/js-cookie/Cookies';
import { renderLog } from '../common/utils/logging';
import { DualHeaderContainer, PageContentContainer } from '../components/Style/pageLayoutStyles';
import BallotItemReadyToVote from '../components/Vote/BallotItemReadyToVote';
import FindPollingLocation from '../components/Vote/FindPollingLocation';
import ReturnOfficialBallot from '../components/Vote/ReturnOfficialBallot';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import BallotStore from '../stores/BallotStore';
import IssueStore from '../stores/IssueStore';
import SupportStore from '../stores/SupportStore';
import VoterGuideStore from '../stores/VoterGuideStore';
import VoterStore from '../stores/VoterStore';
import { cordovaVoteMiniHeader } from '../utils/cordovaOffsets';
import cordovaScrollablePaneTopPadding from '../utils/cordovaScrollablePaneTopPadding';
import BallotTitleHeader from './Ballot/BallotTitleHeader';

const FilterBaseSearch = React.lazy(() => import(/* webpackChunkName: 'FilterBaseSearch' */ '../components/Filter/FilterBaseSearch'));

class Vote extends Component {
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
    const { match: { params } } = this.props;
    const ballotBaseUrl = '/ballot';
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());

    this.setState({
      mounted: true,
    });

    const completionLevelFilterType = 'filterDecided';
    const ballotWithItemsFromCompletionFilterType = BallotStore.getBallotByCompletionLevelFilterType(completionLevelFilterType);
    if (ballotWithItemsFromCompletionFilterType !== undefined) {
      // console.log('ballotWithItemsFromCompletionFilterType !== undefined');
      this.setState({
        ballotWithItemsFromCompletionFilterType,
      });
    }

    let googleCivicElectionIdFromUrl = params.google_civic_election_id || 0;

    // console.log('googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;

    // console.log('params.ballot_returned_we_vote_id: ', params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = params.ballot_location_shortcut || '';
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
    // NOTE: voterAllPositionsRetrieve is also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();

    BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onBallotStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    // Once a voter hits the ballot, they have gone through orientation
    Cookies.set('ballot_has_been_visited', '1', { expires: 10000, path: '/' });

    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    ElectionActions.electionsRetrieve();
    OrganizationActions.organizationsFollowedRetrieve();
    VoterActions.voterRetrieve(); // This is needed to update the interface status settings

    // if (googleCivicElectionId && googleCivicElectionId !== 0) {
    //   AnalyticsActions.saveActionBallotVisit(googleCivicElectionId);
    // } else {
    //   AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
    // }

    this.setState({
      completionLevelFilterType,
      ballotReturnedWeVoteId,
      ballotLocationShortcut,
      googleCivicElectionId: parseInt(googleCivicElectionId, 10),
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('Ballot componentWillReceiveProps');
    const { match: { params: nextParams } } = nextProps;

    // We don't want to let the googleCivicElectionId disappear
    const googleCivicElectionId = nextParams.google_civic_election_id || this.state.googleCivicElectionId;
    let ballotReturnedWeVoteId = nextParams.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId.trim();
    let ballotLocationShortcut = nextParams.ballot_location_shortcut || '';
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

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Ballot caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('Ballot componentWillUnmount');
    this.setState({
      mounted: false,
    });

    this.appStateSubscription.unsubscribe();
    this.ballotStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a 'Oh snap' page
    return { hasError: true };
  }

  onAppObservableStoreChange () {
    this.setState({
      ballotHeaderUnpinned: AppObservableStore.getScrolledDown(),
    });
  }

  onVoterStoreChange () {
    // console.log('Ballot.jsx onVoterStoreChange, voter: ', VoterStore.getVoter());
    const { location: { pathname } } = window;

    if (this.state.mounted) {
      let considerOpeningBallotIntroModal = true;
      if (this.state.waitUntilVoterSignInCompletes) {
        considerOpeningBallotIntroModal = false;
        if (this.state.voter && this.state.voter.is_signed_in) {
          considerOpeningBallotIntroModal = true;
          this.setState({
            waitUntilVoterSignInCompletes: undefined,
          });
          // console.log('onVoterStoreChange, about to historyPush(pathname):', pathname);
          historyPush(pathname);
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
      // If the incoming googleCivicElectionId, ballotReturnedWeVoteId, or ballotLocationShortcut are different, call issuesUnderBallotItemsRetrieve
      if (parseInt(ballotProperties.google_civic_election_id, 10) !== issuesRetrievedFromGoogleCivicElectionId ||
          ballotProperties.ballot_returned_we_vote_id !== issuesRetrievedFromBallotReturnedWeVoteId ||
          ballotProperties.ballot_location_shortcut !== issuesRetrievedFromBallotLocationShortcut) {
        // console.log('onBallotStoreChange, Calling issuesUnderBallotItemsRetrieve');

        let callIssuesUnderBallotItemRetrieve = true;
        if (ballotProperties.google_civic_election_id) {
          // If we only have a value for googleCivicElectionId, then prevent a calling issuesUnderBallotItemsRetrieve if we already have the data
          if (IssueStore.issuesUnderBallotItemsRetrieveCalled(ballotProperties.google_civic_election_id)) {
            callIssuesUnderBallotItemRetrieve = false;
          }
        }
        if (callIssuesUnderBallotItemRetrieve) {
          IssueActions.issuesUnderBallotItemsRetrieve(ballotProperties.google_civic_election_id, ballotProperties.ballot_location_shortcut, ballotProperties.ballot_returned_we_vote_id);
          // IssueActions.issuesUnderBallotItemsRetrieveCalled(ballotProperties.google_civic_election_id); // This causes error: "Cannot dispatch in the middle of a dispatch"
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

  handleSearch = (searchText, filteredItems) => {
    this.setState({
      ballotSearchResults: filteredItems,
    });
  };

  handleToggleSearchBallot = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching });
  };

  // hideLocationsGuessComponent () {
  //   document.getElementById('location_guess').style.display = 'none';
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
    renderLog('Vote');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotWithItemsFromCompletionFilterType,
      ballotHeaderUnpinned, isSearching, ballotSearchResults,
      showFilterTabs,
    } = this.state;
    const { classes } = this.props;

    // const ballot_caveat = BallotStore.ballotProperties.ballot_caveat; // ballotProperties might be undefined
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    const dateText = window.moment ? window.moment(electionDayText).format('MMM Do, YYYY') : '--x--';
    const electionDayTextObject = electionDayText ? <span>{dateText}</span> : <span />;
    // console.log("electionName: ", electionName, ", electionDayText: ", electionDayText);

    let votePaddingClass = 'cordova-dummy-class';
    if (isWebApp() && ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length) {
      votePaddingClass = 'row ballot__body__ready-to-vote';
    } else if (isWebApp()) {
      votePaddingClass = 'row ballot__body__ready-to-vote--empty';
    }

    return (
      <VoteContainer>
        <DualHeaderContainer className={`ballot__heading-vote-section ${ballotHeaderUnpinned && isWebApp() ? 'ballot__heading__unpinned' : ''}`} style={cordovaVoteMiniHeader()}>
          <PageContentContainer>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <Helmet title="Vote - We Vote" />
                  <header className="ballot__header__group">
                    <BallotTitleHeader
                      electionName={electionName}
                      electionDayTextObject={electionDayTextObject}
                    />
                  </header>
                  <div className="ballot__filter__container">
                    <BallotFilterRow>
                      <div className="ballot__item-filter-tabs">
                        { ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length ? (
                          <>
                            <Suspense fallback={<></>}>
                              <FilterBaseSearch
                                isSearching={isSearching}
                                onToggleSearch={this.handleToggleSearchBallot}
                                allItems={ballotWithItemsFromCompletionFilterType}
                                onFilterBaseSearch={this.handleSearch}
                                alwaysOpen={!showFilterTabs}
                              />
                            </Suspense>
                          </>
                        ) : null}
                      </div>
                    </BallotFilterRow>
                  </div>
                </div>
              </div>
            </div>
          </PageContentContainer>
        </DualHeaderContainer>

        <PageContentContainer>
          <div className="container-fluid">
            <VoteWrapper>
              <div className={votePaddingClass}>
                <BrowserPushMessage incomingProps={this.props} />
                <div className="col-sm-12 col-lg-8">
                  {ballotWithItemsFromCompletionFilterType && ballotWithItemsFromCompletionFilterType.length ? (
                    <Card>
                      <TitleContainer>
                        <TitleText>Your Choices</TitleText>
                      </TitleContainer>
                      <div className="u-show-mobile-tablet">
                        <PollingLocationContainer>
                          <FindPollingLocation />
                        </PollingLocationContainer>
                      </div>
                      <ReturnOfficialBallotContainer>
                        <ReturnOfficialBallot />
                      </ReturnOfficialBallotContainer>
                      {(isSearching && ballotSearchResults.length ? ballotSearchResults : ballotWithItemsFromCompletionFilterType).map((item) => <BallotItemReadyToVote key={item.we_vote_id} {...item} />)}
                    </Card>
                  ) : /* No items decided */ (
                    <div>
                      <div className="u-show-mobile-tablet">
                        <Card>
                          <PollingLocationContainer>
                            <FindPollingLocation />
                          </PollingLocationContainer>
                        </Card>
                        <CardGap />
                      </div>
                      <Card>
                        <EmptyBallotMessageContainer>
                          <Ballot classes={{ root: classes.ballotIconRoot }} location={window.location} />
                          <EmptyBallotText>You haven&apos;t chosen any candidates or measures yet. Go to &quot;Ballot&quot; to decide what to vote for.</EmptyBallotText>
                          <Button
                            classes={{ root: classes.ballotButtonRoot }}
                            color="primary"
                            variant="contained"
                            onClick={() => historyPush('/ballot')}
                          >
                            <Ballot classes={{ root: classes.ballotButtonIconRoot }} location={window.location} />
                            Go to Ballot
                          </Button>
                        </EmptyBallotMessageContainer>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div className="col-lg-4 d-none d-lg-block d-print-none sidebar-menu">
                  <Card>
                    <PollingLocationContainer>
                      <FindPollingLocation />
                    </PollingLocationContainer>
                  </Card>
                </div>
              </div>
            </VoteWrapper>
          </div>
        </PageContentContainer>
      </VoteContainer>
    );
  }
}
Vote.propTypes = {
  match: PropTypes.object,
  classes: PropTypes.object,
};

const VoteContainer = styled('div')(({ theme }) => (`
  padding-top: ${cordovaScrollablePaneTopPadding()};
  ${theme.breakpoints.down('sm')} {
    overflow-x: hidden;
  }
`));

const VoteWrapper = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('md')} {
    margin: 1em 0;
  }
`));

const TitleContainer = styled('div')`
  padding: 1em 1em 0 1em;
  align-items: center;
`;

const TitleText = styled('h3')`
  width: fit-content;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
  @media print{
    font-size: 2rem;
  }
`;

const ReturnOfficialBallotContainer = styled('div')`
  padding: 0 1em 0 1em;
  align-items: center;
`;

// If we want to turn off filter tabs navigation bar:  ${!showFilterTabs && 'height: 0;'}
const BallotFilterRow = styled('div')`
  display: flex;
`;

const EmptyBallotMessageContainer = styled('div')`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled('span')(({ theme }) => (`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  ${theme.breakpoints.down('md')} {
    margin: 1em;
  }
`));

const PollingLocationContainer = styled('div')`
  padding: 1em 1em;
  align-items: center;
`;

const CardGap = styled('div')`
  padding: 7px;
`;

const styles = (theme) => ({
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

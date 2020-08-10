import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Card, CircularProgress } from '@material-ui/core';
import { Ballot, Settings } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { calculateBallotBaseUrl, capitalizeString } from '../../utils/textFormat';
import BallotActions from '../../actions/BallotActions';
import BallotSearchResults from '../Ballot/BallotSearchResults';
import BallotStore from '../../stores/BallotStore';
import EndorsementCard from '../Widgets/EndorsementCard';
import FooterDoneBar from '../Navigation/FooterDoneBar';
import { historyPush, isCordova, isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuidePositionItem from './VoterGuidePositionItem';
import ShowMoreItems from '../Widgets/ShowMoreItems';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import ThisIsMeAction from '../Widgets/ThisIsMeAction';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import YourPositionsVisibilityMessage from './YourPositionsVisibilityMessage';
import AppActions from '../../actions/AppActions';


// 2020-06-10 Being replaced with VoterGuideEndorsements
class VoterGuidePositions extends Component {
  static propTypes = {
    activeRoute: PropTypes.string,
    classes: PropTypes.object,
    location: PropTypes.object,
    organizationWeVoteId: PropTypes.string.isRequired,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      clearSearchTextNow: false,
      currentGoogleCivicElectionId: 0,
      numberOfPositionItemsToDisplay: 10,
      loadingMoreItems: false,
      organization: {},
      organizationId: 0,
      organizationWeVoteId: '',
      positionListForOneElection: [],
      searchIsUnderway: false,
      voter: {},
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchUnderway = this.searchUnderway.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    const { organizationWeVoteId } = this.props;
    // console.log('VoterGuidePositions componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    const ballotBaseUrl = calculateBallotBaseUrl(null, this.props.location.pathname);
    let googleCivicElectionIdFromUrl = this.props.params.google_civic_election_id || 0;
    // console.log('googleCivicElectionIdFromUrl: ', googleCivicElectionIdFromUrl);
    let ballotReturnedWeVoteId = this.props.params.ballot_returned_we_vote_id || '';
    ballotReturnedWeVoteId = ballotReturnedWeVoteId === 'none' ? '' : ballotReturnedWeVoteId;
    // console.log('this.props.params.ballot_returned_we_vote_id: ', this.props.params.ballot_returned_we_vote_id);
    let ballotLocationShortcut = this.props.params.ballot_location_shortcut || '';
    ballotLocationShortcut = ballotLocationShortcut.trim();
    ballotLocationShortcut = ballotLocationShortcut === 'none' ? '' : ballotLocationShortcut;
    let googleCivicElectionId = 0;
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
    } else {
      // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }

    // NOTE: voterAllPositionsRetrieve is also called in SupportStore when voterAddressRetrieve is received,
    // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
    SupportActions.voterAllPositionsRetrieve();

    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (organizationWeVoteId) {
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organizationWeVoteId, VoterStore.electionId());
      // TODO: COMMENT OUT because they were added to OrganizationVoterGuideTabs?
      // Positions for this organization, for this voter / election
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, true);
      // Positions for this organization, NOT including for this voter / election
      OrganizationActions.positionListForOpinionMaker(organizationWeVoteId, false, true);
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationId = organization.organization_id;

      let positionListForOneElection = [];
      let positionListForOneElectionLength = 0;
      if (organizationId) {
        if (organization.position_list_for_one_election) {
          positionListForOneElection = organization.position_list_for_one_election;
          positionListForOneElectionLength = positionListForOneElection.length || 0;
        }
        this.setState({
          organizationWeVoteId,
          organization,
          organizationId,
          positionListForOneElection,
          positionListForOneElectionLength,
        });
      }
      const voterGuideElectionList = VoterGuideStore.getVoterGuideElectionList(organizationWeVoteId);
      const voterGuideElectionListCount = voterGuideElectionList.length || 0;
      this.setState({
        voterGuideElectionListCount,
      });
    }
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      electionName,
      electionDayText,
      voter: VoterStore.getVoter(),
    });

    window.addEventListener('scroll', this.onScroll);
  }

  componentWillReceiveProps (nextProps) {
    // console.log('VoterGuidePositions componentWillReceiveProps');
    // When a new organization is passed in, update this component to show the new data
    const differentElection = this.state.currentGoogleCivicElectionId !== VoterStore.electionId();
    const differentOrganization = this.state.organizationWeVoteId !== nextProps.organizationWeVoteId;
    // console.log('VoterGuidePositions componentWillReceiveProps-differentElection: ', differentElection, ' differentOrganization: ', differentOrganization);
    if (differentElection || differentOrganization) {
      // console.log('VoterGuidePositions componentWillReceiveProps, differentElection:', differentElection, ', differentOrganization:', differentOrganization);
      // console.log('VoterGuidePositions, componentWillReceiveProps, nextProps.organization: ', nextProps.organization);
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(nextProps.organizationWeVoteId, VoterStore.electionId());
      // // Positions for this organization, for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organizationWeVoteId, true);
      // // Positions for this organization, NOT including for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organizationWeVoteId, false, true);
      const { organizationWeVoteId } = nextProps;
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationId = organization.organization_id;

      let positionListForOneElection = [];
      let positionListForOneElectionLength = 0;
      if (organizationId) {
        if (organization.position_list_for_one_election) {
          positionListForOneElection = organization.position_list_for_one_election;
          positionListForOneElectionLength = positionListForOneElection.length || 0;
        }
        this.setState({
          organizationWeVoteId,
          organization,
          organizationId,
          positionListForOneElection,
          positionListForOneElectionLength,
        });
      }
      this.setState({
        currentGoogleCivicElectionId: VoterStore.electionId(),
      });
    }
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      electionName,
      electionDayText,
    });
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   if (this.state.currentGoogleCivicElectionId !== nextState.currentGoogleCivicElectionId) {
  //     // console.log('shouldComponentUpdate: this.state.currentGoogleCivicElectionId', this.state.currentGoogleCivicElectionId, ', nextState.currentGoogleCivicElectionId', nextState.currentGoogleCivicElectionId);
  //     return true;
  //   }
  //   if (this.state.currentOrganizationWeVoteId !== nextState.currentOrganizationWeVoteId) {
  //     // console.log('shouldComponentUpdate: this.state.currentOrganizationWeVoteId', this.state.currentOrganizationWeVoteId, ', nextState.currentOrganizationWeVoteId', nextState.currentOrganizationWeVoteId);
  //     return true;
  //   }
  //   if (this.state.electionName !== nextState.electionName) {
  //     // console.log('shouldComponentUpdate: this.state.electionName', this.state.electionName, ', nextState.electionName', nextState.electionName);
  //     return true;
  //   }
  //   if (this.state.loadingMoreItems !== nextState.loadingMoreItems) {
  //     // console.log('shouldComponentUpdate: this.state.loadingMoreItems', this.state.loadingMoreItems, ', nextState.loadingMoreItems', nextState.loadingMoreItems);
  //     return true;
  //   }
  //   if (this.state.numberOfPositionItemsToDisplay !== nextState.numberOfPositionItemsToDisplay) {
  //     // console.log('shouldComponentUpdate: this.state.numberOfPositionItemsToDisplay', this.state.numberOfPositionItemsToDisplay, ', nextState.numberOfPositionItemsToDisplay', nextState.numberOfPositionItemsToDisplay);
  //     return true;
  //   }
  //   if (this.state.organizationId !== nextState.organizationId) {
  //     // console.log('shouldComponentUpdate: this.state.organizationId', this.state.organizationId, ', nextState.organizationId', nextState.organizationId);
  //     return true;
  //   }
  //   if (this.state.positionListForOneElectionLength !== nextState.positionListForOneElectionLength) {
  //     // console.log('shouldComponentUpdate: this.state.positionListForOneElectionLength', this.state.positionListForOneElectionLength, ', nextState.positionListForOneElectionLength', nextState.positionListForOneElectionLength);
  //     return true;
  //   }
  //   if (this.state.voterGuideElectionListCount !== nextState.voterGuideElectionListCount) {
  //     // console.log('shouldComponentUpdate: this.state.voterGuideElectionListCount', this.state.voterGuideElectionListCount, ', nextState.voterGuideElectionListCount', nextState.voterGuideElectionListCount);
  //     return true;
  //   }
  //   // console.log('shouldComponentUpdate no changes');
  //   return false;
  // }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.positionItemTimer) {
      clearTimeout(this.positionItemTimer);
      this.positionItemTimer = null;
    }
    window.removeEventListener('scroll', this.onScroll);
  }

  onBallotStoreChange () {
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      electionName,
      electionDayText,
    });
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuidePositions onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.position_list_for_one_election) {
        const positionListForOneElection = organization.position_list_for_one_election;
        const positionListForOneElectionLength = positionListForOneElection.length || 0;
        this.setState({
          positionListForOneElection,
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
    // console.log('VoterGuidePositions onSupportStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.position_list_for_one_election) {
        const positionListForOneElection = organization.position_list_for_one_election;
        const positionListForOneElectionLength = positionListForOneElection.length || 0;
        this.setState({
          positionListForOneElection,
          positionListForOneElectionLength,
        });
      }
      this.setState({
        organization,
      });
    }
  }

  onVoterGuideStoreChange () {
    const { organizationWeVoteId } = this.props;
    const voterGuideElectionList = VoterGuideStore.getVoterGuideElectionList(organizationWeVoteId);
    const voterGuideElectionListCount = voterGuideElectionList.length || 0;
    this.setState({
      voterGuideElectionListCount,
    });
  }

  onVoterStoreChange () {
    const electionName = BallotStore.currentBallotElectionName;
    const electionDayText = BallotStore.currentBallotElectionDate;
    this.setState({
      currentGoogleCivicElectionId: VoterStore.electionId(),
      electionName,
      electionDayText,
      voter: VoterStore.getVoter(),
    });
  }

  onScroll () {
    const showMoreItemsElement = document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      const { numberOfPositionItemsToDisplay, positionListForOneElectionLength } = this.state;

      // console.log('window.height: ', window.innerHeight);
      // console.log('Window Scroll: ', window.scrollY);
      // console.log('Bottom: ', showMoreItemsElement.getBoundingClientRect().bottom);
      // console.log('positionListForOneElectionLength: ', positionListForOneElectionLength);
      // console.log('numberOfPositionItemsToDisplay: ', numberOfPositionItemsToDisplay);

      if (numberOfPositionItemsToDisplay < positionListForOneElectionLength) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfPositionItemsToDisplay();
        }
      } else {
        this.setState({ loadingMoreItems: false });
      }
    }
  }

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);

    numberOfPositionItemsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);

    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  openShowElectionsWithOrganizationVoterGuidesModal () {
    // console.log('VoterGuidePositions openShowElectionsWithOrganizationVoterGuidesModal');
    const { voterGuideElectionListCount } = this.state;
    if (voterGuideElectionListCount) {
      AppActions.setShowElectionsWithOrganizationVoterGuidesModal(true);
    }
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been cleared
  clearSearch () {
    // console.log('VoterGuidePositions, clearSearch');
    this.setState({
      clearSearchTextNow: true,
      searchIsUnderway: false,
    });
  }

  // This function is called by BallotSearchResults and SearchBar when an API search has been triggered
  searchUnderway (searchIsUnderway) {
    // console.log('VoterGuidePositions, searchIsUnderway: ', searchIsUnderway);
    this.setState({
      clearSearchTextNow: false,
      searchIsUnderway,
    });
  }

  render () {
    renderLog('VoterGuidePositions'); // Set LOG_RENDER_EVENTS to log all renders
    // console.log('VoterGuidePositions render');
    const { classes } = this.props;
    const {
      clearSearchTextNow,
      currentGoogleCivicElectionId,
      electionDayText,
      electionName,
      loadingMoreItems,
      organization,
      organizationId,
      organizationWeVoteId,
      numberOfPositionItemsToDisplay,
      positionListForOneElection,
      positionListForOneElectionLength,
      searchIsUnderway,
      voterGuideElectionListCount,
    } = this.state;
    // console.log('voterGuideElectionListCount:', voterGuideElectionListCount);

    if (!organization) {
      // Wait until organization has been set to render
      return null;
    }
    if (!organizationId) {
      return (
        <div className="card">
          <div className="card-main">
            <h4 className="h4">Voter guide not found.</h4>
          </div>
        </div>
      );
    }

    let lookingAtSelf = false;
    if (this.state.voter) {
      lookingAtSelf = this.state.voter.linked_organization_we_vote_id === organizationWeVoteId;
    }

    // console.log("lookingAtSelf: ", lookingAtSelf);
    const electionDayTextFormatted = electionDayText ? <span>{moment(electionDayText).format('MMM Do, YYYY')}</span> : <span />;
    const organizationName = capitalizeString(organization.organization_name);
    const titleText = `${organizationName} - We Vote`;
    const descriptionText = `See endorsements and opinions from ${organizationName} for the November election`;
    const atLeastOnePositionFoundForThisElection = positionListForOneElection && positionListForOneElection.length !== 0;

    let numberOfPositionItemsDisplayed = 0;
    return (
      <VoterGuidePositionsWrapper>
        {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <div className="card">
          <div className="card-main">
            <header className="ballot__header__group">
              <TitleWrapper
                className={isCordova() ? 'ballot__header__title__cordova' : 'ballot__header__title'}
                onClick={() => this.openShowElectionsWithOrganizationVoterGuidesModal()}
                showCursorPointer={voterGuideElectionListCount}
              >
                { electionName ? (
                  <span className={isWebApp() ? 'u-push--sm' : 'ballot__header__title__cordova-text'}>
                    {electionName}
                    {!!(voterGuideElectionListCount) && (
                      <SettingsIconWrapper>
                        <Settings classes={{ root: classes.settingsIcon }} />
                      </SettingsIconWrapper>
                    )}
                    {Boolean(electionDayText) && (
                      <>
                        {' '}
                        <span className="d-none d-sm-inline">&mdash;</span>
                        {' '}
                        <span className="u-gray-mid u-no-break">
                          {electionDayTextFormatted}
                        </span>
                      </>
                    )}
                  </span>
                ) : (
                  <span className="u-push--sm">
                    Choose Election...
                  </span>
                )}
              </TitleWrapper>
            </header>
          </div>
        </div>

        <div className="page-content-container">
          <div className="container-fluid">
            <VoterGuideEndorsementsWrapper>
              {lookingAtSelf && (
                <div className="u-margin-left--md u-push--md">
                  <BallotSearchResults
                    clearSearchTextNow={clearSearchTextNow}
                    googleCivicElectionId={currentGoogleCivicElectionId}
                    organizationWeVoteId={this.state.voter.linked_organization_we_vote_id}
                    searchUnderwayFunction={this.searchUnderway}
                  />
                </div>
              )}
              {!!(atLeastOnePositionFoundForThisElection && !searchIsUnderway) && (
                <div>
                  <>
                    {lookingAtSelf && <YourPositionsVisibilityMessage positionList={positionListForOneElection} />}
                    {positionListForOneElection.map((onePosition) => {
                      // console.log('numberOfPositionItemsDisplayed:', numberOfPositionItemsDisplayed);
                      if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
                        return null;
                      }
                      numberOfPositionItemsDisplayed += 1;
                      return (
                        <VoterGuidePositionItemWrapper
                          key={`VoterGuidePositionItem-${onePosition.position_we_vote_id}`}
                        >
                          <VoterGuidePositionItem
                            ballotItemWeVoteId={onePosition.ballot_item_we_vote_id}
                            organizationWeVoteId={organizationWeVoteId}
                            position={onePosition}
                          />
                        </VoterGuidePositionItemWrapper>
                      );
                    })}
                  </>
                  <ShowMoreItemsWrapper
                    id="showMoreItemsId"
                    onClick={this.increaseNumberOfPositionItemsToDisplay}
                  >
                    <ShowMoreItems
                      loadingMoreItemsNow={loadingMoreItems}
                      numberOfItemsDisplayed={numberOfPositionItemsDisplayed}
                      numberOfItemsTotal={positionListForOneElectionLength}
                    />
                  </ShowMoreItemsWrapper>
                  <LoadingItemsWheel>
                    {loadingMoreItems ? <CircularProgress /> : null}
                  </LoadingItemsWheel>
                </div>
              )}
              {/* If the positionListForOneElection comes back empty, display a message saying that there aren't any positions for this election. */}
              {!atLeastOnePositionFoundForThisElection && (
                <Card>
                  <EmptyBallotMessageContainer>
                    <Ballot classes={{ root: classes.ballotIconRoot }} />
                    <EmptyBallotText>
                      {organization.organization_name}
                      {' '}
                      has not made any endorsements for this election.
                    </EmptyBallotText>
                    {/*
                    <Button
                      classes={{ root: classes.ballotButtonRoot }}
                      color="primary"
                      variant="contained"
                      // onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('addpositions')}
                    >
                      See All Endorsements
                    </Button>
                    */}
                  </EmptyBallotMessageContainer>
                </Card>
              )}
            </VoterGuideEndorsementsWrapper>
            {searchIsUnderway ? (
              <span className="d-block d-sm-none">
                <FooterDoneBar
                  doneFunction={this.clearSearch}
                  doneButtonText="Clear Search"
                />
              </span>
            ) : null}
            <ExtraActionsWrapper>
              <EndorsementCard
                variant="primary"
                buttonText="ENDORSEMENTS MISSING?"
                organizationWeVoteId={organizationWeVoteId}
                text={`Are there endorsements from ${organizationName} that you expected to see?`}
                title="Endorsements Missing?"
              />
              {organization.organization_twitter_handle && (
                <ThisIsMeAction
                  kindOfOwner="ORGANIZATION"
                  nameBeingViewed={organization.organization_name}
                  twitterHandleBeingViewed={organization.organization_twitter_handle}
                  whiteOnBlue
                />
              )}
            </ExtraActionsWrapper>
          </div>
        </div>
      </VoterGuidePositionsWrapper>
    );
  }
}

const styles = theme => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
    [theme.breakpoints.down('sm')]: {
      width: 75,
      height: 75,
    },
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  settingsIcon: {
    color: '#999',
    marginTop: '-5px',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
});

const EmptyBallotMessageContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column;
  padding: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: .5em .5em;
  }
`;

const EmptyBallotText = styled.p`
  font-size: 16px;
  text-align: center;
  margin: 1em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 1em;
  }
`;

const ExtraActionsWrapper = styled.div`
  margin-bottom: 20px;
  margin-left: -15px;
  margin-right: -15px;
`;

const LoadingItemsWheel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SettingsIconWrapper = styled.span`
`;

const ShowMoreItemsWrapper = styled.div`
`;

const TitleWrapper = styled.h1`
  ${({ showCursorPointer }) => (showCursorPointer ? 'cursor: pointer;' : '')}
`;

const VoterGuideEndorsementsWrapper = styled.div`
  margin-bottom: 10px;
  margin-left: -15px;
  margin-right: -15px;
`;

const VoterGuidePositionItemWrapper = styled.div`
  margin-bottom: 10px;
`;

const VoterGuidePositionsWrapper = styled.div`
`;

export default withStyles(styles)(VoterGuidePositions);

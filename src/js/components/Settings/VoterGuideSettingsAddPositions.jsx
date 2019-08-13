import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import BallotIcon from '@material-ui/icons/Ballot';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import BallotItemForAddPositions from './BallotItemForAddPositions';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';
import FilterBase from '../Filter/FilterBase';
import SettingsAddBallotItemsFilter from '../Filter/SettingsAddBallotItemsFilter';
import SettingsSeePositionsFilter from '../Filter/SettingsSeePositionsFilter';
import LoadingWheel from '../LoadingWheel';
import AppActions from '../../actions/AppActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { historyPush } from '../../utils/cordovaUtils';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../utils/textFormat';


const groupedFilters = [
  {
    filterName: 'showFederalRaceFilter',
    filterDisplayName: 'Federal',
    filterId: 'federalRaceFilter',  // thumbUpFilter
  },
  {
    filterName: 'showStateRaceFilter',
    filterDisplayName: 'State',
    filterId: 'stateRaceFilter',
  },
  {
    filterName: 'showMeasureRaceFilter',
    filterDisplayName: 'Measure',
    filterId: 'measureRaceFilter',
  },
  {
    filterName: 'showLocalRaceFilter',
    filterDisplayName: 'Local',
    filterId: 'localRaceFilter',
  },
];

const islandFilters = [
  // {
  //   filterName: 'showCommentFilter',
  //   icon: <CommentIcon />,
  //   filterDisplayName: 'Commented',
  //   filterId: 'islandFilterCommented',
  // },
];

class VoterGuideSettingsAddPositions extends Component {
  static propTypes = {
    addNewPositionsMode: PropTypes.bool,
    classes: PropTypes.object,
    voterGuideWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      addNewPositionsMode: false,
      ballotItemList: [],
      filteredBallotItemList: [],
      filteredPositionListForOneElection: [],
      localPositionListHasBeenRetrieved: {},
      positionListForOneElection: [],
    };
  }

  componentDidMount () {
    // console.log('componentDidMount addNewPositionsMode:', this.props.addNewPositionsMode, ', this.props.voterGuideWeVoteId:', this.props.voterGuideWeVoteId);
    this.setState({
      addNewPositionsMode: this.props.addNewPositionsMode,
      voterGuideWeVoteId: this.props.voterGuideWeVoteId,
    });
    let voterGuide;
    if (this.props.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.props.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.props.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          // localGoogleCivicElectionId: voterGuide.google_civic_election_id,
          voterGuide,
        });
      }
    }
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps addNewPositionsMode:', nextProps.addNewPositionsMode, ', nextProps.voterGuideWeVoteId:', nextProps.voterGuideWeVoteId);
    this.setState({
      addNewPositionsMode: nextProps.addNewPositionsMode,
      voterGuideWeVoteId: nextProps.voterGuideWeVoteId,
    });
    let voterGuide;
    if (nextProps.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(nextProps.voterGuideWeVoteId)) {
      voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(nextProps.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          // localGoogleCivicElectionId: voterGuide.google_civic_election_id,
          voterGuide,
        });
      }
    }
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
  }

  componentDidUpdate (prevProps, prevState) {
    // Whenever a voter goes from "Add Endorsements" to "Endorsed or Opposed" we want to refresh the position list
    const { addNewPositionsMode } = this.state;
    const { addNewPositionsMode: previousAddNewPositionsMode } = prevState;
    // console.log('componentDidUpdate addNewPositionsMode:', addNewPositionsMode, ', previousAddNewPositionsMode:', previousAddNewPositionsMode);
    // If previously we were in addNewPositionsMode, and now we are NOT, update the positionListForOpinionMaker
    if (previousAddNewPositionsMode && !addNewPositionsMode) {
      // console.log('We should retrieve positionListForOpinionMaker');
      const { linkedOrganizationWeVoteId, voterGuide } = this.state;
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (voterGuide && voterGuide.google_civic_election_id && organization && organization.organization_we_vote_id) {
        // console.log('componentDidUpdate we have what we need');
        OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
        OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true, false, voterGuide.google_civic_election_id);
      }
    }
  }

  // NOTE FROM DALE 2019-08-12 shouldComponentUpdate gets in the way of the filtering system
  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.addNewPositionsMode !== nextState.addNewPositionsMode) {
  //     // console.log('this.state.addNewPositionsMode: ', this.state.addNewPositionsMode, ', nextState.addNewPositionsMode: ', nextState.addNewPositionsMode);
  //     return true;
  //   }
  //   if (this.state.linkedOrganizationWeVoteId !== nextState.linkedOrganizationWeVoteId) {
  //     // console.log('this.state.linkedOrganizationWeVoteId: ', this.state.linkedOrganizationWeVoteId, ', nextState.linkedOrganizationWeVoteId: ', nextState.linkedOrganizationWeVoteId);
  //     return true;
  //   }
  //   if (this.state.localGoogleCivicElectionId !== nextState.localGoogleCivicElectionId) {
  //     // console.log('this.state.localGoogleCivicElectionId: ', this.state.localGoogleCivicElectionId, ', nextState.localGoogleCivicElectionId: ', nextState.localGoogleCivicElectionId);
  //     return true;
  //   }
  //   if (this.state.voterGuideWeVoteId !== nextState.voterGuideWeVoteId) {
  //     // console.log('this.state.voterGuideWeVoteId: ', this.state.voterGuideWeVoteId, ', nextState.voterGuideWeVoteId: ', nextState.voterGuideWeVoteId);
  //     return true;
  //   }
  //   if (JSON.stringify(this.state.filteredPositionListForOneElection) !== JSON.stringify(nextState.filteredPositionListForOneElection)) {
  //     console.log('this.state.filteredPositionListForOneElection:', this.state.filteredPositionListForOneElection, ', nextState.filteredPositionListForOneElection:', nextState.filteredPositionListForOneElection);
  //     return true;
  //   }
  //   if (JSON.stringify(this.state.filteredBallotItemList) !== JSON.stringify(nextState.filteredBallotItemList)) {
  //     console.log('this.state.filteredBallotItemList:', this.state.filteredBallotItemList, ', nextState.filteredBallotItemList:', nextState.filteredBallotItemList);
  //     return true;
  //   }
  //   console.log('shouldComponentUpdate no change');
  //   return false;
  // }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    const incomingBallotItemList = BallotStore.ballot;
    // console.log('VoterGuideSettingsAddPositions, onBallotStoreChange incomingBallotItemList:', incomingBallotItemList);
    this.setState({
      ballotItemList: incomingBallotItemList,
      filteredBallotItemList: incomingBallotItemList,
    });
  }

  onOrganizationStoreChange () {
    const { linkedOrganizationWeVoteId, localPositionListHasBeenRetrieved, voterGuide } = this.state;
    // console.log('onOrganizationStoreChange, linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
    if (!linkedOrganizationWeVoteId) {
      const voter = VoterStore.getVoter();
      // console.log('onOrganizationStoreChange, voter: ', voter);
      if (voter && voter.we_vote_id) {
        const newLinkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
        // console.log('onOrganizationStoreChange, newLinkedOrganizationWeVoteId: ', newLinkedOrganizationWeVoteId);
        if (newLinkedOrganizationWeVoteId) {
          this.setState({
            linkedOrganizationWeVoteId: newLinkedOrganizationWeVoteId,
          });
          OrganizationActions.organizationRetrieve(newLinkedOrganizationWeVoteId);
        }
      }
    } else {
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      this.setState({
        positionListForOneElection: organization.position_list_for_one_election,
        filteredPositionListForOneElection: organization.position_list_for_one_election,
      });
      // Positions for this organization, for this election
      // console.log('onOrganizationStoreChange, voterGuide: ', voterGuide, ', organization:', organization);
      if (voterGuide && voterGuide.google_civic_election_id && organization && organization.organization_we_vote_id) {
        const doNotRetrievePositionList = localPositionListHasBeenRetrieved[voterGuide.google_civic_election_id] || OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(voterGuide.google_civic_election_id, organization.organization_we_vote_id);
        if (!doNotRetrievePositionList) {
          // console.log('CALLING positionListForOpinionMaker');
          localPositionListHasBeenRetrieved[voterGuide.google_civic_election_id] = true;
          this.setState({
            localPositionListHasBeenRetrieved,
          });
          OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, false, true, voterGuide.google_civic_election_id);
          OrganizationActions.positionListForOpinionMaker(organization.organization_we_vote_id, true, false, voterGuide.google_civic_election_id);
        }
      }
    }
  }

  onVoterGuideStoreChange () {
    // console.log('VoterGuideSettingsPositions onVoterGuideStoreChange');
    if (this.state.voterGuideWeVoteId && isProperlyFormattedVoterGuideWeVoteId(this.state.voterGuideWeVoteId)) {
      const voterGuide = VoterGuideStore.getVoterGuideByVoterGuideId(this.state.voterGuideWeVoteId);
      if (voterGuide && voterGuide.we_vote_id) {
        this.setState({
          // localGoogleCivicElectionId: voterGuide.google_civic_election_id,
          voterGuide,
        });
      }
    }
  }

  onVoterStoreChange () {
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    let linkedOrganizationWeVoteId;
    if (voter && voter.we_vote_id) {
      linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
      if (linkedOrganizationWeVoteId) {
        this.setState({
          linkedOrganizationWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
        if (organization && organization.organization_we_vote_id) {
          this.onOrganizationStoreChange();
        } else {
          OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
          // if (voterGuide && voterGuide.google_civic_election_id) {
          // OrganizationActions.positionListForOpinionMaker(linkedOrganizationWeVoteId, true, false); // , voterGuide.google_civic_election_id
          // }
        }
      }
    }
    // console.log('onVoterStoreChange, linkedOrganizationWeVoteId: ', linkedOrganizationWeVoteId);
  }

  goToVoterGuideDisplay = () => {
    let voterGuideDisplay = '/ballot';
    if (this.state.voterGuide) {
      voterGuideDisplay = `/voterguide/${this.state.voterGuide.organization_we_vote_id}/ballot/election/${this.state.voterGuide.google_civic_election_id}/positions`;
    }
    historyPush(voterGuideDisplay);
  }

  handleFilteredBallotItemsChange = filteredBallotItemList => this.setState({ filteredBallotItemList });

  handleFilteredPositionListChange = filteredPositionListForOneElection => this.setState({ filteredPositionListForOneElection });

  goToDifferentVoterGuideSettingsDashboardTab (dashboardEditMode = '') {
    AppActions.setVoterGuideSettingsDashboardEditMode(dashboardEditMode);
  }

  render () {
    // console.log('VoterGuideSettingsAddPositions render');
    renderLog(__filename);
    const { classes } = this.props;
    const { addNewPositionsMode } = this.state;
    if (!addNewPositionsMode) {
      // ////////////////////////
      // Current Positions - First Tab
      const selectedFiltersCurrentDefault = ['showFederalRaceFilter', 'showStateRaceFilter', 'showMeasureRaceFilter', 'showLocalRaceFilter'];
      const { positionListForOneElection, filteredPositionListForOneElection } = this.state;
      // console.log('VoterGuideSettingsAddPositions render, filteredPositionListForOneElection:', filteredPositionListForOneElection);
      const atLeastOnePositionFoundForThisElection = positionListForOneElection && positionListForOneElection.length !== 0;
      if (!atLeastOnePositionFoundForThisElection) {
        return (
          <Card>
            <EmptyBallotMessageContainer>
              <BallotIcon classes={{ root: classes.ballotIconRoot }} />
              <EmptyBallotText>You haven&apos;t endorsed any candidates or measures yet. Click &quot;Add Endorsements&quot; to help people who trust you make better voting decisions.</EmptyBallotText>
              <Button
                classes={{ root: classes.ballotButtonRoot }}
                color="primary"
                variant="contained"
                onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('addpositions')}
              >
                <BallotIcon classes={{ root: classes.ballotButtonIconRoot }} />
                Add Endorsements
              </Button>
            </EmptyBallotMessageContainer>
          </Card>
        );
      }
      // const { classes } = this.props;
      // console.log('filteredPositionListForOneElection: ', filteredPositionListForOneElection);
      let ballotItemDisplayNameForPosition;
      let ballotItemWeVoteIdForPosition;
      let candidateListForPosition;
      let kindOfBallotItemForPosition;
      return (
        <div>
          <FilterBase
            key="currentPositionsFilterBase"
            groupedFilters={groupedFilters}
            islandFilters={islandFilters}
            allItems={positionListForOneElection}
            onFilteredItemsChange={this.handleFilteredPositionListChange}
            selectedFiltersDefault={selectedFiltersCurrentDefault}
          >
            {/* props get added to this component in FilterBase */}
            <SettingsSeePositionsFilter />
          </FilterBase>
          <ul className="card-child__list-group">
            {filteredPositionListForOneElection.map((onePosition) => {
              // console.log('onePosition:', onePosition);
              ballotItemDisplayNameForPosition = (onePosition.kind_of_ballot_item === 'CANDIDATE') ? onePosition.contest_office_name : onePosition.ballot_item_display_name;
              ballotItemWeVoteIdForPosition = (onePosition.kind_of_ballot_item === 'CANDIDATE') ? onePosition.contest_office_we_vote_id : onePosition.ballot_item_we_vote_id;
              if (!ballotItemDisplayNameForPosition || !ballotItemWeVoteIdForPosition) {
                return null;
              }
              if (onePosition.kind_of_ballot_item === 'CANDIDATE') {
                // We create a simulated candidateList from the positionList
                candidateListForPosition = [{
                  ballot_item_display_name: onePosition.ballot_item_display_name,
                  candidate_photo_url_large: onePosition.ballot_item_image_url_https_large,
                  candidate_photo_url_medium: onePosition.ballot_item_image_url_https_medium,
                  candidate_photo_url_tiny: onePosition.ballot_item_image_url_https_tiny,
                  contest_office_id: onePosition.contest_office_id,
                  contest_office_name: onePosition.contest_office_name,
                  contest_office_we_vote_id: onePosition.contest_office_we_vote_id,
                  google_civic_election_id: onePosition.google_civic_election_id,
                  is_oppose: onePosition.is_oppose,
                  is_support: onePosition.is_support,
                  kind_of_ballot_item: onePosition.kind_of_ballot_item,
                  party: onePosition.ballot_item_political_party,
                  state_code: onePosition.state_code,
                  twitter_followers_count: onePosition.twitter_followers_count,
                  we_vote_id: onePosition.ballot_item_we_vote_id,
                }];
              } else {
                candidateListForPosition = [];
              }
              kindOfBallotItemForPosition = (onePosition.kind_of_ballot_item === 'CANDIDATE') ? 'OFFICE' : 'MEASURE';
              // console.log('kindOfBallotItemForPosition:', kindOfBallotItemForPosition, ', ballotItemWeVoteIdForPosition:', ballotItemWeVoteIdForPosition, ', ballotItemDisplayNameForPosition:', ballotItemDisplayNameForPosition);
              return (
                <BallotItemForAddPositions
                  key={`currentPositionKey-${ballotItemWeVoteIdForPosition}-${onePosition.position_we_vote_id}`}
                  allBallotItemsCount={2}
                  ballotItemDisplayName={ballotItemDisplayNameForPosition}
                  ballotItemWeVoteId={ballotItemWeVoteIdForPosition}
                  candidateList={candidateListForPosition}
                  kindOfBallotItem={kindOfBallotItemForPosition}
                  externalUniqueId={`currentPositionKey-${ballotItemWeVoteIdForPosition}-${onePosition.position_we_vote_id}`}
                />
              );
            })
            }
          </ul>
          {atLeastOnePositionFoundForThisElection && (
            <div className="fa-pull-right">
              <Button
                color="primary"
                id="voterGuideSettingsPositionsSeeFullBallot"
                onClick={this.goToVoterGuideDisplay}
                variant="contained"
              >
                See Preview&nbsp;&nbsp;&gt;
              </Button>
            </div>
          )
          }
        </div>
      );
    } else {
      // ////////////////////////
      // Add New Positions - Second Tab
      const selectedFiltersAddDefault = ['showFederalRaceFilter'];
      const { ballotItemList, filteredBallotItemList } = this.state;
      // console.log('VoterGuideSettingsAddPositions render, filteredBallotItemList:', filteredBallotItemList);
      if (!ballotItemList) {
        return LoadingWheel;
      }
      const atLeastOnePositionFoundWithTheseFilters = filteredBallotItemList && filteredBallotItemList.length !== 0;

      // const { classes } = this.props;
      // console.log('ballotItemList: ', ballotItemList);
      return (
        <div>
          <FilterBase
            key="addPositionsFilterBase"
            groupedFilters={groupedFilters}
            islandFilters={islandFilters}
            allItems={ballotItemList}
            onFilteredItemsChange={this.handleFilteredBallotItemsChange}
            selectedFiltersDefault={selectedFiltersAddDefault}
          >
            {/* props get added to this component in FilterBase */}
            <SettingsAddBallotItemsFilter />
          </FilterBase>
          {atLeastOnePositionFoundWithTheseFilters ? (
            <ul className="card-child__list-group">
              {filteredBallotItemList.map((oneBallotItem) => {
                // console.log('oneBallotItem: ', oneBallotItem);
                if (!oneBallotItem.we_vote_id) {
                  return null;
                }
                return (
                  <BallotItemForAddPositions
                    key={`addNewPositionKey-${oneBallotItem.we_vote_id}`}
                    externalUniqueId={`addNewPositionKey-${oneBallotItem.we_vote_id}`}
                    allBallotItemsCount={2}
                    // ref={(ref) => { this.ballotItems[oneBallotItem.we_vote_id] = ref; }}
                    ballotItemDisplayName={oneBallotItem.ballot_item_display_name}
                    candidateList={oneBallotItem.candidate_list}
                    kindOfBallotItem={oneBallotItem.kind_of_ballot_item}
                    ballotItemWeVoteId={oneBallotItem.we_vote_id}
                  />
                );
              })
              }
            </ul>
          ) : (
            <Card>
              <EmptyBallotMessageContainer>
                <BallotIcon classes={{ root: classes.ballotIconRoot }} />
                <EmptyBallotText>No results found. Try selecting different filters to see results.</EmptyBallotText>
                <Button
                  classes={{ root: classes.ballotButtonRoot }}
                  color="primary"
                  variant="contained"
                  onClick={() => this.goToDifferentVoterGuideSettingsDashboardTab('addpositions')}
                >
                  <BallotIcon classes={{ root: classes.ballotButtonIconRoot }} />
                  Clear Filters
                </Button>
              </EmptyBallotMessageContainer>
            </Card>
          )
          }
        </div>
      );
    }
  }
}

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

export default withStyles(styles)(VoterGuideSettingsAddPositions);

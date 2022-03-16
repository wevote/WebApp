import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../common/utils/logging';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import PositionRowItem from './PositionRowItem';
import apiCalming from '../../common/utils/apiCalming';


const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 10;

class PositionRowList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredPositionList: [],
      numberOfPositionItemsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
      positionList: [],
    };
  }

  componentDidMount () {
    // console.log('PositionRowList componentDidMount');

    // let { incomingPositionList } = this.props;
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowList componentDidMount, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    }
    let incomingPositionList = allCachedPositionsForThisBallotItem;
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    // Replicate onOrganizationStoreChange
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    incomingPositionList = incomingPositionList.map((position) => {
      // console.log('PositionRowList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    // const filteredPositionListWithFollowedData = filteredPositionList.map((position) => {
    //   // console.log('PositionRowList onOrganizationStoreChange, position: ', position);
    //   return ({
    //     ...position,
    //     followed: organizationsVoterIsFollowing.filter(org => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
    //   });
    // });

    // Replicate onFriendStoreChange
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('PositionRowList onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    incomingPositionList = incomingPositionList.map((position) => {
      // console.log('PositionRowList componentDidMount, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });

    OrganizationActions.organizationsFollowedRetrieve();
    if (!organizationsVoterIsFriendsWith.length > 0) {
      if (apiCalming('friendList', 1500)) {
        FriendActions.currentFriends();
      }
    }

    this.setState({
      positionList: incomingPositionList,
      filteredPositionList: incomingPositionList,
      filteredPositionListLength: incomingPositionList.length,
    });
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.friendStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowList onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.setState({
        // positionList: incomingPositionList,
        incomingPositionList: allCachedPositionsForThisBallotItem,
      });
    }
  }

  onFriendStoreChange () {
    const { positionList } = this.state; // filteredPositionList,
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('PositionRowList onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    const positionListWithFriendData = positionList.map((position) => {
      // console.log('PositionRowList onFriendStoreChange, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    // const filteredPositionListWithFriendData = filteredPositionList.map((position) => {
    //   // console.log('PositionRowList onFriendStoreChange, position: ', position);
    //   return ({
    //     ...position,
    //     currentFriend: organizationsVoterIsFriendsWith.filter(organizationWeVoteId => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
    //   });
    // });
    this.setState({
      positionList: positionListWithFriendData,
      // filteredPositionList: filteredPositionListWithFriendData,
      // filteredPositionListLength: filteredPositionListWithFriendData.length,
    });
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowList onMeasureStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.setState({
        // positionList: incomingPositionList,
        incomingPositionList: allCachedPositionsForThisBallotItem,
      });
    }
  }

  onOrganizationStoreChange () {
    // console.log('PositionRowList onOrganizationStoreChange');
    const { filteredPositionList, positionList } = this.state;
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    const positionListWithFollowedData = positionList.map((position) => {
      // console.log('PositionRowList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    // eslint-disable-next-line arrow-body-style
    const filteredPositionListWithFollowedData = filteredPositionList.map((position) => {
      // console.log('PositionRowList onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });
    this.setState({
      positionList: positionListWithFollowedData,
      filteredPositionList: filteredPositionListWithFollowedData,
      filteredPositionListLength: filteredPositionListWithFollowedData.length,
    });
  }

  onFilteredItemsChange = (filteredOrganizations) => {
    // console.log('PositionRowList onFilteredItemsChange, filteredOrganizations:', filteredOrganizations);
    this.setState({
      filteredPositionList: filteredOrganizations,
      filteredPositionListLength: filteredOrganizations.length,
      isSearching: false,
    });
  }

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfPositionItemsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfPositionItemsToDisplay);

    numberOfPositionItemsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfPositionItemsToDisplay);

    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfPositionItemsToDisplay,
      });
    }, 500);
  }

  render () {
    const { positionList } = this.state;
    renderLog('PositionRowList');  // Set LOG_RENDER_EVENTS to log all renders
    if (!positionList) {
      // console.log('PositionRowList Loading...');
      return LoadingWheel;
    }
    const {
      filteredPositionList, numberOfPositionItemsToDisplay,
    } = this.state;
    // console.log('PositionRowList render, positionListExistsTitle:', positionListExistsTitle);
    // console.log('this.state.filteredPositionList render: ', this.state.filteredPositionList);
    let numberOfPositionItemsDisplayed = 0;
    return (
      <CandidateEndorsementsContainer>
        {filteredPositionList.map((onePosition) => {
          // console.log('numberOfPositionItemsDisplayed:', numberOfPositionItemsDisplayed);
          if (numberOfPositionItemsDisplayed >= numberOfPositionItemsToDisplay) {
            return null;
          }
          numberOfPositionItemsDisplayed += 1;
          return (
            <CandidateEndorsementContainer key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}>
              <PositionRowItem
                position={onePosition}
              />
            </CandidateEndorsementContainer>
          );
        })}
      </CandidateEndorsementsContainer>
    );
  }
}
PositionRowList.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const CandidateEndorsementsContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
`;

const CandidateEndorsementContainer = styled('div')`
  min-width: 50px;
  width: 50px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    display: none;
  }
`;

export default withStyles(styles)(PositionRowList);

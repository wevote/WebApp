import { Avatar } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { limitToShowInfoOnly, limitToShowOppose, limitToShowSupport, orderByTwitterFollowers, orderByWrittenComment } from '../../common/utils/orderByPositionFunctions';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import LazyImage from '../../common/components/LazyImage';
import { avatarGeneric } from '../../utils/applicationUtils';
import speakerDisplayNameToInitials from '../../common/utils/speakerDisplayNameToInitials';


const STARTING_NUMBER_OF_IMAGES_TO_DISPLAY = 10;
const STARTING_NUMBER_OF_NAMES_TO_DISPLAY = 2;

class PositionRowListCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredPositionList: [],
      filteredPositionListLength: 0,
      numberOfImagesToDisplay: STARTING_NUMBER_OF_IMAGES_TO_DISPLAY,
      numberOfNamesToDisplay: STARTING_NUMBER_OF_NAMES_TO_DISPLAY,
      supportPositionListLength: 0,
    };
  }

  componentDidMount () {
    // console.log('PositionRowListCompressed componentDidMount');

    // let { incomingPositionList } = this.props;
    const { ballotItemWeVoteId, firstInstance } = this.props;
    // console.log('PositionRowListCompressed componentDidMount, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
    this.ballotStoreListener = BallotStore.addListener(this.onCandidateStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const callApis = firstInstance || firstInstance === undefined;

    if (callApis) {    // Avoid 200 or more apiCalming calls
      if (apiCalming('organizationsFollowedRetrieve', 60000)) {
        OrganizationActions.organizationsFollowedRetrieve();
      }
    }
    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    if (!organizationsVoterIsFriendsWith.length > 0 && callApis) {
      if (apiCalming('friendListsAll', 30000)) {
        FriendActions.friendListsAll();
      }
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.candidateStoreListener.remove();
    this.friendStoreListener.remove();
    this.measureStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onBallotStoreChange () {
    // console.log('PositionRowListCompressed onBallotStoreChange');
    this.onCachedPositionsChange();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowListCompressed onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onCachedPositionsChange () {
    const { ballotItemWeVoteId } = this.props;
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onFriendStoreChange () {
    // console.log('PositionRowListCompressed onOrganizationStoreChange');
    this.onCachedPositionsChange();
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowListCompressed onMeasureStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      this.onPositionListUpdate(allCachedPositionsForThisBallotItem);
    }
  }

  onOrganizationStoreChange () {
    // console.log('PositionRowListCompressed onOrganizationStoreChange');
    this.onCachedPositionsChange();
  }

  onVoterGuideStoreChange () {
    // console.log('PositionRowListCompressed onVoterGuideStoreChange');
    this.onCachedPositionsChange();
  }

  onClickShowOrganizationModalWithPositions () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('onClickShowOrganizationModalWithPositions, ballotItemWeVoteId:', ballotItemWeVoteId);
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
  }

  onPositionListUpdate = (allCachedPositionsForThisBallotItem) => {
    const { showInfoOnly, showOppose, showOpposeDisplayNameIfNoSupport, showSupport } = this.props;
    const organizationsVoterIsFollowing = OrganizationStore.getOrganizationsVoterIsFollowing();
    // eslint-disable-next-line arrow-body-style
    let filteredPositionList = allCachedPositionsForThisBallotItem.map((position) => {
      // console.log('PositionRowListCompressed onOrganizationStoreChange, position: ', position);
      return ({
        ...position,
        followed: organizationsVoterIsFollowing.filter((org) => org.organization_we_vote_id === position.speaker_we_vote_id).length > 0,
      });
    });

    const organizationsVoterIsFriendsWith = FriendStore.currentFriendsOrganizationWeVoteIDList();
    // console.log('PositionRowListCompressed onFriendStoreChange, organizationsVoterIsFriendsWith:', organizationsVoterIsFriendsWith);
    // eslint-disable-next-line arrow-body-style
    filteredPositionList = filteredPositionList.map((position) => {
      // console.log('PositionRowListCompressed componentDidMount, position: ', position);
      return ({
        ...position,
        currentFriend: organizationsVoterIsFriendsWith.filter((organizationWeVoteId) => organizationWeVoteId === position.speaker_we_vote_id).length > 0,
      });
    });

    // eslint-disable-next-line arrow-body-style
    filteredPositionList = filteredPositionList.map((position) => {
      // console.log('PositionRowListCompressed componentDidMount, position: ', position);
      return ({
        ...position,
        linkedToIssueVoterIsFollowing: IssueStore.isOrganizationLinkedToIssueVoterIsFollowing(position.speaker_we_vote_id),
      });
    });

    if (showOpposeDisplayNameIfNoSupport) {
      let supportPositionList = JSON.parse(JSON.stringify(filteredPositionList));
      supportPositionList = limitToShowSupport(supportPositionList);
      this.setState({
        supportPositionListLength: supportPositionList.length,
      });
    }

    if (showInfoOnly) {
      filteredPositionList = limitToShowInfoOnly(filteredPositionList);
    } else if (showOppose) {
      filteredPositionList = limitToShowOppose(filteredPositionList);
    } else if (showSupport) {
      filteredPositionList = limitToShowSupport(filteredPositionList);
    }
    filteredPositionList = filteredPositionList.sort(orderByTwitterFollowers);
    filteredPositionList = filteredPositionList.sort(orderByWrittenComment);
    filteredPositionList = filteredPositionList.sort(this.orderByIssuesFollowedFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByFollowedOrgsFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByCurrentFriendsFirst);
    filteredPositionList = filteredPositionList.sort(this.orderByCurrentVoterFirst); // Always put current voter at top

    // console.log('PositionRowListCompressed onPositionListUpdate, filteredPositionList:', filteredPositionList);
    this.setState({
      filteredPositionList,
      filteredPositionListLength: filteredPositionList.length,
    });
  }

  orderByCurrentFriendsFirst = (firstGuide, secondGuide) => {
    const secondGuideIsFromFriend = secondGuide && secondGuide.currentFriend === true ? 1 : 0;
    const firstGuideIsFromFriend = firstGuide && firstGuide.currentFriend === true ? 1 : 0;
    return secondGuideIsFromFriend - firstGuideIsFromFriend;
  };

  orderByCurrentVoterFirst = (firstGuide, secondGuide) => {
    const currentVoterOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    const secondGuideIsFromCurrentVoter = secondGuide && secondGuide.speaker_we_vote_id === currentVoterOrganizationWeVoteId ? 1 : 0;
    const firstGuideIsFromCurrentVoter = firstGuide && firstGuide.speaker_we_vote_id === currentVoterOrganizationWeVoteId ? 1 : 0;
    return secondGuideIsFromCurrentVoter - firstGuideIsFromCurrentVoter;
  };

  orderByFollowedOrgsFirst = (firstGuide, secondGuide) => secondGuide.followed - firstGuide.followed;

  orderByIssuesFollowedFirst = (firstGuide, secondGuide) => {
    const secondGuideIsLinkedToIssueVoterIsFollowing = secondGuide && secondGuide.linkedToIssueVoterIsFollowing === true ? 1 : 0;
    const firstGuideIsLinkedToIssueVoterIsFollowing = firstGuide && firstGuide.linkedToIssueVoterIsFollowing === true ? 1 : 0;
    return secondGuideIsLinkedToIssueVoterIsFollowing - firstGuideIsLinkedToIssueVoterIsFollowing;
  };

  render () {
    // const {
    //   ballotItemWeVoteId, showInfoOnly, showOppose, showOpposeDisplayName,
    //   showOpposeDisplayNameIfNoSupport, showSupport,
    // } = this.props;
    const {
      filteredPositionList, filteredPositionListLength, numberOfImagesToDisplay, numberOfNamesToDisplay,
      // supportPositionListLength,
    } = this.state;
    renderLog('PositionRowListCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    if (!filteredPositionList) {
      // console.log('PositionRowListCompressed Loading...');
      return LoadingWheel;
    }
    // console.log('TRYING TO RENDER, filteredPositionListLength: ', filteredPositionListLength);
    let candidateName = '';
    let numberOfImagesDisplayed = 0;
    let numberOfNamesDisplayed = 0;
    let speakerDisplayNameInitials = '';
    let styleWithBackgroundColor = {};
    let talkingAboutText = '';
    let isFirstPosition = true;
    if (filteredPositionList.length > 0) {
      filteredPositionList.forEach((onePosition) => {
        candidateName = onePosition.ballot_item_display_name; // Same for all positions
        if (numberOfNamesDisplayed < numberOfNamesToDisplay) {
          if (!isFirstPosition) {
            if ((numberOfNamesDisplayed + 1) === filteredPositionList.length) {
              talkingAboutText += ' and ';
            } else {
              talkingAboutText += ', ';
            }
          }
          talkingAboutText += onePosition.speaker_display_name;
          isFirstPosition = false;
          numberOfNamesDisplayed += 1;
        }
      });
      if (numberOfNamesDisplayed < filteredPositionList.length) {
        talkingAboutText += ` and ${filteredPositionListLength - numberOfNamesDisplayed} others`;
      }
      if (candidateName) {
        talkingAboutText += ` are talking about ${candidateName}`;
      }
    }
    return (
      <CandidateEndorsementsWrapper>
        <CandidateEndorsementsContainer>
          <CandidateEndorsementPhotos onClick={() => this.onClickShowOrganizationModalWithPositions()}>
            {filteredPositionList.map((onePosition) => {
              // console.log('numberOfPositionItemsDisplayed:', numberOfPositionItemsDisplayed, ', numberOfImagesToDisplay:', numberOfImagesToDisplay);
              // console.log('onePosition:', onePosition);
              if (numberOfImagesDisplayed >= numberOfImagesToDisplay) {
                return null;
              }
              numberOfImagesDisplayed += 1;
              ({ sx: styleWithBackgroundColor, children: speakerDisplayNameInitials } = speakerDisplayNameToInitials(onePosition.speaker_display_name));
              // console.log('speakerDisplayNameInitials:', speakerDisplayNameInitials, ', sx:', sx, ', speakerDisplayNameColor:', speakerDisplayNameColor);
              return (
                <CandidateEndorsementContainer
                  key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}
                >
                  {onePosition.speaker_image_url_https_medium ? (
                    <LazyImage
                      src={onePosition.speaker_image_url_https_medium}
                      placeholder={avatarGeneric()}
                      className="profile-photo"
                      height={42}
                      width={42}
                      alt=""
                    />
                  ) : (
                    <Avatar sx={styleWithBackgroundColor}>
                      {speakerDisplayNameInitials}
                    </Avatar>
                  )}
                </CandidateEndorsementContainer>
              );
            })}
          </CandidateEndorsementPhotos>
          <CandidateEndorsementText onClick={() => this.onClickShowOrganizationModalWithPositions()}>
            {talkingAboutText}
            {!!(talkingAboutText) && <>&hellip;</>}
          </CandidateEndorsementText>
        </CandidateEndorsementsContainer>
      </CandidateEndorsementsWrapper>
    );
  }
}
PositionRowListCompressed.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  showInfoOnly: PropTypes.bool,
  showOppose: PropTypes.bool,
  showOpposeDisplayNameIfNoSupport: PropTypes.bool,
  showSupport: PropTypes.bool,
  firstInstance: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});
const CandidateEndorsementsContainer = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-flow: column;
`;

const CandidateEndorsementContainer = styled('div')(({ theme }) => (`
  min-width: 42px;
  ${theme.breakpoints.down('xs')} {
    display: none;
  }
`));

const CandidateEndorsementPhotos = styled('div')`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  margin-right: 0;
`;

const CandidateEndorsementText = styled('div')`
  cursor: pointer;
  overflow-wrap: break-word;
`;

const CandidateEndorsementsWrapper = styled('div')`
  height: 100%;
  max-width: 400px;
  white-space: wrap;
`;

export default withTheme(withStyles(styles)(PositionRowListCompressed));

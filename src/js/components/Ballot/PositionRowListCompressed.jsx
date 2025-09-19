import { Avatar } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import LazyImage from '../../common/components/LazyImage';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import AppObservableStore from '../../common/stores/AppObservableStore';
import apiCalming from '../../common/utils/apiCalming';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import { limitToShowInfoOnly, limitToShowOppose, limitToShowSupport, orderByTwitterFollowers, orderByWrittenComment } from '../../common/utils/orderByPositionFunctions';
import speakerDisplayNameToInitials from '../../common/utils/speakerDisplayNameToInitials';
import BallotStore from '../../stores/BallotStore';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import MeasureStore from '../../stores/MeasureStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';


const STARTING_NUMBER_OF_IMAGES_TO_DISPLAY = 10;
const STARTING_NUMBER_OF_NAMES_TO_DISPLAY = 2;

class PositionRowListCompressed extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredPositionList: [],
      // filteredPositionListLength: 0,
      numberOfImagesToDisplay: STARTING_NUMBER_OF_IMAGES_TO_DISPLAY,
      numberOfNamesToDisplay: STARTING_NUMBER_OF_NAMES_TO_DISPLAY,
      // supportPositionListLength: 0,
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

  handleTalkingAboutClick = (buttonId = '') => {
    const { location: { pathname: currentPathname } } = window;
    const currentPage = lookupPageNameAndPageTypeDict(currentPathname);
    const { ballotItemWeVoteId } = this.props;

    const dataLayerObject = {
      actionDetails: {
        actionType: 'openModal',
        buttonId,
      },
      event: 'action',
      destinationDetails: {
        destinationPageName: currentPage.pageName,
        destinationPageType: 'CandidateEndorsementModal',
        destinationPathname: currentPathname,
      },
      endorsementDetails: {
        endorsementCount: this.getEndorsementCount(),
        interactionType: 'click_talking_about',
        organizationCount: this.getOrganizationCount(),
        talkingAboutText: this.getTalkingAboutText(),
      },
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    // Add candidate or measure details based on ballotItemWeVoteId
    if (ballotItemWeVoteId.includes('cand')) {
      dataLayerObject.candidateDetails = CandidateStore.getAnalyticsCandidateDetails(ballotItemWeVoteId);
      // console.log('Final candidateDetails for analytics:', dataLayerObject.candidateDetails);
    } else if (ballotItemWeVoteId.includes('meas')) {
      dataLayerObject.measureDetails = {
        measureWeVoteId: ballotItemWeVoteId,
        measureName: MeasureStore.getMeasureName(ballotItemWeVoteId),
        // stateCode: // Add if available
      };
      // console.log('Final measureDetails for analytics:', dataLayerObject.measureDetails);
    }
    // console.log('Complete dataLayerObject being sent to analytics:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    // console.log('Talking about click tracked');
  };

  onClickShowOrganizationModalWithBallotItemInfoAndPositions (buttonId = '') {
    this.handleTalkingAboutClick(buttonId);
    const { ballotItemWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
  }

  onClickShowOrganizationModalWithPositions (buttonId = '') {
    this.handleTalkingAboutClick(buttonId);
    const { ballotItemWeVoteId } = this.props;
    // console.log(ballotItemWeVoteId)
    // console.log('onClickShowOrganizationModalWithPositions, ballotItemWeVoteId:', ballotItemWeVoteId);
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(true);
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

  getTalkingAboutText = () => {
    const { ballotItemWeVoteId, showOppose, showSupport } = this.props;
    let itemName = '';

    if (ballotItemWeVoteId.includes('cand')) {
      const candidate = CandidateStore.getCandidateByWeVoteId(ballotItemWeVoteId);
      itemName = candidate ? candidate.ballot_item_display_name : '';
    } else if (ballotItemWeVoteId.includes('meas')) {
      itemName = MeasureStore.getMeasureName(ballotItemWeVoteId);
    }

    const endorsementCount = this.getEndorsementCount();
    if (showOppose) {
      if (endorsementCount === 1) return `opposes ${itemName}`;
      return `oppose ${itemName}`;
    } else if (showSupport) {
      if (endorsementCount === 1) return `supports ${itemName}`;
      return `support ${itemName}`;
    } else {
      if (endorsementCount === 1) return `is talking about ${itemName}`;
      return `are talking about ${itemName}`;
    }
  };

  getOrganizationCount = () => {
    const { ballotItemWeVoteId } = this.props;
    // Get all positions for this ballot item
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    }
    // console.log('getOrganizationCount, allCachedPositionsForThisBallotItem.length:', allCachedPositionsForThisBallotItem.length);
    if (!allCachedPositionsForThisBallotItem) return 0;
    // Get friend organization IDs
    const friendOrgIds = FriendStore.currentFriendsOrganizationWeVoteIDList();
    if (!friendOrgIds || friendOrgIds.length === 0) return 0;
    // Filter positions to only include friend organizations
    const friendPositions = allCachedPositionsForThisBallotItem.filter(
      (position) => friendOrgIds.includes(position.speaker_we_vote_id),
    );
    const uniqueOrgs = new Set(
      friendPositions.map((position) => position.speaker_we_vote_id),
    );
    return uniqueOrgs.size;
  };

  getEndorsementCount = () => {
    const { ballotItemWeVoteId } = this.props;
    // Get all positions for this ballot item
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    }
    if (!allCachedPositionsForThisBallotItem) return 0;
    // Get friend organization IDs
    const friendOrgIds = FriendStore.currentFriendsOrganizationWeVoteIDList();
    if (!friendOrgIds || friendOrgIds.length === 0) return 0;
    // Filter positions to only include friend organizations
    const friendPositions = allCachedPositionsForThisBallotItem.filter(
      (position) => friendOrgIds.includes(position.speaker_we_vote_id),
    );
    // console.log('getEndorsementCount, friendPositions.length:', friendPositions.length);
    return friendPositions.length;
  };

  onPositionListUpdate = (allCachedPositionsForThisBallotItem) => {
    const { showInfoOnly, showOppose, showSupport, checkCandidateHasEndorsements } = this.props;
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

    // if (showOpposeDisplayNameIfNoSupport) {
    //   let supportPositionList = JSON.parse(JSON.stringify(filteredPositionList));
    //   supportPositionList = limitToShowSupport(supportPositionList);
    // }

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
      // filteredPositionListLength: filteredPositionList.length,
    });

    if (filteredPositionList.length > 0) {
      checkCandidateHasEndorsements(true);
    }
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
    const {
      showOppose, showSupport,
    } = this.props;
    const {
      filteredPositionList, numberOfImagesToDisplay, numberOfNamesToDisplay,
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
        if ((onePosition.speaker_display_name && !onePosition.speaker_display_name.includes('Voter-')) &&
            (numberOfNamesDisplayed < numberOfNamesToDisplay)) {
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
      const remainingCount = filteredPositionList.length - numberOfNamesDisplayed;
      if (remainingCount > 0) {
        talkingAboutText += ` and ${remainingCount} ${remainingCount === 1 ? 'other' : 'others'}`;
      }
      talkingAboutText += ` ${this.getTalkingAboutText()}`;
    }
    let filteredPositionListTooltip = <></>;
    let onePositionNameCount = 1;
    const displayedSpeakerNames = new Set();
    if (filteredPositionList) {
      filteredPositionListTooltip = isMobileScreenSize() ? (<></>) : (
        <Tooltipstyle className="u-z-index-9020" id="filteredPositionListTooltip">
          <div>
            {filteredPositionList.length === 1 ? (
              <>
                See endorsement from
              </>
            ) : (
              <>
                See endorsements from
                {' '}
                {filteredPositionList.length}
                {' '}
                advocates, like:
              </>
            )}
            <br />
            {filteredPositionList.map((onePosition) => {
              if (onePosition.speaker_display_name && onePositionNameCount <= 15 && !displayedSpeakerNames.has(onePosition.speaker_display_name)) {
                onePositionNameCount += 1;
                displayedSpeakerNames.add(onePosition.speaker_display_name);
                return (
                  <OneOrganizationName
                    key={`PositionName-${onePosition.position_we_vote_id}-${onePositionNameCount}`}
                  >
                    {onePosition.speaker_display_name}
                    <br />
                  </OneOrganizationName>
                );
              } else {
                return null;
              }
            })}
          </div>
        </Tooltipstyle>
      );
    }
    const endorsementCount = filteredPositionList.length;
    const endorsementNetworkCount = 0; // TODO: Get this from the API
    return (
      <CandidateEndorsementsWrapper>
        <CandidateEndorsementsContainer data-modal-trigger>
          <CandidateEndorsementCount>
            {(endorsementCount > 0) && (
              <EndorsementCountDiv>
                {showOppose && (
                  <ShowOpposeSpan
                    id="candidateEndorsementCountOppose"
                    onClick={() => this.onClickShowOrganizationModalWithPositions('candidateEndorsementCountOppose')}
                  >
                    {endorsementCount}
                    {' '}
                    Oppose
                  </ShowOpposeSpan>
                )}
                {showSupport && (
                  <ShowSupportSpan
                    id="candidateEndorsementCountSupport"
                    onClick={() => this.onClickShowOrganizationModalWithPositions('candidateEndorsementCountSupport')}
                  >
                    {endorsementCount}
                    {' '}
                    Support
                  </ShowSupportSpan>
                )}
              </EndorsementCountDiv>
            )}
            {(endorsementNetworkCount > 0 && (showOppose || showSupport)) && (
              <EndorsementCountDiv
                id={`candidateEndorsementNetworkCount${showOppose && 'Oppose'}${showSupport && 'Support'}`}
                onClick={() => this.onClickShowOrganizationModalWithPositions(`candidateEndorsementNetworkCount${showOppose && 'Oppose'}${showSupport && 'Support'}`)}
              >
                {endorsementCount}
                {' '}
                You Know
              </EndorsementCountDiv>
            )}
          </CandidateEndorsementCount>
          <CandidateEndorsementPhotos
            id={`candidateEndorsementPhotos${showOppose && 'Oppose'}${showSupport && 'Support'}`}
            onClick={() => this.onClickShowOrganizationModalWithPositions(`candidateEndorsementPhotos${showOppose && 'Oppose'}${showSupport && 'Support'}`)}
          >
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
                    <Avatar
                      sx={{
                        ...styleWithBackgroundColor,
                        border: '2px solid #FFFFFF',
                        borderRadius: '50%',
                        height: '36px',
                        objectFit: 'cover',
                        width: '36px',
                      }}
                    >
                      {speakerDisplayNameInitials}
                    </Avatar>
                  )}
                </CandidateEndorsementContainer>
              );
            })}
          </CandidateEndorsementPhotos>
          <OverlayTrigger overlay={filteredPositionListTooltip} placement="top" delay={{ show: 750 }}>
            <CandidateEndorsementText
              className="u-link-underline-on-hover"
              id={`candidateEndorsementText${showOppose && 'Oppose'}${showSupport && 'Support'}`}
              onClick={() => {
                if (filteredPositionList && filteredPositionList.length === 0) {
                  this.onClickShowOrganizationModalWithBallotItemInfoAndPositions(`candidateEndorsementText${showOppose && 'Oppose'}${showSupport && 'Support'}`);
                } else {
                  this.onClickShowOrganizationModalWithPositions(`candidateEndorsementText${showOppose && 'Oppose'}${showSupport && 'Support'}`);
                }
              }}
            >
              {talkingAboutText}
              {!!(talkingAboutText) && <>&hellip;</>}
            </CandidateEndorsementText>
          </OverlayTrigger>
        </CandidateEndorsementsContainer>
      </CandidateEndorsementsWrapper>
    );
  }
}

PositionRowListCompressed.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  firstInstance: PropTypes.bool,
  showInfoOnly: PropTypes.bool,
  showOppose: PropTypes.bool,
  showSupport: PropTypes.bool,
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
  width: 100%;
`;

const CandidateEndorsementContainer = styled('div')(({ theme }) => (`
  min-width: 36px;
  border-radius: 50%;
  margin-right: -12px;
  position: relative;

  ${theme.breakpoints.down('xs')} {
    display: none;
  }

  img{
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    height: 36px;
    object-fit: cover;
    width: 36px;
  }
`));

const CandidateEndorsementCount = styled('div')`
  align-items: center;
  cursor: pointer;
  display: flex;
  width: 100%;
`;

const CandidateEndorsementPhotos = styled('div')`
  align-items: center;
  cursor: pointer;
  display: flex;
  width: 100%;
`;

const CandidateEndorsementText = styled('div')`
  color: #1073d4;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  height: 54px;
  letter-spacing: 0.5%;
  line-height: 17.92px;
  margin-top: 12px;
  overflow-wrap: break-word;
  // text-decoration: underline;
  width: 100%;
`;

const CandidateEndorsementsWrapper = styled('div')`
  height: 102px;
  max-width: 100%;
  white-space: wrap;
  width: 275px;
`;

const EndorsementCountDiv = styled('div')`
  margin-bottom: 8px;
  margin-right: 24px;
`;

const OneOrganizationName = styled('span')`
`;

const ShowOpposeSpan = styled('span')`
  color: ${DesignTokenColors.alert400};
  font-weight: 500;
`;

const ShowSupportSpan = styled('span')`
  color: ${DesignTokenColors.confirmation400};
  font-weight: 500;
`;

const Tooltipstyle = styled(Tooltip)`
  .tooltip-inner {
    max-width: 475px;
  }
`;

export default withTheme(withStyles(styles)(PositionRowListCompressed));

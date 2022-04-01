import { Twitter } from '@mui/icons-material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { timeFromDate } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import numberWithCommas from '../../common/utils/numberWithCommas';
import ActivityStore from '../../stores/ActivityStore';
import VoterStore from '../../stores/VoterStore';
import { createDescriptionOfFriendPosts } from '../../utils/activityUtils';
import StickyPopover from '../Ballot/StickyPopover';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import FriendsOnlyIndicator from '../Widgets/FriendsOnlyIndicator';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const avatarGenericIcon = '../../../img/global/svg-icons/avatar-generic.svg';

class ActivitySpeakerCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      actionDescription: null,
      activityTimeFromDate: '',
      isActivityNoticeSeed: false,
      isActivityPost: false,
      speakerName: '',
      speakerOrganizationWeVoteId: '',
      speakerProfileImageUrlMedium: '',
      speakerTwitterHandle: '',
      speakerTwitterFollowersCount: 0,
      speakerIsVoter: false,
    };
  }

  componentDidMount () {
    this.onActivityStoreChange();
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitByWeVoteId(activityTidbitWeVoteId);
    const {
      date_created: dateOfNotice,
      kind_of_activity: kindOfActivity,
      position_name_list: positionNameList,
      speaker_name: speakerName,
      speaker_organization_we_vote_id: speakerOrganizationWeVoteId,
      speaker_profile_image_url_medium: speakerProfileImageUrlMedium,
      speaker_twitter_handle: speakerTwitterHandle,
      speaker_twitter_followers_count: speakerTwitterFollowersCount,
      speaker_voter_we_vote_id: speakerVoterWeVoteId,
      visibility_is_public: visibilityIsPublic,
    } = activityTidbit;
    const voter = VoterStore.getVoter();
    const speakerIsVoter = (voter.we_vote_id === speakerVoterWeVoteId);
    let isActivityNoticeSeed = false;
    let isActivityPost = false;
    if (kindOfActivity === 'ACTIVITY_NOTICE_SEED') {
      isActivityNoticeSeed = true;
    } else if (kindOfActivity === 'ACTIVITY_POST') {
      isActivityPost = true;
    }
    const activityTimeFromDate = timeFromDate(dateOfNotice);
    const actionDescription = createDescriptionOfFriendPosts(positionNameList);
    // const actionDescription = <span>added a new opinion.</span>;
    this.setState({
      actionDescription,
      activityTimeFromDate,
      isActivityNoticeSeed,
      isActivityPost,
      speakerName,
      speakerOrganizationWeVoteId,
      speakerProfileImageUrlMedium,
      speakerTwitterHandle,
      speakerTwitterFollowersCount,
      speakerIsVoter,
      visibilityIsPublic,
    });
  }

  render () {
    renderLog('ActivitySpeakerCard');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, showTwitterInformation } = this.props;
    const {
      actionDescription, activityTimeFromDate,
      isActivityNoticeSeed, isActivityPost, speakerIsVoter,
      speakerName, speakerOrganizationWeVoteId,
      speakerProfileImageUrlMedium, speakerTwitterFollowersCount, speakerTwitterHandle,
      visibilityIsPublic,
    } = this.state;
    if (!speakerName && !speakerIsVoter) {
      return <div>{LoadingWheel}</div>;
    }
    const organizationPopoverCard = (<OrganizationPopoverCard organizationWeVoteId={speakerOrganizationWeVoteId} />);

    // const voterGuideLink = speakerTwitterHandle ? `/${speakerTwitterHandle}` : `/voterguide/${speakerOrganizationWeVoteId}`;

    return (
      <Wrapper>
        <StickyPopover
          delay={{ show: 700, hide: 100 }}
          popoverComponent={organizationPopoverCard}
          placement="auto"
          id={`speakerAvatarOrganizationPopover-${activityTidbitWeVoteId}`}
        >
          {(speakerProfileImageUrlMedium) ? (
            <SpeakerAvatar>
              <ActivityImage src={speakerProfileImageUrlMedium} alt={`${speakerName}`} />
            </SpeakerAvatar>
          ) : (
            <SpeakerAvatar>
              <ActivityImage src={normalizedImagePath(avatarGenericIcon)} alt={`${speakerName}`} />
            </SpeakerAvatar>
          )}
        </StickyPopover>
        <SpeakerActionTimeWrapper>
          <SpeakerAndActionWrapper>
            <StickyPopover
              delay={{ show: 700, hide: 100 }}
              popoverComponent={organizationPopoverCard}
              placement="auto"
              id={`speakerNameOrganizationPopover-${activityTidbitWeVoteId}`}
            >
              <SpeakerNameWrapper>
                {speakerIsVoter ? 'You' : speakerName}
              </SpeakerNameWrapper>
            </StickyPopover>
            {(actionDescription && isActivityNoticeSeed) && (
              <ActionDescriptionWrapper>
                <Suspense fallback={<></>}>
                  <ReadMore
                    textToDisplay={`${actionDescription}.`}
                    numberOfLines={5}
                  />
                </Suspense>
              </ActionDescriptionWrapper>
            )}
          </SpeakerAndActionWrapper>
          <SecondLineWrapper>
            <TimeAndFriendsOnlyWrapper>
              {(activityTimeFromDate) && (
                <ActivityTime>
                  {activityTimeFromDate}
                </ActivityTime>
              )}
              {(isActivityPost) && (
                <FriendsOnlyIndicator isFriendsOnly={!visibilityIsPublic} />
              )}
            </TimeAndFriendsOnlyWrapper>
            {(speakerTwitterHandle && showTwitterInformation) && (
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="speakerTwitterHandle"
                  url={`https://twitter.com/${speakerTwitterHandle}`}
                  target="_blank"
                  body={(
                    <TwitterName>
                      <TwitterHandleWrapper>
                        @
                        {speakerTwitterHandle}
                      </TwitterHandleWrapper>
                      { !!(speakerTwitterFollowersCount && String(speakerTwitterFollowersCount) !== '0') && (
                        <span className="twitter-followers__badge">
                          <Twitter />
                          {numberWithCommas(speakerTwitterFollowersCount)}
                        </span>
                      )}
                    </TwitterName>
                  )}
                />
              </Suspense>
            )}
          </SecondLineWrapper>
        </SpeakerActionTimeWrapper>
      </Wrapper>
    );
  }
}
ActivitySpeakerCard.propTypes = {
  activityTidbitWeVoteId: PropTypes.string.isRequired,
  showTwitterInformation: PropTypes.bool,
};

const ActionDescriptionWrapper = styled('div')`
  font-size: 14px;
  margin-left: 3px;
  margin-top: 4px;
  padding: 0 !important;
`;

const ActivityImage = styled('img')`
  border-radius: 25px;
  width: 50px;
`;

const ActivityTime = styled('div')`
  color: #999;
  font-size: 11px;
  font-weight: 400;
  margin-right: 6px;
`;

const SpeakerAvatar = styled('div')`
  background: transparent;
  display: flex;
  justify-content: center;
  min-width: 50px;
  position: relative;
`;

const SecondLineWrapper = styled('div')`
`;

const SpeakerActionTimeWrapper = styled('div')`
  margin-left: 6px;
`;

const SpeakerAndActionWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: start;
`;

const SpeakerNameWrapper = styled('div')`
  font-size: 18px;
  font-weight: 700;
  padding: 0 !important;
  margin-right: 3px;
`;

const TimeAndFriendsOnlyWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
`;

const TwitterHandleWrapper = styled('span')`
  margin-right: 10px;
`;

const TwitterName = styled('span')`
`;

const Wrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
  padding: 0 !important;
`;

export default ActivitySpeakerCard;

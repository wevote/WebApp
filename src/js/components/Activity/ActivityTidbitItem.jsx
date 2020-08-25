import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { MoreHoriz } from '@material-ui/icons';
import ActivityPositionList from './ActivityPositionList';
import ActivityPostModal from './ActivityPostModal';
import ActivitySpeakerCard from './ActivitySpeakerCard';
import ActivityStore from '../../stores/ActivityStore';
import DelayedLoad from '../Widgets/DelayedLoad';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


class ActivityTidbitItem extends Component {
  static propTypes = {
    activityTidbitKey: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      activityPostId: 0,
      isActivityPost: false,
      showActivityPostModal: false,
      speakerIsVoter: false,
      speakerOrganizationWeVoteId: '',
      statementText: '',
    };
  }

  componentDidMount () {
    this.onActivityStoreChange();
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitKey } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitByKey(activityTidbitKey);
    let {
      activity_post_id: activityPostId,
    } = activityTidbit;
    activityPostId = parseInt(activityPostId, 10);
    const {
      kind_of_activity: kindOfActivity,
      position_we_vote_id_list: positionWeVoteIdList,
      speaker_organization_we_vote_id: speakerOrganizationWeVoteId,
      speaker_voter_we_vote_id: speakerVoterWeVoteId,
      statement_text: statementText,
    } = activityTidbit;
    // console.log('ActivityTidbitItem onActivityStoreChange, activityTidbitKey:', activityTidbitKey, ', statementText:', statementText);
    const voter = VoterStore.getVoter();
    const speakerIsVoter = (voter.we_vote_id === speakerVoterWeVoteId);
    let isActivityNoticeSeed = false;
    let isActivityPost = false;
    if (kindOfActivity === 'ACTIVITY_NOTICE_SEED') {
      isActivityNoticeSeed = true;
    } else if (kindOfActivity === 'ACTIVITY_POST') {
      isActivityPost = true;
    }
    if (isActivityNoticeSeed) {
      this.updatePositionsEnteredState(positionWeVoteIdList);
    }
    this.setState({
      activityPostId,
      isActivityPost,
      speakerIsVoter,
      speakerOrganizationWeVoteId,
      statementText,
    });
  }

  onOrganizationStoreChange () {
    const { activityTidbitKey } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitByKey(activityTidbitKey);
    const {
      position_we_vote_id_list: positionWeVoteIdList,
    } = activityTidbit;
    this.updatePositionsEnteredState(positionWeVoteIdList);
  }

  updatePositionsEnteredState = (positionWeVoteIdList) => {
    const newPositionsEntered = [];
    let onePosition = {};
    let positionWeVoteId = '';
    // console.log('positionWeVoteIdList:', positionWeVoteIdList);
    for (let count = 0; count < positionWeVoteIdList.length; count++) {
      positionWeVoteId = positionWeVoteIdList[count];
      if (positionWeVoteId) {
        onePosition = OrganizationStore.getPositionByPositionWeVoteId(positionWeVoteId);
        // console.log('onePosition:', onePosition);
        if (onePosition && onePosition.position_we_vote_id) {
          newPositionsEntered.push(onePosition);
        }
      }
    }
    // console.log('newPositionsEntered:', newPositionsEntered);
    this.setState({
      newPositionsEntered,
    });
  }

  toggleActivityPostModal = () => {
    const { showActivityPostModal } = this.state;
    // console.log('toggleActivityPostModal showActivityPostModal:', showActivityPostModal);
    this.setState({
      showActivityPostModal: !showActivityPostModal,
    });
  }

  render () {
    renderLog('ActivityTidbitItem');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitKey } = this.props;
    const {
      activityPostId, externalUniqueId, isActivityPost, newPositionsEntered,
      showActivityPostModal, speakerIsVoter, speakerOrganizationWeVoteId, statementText,
    } = this.state;
    if (!activityTidbitKey) {
      return null;
    }
    return (
      <Wrapper>
        <ActivitySpeakerCardWrapper>
          <ActivitySpeakerCard
            activityTidbitKey={activityTidbitKey}
          />
          {(isActivityPost && speakerIsVoter) && (
            <ActivityPostEditWrapper
              id={`activityTidbitItemEdit-${activityTidbitKey}`}
              onClick={this.toggleActivityPostModal}
            >
              <MoreHoriz />
            </ActivityPostEditWrapper>
          )}
        </ActivitySpeakerCardWrapper>
        {(newPositionsEntered && newPositionsEntered.length) ? (
          <DelayedLoad showLoadingText waitBeforeShow={500}>
            <ActivityPositionListWrapper>
              <ActivityPositionList
                incomingPositionList={newPositionsEntered}
                organizationWeVoteId={speakerOrganizationWeVoteId}
                startingNumberOfPositionsToDisplay={1}
              />
            </ActivityPositionListWrapper>
          </DelayedLoad>
        ) : (
          <ActivityPositionListMissingWrapper />
        )}
        {isActivityPost && (
          <ActivityPostWrapper>
            {statementText}
          </ActivityPostWrapper>
        )}
        {showActivityPostModal && (
          <ActivityPostModal
            activityPostId={activityPostId}
            externalUniqueId={externalUniqueId}
            show={showActivityPostModal}
            toggleActivityPostModal={this.toggleActivityPostModal}
          />
        )}
      </Wrapper>
    );
  }
}

const styles = () => ({
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const ActivityPositionListWrapper = styled.div`
  margin-top: 12px;
`;

const ActivityPositionListMissingWrapper = styled.div`
  margin-bottom: 8px;
`;

const ActivityPostEditWrapper = styled.div`
`;

const ActivityPostWrapper = styled.div`
  font-size: 18px;
`;

const ActivitySpeakerCardWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Wrapper = styled.div`
`;

export default withTheme(withStyles(styles)(ActivityTidbitItem));

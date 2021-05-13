import { withStyles, withTheme } from '@material-ui/core/styles';
import { MoreHoriz } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import ActivityStore from '../../stores/ActivityStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import ActivityPositionList from './ActivityPositionList';
import ActivitySpeakerCard from './ActivitySpeakerCard';

const ActivityPostModal = React.lazy(() => import(/* webpackChunkName: 'ActivityPostModal' */ './ActivityPostModal'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../Widgets/DelayedLoad'));


class ActivityTidbitItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
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
    const { activityTidbitWeVoteId } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitByWeVoteId(activityTidbitWeVoteId);
    const {
      kind_of_activity: kindOfActivity,
      position_we_vote_id_list: positionWeVoteIdList,
      speaker_name: speakerName,
      speaker_organization_we_vote_id: speakerOrganizationWeVoteId,
      speaker_voter_we_vote_id: speakerVoterWeVoteId,
      statement_text: statementText,
    } = activityTidbit;
    // console.log('ActivityTidbitItem onActivityStoreChange, activityTidbitWeVoteId:', activityTidbitWeVoteId, ', statementText:', statementText);
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
      isActivityPost,
      speakerIsVoter,
      speakerName,
      speakerOrganizationWeVoteId,
      statementText,
    });
  }

  onOrganizationStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitByWeVoteId(activityTidbitWeVoteId);
    const {
      position_we_vote_id_list: positionWeVoteIdList,
    } = activityTidbit;
    this.updatePositionsEnteredState(positionWeVoteIdList);
  }

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    AppActions.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppActions.setShowActivityTidbitDrawer(true);
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
    const { activityTidbitWeVoteId, startingNumberOfPositionsToDisplay } = this.props;
    const {
      externalUniqueId, isActivityPost, newPositionsEntered,
      showActivityPostModal, speakerIsVoter, speakerName, speakerOrganizationWeVoteId, statementText,
    } = this.state;
    if (!activityTidbitWeVoteId) {
      return null;
    }
    const startingNumberOfPositionsToDisplayLocal = startingNumberOfPositionsToDisplay || 1;
    return (
      <Wrapper>
        <ActivitySpeakerCardWrapper>
          <ActivitySpeakerCard
            activityTidbitWeVoteId={activityTidbitWeVoteId}
          />
          {(isActivityPost && speakerIsVoter) && (
            <ActivityPostEditWrapper
              id={`activityTidbitItemEdit-${activityTidbitWeVoteId}`}
              onClick={this.toggleActivityPostModal}
            >
              <MoreHoriz />
            </ActivityPostEditWrapper>
          )}
        </ActivitySpeakerCardWrapper>
        {(!speakerName && speakerIsVoter) && (
          <MissingNameAlertWrapper>
            <Alert variant="danger">
              Please add your name so we can show this post.
              {' '}
              <Link className="u-link-color" id="addName" to="/settings/profile">
                add name
              </Link>
            </Alert>
          </MissingNameAlertWrapper>
        )}

        {(newPositionsEntered && newPositionsEntered.length) ? (
          <DelayedLoad showLoadingText waitBeforeShow={500}>
            <ActivityPositionListWrapper>
              <ActivityPositionList
                incomingPositionList={newPositionsEntered}
                organizationWeVoteId={speakerOrganizationWeVoteId}
                startingNumberOfPositionsToDisplay={startingNumberOfPositionsToDisplayLocal}
              />
            </ActivityPositionListWrapper>
          </DelayedLoad>
        ) : (
          <ActivityPositionListMissingWrapper />
        )}
        {isActivityPost && (
          <ActivityPostWrapper>
            {/* onClick={this.onClickShowActivityTidbitDrawer} */}
            {statementText}
          </ActivityPostWrapper>
        )}
        {showActivityPostModal && (
          <ActivityPostModal
            activityTidbitWeVoteId={activityTidbitWeVoteId}
            externalUniqueId={externalUniqueId}
            show={showActivityPostModal}
            toggleActivityPostModal={this.toggleActivityPostModal}
          />
        )}
      </Wrapper>
    );
  }
}
ActivityTidbitItem.propTypes = {
  activityTidbitWeVoteId: PropTypes.string.isRequired,
  startingNumberOfPositionsToDisplay: PropTypes.number,
};

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

const MissingNameAlertWrapper = styled.div`
  margin-top: 3px;
`;

const Wrapper = styled.div`
`;

export default withTheme(withStyles(styles)(ActivityTidbitItem));

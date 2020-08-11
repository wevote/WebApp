import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ActivityPositionList from './ActivityPositionList';
import ActivitySpeakerCard from './ActivitySpeakerCard';
import ActivityStore from '../../stores/ActivityStore';
import DelayedLoad from '../Widgets/DelayedLoad';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';


class ActivityTidbitItem extends Component {
  static propTypes = {
    activityTidbitId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      // speakerName: '',
      // speakerProfileImageUrlMedium: '',
      // speakerProfileImageUrlTiny: '',
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
    const { activityTidbitId } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitById(activityTidbitId);
    const {
      position_we_vote_id_list: positionWeVoteIdList,
      speaker_organization_we_vote_id: speakerOrganizationWeVoteId,
    } = activityTidbit;
    this.updatePositionsEnteredState(positionWeVoteIdList);
    this.setState({
      speakerOrganizationWeVoteId,
    });
  }

  onOrganizationStoreChange () {
    const { activityTidbitId } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitById(activityTidbitId);
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

  render () {
    renderLog('ActivityTidbitItem');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitId } = this.props;
    const { speakerOrganizationWeVoteId, newPositionsEntered } = this.state;
    if (!activityTidbitId) {
      return null;
    }

    return (
      <Wrapper>
        <ActivitySpeakerCard
          activityTidbitId={activityTidbitId}
        />
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

const Wrapper = styled.div`
`;

export default withTheme(withStyles(styles)(ActivityTidbitItem));

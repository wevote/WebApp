import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import MeasureActions from '../../actions/MeasureActions';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';
import toTitleCase from '../../common/utils/toTitleCase';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import MeasureStore from '../../stores/MeasureStore';
import SupportStore from '../../stores/SupportStore';
import { VoteAgainstMeasure, VoteForMeasure } from '../Style/BallotStyles';
import { stripHtmlFromString } from '../../common/utils/textFormat';

class BallotSharedMeasureItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      measureSubtitle: '',
      measureText: '',
      measureWeVoteId: '',
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      showPositionStatement: false,
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
    this.onClickShowOrganizationModalWithBallotItemInfoAndPositions = this.onClickShowOrganizationModalWithBallotItemInfoAndPositions.bind(this);
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    const { measureWeVoteId, organization } = this.props;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('componentDidMount, measureWeVoteId: ', measureWeVoteId);
    if (!measure.we_vote_id) {
      // If the measure isn't in the MeasureStore, retrieve it
      MeasureActions.measureRetrieve(measureWeVoteId);
    }
    if (measureWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }
    if (measureWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListFromFriendsHasBeenRetrievedOnce,
      });
    }
    const organizationWeVoteId = (organization && organization.organization_we_vote_id) ? organization.organization_we_vote_id : this.props.organizationWeVoteId;
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
      measureWeVoteId,
      organizationWeVoteId,
    });
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    // console.log('BallotSharedMeasureItem, onMeasureStoreChange, measureWeVoteId:', measureWeVoteId);
    if (measureWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('onMeasureStoreChange positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }
    if (measureWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      // console.log('componentDidMount positionListForBallotItemPublic', measureWeVoteId);
      MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListFromFriendsHasBeenRetrievedOnce,
      });
    }
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // measure,
      measureSubtitle: measure.measure_subtitle,
      measureText: stripHtmlFromString(measure.measure_text),
    });
  }

  onSupportStoreChange () {
  }

  onClickShowOrganizationModalWithBallotItemInfoAndPositions () {
    const { measureWeVoteId } = this.props;
    AppObservableStore.setOrganizationModalBallotItemWeVoteId(measureWeVoteId);
    AppObservableStore.setShowOrganizationModal(true);
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organizationWeVoteId) {
      // If there is an organizationWeVoteId, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organizationWeVoteId}`;
    } else {
      // If no organizationWeVoteId, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
    });
  }

  localPositionListHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('BallotSharedMeasureItem');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      isOpposeOrNegativeRating, isSupportOrPositiveRating, statementText,
    } = this.props;
    const {
      measureSubtitle, measureText, measureWeVoteId,
    } = this.state;
    if (!measureWeVoteId) {
      return null;
    }
    let { ballotItemDisplayName } = this.state;
    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);
    let ballotDisplay = [];
    if (ballotItemDisplayName) {
      ballotDisplay = ballotItemDisplayName.split(':');
    }
    const measureSubtitleCapitalized = toTitleCase(measureSubtitle);

    return (
      <BallotSharedMeasureItemWrapper>
        <BallotSharedMeasureTitle onClick={this.onClickShowOrganizationModalWithBallotItemInfoAndPositions}>
          {isSupportOrPositiveRating && (
            <VoteForMeasure>
              Vote Yes on
            </VoteForMeasure>
          )}
          {isOpposeOrNegativeRating && (
            <VoteAgainstMeasure>
              Vote No on
            </VoteAgainstMeasure>
          )}
          <div>
            {ballotDisplay[0]}
          </div>
        </BallotSharedMeasureTitle>
        <MeasureContainer>
          <MeasureWrapper>
            <InfoDetailsRow className="u-cursor--pointer" onClick={this.onClickShowOrganizationModalWithBallotItemInfoAndPositions}>
              <SubTitle>{measureSubtitleCapitalized}</SubTitle>
              <MeasureText>
                {shortenText(measureText, 200)}
                &nbsp;
                <span className="u-link-color">
                  more
                </span>
              </MeasureText>
            </InfoDetailsRow>
          </MeasureWrapper>
        </MeasureContainer>
        {(statementText) && (
          <PositionStatementText>
            &quot;
            {statementText}
            &quot;
          </PositionStatementText>
        )}
      </BallotSharedMeasureItemWrapper>
    );
  }
}
BallotSharedMeasureItem.propTypes = {
  isOpposeOrNegativeRating: PropTypes.bool,
  isSupportOrPositiveRating: PropTypes.bool,
  measureWeVoteId: PropTypes.string.isRequired,
  organization: PropTypes.object,
  organizationWeVoteId: PropTypes.string,
  statementText: PropTypes.string,
};

const styles = () => ({
});

const BallotSharedMeasureItemWrapper = styled('div')`
  align-items: center;
  display: flex;
  border: 1px solid #fff;
  flex-direction: column;
  margin-bottom: 60px;
  position: relative;
`;

const BallotSharedMeasureTitle = styled('h1')`
  color: #4371cc;
  cursor: pointer;
  font-weight: 400;
  font-size: 24px;
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
  white-space: nowrap;
  width: 100%;
`;

const InfoDetailsRow = styled('div')`
`;

const MeasureContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
`;

const MeasureWrapper = styled('div')`
  width: 320px;
`;

const MeasureText = styled('div')`
  color: #777;
  font-size: 13px;
  font-weight: 300;
  text-align: center;
  width: 100%;
`;

const PositionStatementText = styled('div')`
  text-align: center;
  width: 100%;
`;

const SubTitle = styled('h3')`
  font-size: 20px;
  margin-top: 9px;
  text-align: center;
`;

export default withTheme(withStyles(styles)(BallotSharedMeasureItem));

import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';
import CampaignCommentForList from './CampaignCommentForList';
import CandidateStore from '../../../stores/CandidateStore';
import arrayContains from '../../utils/arrayContains';

const STARTING_NUMBER_OF_COMMENTS_TO_DISPLAY = 10;
const NUMBER_OF_COMMENTS_TO_ADD_WHEN_MORE_CLICKED = 4;

class CampaignCommentsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfCommentsToDisplay: STARTING_NUMBER_OF_COMMENTS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    this.onCandidateStoreChange();
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { campaignXWeVoteId, startingNumberOfCommentsToDisplay } = this.props;
    // console.log('CampaignCommentsList componentDidMount campaignXWeVoteId:', campaignXWeVoteId, ', startingNumberOfCommentsToDisplay:', startingNumberOfCommentsToDisplay);
    if (startingNumberOfCommentsToDisplay && startingNumberOfCommentsToDisplay > 0) {
      this.setState({
        numberOfCommentsToDisplay: startingNumberOfCommentsToDisplay,
      });
    }
    this.updateLatestCampaignXSupportersWithTextList(campaignXWeVoteId);
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignCommentsList componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.updateLatestCampaignXSupportersWithTextList(campaignXWeVoteId);
      }
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { campaignXWeVoteId, politicianWeVoteId, removePoliticianEndorsements } = this.props;
    if (politicianWeVoteId && removePoliticianEndorsements) {
      const organizationWeVoteIdListFromPositions = [];
      const allCachedPositionsForThisPolitician = CandidateStore.getAllCachedPositionsByPoliticianWeVoteId(politicianWeVoteId);
      // console.log('allCachedPositionsForThisPolitician:', allCachedPositionsForThisPolitician);
      for (let i = 0; i < allCachedPositionsForThisPolitician.length; i += 1) {
        if (allCachedPositionsForThisPolitician[i].speaker_we_vote_id && !arrayContains(allCachedPositionsForThisPolitician[i].speaker_we_vote_id, organizationWeVoteIdListFromPositions)) {
          organizationWeVoteIdListFromPositions.push(allCachedPositionsForThisPolitician[i].speaker_we_vote_id);
        }
      }
      // console.log('onCandidateStoreChange organizationWeVoteIdListFromPositions:', organizationWeVoteIdListFromPositions);
      this.setState({
        organizationWeVoteIdListFromPositions,
      }, () => this.updateLatestCampaignXSupportersWithTextList(campaignXWeVoteId));
    }
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignCommentsList onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    this.updateLatestCampaignXSupportersWithTextList(campaignXWeVoteId);
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignCommentsList onCampaignStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    this.updateLatestCampaignXSupportersWithTextList(campaignXWeVoteId);
  }

  updateLatestCampaignXSupportersWithTextList = (campaignXWeVoteId) => {
    const { removePoliticianEndorsements } = this.props;
    const { organizationWeVoteIdListFromPositions } = this.state;
    // console.log('updateLatestCampaignXSupportersWithTextList organizationWeVoteIdListFromPositions:', organizationWeVoteIdListFromPositions);
    const campaignXSupportersWithTextUnsorted = CampaignSupporterStore.getLatestCampaignXSupportersWithTextList(campaignXWeVoteId);
    let campaignXSupportersWithoutEndorsements;
    if (removePoliticianEndorsements) {
      campaignXSupportersWithoutEndorsements = campaignXSupportersWithTextUnsorted.filter((supporter) => !arrayContains(supporter.organization_we_vote_id, organizationWeVoteIdListFromPositions));
    } else {
      campaignXSupportersWithoutEndorsements = campaignXSupportersWithTextUnsorted;
    }
    const campaignXSupportersWithText = campaignXSupportersWithoutEndorsements.sort(this.orderByCommentDate);
    // console.log('updateLatestCampaignXSupportersWithTextList campaignXSupportersWithText:', campaignXSupportersWithText);
    this.setState({
      campaignXSupportersWithText,
    });
  }

  increaseNumberOfCampaignsToDisplay = () => {
    let { numberOfCommentsToDisplay } = this.state;
    numberOfCommentsToDisplay += NUMBER_OF_COMMENTS_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberOfCommentsToDisplay,
    });
  }

  // When we have "likes" put comments with most likes at top
  orderByCommentDate = (firstCampaign, secondCampaign) => secondCampaign.id - firstCampaign.id;

  render () {
    renderLog('CampaignCommentsList');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignXWeVoteId, hideEncouragementToComment } = this.props;
    const { campaignXSupportersWithText, numberOfCommentsToDisplay } = this.state;
    // console.log('CampaignCommentsList render numberOfCommentsToDisplay:', numberOfCommentsToDisplay);

    if (!campaignXSupportersWithText || campaignXSupportersWithText.length === 0) {
      return (
        <Wrapper>
          {!hideEncouragementToComment && (
            <NoCommentsFound>
              Be the first to add a comment! Anyone who supports this campaign may share their reasons.
            </NoCommentsFound>
          )}
        </Wrapper>
      );
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        <div>
          {campaignXSupportersWithText.map((campaignXSupporter) => {
            // console.log('campaignXSupporter:', campaignXSupporter);
            if (numberOfCampaignsDisplayed >= numberOfCommentsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            return (
              <div key={`campaignXSupporterItem-${campaignXWeVoteId}-${campaignXSupporter.organization_we_vote_id}`}>
                <CampaignCommentForList
                  campaignXWeVoteId={campaignXWeVoteId}
                  campaignXSupporterId={campaignXSupporter.id}
                />
              </div>
            );
          })}
        </div>
        <LoadMoreItemsManuallyWrapper>
          {!!(campaignXSupportersWithText &&
              campaignXSupportersWithText.length > 1 &&
              numberOfCommentsToDisplay < campaignXSupportersWithText.length) &&
          (
            <LoadMoreItemsManually
              loadMoreFunction={this.increaseNumberOfCampaignsToDisplay}
              uniqueExternalId="CampaignCommentsList"
            />
          )}
        </LoadMoreItemsManuallyWrapper>
      </Wrapper>
    );
  }
}
CampaignCommentsList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  hideEncouragementToComment: PropTypes.bool,
  politicianWeVoteId: PropTypes.string,
  removePoliticianEndorsements: PropTypes.bool,
  startingNumberOfCommentsToDisplay: PropTypes.number,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const LoadMoreItemsManuallyWrapper = styled('div')`
  margin-bottom: 0;
  @media print{
    display: none;
  }
`;

const NoCommentsFound = styled('div')`
  border-top: 1px solid #ddd;
  margin-top: 25px;
  padding-top: 25px;
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(CampaignCommentsList);

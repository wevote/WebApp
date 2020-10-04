import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { CheckCircle, ThumbUp, ThumbDown } from '@material-ui/icons';
import { cordovaDot } from '../../utils/cordovaUtils';
import FollowToggle from './FollowToggle';
import FriendsIcon from './FriendsIcon';
import MaterialUIPopover from './MaterialUIPopover';
import PositionItemScorePopoverTextOnly from './PositionItemScorePopoverTextOnly';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import { cleanArray } from '../../utils/textFormat';

class PositionSummaryListForPopover extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // positionSummaryListLength: 0,
    };
  }

  componentDidMount () {
  }

  showAllPositions () {
    const { ballotItemWeVoteId } = this.props;
    if (this.props.showAllPositions) {
      this.props.showAllPositions(ballotItemWeVoteId);
    }
  }

  render () {
    const {
      ballotItemWeVoteId, classes, controlAdviserMaterialUIPopoverFromProp, openAdviserMaterialUIPopover, positionSummaryList,
      voterPersonalNetworkScore, voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive,
      voterPersonalNetworkScoreWithSign,
    } = this.props;

    let numberDisplayedSoFar = 0;
    let numberNotDisplayed = 0;
    let openAdviserMaterialUIPopoverNow = false;
    let controlAdviserMaterialUIPopoverFromPropNow = false;
    const renderedList = positionSummaryList.map((positionSummary) => {
      numberDisplayedSoFar += 1;
      // Only show the first 5
      if (numberDisplayedSoFar > 5) {
        numberNotDisplayed += 1;
        return null;
      }
      if ((numberDisplayedSoFar === 1)) {
        // console.log('controlAdviserMaterialUIPopoverFromProp:', controlAdviserMaterialUIPopoverFromProp);
        // console.log('openAdviserMaterialUIPopover:', openAdviserMaterialUIPopover);
        // console.log('numberDisplayedSoFar:', numberDisplayedSoFar);
        if (controlAdviserMaterialUIPopoverFromProp) {
          openAdviserMaterialUIPopoverNow = Boolean(openAdviserMaterialUIPopover);
          controlAdviserMaterialUIPopoverFromPropNow = true;
        }
      } else {
        openAdviserMaterialUIPopoverNow = false;
        controlAdviserMaterialUIPopoverFromPropNow = false;
      }
      // console.log('openAdviserMaterialUIPopoverNow:', openAdviserMaterialUIPopoverNow);
      // console.log('controlAdviserMaterialUIPopoverFromPropNow:', controlAdviserMaterialUIPopoverFromPropNow);
      let issuesInCommonForIconDisplayArray;
      if (positionSummary.issuesInCommonBetweenOrganizationAndVoter.length > 4) {
        issuesInCommonForIconDisplayArray = positionSummary.issuesInCommonBetweenOrganizationAndVoter.slice(0, 3);
      } else {
        issuesInCommonForIconDisplayArray = positionSummary.issuesInCommonBetweenOrganizationAndVoter;
      }
      return (
        <PositionSummaryWrapper
          key={`onePositionForPopover-${positionSummary.ballotItemWeVoteId}-${positionSummary.organizationWeVoteId}-${positionSummary.organizationName}`}
        >
          {positionSummary.organizationSupports && !positionSummary.organizationInVotersNetwork && (
            <SupportButNotPartOfScore>
              <ThumbUp classes={{ root: classes.endorsementIcon }} />
            </SupportButNotPartOfScore>
          )}
          {positionSummary.organizationSupports && positionSummary.organizationInVotersNetwork && (
            <SupportAndPartOfScore>
              <MaterialUIPopover
                popoverDisplayObject={(
                  <PositionItemScorePopoverTextOnly
                    positionItem={positionSummary.positionObject}
                  />
                )}
              >
                <span>
                  +1
                </span>
              </MaterialUIPopover>
            </SupportAndPartOfScore>
          )}
          {positionSummary.organizationOpposes && !positionSummary.organizationInVotersNetwork && (
            <OpposeButNotPartOfScore>
              <ThumbDown classes={{ root: classes.endorsementIcon }} />
            </OpposeButNotPartOfScore>
          )}
          {positionSummary.organizationOpposes && positionSummary.organizationInVotersNetwork && (
            <OpposeAndPartOfScore>
              <MaterialUIPopover
                popoverDisplayObject={(
                  <PositionItemScorePopoverTextOnly
                    positionItem={positionSummary.positionObject}
                  />
                )}
              >
                <span>
                  -1
                </span>
              </MaterialUIPopover>
            </OpposeAndPartOfScore>
          )}
          {positionSummary.organizationInVotersNetwork ? (
            <OrganizationNameWrapperWithPopover>
              <MaterialUIPopover
                controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromPropNow}
                externalUniqueId={positionSummary.organizationWeVoteId}
                openAdviserMaterialUIPopover={openAdviserMaterialUIPopoverNow}
                popoverDisplayObject={(
                  <PositionItemScorePopoverTextOnly
                    positionItem={positionSummary.positionObject}
                  />
                )}
              >
                <div>
                  {positionSummary.organizationName}
                </div>
              </MaterialUIPopover>
            </OrganizationNameWrapperWithPopover>
          ) : (
            <OrganizationNameWrapper>
              {positionSummary.organizationName}
            </OrganizationNameWrapper>
          )}
          {(positionSummary.voterCanFollowOrganization && !positionSummary.organizationInVotersNetwork) && (
            <FollowToggleWrapper>
              <FollowToggle organizationWeVoteId={positionSummary.organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing />
            </FollowToggleWrapper>
          )}
          {!!(positionSummary.organizationInVotersNetwork) && (
            <MaterialUIPopover
              popoverDisplayObject={(
                <PositionItemScorePopoverTextOnly
                  positionItem={positionSummary.positionObject}
                />
              )}
            >
              <OrganizationPopoverWrapper>
                {!!(positionSummary.issuesInCommonBetweenOrganizationAndVoter && positionSummary.issuesInCommonBetweenOrganizationAndVoter.length) && (
                  // Limits the number of displayed Issue icons
                  // The popover isn't big enough to accommodate more than 4 icons without making them too small!
                  <VoterAndOrganizationShareTheseIssuesWrapper>
                    {issuesInCommonForIconDisplayArray.map((issue) => (
                      <IssueIcon key={`issueInScore-${issue.issue_we_vote_id}`}>
                        <ReactSVG
                          src={cordovaDot(`/img/global/svg-icons/issues/${issue.issue_icon_local_path}.svg`)}
                          svgStyle={{ fill: '#555', padding: '1px 1px 1px 0px' }}
                        />
                      </IssueIcon>
                    ))}
                  </VoterAndOrganizationShareTheseIssuesWrapper>
                )}
                {(positionSummary.issuesInCommonBetweenOrganizationAndVoter.length > 4) ? ('...') : null}
                {positionSummary.voterIsFriendsWithThisOrganization ? (
                  <FollowingWrapper>
                    {/* <CheckCircle className="friends-icon" /> */}
                    <FriendsIcon />
                  </FollowingWrapper>
                ) : (
                  <>
                    {positionSummary.voterIsFollowingOrganization && (
                      <FollowingWrapper>
                        <CheckCircle className="following-icon" />
                      </FollowingWrapper>
                    )}
                  </>
                )}
              </OrganizationPopoverWrapper>
            </MaterialUIPopover>
          )}
        </PositionSummaryWrapper>
      );
    });
    if (numberNotDisplayed > 0) {
      renderedList.push(
        <ShowXMoreWrapper
          key={`onePositionForPopoverShowXMore-${ballotItemWeVoteId}`}
        >
          +
          {numberNotDisplayed}
          {' '}
          more
        </ShowXMoreWrapper>,
      );
    }
    if (voterPersonalNetworkScore === 0 || voterPersonalNetworkScoreIsNegative || voterPersonalNetworkScoreIsPositive) {
      renderedList.push(
        <VoterPersonalNetworkScoreSumLineWrapper
          key={`onePositionForPopoverPersonalNetworkScoreSumLine-${ballotItemWeVoteId}`}
        >
          <NetworkScoreSumLine />
        </VoterPersonalNetworkScoreSumLineWrapper>,
        <VoterPersonalNetworkScoreWrapper
          key={`onePositionForPopoverPersonalNetworkScore-${ballotItemWeVoteId}`}
        >
          { voterPersonalNetworkScore === 0 ? (
            <NetworkScoreSmall voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
              0
            </NetworkScoreSmall>
          ) : (
            <NetworkScoreSmall voterPersonalNetworkScoreIsNegative={voterPersonalNetworkScoreIsNegative} voterPersonalNetworkScoreIsPositive={voterPersonalNetworkScoreIsPositive}>
              { voterPersonalNetworkScoreWithSign }
            </NetworkScoreSmall>
          )}
          <NetworkScoreDescriptionText>
            Total Personalized Score
          </NetworkScoreDescriptionText>
        </VoterPersonalNetworkScoreWrapper>,
      );
    }
    if (this.props.showAllPositions) {
      renderedList.push(
        <ShowMoreFooterWrapper key={`onePositionForPopoverShowAllPositions-${ballotItemWeVoteId}`}>
          <ShowMoreFooter
            showMoreId={`onePositionForPopoverShowAllPositions-${ballotItemWeVoteId}`}
            showMoreLink={() => this.showAllPositions()}
            showMoreText="Show All Positions"
          />
        </ShowMoreFooterWrapper>,
      );
    }
    return cleanArray(renderedList);
  }
}
PositionSummaryListForPopover.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  controlAdviserMaterialUIPopoverFromProp: PropTypes.bool,
  openAdviserMaterialUIPopover: PropTypes.bool,
  positionSummaryList: PropTypes.array,
  showAllPositions: PropTypes.func,
  voterPersonalNetworkScore: PropTypes.number,
  voterPersonalNetworkScoreIsNegative: PropTypes.bool,
  voterPersonalNetworkScoreIsPositive: PropTypes.bool,
  voterPersonalNetworkScoreWithSign: PropTypes.string,
};

const styles = () => ({
  endorsementIcon: {
    width: 12,
    height: 12,
  },
  popoverTypography: {
    padding: 5,
  },
});

const FollowToggleWrapper = styled.div`
`;

const FollowingWrapper = styled.div`
  color: #0d546f !important;
`;

const IssueIcon = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const NetworkScoreDescriptionText = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  margin-left: 6px;
`;

const NetworkScoreSmall = styled.div`
  background: ${({ voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  float: left;
  font-size: 14px;
  font-weight: bold;
  @media print{
    border-width: 1 px;
    border-style: solid;
    border-color: ${({ voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || '#888')};
  }
`;

const NetworkScoreSumLine = styled.div`
  background: #2E3C5D;
  border-radius: 2px;
  width: 40px;
  height: 3px;
  margin-left: -5px;
`;

const OpposeAndPartOfScore = styled.div`
  background: ${({ theme }) => theme.colors.opposeRedRgb};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  float: right;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  @media print{
    border: 2px solid grey;
  }
`;

const OpposeButNotPartOfScore = styled.div`
  color: ${({ theme }) => theme.colors.opposeRedRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  float: left;
  border: 2px solid ${({ theme }) => theme.colors.opposeRedRgb};
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

const OrganizationNameWrapper = styled.div`
  flex-grow: 8;
  padding-right: 8px;
`;

const OrganizationNameWrapperWithPopover = styled.div`
  cursor: pointer;
  flex-grow: 8;
  padding-right: 8px;
`;

const OrganizationPopoverWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;

const PositionSummaryWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;

const ShowMoreFooterWrapper = styled.div`
  margin-top: 10px;
`;

const ShowXMoreWrapper = styled.div`
  color: ${({ theme }) => theme.colors.grayMid};
  font-size: 16px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SupportAndPartOfScore = styled.div`
  background: ${({ theme }) => theme.colors.supportGreenRgb};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  float: right;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  @media print{
    border: 2px solid grey;
  }
`;

const SupportButNotPartOfScore = styled.div`
  color: ${({ theme }) => theme.colors.supportGreenRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid ${({ theme }) => theme.colors.supportGreenRgb};
  float: left;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

const VoterAndOrganizationShareTheseIssuesWrapper  = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;

const VoterPersonalNetworkScoreWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-top: 3px;
  justify-content: flex-start;
`;

const VoterPersonalNetworkScoreSumLineWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-top: 10px;
  justify-content: flex-start;
`;

export default withTheme(withStyles(styles)(PositionSummaryListForPopover));

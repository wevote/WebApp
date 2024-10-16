import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import React, { Component, Suspense } from 'react';
import SvgImage from '../../common/components/Widgets/SvgImage';
import { renderLog } from '../../common/utils/logging';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import { getPositionSummaryListForBallotItem } from '../../utils/positionFunctions';
import StickyPopover from '../Ballot/StickyPopover';
import IssueFollowToggleButton from './IssueFollowToggleButton';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const PositionSummaryListForPopover = React.lazy(() => import(/* webpackChunkName: 'PositionSummaryListForPopover' */ '../Widgets/ScoreDisplay/PositionSummaryListForPopover'));


class ValueNameWithPopoverDisplay extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisCandidateLength: 0,
    };
    this.valueSpan = React.createRef();
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCachedPositionsOrIssueStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onCachedPositionsOrIssueStoreChange.bind(this));
    this.onCachedPositionsOrIssueStoreChange();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.allCachedPositionsForThisCandidateLength !== nextState.allCachedPositionsForThisCandidateLength) {
      // console.log('this.state.allCachedPositionsForThisCandidateLength: ', this.state.allCachedPositionsForThisCandidateLength, ', nextState.allCachedPositionsForThisCandidateLength', nextState.allCachedPositionsForThisCandidateLength);
      return true;
    }
    if (this.state.allIssuesVoterIsFollowingLength !== nextState.allIssuesVoterIsFollowingLength) {
      // console.log('this.state.allIssuesVoterIsFollowingLength: ', this.state.allIssuesVoterIsFollowingLength, ', nextState.allIssuesVoterIsFollowingLength', nextState.allIssuesVoterIsFollowingLength);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
  }

  onCachedPositionsOrIssueStoreChange () {
    const { ballotItemWeVoteId, oneIssue } = this.props;
    const {
      allCachedPositionsForThisCandidateLength: priorAllCachedPositionsForThisCandidateLength,
      allIssuesVoterIsFollowingLength: priorAllIssuesVoterIsFollowingLength,
    } = this.state;
    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    const allCachedPositionsForThisCandidateLength = allCachedPositionsForThisCandidate.length;
    const allIssuesVoterIsFollowing = IssueStore.getIssuesVoterIsFollowing();
    const allIssuesVoterIsFollowingLength = allIssuesVoterIsFollowing.length;
    // console.log('allCachedPositionsForThisCandidate: ', allCachedPositionsForThisCandidate);
    if (allCachedPositionsForThisCandidateLength !== priorAllCachedPositionsForThisCandidateLength || allIssuesVoterIsFollowingLength !== priorAllIssuesVoterIsFollowingLength) {
      const limitToThisIssue = oneIssue.issue_we_vote_id;
      const showPositionsInVotersNetwork = false;
      const issueSpecificPositionList = getPositionSummaryListForBallotItem(ballotItemWeVoteId, limitToThisIssue, showPositionsInVotersNetwork);
      const organizationsUnderThisIssueCount = issueSpecificPositionList.length;
      this.setState({
        issueSpecificPositionList,
        organizationsUnderThisIssueCount,
      });
    }
    this.setState({
      allCachedPositionsForThisCandidateLength,
      allIssuesVoterIsFollowingLength,
    });
  }

  valuePopover = () => {
    const { ballotItemWeVoteId, ballotItemDisplayName, issueFollowedByVoter, oneIssue } = this.props;
    const { issueSpecificPositionList, organizationsUnderThisIssueCount } = this.state;
    return (
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleIcon>
            <PopoverIconWrapper>
              <SvgImage imageName={oneIssue.issue_icon_local_path} stylesTextIncoming="fill: #fff !important;" />
            </PopoverIconWrapper>
          </PopoverTitleIcon>
          <PopoverTitleText>
            {oneIssue.issue_name}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverDescriptionText>
          {!!(organizationsUnderThisIssueCount) && (
            <>
              <OpinionsRelatedToText>
                These groups or people advocate for
                {' '}
                <strong>
                  {oneIssue.issue_name}
                </strong>
                {ballotItemDisplayName && (
                  <span>
                    {' '}
                    and endorse
                    {' '}
                    <strong>
                      {ballotItemDisplayName}
                    </strong>
                  </span>
                )}
                :
              </OpinionsRelatedToText>
              {issueSpecificPositionList && (
                <RenderedOrganizationsWrapper>
                  <Suspense fallback={<></>}>
                    <PositionSummaryListForPopover
                      ballotItemWeVoteId={ballotItemWeVoteId}
                      positionSummaryList={issueSpecificPositionList}
                    />
                  </Suspense>
                </RenderedOrganizationsWrapper>
              )}
            </>
          )}
          {oneIssue.issue_we_vote_id && (
            <>
              <FollowValueNameToggleContainer>
                <IssueFollowToggleButton
                  classNameOverride="pull-left"
                  issueName={oneIssue.issue_name}
                  issueWeVoteId={oneIssue.issue_we_vote_id}
                  showFollowingButtonText
                  showIssueNameOnFollowButton
                  // lightModeOn
                />
              </FollowValueNameToggleContainer>
              <FollowIfYouCare>
                <Suspense fallback={<></>}>
                  <ReadMore
                    textToDisplay={issueFollowedByVoter ? `You follow ${oneIssue.issue_name}: "${oneIssue.issue_description}"` : `Follow if you care about ${oneIssue.issue_name}: "${oneIssue.issue_description}"`}
                    numberOfLines={4}
                  />
                </Suspense>
              </FollowIfYouCare>
            </>
          )}
        </PopoverDescriptionText>
      </PopoverWrapper>
    );
  }

  render () {
    renderLog('ValueNameWithPopoverDisplay');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemWeVoteId, externalUniqueId, issueFollowedByVoter, oneIssue, showEllipses } = this.props;
    // console.log('ValueNameWithPopoverDisplay render, oneIssue.issue_name:', oneIssue.issue_name, ', showEllipses:', showEllipses);
    return (
      <StickyPopover
        delay={{ show: 1000000, hide: 100 }}
        popoverComponent={this.valuePopover()}
        placement="auto"
        id="issues-popover-trigger-click-root-close"
        key={`issueByBallotItemPopover-${ballotItemWeVoteId}-${oneIssue.issue_we_vote_id}-${showEllipses}`}
        openOnClick
        showCloseIcon
      >
        <Chip
          color="valueChip"
          id={`${externalUniqueId}-valueIconAndText-${oneIssue.issue_we_vote_id}`}
          key={`${externalUniqueId}-valueIconAndTextKey-${oneIssue.issue_we_vote_id}`}
          style={{
            margin: '5px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            color: '#555',
            fontSize: '.8rem',
          }}
          label={oneIssue.issue_name}
          icon={issueFollowedByVoter ? <DoneIcon /> : null}
        />
      </StickyPopover>
    );
  }
}
ValueNameWithPopoverDisplay.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  ballotItemDisplayName: PropTypes.string,
  externalUniqueId: PropTypes.string,
  issueFollowedByVoter: PropTypes.bool,
  oneIssue: PropTypes.object,
  showEllipses: PropTypes.bool,
};

const styles = () => ({
  chipStyle: {
    backgroundColor: '#dbdbdb',
    border: '1px solid #ccc',
    color: '#555',
    cursor: 'pointer',
    fontSize: '.7rem',
    height: 'auto',
    '&:hover': {
      backgroundColor: '#e8e8e8',
    },
  },
});

const FollowValueNameToggleContainer = styled('div')`
  margin-top: 24px;
`;

const PopoverIconWrapper = styled('div')`
  height: 24px;
  margin-top: -3px;
  width: 24px;
`;

const PopoverWrapper = styled('div')`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  right: 12px;
  bottom: 8px;
  border-radius: 3px;
  margin-left: 12px;
  margin-top: 8px;
`;

const FollowIfYouCare = styled('div')`
  color: #999;
  font-size: .75rem;
  padding-top: 8px;
`;

const OpinionsRelatedToText = styled('div')`
  margin-top: 4px;
`;

const PopoverHeader = styled('div')(({ theme }) => (`
  background: ${theme.colors.brandBlue};
  padding: 4px 8px;
  min-height: 35px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`));

const PopoverTitleIcon = styled('span')`
  font-weight: bold;
  font-size: 16px;
`;

const PopoverTitleText = styled('div')`
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
`;

const PopoverDescriptionText = styled('div')`
  padding: 8px;
`;

const RenderedOrganizationsWrapper = styled('div')`
  margin-top: 6px;
`;

export default withTheme(withStyles(styles)(ValueNameWithPopoverDisplay));

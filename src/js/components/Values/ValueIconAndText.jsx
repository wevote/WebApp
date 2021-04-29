import { Chip } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { getPositionSummaryListForBallotItem } from '../../utils/positionFunctions';

const IssueFollowToggleButton = React.lazy(() => import('./IssueFollowToggleButton'));
const PositionSummaryListForPopover = React.lazy(() => import('../Widgets/PositionSummaryListForPopover'));
const ReadMore = React.lazy(() => import('../Widgets/ReadMore'));
const StickyPopover = React.lazy(() => import('../Ballot/StickyPopover'));

class ValueIconAndText extends Component {
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

  componentDidUpdate (prevProps) {
    // console.log('ValueIconAndText componentDidUpdate');
    const { oneIssue } = this.props;
    if (!prevProps.issueWidths[oneIssue.issue_we_vote_id]) {
      if (this.valueSpan && this.valueSpan.current) {
        const width = this.valueSpan.current.offsetWidth;
        if (width > 0) {
          this.props.subtractTotalWidth(this.props.oneIssue.issue_we_vote_id, width + 25);
        }
      }
    }
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
            <ReactSVG
              src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
              beforeInjection={(svg) => svg.setAttribute('style', { fill: '#fff', padding: '1px 1px 1px 0px' })}
            />
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
                  <PositionSummaryListForPopover
                    ballotItemWeVoteId={ballotItemWeVoteId}
                    positionSummaryList={issueSpecificPositionList}
                  />
                </RenderedOrganizationsWrapper>
              )}
            </>
          )}
          {oneIssue.issue_we_vote_id && (
            <>
              <FollowIssueToggleContainer>
                <IssueFollowToggleButton
                  classNameOverride="pull-left"
                  issueName={oneIssue.issue_name}
                  issueWeVoteId={oneIssue.issue_we_vote_id}
                  showFollowingButtonText
                  showIssueNameOnFollowButton
                  lightModeOn
                />
              </FollowIssueToggleContainer>
              <FollowIfYouCare>
                <ReadMore
                  textToDisplay={issueFollowedByVoter ? oneIssue.issue_description : `Follow if you care about ${oneIssue.issue_name}: "${oneIssue.issue_description}"`}
                  numberOfLines={4}
                />
              </FollowIfYouCare>
            </>
          )}
        </PopoverDescriptionText>
      </PopoverWrapper>
    );
  }

  render () {
    renderLog('ValueIconAndText');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ValueIconAndText render');
    const { ballotItemWeVoteId, classes, externalUniqueId, issueFollowedByVoter, oneIssue } = this.props;
    const svgFill = issueFollowedByVoter ? '#555' : '#999';
    return (
      <StickyPopover
        delay={{ show: 1000000, hide: 100 }}
        popoverComponent={this.valuePopover()}
        placement="auto"
        id="issues-popover-trigger-click-root-close"
        key={`issueByBallotItemPopover-${ballotItemWeVoteId}-${oneIssue.issue_we_vote_id}`}
        openOnClick
        showCloseIcon
      >
        <ValueIconAndTextSpan
          id={`${externalUniqueId}-valueIconAndText-${oneIssue.issue_we_vote_id}`}
          issueFollowedByVoter={issueFollowedByVoter}
          key={`${externalUniqueId}-valueIconAndTextKey-${oneIssue.issue_we_vote_id}`}
          className="u-no-break u-cursor--pointer"
        >
          <Chip
            avatar={oneIssue.issue_icon_local_path ? (
              <ReactSVG
                src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
                beforeInjection={(svg) => svg.setAttribute('style', { fill: svgFill, padding: '1px 1px 1px 0px' })}
              />
            ) : <span />}
            classes={{ root: classes.chipStyle }}
            label={oneIssue.issue_name}
            ref={this.valueSpan}
          />
        </ValueIconAndTextSpan>
      </StickyPopover>
    );
  }
}
ValueIconAndText.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  ballotItemDisplayName: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  issueFollowedByVoter: PropTypes.bool,
  issueWidths: PropTypes.object,
  oneIssue: PropTypes.object,
  subtractTotalWidth: PropTypes.func,
};

const styles = () => ({
  chipStyle: {
    color: '#555',
    fontSize: '.7rem',
    height: 'auto',
  },
});

const FollowIssueToggleContainer = styled.div`
  margin-top: 24px;
`;

const PopoverWrapper = styled.div`
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

const ValueIconAndTextSpan = styled.span`
  align-items: start;
  display: flex;
  flex: none;
  ${({ issueFollowedByVoter }) => (issueFollowedByVoter ? 'font-weight: 800;' : '')}
  padding: 4px;
  position: relative;
  width: fit-content;
`;

const FollowIfYouCare = styled.div`
  color: #999;
  font-size: .75rem;
  padding-top: 8px;
`;

const OpinionsRelatedToText = styled.div`
  margin-top: 4px;
`;

const PopoverHeader = styled.div`
  background: ${({ theme }) => theme.colors.brandBlue};
  padding: 4px 8px;
  min-height: 35px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const PopoverTitleIcon = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const PopoverTitleText = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
`;

const PopoverDescriptionText = styled.div`
  padding: 8px;
`;

const RenderedOrganizationsWrapper = styled.div`
  margin-top: 6px;
`;

export default withTheme(withStyles(styles)(ValueIconAndText));

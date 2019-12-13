import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import ReactSVG from 'react-svg';
import CandidateStore from '../../stores/CandidateStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueStore from '../../stores/IssueStore';
import { getPositionSummaryListForBallotItem } from '../../utils/positionFunctions';
import PositionSummaryListForPopover from '../Widgets/PositionSummaryListForPopover';
import ReadMore from '../Widgets/ReadMore';
import StickyPopover from '../Ballot/StickyPopover';

class ValueIconAndText extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    ballotItemDisplayName: PropTypes.string,
    issueFollowedByVoter: PropTypes.bool,
    issueWidths: PropTypes.object,
    oneIssue: PropTypes.object,
    subtractTotalWidth: PropTypes.func,
  };

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
      const width = this.valueSpan.current.offsetWidth;
      if (width > 0) {
        this.props.subtractTotalWidth(this.props.oneIssue.issue_we_vote_id, width + 25);
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
      const limitToVoterNetwork = false;
      const issueSpecificPositionList = getPositionSummaryListForBallotItem(ballotItemWeVoteId, limitToThisIssue, limitToVoterNetwork);
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
    const { ballotItemDisplayName, oneIssue } = this.props;
    const { issueSpecificPositionList, organizationsUnderThisIssueCount } = this.state;
    return (
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleIcon>
            <ReactSVG src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
              svgStyle={{ fill: '#fff', padding: '1px 1px 1px 0px' }}
            />
          </PopoverTitleIcon>
          <PopoverTitleText>
            {oneIssue.issue_name}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverDescriptionText>
          <ReadMore
            text_to_display={oneIssue.issue_description}
            num_of_lines={2}
          />
          {!!(organizationsUnderThisIssueCount) && (
            <>
              <OpinionsRelatedToText>
                Opinions
                {' '}
                {ballotItemDisplayName && (
                  <span>
                    about
                    {' '}
                    {ballotItemDisplayName}
                    {' '}
                  </span>
                )}
                related to
                {' '}
                {oneIssue.issue_name}
                :
              </OpinionsRelatedToText>
              {issueSpecificPositionList && (
                <RenderedOrganizationsWrapper>
                  <PositionSummaryListForPopover
                    positionSummaryList={issueSpecificPositionList}
                  />
                </RenderedOrganizationsWrapper>
              )}
            </>
          )}
          {oneIssue.issue_we_vote_id && (
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
          )}
        </PopoverDescriptionText>
      </PopoverWrapper>
    );
  }

  render () {
    // console.log('ValueIconAndText render');
    const { ballotItemWeVoteId, issueFollowedByVoter, oneIssue } = this.props;
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
          id={`valueIconAndText-${oneIssue.issue_we_vote_id}`}
          issueFollowedByVoter={issueFollowedByVoter}
          key={`valueIconAndTextKey-${oneIssue.issue_we_vote_id}`}
          className="u-no-break u-cursor--pointer"
        >
          {oneIssue.issue_icon_local_path ? (
            <div className="issue-icon-list__issue-icon">
              <ReactSVG
                src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
                svgStyle={{ fill: svgFill, padding: '1px 1px 1px 0px' }}
              />
            </div>
          ) : null
        }
          <div className="u-margin-left--xxs issue-icon-list__issue-label-name" ref={this.valueSpan}>
            {oneIssue.issue_name}
          </div>
        </ValueIconAndTextSpan>
      </StickyPopover>
    );
  }
}

const styles = () => ({
  endorsementIcon: {
    width: 12,
    height: 12,
  },
});

const FollowIssueToggleContainer = styled.div`
  margin-top: 10px;
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

const OpinionsRelatedToText = styled.div`
  color: #999;
  font-weight: 200;
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import ReactSVG from 'react-svg';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CandidateStore from '../../stores/CandidateStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueStore from '../../stores/IssueStore';
import StickyPopover from '../Ballot/StickyPopover';
import { arrayContains, cleanArray } from '../../utils/textFormat';

class ValueIconAndText extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    ballotItemDisplayName: PropTypes.string,
    classes: PropTypes.object,
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
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCandidateStoreChange();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.allCachedPositionsForThisCandidateLength !== nextState.allCachedPositionsForThisCandidateLength) {
      // console.log('this.state.allCachedPositionsForThisCandidateLength: ', this.state.allCachedPositionsForThisCandidateLength, ', nextState.allCachedPositionsForThisCandidateLength', nextState.allCachedPositionsForThisCandidateLength);
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
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    const { allCachedPositionsForThisCandidateLength: priorAllCachedPositionsForThisCandidateLength } = this.state;
    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    const allCachedPositionsForThisCandidateLength = allCachedPositionsForThisCandidate.length;
    // console.log('allCachedPositionsForThisCandidate: ', allCachedPositionsForThisCandidate);
    if (allCachedPositionsForThisCandidateLength !== priorAllCachedPositionsForThisCandidateLength) {
      // Update the listing of organizations under this issue
      const { oneIssue } = this.props;
      let organizationName = '';
      let organizationOpposes = false;
      let organizationSupports = false;
      let organizationsUnderThisIssueCount = 0;
      let organizationWeVoteId = '';
      let speakerType = '';
      let positionSummary = {};
      const issueSpecificPositionList = [];
      const organizationWeVoteIdsLinkedToThisIssue = IssueStore.getOrganizationWeVoteIdsLinkedToOneIssue(oneIssue.issue_we_vote_id);
      for (let i = 0; i < allCachedPositionsForThisCandidateLength; i++) {
        // Cycle through the positions for this candidate, and see if the organization endorsing is linked to this issue
        organizationWeVoteId = allCachedPositionsForThisCandidate[i].speaker_we_vote_id;
        if (arrayContains(organizationWeVoteId, organizationWeVoteIdsLinkedToThisIssue)) {
          organizationName = allCachedPositionsForThisCandidate[i].speaker_display_name;
          organizationOpposes = allCachedPositionsForThisCandidate[i].is_oppose_or_negative_rating;
          organizationSupports = allCachedPositionsForThisCandidate[i].is_support_or_positive_rating;
          speakerType = allCachedPositionsForThisCandidate[i].speaker_type;
          if (organizationSupports || organizationOpposes) {
            positionSummary = {
              organizationName,
              organizationOpposes,
              organizationSupports,
              organizationWeVoteId,
              speakerType,
            };
            issueSpecificPositionList.push(positionSummary);
            organizationsUnderThisIssueCount += 1;
          }
        }
      }
      const renderedOrganizationsForThisIssueList = this.renderOrganizationsForThisIssueList(issueSpecificPositionList);
      this.setState({
        organizationsUnderThisIssueCount,
        renderedOrganizationsForThisIssueList,
      });
    }
    this.setState({
      allCachedPositionsForThisCandidateLength,
    });
  }

  valuePopover = () => {
    const { ballotItemDisplayName, oneIssue } = this.props;
    const { organizationsUnderThisIssueCount, renderedOrganizationsForThisIssueList } = this.state;
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
          {oneIssue.issue_description}
          {organizationsUnderThisIssueCount && (
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
              {renderedOrganizationsForThisIssueList && (
                <RenderedOrganizationsWrapper>
                  {renderedOrganizationsForThisIssueList}
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
              />
            </FollowIssueToggleContainer>
          )}
        </PopoverDescriptionText>
      </PopoverWrapper>
    );
  }

  renderOrganizationsForThisIssueList (issueSpecificPositionList) {
    const { classes, issueFollowedByVoter } = this.props;
    const renderedList = issueSpecificPositionList.map(positionSummary => (
      <PositionSummaryWrapper key={`onePositionForIssue--${positionSummary.organizationWeVoteId}`}>
        {positionSummary.organizationSupports && !issueFollowedByVoter && (
          <Support>
            <ThumbUpIcon classes={{ root: classes.endorsementIcon }} />
          </Support>
        )}
        {positionSummary.organizationSupports && issueFollowedByVoter && (
          <SupportFollow>
            +1
          </SupportFollow>
        )}
        {positionSummary.organizationOpposes && !issueFollowedByVoter && (
          <Oppose>
            <ThumbDownIcon classes={{ root: classes.endorsementIcon }} />
          </Oppose>
        )}
        {positionSummary.organizationOpposes && issueFollowedByVoter && (
          <OpposeFollow>
            -1
          </OpposeFollow>
        )}
        <div>
          {positionSummary.organizationName}
        </div>
      </PositionSummaryWrapper>
    ));
    return cleanArray(renderedList);
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

const PositionSummaryWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
`;

const PopoverHeader = styled.div`
  background: ${({ theme }) => theme.colors.brandBlue};
  padding: 4px 8px;
  height: 35px;
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

const SupportFollow = styled.div`
  color: white;
  background: ${({ theme }) => theme.colors.supportGreenRgb};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
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

const OpposeFollow = styled.div`
  color: white;
  background: ${({ theme }) => theme.colors.opposeRedRgb};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
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

const Support = styled.div`
  color: ${({ theme }) => theme.colors.supportGreenRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid ${({ theme }) => theme.colors.supportGreenRgb};
  float: left;
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

const Oppose = styled.div`
  color: ${({ theme }) => theme.colors.opposeRedRgb};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  float: left;
  border: 2px solid ${({ theme }) => theme.colors.opposeRedRgb};
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
`;

export default withTheme(withStyles(styles)(ValueIconAndText));

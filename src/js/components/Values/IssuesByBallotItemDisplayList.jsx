import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';
import ValueNameWithPopoverDisplay from './ValueNameWithPopoverDisplay';

// Show a voter a horizontal list of all the issues they are following that relate to this ballot item
class IssuesByBallotItemDisplayList extends Component {
  static closePopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);
    this.state = {
      defaultNumberOfIssuesToDisplay: 4,
      expandIssues: false,
      issuesToRender: [],
      currentNumberOfIssuesToDisplay: 4,
      totalLengthOfIssuesToRenderList: 0,
    };
    this.issuesList = React.createRef();
  }

  componentDidMount () {
    // console.log('IssuesByBallotItemDisplayList componentDidMount, this.props.ballotItemWeVoteId:', this.props.ballotItemWeVoteId);
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    // const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId) || [];
    // const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId) || [];
    // const issuesToRender = issuesUnderThisBallotItemVoterIsFollowing.concat(issuesUnderThisBallotItemVoterIsNotFollowing);
    // const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    // const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    const issuesSupportingThisBallotItemVoterIsFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesSupportingThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesToRender = issuesSupportingThisBallotItemVoterIsFollowing.concat(issuesSupportingThisBallotItemVoterIsNotFollowing);
    const issuesSupportingThisBallotItemVoterIsFollowingLength = issuesSupportingThisBallotItemVoterIsFollowing.length;
    const issuesSupportingThisBallotItemVoterIsNotFollowingLength = issuesSupportingThisBallotItemVoterIsNotFollowing.length;
    const totalLengthOfIssuesToRenderList = issuesToRender.length;
    const { ballotItemDisplayName, ballotItemWeVoteId, expandIssuesByDefault } = this.props;
    const { defaultNumberOfIssuesToDisplay } = this.state;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      currentNumberOfIssuesToDisplay: expandIssuesByDefault ? totalLengthOfIssuesToRenderList : defaultNumberOfIssuesToDisplay,
      expandIssues: expandIssuesByDefault || false,
      issuesToRender,
      totalLengthOfIssuesToRenderList,
      issuesSupportingThisBallotItemVoterIsFollowingLength,
      issuesSupportingThisBallotItemVoterIsNotFollowingLength,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('IssuesByBallotItemDisplayList componentWillReceiveProps, nextProps.ballotItemWeVoteId:', nextProps.ballotItemWeVoteId);
    const issuesSupportingThisBallotItemVoterIsFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesSupportingThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesToRender = issuesSupportingThisBallotItemVoterIsFollowing.concat(issuesSupportingThisBallotItemVoterIsNotFollowing);
    const issuesSupportingThisBallotItemVoterIsFollowingLength = issuesSupportingThisBallotItemVoterIsFollowing.length;
    const issuesSupportingThisBallotItemVoterIsNotFollowingLength = issuesSupportingThisBallotItemVoterIsNotFollowing.length;
    const totalLengthOfIssuesToRenderList = issuesToRender.length;
    const { ballotItemDisplayName, ballotItemWeVoteId } = nextProps;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      issuesToRender,
      totalLengthOfIssuesToRenderList,
      issuesSupportingThisBallotItemVoterIsFollowingLength,
      issuesSupportingThisBallotItemVoterIsNotFollowingLength,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      // console.log('this.state.ballotItemWeVoteId: ', this.state.ballotItemWeVoteId, ', nextState.ballotItemWeVoteId', nextState.ballotItemWeVoteId);
      return true;
    }
    if (this.state.expandIssues !== nextState.expandIssues) {
      // console.log('this.state.expandIssues: ', this.state.expandIssues, ', nextState.expandIssues', nextState.expandIssues);
      return true;
    }
    if (this.state.issuesSupportingThisBallotItemVoterIsFollowingLength !== nextState.issuesSupportingThisBallotItemVoterIsFollowingLength) {
      // console.log('this.state.issuesSupportingThisBallotItemVoterIsFollowingLength: ', this.state.issuesSupportingThisBallotItemVoterIsFollowingLength, ', nextState.issuesSupportingThisBallotItemVoterIsFollowingLength', nextState.issuesSupportingThisBallotItemVoterIsFollowingLength);
      return true;
    }
    if (this.state.issuesSupportingThisBallotItemVoterIsNotFollowingLength !== nextState.issuesSupportingThisBallotItemVoterIsNotFollowingLength) {
      // console.log('this.state.issuesSupportingThisBallotItemVoterIsNotFollowingLength: ', this.state.issuesSupportingThisBallotItemVoterIsNotFollowingLength, ', nextState.issuesSupportingThisBallotItemVoterIsNotFollowingLength', nextState.issuesSupportingThisBallotItemVoterIsNotFollowingLength);
      return true;
    }
    if (this.state.issuesToRender !== nextState.issuesToRender) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    // console.log('IssuesByBallotItemDisplayList onIssueStoreChange, signInModalGlobalState:', signInModalGlobalState);
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('IssuesByBallotItemDisplayList, onIssueStoreChange');
      const { ballotItemWeVoteId } = this.state;
      const issuesSupportingThisBallotItemVoterIsFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterIsFollowing(ballotItemWeVoteId) || [];
      const issuesSupportingThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesSupportingThisBallotItemVoterNotFollowing(ballotItemWeVoteId) || [];
      const issuesToRender = issuesSupportingThisBallotItemVoterIsFollowing.concat(issuesSupportingThisBallotItemVoterIsNotFollowing);
      const issuesSupportingThisBallotItemVoterIsFollowingLength = issuesSupportingThisBallotItemVoterIsFollowing.length;
      const issuesSupportingThisBallotItemVoterIsNotFollowingLength = issuesSupportingThisBallotItemVoterIsNotFollowing.length;
      const totalLengthOfIssuesToRenderList = issuesToRender.length;
      this.setState({
        issuesSupportingThisBallotItemVoterIsFollowingLength,
        issuesSupportingThisBallotItemVoterIsNotFollowingLength,
        issuesToRender,
        totalLengthOfIssuesToRenderList,
      });
    }
  }

  onVoterGuideStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('IssuesByBallotItemDisplayList, onVoterGuideStoreChange');

      // We just want to trigger a re-render, if SignInModal is not in use
      this.setState();
    }
  }

  handleEnterHoverLocalArea = () => {
    if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  };

  handleExpandIssues = () => {
    const { expandIssues, totalLengthOfIssuesToRenderList } = this.state;
    this.setState({
      expandIssues: !expandIssues,
      currentNumberOfIssuesToDisplay: totalLengthOfIssuesToRenderList,
    });
  };

  handleHideIssues = () => {
    const { defaultNumberOfIssuesToDisplay } = this.state;
    this.setState({
      expandIssues: false,
      currentNumberOfIssuesToDisplay: defaultNumberOfIssuesToDisplay,
    });
  };

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

  render () {
    renderLog('IssuesByBallotItemDisplayList.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('IssuesByBallotItemDisplayList render');
    const { externalUniqueId } = this.props;
    const {
      ballotItemDisplayName, ballotItemWeVoteId, currentNumberOfIssuesToDisplay,
      expandIssues,
      issuesToRender, totalLengthOfIssuesToRenderList,
    } = this.state;

    // console.log('this.state.ballotItemWeVoteId: ', ballotItemWeVoteId);
    // console.log('issuesToRender: ', issuesToRender);
    if (!issuesToRender || !issuesToRender.length) {
      // If we don't have any endorsement text, show the alternate component passed in
      // console.log('no issues to render');
      return this.props.children || null;
    }

    let issueFollowedByVoter = false;
    let localCounter = 0;
    let showEllipses = false;
    const issuesChips = issuesToRender.map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        // console.log('oneIssue.issue_name: ', oneIssue.issue_name);
        localCounter++;
        if (localCounter <= currentNumberOfIssuesToDisplay) {
          issueFollowedByVoter = IssueStore.isVoterFollowingThisIssue(oneIssue.issue_we_vote_id);
          if (currentNumberOfIssuesToDisplay < totalLengthOfIssuesToRenderList) {
            showEllipses = ((localCounter === currentNumberOfIssuesToDisplay) && (localCounter < totalLengthOfIssuesToRenderList));
          } else {
            showEllipses = false;
          }
          return (
            <ValueNameWithPopoverDisplay
              key={`${ballotItemWeVoteId}-${oneIssue.issue_we_vote_id}-${showEllipses}`}
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={ballotItemWeVoteId}
              externalUniqueId={`${ballotItemWeVoteId}-${externalUniqueId}`}
              issueFollowedByVoter={issueFollowedByVoter}
              oneIssue={oneIssue}
              showEllipses={showEllipses}
            />
          );
        } else {
          return null;
        }
      },
    );

    return (
      <Wrapper
        onBlur={this.handleLeaveHoverLocalArea}
        onFocus={this.handleEnterHoverLocalArea}
        onMouseOut={this.handleLeaveHoverLocalArea}
        onMouseOver={this.handleEnterHoverLocalArea}
      >
        <Issues>
          {/* Show a break-down of the current positions in your network */}
          <div ref={this.issuesList}>
            <IssueListWrapper
              key={`issuesByBallotItemDisplayList-${ballotItemWeVoteId}`}
              data-modal-trigger
            >
              {issuesChips}
              {totalLengthOfIssuesToRenderList && (
                <>
                  {expandIssues ? (
                    <MoreWrapper
                      id="issuesByBallotItemDisplayListHideIssues"
                      onClick={this.handleHideIssues}
                    >
                      show less
                    </MoreWrapper>
                  ) : (
                    <>
                      {(currentNumberOfIssuesToDisplay < totalLengthOfIssuesToRenderList) && (
                        <MoreWrapper
                          id="issuesByBallotItemDisplayListMoreIssues"
                          onClick={this.handleExpandIssues}
                        >
                          show more
                        </MoreWrapper>
                      )}
                    </>
                  )}
                </>
              )}
            </IssueListWrapper>
          </div>
        </Issues>
      </Wrapper>
    );
  }
}
IssuesByBallotItemDisplayList.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string,
  children: PropTypes.object,
  expandIssuesByDefault: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  handleLeaveCandidateCard: PropTypes.func,
  handleEnterCandidateCard: PropTypes.func,
};

const Wrapper = styled('div')`
  overflow: unset;
  overflow-x: unset;
  overflow-y: unset;
`;

const Issues = styled('div')`
  // width: 100%;
  margin-left: 0;
`;

const IssueListWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 8px;
  padding-inline-start: 0;
  width: 100%;
`;

const MoreWrapper = styled('span')`
  color: #000;
  opacity: 0.6;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #ccc;
  justify-content: center;
  align-content: space-evenly;
  &:hover {
    text-decoration: underline;
  }
`;

export default IssuesByBallotItemDisplayList;

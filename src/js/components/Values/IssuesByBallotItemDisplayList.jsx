import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {MoreHoriz} from '@material-ui/icons/MoreHoriz';
import IssueStore from '../../stores/IssueStore';
import ValueIconAndText from './ValueIconAndText';
import VoterGuideStore from '../../stores/VoterGuideStore';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import { renderLog } from '../../utils/logging';

// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item
class IssuesByBallotItemDisplayList extends Component {
  static closePopover () {
    document.body.click();
  }

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string,
    children: PropTypes.object,
    disableMoreWrapper: PropTypes.bool,
    expandIssuesByDefault: PropTypes.bool,
    externalUniqueId: PropTypes.string,
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      maximumNumberOfIssuesToDisplay: 26,
      expandIssues: false,
      totalWidth: null,
      totalRemainingWidth: null,
      issuesToRender: [],
      issuesToRenderLength: 0,
      issueRenderCount: 0,
    };
    this.issuesList = React.createRef();
    // This is meant to live outside of state.
    this.issueWidths = {};
  }

  componentDidMount () {
    // console.log('IssuesByBallotItemDisplayList componentDidMount, this.props.ballotItemWeVoteId:', this.props.ballotItemWeVoteId);
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesToRender = issuesUnderThisBallotItemVoterIsFollowing.concat(issuesUnderThisBallotItemVoterIsNotFollowing);
    const issuesToRenderLength = issuesToRender.length;
    const { ballotItemDisplayName, ballotItemWeVoteId, expandIssuesByDefault } = this.props;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      expandIssues: expandIssuesByDefault || false,
      issuesToRender,
      issuesToRenderLength,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('IssuesByBallotItemDisplayList componentWillReceiveProps, nextProps.ballotItemWeVoteId:', nextProps.ballotItemWeVoteId);
    const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesToRender = issuesUnderThisBallotItemVoterIsFollowing.concat(issuesUnderThisBallotItemVoterIsNotFollowing);
    const issuesToRenderLength = issuesToRender.length;
    const { ballotItemDisplayName, ballotItemWeVoteId } = nextProps;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      issuesToRender,
      issuesToRenderLength,
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
    if (this.state.issuesUnderThisBallotItemVoterIsFollowingLength !== nextState.issuesUnderThisBallotItemVoterIsFollowingLength) {
      // console.log('this.state.issuesUnderThisBallotItemVoterIsFollowingLength: ', this.state.issuesUnderThisBallotItemVoterIsFollowingLength, ', nextState.issuesUnderThisBallotItemVoterIsFollowingLength', nextState.issuesUnderThisBallotItemVoterIsFollowingLength);
      return true;
    }
    if (this.state.issuesUnderThisBallotItemVoterIsNotFollowingLength !== nextState.issuesUnderThisBallotItemVoterIsNotFollowingLength) {
      // console.log('this.state.issuesUnderThisBallotItemVoterIsNotFollowingLength: ', this.state.issuesUnderThisBallotItemVoterIsNotFollowingLength, ', nextState.issuesUnderThisBallotItemVoterIsNotFollowingLength', nextState.issuesUnderThisBallotItemVoterIsNotFollowingLength);
      return true;
    }
    if (this.state.totalWidth !== nextState.totalWidth) {
      return true;
    }
    if (this.state.totalRemainingWidth !== nextState.totalRemainingWidth) {
      return true;
    }
    if (this.state.issuesToRender !== nextState.issuesToRender) {
      return true;
    }
    if (this.state.issueRenderCount !== nextState.issueRenderCount) {
      return true;
    }
    return false;
  }

  componentDidUpdate () {
    // console.log('IssuesByBallotItemDisplayList componentDidUpdate');
    if (this.issuesList.current && this.state.totalWidth === null && this.state.totalRemainingWidth === null) {
      this.setState({
        totalWidth: this.issuesList.current.offsetWidth,
        totalRemainingWidth: this.issuesList.current.offsetWidth,
      });
    }
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('IssuesByBallotItemDisplayList, onIssueStoreChange');
      const { ballotItemWeVoteId, issueRenderCount } = this.state;
      const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(ballotItemWeVoteId) || [];
      const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(ballotItemWeVoteId) || [];
      const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
      const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
      const issuesToRender = issuesUnderThisBallotItemVoterIsFollowing.concat(issuesUnderThisBallotItemVoterIsNotFollowing);
      this.setState({
        issuesUnderThisBallotItemVoterIsFollowingLength,
        issuesUnderThisBallotItemVoterIsNotFollowingLength,
        issuesToRender,
      });
      if (issuesToRender.length > 0 && issueRenderCount === 0) {
        setTimeout(this.handleDelayedIssueRender, 50);
      }
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
    const { expandIssues, issuesToRenderLength } = this.state;
    this.setState({
      expandIssues: !expandIssues,
      issueRenderCount: issuesToRenderLength,
    });
  };

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

  handleSubtractTotalRemainingWidth = (issueWeVoteId, width) => {
    const { totalWidth } = this.state;
    this.issueWidths[issueWeVoteId] = width;
    // const totalWidthOccupied = Object.values(this.issueWidths).reduce((a, b) => a + b);  This is very elegant, but did not work in cordova
    let totalWidthOccupied = 0;
    Object.keys(this.issueWidths).map((key) => {  // eslint-disable-line array-callback-return
      totalWidthOccupied += this.issueWidths[key];
    });

    this.setState({ totalRemainingWidth: totalWidth - totalWidthOccupied });
  };

  handleDelayedIssueRender = () => {
    const { issueRenderCount, issuesToRenderLength, totalRemainingWidth } = this.state;
    // Get the remaining width with some allowed buffer room
    const bufferedRemainingWidth = totalRemainingWidth + 40;
    // Estimate the minimum possible remaining width after the next chip is rendered
    const minimumNextRemainingWidth = totalRemainingWidth - 60;
    // Increase/decrease the issues rendered count based on the buffered remaining width
    const change = bufferedRemainingWidth > 0 ? 1 : -1;
    const newIssueRenderCount = issueRenderCount + change;
    // If the rendered count < total issues to render, and
    // If the next issue render count is higher:
    //     Render if the minimum next remaining width is positive
    // If the next issue render count is lower:
    //     Render if the buffered remaining width is negative
    const shouldDoAnotherRender = (change > 0 ? minimumNextRemainingWidth > 0 : bufferedRemainingWidth < 0) && issueRenderCount < issuesToRenderLength;

    if (shouldDoAnotherRender) {
      this.setState({ issueRenderCount: newIssueRenderCount });
      if (change > 0) {
        setTimeout(this.handleDelayedIssueRender, 5);
      }
    }
  }

  render () {
    renderLog('IssuesByBallotItemDisplayList.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('IssuesByBallotItemDisplayList render');
    const { externalUniqueId } = this.props;
    const {
      ballotItemDisplayName, ballotItemWeVoteId, expandIssues,
      maximumNumberOfIssuesToDisplay,
      totalRemainingWidth, issuesToRender, issuesToRenderLength, issueRenderCount,
    } = this.state;

    // console.log('this.state.ballotItemWeVoteId: ', this.state.ballotItemWeVoteId);
    // console.log('issuesUnderThisBallotItemVoterIsFollowing: ', issuesUnderThisBallotItemVoterIsFollowing);
    // console.log('issuesUnderThisBallotItemVoterIsNotFollowing: ', issuesUnderThisBallotItemVoterIsNotFollowing);
    if (!issuesToRenderLength) {
      // If we don't have any endorsement text, show the alternate component passed in
      return this.props.children || null;
    }

    let issueFollowedByVoter = false;
    let localCounter = 0;
    const issuesChips = issuesToRender.slice(0, issueRenderCount).map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        // console.log('oneIssue.issue_name: ', oneIssue.issue_name);
        localCounter++;
        if (localCounter <= maximumNumberOfIssuesToDisplay) {
          issueFollowedByVoter = IssueStore.isVoterFollowingThisIssue(oneIssue.issue_we_vote_id);
          return (
            <ValueIconAndText
              key={oneIssue.issue_we_vote_id}
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={ballotItemWeVoteId}
              externalUniqueId={externalUniqueId}
              issueFollowedByVoter={issueFollowedByVoter}
              issueWidths={this.issueWidths}
              oneIssue={oneIssue}
              subtractTotalWidth={this.handleSubtractTotalRemainingWidth}
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
            <IssueList
              key={`issuesByBallotItemDisplayList-${ballotItemWeVoteId}`}
              expandIssues={expandIssues}
            >
              {issuesChips}
            </IssueList>
          </div>
        </Issues>
        {(expandIssues || this.props.disableMoreWrapper || totalRemainingWidth > 0) ? null : (
          <MoreWrapper onClick={this.handleExpandIssues}>
            <MoreHoriz
              id="issuesByBallotItemDisplayListMoreIssuesIcon"
            />
          </MoreWrapper>
        )
        }
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  overflow: show;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Issues = styled.div`
  width: 100%;
  margin-left: 0px;
`;

const IssueList = styled.ul`
  display: flex;
  flex-flow: row${({ expandIssues }) => (expandIssues ? ' wrap' : '')};
  margin-bottom: 8px;
  overflow: hidden;
  padding-inline-start: 0;
`;

const MoreWrapper = styled.p`
  align-items: center;
  background-image: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
  cursor: pointer;
  display: flex;
  display: inline;
  flex-flow: row;
  height: 30px;
  margin-top: -3px;
  margin-bottom: 8px;
  padding-left: 4px;
  position: absolute;
  right: 8px;
`;

export default IssuesByBallotItemDisplayList;

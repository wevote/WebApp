import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import ValueIconAndText from './ValueIconAndText';
import VoterGuideStore from '../../stores/VoterGuideStore';

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
    externalUniqueId: PropTypes.string,
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      issuesUnderThisBallotItemVoterIsFollowing: [],
      issuesUnderThisBallotItemVoterIsNotFollowing: [],
      issuesUnderThisBallotItemVoterIsFollowingLength: 0,
      issuesUnderThisBallotItemVoterIsNotFollowingLength: 0,
      maximumNumberOfIssuesToDisplay: 26,
      expand: false,
      totalWidth: null,
      totalRemainingWidth: null,
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
    const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    const { ballotItemDisplayName, ballotItemWeVoteId } = this.props;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      issuesUnderThisBallotItemVoterIsFollowing,
      issuesUnderThisBallotItemVoterIsNotFollowing,
      issuesUnderThisBallotItemVoterIsFollowingLength,
      issuesUnderThisBallotItemVoterIsNotFollowingLength,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('IssuesByBallotItemDisplayList componentWillReceiveProps, nextProps.ballotItemWeVoteId:', nextProps.ballotItemWeVoteId);
    const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    const { ballotItemDisplayName, ballotItemWeVoteId } = nextProps;
    this.setState({
      ballotItemDisplayName,
      ballotItemWeVoteId,
      issuesUnderThisBallotItemVoterIsFollowing,
      issuesUnderThisBallotItemVoterIsNotFollowing,
      issuesUnderThisBallotItemVoterIsFollowingLength,
      issuesUnderThisBallotItemVoterIsNotFollowingLength,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      // console.log('this.state.ballotItemWeVoteId: ', this.state.ballotItemWeVoteId, ', nextState.ballotItemWeVoteId', nextState.ballotItemWeVoteId);
      return true;
    }
    if (this.state.expand !== nextState.expand) {
      // console.log('this.state.expand: ', this.state.expand, ', nextState.expand', nextState.expand);
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
    const { ballotItemWeVoteId } = this.state;
    const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    this.setState({
      issuesUnderThisBallotItemVoterIsFollowing,
      issuesUnderThisBallotItemVoterIsNotFollowing,
      issuesUnderThisBallotItemVoterIsFollowingLength,
      issuesUnderThisBallotItemVoterIsNotFollowingLength,
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  handleEnterHoverLocalArea = () => {
    if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  };

  handleExpandIssues = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
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
    let totalWidthOccupied;
    Object.keys(this.issueWidths).map((key) => {  // eslint-disable-line array-callback-return
      totalWidthOccupied += this.issueWidths[key];
    });

    this.setState({ totalRemainingWidth: totalWidth - totalWidthOccupied });
  };

  render () {
    renderLog('IssuesByBallotItemDisplayList.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('IssuesByBallotItemDisplayList render');
    const { externalUniqueId } = this.props;
    const {
      ballotItemDisplayName, ballotItemWeVoteId, expand,
      issuesUnderThisBallotItemVoterIsFollowing, issuesUnderThisBallotItemVoterIsNotFollowing,
      issuesUnderThisBallotItemVoterIsFollowingLength, issuesUnderThisBallotItemVoterIsNotFollowingLength,
      maximumNumberOfIssuesToDisplay,
      totalRemainingWidth,
    } = this.state;

    // console.log('this.state.ballotItemWeVoteId: ', this.state.ballotItemWeVoteId);
    // console.log('issuesUnderThisBallotItemVoterIsFollowing: ', issuesUnderThisBallotItemVoterIsFollowing);
    // console.log('issuesUnderThisBallotItemVoterIsNotFollowing: ', issuesUnderThisBallotItemVoterIsNotFollowing);
    if (
      !issuesUnderThisBallotItemVoterIsFollowingLength &&
      !issuesUnderThisBallotItemVoterIsNotFollowingLength
    ) {
      // If we don't have any endorsement text, show the alternate component passed in
      return this.props.children || null;
    }

    let localCounter = 0;
    const issuesVoterIsFollowingHtml = issuesUnderThisBallotItemVoterIsFollowing.map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        // console.log('oneIssue.issue_name: ', oneIssue.issue_name);
        localCounter++;
        if (localCounter <= maximumNumberOfIssuesToDisplay) {
          return (
            <ValueIconAndText
              key={oneIssue.issue_we_vote_id}
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={ballotItemWeVoteId}
              externalUniqueId={externalUniqueId}
              issueFollowedByVoter
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
    localCounter = 0;
    const issuesVoterIsNotFollowingHtml = issuesUnderThisBallotItemVoterIsNotFollowing.map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        localCounter++;
        if (localCounter <= maximumNumberOfIssuesToDisplay) {
          return (
            <ValueIconAndText
              key={oneIssue.issue_we_vote_id}
              ballotItemDisplayName={ballotItemDisplayName}
              ballotItemWeVoteId={ballotItemWeVoteId}
              externalUniqueId={externalUniqueId}
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
            <IssueList key={`issuesByBallotItemDisplayList-${ballotItemWeVoteId}`} expand={expand}>
              {/* Issues the voter is already following */}
              {issuesVoterIsFollowingHtml}
              {/* Issues the voter is not following yet */}
              {issuesVoterIsNotFollowingHtml}
            </IssueList>
          </div>
        </Issues>
        {(expand || this.props.disableMoreWrapper || totalRemainingWidth > 0) ? null : (
          <MoreWrapper onClick={this.handleExpandIssues}>
            <MoreHorizIcon
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
  margin-left: -10px;
`;

const IssueList = styled.ul`
  display: flex;
  flex-flow: row${({ expand }) => (expand ? ' wrap' : '')};
  margin-bottom: 8px;
  overflow: hidden;
  padding-inline-start: 0;
`;

const MoreWrapper = styled.p`
  align-items: center;
  background-color: white;
  cursor: pointer;
  display: flex;
  display: inline;
  flex-flow: row;
  height: 25px;
  margin-top: -3px;
  margin-bottom: 8px;
  padding-left: 4px;
  position: absolute;
  right: -30px;
  width: 90px;
`;

export default IssuesByBallotItemDisplayList;

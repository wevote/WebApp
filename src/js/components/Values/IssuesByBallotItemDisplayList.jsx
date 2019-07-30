import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import styled from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import StickyPopover from '../Ballot/StickyPopover';
import VoterGuideStore from '../../stores/VoterGuideStore';

// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item
class IssuesByBallotItemDisplayList extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    children: PropTypes.object,
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
    disableMoreWrapper: PropTypes.bool,
  };

  static closePopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);
    this.state = {
      issuesUnderThisBallotItemVoterIsFollowing: [],
      issuesUnderThisBallotItemVoterIsNotFollowing: [],
      issuesUnderThisBallotItemVoterIsFollowingLength: 0,
      issuesUnderThisBallotItemVoterIsNotFollowingLength: 0,
      maximumNumberOfIssuesToDisplay: 26,
      expand: false,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      issuesUnderThisBallotItemVoterIsFollowing,
      issuesUnderThisBallotItemVoterIsNotFollowing,
      issuesUnderThisBallotItemVoterIsFollowingLength,
      issuesUnderThisBallotItemVoterIsNotFollowingLength,
    });
  }

  componentWillReceiveProps (nextProps) {
    const issuesUnderThisBallotItemVoterIsFollowing = IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsNotFollowing = IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId) || [];
    const issuesUnderThisBallotItemVoterIsFollowingLength = issuesUnderThisBallotItemVoterIsFollowing.length;
    const issuesUnderThisBallotItemVoterIsNotFollowingLength = issuesUnderThisBallotItemVoterIsNotFollowing.length;
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
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
    return false;
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

  generateValueListItem = (oneIssue) => {
    const valuePopover = (
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
        </PopoverDescriptionText>
      </PopoverWrapper>
    );
    // Tried to make the issues icons accessible via tabbing, caused too many side affects
    const valueIconAndText = (
      <ValueIconAndText
        id={`valueIconAndText-${oneIssue.issue_we_vote_id}`}
        key={`valueIconAndTextKey-${oneIssue.issue_we_vote_id}`}
        className="u-no-break u-cursor--pointer issue-icon-list__issue-block"
      >
        {oneIssue.issue_icon_local_path ? (
          <div className="issue-icon-list__issue-icon">
            <ReactSVG src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
                      svgStyle={{ fill: '#999', padding: '1px 1px 1px 0px' }}
            />
          </div>
        ) : null
        }
        <div className="u-margin-left--xxs issue-icon-list__issue-label-name">
          {oneIssue.issue_name}
        </div>
      </ValueIconAndText>
    );

    return (
      <StickyPopover
        delay={{ show: 1000000, hide: 100 }}
        popoverComponent={valuePopover}
        placement="auto"
        id="issues-popover-trigger-click-root-close"
        key={`issueByBallotItemPopover-${this.state.ballotItemWeVoteId}-${oneIssue.issue_we_vote_id}`}
        openOnClick
        showCloseIcon
      >
        {valueIconAndText}
        {/* <ValueIconAndTextListItem
          className="u-push--sm"
          key={`issue-icon-${oneIssue.issue_we_vote_id}`}
        /> */}
      </StickyPopover>
    );
  }

  handleEnterHoverLocalArea = () => {
    if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  }

  handleExpandIssues = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  }

  render () {
    // console.log('IssuesByBallotItemDisplayList, render');

    renderLog(__filename);
    const {
      ballotItemWeVoteId, expand,
      issuesUnderThisBallotItemVoterIsFollowing, issuesUnderThisBallotItemVoterIsNotFollowing,
      issuesUnderThisBallotItemVoterIsFollowingLength, issuesUnderThisBallotItemVoterIsNotFollowingLength,
      maximumNumberOfIssuesToDisplay,
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
          return this.generateValueListItem(oneIssue);
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
          return this.generateValueListItem(oneIssue);
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
          <IssueList key={`issuesByBallotItemDisplayList-${ballotItemWeVoteId}`} expand={expand}>
            {/* Issues the voter is already following */}
            {issuesVoterIsFollowingHtml}
            {/* Issues the voter is not following yet */}
            {issuesVoterIsNotFollowingHtml}
          </IssueList>
        </Issues>
        {(expand || this.props.disableMoreWrapper) ? null : (
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
  width: 90%;
  margin-left: -10px;
`;

const IssueList = styled.ul`
  display: flex;
  flex-flow: row${({ expand }) => (expand ? ' wrap' : '')};
  padding-inline-start: 0;
`;

const ValueIconAndText = styled.span`
  position: relative;
  width: fit-content;
  flex: none;
  padding: 4px;
`;

const MoreWrapper = styled.p`
  display: flex;
  flex-flow: row;
  display: inline;
  background-color: white;
  position: absolute;
  right: -30px;
  margin-top: -3px;
  width: 90px;
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 4px;
`;

const PopoverWrapper = styled.div`
  width: calc(100% + 24px);
  height: 100%;
  position: relative;
  right: 12px;
  bottom: 8px;
  border-radius: 3px;
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

// const ValueIconAndTextListItem = styled.li`
//   display: flex;
//   flex: 1 0 auto;
//   align-items: start;
// `;

export default IssuesByBallotItemDisplayList;

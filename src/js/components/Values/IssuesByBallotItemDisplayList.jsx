import React, { Component } from 'react';
// import { OverlayTrigger, Popover } from 'react-bootstrap';
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
  };

  static closePopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);
    this.state = {
      issuesUnderThisBallotItemVoterIsFollowing: [],
      issuesUnderThisBallotItemVoterIsNotFollowing: [],
      maximumNumberOfIssuesToDisplay: 26,
      expand: false,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(
      this.onVoterGuideStoreChange.bind(this),
    );
    this.onVoterGuideStoreChange();
    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      issuesUnderThisBallotItemVoterIsFollowing: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsNotFollowing: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId),
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      issuesUnderThisBallotItemVoterIsFollowing: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsNotFollowing: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId),
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    this.setState({
      issuesUnderThisBallotItemVoterIsFollowing: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsNotFollowing: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(ballotItemWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  handleExpandIssues = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
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
        openOnClick
        showCloseIcon
        popoverId="custom-popover-component"
      >
        {valueIconAndText}
        {/* <ValueIconAndTextListItem
          className="u-push--sm"
          key={`issue-icon-${oneIssue.issue_we_vote_id}`}
        /> */}
      </StickyPopover>
    );
  }

  render () {
    const handleEnterHoverLocalArea = () => {
      if (this.props.handleLeaveCandidateCard) {
        this.props.handleLeaveCandidateCard();
      }
    };

    const handleLeaveHoverLocalArea = () => {
      if (this.props.handleEnterCandidateCard) {
        this.props.handleEnterCandidateCard();
      }
    };

    renderLog(__filename);
    const { expand } = this.state;
    const issuesUnderThisBallotItemVoterIsFollowingFound =
      this.state.issuesUnderThisBallotItemVoterIsFollowing &&
      this.state.issuesUnderThisBallotItemVoterIsFollowing.length;
    const issuesUnderThisBallotItemVoterIsNotFollowingFound =
      this.state.issuesUnderThisBallotItemVoterIsNotFollowing &&
      this.state.issuesUnderThisBallotItemVoterIsNotFollowing.length;

    // console.log('this.state.ballotItemWeVoteId: ', this.state.ballotItemWeVoteId);
    // console.log('this.state.issuesUnderThisBallotItemVoterIsFollowing: ', this.state.issuesUnderThisBallotItemVoterIsFollowing);
    // console.log('this.state.issuesUnderThisBallotItemVoterIsNotFollowing: ', this.state.issuesUnderThisBallotItemVoterIsNotFollowing);
    if (
      !issuesUnderThisBallotItemVoterIsFollowingFound &&
      !issuesUnderThisBallotItemVoterIsNotFollowingFound
    ) {
      // If we don't have any endorsement text, show the alternate component passed in
      return this.props.children || null;
    }

    let localCounter = 0;
    const issuesVoterIsFollowingHtml = this.state.issuesUnderThisBallotItemVoterIsFollowing.map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        // console.log('oneIssue.issue_name: ', oneIssue.issue_name);
        localCounter++;
        if (localCounter <= this.state.maximumNumberOfIssuesToDisplay) {
          return this.generateValueListItem(oneIssue);
        } else {
          return null;
        }
      },
    );
    localCounter = 0;
    const issuesVoterIsNotFollowingHtml = this.state.issuesUnderThisBallotItemVoterIsNotFollowing.map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        localCounter++;
        if (localCounter <= this.state.maximumNumberOfIssuesToDisplay) {
          return this.generateValueListItem(oneIssue);
        } else {
          return null;
        }
      },
    );

    return (
      <Wrapper
        onBlur={handleLeaveHoverLocalArea}
        onFocus={handleEnterHoverLocalArea}
        onMouseOut={handleLeaveHoverLocalArea}
        onMouseOver={handleEnterHoverLocalArea}
      >
        <Issues>
          {/* Show a break-down of the current positions in your network */}
          <IssueList expand={expand}>
            {/* Issues the voter is already following */}
            {issuesVoterIsFollowingHtml}
            {/* Issues the voter is not following yet */}
            {issuesVoterIsNotFollowingHtml}
          </IssueList>
        </Issues>
        {expand ? null : (
          <MoreWrapper onClick={this.handleExpandIssues}>
            <MoreHorizIcon />
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
  justify-content: space-between;
`;

const Issues = styled.div`
  width: 70%
  padding: 8px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 78%;
    padding: 12px 0;
  }
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

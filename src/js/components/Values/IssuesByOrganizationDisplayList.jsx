import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueFollowToggleButton from './IssueFollowToggleButton';
import IssueStore from '../../stores/IssueStore';
import ReadMore from '../Widgets/ReadMore';
import { renderLog } from '../../utils/logging';
import StickyPopover from '../Ballot/StickyPopover';
import VoterGuideStore from '../../stores/VoterGuideStore';

// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item
class IssuesByOrganizationDisplayList extends Component {
  static closePopover () {
    document.body.click();
  }

  static propTypes = {
    organizationWeVoteId: PropTypes.string.isRequired,
    children: PropTypes.object,
    fullWidth: PropTypes.bool,
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      componentDidMount: false,
      issuesUnderThisOrganization: [],
      issuesUnderThisOrganizationLength: 0,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const issuesUnderThisOrganization = IssueStore.getIssuesLinkedToByOrganization(this.props.organizationWeVoteId) || [];
    const issuesUnderThisOrganizationLength = issuesUnderThisOrganization.length;
    this.setState({
      componentDidMount: true,
      organizationWeVoteId: this.props.organizationWeVoteId,
      issuesUnderThisOrganization,
      issuesUnderThisOrganizationLength,
    });
  }

  componentWillReceiveProps (nextProps) {
    const issuesUnderThisOrganization = IssueStore.getIssuesLinkedToByOrganization(nextProps.organizationWeVoteId) || [];
    const issuesUnderThisOrganizationLength = issuesUnderThisOrganization.length;
    this.setState({
      organizationWeVoteId: nextProps.organizationWeVoteId,
      issuesUnderThisOrganization,
      issuesUnderThisOrganizationLength,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount: ', this.state.componentDidMount, ', nextState.componentDidMount', nextState.componentDidMount);
      return true;
    }
    if (this.state.issuesUnderThisOrganizationLength !== nextState.issuesUnderThisOrganizationLength) {
      // console.log('this.state.issuesUnderThisOrganizationLength: ', this.state.issuesUnderThisOrganizationLength, ', nextState.issuesUnderThisOrganizationLength', nextState.issuesUnderThisOrganizationLength);
      return true;
    }
    if (this.state.issuesVoterIsFollowingLength !== nextState.issuesVoterIsFollowingLength) {
      // console.log('this.state.issuesVoterIsFollowingLength: ', this.state.issuesVoterIsFollowingLength, ', nextState.issuesVoterIsFollowingLength', nextState.issuesVoterIsFollowingLength);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const { organizationWeVoteId } = this.state;
    const issuesUnderThisOrganization = IssueStore.getIssuesLinkedToByOrganization(organizationWeVoteId) || [];
    const issuesUnderThisOrganizationLength = issuesUnderThisOrganization.length;
    const issuesVoterIsFollowing = IssueStore.getIssueWeVoteIdsVoterIsFollowing() || [];
    const issuesVoterIsFollowingLength = issuesVoterIsFollowing.length;
    this.setState({
      issuesUnderThisOrganization,
      issuesUnderThisOrganizationLength,
      issuesVoterIsFollowingLength,
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  generateValueListItem = (oneIssue) => {
    const issueFollowedByVoter = IssueStore.isVoterFollowingThisIssue(oneIssue.issue_we_vote_id);
    const valuePopover = (
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleIcon>
            <ReactSVG
              src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
              svgStyle={{ fill: '#fff', padding: '1px 1px 1px 0px' }}
            />
          </PopoverTitleIcon>
          <PopoverTitleText>
            {oneIssue.issue_name}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverDescriptionText>
          <ReadMore
            textToDisplay={oneIssue.issue_description}
            numberOfLines={2}
          />
          {oneIssue.issue_we_vote_id && (
            <FollowIssueToggleContainer>
              <IssueFollowToggleButton
                classNameOverride="pull-left"
                issueName={oneIssue.issue_name}
                issueWeVoteId={oneIssue.issue_we_vote_id}
                showFollowingButtonText
                lightModeOn
              />
            </FollowIssueToggleContainer>
          )}
        </PopoverDescriptionText>
      </PopoverWrapper>
    );

    // Tried to make the issues icons accessible via tabbing, caused too many side affects
    const svgFill = issueFollowedByVoter ? '#555' : '#999';
    const valueIconAndText = (
      <ValueIconAndTextOrganization
        id={`valueIconAndTextOrganization-${oneIssue.issue_we_vote_id}`}
        className="u-no-break u-cursor--pointer"
        issueFollowedByVoter={issueFollowedByVoter}
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
        <div className="u-margin-left--xxs issue-icon-list__issue-label-name">
          {oneIssue.issue_name}
        </div>
      </ValueIconAndTextOrganization>
    );

    return (
      <StickyPopover
        delay={{ show: 10000000, hide: 100 }} // Long show delay so popover is only triggered on click
        popoverComponent={valuePopover}
        placement="auto"
        id="issues-popover-trigger-click-root-close"
        key={`issueByOrganizationPopover-${this.state.organizationWeVoteId}-${oneIssue.issue_we_vote_id}`}
        openOnClick
        showCloseIcon
      >
        {valueIconAndText}
      </StickyPopover>
    );
  }

  handleEnterHoverLocalArea = () => {
    if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  };

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

  render () {
    renderLog('IssuesByOrganizationDisplayList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      issuesUnderThisOrganization, issuesUnderThisOrganizationLength, organizationWeVoteId,
    } = this.state;

    if (!organizationWeVoteId) {
      return null;
    }

    // console.log('this.state.organizationWeVoteId: ', this.state.organizationWeVoteId);
    // console.log('this.state.issuesUnderThisOrganization: ', this.state.issuesUnderThisOrganization);
    if (!issuesUnderThisOrganizationLength) {
      // If we don't have any endorsement text, show the alternate component passed in
      return this.props.children || null;
    }

    const issuesUnderThisOrganizationHtml = issuesUnderThisOrganization.map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        return this.generateValueListItem(oneIssue);
      },
    );

    return (
      <Wrapper
        onBlur={this.handleLeaveHoverLocalArea}
        onFocus={this.handleEnterHoverLocalArea}
        onMouseOut={this.handleLeaveHoverLocalArea}
        onMouseOver={this.handleEnterHoverLocalArea}
      >
        <IssuesByOrganization fullWidth={!!this.props.fullWidth}>
          <IssueByOrganizationList>
            {issuesUnderThisOrganizationHtml}
          </IssueByOrganizationList>
        </IssuesByOrganization>
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

const FollowIssueToggleContainer = styled.div`
  margin: 10px 0;
`;

const IssuesByOrganization = styled.div`
  width: ${props => (props.fullWidth ? '100%' : '85%')};
  padding: 6px 0 0 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: ${props => (props.fullWidth ? '100%' : '90%')};
  }
`;

const IssueByOrganizationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-inline-start: 0;
  justify-content: flex-start;
  width: 100%;
`;

const ValueIconAndTextOrganization = styled.span`
  align-items: start;
  display: flex;
  flex: none;
  ${({ issueFollowedByVoter }) => (issueFollowedByVoter ? 'font-weight: 800;' : '')}
  padding: 2px 4px 2px 0;
  position: relative;
  width: fit-content;
`;

const PopoverWrapper = styled.div`
  width: calc(100%);
  height: 100%;
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

export default IssuesByOrganizationDisplayList;

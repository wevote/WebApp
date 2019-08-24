import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import StickyPopover from '../Ballot/StickyPopover';

// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item
class IssuesByOrganizationDisplayList extends Component {
  static propTypes = {
    organizationWeVoteId: PropTypes.string.isRequired,
    children: PropTypes.object,
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
    fullWidth: PropTypes.bool,
  };

  static closePopover () {
    document.body.click();
  }

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
    this.setState({
      issuesUnderThisOrganization,
      issuesUnderThisOrganizationLength,
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
      <ValueIconAndTextOrganization
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
  };

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

  render () {
    renderLog(__filename);
    const {
      issuesUnderThisOrganization, issuesUnderThisOrganizationLength, organizationWeVoteId,
    } = this.state;

    if (!organizationWeVoteId) {
      return null;
    }

    // console.log('IssuesByOrganizationDisplayList render');

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

const IssuesByOrganization = styled.div`
  width: ${props => (props.fullWidth ? '100%' : '85%')};
  padding: 8px 0;
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
  position: relative;
  width: fit-content;
  flex: none;
  padding: 2px 4px 2px 0;
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

export default IssuesByOrganizationDisplayList;

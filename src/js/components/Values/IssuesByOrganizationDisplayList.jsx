import React, { Component } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';

// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item
class IssuesByOrganizationDisplayList extends Component {
  static propTypes = {
    organizationWeVoteId: PropTypes.string.isRequired,
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
      issuesUnderThisOrganization: [],
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(
      this.onVoterGuideStoreChange.bind(this),
    );
    this.onVoterGuideStoreChange();
    this.setState({
      organizationWeVoteId: this.props.organizationWeVoteId,
      issuesUnderThisOrganization: IssueStore.getIssuesLinkedToByOrganization(this.props.organizationWeVoteId),
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      organizationWeVoteId: nextProps.organizationWeVoteId,
      issuesUnderThisOrganization: IssueStore.getIssuesLinkedToByOrganization(nextProps.organizationWeVoteId),
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({
      issuesUnderThisOrganization: IssueStore.getIssuesLinkedToByOrganization(organizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  generateValueListItem = (oneIssue) => {
    const valuePopover = (
      <Popover
        id="positions-popover-trigger-click-root-close"
        title={(
          <PopoverTitle className="u-f4 u-no-break">
            <PopoverTitleIcon>
              <ReactSVG src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
                        svgStyle={{ fill: '#fff', padding: '1px 1px 1px 0px' }}
              />
            </PopoverTitleIcon>
            <PopoverTitleText>
              {oneIssue.issue_name}
            </PopoverTitleText>
            <span className="fas fa-times pull-right u-cursor--pointer" aria-hidden="true" />
          </PopoverTitle>
        )}
        onClick={IssuesByOrganizationDisplayList.closePopover}
      >
        {oneIssue.issue_description}
      </Popover>
    );
    // Tried to make the issues icons accessible via tabbing, caused too many side affects
    const valueIconAndText = (
      <ValueIconAndText
        id={`valueIconAndText-${oneIssue.issue_we_vote_id}`}
        className="u-no-break u-cursor--pointer issue-icon-list__issue-block"
      >
        {oneIssue.issue_icon_local_path ? (
          <span className="issue-icon-list__issue-icon">
            <ReactSVG src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
                      svgStyle={{ fill: '#999', padding: '1px 1px 1px 0px' }}
            />
          </span>
        ) : null
        }
        <div className="u-margin-left--xxs issue-icon-list__issue-label-name">
          {oneIssue.issue_name}
        </div>
      </ValueIconAndText>
    );

    return (
      <ValueIconAndTextListItem
        className="u-push--sm"
        key={`issue-icon-${oneIssue.issue_we_vote_id}`}
      >
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="bottom"
          overlay={valuePopover}
          id={`overlayTrigger-${oneIssue.issue_we_vote_id}`}
        >
          {valueIconAndText}
        </OverlayTrigger>
      </ValueIconAndTextListItem>
    );
  }

  render () {
    // console.log('IssuesByOrganizationDisplayList render');
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
    const issuesUnderThisOrganizationFound = this.state.issuesUnderThisOrganization && this.state.issuesUnderThisOrganization.length;

    // console.log('this.state.organizationWeVoteId: ', this.state.organizationWeVoteId);
    // console.log('this.state.issuesUnderThisOrganization: ', this.state.issuesUnderThisOrganization);
    if ( !issuesUnderThisOrganizationFound ) {
      // If we don't have any endorsement text, show the alternate component passed in
      return this.props.children || null;
    }

    const issuesUnderThisOrganizationHtml = this.state.issuesUnderThisOrganization.map(
      (oneIssue) => {
        if (!oneIssue) {
          return null;
        }
        return this.generateValueListItem(oneIssue);
      },
    );

    return (
      <Wrapper
        onBlur={handleLeaveHoverLocalArea}
        onFocus={handleEnterHoverLocalArea}
        onMouseOut={handleLeaveHoverLocalArea}
        onMouseOver={handleEnterHoverLocalArea}
      >
        <IssuesByOrganization>
          <IssueByOrganizationList>
            {issuesUnderThisOrganizationHtml}
          </IssueByOrganizationList>
        </IssuesByOrganization>
      </Wrapper>
    );
  }
}

const IssuesByOrganization = styled.div`
  display: flex;
  flex-flow: row;
  max-width: 80%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 88%;
  }
`;

const IssueByOrganizationList = styled.ul`
  display: flex;
  flex-flow: row wrap;
  padding-inline-start: 0;
`;

const Wrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
`;

const PopoverTitle = styled.span`
  display: flex;
  flex: 1 0 auto;
  align-items: start;
`;

const PopoverTitleIcon = styled.span`
  flex: none;
`;

const PopoverTitleText = styled.div`
`;

const ValueIconAndTextListItem = styled.li`
  display: flex;
  flex: 1 0 auto;
  align-items: start;
`;

const ValueIconAndText = styled.span`
`;

export default IssuesByOrganizationDisplayList;

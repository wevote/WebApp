import { Chip } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import SvgImage from '../../common/components/Widgets/SvgImage';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import IssueStore from '../../stores/IssueStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import StickyPopover from '../Ballot/StickyPopover';
import IssueFollowToggleButton from './IssueFollowToggleButton';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

// Show a voter a horizontal list of all the issues they are following that relate to this ballot item
class IssuesByOrganizationDisplayList extends Component {
  static closePopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);
    this.state = {
      componentDidMount: false,
      issuesUnderThisOrganization: [],
      issuesUnderThisOrganizationLength: 0,
      issuesVoterIsFollowingLength: 0,
      voterGuideDisplayName: '',
      organizationWeVoteId: '',
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const { organizationWeVoteId } = this.props;
    const issuesUnderThisOrganization = IssueStore.getIssuesLinkedToByOrganization(organizationWeVoteId) || [];
    const issuesUnderThisOrganizationLength = issuesUnderThisOrganization.length;
    const voterGuide = VoterGuideStore.getVoterGuideForOrganizationId(organizationWeVoteId);
    this.setState({
      componentDidMount: true,
      organizationWeVoteId: this.props.organizationWeVoteId,
      issuesUnderThisOrganization,
      issuesUnderThisOrganizationLength,
      voterGuideDisplayName: voterGuide.voter_guide_display_name,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const issuesUnderThisOrganization = IssueStore.getIssuesLinkedToByOrganization(nextProps.organizationWeVoteId) || [];
    const issuesUnderThisOrganizationLength = issuesUnderThisOrganization.length;
    const { organizationWeVoteId } = nextProps;
    const voterGuide = VoterGuideStore.getVoterGuideForOrganizationId(organizationWeVoteId);
    this.setState({
      organizationWeVoteId: nextProps.organizationWeVoteId,
      issuesUnderThisOrganization,
      issuesUnderThisOrganizationLength,
      voterGuideDisplayName: voterGuide.voter_guide_display_name,
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
    if (this.state.voterGuideDisplayName !== nextState.voterGuideDisplayName) {
      // console.log('this.state.voterGuideDisplayName: ', this.state.voterGuideDisplayName, ', nextState.voterGuideDisplayName', nextState.voterGuideDisplayName);
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
    const { organizationWeVoteId } = this.props;
    const voterGuide = VoterGuideStore.getVoterGuideForOrganizationId(organizationWeVoteId);
    this.setState({
      voterGuideDisplayName: voterGuide.voter_guide_display_name,
    });
  }

  generateValueListItem = (oneIssue) => {
    const { classes } = this.props;
    const { voterGuideDisplayName } = this.state;
    const issueFollowedByVoter = IssueStore.isVoterFollowingThisIssue(oneIssue.issue_we_vote_id);
    const valuePopover = (
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleIcon>
            <SvgImage imageName={oneIssue.issue_icon_local_path} stylesTextIncoming="fill: #fff !important; width: 24px;" />
          </PopoverTitleIcon>
          <PopoverTitleText>
            {oneIssue.issue_name}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverDescriptionText>
          {voterGuideDisplayName && (
            <>
              <OrganizationAdvocatesText>
                <strong>
                  {voterGuideDisplayName}
                </strong>
                {' '}
                focuses on advocating for
                {' '}
                <strong>
                  {oneIssue.issue_name}
                </strong>
                :
              </OrganizationAdvocatesText>
            </>
          )}
          <Suspense fallback={<></>}>
            <ReadMore
              textToDisplay={`"${oneIssue.issue_description}"`}
              numberOfLines={4}
            />
          </Suspense>
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
          <FollowIfYouCare>
            Follow if you care about
            {' '}
            {oneIssue.issue_name}
            .
          </FollowIfYouCare>
        </PopoverDescriptionText>
      </PopoverWrapper>
    );

    // Tried to make the issues icons accessible via tabbing, caused too many side affects
    const svgFill = issueFollowedByVoter ? '#555' : '#999';
    const svg = oneIssue.issue_icon_local_path ? oneIssue.issue_icon_local_path : normalizedImagePath('../.../../img/global/svg-icons/issues/two-leaves.svg');
    // console.log('-----------------', oneIssue.issue_icon_local_path);
    const valueIconAndText = (
      <ValueIconAndTextOrganization
        id={`valueIconAndTextOrganization-${oneIssue.issue_we_vote_id}`}
        className="u-no-break u-cursor--pointer"
        issueFollowedByVoter={issueFollowedByVoter}
      >
        <Chip
          avatar={<SvgImage imageName={svg} stylesTextIncoming={`fill: ${svgFill} !important; margin-left: 4px; width: 24px;`} />}
          classes={{ root: classes.chipStyle, label: classes.chipLabelStyle }}
          label={oneIssue.issue_name}
          ref={this.valueSpan}
        />
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
      <IssuesByOrganizationDisplayListOuterWrapper
        onBlur={this.handleLeaveHoverLocalArea}
        onFocus={this.handleEnterHoverLocalArea}
        onMouseOut={this.handleLeaveHoverLocalArea}
        onMouseOver={this.handleEnterHoverLocalArea}
      >
        <IssuesByOrganizationDisplayListInnerWrapper fullWidth={!!this.props.fullWidth}>
          <IssueByOrganizationList>
            {issuesUnderThisOrganizationHtml}
          </IssueByOrganizationList>
        </IssuesByOrganizationDisplayListInnerWrapper>
      </IssuesByOrganizationDisplayListOuterWrapper>
    );
  }
}
IssuesByOrganizationDisplayList.propTypes = {
  organizationWeVoteId: PropTypes.string.isRequired,
  children: PropTypes.object,
  fullWidth: PropTypes.bool,
  handleLeaveCandidateCard: PropTypes.func,
  handleEnterCandidateCard: PropTypes.func,
  classes: PropTypes.object,
};

const styles = () => ({
  chipLabelStyle: {
    paddingLeft: 5,
    paddingRight: 8,
  },
  chipStyle: {
    backgroundColor: '#dbdbdb',
    border: '1px solid #ccc',
    color: '#555',
    cursor: 'pointer',
    fontSize: '.7rem',
    height: 'auto',
    '&:hover': {
      backgroundColor: '#e8e8e8',
    },
  },
});

const FollowIfYouCare = styled('div')`
  color: #999;
  font-size: .75rem;
  margin-top: 6px;
`;

const FollowIssueToggleContainer = styled('div')`
  margin-top: 20px;
`;

const IssuesByOrganizationDisplayListInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['fullWidth'].includes(prop),
})(({ fullWidth, theme }) => (`
  width: ${fullWidth ? '100%' : '85%'};
  padding: 6px 0 0 0;
  ${theme.breakpoints.down('md')} {
    width: ${fullWidth ? '100%' : '90%'};
  }
`));

const IssuesByOrganizationDisplayListOuterWrapper = styled('div')`
  overflow: visible;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
`;

const IssueByOrganizationList = styled('ul')`
  display: flex;
  flex-wrap: wrap;
  padding-inline-start: 0;
  justify-content: flex-start;
  width: 100%;
`;

const OrganizationAdvocatesText = styled('div')`
  padding-bottom: 8px;
`;

const ValueIconAndTextOrganization = styled('span', {
  shouldForwardProp: (prop) => !['issueFollowedByVoter'].includes(prop),
})(({ issueFollowedByVoter }) => (`
  align-items: start;
  display: flex;
  flex: none;
  ${issueFollowedByVoter ? 'font-weight: 600;' : ''}
  padding: 2px 4px 2px 0;
  position: relative;
  width: fit-content;
`));

const PopoverWrapper = styled('div')`
  width: calc(100%);
  height: 100%;
  border-radius: 3px;
`;

const PopoverHeader = styled('div')(({ theme }) => (`
  background: ${theme.colors.brandBlue};
  padding: 4px 8px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`));

const PopoverTitleIcon = styled('span')`
  font-weight: bold;
  font-size: 16px;
`;

const PopoverTitleText = styled('div')`
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
`;

const PopoverDescriptionText = styled('div')`
  padding: 8px;
`;

export default withTheme(withStyles(styles)(IssuesByOrganizationDisplayList));

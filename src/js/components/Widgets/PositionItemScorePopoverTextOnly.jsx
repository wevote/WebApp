import { withStyles, withTheme } from '@material-ui/core/styles';
import { CheckCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import { isOrganizationInVotersNetwork } from '../../utils/positionFunctions';

const { ReactSVG } = React.lazy(() => import('react-svg'));
const FriendsIcon = React.lazy(() => import('./FriendsIcon'));

class PositionItemScorePopoverTextOnly extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesInCommonBetweenOrganizationAndVoter: [],
      issuesInCommonBetweenOrganizationAndVoterLength: 0,
      organizationInVotersNetwork: false,
      organizationOpposes: false,
      organizationSupports: false,
      organizationWeVoteId: '',
      speakerDisplayName: '',
      voterFollowingThisOrganization: false,
      voterIsFriendsWithThisOrganization: false,
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    const { positionItem } = this.props;
    if (positionItem) {
      const {
        is_information_only: organizationProvidingInformationOnly,
        is_oppose_or_negative_rating: organizationOpposes,
        is_support_or_positive_rating: organizationSupports,
        speaker_display_name: speakerDisplayName,
        speaker_we_vote_id: organizationWeVoteId,
      } = positionItem;

      const issuesInCommonBetweenOrganizationAndVoter = IssueStore.getIssuesInCommonBetweenOrganizationAndVoter(organizationWeVoteId) || [];
      const issuesInCommonBetweenOrganizationAndVoterLength = issuesInCommonBetweenOrganizationAndVoter.length;
      const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
      const voterFollowingThisOrganization = OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId);
      const voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
      this.setState({
        issuesInCommonBetweenOrganizationAndVoter,
        issuesInCommonBetweenOrganizationAndVoterLength,
        organizationInVotersNetwork,
        organizationProvidingInformationOnly,
        organizationOpposes,
        organizationSupports,
        organizationWeVoteId,
        speakerDisplayName,
        voterFollowingThisOrganization,
        voterIsFriendsWithThisOrganization,
      });
    }
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps, nextProps: ', nextProps);
    const { positionItem } = nextProps;
    if (positionItem) {
      const {
        is_oppose_or_negative_rating: organizationOpposes,
        is_support_or_positive_rating: organizationSupports,
        speaker_display_name: speakerDisplayName,
        speaker_we_vote_id: organizationWeVoteId,
      } = positionItem;

      const issuesInCommonBetweenOrganizationAndVoter = IssueStore.getIssuesInCommonBetweenOrganizationAndVoter(organizationWeVoteId) || [];
      const issuesInCommonBetweenOrganizationAndVoterLength = issuesInCommonBetweenOrganizationAndVoter.length;
      const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
      const voterFollowingThisOrganization = OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId);
      const voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
      this.setState({
        issuesInCommonBetweenOrganizationAndVoter,
        issuesInCommonBetweenOrganizationAndVoterLength,
        organizationInVotersNetwork,
        organizationOpposes,
        organizationSupports,
        organizationWeVoteId,
        speakerDisplayName,
        voterFollowingThisOrganization,
        voterIsFriendsWithThisOrganization,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if not needed
    if (this.state.issuesInCommonBetweenOrganizationAndVoterLength !== nextState.issuesInCommonBetweenOrganizationAndVoterLength) {
      // console.log('this.state.issuesInCommonBetweenOrganizationAndVoterLength: ', this.state.issuesInCommonBetweenOrganizationAndVoterLength, ', nextState.issuesInCommonBetweenOrganizationAndVoterLength', nextState.issuesInCommonBetweenOrganizationAndVoterLength);
      return true;
    }
    if (this.state.organizationInVotersNetwork !== nextState.organizationInVotersNetwork) {
      // console.log('this.state.organizationInVotersNetwork: ', this.state.organizationInVotersNetwork, ', nextState.organizationInVotersNetwork', nextState.organizationInVotersNetwork);
      return true;
    }
    if (this.state.organizationOpposes !== nextState.organizationOpposes) {
      // console.log('this.state.organizationOpposes: ', this.state.organizationOpposes, ', nextState.organizationOpposes', nextState.organizationOpposes);
      return true;
    }
    if (this.state.organizationSupports !== nextState.organizationSupports) {
      // console.log('this.state.organizationSupports: ', this.state.organizationSupports, ', nextState.organizationSupports', nextState.organizationSupports);
      return true;
    }
    if (this.state.speakerDisplayName !== nextState.speakerDisplayName) {
      // console.log('this.state.speakerDisplayName: ', this.state.speakerDisplayName, ', nextState.speakerDisplayName', nextState.speakerDisplayName);
      return true;
    }
    if (this.state.voterFollowingThisOrganization !== nextState.voterFollowingThisOrganization) {
      // console.log('this.state.voterFollowingThisOrganization: ', this.state.voterFollowingThisOrganization, ', nextState.voterFollowingThisOrganization', nextState.voterFollowingThisOrganization);
      return true;
    }
    if (this.state.voterIsFriendsWithThisOrganization !== nextState.voterIsFriendsWithThisOrganization) {
      // console.log('this.state.voterIsFriendsWithThisOrganization: ', this.state.voterIsFriendsWithThisOrganization, ', nextState.voterIsFriendsWithThisOrganization', nextState.voterIsFriendsWithThisOrganization);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  onFriendStoreChange () {
    const { organizationWeVoteId } = this.state;
    const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
    const voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
    this.setState({
      organizationInVotersNetwork,
      voterIsFriendsWithThisOrganization,
    });
  }

  onIssueStoreChange () {
    const { organizationWeVoteId } = this.state;
    const issuesInCommonBetweenOrganizationAndVoter = IssueStore.getIssuesInCommonBetweenOrganizationAndVoter(organizationWeVoteId) || [];
    const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
    this.setState({
      issuesInCommonBetweenOrganizationAndVoter,
      organizationInVotersNetwork,
    });
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    const issuesInCommonBetweenOrganizationAndVoter = IssueStore.getIssuesInCommonBetweenOrganizationAndVoter(organizationWeVoteId) || [];
    const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
    const voterFollowingThisOrganization = OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId);
    this.setState({
      issuesInCommonBetweenOrganizationAndVoter,
      organizationInVotersNetwork,
      voterFollowingThisOrganization,
    });
  }

  render () {
    const { positionItem } = this.props;
    // console.log('PositionItemScorePopoverTextOnly render, positionItem:', positionItem);
    if (!positionItem) {
      return null;
    }
    const {
      issuesInCommonBetweenOrganizationAndVoter, organizationInVotersNetwork,
      organizationProvidingInformationOnly, organizationOpposes, organizationSupports,
      speakerDisplayName, voterFollowingThisOrganization, voterIsFriendsWithThisOrganization,
    } = this.state;
    return (
      <PopoverDescriptionText>
        {organizationInVotersNetwork ? (
          <>
            <OrganizationAddsToYourPersonalScoreExplanation>
              {speakerDisplayName}
              &apos;s
              {' '}
              opinion
              {' '}
              {organizationSupports && (
                <span>
                  adds +1 to your personalized score because:
                </span>
              )}
              {organizationOpposes && (
                <span>
                  subtracts -1 from your personalized score because:
                </span>
              )}
            </OrganizationAddsToYourPersonalScoreExplanation>
            {voterIsFriendsWithThisOrganization ? (
              <ScoreExplanationWrapper>
                {/* <CheckCircle className="friends-icon" /> */}
                <FriendsIcon />
                <ScoreExplanationText>
                  {speakerDisplayName}
                  {' '}
                  is your friend
                </ScoreExplanationText>
              </ScoreExplanationWrapper>
            ) : (
              <>
                {voterFollowingThisOrganization && (
                  <ScoreExplanationWrapper>
                    <CheckCircle className="following-icon" />
                    <ScoreExplanationText>
                      You follow
                      {' '}
                      {speakerDisplayName}
                    </ScoreExplanationText>
                  </ScoreExplanationWrapper>
                )}
              </>
            )}
            {issuesInCommonBetweenOrganizationAndVoter.map((issue) => (
              <ScoreExplanationWrapper key={`issueInScore-${issue.issue_we_vote_id}`}>
                <PopoverTitleIcon>
                  <ReactSVG
                    src={cordovaDot(`/img/global/svg-icons/issues/${issue.issue_icon_local_path}.svg`)}
                    beforeInjection={(svg) => svg.setAttribute('style', { fill: '#555', padding: '1px 1px 1px 0px' })}
                  />
                </PopoverTitleIcon>
                <ScoreExplanationText>
                  You both care about
                  {' '}
                  {issue.issue_name}
                </ScoreExplanationText>
              </ScoreExplanationWrapper>
            ))}
          </>
        ) : (
          <>
            <FollowOrganizationText>
              Follow
              {' '}
              <strong>
                {speakerDisplayName}
              </strong>
              {' '}
              {organizationSupports && (
                <span>
                  to add +1 to your personalized score.
                </span>
              )}
              {organizationOpposes && (
                <span>
                  to subtract -1 from your personalized score.
                </span>
              )}
              {organizationProvidingInformationOnly && (
                <span>
                  to see more of their opinions.
                </span>
              )}
            </FollowOrganizationText>
          </>
        )}
      </PopoverDescriptionText>
    );
  }
}
PositionItemScorePopoverTextOnly.propTypes = {
  positionItem: PropTypes.object.isRequired,
};

const styles = () => ({
  endorsementIcon: {
    width: 12,
    height: 12,
  },
});

const FollowOrganizationText = styled.div`
  margin-top: 10px;
`;

const OrganizationAddsToYourPersonalScoreExplanation = styled.div`
  // margin-top: 4px;
`;

const PopoverTitleIcon = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const PopoverDescriptionText = styled.div`
  font-size: 14px;
  padding: 8px;
`;

const ScoreExplanationWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  margin-top: 6px;
`;

const ScoreExplanationText = styled.div`
  margin-left: 4px;
`;

export default withTheme(withStyles(styles)(PositionItemScorePopoverTextOnly));

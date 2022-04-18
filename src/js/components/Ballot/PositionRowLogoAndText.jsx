import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';
import stringContains from '../../common/utils/stringContains';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import { isOrganizationInVotersNetwork } from '../../utils/positionFunctions';
import SvgImage from '../../common/components/Widgets/SvgImage';

const FollowToggleCheckPlus = React.lazy(() => import(/* webpackChunkName: 'FollowToggleCheckPlus' */ '../Widgets/FollowToggleCheckPlus'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));


class PositionRowLogoAndText extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationInVotersNetwork: false,
    };
  }

  componentDidMount () {
    // const { position } = this.props;
    // const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;
    // console.log('PositionRowLogoAndText componentDidMount, position:', position);
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onFriendStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onIssueStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationStoreChange () {
    // We want to re-render so issue data can update
    this.onOrganizationInVotersNetworkChange();
  }

  onOrganizationInVotersNetworkChange () {
    const { position } = this.props;
    if (position) {
      const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;
      const organizationInVotersNetwork = isOrganizationInVotersNetwork(organizationWeVoteId);
      const updatedPosition = OrganizationStore.getPositionByPositionWeVoteId(position.position_we_vote_id);

      this.setState({
        organizationInVotersNetwork,
        updatedPosition,
      });
    }
  }

  onVoterGuideStoreChange () {
    // const { position } = this.props;
    // const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;

    // // We want to make sure we have all the position information so that comments show up
    // if (ballotItemWeVoteId) {
    //   const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);
    //
    //   if (voterGuidesForThisBallotItem) {
    //     voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
    //       // console.log('oneVoterGuide: ', oneVoterGuide);
    //       if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
    //         if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
    //           OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
    //         }
    //       }
    //     });
    //   }
    // }
  }

  onClickShowPositionDrawer (candidateWeVoteId, organizationWeVoteId) {
    // AppObservableStore.setOrganizationModalBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setPositionDrawerBallotItemWeVoteId(candidateWeVoteId);
    AppObservableStore.setPositionDrawerOrganizationWeVoteId(organizationWeVoteId);
    // AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setShowPositionDrawer(true);
  }

  render () {
    renderLog('PositionRowLogoAndText');  // Set LOG_RENDER_EVENTS to log all renders
    let position;
    ({ position } = this.props);
    const { updatedPosition } = this.state;
    if (updatedPosition && updatedPosition.speaker_we_vote_id) {
      position = updatedPosition;
    }
    if (!position || !position.speaker_we_vote_id) {
      return null;
    }
    // console.log('PositionRowLogoAndText position render, position:', position);
    const { ballot_item_we_vote_id: ballotItemWeVoteId, position_we_vote_id: positionWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;
    const { organizationInVotersNetwork } = this.state;

    // console.log(position);
    let supportOpposeInfo = 'InfoButNotPartOfScore';
    if (position.is_information_only) {
      supportOpposeInfo = 'InfoButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportAndPartOfScore';
    } else if (!organizationInVotersNetwork && position.is_support) {
      supportOpposeInfo = 'SupportButNotPartOfScore';
    } else if (organizationInVotersNetwork && position.is_oppose) {
      supportOpposeInfo = 'OpposeAndPartOfScore';
    } else if (!position.is_support) {
      supportOpposeInfo = 'OpposeButNotPartOfScore';
    }

    // console.log('PositionRowLogoAndText supportOpposeInfo: ', supportOpposeInfo);

    let imagePlaceholder;
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      const organizationIcon = normalizedImagePath('../../img/global/svg-icons/organization-icon.svg');
      imagePlaceholder = (
        <SvgImage imageName={organizationIcon} />
      );
    } else {
      const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
      imagePlaceholder = (
        <SvgImage imageName={avatar} />
      );
    }

    const showPosition = true;
    const nothingToDisplay = null;
    let speakerDisplayName = position.speaker_display_name;
    const voterLinkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    if (voterLinkedOrganizationWeVoteId === position.speaker_we_vote_id) {
      speakerDisplayName = 'You';
    } else if (stringContains('Voter-', speakerDisplayName)) {
      speakerDisplayName = '';
    } else {
      speakerDisplayName = shortenText(speakerDisplayName, 18);
    }

    if (showPosition) {
      return (
        <Wrapper>
          <OrganizationScoreSpacer />
          <OrganizationPhotoOuterWrapper
            onClick={() => this.onClickShowPositionDrawer(ballotItemWeVoteId, organizationWeVoteId)}
          >
            <OrganizationPhotoInnerWrapper>
              { position.speaker_image_url_https_medium ? (
                <Suspense fallback={<></>}>
                  <ImageHandler
                    className="card-child__avatar"
                    sizeClassName="icon-lg"
                    imageUrl={position.speaker_image_url_https_medium}
                  />
                </Suspense>
              ) :
                imagePlaceholder }
            </OrganizationPhotoInnerWrapper>
          </OrganizationPhotoOuterWrapper>
          <OrganizationNameWrapper
            onClick={() => this.onClickShowPositionDrawer(ballotItemWeVoteId, organizationWeVoteId)}
          >
            <OrganizationName>
              { speakerDisplayName }
            </OrganizationName>
          </OrganizationNameWrapper>
          <HorizontalSpacer />
          <YesNoScoreTextWrapper>
            {supportOpposeInfo === 'InfoButNotPartOfScore' ? (
              <OrganizationInformationOnlyWrapper>
                <OrganizationInformationOnlySquare>
                  <OrganizationInfoOnlyWordWrapper>
                    &nbsp;
                  </OrganizationInfoOnlyWordWrapper>
                </OrganizationInformationOnlySquare>
              </OrganizationInformationOnlyWrapper>
            ) : (
              <FollowToggleWrapper>
                <Suspense fallback={<></>}>
                  <FollowToggleCheckPlus
                    organizationWeVoteId={organizationWeVoteId}
                    positionWeVoteId={positionWeVoteId}
                  />
                </Suspense>
              </FollowToggleWrapper>
            )}
          </YesNoScoreTextWrapper>
        </Wrapper>
      );
    } else {
      return nothingToDisplay;
    }
  }
}
PositionRowLogoAndText.propTypes = {
  position: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
});

const FollowToggleWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const HorizontalSpacer = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
`;

const OrganizationInfoOnlyWordWrapper = styled('div')`
`;

const OrganizationInformationOnlySquare = styled('div')(({ theme }) => (`
  align-items: flex-start;
  background: white;
  color: ${theme.colors.grayMid};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
`));

const OrganizationInformationOnlyWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationName = styled('div')`
  color: #ccc;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
`;

const OrganizationNameWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  cursor: pointer;
  display: flex;
  height: 25px;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const OrganizationPhotoInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  height: 50px;
  width: 50px;
  justify-content: center;
  & img, & svg, & path {
    border: 1px solid #ccc;
    border-radius: 29px;
    width: 48px !important;
    height: 48px !important;
    max-width: 48px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const OrganizationPhotoOuterWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 8px 3px 0 4px;
`;

const OrganizationScoreSpacer = styled('div')`
  height: 0px;
`;

const Wrapper = styled('div')`
`;

const YesNoScoreTextWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  padding: 3px 3px 4px 4px;
`;

export default withTheme(withStyles(styles)(PositionRowLogoAndText));

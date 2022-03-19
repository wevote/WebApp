import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import SvgImage from '../../common/components/Widgets/SvgImage';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from '../../utils/organization-functions';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import PositionItemScorePopover from '../Widgets/PositionItemScorePopover';
import PositionItemSquare from './PositionItemSquare';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const StickyPopover = React.lazy(() => import(/* webpackChunkName: 'StickyPopover' */ './StickyPopover'));


class PositionRowItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // const { position } = this.props;
    // const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;
    // console.log('PositionRowItem componentDidMount, position:', position);
    this.onOrganizationInVotersNetworkChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

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
      // const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;
      // const voterIsFriendsWithThisOrganization = FriendStore.isVoterFriendsWithThisOrganization(organizationWeVoteId);
      const updatedPosition = OrganizationStore.getPositionByPositionWeVoteId(position.position_we_vote_id);

      this.setState({
        updatedPosition,
        // voterIsFriendsWithThisOrganization,
      });
    }
  }

  onVoterGuideStoreChange () {
    const { position } = this.props;
    const { ballot_item_we_vote_id: ballotItemWeVoteId, speaker_we_vote_id: organizationWeVoteId } = position;

    // We want to make sure we have all of the position information so that comments show up
    if (ballotItemWeVoteId) {
      const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(ballotItemWeVoteId);

      if (voterGuidesForThisBallotItem) {
        voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
          // console.log('oneVoterGuide: ', oneVoterGuide);
          if (organizationWeVoteId === oneVoterGuide.organization_we_vote_id) {  // Request position list for the organization of this position
            if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
              OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
            }
          }
        });
      }
    }
  }

  closeOrganizationModal () {
    AppObservableStore.setShowOrganizationModal(false);
  }

  render () {
    renderLog('PositionRowItem');  // Set LOG_RENDER_EVENTS to log all renders
    let position;
    ({ position } = this.props);
    const { updatedPosition } = this.state;
    if (updatedPosition && updatedPosition.speaker_we_vote_id) {
      position = updatedPosition;
    }
    if (!position || !position.speaker_we_vote_id) {
      return null;
    }
    // console.log('PositionRowItem position render, position:', position);
    const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;

    // let positionSpeakerDisplayName = position.speaker_display_name;
    // // console.log('position:', position, ', VoterStore.getLinkedOrganizationWeVoteId():', VoterStore.getLinkedOrganizationWeVoteId());
    // if (VoterStore.getLinkedOrganizationWeVoteId() === position.speaker_we_vote_id) {
    //   // Voter looking at own position
    //   if (position.speaker_display_name && position.speaker_display_name.startsWith('Voter-')) {
    //     positionSpeakerDisplayName = 'You';
    //   }
    // }

    let imagePlaceholder = '';
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      imagePlaceholder = (
        <SvgImage imageName="organization-icon" />
      );
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
      const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
      imagePlaceholder = (
        <SvgImage imageName={avatar} />
      );
    }

    // console.log(position);

    const showPosition = true;
    const nothingToDisplay = null;

    if (showPosition) {
      const organizationPopoverCard = (<OrganizationPopoverCard organizationWeVoteId={organizationWeVoteId} />);
      const positionsPopover = (
        <PositionItemScorePopover
          positionWeVoteId={position.position_we_vote_id}
          showPersonalScoreInformation
        />
      );

      return (
        <RowItemWrapper>
          <OrganizationPhotoWrapper>
            <Suspense fallback={<></>}>
              <StickyPopover
                delay={{ show: 700, hide: 100 }}
                popoverComponent={organizationPopoverCard}
                placement="auto"
                id="positions-organization-popover-trigger-click-root-close"
              >
                <div>
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
                </div>
              </StickyPopover>
            </Suspense>
          </OrganizationPhotoWrapper>
          <EndorsementWrapper>
            <Suspense fallback={<></>}>
              <StickyPopover
                delay={{ show: 1000000, hide: 100 }}
                popoverComponent={positionsPopover}
                placement="auto"
                id="position-item-score-mobile-popover-trigger-click-root-close"
                key={`positionItemScoreMobilePopover-${organizationWeVoteId}`}
                openOnClick
                showCloseIcon
              >
                <div>
                  <PositionItemSquare
                    position={position}
                  />
                </div>
              </StickyPopover>
            </Suspense>
          </EndorsementWrapper>
        </RowItemWrapper>
      );
    } else {
      return nothingToDisplay;
    }
  }
}
PositionRowItem.propTypes = {
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
  buttonOutlinedPrimary: {
    background: 'white',
  },
  twitterLogo: {
    color: '#1d9bf0',
    height: 18,
    marginRight: '-2px',
    marginTop: '-4px',
  },
});

const EndorsementWrapper = styled('div')`
`;

const OrganizationPhotoWrapper = styled('div')`
  width: 42px;
  margin: 0 auto 8px auto;
  height: 42px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  * {
    border-radius: 29px;
    width: 42px !important;
    height: 42px !important;
    max-width: 42px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const RowItemWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default withTheme(withStyles(styles)(PositionRowItem));

import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import PositionRowLogoAndText from './PositionRowLogoAndText';
import PositionItemScorePopover from '../Widgets/PositionItemScorePopover';

const StickyPopover = React.lazy(() => import(/* webpackChunkName: 'StickyPopover' */ './StickyPopover'));


class PositionRowItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
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

    const showPosition = true;
    const nothingToDisplay = null;

    if (showPosition) {
      const positionsPopover = (
        <PositionItemScorePopover
          positionWeVoteId={position.position_we_vote_id}
          showPersonalScoreInformation
        />
      );

      return (
        <RowItemWrapper>
          <EndorsementWrapper>
            <Suspense fallback={<></>}>
              <StickyPopover
                delay={{ show: 100000, hide: 100 }}
                popoverComponent={positionsPopover}
                placement="auto"
                id="position-row-logo-square-popover-trigger-click-root-close"
                key={`positionRowLogoSquarePopover-${organizationWeVoteId}`}
                // openOnClick
                showCloseIcon
              >
                <div>
                  <PositionRowLogoAndText
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

const RowItemWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default withTheme(withStyles(styles)(PositionRowItem));

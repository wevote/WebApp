import { Chat } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';
import stringContains from '../../common/utils/stringContains';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import { isOrganizationInVotersNetwork } from '../../utils/positionFunctions';
import SvgImage from '../../common/components/Widgets/SvgImage';
import {
  HorizontalSpacer,
  OrganizationPhotoInnerWrapper,
} from '../Style/PositionRowListStyles';

const FollowToggleCheckPlus = React.lazy(() => import(/* webpackChunkName: 'FollowToggleCheckPlus' */ '../Widgets/FollowToggleCheckPlus'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const PositionItemScorePopover = React.lazy(() => import(/* webpackChunkName: 'PositionItemScorePopover' */ '../Widgets/ScoreDisplay/PositionItemScorePopover'));
const StickyPopover = React.lazy(() => import(/* webpackChunkName: 'StickyPopover' */ './StickyPopover'));


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
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
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

  onClickShowPositionDrawer (ballotItemWeVoteId, organizationWeVoteId) {
    // AppObservableStore.setOrganizationModalBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setPositionDrawerBallotItemWeVoteId(ballotItemWeVoteId);
    AppObservableStore.setPositionDrawerOrganizationWeVoteId(organizationWeVoteId);
    // AppObservableStore.setShowOrganizationModal(true);
    AppObservableStore.setShowPositionDrawer(true);
    this.StickyPopover.closePopover();
  }

  onShowMoreAlternateFunction = () => {
    const { position } = this.props;
    const {
      ballot_item_we_vote_id: ballotItemWeVoteId,
      speaker_we_vote_id: organizationWeVoteId,
    } = position;
    this.onClickShowPositionDrawer(ballotItemWeVoteId, organizationWeVoteId);
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
    const {
      ballot_item_we_vote_id: ballotItemWeVoteId, position_we_vote_id: positionWeVoteId,
      speaker_we_vote_id: organizationWeVoteId, statement_text: statementText,
    } = position;
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
    }

    const positionsPopover = (
      <Suspense fallback={<></>}>
        <PositionItemScorePopover
          onShowMoreAlternateFunction={this.onShowMoreAlternateFunction}
          popoverHeaderOff
          positionWeVoteId={positionWeVoteId}
          showPersonalScoreInformation
        />
      </Suspense>
    );

    if (showPosition) {
      return (
        <PositionRowLogoAndTextWrapper>
          <OrganizationScoreSpacer />
          <Suspense fallback={<></>}>
            <StickyPopover
              delay={{ show: 700, hide: 100 }}
              popoverComponent={positionsPopover}
              placement="left"
              id="follow-toggle-check-plus-popover-trigger-click-root-close"
              key={`positionItemScoreDesktopPopover-${organizationWeVoteId}`}
              // openOnClick
              // showCloseIcon
              ref={(instance) => { this.StickyPopover = instance; }}
            >
              <div>
                <OrganizationOverlayOuterWrapper>
                  <OrganizationPhotoOuterWrapper onClick={() => this.onClickShowPositionDrawer(ballotItemWeVoteId, organizationWeVoteId)}>
                    <OrganizationPhotoInnerWrapper>
                      { position.speaker_image_url_https_medium ? (
                        <Suspense fallback={<></>}>
                          <ImageHandler
                            className="card-child__avatar"
                            sizeClassName="icon-lg"
                            imageUrl={position.speaker_image_url_https_medium}
                          />
                        </Suspense>
                      ) : (
                        <div>{imagePlaceholder}</div>
                      )}
                    </OrganizationPhotoInnerWrapper>
                  </OrganizationPhotoOuterWrapper>
                  {statementText && (
                    <CommentOverlayImage onClick={() => this.onClickShowPositionDrawer(ballotItemWeVoteId, organizationWeVoteId)}>
                      <Chat
                        style={{
                          color: '#999',
                          height: 14,
                          width: 14,
                        }}
                      />
                    </CommentOverlayImage>
                  )}
                </OrganizationOverlayOuterWrapper>
                <OrganizationNameWrapper
                  onClick={() => this.onClickShowPositionDrawer(ballotItemWeVoteId, organizationWeVoteId)}
                  overlayUsed={statementText}
                >
                  <OrganizationName>
                    {shortenText(speakerDisplayName, 18)}
                  </OrganizationName>
                </OrganizationNameWrapper>
              </div>
            </StickyPopover>
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
                <PositionRowFollowToggleWrapper>
                  <Suspense fallback={<></>}>
                    <FollowToggleCheckPlus
                      organizationWeVoteId={organizationWeVoteId}
                      speakerDisplayName={speakerDisplayName}
                    />
                  </Suspense>
                </PositionRowFollowToggleWrapper>
              )}
            </YesNoScoreTextWrapper>
          </Suspense>
        </PositionRowLogoAndTextWrapper>
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

const CommentOverlayImage = styled('div')`
  display: flex;
  margin-left: 44px;
  margin-top: -57px;
  position: relative;
  z-index: 2;
`;

const PositionRowFollowToggleWrapper = styled('div')`
  display: flex;
  justify-content: center;
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
  color: #999;
  font-size: 12px;
  line-height: 12px;
  padding: 0 3px;
  text-align: center;
`;

const OrganizationNameWrapper = styled('div', {
  shouldForwardProp: (prop) => !['overlayUsed'].includes(prop),
})(({ overlayUsed }) => (`
  border-left: 1px dotted #dcdcdc;
  cursor: pointer;
  display: flex;
  height: 25px;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: hidden;
  ${overlayUsed ? 'margin-top: 43px;' : ''}
`));

const OrganizationOverlayOuterWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationPhotoOuterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['overlayUsed'].includes(prop),
})(({ overlayUsed }) => (`
  border-left: 1px dotted #dcdcdc;
  cursor: pointer;
  display: flex;
  justify-content: center;
  ${overlayUsed ? 'margin-top: -19px;' : ''}
  padding: 8px 3px 0 4px;
`));

const OrganizationScoreSpacer = styled('div')`
  height: 0px;
`;

const PositionRowLogoAndTextWrapper = styled('div')`
  width: 60px;
`;

const YesNoScoreTextWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  padding: 3px 3px 4px 4px;
`;

export default withTheme(withStyles(styles)(PositionRowLogoAndText));

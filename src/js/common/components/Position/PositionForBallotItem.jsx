import PropTypes from 'prop-types';
import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import { Launch, MoreHoriz } from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import { Avatar, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import HeartFavoriteToggleLoader from '../Widgets/HeartFavoriteToggle/HeartFavoriteToggleLoader';
import ThumbsUpDownToggle from '../Widgets/ThumbsUpDownToggle/ThumbsUpDownToggle';
import DesignTokenColors from '../Style/DesignTokenColors';
import { CompactStatementText, SpeakerInfoWrapper, SpeakerName, SpeakerStatement, SpeakerStatementWrapper } from '../Style/PositionDisplayStyles';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';
import SpeakerEndorsedOrOpposedSnippet from './SpeakerEndorsedOrOpposedSnippet';
import AppObservableStore from '../../stores/AppObservableStore';
import stringContains from '../../utils/stringContains';
import lookupPageNameAndPageTypeDict from '../../../utils/lookupPageNameAndPageTypeDict';

const EndorsementDetailModal = React.lazy(() => import(/* webpackChunkName: 'EndorsementDetailModal' */ '../../../components/Ballot/EndorsementDetailModal'));

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../Widgets/ReadMore'));

function PositionForBallotItem ({ classes, compactMode, linksOpenExternalWebsite, position }) {
  const [anchorEl, setAnchorEL] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const onDotButtonClick = (e) => {
    setAnchorEL(e.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEL(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const {
    more_info_url: moreInfoUrl,
    organization_we_vote_id: organizationWeVoteIdRaw,
    statement_text: statementText,
    speaker_display_name: speakerDisplayName,
    speaker_twitter_handle: speakerTwitterHandle,
    speaker_we_vote_id: speakerWeVoteId,
    speaker_image_url_https_medium: speakerImageMedium,
  } = position;
  // console.log('PositionForBallotItem: ', position);
  const campaignXWeVoteId = ''; // Get this from politicianWeVoteId
  const { sx, children } = speakerDisplayNameToInitials(speakerDisplayName);
  // I think we need a HeartFavoriteToggleLive that accepts an organizationWeVoteId
  const heartToggleOn = true;
  const voterLikesOn = false;
  let organizationWeVoteId = organizationWeVoteIdRaw;
  // Is speakerWeVoteId an organizationWeVoteId?
  if (!organizationWeVoteId && speakerWeVoteId && stringContains('org', speakerWeVoteId)) {
    organizationWeVoteId = speakerWeVoteId;
  }
  const voterGuideWeVoteIdLink = `/voterguide/${organizationWeVoteId}`;
  const speakerLink = speakerTwitterHandle ? `/${speakerTwitterHandle}` : voterGuideWeVoteIdLink;
  const hostnameAndPort = AppObservableStore.getWeVoteRootURL();
  const speakerLinkExternal = `${hostnameAndPort}${speakerLink}`;
  // console.log('PositionForBallotItem organizationWeVoteId:', organizationWeVoteId, ', campaignXWeVoteId:', campaignXWeVoteId);

  const speakerImageJsx = (
    <SpeakerImageWrapper>
      {speakerImageMedium ? (
        <SpeakerImage src={speakerImageMedium} />
      ) : (
        <Avatar sx={sx}>{children}</Avatar>
      )}
    </SpeakerImageWrapper>
  );
  return (
    <PositionForBallotItemWrapper $compactMode={compactMode}>
      {linksOpenExternalWebsite ? (
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            body={speakerImageJsx}
            destinationPageName={lookupPageNameAndPageTypeDict(speakerLink).pageName}
            destinationPageType={lookupPageNameAndPageTypeDict(speakerLink).pageType}
            linkIdAttribute="positionSpeakerImage"
            target="_blank"
            trackingOn
            url={speakerLinkExternal}
          />
        </Suspense>
      ) : (
        <>{speakerImageJsx}</>
      )}
      <SpeakerInfoWrapper>
        {!compactMode && (
          <SpeakerInfoNameFavoritesWrapper>
            {linksOpenExternalWebsite ? (
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  body={<SpeakerName>{speakerDisplayName}</SpeakerName>}
                  destinationPageName={lookupPageNameAndPageTypeDict(speakerLink).pageName}
                  destinationPageType={lookupPageNameAndPageTypeDict(speakerLink).pageType}
                  linkIdAttribute="positionSpeakerDisplayName"
                  target="_blank"
                  trackingOn
                  url={speakerLinkExternal}
                />
              </Suspense>
            ) : (
              <SpeakerName>{speakerDisplayName}</SpeakerName>
            )}
            {(heartToggleOn && (campaignXWeVoteId || organizationWeVoteId)) && (
              <HeartFavoriteToggleWrapper>
                <HeartFavoriteToggleLoader campaignXWeVoteId={campaignXWeVoteId} organizationWeVoteId={organizationWeVoteId} />
              </HeartFavoriteToggleWrapper>
            )}
          </SpeakerInfoNameFavoritesWrapper>
        )}
        {statementText && compactMode && (
          <CompactStatementClickable
            onClick={() => setDetailModalOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDetailModalOpen(true);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <CompactStatementText>{statementText}</CompactStatementText>
          </CompactStatementClickable>
        )}
        {statementText && !compactMode && (
          <SpeakerStatementWrapper>
            <SpeakerStatement>
              <Suspense fallback={<></>}>
                <ReadMore
                  textToDisplay={statementText}
                  numberOfLines={6}
                />
              </Suspense>
            </SpeakerStatement>
          </SpeakerStatementWrapper>
        )}
        {compactMode && (
          <CompactSpeakerRow>
            <CompactSpeakerName>{speakerDisplayName}</CompactSpeakerName>
            {(campaignXWeVoteId || organizationWeVoteId) && (
              <CompactHeartWrapper>
                <HeartFavoriteToggleLoader campaignXWeVoteId={campaignXWeVoteId} organizationWeVoteId={organizationWeVoteId} />
              </CompactHeartWrapper>
            )}
          </CompactSpeakerRow>
        )}
        {!compactMode && (
        <SpeakerPositionLikesSourceWrapper>
          <SpeakerEndorsedOrOpposedSnippet position={position} />
          <ThumbsUpAndSourceWrapper>
            <FlexDiv>
              {voterLikesOn && (
                <ThumbsUpDownToggle />
              )}
              {moreInfoUrl && (
                <SourceButton
                  aria-label="Source"
                  onClick={onDotButtonClick}
                  style={{ background: !anchorEl ? 'transparent' : `${DesignTokenColors.neutral100}` }}
                  type="button"
                >
                  <MoreHorizStyled />
                </SourceButton>
              )}
              {moreInfoUrl && (
                <Popover
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  id={id}
                  // marginThreshold={6}
                  onClose={handlePopoverClose}
                  open={open}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  classes={{ root: classes.popoverRoot }}
                >
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      body={(
                        <Typography sx={{ p: 1 }}>
                          <OpinionSource>
                            View source of opinion
                            {' '}
                            <LaunchStyled />
                          </OpinionSource>
                        </Typography>
                      )}
                      destinationPageName="PositionSourceUrl"
                      destinationPageType="endorserWebsite"
                      linkIdAttribute="viewSourceOfPosition"
                      target="_blank"
                      trackingOn
                      url={moreInfoUrl}
                    />
                  </Suspense>
                </Popover>
              )}
            </FlexDiv>
          </ThumbsUpAndSourceWrapper>
        </SpeakerPositionLikesSourceWrapper>
        )}
      </SpeakerInfoWrapper>
      {compactMode && (
        <Suspense fallback={<></>}>
          <EndorsementDetailModal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            position={position}
          />
        </Suspense>
      )}
    </PositionForBallotItemWrapper>
  );
}
PositionForBallotItem.propTypes = {
  classes: PropTypes.object,
  compactMode: PropTypes.bool,
  linksOpenExternalWebsite: PropTypes.bool,
  position: PropTypes.object,
};

const styles = () => ({
  popoverRoot: {
    borderRadius: 2,
    border: `1px solid ${DesignTokenColors.neutral100}`,
    marginTop: '4px',
  },
});

const CompactHeartWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  margin-left: 8px;
  /* Strip the pill chrome on HeartFavoriteToggleContainer (3 wrappers deep:
     Loader's container > Live's container > Base's pill container). */
  & > div > div > div {
    background: transparent;
    border: none;
    border-radius: 0;
    height: auto;
    padding: 0;
  }
  /* Center the icon and the count text on the same baseline inside each toggle button. */
  & button {
    align-items: center;
  }
  & svg {
    height: 20px;
    width: 20px;
  }
  & span {
    font-size: 14px;
    line-height: 1;
  }
`;

const CompactSpeakerName = styled('div')`
  color: ${DesignTokenColors.neutralUI900};
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CompactSpeakerRow = styled('div')`
  align-items: center;
  display: flex;
  margin-top: 4px;
`;

const CompactStatementClickable = styled('div')`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid ${DesignTokenColors.primary500};
    border-radius: 4px;
  }
`;

const FlexDiv = styled('div')`
  display: flex;
`;

const HeartFavoriteToggleWrapper = styled('div')`
  margin-top: -5px;
  margin-left: 5px;
`;

const LaunchStyled = styled(Launch)`
  height: 14px;
  margin-left: 2px;
  margin-top: -3px;
  width: 14px;
`;

const MoreHorizStyled = styled(MoreHoriz)`
  color: ${DesignTokenColors.neutral400};
  font-size: 30px;
  margin-left: -1px;
  margin-top: -.5px;
`;

const OpinionSource = styled('button')`
  background: transparent;
  border: none;
`;


const PositionForBallotItemWrapper = styled('div').withConfig({
  shouldForwardProp: (prop) => prop !== '$compactMode',
})`
  display: flex;

  &:not(:last-child) {
    border-bottom: 1px solid ${DesignTokenColors.neutral100};
  }

  ${({ $compactMode }) => $compactMode && `
    /* Let SpeakerInfoWrapper take the remaining row width AND allow it to shrink,
       so the speaker name's ellipsis can kick in and the heart toggle stays in view. */
    ${SpeakerInfoWrapper} {
      flex: 1;
      min-width: 0;
    }
    h3 {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `}
`;

const SourceButton = styled('button')`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 30px;
  margin-left: 25px;
  margin-top: -5px;
`;

const SpeakerImage = styled('img')`
  border-radius: 42px;
  height: 42px;
  min-width: 42px;
  width: 42px;
`;

const SpeakerImageWrapper = styled('div')`
  width: 42px;
`;

const SpeakerInfoNameFavoritesWrapper = styled('div')`
  display: flex;
  align-items: center;
`;

const SpeakerPositionLikesSourceWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const ThumbsUpAndSourceWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 0px;
`;

export default withStyles(styles)(PositionForBallotItem);

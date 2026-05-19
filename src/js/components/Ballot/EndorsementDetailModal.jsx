import { Launch, MoreHoriz } from '@mui/icons-material';
import { Avatar, Popover, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Suspense, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import HeartFavoriteToggleLoader from '../../common/components/Widgets/HeartFavoriteToggle/HeartFavoriteToggleLoader';
import SpeakerEndorsedOrOpposedSnippet from '../../common/components/Position/SpeakerEndorsedOrOpposedSnippet';
import { SpeakerInfoWrapper, SpeakerName, SpeakerStatementWrapper } from '../../common/components/Style/PositionDisplayStyles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import speakerDisplayNameToInitials from '../../common/utils/speakerDisplayNameToInitials';
import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';
import ModalDisplayTemplateB from '../Widgets/ModalDisplayTemplateB';
import { resolveOrganizationWeVoteId } from './opinionsHelpers';

const MODAL_ID = 'endorsementDetail';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

export default function EndorsementDetailModal ({ isOpen, onClose, position }) {
  const [anchorEl, setAnchorEl] = useState(null);

  if (!position) return null;

  const {
    more_info_url: moreInfoUrl,
    statement_text: statementText,
    speaker_display_name: speakerDisplayName,
    speaker_image_url_https_medium: speakerImageMedium,
  } = position;
  const organizationWeVoteId = resolveOrganizationWeVoteId(position);

  const { sx, children: avatarInitials } = speakerDisplayNameToInitials(speakerDisplayName);
  const open = Boolean(anchorEl);

  const content = (
    <ContentWrapper>
      <SpeakerImageWrapper>
        {speakerImageMedium ? (
          <SpeakerImage src={speakerImageMedium} alt="" />
        ) : (
          <Avatar sx={sx}>{avatarInitials}</Avatar>
        )}
      </SpeakerImageWrapper>
      <SpeakerInfoWrapper>
        <SpeakerInfoNameFavoritesWrapper>
          <SpeakerName>{speakerDisplayName}</SpeakerName>
          {organizationWeVoteId && (
            <HeartFavoriteToggleWrapper>
              <HeartFavoriteToggleLoader organizationWeVoteId={organizationWeVoteId} />
            </HeartFavoriteToggleWrapper>
          )}
        </SpeakerInfoNameFavoritesWrapper>
        {statementText && (
          <SpeakerStatementWrapper>
            <StatementWithNewlines>{statementText}</StatementWithNewlines>
          </SpeakerStatementWrapper>
        )}
        <SpeakerPositionLikesSourceWrapper>
          <SpeakerEndorsedOrOpposedSnippet position={position} />
          {moreInfoUrl && (
            <>
              <SourceButton
                aria-label="Source"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{ background: anchorEl ? DesignTokenColors.neutral100 : 'transparent' }}
                type="button"
              >
                <MoreHorizStyled />
              </SourceButton>
              <Popover
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => setAnchorEl(null)}
                open={open}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
                    destinationPageName={lookupPageNameAndPageTypeDict(moreInfoUrl).pageName}
                    destinationPageType="endorserWebsite"
                    linkIdAttribute="viewSourceOfPosition"
                    target="_blank"
                    trackingOn
                    url={moreInfoUrl}
                  />
                </Suspense>
              </Popover>
            </>
          )}
        </SpeakerPositionLikesSourceWrapper>
      </SpeakerInfoWrapper>
    </ContentWrapper>
  );

  const buttonRow = (
    <ButtonRow>
      <CloseButton onClick={onClose} type="button">
        Close
      </CloseButton>
    </ButtonRow>
  );

  return (
    <>
      <HideHeader />
      <SoftenCorners />
      <ScrollableContent />
      <ModalDisplayTemplateB
        externalUniqueId={MODAL_ID}
        show={isOpen}
        tallMode={false}
        textFieldJSX={(
          <>
            {content}
            {buttonRow}
          </>
        )}
        toggleModal={onClose}
      />
    </>
  );
}

EndorsementDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.object,
};

const HideHeader = createGlobalStyle`
  /* Force templateB's DialogTitle to occupy zero vertical space, but keep it
     in the DOM so its built-in X close button stays anchored at the top of
     the modal (outside the scrollable content area). The X is moved to
     position: absolute against the dialog paper, so it survives the collapse. */
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateB${MODAL_ID}) {
    height: 0 !important;
    min-height: 0 !important;
    overflow: visible !important;
    padding: 0 !important;
  }
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateB${MODAL_ID}) > div {
    min-height: 0 !important;
  }
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateB${MODAL_ID}) > hr {
    display: none !important;
  }
  /* Pin the X near the corner of the modal paper, with a small inset. */
  #closeModalDisplayTemplateB${MODAL_ID} {
    position: absolute !important;
    top: 16px !important;
    right: 16px !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateB${MODAL_ID}) {
    border-radius: 20px !important;
    /* Constrain to viewport and cancel templateB's default top/transform offset
       (top: 50px + translate(0, -20%)) which can push the top off-screen on
       shorter viewports once max-height is large. */
    max-height: 90vh !important;
    margin: 16px auto !important;
    top: auto !important;
    transform: none !important;
  }
`;

const ScrollableContent = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateB${MODAL_ID}) .MuiDialogContent-root {
    /* Zero all padding so ContentWrapper can place its own X/Close right up against the modal edge. */
    padding: 0 !important;
    overflow-y: auto !important;
    flex: 1 1 auto !important;
  }
`;

const ButtonRow = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 0 24px 24px 0;
`;

const CloseButton = styled('button')`
  background: ${DesignTokenColors.primary700};
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  padding: 8px 28px;
  &:hover {
    background: ${DesignTokenColors.primary800};
  }
`;

const ContentWrapper = styled('div')`
  display: flex;
  padding: 0 48px 4px 24px;
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
`;

const OpinionSource = styled('button')`
  background: transparent;
  border: none;
`;

const SourceButton = styled('button')`
  background: transparent;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  height: 34px;
  width: 34px;
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
  align-items: center;
  display: flex;
`;

const SpeakerPositionLikesSourceWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`;

const StatementWithNewlines = styled('div')`
  color: ${DesignTokenColors.neutral900};
  margin-bottom: 5px;
  white-space: pre-wrap;
`;

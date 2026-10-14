import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';
import OfficeHeaderTripleDotMenu from '../BallotItem/OfficeHeaderTripleDotMenu';
import { Video } from '../../common/components/Style/VideoStyles';

function PlayButton () {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="24" rx="4" fill="#0858A1" />
      <path d="M12 6 L12 18 L22 12 Z" fill="#ebebeb" />
    </svg>
  );
}

// vimeo.com page URLs refuse to be framed (X-Frame-Options: sameorigin), so convert to the player.vimeo.com embed URL
function toVimeoEmbedUrl (url) {
  if (!url) return '';
  if (url.includes('player.vimeo.com/video/')) return url;
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)(?:\/(\w+))?/);
  if (!match) return '';
  const [, videoId, privateHash] = match;
  return `https://player.vimeo.com/video/${videoId}${privateHash ? `?h=${privateHash}` : ''}`;
}

function OfficeInfoModal ({ isOpen, onClose, officeExplanation, officeName, officeWeVoteId, videoUrlHorizontal, videoUrlVertical }) {
  const embedUrlHorizontal = toVimeoEmbedUrl(videoUrlHorizontal);
  const embedUrlVertical = toVimeoEmbedUrl(videoUrlVertical);
  // playsinline keeps iOS from forcing fullscreen-only playback; Vimeo has no option to pin controls, tapping the video reveals them
  const verticalParams = 'autoplay=1&playsinline=1&controls=1';
  const autoplayUrlVertical = embedUrlVertical ? `${embedUrlVertical}${embedUrlVertical.includes('?') ? '&' : '?'}${verticalParams}` : '';
  const [showVerticalVideo, setShowVerticalVideo] = useState(false);

  useEffect(() => {
    if (!isOpen) setShowVerticalVideo(false);
  }, [isOpen]);

  const dialogTitleJSX = (
    <HeaderRow>
      <Title id="office-info-title">
        About the office
        {' '}
        <br className="mobile-break" />
        <strong>{officeName}</strong>
      </Title>
      {officeWeVoteId && (
        <HeaderActionsOfficeInfo>
          <OfficeHeaderTripleDotMenu officeWeVoteId={officeWeVoteId} />
          <VerticalLine />
        </HeaderActionsOfficeInfo>
      )}
    </HeaderRow>
  );

  // WV-2274 Currently we can't stop the vertical video from playing once it starts,
  //  so we are turning off mobile videos until we can figure out a way to do that.
  const pigsCanFly = false;

  const textFieldJSX = (
    <div style={{ padding: '8px 0 16px' }}>
      <ModalBody>
        <FlexContainer>
          {!showVerticalVideo && (
            <ModalText>
              {officeExplanation}
            </ModalText>
          )}
          <VideoOuterWrapper>
            {embedUrlHorizontal && (
              <VideoFrameHorizontal className="u-show-desktop-tablet">
                <Video
                  src={embedUrlHorizontal}
                  frameBorder="0"
                  allow="fullscreen"
                />
              </VideoFrameHorizontal>
            )}
            {(pigsCanFly && embedUrlVertical) && (showVerticalVideo ? (
              <VideoFrameVertical className="u-show-mobile">
                <Video
                  src={autoplayUrlVertical}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </VideoFrameVertical>
            ) : (
              <VideoContainer
                className="u-show-mobile"
                onClick={() => setShowVerticalVideo(true)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowVerticalVideo(true); }}
                role="button"
                tabIndex={0}
              >
                <VideoControls>
                  <PlayButtonWrapper>
                    <PlayButton />
                  </PlayButtonWrapper>
                  <VideoTextWrapper>
                    <WatchText>Watch video</WatchText>
                    <DurationText>(25 seconds)</DurationText>
                  </VideoTextWrapper>
                </VideoControls>
              </VideoContainer>
            ))}
          </VideoOuterWrapper>
        </FlexContainer>
      </ModalBody>
    </div>
  );

  return (
    <>
      <FixMobileVideoTaps videoOpen={showVerticalVideo} />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={onClose}
        externalUniqueId="officeInfoModal"
        dialogTitleJSX={dialogTitleJSX}
        disableEnforceFocus
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
    </>
  );
}

OfficeInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  officeExplanation: PropTypes.string,
  officeName: PropTypes.string.isRequired,
  officeWeVoteId: PropTypes.string,
  videoUrlHorizontal: PropTypes.string,
  videoUrlVertical: PropTypes.string,
};

// Global Styles

// On mobile, ModalDisplayTemplateA applies a transform and short max-height, which misaligns taps on the Vimeo iframe in iOS WebKit
const FixMobileVideoTaps = createGlobalStyle`
  @media (max-width: 575px) {
    .MuiDialog-paper:has(#closeModalDisplayTemplateAofficeInfoModal) {
      transform: none !important;
      max-height: 90vh !important;
      height: auto !important;
    }
    ${({ videoOpen }) => (videoOpen ? `
      .MuiDialog-paper:has(#closeModalDisplayTemplateAofficeInfoModal) .MuiDialogContent-root {
        overflow: visible !important;
        -webkit-overflow-scrolling: auto !important;
      }
    ` : '')}
  }
`;

// Styled Components

const DurationText = styled.span`
  font-size: 13px;
  color: #666666;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeaderActionsOfficeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-right: 52px !important;
  margin-top: -4px;
  ${isMobileScreenSize() ? '' : 'margin-top: -4px'};

  @media (max-width: 768px) {
    margin-right: 52px !important;
    margin-top: -4px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 8px;
`;

const ModalBody = styled.div`
  background: ${DesignTokenColors.whiteUI};
`;

const ModalText = styled.div`
  margin-bottom: 16px;
  line-height: 1.6;
  font-size: 15px;
  color: ${DesignTokenColors.neutral900};

  &:last-child {
    margin-bottom: 0;
  }
`;

const PlayButtonWrapper = styled.div`
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  &:hover svg rect {
    fill: #06437D;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
  flex: 1;
  min-width: 0;

  strong {
    font-weight: 600;
  }

  .mobile-break {
    display: none;
  }

  @media (max-width: 768px) {
    font-size: 16px;

    .mobile-break {
      display: inline;
    }
  }
`;

const VerticalLine = styled.div`
  border-left: 1px solid ${DesignTokenColors.neutral200};
  height: 24px;
  align-self: center;
  ${isMobileScreenSize() ? 'margin-top: 2px' : ''};

  @media (max-width: 768px) {
    height: 20px;
  }
`;

const VideoContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    background: #ebebeb;
    border-radius: 6px;
    padding: 12px;
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }
`;

const VideoControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-top: 0;
    flex: 1;
  }
`;

const VideoFrameHorizontal = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const VideoFrameVertical = styled.div`
  position: relative;
  width: 100%;
  max-height: 70vh;
  aspect-ratio: 9 / 16;
  margin: 0 auto;
  touch-action: manipulation;
`;

const VideoOuterWrapper = styled.div`
  width: 100%;
`;

const VideoTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const WatchText = styled.span`
  font-size: 16px;
  color: #0858A1;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export default OfficeInfoModal;

/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-closing-tag-location */
import indefinite from 'indefinite';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';
import TripleDotMenu from '../Widgets/TripleDotMenu';

function OfficeInfoModal ({ isOpen, onClose, officeName }) {
  function PlayButton () {
    return (
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="24" rx="4" fill="#0858A1" />
        <path d="M12 6 L12 18 L22 12 Z" fill="#ebebeb" />
      </svg>
    );
  }

  const dialogTitleJSX = (
    <HeaderRow>
      <Title id="office-info-title">
        About the office of
        {' '}
        <br className="mobile-break" />
        <strong>{officeName}</strong>
      </Title>
      <HeaderActionsOfficeInfo>
        <TripleDotMenu />
        <VerticalLine />
      </HeaderActionsOfficeInfo>
    </HeaderRow>
  );

  const textFieldJSX = (
    <div style={{ padding: '8px 16px 16px' }}>
      <ModalBody>
        <FlexContainer>
          <LeftColumn>
            <VideoContainer>
              <VideoPlaceholder />
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
          </LeftColumn>

          <RightColumn>
            <p>
              {indefinite(officeName, { articleOnly: true, capitalize: true })}{' '}
              <strong>{officeName}</strong> is the chief legal officer of a state,
              responsible for enforcing laws, protecting citizens' rights, and representing
              the public interest in legal matters.
            </p>
            <p>
              They oversee investigations, defend state laws in court, and provide legal
              guidance to government agencies.
            </p>
            {/* eslint-disable react/jsx-indent */}
            <p>
              Because they influence everything from consumer protections to civil rights
              and election integrity, <strong>choosing {indefinite(officeName)} in an election is
              crucial</strong>—it determines who will uphold justice, safeguard democratic
              processes, and hold powerful entities accountable on behalf of the public.
            </p>
            {/* eslint-enable react/jsx-indent */}
          </RightColumn>
        </FlexContainer>
      </ModalBody>
    </div>
  );

  return (
    <>
      <WidenOfficeInfoModal />
      <SoftenCorners />
      <RemoveTitlePadding />
      <RemoveDialogContentPadding />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={onClose}
        externalUniqueId="officeInfoModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
    </>
  );
}

OfficeInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  officeName: PropTypes.string.isRequired,
};

// Global Styles

const WidenOfficeInfoModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAofficeInfoModal) {
    max-width: 750px !important;
    width: 96% !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAofficeInfoModal) {
    border-radius: 14px !important;
  }
`;

const RemoveTitlePadding = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAofficeInfoModal) > div > div {
    padding-left: 0 !important;
    width: 100% !important;
    ${isMobileScreenSize() ? 'padding-top: 10px' : ''}
  }
`;

const RemoveDialogContentPadding = createGlobalStyle`
  .MuiDialogContent-root:has(#closeModalDisplayTemplateAofficeInfoModal) {
    padding: 0 !important;
  }
`;

// Styled Components

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding-left: 16px;
  padding-bottom: 8px;
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

const VerticalLine = styled.div`
  border-left: 1px solid ${DesignTokenColors.neutral200};
  height: 24px;
  align-self: center;
  ${isMobileScreenSize() ? 'margin-top: 2px' : ''};

  @media (max-width: 768px) {
    height: 20px;
  }
`;

const ModalBody = styled.div`
  background: ${DesignTokenColors.whiteUI};
  padding: 12px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const LeftColumn = styled.div`
  flex: 0 0 200px;

  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
  }
`;

const RightColumn = styled.div`
  flex: 1;

  p {
    margin-bottom: 16px;
    line-height: 1.6;
    font-size: 15px;
    color: ${DesignTokenColors.neutral900};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const VideoContainer = styled.div`
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

const VideoPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #a0a0a0;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    flex-shrink: 0;
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

const PlayButtonWrapper = styled.div`
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  &:hover svg rect {
    fill: #06437D;
  }
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

const DurationText = styled.span`
  font-size: 13px;
  color: #666666;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export default OfficeInfoModal;

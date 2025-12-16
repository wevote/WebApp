/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

const OfficeInfoModal = ({ isOpen, onClose, officeName }) => {
  const dialogTitleJSX = (
    <HeaderRow>
      <Title id="office-info-title">
        About the office of <strong>{officeName}</strong>
      </Title>
    </HeaderRow>
  );

  const textFieldJSX = (
    <div style={{ padding: '18px 18px 28px' }}>
      <ModalBody>
        <FlexContainer>
          <LeftColumn>
            <VideoPlaceholder>
              <PlayIcon>▶</PlayIcon>
              <p>Watch video<br />(25 seconds)</p>
            </VideoPlaceholder>
          </LeftColumn>

          <RightColumn>
            <p>
              An <strong>{officeName}</strong> is the chief legal officer of a state,
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
              and election integrity, <strong>choosing an {officeName} in an election is
              crucial</strong>—it determines who will uphold justice, safeguard democratic
              processes, and hold powerful entities accountable on behalf of the public.
            </p>
            {/* eslint-enable react/jsx-indent */}
          </RightColumn>
        </FlexContainer>
      </ModalBody>

      <ModalFooter>
        <CloseButton type="button" onClick={onClose}>
          Close
        </CloseButton>
      </ModalFooter>
    </div>
  );

  return (
    <>
      <WidenPreviewModal />
      <SoftenCorners />
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
};

OfficeInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  officeName: PropTypes.string.isRequired,
};

// Global Styles
const WidenPreviewModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAofficeInfoModal) {
    max-width: 860px !important;
    width: 96% !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAofficeInfoModal) {
    border-radius: 14px !important;
  }
`;

// Styles
const HeaderRow = styled.div`
    padding: 0px 12px 0 18px;
`;

const Title = styled.h3`
    font-size: 28px;
    font-weight: 400;
`;

const ModalBody = styled.div`
    background: ${DesignTokenColors.whiteUI};
    border: 1px solid ${DesignTokenColors.neutralUI200};
    border-radius: 10px;
    padding: 14px;
`;

// FLEXBOX LAYOUT
const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  
  /* Stack vertically on mobile */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 0 0 180px;

  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
  }
`;

const RightColumn = styled.div`
  flex: 1;

  p {
    margin-bottom: 12px;
    line-height: 1.6;
  }
`;

// Video placeholder
const VideoPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: ${DesignTokenColors.neutral200};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${DesignTokenColors.neutral700};
  text-align: center;
  cursor: pointer;

  &:hover {
    background: ${DesignTokenColors.neutral300};
  }

  p {
    margin: 8px 0 0 0;
    font-size: 14px;
  }
`;

const PlayIcon = styled.div`
  font-size: 32px;
  color: ${DesignTokenColors.primary700}
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
`;

const CloseButton = styled.button`
    background: ${DesignTokenColors.primary700};
    border: 1px solid ${DesignTokenColors.primary700};
    border-radius: 9999px;
    color: ${DesignTokenColors.whiteUI};
    cursor: pointer;
    padding: 10px 18px;

    &:hover{
    background: ${DesignTokenColors.primary800};
    border-color: ${DesignTokenColors.primary800};
    }
`;

export default OfficeInfoModal;


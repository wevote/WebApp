import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA2 from '../Widgets/ModalDisplayTemplateA2';

export default function MeasureDescriptionModal ({ isOpen, measureText, measureSubtitle, measureTitle, measureUrl, measureWeVoteId, onClose }) {
  return (
    <ModalDisplayTemplateA2
      dialogTitleJSX={(
        <>
          <ModalTitle>{measureTitle}</ModalTitle>
          <ModalSubtitle>{measureSubtitle}</ModalSubtitle>
        </>
      )}
      externalUniqueId={`measureDescription-${measureWeVoteId}`}
      show={isOpen}
      tallMode
      toggleModal={onClose}
      tabContentJSX={(
        <ModalContent>
          {!!(measureUrl) && (
            <ModalLink
              href={measureUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {measureUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </ModalLink>
          )}
          <ModalText>{measureText}</ModalText>
        </ModalContent>
      )}
    />
  );
}

MeasureDescriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  measureText: PropTypes.string,
  measureSubtitle: PropTypes.string,
  measureTitle: PropTypes.string,
  measureUrl: PropTypes.string,
  measureWeVoteId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

// Styles

const ModalContent = styled.div`
  padding: 8px 0;
`;

const ModalLink = styled.a`
  color: #1073d4;
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ModalSubtitle = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding-bottom: 12px;
`;

const ModalText = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ModalTitle = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 2px 0;
`;

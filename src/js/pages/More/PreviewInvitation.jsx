import React from 'react';
import PropTypes from 'prop-types';
import ModalDisplayTemplateA from '../../components/Widgets/ModalDisplayTemplateA';
import styled from 'styled-components';
import { ContentCopy as CopyIcon, Edit as EditIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export const PreviewCloseButton = styled.button`
  background: ${DesignTokenColors.primary700};
  border: 1px solid ${DesignTokenColors.primary700};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  padding: 10px 18px;

  &:hover {
    background: ${DesignTokenColors.primary800};
    border-color: ${DesignTokenColors.primary800};
  }
`;

// Styled components
const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const HeaderLink = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
`;

const ManageInfoRow = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 13px;
  color: #555;
`;

const InfoDot = styled.span`
  display: inline-block;
  background: #888;
  color: white;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  margin-right: 8px;
`;

const ModalBody = styled.div`
  margin: 8px 0;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
  }
`;

const ModalFooter = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

const PreviewInvitation = ({
  isOpen,
  onClose,
  invitationBody,
  selectedPoliticianId,
  onEdit,
}) => {
  const handleCopy = async () => {
    const textToCopy = `${invitationBody}\n\nhttps://wevote.us/join/${selectedPoliticianId}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      // Optionally add toast/feedback if needed
    } catch {
      console.error('Copy failed.');
    }
  };

  // Build the modal content
  const textFieldJSX = (
    <div>
      <HeaderActions>
        <HeaderLink type="button" onClick={handleCopy}>
          <CopyIcon fontSize="small" />
          <span>Copy</span>
        </HeaderLink>
        <HeaderLink type="button" onClick={onEdit}>
          <EditIcon fontSize="small" />
          <span>Edit</span>
        </HeaderLink>
      </HeaderActions>

      <ManageInfoRow>
        <InfoDot aria-hidden="true">i</InfoDot>
        <span>Link will appear below text</span>
      </ManageInfoRow>

      <ModalBody>
        <pre>{invitationBody}</pre>
      </ModalBody>

      <ModalFooter>
        <PreviewCloseButton type="button" onClick={onClose}>Close</PreviewCloseButton>
      </ModalFooter>
    </div>
  );

  return (
    <ModalDisplayTemplateA
      show={isOpen}
      toggleModal={onClose}
      dialogTitleJSX={<h2>Preview Invitation</h2>}
      textFieldJSX={textFieldJSX}
      externalUniqueId="previewInvitation"
      tallMode={false} // set true if you want a taller modal
    />
  );
};

PreviewInvitation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invitationBody: PropTypes.string.isRequired,
  selectedPoliticianId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default PreviewInvitation;

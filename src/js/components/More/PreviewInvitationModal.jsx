import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { ContentCopy as CopyIcon, Edit as EditIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

const PreviewInvitationModal = ({
  isOpen,
  onClose,
  invitationBody,
  selectedPoliticianId,
  onEdit,
  notify,
}) => {
  const handleCopyInviteBody = async () => {
    try {
      await navigator.clipboard.writeText(
        `${invitationBody}\n\nhttps://wevote.us/join/${selectedPoliticianId}`,
      );
      notify('Invitation copied to clipboard. Press ⌘V / Ctrl+V to paste.', true);
    } catch {
      notify('Copy failed. Select the text and copy manually.', false, 3000);
    }
  };

  const dialogTitleJSX = (
    <HeaderRow>
      <Title id="invite-title">Preview invitation</Title>
    </HeaderRow>
  );

  const textFieldJSX = (
    <div style={{ padding: '18px 18px 28px' }}>
      <BarBetween>
        <ManageInfoRow>
          <InfoDot aria-hidden>i</InfoDot>
          <span>Link will appear below text</span>
        </ManageInfoRow>

        <HeaderActions>
          <HeaderLink type="button" onClick={handleCopyInviteBody}>
            <CopyIcon fontSize="small" />
            <span>Copy</span>
          </HeaderLink>

          <HeaderLink type="button" onClick={onEdit}>
            <EditIcon fontSize="small" />
            <span>Edit</span>
          </HeaderLink>
        </HeaderActions>
      </BarBetween>

      <ModalBody>
        <pre>{invitationBody}</pre>
        <br />
        <pre>
          https://wevote.us/join/
          {selectedPoliticianId}
        </pre>
      </ModalBody>

      <ModalFooter>
        <PreviewCloseButton type="button" onClick={onClose}>Close</PreviewCloseButton>
      </ModalFooter>
    </div>
  );

  return (
    <>
      <ChangeTitleFont />
      <HideTemplateADivider />
      <WidenPreviewModal />
      <SoftenCorners />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={onClose}
        externalUniqueId="previewInvitationModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
    </>
  );
};

PreviewInvitationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invitationBody: PropTypes.string.isRequired,
  selectedPoliticianId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

// Global Styles

const ChangeTitleFont = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateApreviewInvitationModal) * {
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
  }
`;

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateApreviewInvitationModal) > hr {
    display: none !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateApreviewInvitationModal) {
    border-radius: 14px !important;
  }
`;

const WidenPreviewModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateApreviewInvitationModal) {
    max-width: 860px !important;
    width: 96% !important;
  }
`;

// Styles

const BarBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const HeaderLink = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  padding: 6px 8px;

  &:hover { background: ${DesignTokenColors.primary50}; }
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 12px 0 18px;
`;

const InfoDot = styled.span`
  align-items: center;
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 50%;
  color: ${DesignTokenColors.neutralUI600};
  display: inline-flex;
  font-size: 12px;
  height: 18px;
  justify-content: center;
  width: 18px;
`;

const ManageInfoRow = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  display: flex;
  gap: 8px;
  margin: 4px 0 10px;
`;

const ModalBody = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  padding: 14px;

  pre {
    font: inherit;
    margin: 0;
    white-space: pre-wrap;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
`;

const PreviewCloseButton = styled.button`
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

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

export default PreviewInvitationModal;

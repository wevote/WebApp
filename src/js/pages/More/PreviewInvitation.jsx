import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { ContentCopy as CopyIcon, Edit as EditIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../../components/Widgets/ModalDisplayTemplateA';

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateApreviewInvitationModal) > hr {
    display: none !important;
  }
`;

const WidenPreviewModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateApreviewInvitationModal) {
    max-width: 860px !important;
    width: 96% !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateApreviewInvitationModal) {
    border-radius: 14px !important;
  }
`;

const PreviewInvitation = ({
  isOpen,
  onClose,
  invitationBody,
  selectedPoliticianId,
  onEdit,
}) => {
  const toastTimerRef = useRef(null);
  const [toast, setToast] = useState({ message: '', success: true, visible: false });

  const handleCopyInviteBody = async () => {
    try {
      await navigator.clipboard.writeText(`${invitationBody}\n\nhttps://wevote.us/join/${selectedPoliticianId}`);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ message: 'Invitation copied to clipboard. Press ⌘V / Ctrl+V to paste.', success: true, visible: true });
      toastTimerRef.current = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2200);
    } catch {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ message: 'Copy failed. Select the text and copy manually.', success: false, visible: true });
      toastTimerRef.current = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const dialogTitleJSX = (
    <HeaderRow>
      <Title id="invite-title">Preview invitation</Title>
    </HeaderRow>
  );

  const textFieldJSX = (
    <div style={{ padding: "18px 18px 28px" }}>
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
        <pre>https://wevote.us/join/{selectedPoliticianId}</pre>
      </ModalBody>

      <ModalFooter>
        <PreviewCloseButton type="button" onClick={onClose}>Close</PreviewCloseButton>
      </ModalFooter>

      {toast.visible && (
        <Toast $success={toast.success}>{toast.message}</Toast>
      )}
    </div>
  );

  return (
    <>
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

PreviewInvitation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invitationBody: PropTypes.string.isRequired,
  selectedPoliticianId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const BarBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0px 12px 0 18px;
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;
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

const ManageInfoRow = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  display: flex;
  gap: 8px;
  margin: 4px 0 10px;
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

const Toast = styled.div`
  align-items: center;
  background: ${({ $success }) => ($success ? DesignTokenColors.neutralUI50 : DesignTokenColors.neutralUI900)};
  border: ${({ $success }) => ($success ? `1px solid ${DesignTokenColors.neutralUI200}` : 'none')};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16,24,40,0.18);
  color: ${({ $success }) => ($success ? DesignTokenColors.neutralUI900 : DesignTokenColors.whiteUI)};
  display: inline-flex;
  font-size: 14px;
  gap: 10px;
  left: 50%;
  max-width: 90vw;
  position: fixed;
  text-align: left;
  top: 10%;
  transform: translateX(-50%);
  z-index: 10000;
  padding: 10px 12px;
`;

export default PreviewInvitation;

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ContentCopy as CopyIcon, Edit as EditIcon} from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../../components/Widgets/ModalDisplayTemplateA';

const PreviewInvitation = ({
  isOpen,
  onClose,
  invitationBody,
  selectedPoliticianId,
  onEdit,
}) => {
  const [copiedMsg, setCopiedMsg] = useState('');
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

  const dialogTitleJSX = <div>Preview Invitation</div>;

  const textFieldJSX = (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button
          type="button"
          onClick={handleCopyInviteBody}
          style={{ color: DesignTokenColors.neutral600 }}
        >
          <CopyIcon fontSize="small" /> Copy
        </button>
        <button
          type="button"
          onClick={onEdit}
          style={{ color: DesignTokenColors.neutral600 }}
        >
          <EditIcon fontSize="small" /> Edit
        </button>
      </div>

      <div
        style={{
          whiteSpace: 'pre-wrap',
          color: DesignTokenColors.neutral900,
          marginTop: '12px',
          fontSize: '15px',
        }}
      >
        {invitationBody}
        <br />
        <br />
        https://wevote.us/join/{selectedPoliticianId}
      </div>

      {toast.visible && (
        <div
          style={{
            marginTop: '12px',
            color: toast.success ? 'green' : 'red',
            fontSize: '13px',
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );

  const toggleModal = () => {
    onClose();
  };

  return (
    <WideDialogOverride>
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={onClose}
        externalUniqueId="previewInvitation"
        dialogTitleJSX={(
          <ModalHeader>
            <ModalTitle id="invite-title">Preview invitation</ModalTitle>
            <HeaderActions>
              <HeaderLink type="button" onClick={handleCopyInviteBody}>
                <CopyIcon fontSize="small" />
                {' '}
                <span>Copy</span>
              </HeaderLink>
              <HeaderLink type="button" onClick={onEdit}>
                <EditIcon fontSize="small" />
                {' '}
                <span>Edit</span>
              </HeaderLink>
              <CloseX
                type="button"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </CloseX>
            </HeaderActions>
          </ModalHeader>
        )}
        textFieldJSX={(
          <ModalCard>
            <ManageInfoRow>
              …
            </ManageInfoRow>

            <ModalBody>
              <pre>{invitationBody}</pre>
            </ModalBody>

            {copiedMsg && (
              <ManageInfoRow style={{ color: DesignTokenColors.primary700 }}>
                {copiedMsg}
              </ManageInfoRow>
            )}

            <ModalFooter>
              <PreviewCloseButton type="button" onClick={onClose}>
                Close
              </PreviewCloseButton>
            </ModalFooter>

            {toast.visible && (
              <Toast $success={toast.success}>{toast.message}</Toast>
            )}
          </ModalCard>
        )}
      />
    </WideDialogOverride>
  );
};

PreviewInvitation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invitationBody: PropTypes.string.isRequired,
  selectedPoliticianId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const WideDialogOverride = styled.div`
  .MuiDialog-paper {
    max-width: 860px !important;
    width: calc(100% - 28px) !important;
    border-radius: 14px !important;
  }
`;


export default PreviewInvitation;

const ModalBackdrop = styled.div`
  align-items: center;
  background: rgba(16,24,40,0.4);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9999;
`;

const ModalCard = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(16,24,40,0.18);
  max-width: 860px;
  padding: 18px 18px 14px;
  width: calc(100% - 28px);
`;

const ModalHeader = styled.div`
  align-items: start;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  margin: 4px 0 8px;
`;

const HeaderActions = styled.div`
  align-items: center;
  display: inline-flex;
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

const CloseX = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  padding: 2px 6px;
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
  min-height: 240px;
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

  &:hover { background: ${DesignTokenColors.primary800}; border-color: ${DesignTokenColors.primary800}; }
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

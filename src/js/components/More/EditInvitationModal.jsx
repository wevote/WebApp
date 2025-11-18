import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../../components/Widgets/ModalDisplayTemplateA';

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAeditInvitationModal) > hr {
    display: none !important;
  }
`;

const WidenEditModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAeditInvitationModal) {
    max-width: 860px !important;
    width: 96% !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAeditInvitationModal) {
    border-radius: 14px !important;
  }
`;

const EditInvitationModal = ({
  isOpen,
  onClose,
  draftInvite,
  setDraftInvite,
  initialInvite,
  onSave,
  notify,
  selectedPoliticianId,
}) => {
  const handleCopyInviteBody = async () => {
    try {
      await navigator.clipboard.writeText(
        `${draftInvite}\n\nhttps://wevote.us/join/${selectedPoliticianId}`
      );
      notify('Invitation copied to clipboard. Press ⌘V / Ctrl+V to paste.', true);
    } catch {
      notify('Copy failed. Select the text and copy manually.', false, 3000);
    }
  };

  if (!isOpen) return null;

  const dialogTitleJSX = (
    <HeaderRow>
      <Title id="edit-title">Edit invitation</Title>
    </HeaderRow>
  );

  const textFieldJSX = (
    <div style={{ padding: '18px 18px 28px' }}>
      <BarBetween>
        <ManageInfoRow>
          <InfoDot aria-hidden>i</InfoDot>
          <span>Link will appear below text</span>
        </ManageInfoRow>
        <HeaderLink type="button" onClick={handleCopyInviteBody}>
          <CopyIcon fontSize="small" />
          <span>Copy</span>
        </HeaderLink>
      </BarBetween>

      <EditAreaWrapper>
        <EditTextArea
          value={draftInvite}
          onChange={(e) => setDraftInvite(e.target.value)}
          aria-label="Invitation text"
        />
      </EditAreaWrapper>

      <ModalFooter>
        <EditCloseButton type="button" onClick={onClose}>Close</EditCloseButton>
        <PrimarySaveBtn
          type="button"
          onClick={onSave}
          disabled={draftInvite.trim() === initialInvite.trim()}
        >
          Save invitation
        </PrimarySaveBtn>
      </ModalFooter>
    </div>
  );

  return (
    <>
      <HideTemplateADivider />
      <WidenEditModal />
      <SoftenCorners />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={onClose}
        externalUniqueId="editInvitationModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
    </>
  );
};

EditInvitationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  draftInvite: PropTypes.string.isRequired,
  setDraftInvite: PropTypes.func.isRequired,
  initialInvite: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  selectedPoliticianId: PropTypes.string.isRequired,
};

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

const BarBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 12px;
`;

const EditAreaWrapper = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 10px;
  min-height: 260px;
  overflow: hidden;
  margin-bottom: 18px;
`;

const EditTextArea = styled.textarea`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.neutralUI900};
  font: inherit;
  min-height: 300px;
  outline: none;
  padding: 14px;
  resize: vertical;
  width: 100%;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const EditCloseButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  padding: 10px 18px;
  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const PrimarySaveBtn = styled.button`
  background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border: 1px solid ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  padding: 10px 18px;
  &:hover {
    background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
    border-color: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
  }
`;

export default EditInvitationModal;

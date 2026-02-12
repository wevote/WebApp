import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Info } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateB from '../Widgets/ModalDisplayTemplateB';

export default function ConfirmCloseModal ({
  isOpen,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      <HideDivider />
      <SoftenCorners />
      <RemoveTopPadding />
      <ModalDisplayTemplateB
        show={isOpen}
        toggleModal={onCancel}
        externalUniqueId="confirmCloseModal"
        textFieldJSX={(
          <Content>
            <MessageRow>
              <StyledInfoIcon />
              <Message>
                You have not sent any invites.
                <br />
                Are you sure you want to close?
              </Message>
            </MessageRow>
            <ButtonRow>
              <TextButton onClick={onConfirm}>
                Yes, close
              </TextButton>
              <CloseButton onClick={onCancel}>
                No, go back
              </CloseButton>
            </ButtonRow>
          </Content>
        )}
        tallMode={false}
      />
    </>
  );
}

ConfirmCloseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// Global Styles
const HideDivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateBconfirmCloseModal) > hr {
    display: none !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) {
    border-radius: 20px !important;
  }
`;

const RemoveTopPadding = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) .MuiDialogContent-root {
    padding-top: 0 !important;
    overflow: visible !important;
  }
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) .MuiDialogContent-root > div {
    margin-top: 0 !important;
  }
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) {
    overflow: visible !important;
  }
`;

// Styles

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: -14px;
  margin-bottom: -8px;
`;

const CloseButton = styled.button`
  background: ${DesignTokenColors.primary700};
  padding: 10px 18px;
  color: white;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  &:hover {
    background: ${DesignTokenColors.primary800};
  }
`;

const Content = styled.div`
  padding: 0 22px 18px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px;
`;

const Message = styled.div`
  font-size: 17px;
`;

const MessageRow = styled.div`
  display: flex;
  gap: 2px;
  align-items: flex-start;
  margin-top: -12px;
`;

const StyledInfoIcon = styled(Info)`
  color: ${DesignTokenColors.neutralUI600};
  margin-right: 5px;
  flex-shrink: 0;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  margin-right: 25px;
  font-size: 16px;
  &:hover {
    text-decoration: underline;
  }
`;

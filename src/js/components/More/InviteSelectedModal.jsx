import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { CheckCircle, Warning, Visibility } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

import ConfirmCloseModal from './ConfirmCloseModal';

export default function InviteSelectedModal ({
  isOpen,
  toggleModal,
  voters,
  onInviteEmail,
  onInviteText,
  onOpenPreview,
  onRemove,
}) {
  // Set to true to use hard-coded test data
  const TEST_MODE = false;

  if (TEST_MODE) {
    voters = [
      { id: 1, name: 'John Smith', email: 'jd@email.com', phone: '(212)-123-4567' },
      { id: 2, name: 'Jane Smith', email: 'jd@email.com', phone: '(213)-123-4567' },
      { id: 3, name: 'Kate Smith', email: null, phone: null },
      { id: 4, name: 'John Doooooooooooough', email: 'jd@email.com', phone: '(213)-123-4567' },
      { id: 5, name: 'Jane Dough', email: 'jd@email.com', phone: null },
      { id: 6, name: 'Belcalis Almanzar', email: null, phone: '(213)-123-4567' },
      { id: 7, name: 'Ricardo Reynoso', email: 'rr@email.com', phone: null },
      { id: 8, name: 'Jalen Richardson', email: 'jr@email.com', phone: '(213)-123-4567' },
      { id: 9, name: 'Michael Montgomery', email: null, phone: null },
    ];
  }

  const count = voters.length;

  // Categorizing voters with missing contact info
  const missingEmail = voters.filter((v) => !v.email);
  const missingEmailOnly = voters.filter((v) => !v.email && v.phone);
  const missingPhoneOnly = voters.filter((v) => v.email && !v.phone);
  const missingBoth = voters.filter((v) => !v.email && !v.phone);

  const missingEmailCount = missingEmail.length;
  const missingEmailOnlyCount = missingEmailOnly.length;
  const missingPhoneOnlyCount = missingPhoneOnly.length;
  const missingBothCount = missingBoth.length;

  const hasAnyMissingInfo = missingEmailOnlyCount > 0 || missingPhoneOnlyCount > 0 || missingBothCount > 0;

  // State management
  const [batchEmailSent, setBatchEmailSent] = React.useState(false);
  const [emailSentIds, setEmailSentIds] = React.useState(new Set());
  const [textSentIds, setTextSentIds] = React.useState(new Set());
  const [showConfirmClose, setShowConfirmClose] = React.useState(false);

  // Event handlers
  const handleSendBatchEmail = () => {
    if (onInviteEmail) {
      onInviteEmail(voters);
    }
    setBatchEmailSent(true);
    setEmailSentIds(new Set(voters.map(v => v.id || v._idx)));
  };

  const handleSendText = (voter) => {
    if (onInviteText) {
      onInviteText([voter]);
    }
    setTextSentIds((prev) => new Set(prev).add(voter.id || voter._idx));
  };

  const handleClose = () => {
    if (emailSentIds.size === 0 && textSentIds.size === 0) {
      setShowConfirmClose(true);
    } else {
      toggleModal();
    }
  };

  const handleConfirmClose = () => {
    toggleModal();
    setShowConfirmClose(false);
  };

  const renderClickableNames = (voters) => {
    return voters.map((v, index) => (
      <React.Fragment key={v.id || v._idx || index}>
        {index > 0 && ', '}
        <ClickableName onClick={() => console.log('TODO: implement voter edit', v.name)}>
          {v.name || 'Unknown'}
        </ClickableName>
      </React.Fragment>
    ));
  };

  const dialogTitleJSX = (
    <HeaderRow>
      <Title>Invite by email and/or text&nbsp;</Title>
      <Count>
        (
        {count}
        voter
        {count > 1 ? 's' : ''}
        selected
        )
      </Count>
    </HeaderRow>
  );

  const textFieldJSX = (
    <Container>
      <TopRow>
        <IntroList>
          <li>Batch invites can only be sent via email.</li>
          <li>Send text invites separately for each supporter.</li>
        </IntroList>
        <HeaderDivider />
        <PreviewButton
          onClick={() => {
            toggleModal();
            onOpenPreview();
          }}
        >
          <Visibility />
          <span>Preview invitation</span>
        </PreviewButton>
      </TopRow>

      {hasAnyMissingInfo && (
        <WarningBox>
          <Warning size={18} style={{ flexShrink: 0, alignSelf: 'flex-start' }} />
          <WarningList>
            {missingEmailOnlyCount > 0 && (
              <li>
                Email not entered for
                {missingEmailOnlyCount}
                voter
                {missingEmailOnlyCount > 1 && 's'}
                :
                {' '}
                {renderClickableNames(missingEmailOnly)}
              </li>
            )}
            {missingPhoneOnlyCount > 0 && (
              <li>
                Mobile phone not entered for
                {missingPhoneOnlyCount}
                voter
                {missingPhoneOnlyCount > 1 && 's'}
                :
                {' '}
                {renderClickableNames(missingPhoneOnly)}
              </li>
            )}
            {missingBothCount > 0 && (
              <>
                <li>
                  <span style={{ color: DesignTokenColors.neutralUI400 }}>
                    {missingBothCount}
                    voter
                    {missingBothCount > 1 && 's'}
                    cannot be invited (no email or mobile phone entered) -
                  </span>
                </li>
                <div>
                  not selectable:
                  {renderClickableNames(missingBoth)}
                </div>
              </>
            )}
          </WarningList>
        </WarningBox>
      )}

      <SectionTitleRow>Batch-invite by email</SectionTitleRow>
      {batchEmailSent ? (
        <SentStatus style={{ marginBottom: '20px' }}>
          <SuccessIcon />
          Sent
        </SentStatus>
      ) : (
        <>
          <SendButton onClick={handleSendBatchEmail}>
            Send email invite to
            {count}
            supporter
            {count > 1 && 's'}
          </SendButton>
          {missingEmailCount > 0 && (
            <WarningBox style={{ marginTop: '8px', marginBottom: '30px', paddingLeft: '0' }}>
              <Warning size={18} style={{ flexShrink: 0 }} />
              <span>
                No email entered for:
                {renderClickableNames(missingEmail)}
              </span>
            </WarningBox>
          )}
        </>
      )}

      <SectionTitleRow>
        <SectionTitle>Invite by text</SectionTitle>
        <SmallDivider />
        <SmallActionLink onClick={() => console.log('TODO: send list to phone')}>
          Send list to phone
        </SmallActionLink>
      </SectionTitleRow>
      {voters.map((v) => {
        const id = v.id || v._idx;
        return (
          <VoterRow key={id}>
            <VoterName>{v.name}</VoterName>
            {v.phone ? (
              textSentIds.has(id) ? (
                <SentButton>
                  <SuccessIcon />
                  Text invite sent
                </SentButton>
              ) : (
                <SendTextButton onClick={() => handleSendText(v)}>
                  Send text invite
                </SendTextButton>
              )
            ) : (
              <MissingPhone onClick={() => console.log('TODO: implement add phone number')}>
                <Warning size={18} />
                <span>Enter mobile phone</span>
              </MissingPhone>
            )}

            <EmailStatus>
              {emailSentIds.has(id) && (
                <SentStatus>
                  <SuccessIcon />
                  Email sent
                </SentStatus>
              )}
            </EmailStatus>

            <Remove
              disabled={count === 1}
              onClick={() => count > 1 && onRemove(v)}
            >
              Remove from list
            </Remove>
          </VoterRow>
        );
      })}

      <Footer>
        <CloseButton type="button" onClick={handleClose}>
          Close
        </CloseButton>
      </Footer>
    </Container>
  );

  return (
    <>
      <ChangeTitleFont />
      <HideTemplateADivider />
      <WidenInviteModal />
      <SoftenCorners />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={toggleModal}
        externalUniqueId="inviteSelectedModal"
        dialogTitleJSX={dialogTitleJSX}
        textFieldJSX={textFieldJSX}
        tallMode={false}
      />

      {/* Confirm-close modal if no invites sent */}
      <ConfirmCloseModal
        isOpen={showConfirmClose}
        onConfirm={handleConfirmClose}
        onCancel={() => setShowConfirmClose(false)}
      />
    </>
  );
}

InviteSelectedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  voters: PropTypes.array.isRequired,
  onInviteEmail: PropTypes.func.isRequired,
  onInviteText: PropTypes.func.isRequired,
  onOpenPreview: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

// Global Styles

const ChangeTitleFont = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAinviteSelectedModal) * {
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
    font-weight: 400 !important;
  }
`;

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAinviteSelectedModal) > hr {
    display: none !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAinviteSelectedModal) {
    border-radius: 14px !important;
  }
`;

const WidenInviteModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAinviteSelectedModal) {
    max-width: 860px !important;
    width: 96% !important;
  }
`;

// Styles

const ClickableName = styled.span`
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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

const Container = styled.div`
  padding: 0 22px 24px;
`;

const Count = styled.h3`
  font-size: 16px;
  font-weight: 500;
`;

const EmailStatus = styled.span`
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
`;

const HeaderDivider = styled.div`
  width: 1.5px;
  height: 60px;
  background: ${DesignTokenColors.neutralUI100};
  margin: 0 6px;
  align-self: center;
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 12px 0 18px;
`;

const IntroList = styled.ul`
  padding-left: 18px;
  line-height: 1.45;
  margin: 0 4px 0 0;
`;

const MissingPhone = styled.div`
  display: flex;
  height: 42px;
  align-items: center;
  padding: 6px 0;
  gap: 6px;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  font-size: 14px;
  width: fit-content;
  &:hover { text-decoration: underline; }

  svg { color: ${DesignTokenColors.tertiary900}; }
`;

const PreviewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  color: ${DesignTokenColors.primary700};
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  padding: 6px 8px;
  &:hover {
    text-decoration: underline;
  }
  svg { font-size: 22px; }
`;

const Remove = styled.span`
  justify-self: end;
  color: ${(props) => (props.disabled ? DesignTokenColors.neutralUI300 : DesignTokenColors.primary700)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  text-align: right;
  padding-right: 10px;
  &:hover {
    text-decoration: ${(props) => (props.disabled ? 'none' : 'underline')};
  }
`;

const SectionTitle = styled.h3`
  font-size: 19px;
  font-weight: 500;
  margin: 0;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 20px 0 5px;
  font-size: 19px;
  font-weight: 500;
`;

const SendButton = styled.button`
  background: ${DesignTokenColors.primary700};
  border: 1px solid ${DesignTokenColors.primary700};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  padding: 0 16px;
  font-size: 12px;
  height: 42px;
  width: fit-content;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  &:hover {
    background: ${DesignTokenColors.primary800};
    border-color: ${DesignTokenColors.primary800};
  }
`;

const SendTextButton = styled(SendButton)`
  font-size: 13px;
  width: 150px;
`;

const SentButton = styled(SendTextButton)`
  background: ${DesignTokenColors.neutralUI50};
  border-color: ${DesignTokenColors.neutralUI50};
  color: ${DesignTokenColors.neutralUI500};
  cursor: default;
  pointer-events: none;
  &:hover {
    background: ${DesignTokenColors.neutralUI100};
    border-color: ${DesignTokenColors.neutralUI100};
  }
`;

const SmallActionLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary700};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  &:hover { text-decoration: underline; }
`;

const SmallDivider = styled.div`
  width: 1.5px;
  height: 25px;
  background: ${DesignTokenColors.neutralUI100};
  margin: 0 6px;
  align-self: center;
`;

const SuccessIcon = styled(CheckCircle)`
  color: ${DesignTokenColors.confirmation500};
  display: inline-flex;
  font-size: 18px;
  line-height: 1;
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 14px;
`;

const VoterName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SentStatus = styled(VoterName)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const VoterRow = styled.div`
  border-bottom: 2px solid ${DesignTokenColors.neutralUI100};
  padding: 12px 0;
  display: grid;
  grid-template-columns: 95px 170px auto 1fr;
  align-items: center;
  column-gap: 24px;
`;

const WarningBox = styled.div`
  padding-left: 18px;
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin: 0 8px 14px 0;
  font-size: 15px;
  svg {
    color: ${DesignTokenColors.tertiary900};
    margin-top: 0;
    align-self: flex-start;
  }
`;

const WarningList = styled.ul`
  margin: 0;
  padding-left: 18px;
  line-height: 1.45;
  li {
    margin-bottom: 4px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

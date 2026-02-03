import React, { Suspense, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Visibility as EyeIcon,
  Facebook as FacebookIcon,
  X as XIcon,
  FileUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  PersonOutline as PersonIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

import EditInvitationModal from '../../components/More/EditInvitationModal';
import PasteListModal from '../../components/More/PasteListModal';
import PreviewInvitationModal from '../../components/More/PreviewInvitationModal';
import UploadCSVModal from '../../components/More/UploadCSVModal';
import EnterOneByOneModal from '../../components/More/EnterOneByOneModal';

const ImportedVotersList = React.lazy(() => import('../../components/PoliticiansManaged/ImportedVotersList'));

export default function ManageMyCandidates ({ selectedPolitician, selectedPoliticianWeVoteId }) {
  const [invitationBody, setInvitationBody] = useState(`Hello friend,

We’d like to invite you to join WeVote to help support ${selectedPolitician?.politician_name || 'our campaign'}.
Thanks for your help!`);

  // Modal visibility
  const [showEdit, setShowEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [showEnterOne, setShowEnterOne] = useState(false);

  // Mobile import dropdown toggle
  const [mobileImportDropdown, setMobileImportDropdown] = useState(true);

  const [importedVoters, setImportedVoters] = useState([]);

  // One-by-one inputs
  const [oneName, setOneName] = useState('');
  const [oneEmail, setOneEmail] = useState('');
  const [onePhone, setOnePhone] = useState('');

  // Toast notifications
  const [copiedMsg, setCopiedMsg] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);
  const toastTimerRef = useRef(null);
  const idRef = useRef(1);
  const makeVoterRecord = useCallback((partial, source = 'Paste list') => ({
    id: `v_${Date.now()}_${idRef.current++}`,
    addedAt: new Date().toISOString(),
    addedBy: 'You',
    source,
    ...partial,
  }), []);
  const notify = useCallback((msg, success = true) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setIsSuccessToast(success);
    setCopiedMsg(msg);
    toastTimerRef.current = setTimeout(() => { setCopiedMsg(''); setIsSuccessToast(false); }, 2200);
  }, []);

  const handlePreviewOpen = () => setShowPreview(true);
  const handlePreviewClose = () => setShowPreview(false);
  const openEditModal = () => setShowEdit(true);
  const handleEditInvite = () => {
    setShowPreview(false);
    openEditModal();
  };

  const handleSaveInvitation = (newInvitationBody) => {
    setInvitationBody(newInvitationBody);
    setShowEdit(false);
    notify('Invitation updated.', true);
  };

  const emailRE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  // const handleInviteSelected = useCallback((rows) => {
  //   notify(`Invited ${rows.length} voter${rows.length === 1 ? '' : 's'} by email.`);
  // }, [notify]);

  const handleInviteEmailOneOrMany = useCallback((rows) => {
    notify(`Email invite sent to ${rows.length} voter${rows.length === 1 ? '' : 's'}.`);
  }, [notify]);

  const handleInviteTextOneOrMany = useCallback((rows) => {
    notify(`Text invite sent to ${rows.length} voter${rows.length === 1 ? '' : 's'}.`);
  }, [notify]);

  const handleHideOne = useCallback((row) => {
    setImportedVoters((p) => p.filter((r) => (r.id || r._idx) !== (row.id || row._idx)));
    notify('Hidden from list.', true);
  }, [notify]);

  const handleHideMany = useCallback((rows) => {
    const ids = new Set(rows.map((r) => r.id || r._idx));
    setImportedVoters((p) => p.filter((r) => !ids.has(r.id || r._idx)));
    notify(`Hidden ${rows.length} item${rows.length === 1 ? '' : 's'}.`, true);
  }, [notify]);

  const handleCopyInviteBody = async () => {
    try {
      await navigator.clipboard.writeText(`${invitationBody}\n\nhttps://wevote.us/join/${selectedPoliticianWeVoteId}`);
      const message = window.innerWidth >= 576 ?
        'Invitation copied to clipboard. Press ⌘V / Ctrl+V to paste.' :
        'Invitation copied to clipboard.';
      notify(message, true);
    } catch {
      notify('Copy failed. Select the text and copy manually.', false, 3000);
    }
  };

  const handleImportOne = useCallback(() => {
    const name = oneName.trim();
    const email = oneEmail.trim();
    const phone = onePhone.trim();

    if (!emailRE.test(email)) { notify('Enter a valid email.', false); return; }

    setImportedVoters((prev) => [
      ...prev,
      makeVoterRecord({ name, email, phone }, 'Manual entry'),
    ]);

    setOneName(''); setOneEmail(''); setOnePhone('');
    notify('Voter added. Ready to invite.', true);
  }, [oneName, oneEmail, onePhone, notify, makeVoterRecord, emailRE]);

  const handleImportFromPaste = (rows) => {
    setImportedVoters((prev) => [...prev, ...rows.map((r) => makeVoterRecord(r, 'Paste list'))]);
    notify(`Imported ${rows.length} voter${rows.length !== 1 ? 's' : ''} from pasted list.`, true);
    setShowPaste(false);
  };

  const handleImportFromCSV = (rows) => {
    setImportedVoters(rows.map((r) => makeVoterRecord(r, 'CSV upload')));
    setShowUpload(false);
    notify('All of your columns will be imported.', true);
  };

  const handleImportFromEnterOne = (rows) => {
    setImportedVoters((prev) => [...prev, ...rows.map((r) => makeVoterRecord(r, 'One-by-one'))]);
    notify(`Imported ${rows.length} voter${rows.length !== 1 ? 's' : ''}.`, true);
  };

  return (
    <>
      <H2 className="u-show-desktop-tablet">Import &amp; invite voters</H2>

      {/* Desktop and tablet invitation action strip */}
      <InviteRow className="u-show-desktop-tablet">
        <InviteText>Import voters, then invite them to join WeVote.</InviteText>
        <InviteDivider />
        <InviteLabel>Invitation:</InviteLabel>
        <IconButton type="button" title="Copy invitation" onClick={handleCopyInviteBody}>
          <CopyIcon fontSize="small" />
        </IconButton>
        <IconButton type="button" title="Preview invitation" onClick={handlePreviewOpen}>
          <EyeIcon fontSize="small" />
        </IconButton>
        <IconButton type="button" title="Edit invitation" onClick={openEditModal}>
          <EditIcon fontSize="small" />
        </IconButton>
        <InviteLabel>Post to:</InviteLabel>
        <SocialIconButton type="button" aria-label="Post to Facebook">
          <FacebookIcon fontSize="small" />
        </SocialIconButton>
        <SocialIconButton type="button" aria-label="Post to X">
          <XIcon fontSize="small" />
        </SocialIconButton>
      </InviteRow>

      {/* Mobile invitation action strip */}
      <MobileInviteContainer className="u-show-mobile">
        <MobileInviteText>Import voters, then invite them to join WeVote.</MobileInviteText>
        <MobileInviteActions>
          <LeftGroup>
            <InviteLabel>Invitation:</InviteLabel>
            <IconButton type="button" title="Copy invitation" onClick={handleCopyInviteBody}>
              <CopyIcon fontSize="small" />
            </IconButton>
            <IconButton type="button" title="Preview invitation" onClick={handlePreviewOpen}>
              <EyeIcon fontSize="small" />
            </IconButton>
            <IconButton type="button" title="Edit invitation" onClick={openEditModal}>
              <EditIcon fontSize="small" />
            </IconButton>
          </LeftGroup>

          <InviteDivider />

          <RightGroup>
            <InviteLabel>Post to:</InviteLabel>
            <SocialIconButton type="button" aria-label="Post to Facebook">
              <FacebookIcon fontSize="small" />
            </SocialIconButton>
            <SocialIconButton type="button" aria-label="Post to X">
              <XIcon fontSize="small" />
            </SocialIconButton>
          </RightGroup>
        </MobileInviteActions>
      </MobileInviteContainer>

      <HorizontalDivider className="u-show-mobile" />

      {/* Mobile import section */}
      <MobileImportSection className="u-show-mobile">
        {importedVoters.length === 0 && (
          <EmptyVotersText>
            <span>You don&#39;t have any voters to invite yet.</span>
            <span>Import your voter list using an option below to get started.</span>
          </EmptyVotersText>
        )}

        {!mobileImportDropdown ? (
          <CollapsedButton type="button" onClick={() => setMobileImportDropdown(true)}>
            <StyledImportInviteIcon />
            Import voters
          </CollapsedButton>
        ) : (
          <ImportVotersCard>
            <ImportVotersHeader>
              <ImportVotersTitle>
                <StyledImportInviteIcon />
                Import voters
              </ImportVotersTitle>
              <CloseButton type="button" onClick={() => setMobileImportDropdown(false)}>
                <CloseIcon fontSize="small" />
              </CloseButton>
            </ImportVotersHeader>

            <ImportOptionsGrid>
              <ImportOptionWrapper>
                <ImportOptionButton type="button" onClick={() => setShowUpload(true)}>
                  <UploadIcon />
                </ImportOptionButton>
                <ImportOptionLabel>Upload CSV file</ImportOptionLabel>
              </ImportOptionWrapper>
              <ImportOptionWrapper>
                <ImportOptionButton type="button" onClick={() => setShowPaste(true)}>
                  <PasteListIcon />
                </ImportOptionButton>
                <ImportOptionLabel>Paste list</ImportOptionLabel>
              </ImportOptionWrapper>
              <ImportOptionWrapper>
                <ImportOptionButton type="button"
                  onClick={() => {
                    setShowEnterOne(true);
                    setMobileImportDropdown(false);
                  }}
                >
                  <PersonIcon />
                </ImportOptionButton>
                <ImportOptionLabel>Enter one-by-one</ImportOptionLabel>
              </ImportOptionWrapper>
            </ImportOptionsGrid>
          </ImportVotersCard>
        )}
      </MobileImportSection>

      <Section className="u-show-desktop-tablet">
        <H3>Enter voters one-by-one</H3>
        <Row>
          <Input placeholder="First and last name" value={oneName} onChange={(e) => setOneName(e.target.value)} />
          <Input placeholder="Email" value={oneEmail} onChange={(e) => setOneEmail(e.target.value)} />
          <Input placeholder="Mobile phone" value={onePhone} onChange={(e) => setOnePhone(e.target.value)} />
          <PrimaryButton
            type="button"
            onClick={handleImportOne}
            disabled={!oneName.trim() || !emailRE.test(oneEmail)}
          >
            Import voter
          </PrimaryButton>
        </Row>
      </Section>

      <Section className="u-show-desktop-tablet">
        <H3>Upload voters from a file or paste a list</H3>
        <Row>
          <PillButton type="button" onClick={() => setShowUpload(true)}>
            <UploadIcon fontSize="small" />
            Upload CSV file
          </PillButton>
          <Or>OR</Or>
          <PillButton type="button" onClick={() => setShowPaste(true)}>
            <PasteListIcon size={22} />
            Paste list
          </PillButton>
        </Row>
      </Section>

      {importedVoters.length === 0 ? (
        <MutedNote className="u-show-desktop-tablet">
          You don’t have any voters to invite. Import some using the options above.
        </MutedNote>
      ) : (
        <Suspense fallback={<></>}>
          <ImportedVotersList
            voters={importedVoters.map((v, _idx) => ({ _idx, ...v }))} // ensure stable key if no id
            // onInviteSelected={handleInviteSelected}
            onInviteEmail={handleInviteEmailOneOrMany}
            onInviteText={handleInviteTextOneOrMany}
            onHide={handleHideOne}
            onHideSelected={handleHideMany}
            onOpenPreview={handlePreviewOpen}
          />
        </Suspense>
      )}

      {/* Preview modal */}
      <PreviewInvitationModal
        isOpen={showPreview}
        onClose={handlePreviewClose}
        invitationBody={invitationBody}
        selectedPoliticianId={selectedPoliticianWeVoteId}
        onEdit={handleEditInvite}
        notify={notify}
      />
      {/* Edit modal */}
      <EditInvitationModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        invitationBody={invitationBody}
        onSave={handleSaveInvitation}
        notify={notify}
        selectedPoliticianId={selectedPoliticianWeVoteId}
      />
      {/* Paste list modal */}
      <PasteListModal
        isOpen={showPaste}
        onClose={() => setShowPaste(false)}
        onImport={handleImportFromPaste}
      />
      {/* Upload CSV modal */}
      <UploadCSVModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onImport={handleImportFromCSV}
        notify={notify}
      />
      {/* Enter one-by-one modal */}
      <EnterOneByOneModal
        isOpen={showEnterOne}
        onClose={() => setShowEnterOne(false)}
        onImport={handleImportFromEnterOne}
        notify={notify}
      />
      {copiedMsg && createPortal(
        <Toast role="status" aria-live="polite" $success={isSuccessToast}>
          {isSuccessToast && (
            <SuccessIcon><CheckIcon fontSize="small" /></SuccessIcon>
          )}
          <span>{copiedMsg}</span>
        </Toast>,
        document.body,
      )}
    </>
  );
}

// Import & invite icon
const ImportInviteIcon = ({ size = 22, title = 'Import & invite', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path
      d="M16.8333 15V16.6667H6.83333V15C6.83333 15 6.83333 11.6667 11.8333 11.6667C16.8333 11.6667 16.8333 15 16.8333 15ZM14.3333 7.5C14.3333 7.00555 14.1867 6.5222 13.912 6.11108C13.6373 5.69995 13.2469 5.37952 12.79 5.1903C12.3332 5.00108 11.8306 4.95157 11.3456 5.04804C10.8607 5.1445 10.4152 5.3826 10.0656 5.73223C9.71593 6.08187 9.47783 6.52732 9.38137 7.01228C9.28491 7.49723 9.33441 7.99989 9.52363 8.45671C9.71285 8.91352 10.0333 9.30397 10.4444 9.57867C10.8555 9.85338 11.3389 10 11.8333 10C12.4964 10 13.1323 9.73661 13.6011 9.26777C14.0699 8.79893 14.3333 8.16304 14.3333 7.5ZM17 11.7167C17.4555 12.1369 17.8228 12.6437 18.0803 13.2074C18.3379 13.7712 18.4805 14.3805 18.5 15V16.6667H21V15C21 15 21 12.125 17 11.7167ZM16 5C15.7482 5.00002 15.498 5.03938 15.2583 5.11667C15.7459 5.81581 16.0073 6.64765 16.0073 7.5C16.0073 8.35235 15.7459 9.18419 15.2583 9.88333C15.498 9.96062 15.7482 9.99999 16 10C16.663 10 17.2989 9.73661 17.7678 9.26777C18.2366 8.79893 18.5 8.16304 18.5 7.5C18.5 6.83696 18.2366 6.20107 17.7678 5.73223C17.2989 5.26339 16.663 5 16 5ZM7.66667 9.16667H5.16667V6.66667H3.5V9.16667H1V10.8333H3.5V13.3333H5.16667V10.8333H7.66667V9.16667Z"
      fill="currentColor"
    />
  </svg>
);

// Paste-list icon
const PasteListIcon = ({ size = 22, title = 'Paste list', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path
      d="M18.8125 3C19.1922 3 19.5 3.3078 19.5 3.6875V18.8125C19.5 19.1922 19.1922 19.5 18.8125 19.5H3.6875C3.3078 19.5 3 19.1922 3 18.8125V3.6875C3 3.3078 3.3078 3 3.6875 3H18.8125ZM4.375 18.125H18.125V4.375H4.375V18.125ZM14 14V15.375H5.75V14H14ZM16.75 14V15.375H15.375V14H16.75ZM14 10.5625V11.9375H5.75V10.5625H14ZM16.75 10.5625V11.9375H15.375V10.5625H16.75ZM14 7.125V8.5H5.75V7.125H14ZM16.75 7.125V8.5H15.375V7.125H16.75Z"
      fill="currentColor"
    />
  </svg>
);

const H2 = styled.h2`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 10px;
`;

const H3 = styled.h3`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const IconButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  padding: 6px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;

const Input = styled.input`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 10px;
  flex: 1 1 220px;
  min-width: 220px;
  padding: 12px 14px;

  @media (min-width: 1024px) {
    flex: 0 0 260px;
  }

  &:focus-visible { outline: 2px solid ${DesignTokenColors.primary500}; outline-offset: 2px; }
`;

const InviteDivider = styled.span`
  border-left: 1.5px solid ${DesignTokenColors.neutralUI100};
  height: 30px;
  margin: 0 4px;

  @media (min-width: 576px) {
    border-left-width: 1px;
    border-left-color: ${DesignTokenColors.neutralUI200};
    height: 16px;
    margin: 0 2px 0 4px;
  }
`;

const InviteRow = styled.div`
  align-items: center;
  color: ${DesignTokenColors.neutralUI700};
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 4px 0 12px;
`;

const InviteText = styled.span`
  color: ${DesignTokenColors.neutralUI700};
  flex: 0 1 auto;
  margin: 0;
`;

const InviteLabel = styled.span`
  color: ${DesignTokenColors.neutralUI600};
  font-weight: 400;
  font-size: 14px;

  @media (min-width: 576px) {
    color: ${DesignTokenColors.neutralUI700};
    font-weight: 500;
    font-size: 16px;
  }
`;

const MutedNote = styled.p`
  color: ${DesignTokenColors.neutralUI600};
  margin: 40px 0 0;
`;

const Or = styled.span`
  color: ${DesignTokenColors.neutralUI600};
`;

const PrimaryButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.primary600};
  border-radius: 9999px;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  padding: 10px 18px;
  white-space: nowrap;

  &:hover { background: ${DesignTokenColors.primary50}; }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const PillButton = styled(PrimaryButton)`
  align-items: center;
  display: inline-flex;
  font-weight: 500;
  gap: 8px;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  @media (min-width: 1024px) {
    flex-wrap: nowrap;
  }
`;

const Section = styled.section`
  margin: 16px 0 22px;
`;

const SocialIconButton = styled(IconButton)`
  color: ${DesignTokenColors.neutralUI800};
`;

const SuccessIcon = styled.span`
  color: ${DesignTokenColors.confirmation500};
  display: inline-flex;
  line-height: 1;
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

// Mobile-only styles

const CloseButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: flex;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    color: black;
  }
`;

const CollapsedButton = styled.button`
  align-items: center;
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.primary600};
  border-radius: 9999px;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
  justify-content: center;
  padding: 4px 16px;
  margin: 0 auto;

  &:hover {
    background: ${DesignTokenColors.primary50};
  }
`;

const EmptyVotersText = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 14px;
  margin: 0 0 24px;
  text-align: center;
  span {
    display: block;
    &:first-child {
      margin-bottom: 4px;
    }
  }
`;

const HorizontalDivider = styled.div`
  border-bottom: 1.5px solid ${DesignTokenColors.neutralUI100};
  margin: 0 12px;
`;

const ImportOptionButton = styled.button`
  align-items: center;
  background: ${DesignTokenColors.whiteUI};
  border: 1.5px solid ${DesignTokenColors.primary600};
  border-radius: 50%;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  display: flex;
  height: 64px;
  justify-content: center;
  width: 64px;
  transition: all 0.2s ease;

  svg {
    width: 60%;
    height: 60%;
  }

  &:hover {
    background: ${DesignTokenColors.primary50};
    border-color: ${DesignTokenColors.primary700};
  }
`;

const ImportOptionLabel = styled.span`
  color: ${DesignTokenColors.primary700};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const ImportOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-bottom: 10px;
`;

const ImportOptionWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ImportVotersCard = styled.div`
  background: ${DesignTokenColors.neutralUI50};
  border-radius: 20px;
  padding: 12px 16px 16px;
`;

const ImportVotersHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const ImportVotersTitle = styled.h3`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
`;

const LeftGroup = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const MobileImportSection = styled.div`
  margin: 24px 0;
`;

const MobileInviteActions = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
`;

const MobileInviteContainer = styled.div`
  margin: 0 0 16px;
`;

const MobileInviteText = styled.p`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 14px;
  margin: 0 0 16px;
  text-align: center;
`;

const RightGroup = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
`;

const StyledImportInviteIcon = styled(ImportInviteIcon)`
  align-items: center;
  color: inherit;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  width: 24px;
`;

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {createPortal} from 'react-dom';
import styled from 'styled-components';
import {
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Visibility as EyeIcon,
  Facebook as FacebookIcon,
  X as XIcon,
  FileUpload as UploadIcon,
  CheckCircle as CheckIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

import EditInvitationModal from '../../components/More/EditInvitationModal';
import PasteListModal from '../../components/More/PasteListModal';
import PreviewInvitationModal from '../../components/More/PreviewInvitationModal';
import UploadCSVModal from '../../components/More/UploadCSVModal';

const ImportedVotersList = React.lazy(() => import('../../components/PoliticiansManaged/ImportedVotersList'));

export default function ManageMyCandidates ({ selectedPolitician, selectedPoliticianWeVoteId }) {
  const [invitationBody, setInvitationBody] = useState(`Hello friend,

We’d like to invite you to join WeVote to help support ${selectedPolitician?.politician_name || 'our campaign'}.
Thanks for your help!`);
  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [draftInvite, setDraftInvite] = useState(invitationBody);
  const [initialInvite, setInitialInvite] = useState(invitationBody);
  // Preview modal
  const [showPreview, setShowPreview] = useState(false);
  const handlePreviewOpen = () => setShowPreview(true);
  const handlePreviewClose = () => setShowPreview(false);
  // Upload CSV modal
  const [showUpload, setShowUpload] = useState(false);
  // CSV upload and paste
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pasteErrors, setPasteErrors] = useState([]);
  const [mirrorHTML, setMirrorHTML] = useState('');
  const [importedVoters, setImportedVoters] = useState([]);
  // One-by-one inputs
  const [oneName, setOneName] = useState('');
  const [oneEmail, setOneEmail] = useState('');
  const [onePhone, setOnePhone] = useState('');
  const fileInputRef = useRef(null);
  const [allColumnsOK, setAllColumnsOK] = useState(false);

  const openUploadModal = () => { setAllColumnsOK(false); setShowUpload(true); };
  const closeUploadModal = () => { setAllColumnsOK(false); setShowUpload(false); };
  const handleSelectCSV = () => fileInputRef.current?.click();

  // Reset draft when invitationBody or showEdit changes
  useEffect(() => {
    if (!showEdit) {
      setDraftInvite(invitationBody);
      setInitialInvite(invitationBody);
    }
  }, [invitationBody, showEdit, setDraftInvite, setInitialInvite]);
  const [copiedMsg, setCopiedMsg] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);
  const openEditModal = () => { setInitialInvite(draftInvite); setShowEdit(true); };
  const handleEditInvite = () => {
    setShowPreview(false);
    openEditModal();
  };

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
  const handleInviteSelected = useCallback((rows) => { notify(`Invited ${rows.length} voter${rows.length === 1 ? '' : 's'} by email.`); }, [notify]);
  const handleInviteEmailOneOrMany = useCallback((rows) => { notify(`Email invite sent to ${rows.length} voter${rows.length === 1 ? '' : 's'}.`); }, [notify]);
  const handleInviteTextOneOrMany = useCallback((rows) => { notify(`Text invite sent to ${rows.length} voter${rows.length === 1 ? '' : 's'}.`); }, [notify]);
  const handleHideOne = useCallback((row) => { setImportedVoters((p) => p.filter((r) => (r.id || r._idx) !== (row.id || row._idx))); notify('Hidden from list.', true); }, [notify]);
  const handleHideMany = useCallback((rows) => { const ids = new Set(rows.map((r) => r.id || r._idx)); setImportedVoters((p) => p.filter((r) => !ids.has(r.id || r._idx))); notify(`Hidden ${rows.length} item${rows.length === 1 ? '' : 's'}.`, true); }, [notify]);
  const handleSaveInvite = () => {
    setInvitationBody(draftInvite);
    setShowEdit(false);
    notify('Invitation updated.', true);
  };

  const emailRE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  const escapeHTML = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function parsePastedList (text) {
    const lines = text.split(/\r?\n/);
    const rows = [];
    const errors = [];

    lines.forEach((raw, idx) => {
      const line = raw.trim();
      if (!line) return;

      const parts = line.split(',').map((s) => s.trim()).filter(Boolean);
      const emailCount = (line.match(emailRE) || []).length;

      if (parts.length > 3) {
        errors.push({ line: idx, reason: 'Too many commas' });
        return;
      }
      if (emailCount > 1) {
        errors.push({ line: idx, reason: 'Two emails on one line (missing line break?)' });
        return;
      }
      // Must have at least "Name, Email"
      if (parts.length < 2) {
        errors.push({ line: idx, reason: 'Missing email (format: Name, email[, phone])' });
        return;
      }
      // Validate email
      const emailPart = parts[1].replace(/[<>]/g, '');
      if (!emailRE.test(emailPart)) {
        errors.push({ line: idx, reason: 'Invalid email' });
        return;
      }

      rows.push({
        name: parts[0] || '',
        email: emailPart || '',
        phone: parts[2] || '',
      });
    });

    return { rows, errors };
  }

  function buildMirrorHTML (text, errors) {
    const errSet = new Set(errors.map((e) => e.line));
    return text.split(/\r?\n/).map((line, i) => {
      const isError = errSet.has(i) && line.trim().length > 0;
      const safe = escapeHTML(line);
      return isError ? `<span class="err">${safe}</span>` : safe;
    }).join('\n');
  }

  const handleCopyInviteBody = async () => {
    try {
      await navigator.clipboard.writeText(`${invitationBody}\n\nhttps://wevote.us/join/${selectedPoliticianWeVoteId}`);
      notify('Invitation copied to clipboard. Press ⌘V / Ctrl+V to paste.', true);
    } catch {
      notify('Copy failed. Select the text and copy manually.', false, 3000);
    }
  };

  const handleDownloadSample = () => {
    const csv =
      'Name,Email,Mobile,Address\n' +
      'John Smith,js@gmail.com,"(123) 456-7890","123 State St, Anytown, CA 94117"\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wevote_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
  }, [oneName, oneEmail, onePhone, notify, makeVoterRecord, setImportedVoters]);

  const handleCSVSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.csv$/i.test(file.name)) {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setIsSuccessToast(false);
      setCopiedMsg('Please choose a .csv file.');
      toastTimerRef.current = setTimeout(() => setCopiedMsg(''), 2500);
      e.target.value = '';
      return;
    }
    setShowUpload(true);

    const text = await file.text();
    const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim().length > 0);
    const [headerLine, ...dataLines] = lines;
    const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());

    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');
    const mobileIdx = headers.indexOf('mobile');
    const phoneIdx = headers.indexOf('phone');
    const phoneCol = mobileIdx > -1 ? mobileIdx : phoneIdx;
    const addressIdx = headers.indexOf('address');

    const ok = nameIdx > -1 && emailIdx > -1 && phoneCol > -1 && addressIdx > -1;

    const rows = dataLines.map((line) => {
      const cols = line.split(',').map((supporter) => supporter.trim());
      return {
        name: nameIdx > -1 ? cols[nameIdx] : '',
        email: emailIdx > -1 ? cols[emailIdx] : '',
        phone: phoneCol > -1 ? cols[phoneCol] : '',
        address: addressIdx > -1 ? cols[addressIdx] : '',
      };
    }).filter((r) => r.name || r.email || r.phone || r.address);

    if (ok && rows.length > 0) {
      setImportedVoters(rows.map((r) => makeVoterRecord(r, 'CSV upload')));
      closeUploadModal();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setIsSuccessToast(true);
      setCopiedMsg('All of your columns will be imported.');
      toastTimerRef.current = setTimeout(() => {
        setCopiedMsg('');
        setIsSuccessToast(false);
      }, 2200);
    } else {
      setAllColumnsOK(ok);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setIsSuccessToast(false);
      if (!ok) {
        setCopiedMsg('We could not find all required columns (Name, Email, Mobile/Phone, Address). Please adjust and re-upload.');
      } else if (rows.length === 0) {
        setCopiedMsg('No rows found in this CSV.');
      }
      toastTimerRef.current = setTimeout(() => setCopiedMsg(''), 3000);
    }

    e.target.value = '';
  };

  const handlePasteList = () => {
    setShowPaste(true);
    setPasteErrors([]);
    setMirrorHTML('');
  };

  const closePaste = () => {
    setShowPaste(false);
    setPasteErrors([]);
    setMirrorHTML('');
  };

  const onPasteTextChange = (e) => {
    const { value } = e.target;
    setPasteText(value);
    const { errors } = parsePastedList(value);
    setPasteErrors(errors);
    setMirrorHTML(buildMirrorHTML(value, errors));
  };

  const handlePasteImport = () => {
    const { rows, errors } = parsePastedList(pasteText);
    if (errors.length) {
      setPasteErrors(errors);
      setMirrorHTML(buildMirrorHTML(pasteText, errors));
      return; // block import until fixed
    }
    setImportedVoters((prev) => [...prev, ...rows.map((r) => makeVoterRecord(r, 'Paste list'))]);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setCopiedMsg(`Imported ${rows.length} voter${rows.length !== 1 ? 's' : ''} from pasted list.`);
    toastTimerRef.current = setTimeout(() => setCopiedMsg(''), 2200);
  };

  const prospectiveCount = useMemo(() => parsePastedList(pasteText).rows.length, [pasteText]);

  return (
    <>
      <H2>Import &amp; invite voters</H2>

      {/* Invitation action strip */}
      <InviteRow>
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

      <Section>
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

      <Section>
        <H3>Upload voters from a file or paste a list</H3>
        <Row>
          <PillButton type="button" onClick={openUploadModal}>
            <UploadIcon fontSize="small" />
            Upload CSV file
          </PillButton>
          <Or>OR</Or>
          <PillButton type="button" onClick={handlePasteList}>
            <PasteListIcon size={22} />
            Paste list
          </PillButton>
        </Row>
      </Section>

      {importedVoters.length === 0 ? (
        <MutedNote>
          You don’t have any voters to invite. Import some using the options above.
        </MutedNote>
      ) : (
        <Suspense fallback={<></>}>
          <ImportedVotersList
            voters={importedVoters.map((v, _idx) => ({ _idx, ...v }))} // ensure stable key if no id
            onInviteSelected={handleInviteSelected}
            onInviteEmail={handleInviteEmailOneOrMany}
            onInviteText={handleInviteTextOneOrMany}
            onHide={handleHideOne}
            onHideSelected={handleHideMany}
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
        draftInvite={draftInvite}
        setDraftInvite={setDraftInvite}
        initialInvite={initialInvite}
        onSave={handleSaveInvite}
        notify={notify}
        selectedPoliticianId={selectedPoliticianWeVoteId}
      />
      {/* Paste list modal */}
      <PasteListModal
        isOpen={showPaste}
        onClose={closePaste}
        pasteText={pasteText}
        onPasteTextChange={onPasteTextChange}
        mirrorHTML={mirrorHTML}
        pasteErrors={pasteErrors}
        onImport={handlePasteImport}
        prospectiveCount={prospectiveCount}
      />
      {/* Upload CSV modal */}
      <UploadCSVModal
        isOpen={showUpload}
        onClose={closeUploadModal}
        onDownloadSample={handleDownloadSample}
        onSelectFile={handleSelectCSV}
        allColumnsOK={allColumnsOK}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleCSVSelected}
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
  border-left: 1px solid ${DesignTokenColors.neutralUI200};
  height: 16px;
  margin: 0 2px 0 4px;
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
  flex: 0 0 auto;
  margin: 0;
`;

const InviteLabel = styled.span`
  color: ${DesignTokenColors.neutralUI700};
  font-weight: 500;
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

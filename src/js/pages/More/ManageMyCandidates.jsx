import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import {
  Edit as EditIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ContentCopy as CopyIcon,
  Visibility as EyeIcon,
  Facebook as FacebookIcon,
  X as XIcon,
  ContentPaste as PasteIcon,
  FileUpload as UploadIcon,
} from '@mui/icons-material';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export default function ManageMyCandidates () {
  // Demo candidates only (replace later)
  const demoCandidates = useMemo(() => ([
    { id: 'cand_1', name: 'John Dough' },
    { id: 'cand_2', name: 'Jane Dough' },
    { id: 'cand_3', name: 'Kateryna Dough' },
  ]), []);
  const effectiveCandidates = demoCandidates; // no fetch yet

  // Selected candidate
  const [selectedId, setSelectedId] = useState(effectiveCandidates[0]?.id || '');
  const selected = effectiveCandidates.find(c => c.id === selectedId) || null;

  // If the list ever changes (unlikely in demo), keep selection valid
  useEffect(() => {
    if (!effectiveCandidates.find(c => c.id === selectedId)) {
      setSelectedId(effectiveCandidates[0]?.id || '');
    }
  }, [effectiveCandidates, selectedId]);

  // Left nav active tab
  const [active, setActive] = useState('import');

  // Preview modal
  const [showPreview, setShowPreview] = useState(false);
  const handlePreviewOpen = () => setShowPreview(true);
  const handlePreviewClose = () => setShowPreview(false);

  // Invitation text
  const invitationBody = `Hello friend,

We’d like to invite you to join WeVote to help support ${selected?.name || 'our campaign'}.
Thanks for your help!`;

  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [draftInvite, setDraftInvite] = useState(invitationBody);
  const [initialInvite, setInitialInvite] = useState(invitationBody);

  // Reset draft when invitationBody or showEdit changes
  useEffect(() => {
    if (!showEdit) {
      setDraftInvite(invitationBody);
      setInitialInvite(invitationBody);
    }
  }, [invitationBody, showEdit]);

  const openEditModal = () => { setInitialInvite(draftInvite); setShowEdit(true); };
  const handleEditInvite = () => {
    setDraftInvite(invitationBody);
    setInitialInvite(invitationBody);
    setShowPreview(false);
    setShowEdit(true);
  };

  const handleCopyInviteBody = async () => {
    try {
      await navigator.clipboard.writeText(`${invitationBody}\n\nhttps://wevote.us/join/${selectedId}`);
      alert('Invitation copied.');
    } catch {
      alert('Copy failed. You can select the text and copy manually.');
    }
  };

  const handleEditCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${draftInvite}\n\nhttps://wevote.us/join/${selectedId}`);
      alert('Invitation copied.');
    } catch {
      alert('Copy failed. You can select the text and copy manually.');
    }
  };

  const handleSaveInvite = () => {
    // TODO: persist to backend
    setInitialInvite(draftInvite);
    setShowEdit(false);
  };

  // CSV upload and paste
  const fileInputRef = useRef(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [importedVoters, setImportedVoters] = useState([]); // define this since you use it

  const handleUploadCSV = () => fileInputRef.current?.click();

  const handleCSVSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please choose a .csv file.');
      e.target.value = '';
      return;
    }
    const text = await file.text();
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');
    const phoneIdx = headers.indexOf('phone');
    const rows = lines.map(line => {
      const cols = line.split(',').map(c => c.trim());
      return {
        name: nameIdx > -1 ? cols[nameIdx] : '',
        email: emailIdx > -1 ? cols[emailIdx] : '',
        phone: phoneIdx > -1 ? cols[phoneIdx] : '',
      };
    }).filter(r => r.name || r.email || r.phone);
    setImportedVoters(rows);
    alert(`Imported ${rows.length} voter(s) from CSV.`);
    e.target.value = '';
  };

  const handlePasteList = () => setShowPaste(true);
  const closePaste = () => setShowPaste(false);
  const handlePasteImport = () => {
    const rows = pasteText.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(line => {
      const parts = line.split(',').map(s => s.trim());
      return { name: parts[0] || '', email: parts[1] || '', phone: parts[2] || '' };
    }).filter(r => r.name || r.email || r.phone);
    setImportedVoters(prev => [...prev, ...rows]);
    alert(`Imported ${rows.length} voter(s) from pasted list.`);
    setPasteText(''); setShowPaste(false);
  };

  // Main render
  const history = useHistory();
  const handleClaimEdit = () => history.push(`/candidate/${selectedId}/edit`);

  return (
    <PageContentContainer>
      <Helmet><title>Manage My Candidates</title></Helmet>

      <HeaderRow>
        <div>
          <PageKicker>Manage my candidates</PageKicker>
          <TitleRow>
            <Title>{selected?.name || 'Select candidate'}</Title>
            <CandidatePicker
              type="button"
              aria-haspopup="listbox"
              aria-expanded="false"
              title="Select candidate"
            >
              <ArrowDownIcon fontSize="small" />
              <PickerMenu role="listbox">
                {effectiveCandidates.map((c) => (
                  <PickerItem
                    key={c.id}
                    role="option"
                    aria-selected={c.id === selectedId}
                    onClick={() => setSelectedId(c.id)}
                  >
                    {c.name}
                  </PickerItem>
                ))}
              </PickerMenu>
            </CandidatePicker>
          </TitleRow>
        </div>
      </HeaderRow>

      <Layout>
        {/* Left nav */}
        <LeftNav aria-label="Manage navigation">
          <NavPill $active={active === 'import'} onClick={() => setActive('import')}>
            <PillIcon><ImportInviteIcon fontSize="small" /></PillIcon>
            Import &amp; invite voters
          </NavPill>

          <NavPill $active={active === 'tracking'} onClick={() => setActive('tracking')}>
            <PillIcon><TrackingIcon fontSize="small" /></PillIcon>
            Tracking
          </NavPill>

          <NavPill $active={active === 'analytics'} onClick={() => setActive('analytics')}>
            <PillIcon><AnalyticsIcon fontSize="small" /></PillIcon>
            Analytics
          </NavPill>

          <SideDivider />

          <EditProfileLink type="button" onClick={handleClaimEdit}>
            <EditIcon fontSize="small" /> Edit candidate profile
          </EditProfileLink>
        </LeftNav>

        {/* Right content */}
        <RightPanel>
          {active === 'import' && (
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
                  <Input placeholder="First and last name" aria-label="First and last name" />
                  <Input placeholder="Email" aria-label="Email address" />
                  <Input placeholder="Mobile phone" aria-label="Mobile phone" />
                  <PrimaryButton type="button">Import voter</PrimaryButton>
                </Row>
              </Section>

              <Section>
                <H3>Upload voters from a file or paste a list</H3>
                <Row>
                  <PillButton type="button" onClick={handleUploadCSV}>
                    <UploadIcon fontSize="small" />
                    Upload CSV file
                  </PillButton>
                  <Or>OR</Or>
                  <PillButton type="button" onClick={handlePasteList}>
                    <PasteIcon fontSize="small" />
                    Paste list
                  </PillButton>
                </Row>
              </Section>

              <MutedNote>
                You don’t have any voters to invite. Import some using the options above.
              </MutedNote>
            </>
          )}

          {active === 'tracking' && (
            <Placeholder>Tracking (coming soon)</Placeholder>
          )}

          {active === 'analytics' && (
            <Placeholder>Analytics (coming soon)</Placeholder>
          )}
        </RightPanel>
      </Layout>

      {/* Preview modal */}
      {showPreview && (
        <ModalBackdrop role="dialog" aria-modal="true" aria-labelledby="invite-title">
          <ModalCard>
            <ModalHeader>
              <ModalTitle id="invite-title">Preview invitation</ModalTitle>
              <HeaderActions>
                <HeaderLink type="button" onClick={handleCopyInviteBody}>
                  <CopyIcon fontSize="small" /> <span>Copy</span>
                </HeaderLink>
                <HeaderLink type="button" onClick={handleEditInvite}>
                  <EditIcon fontSize="small" /> <span>Edit</span>
                </HeaderLink>
                <CloseX type="button" aria-label="Close" onClick={handlePreviewClose}>×</CloseX>
              </HeaderActions>
            </ModalHeader>

            <InfoRow>
              <InfoDot aria-hidden>i</InfoDot>
              <span>Link will appear below text</span>
            </InfoRow>

            <ModalBody>
              <pre>{invitationBody}</pre>
            </ModalBody>

            <ModalFooter>
              <PreviewCloseButton type="button" onClick={handlePreviewClose}>Close</PreviewCloseButton>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      )}

      {/* Edit modal */}
      {showEdit && (
        <ModalBackdrop role="dialog" aria-modal="true" aria-labelledby="edit-title">
          <ModalCard>
            <ModalHeader>
              <ModalTitle id="edit-title">Edit invitation</ModalTitle>
              <CloseX type="button" aria-label="Close" onClick={() => setShowEdit(false)}>×</CloseX>
            </ModalHeader>

            <BarBetween>
              <InfoRow>
                <InfoDot aria-hidden>i</InfoDot>
                <span>Link will appear below text</span>
              </InfoRow>
              <HeaderLink type="button" onClick={handleEditCopy}>
                <CopyIcon fontSize="small" /> <span>Copy</span>
              </HeaderLink>
            </BarBetween>

            <EditAreaWrapper>
              <EditTextArea
                value={draftInvite}
                onChange={(e) => setDraftInvite(e.target.value)}
                aria-label="Invitation text"
              />
            </EditAreaWrapper>

            <ModalFooter style={{ justifyContent: 'space-between' }}>
              <EditCloseButton type="button" onClick={() => setShowEdit(false)}>Close</EditCloseButton>
              <PrimarySaveBtn
                type="button"
                onClick={handleSaveInvite}
                disabled={draftInvite.trim() === initialInvite.trim()}
              >
                Save
              </PrimarySaveBtn>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      )}
      {showPaste && (
        <ModalBackdrop role="dialog" aria-modal="true" aria-labelledby="paste-title">
          <ModalCard>
            <ModalHeader>
              <ModalTitle id="paste-title">Paste voters</ModalTitle>
              <CloseX type="button" aria-label="Close" onClick={closePaste}>×</CloseX>
            </ModalHeader>

            <InfoRow>
              <InfoDot aria-hidden>i</InfoDot>
              <span>One person per line. Format: <i>Name, Email, Phone</i> (fields optional)</span>
            </InfoRow>

            <EditAreaWrapper>
              <EditTextArea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Jane Example, jane@example.com, 555-555-5555
                John Dough, john@sample.org`}
                aria-label="Paste voters list"
              />
            </EditAreaWrapper>

            <ModalFooter style={{ justifyContent: 'space-between' }}>
              <EditCloseButton type="button" onClick={closePaste}>Cancel</EditCloseButton>
              <PrimarySaveBtn
                type="button"
                onClick={handlePasteImport}
                disabled={!pasteText.trim()}
              >
                Import
              </PrimarySaveBtn>
            </ModalFooter>
          </ModalCard>
        </ModalBackdrop>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleCSVSelected}
      />
    </PageContentContainer>
  );
}

// Analytics icon
const AnalyticsIcon = ({ size = 22, title = 'Analytics', ...props }) => (
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
      d="M6 16H8V11H6V16ZM14 16H16V6H14V16ZM10 16H12V13H10V16ZM10 11H12V9H10V11ZM4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.19667 19.0217 2.00067 18.5507 2 18V4C2 3.45 2.196 2.97933 2.588 2.588C2.98 2.19667 3.45067 2.00067 4 2H18C18.55 2 19.021 2.196 19.413 2.588C19.805 2.98 20.0007 3.45067 20 4V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H4ZM4 18H18V4H4V18Z"
      fill="currentColor"
    />
  </svg>
);

//  Tracking icon
const TrackingIcon = ({ size = 22, title = 'Tracking', ...props }) => (
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2727 2.02341C16.3823 2.05363 16.482 2.1124 16.5615 2.19371C16.641 2.27503 16.6975 2.37598 16.7252 2.48626L17.2742 4.68483L19.4728 5.23383C19.5831 5.26159 19.6841 5.31813 19.7655 5.39768C19.8468 5.47722 19.9056 5.57693 19.9358 5.68662C19.966 5.7963 19.9665 5.91203 19.9374 6.022C19.9082 6.13197 19.8504 6.23223 19.7698 6.31255L17.1984 8.88398C17.1199 8.96218 17.0226 9.01878 16.9158 9.04829C16.809 9.0778 16.6964 9.07922 16.589 9.05241L14.5524 8.54455L11.5271 11.5685C11.3764 11.7193 11.172 11.8039 10.9588 11.8039C10.7457 11.8039 10.5412 11.7193 10.3905 11.5685C10.2398 11.4178 10.1551 11.2134 10.1551 11.0003C10.1551 10.7871 10.2398 10.5827 10.3905 10.432L13.4145 7.40669L12.9054 5.37012C12.8783 5.26244 12.8796 5.1496 12.9091 5.04257C12.9387 4.93555 12.9954 4.83799 13.0738 4.75941L15.6452 2.18798C15.7257 2.10761 15.8261 2.05003 15.9361 2.02112C16.0461 1.9922 16.1618 1.99299 16.2714 2.02341M10.4471 3.64341C10.6599 3.62908 10.8583 3.53082 10.9986 3.37024C11.1389 3.20965 11.2097 2.9999 11.1954 2.78712C11.1811 2.57434 11.0828 2.37597 10.9222 2.23563C10.7616 2.0953 10.5519 2.02451 10.3391 2.03883C8.62767 2.15797 6.98641 2.76586 5.61028 3.79027C4.23415 4.81469 3.18099 6.21259 2.57591 7.8179C1.97082 9.42322 1.83924 11.1685 2.1968 12.8464C2.55436 14.5243 3.38603 16.0643 4.59301 17.2834C5.79999 18.5026 7.33156 19.3497 9.00578 19.7241C10.68 20.0984 12.4265 19.9844 14.0378 19.3955C15.6491 18.8065 17.0575 17.7675 18.0957 16.4017C19.1339 15.0359 19.7582 13.4008 19.8945 11.6907C19.9116 11.4783 19.8435 11.2677 19.7054 11.1055C19.5672 10.9432 19.3702 10.8425 19.1578 10.8254C18.9454 10.8084 18.7349 10.8764 18.5726 11.0146C18.4103 11.1527 18.3096 11.3497 18.2925 11.5621C18.1811 12.966 17.669 14.3083 16.817 15.4297C15.9651 16.551 14.8092 17.4042 13.4866 17.888C12.1641 18.3717 10.7304 18.4656 9.35607 18.1585C7.9817 17.8514 6.72437 17.1563 5.73346 16.1556C4.74256 15.155 4.05973 13.8909 3.76611 12.5136C3.47249 11.1363 3.58042 9.70363 4.07708 8.38585C4.57373 7.06808 5.43823 5.92057 6.56787 5.07967C7.69751 4.23878 9.0448 3.73983 10.4497 3.64212M10.3275 7.20355C10.366 7.30181 10.3848 7.4067 10.3828 7.51222C10.3807 7.61774 10.3579 7.72183 10.3157 7.81854C10.2734 7.91525 10.2125 8.00268 10.1364 8.07585C10.0604 8.14902 9.97066 8.20649 9.87238 8.24498C9.41381 8.42437 9.00719 8.71524 8.6893 9.09129C8.37141 9.46734 8.15228 9.9167 8.05172 10.3987C7.95116 10.8808 7.97235 11.3803 8.11337 11.852C8.25439 12.3238 8.51079 12.753 8.85938 13.1008C9.20798 13.4486 9.63777 13.704 10.1099 13.8439C10.582 13.9838 11.0815 14.0038 11.5633 13.9021C12.0451 13.8004 12.494 13.5802 12.8693 13.2615C13.2446 12.9427 13.5345 12.5354 13.7128 12.0764C13.7935 11.8829 13.9466 11.7286 14.1395 11.6464C14.3323 11.5642 14.5497 11.5607 14.7452 11.6365C14.9406 11.7123 15.0987 11.8615 15.1857 12.0523C15.2726 12.2431 15.2816 12.4603 15.2107 12.6575C14.936 13.3662 14.489 13.9953 13.91 14.4877C13.3311 14.9801 12.6385 15.3204 11.8949 15.4777C11.1513 15.635 10.3802 15.6044 9.65142 15.3887C8.92263 15.173 8.25914 14.7789 7.72101 14.2422C7.18287 13.7054 6.78708 13.043 6.56944 12.3148C6.35181 11.5865 6.31921 10.8155 6.4746 10.0715C6.62998 9.32754 6.96845 8.63404 7.45935 8.0538C7.95026 7.47355 8.57812 7.02489 9.2861 6.74841C9.38436 6.7099 9.48925 6.69112 9.59477 6.69316C9.70029 6.69519 9.80438 6.71799 9.90109 6.76026C9.9978 6.80252 10.0852 6.86342 10.1584 6.93948C10.2316 7.01555 10.289 7.10527 10.3275 7.20355Z"
      fill="currentColor"
    />
  </svg>
);

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

const HeaderRow = styled.div`
  margin: 6px 0 12px;
`;

const PageKicker = styled.h2`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 12px;
  letter-spacing: 0.06em;
  margin: 0 0 4px;
  text-transform: uppercase;
`;

const TitleRow = styled.div`
  align-items: center;
  display: inline-flex;
  gap: 6px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
`;

const CandidatePicker = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  gap: 2px;
  padding: 2px 4px;
  position: relative;
  &:focus-visible { outline: 2px solid ${DesignTokenColors.primary500}; outline-offset: 2px; }
  &:hover > ul, &:focus-within > ul { display: block; }
`;

const PickerMenu = styled.ul`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16,24,40,0.08);
  display: none;
  list-style: none;
  margin: 8px 0 0;
  max-height: 260px;
  overflow: auto;
  padding: 6px;
  position: absolute;
  left: 0;
  top: 100%;
  width: 260px;
  z-index: 2;
`;

const PickerItem = styled.li`
  border-radius: 8px;
  cursor: pointer;
  padding: 10px 12px;
  &:hover { background: ${DesignTokenColors.neutralUI50}; }
  &[aria-selected="true"] { font-weight: 600; }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftNav = styled.nav`
  border-right: 1px solid ${DesignTokenColors.neutralUI200};
  padding-right: 18px;

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
    padding: 0 0 12px 0;
  }
`;

const NavPill = styled.button`
  align-items: center;
  background: ${({ $active }) => ($active ? DesignTokenColors.primary50 : 'transparent')};
  border: none;
  border-radius: 25px;
  color: ${({ $active }) => ($active ? DesignTokenColors.primary700 : DesignTokenColors.neutralUI900)};
  cursor: pointer;
  display: flex;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  gap: 10px;
  margin: 6px 0;
  padding: 10px 16px;
  text-align: left;
  width: 100%;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const PillIcon = styled.span`
  align-items: center;
  color: inherit;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  width: 24px;
`;

const SideDivider = styled.div`
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  margin: 16px 0;
`;

const EditProfileLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.success700};
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  padding: 0;
  text-align: left;
  &:hover { text-decoration: underline; }
`;

const RightPanel = styled.section`
  padding-top: 6px;
`;

const H2 = styled.h2`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 10px;
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
  margin: 0;
  flex: 0 0 auto;
`;

const InviteLabel = styled.span`
  color: ${DesignTokenColors.neutralUI700};
  font-weight: 500;
`;

const InviteDivider = styled.span`
  border-left: 1px solid ${DesignTokenColors.neutralUI200};
  height: 16px;
  margin: 0 2px 0 4px;
`;

const IconButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  padding: 6px;
  border-radius: 8px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;

const SocialIconButton = styled(IconButton)`
  color: ${DesignTokenColors.neutralUI800};
`;

const Sub = styled.p`
  color: ${DesignTokenColors.neutralUI700};
  margin: 0 0 18px;
`;

const Section = styled.section`
  margin: 16px 0 22px;
`;

const H3 = styled.h3`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px;
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

const Input = styled.input`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 10px;
  padding: 12px 14px;
  min-width: 220px;
  flex: 1 1 220px;
  @media (min-width: 1024px) {
    flex: 0 0 260px;
  }
  &:focus-visible { outline: 2px solid ${DesignTokenColors.primary500}; outline-offset: 2px; }
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
  font-weight: 500;
  display: inline-flex;
  gap: 8px;
`;

const Or = styled.span`
  color: ${DesignTokenColors.neutralUI600};
`;

const MutedNote = styled.p`
  color: ${DesignTokenColors.neutralUI600};
  margin: 40px 0 0;
`;

const Placeholder = styled.div`
  background: ${DesignTokenColors.neutralUI50};
  border: 1px dashed ${DesignTokenColors.neutralUI300};
  border-radius: 12px;
  padding: 24px;
  color: ${DesignTokenColors.neutralUI600};
`;

// Modal styles move to separate file later?
const ModalBackdrop = styled.div`
  align-items: center;
  background: rgba(16,24,40,0.4);
  bottom: 0; left: 0; right: 0; top: 0;
  display: flex;
  justify-content: center;
  position: fixed;
  z-index: 9999;
`;

const ModalCard = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(16,24,40,0.18);
  max-width: 720px;
  width: calc(100% - 28px);
  padding: 18px 18px 14px;
`;

const ModalHeader = styled.div`
  align-items: start;
  display: flex;
  justify-content: space-between;
  gap: 8px;
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
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
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

const InfoRow = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  display: flex;
  align-items: center;
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
    white-space: pre-wrap;
    font: inherit;
    margin: 0;
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
const BarBetween = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 6px 0 10px;
`;

const EditAreaWrapper = styled.div`
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 10px;
  overflow: hidden;
`;

const EditTextArea = styled.textarea`
  border: none;
  width: 100%;
  min-height: 260px;
  padding: 14px;
  font: inherit;
  color: ${DesignTokenColors.neutralUI900};
  resize: vertical;
  outline: none;
`;

const EditCloseButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 9999px;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const PrimarySaveBtn = styled.button`
  background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border: 1px solid ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  color: ${DesignTokenColors.whiteUI};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 10px 18px;
  border-radius: 9999px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  &:hover {
    background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
    border-color: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
  }
`;


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
  PersonAdd as PersonAddIcon,
  QueryStats as AnalyticsIcon,
  Timeline as TrackingIcon,
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
            <PillIcon><PersonAddIcon fontSize="small" /></PillIcon>
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
                <InviteLabel>Invitation:</InviteLabel>
                <IconButton type="button" title="Preview invitation" onClick={handlePreviewOpen}>
                  <EyeIcon fontSize="small" />
                </IconButton>
                <IconButton type="button" title="Edit invitation" onClick={openEditModal}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <InviteDivider />
                <InviteLabel>Post to:</InviteLabel>
                <SocialIconButton type="button" aria-label="Post to Facebook">
                  <FacebookIcon fontSize="small" />
                </SocialIconButton>
                <SocialIconButton type="button" aria-label="Post to X">
                  <XIcon fontSize="small" />
                </SocialIconButton>
              </InviteRow>

              <Sub>Import voters, then invite them to join WeVote.</Sub>

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
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: flex;
  gap: 10px;
  margin: 6px 0;
  padding: 10px 16px;
  text-align: left;
  width: 100%;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const PillIcon = styled.span`
  align-items: center;
  background: ${DesignTokenColors.whiteUI};
  color: ${DesignTokenColors.neutralUI700};
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
  font-size: 24px;
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

const InviteLabel = styled.span`
  color: ${DesignTokenColors.neutralUI700};
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
  display: inline-flex;
  gap: 8px;
`;

const Or = styled.span`
  color: ${DesignTokenColors.neutralUI600};
`;

const MutedNote = styled.p`
  color: ${DesignTokenColors.neutralUI600};
  margin: 20px 0 0;
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

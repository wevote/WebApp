import React, { Suspense } from 'react';
import styled from 'styled-components';
import {
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Visibility as EyeIcon,
  Facebook as FacebookIcon,
  X as XIcon,
  FileUpload as UploadIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const ImportedVotersList = React.lazy(() => import('../../components/PoliticiansManaged/ImportedVotersList'));

export default function ManageMyCandidates ({
  handleCopyInviteBody,
  handlePreviewOpen,
  openEditModal,
  oneName,
  oneEmail,
  onePhone,
  setOneName,
  setOneEmail,
  setOnePhone,
  handleImportOne,
  emailRE,
  openUploadModal,
  handlePasteList,
  importedVoters,
  handleInviteSelected,
  handleInviteEmailOneOrMany,
  handleInviteTextOneOrMany,
  handleHideOne,
  handleHideMany,
}) {
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
    </>
  );
}

ManageMyCandidates.propTypes = {
  handleCopyInviteBody: PropTypes.func.isRequired,
  handlePreviewOpen: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
  oneName: PropTypes.string.isRequired,
  oneEmail: PropTypes.string.isRequired,
  onePhone: PropTypes.string.isRequired,
  setOneName: PropTypes.func.isRequired,
  setOneEmail: PropTypes.func.isRequired,
  setOnePhone: PropTypes.func.isRequired,
  handleImportOne: PropTypes.func.isRequired,
  emailRE: PropTypes.instanceOf(RegExp).isRequired,
  openUploadModal: PropTypes.func.isRequired,
  handlePasteList: PropTypes.func.isRequired,
  importedVoters: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleInviteSelected: PropTypes.func.isRequired,
  handleInviteEmailOneOrMany: PropTypes.func.isRequired,
  handleInviteTextOneOrMany: PropTypes.func.isRequired,
  handleHideOne: PropTypes.func.isRequired,
  handleHideMany: PropTypes.func.isRequired,
};

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

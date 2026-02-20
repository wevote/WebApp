import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

export default function ImportConfirmModal ({
  isOpen,
  onClose,
  fileName,
  userHeaders,
  rows,
  onConfirm,
  notify,
}) {
  const [columnMapping, setColumnMapping] = useState(() => {
    const mapping = {};

    userHeaders.forEach((header) => {
      const lowerHeader = header.toLowerCase().trim();

      // Exact matches only (case-insensitive)
      if (lowerHeader === 'name') {
        mapping[header] = 'Name';
      } else if (lowerHeader === 'email') {
        mapping[header] = 'Email';
      } else if (lowerHeader === 'mobile') {
        mapping[header] = 'Mobile';
      } else if (lowerHeader === 'address') {
        mapping[header] = 'Address';
        // Special exception: columns containing "email" (e.g., "Email address", "voter email")
      } else if (lowerHeader.includes('email')) {
        mapping[header] = 'Email';
        // Everything else requires manual selection
      } else {
        mapping[header] = null;
      }
    });

    return mapping;
  });

  const [autoMatched, setAutoMatched] = useState(() => {
    const matched = {};
    userHeaders.forEach((header) => {
      const lowerHeader = header.toLowerCase().trim();

      // Mark as auto-matched if we matched it above
      matched[header] =
        lowerHeader === 'name' ||
        lowerHeader === 'email' ||
        lowerHeader === 'mobile' ||
        lowerHeader === 'address' ||
        lowerHeader.includes('email'); // Special exception
    });
    return matched;
  });

  const weVoteColumns = ['Name', 'Email', 'Mobile', 'Address'];
  // Require at least one contact method: Email OR Mobile
  const hasEmail = Object.values(columnMapping).includes('Email');
  const hasMobile = Object.values(columnMapping).includes('Mobile');
  const allColumnsMapped = hasEmail || hasMobile;

  const handleColumnChange = (userColumn, weVoteColumn) => {
    setColumnMapping((prev) => ({
      ...prev,
      [userColumn]: weVoteColumn,
    }));
    setAutoMatched((prev) => ({
      ...prev,
      [userColumn]: false,
    }));
  };

  const handleImport = () => {
    const mappedRows = rows.map((row) => {
      const mapped = {};
      userHeaders.forEach((userHeader) => {
        const weVoteColumn = columnMapping[userHeader];
        if (weVoteColumn) {
          const key = weVoteColumn.toLowerCase();
          mapped[key === 'mobile' ? 'phone' : key] = row[userHeader];
        }
      });
      return mapped;
    });

    onConfirm(mappedRows);
    notify('All of your columns will be imported.', true);
  };

  const handleReplace = () => {
    onClose();
  };

  const getPreviewRow = () => {
    const preview = {};
    userHeaders.forEach((userHeader) => {
      const weVoteColumn = columnMapping[userHeader];
      preview[weVoteColumn || 'Not selected'] = rows[0]?.[userHeader] || '';
    });
    return preview;
  };

  const previewRow = getPreviewRow();
  const notMappedCount = userHeaders.filter((h) => !columnMapping[h]).length;

  function MappingRowContent ({ userHeader }) {
    return (
      <MappingRow>
        <UserColumnName>{userHeader}</UserColumnName>
        <DropdownWrapper>
          <MobileStatusIcon $isWarning={!columnMapping[userHeader]}>
            <WarningIcon fontSize="small" />
          </MobileStatusIcon>
          <StyledSelect
          value={columnMapping[userHeader] || 'Select column'}
          onChange={(e) => handleColumnChange(userHeader, e.target.value)}
          $hasValue={columnMapping[userHeader] !== null}
          >
            <option value="Select column" disabled hidden>
              Select column
            </option>
            {weVoteColumns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </StyledSelect>
          {autoMatched[userHeader] && columnMapping[userHeader] && (
          <AutoMatchedLabel>Auto-matched</AutoMatchedLabel>
          )}
          {columnMapping[userHeader] && (
          <CheckIconWrapper>
            <CheckIcon fontSize="small" />
          </CheckIconWrapper>
          )}
        </DropdownWrapper>
        {columnMapping[userHeader] && (
        <CheckIconWrapper className="u-show-mobile">
          <CheckIcon fontSize="small" />
        </CheckIconWrapper>
        )}
      </MappingRow>
    );
  }

  MappingRowContent.propTypes = {
    userHeader: PropTypes.string.isRequired,
  };

  const dialogTitleJSX = (
    <HeaderRow>
      <Title>Import voters</Title>
    </HeaderRow>
  );

  const textFieldJSX = (
    <ContentWrapper>
      <FileUploadedSection>
        <FileUploadedText>File uploaded.</FileUploadedText>
        <FileNameRow>
          <SuccessIcon><CheckIcon fontSize="small" /></SuccessIcon>
          <FileName>{fileName}</FileName>
          <VerticalDivider />
          <ReplaceLink type="button" onClick={handleReplace}>
            Replace
          </ReplaceLink>
        </FileNameRow>
      </FileUploadedSection>

      <Instructions>
        <li>
          To ensure your voters&#39; data appears in our columns, please match
          your column names to ours, e.g. if a person&#39;s name is in
          column &#34;Voter&#34;, it should be matched to &#34;Name&#34;.
        </li>
        <li>
          You can select the same column to combine your columns, e.g. to
          combine separate address columns (street, city etc.) into WeVote&#39;s
          single address column
        </li>
        <li>
          At this time, we don&#39;t support more than WeVote&#39;s 4
          columns
        </li>
      </Instructions>

      {/* Desktop/Tablet Column Mapping */}
      <MappingSection className="u-show-desktop-tablet">
        <MappingOuterGrid>
          <MappingBody>
            <MappingHeader>
              <ColumnLabel>Your column names</ColumnLabel>
              <ColumnLabel>Match to WeVote</ColumnLabel>
              <div />
              {' '}
              {/* Empty spacer for checkmark column */}
            </MappingHeader>

            <MappingRowsContainer>
              <MappingRows>
                {userHeaders.map((userHeader) => (
                  <MappingRowContent key={userHeader} userHeader={userHeader} />
                ))}
              </MappingRows>
            </MappingRowsContainer>
          </MappingBody>

          <MappingDivider />

          <ColumnSection>
            <ColumnLabel>WeVote&#39;s columns</ColumnLabel>
            <ColumnList>
              {weVoteColumns.map((col) => (
                <Column key={col}>{col}</Column>
              ))}
            </ColumnList>
          </ColumnSection>
        </MappingOuterGrid>
      </MappingSection>

      {/* Mobile Column Mapping */}
      <MobileMappingSection className="u-show-mobile">
        <MobileHeaderSection>
          <MobileSectionTitle>WeVote&#39;s column names</MobileSectionTitle>
          <WeVoteColumnsMobile>
            {weVoteColumns.map((col, idx) => (
              <React.Fragment key={col}>
                {idx > 0 && <span> | </span>}
                <span>{col}</span>
              </React.Fragment>
            ))}
          </WeVoteColumnsMobile>
        </MobileHeaderSection>

        <MappingHeader style={{ marginTop: '20px' }}>
          <ColumnLabel>My columns</ColumnLabel>
          <ColumnLabel>Match to WeVote</ColumnLabel>
          <div />
        </MappingHeader>

        <MappingRowsContainer>
          <MappingRows>
            {userHeaders.map((userHeader) => (
              <MappingRowContent key={userHeader} userHeader={userHeader} />
            ))}
          </MappingRows>
        </MappingRowsContainer>
      </MobileMappingSection>

      <PreviewSection>
        <PreviewHeader>
          <PreviewTitle>Voter import preview</PreviewTitle>
          {notMappedCount > 0 && (
            <>
              <PreviewDivider />
              <WarningRow>
                <WarningIconWrapper>
                  <WarningIcon fontSize="small" />
                </WarningIconWrapper>
                <WarningText className="u-show-desktop-tablet">
                  {notMappedCount}
                  {' '}
                  of your columns will not be imported.
                </WarningText>
                <WarningText className="u-show-mobile">
                  {notMappedCount}
                  {' '}
                  columns not selected
                </WarningText>
              </WarningRow>
            </>
          )}
        </PreviewHeader>

        {/* Desktop and tablet preview */}
        <PreviewGrid className="u-show-desktop-tablet">
          {weVoteColumns.map((col) => (
            <PreviewHead key={col} $notMapped={!Object.values(columnMapping).includes(col)}>
              {col}
            </PreviewHead>
          ))}
          {weVoteColumns.map((col) => (
            <PreviewCell key={col} $notMapped={!Object.values(columnMapping).includes(col)}>
              {previewRow[col] || 'Not matched'}
            </PreviewCell>
          ))}
        </PreviewGrid>

        {/* Mobile Preview */}
        <MobilePreviewStack className="u-show-mobile">
          {weVoteColumns.map((col) => (
            <MobilePreviewRow key={col} $notMapped={!Object.values(columnMapping).includes(col)}>
              <MobilePreviewHead>{col}</MobilePreviewHead>
              <MobilePreviewCell>
                {previewRow[col] || 'Not selected'}
              </MobilePreviewCell>
            </MobilePreviewRow>
          ))}
        </MobilePreviewStack>
      </PreviewSection>

      {/* Desktop and tablet footer */}
      <Footer className="u-show-desktop-tablet">
        <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
        <ImportButton type="button" onClick={handleImport} disabled={!allColumnsMapped}>
          Import
          {' '}
          {rows.length}
          {' '}
          voter
          {rows.length !== 1 ? 's' : ''}
        </ImportButton>
      </Footer>

      {/* Mobile Footer */}
      <MobileFooter className="u-show-mobile">
        <ImportButton type="button" onClick={handleImport} disabled={!allColumnsMapped}>
          Import
          {' '}
          {rows.length}
          {' '}
          voter
          {rows.length !== 1 ? 's' : ''}
        </ImportButton>
      </MobileFooter>
    </ContentWrapper>
  );

  return (
    <>
      <ChangeTitleFont />
      <HideTemplateADivider />
      <WidenConfirmModal />
      <SoftenCorners />
      <MobileFooterSticky />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={onClose}
        externalUniqueId="importVotersConfirmModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode
        textFieldJSX={textFieldJSX}
      />
    </>
  );
}

ImportConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
  userHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onConfirm: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

// Global Styles

const ChangeTitleFont = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAimportVotersConfirmModal) * {
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
  }
`;

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAimportVotersConfirmModal) > hr {
    display: none !important;
  }
`;

const MobileFooterSticky = createGlobalStyle`
  @media (max-width: 575px) {
    .MuiDialog-paper:has(#closeModalDisplayTemplateAimportVotersConfirmModal) {
      max-height: 95vh !important;
      margin: 16px !important;
    }

    .MuiDialogContent-root:has(#closeModalDisplayTemplateAimportVotersConfirmModal) {
      padding-bottom: 0 !important;
      overflow-y: auto !important;
      flex: 1 1 auto !important;
    }
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAimportVotersConfirmModal) {
    border-radius: 14px !important;
  }
`;

const WidenConfirmModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAimportVotersConfirmModal) {
    width: 96% !important;
    max-width: 960px !important;
  }
`;

// Styles

const AutoMatchedLabel = styled.span`
  color: ${DesignTokenColors.confirmation700};
  font-size: 11px;
  font-weight: 500;
  position: absolute;
  left: 8px;
  bottom: -8px;
  pointer-events: none;

  @media (max-width: 575px) {
    left: 34px;
  }
`;

const CancelButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  font-size: 13px;
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  padding: 6px 16px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const CheckIconWrapper = styled.span`
  color: ${DesignTokenColors.confirmation600};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;

  &.u-show-mobile {
    position: static;
    transform: none;

    svg {
      font-size: 16px;
    }
  }

  @media (max-width: 575px) {
    &:not(.u-show-mobile) {
      display: none;
    }

    &.u-show-mobile {
      display: flex;
    }
  }
`;

const Column = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  padding: 1px 0;
`;

const ColumnLabel = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 13px;
  font-weight: 700;
`;

const ColumnList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 6px;
`;

const ColumnSection = styled.div`
  min-width: 180px;
  padding-left: 16px;
`;

const ContentWrapper = styled.div`
  padding: 8px 18px 18px;
  display: flex;
  flex-direction: column;
  min-height: 100%;

  @media (max-width: 575px) {
    padding: 4px 14px 0;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 220px;

  @media (max-width: 575px) {
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: none;
    padding-left: 28px;
    min-width: 0;
  }
`;

const FileName = styled.span`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 13px;
`;

const FileNameRow = styled.div`
  align-items: center;
  display: flex;
  gap: 0;
  margin-top: 6px;
`;

const FileUploadedSection = styled.div`
  margin-bottom: 18px;
`;

const FileUploadedText = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 13px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0;
  padding-top: 12px;
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 12px 0 18px;

  @media (max-width: 575px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 8px 0 0;
  }
`;

const ImportButton = styled.button`
  background: ${DesignTokenColors.primary700};
  font-size: 13px;
  border: 1px solid ${DesignTokenColors.primary700};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  padding: 6px 16px;
  white-space: nowrap;

  &:hover {
    background: ${DesignTokenColors.primary800};
    border-color: ${DesignTokenColors.primary800};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 575px) {
    width: 100%;
    padding: 8px 16px;
  }
`;

const Instructions = styled.ul`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 13px;
  line-height: 1.45;
  margin: 0 0 20px;
  padding-left: 18px;
  max-width: 600px;
`;

const MappingBody = styled.div`
  padding-right: 12px;
`;

const MappingDivider = styled.div`
  border-left: 1.5px solid ${DesignTokenColors.neutralUI100};
  align-self: stretch;
  margin: 0 4px 0 4px;
`;

const MappingHeader = styled.div`
  display: grid;
  grid-template-columns: 160px 140px 2px;
  gap: 0 16px;
  align-items: center;
  margin-bottom: 0;
  padding: 0 8px;

  @media (max-width: 575px) {
    grid-template-columns: 90px 1fr 24px;
    gap: 0 20px;
    padding: 0;
  }
`;

const MappingOuterGrid = styled.div`
  display: flex;
  align-items: stretch;
`;

const MappingRow = styled.div`
  display: grid;
  grid-template-columns: 160px 130px 2px;
  gap: 0 16px;
  align-items: center;
  padding: 6px 8px 4px 0;
  border-radius: 8px;

  @media (max-width: 575px) {
    grid-template-columns: 90px 140px 24px;
    gap: 0 10px;
    padding: 6px 0 4px 0;
  }
`;

const MappingRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MappingRowsContainer = styled.div`
  max-height: 260px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background: ${DesignTokenColors.neutralUI50};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${DesignTokenColors.neutralUI100};
    border-radius: 4px;

    &:hover {
      background: ${DesignTokenColors.neutralUI200};
    }
  }
`;

const MappingSection = styled.div`
  margin: 20px 0;
`;

const PreviewCell = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 13px;

  ${({ $notMapped }) => $notMapped && `
    color: ${DesignTokenColors.neutralUI400};
    font-style: italic;
  `}
`;

const PreviewGrid = styled.div`
  background: ${DesignTokenColors.info50};
  border: 1px solid ${DesignTokenColors.info50};
  border-radius: 10px;
  display: inline-grid;
  gap: 6px 20px;
  grid-template-columns: auto auto auto auto;
  padding: 10px 25px 15px 15px;
`;

const PreviewHead = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  font-weight: 500;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  @media (max-width: 575px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

const PreviewSection = styled.div`
  margin-top: 8px;
  margin-bottom: 10px;
`;

const PreviewTitle = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 2px;
`;

const ReplaceLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  font-size: 13px;
  padding: 0;

  &:hover {
    color: ${DesignTokenColors.primary800};
    text-decoration: underline;
  }
`;

const StyledSelect = styled.select`
  appearance: none;
  background-color: ${DesignTokenColors.whiteUI};
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23667085' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  border: none;
  border-radius: 8px;
  color: ${({ $hasValue }) => ($hasValue ? DesignTokenColors.neutralUI900 : DesignTokenColors.neutralUI600)};
  cursor: pointer;
  font-size: 13px;
  padding: 8px 28px 8px 8px;
  width: 100%;
  font-style: ${({ $hasValue }) => ($hasValue ? 'normal' : 'italic')};
  font-weight: ${({ $hasValue }) => ($hasValue ? '500' : 'normal')};

  &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }

  option {
    font-style: normal;
  }

  @media (max-width: 575px) {
    flex: 0 0 120px;
    min-width: 0;
    padding: 8px 24px 8px 6px;
    background-position: right 4px center;
    box-sizing: border-box;
    font-size: 12px;
  }
`;

const SuccessIcon = styled.span`
  color: ${DesignTokenColors.confirmation600};
  display: inline-flex;
  line-height: 1;
  margin-right: 8px;
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;

  @media (max-width: 575px) {
    font-size: 22px;
    margin-left: 20px;
  }
`;

const UserColumnName = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding-left: 10px;
  padding-right: 50px;

  &::after {
    content: '';
    position: absolute;
    right: 5px;
    top: 50%;
    width: 42px;
    height: 1.5px;
    background: ${DesignTokenColors.neutralUI400};
    transform: translateY(-50%);
  }

  &::before {
    content: '';
    position: absolute;
    right: 5px;
    top: 50%;
    width: 6px;
    height: 6px;
    border-right: 1.5px solid ${DesignTokenColors.neutralUI400};
    border-top: 1.5px solid ${DesignTokenColors.neutralUI400};
    transform: translateY(-50%) rotate(45deg);
  }

  @media (max-width: 575px) {
    font-size: 12px;
    padding-left: 0;
    padding-right: 0;

    &::after,
    &::before {
      display: none;
    }
  }
`;

const WarningIconWrapper = styled.span`
  color: ${DesignTokenColors.warning500};
  display: inline-flex;
  align-items: center;

  @media (max-width: 575px) {
    svg {
      font-size: 16px;
    }
  }
`;

const WarningRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WarningText = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 13px;

  @media (max-width: 575px) {
    margin-bottom: 4px;
  }
`;

const VerticalDivider = styled.div`
  border-left: 1.5px solid ${DesignTokenColors.neutralUI100};
  height: 20px;
  margin: 0 12px;
`;

const PreviewDivider = styled(VerticalDivider)`
  @media (max-width: 575px) {
    display: none;
  }
`;

// Mobile-only styles

const MobileFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  background: ${DesignTokenColors.whiteUI};
  position: sticky;
  bottom: 0;
  margin-left: -14px;
  margin-right: -14px;
  padding: 16px 14px 20px;

  @media (max-width: 575px) {
    margin-top: auto;
    padding: 12px 14px 16px;
  }
`;

const MobileHeaderSection = styled.div`
  background: ${DesignTokenColors.neutralUI50};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  padding: 12px 14px;

  @media (max-width: 575px) {
    background: transparent;
    border: none;
    padding: 0;
  }
`;

const MobileMappingSection = styled.div`
  margin: 20px 0;
`;

const MobilePreviewCell = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;

  @media (max-width: 575px) {
    font-size: 13px;
  }
`;

const MobilePreviewHead = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  font-weight: 500;
`;

const MobilePreviewRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${DesignTokenColors.neutralUI100};
  }

  ${({ $notMapped }) => $notMapped && `
    ${MobilePreviewHead}, ${MobilePreviewCell} {
      color: ${DesignTokenColors.neutralUI400};
      font-style: italic;
    }
  `}
`;

const MobilePreviewStack = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  padding: 4px 14px;
`;

const MobileSectionTitle = styled.div`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const MobileStatusIcon = styled.span`
  display: none;

  @media (max-width: 575px) {
    display: ${({ $isWarning }) => ($isWarning ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${DesignTokenColors.warning500};
    position: absolute;
    left: 6px;

    svg {
      font-size: 16px;
    }
  }
`;

const WeVoteColumnsMobile = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
  line-height: 1.5;

  span {
    color: ${DesignTokenColors.neutralUI900};
  }
`;

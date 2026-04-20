import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { FileDownloadOutlined as DownloadIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';
import ImportConfirmModal from './ImportConfirmModal';

export default function UploadCSVModal ({
  isOpen,
  onClose,
  onImport,
  notify,
}) {
  const fileInputRef = useRef(null);
  const [allColumnsOK, setAllColumnsOK] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);

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

  const handleSelectCSV = () => fileInputRef.current?.click();

  const handleCSVSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.csv$/i.test(file.name)) {
      notify('Please choose a .csv file.', false);
      e.target.value = '';
      return;
    }

    const text = await file.text();
    const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim().length > 0);
    const [headerLine, ...dataLines] = lines;

    // Helper function to properly split CSV line that has quotes (e.g. for addresses w/ commas)
    const splitCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const userHeaders = splitCSVLine(headerLine);
    const rows = dataLines.map((line) => {
      const cols = splitCSVLine(line);
      const row = {};
      userHeaders.forEach((header, idx) => {
        row[header] = cols[idx] || '';
      });
      return row;
    }).filter((r) => Object.values(r).some((v) => v));

    if (rows.length === 0) {
      notify('No rows found in this CSV.', false);
      e.target.value = '';
      return;
    }

    setUploadedFile(file);
    setParsedData({ userHeaders, rows });
    setShowConfirmModal(true);

    e.target.value = '';
  };

  const handleClose = () => {
    setAllColumnsOK(false);
    setShowConfirmModal(false);
    setUploadedFile(null);
    setParsedData(null);
    onClose();
  };

  const handleConfirmImport = (mappedData) => {
    onImport(mappedData);
    setShowConfirmModal(false);
    setUploadedFile(null);
    setParsedData(null);
    setAllColumnsOK(false);
    handleClose();
  };

  const dialogTitleJSX = (
    <HeaderRow>
      <Title>Upload CSV file</Title>
      <HeaderDivider className="u-show-desktop-tablet" />
      <HeaderLink type="button" onClick={handleDownloadSample}>
        <DownloadIcon fontSize="small" />
        <span>Download sample file</span>
      </HeaderLink>
    </HeaderRow>
  );

  const textFieldJSX = (
    <TextFieldWrapper>
      <IntroList>
        <li>WeVote supports the data column structure below.</li>
        <li>
          If your document has info in separate columns (e.g., first and last name),
          please combine them into one column to ensure accurate importing.
        </li>
        <li>You&#39;ll be able to change your column names to ours after uploading your file.</li>
      </IntroList>

      <StructureLabel>WeVote&#39;s data column structure</StructureLabel>

      {allColumnsOK && (
        <SuccessBanner>
          <SuccessIcon><CheckIcon fontSize="small" /></SuccessIcon>
          <span>All of your columns will be imported.</span>
        </SuccessBanner>
      )}

      {/* Desktop and tablet grid */}
      <Grid className="u-show-desktop-tablet">
        <Head>Name</Head>
        <Head>Email</Head>
        <Head>Mobile</Head>
        <Head>Address</Head>

        <Cell>John Smith</Cell>
        <Cell>js@gmail.com</Cell>
        <Cell>(123) 456-7890</Cell>
        <Cell>
          123 State St
          <br />
          Anytown, CA 94117
        </Cell>
      </Grid>

      {/* Mobile grid */}
      <MobileGrid className="u-show-mobile">
        <MobileRow>
          <Head>Name</Head>
          <Cell>John Smith</Cell>
        </MobileRow>
        <MobileRow>
          <Head>Email</Head>
          <Cell>js@gmail.com</Cell>
        </MobileRow>
        <MobileRow>
          <Head>Mobile</Head>
          <Cell>(123) 456-7890</Cell>
        </MobileRow>
        <MobileRow>
          <Head>Address</Head>
          <Cell>
            123 State St
            <br />
            Anytown, CA 94117
          </Cell>
        </MobileRow>
      </MobileGrid>

      <Footer>
        <CancelButton type="button" onClick={handleClose}>Cancel</CancelButton>
        <SelectButton type="button" onClick={handleSelectCSV}>Select file</SelectButton>
      </Footer>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleCSVSelected}
      />
    </TextFieldWrapper>
  );

  return (
    <>
      <ChangeTitleFont />
      <HideTemplateADivider />
      <WidenUploadModal />
      <SoftenCorners />
      <ModalDisplayTemplateA
        show={isOpen && !showConfirmModal}
        toggleModal={handleClose}
        externalUniqueId="uploadCSVModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
      {showConfirmModal && parsedData && (
        <ImportConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          fileName={uploadedFile?.name}
          userHeaders={parsedData.userHeaders}
          rows={parsedData.rows}
          onConfirm={handleConfirmImport}
          notify={notify}
        />
      )}
    </>
  );
}

UploadCSVModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

// Global Styles

const ChangeTitleFont = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAuploadCSVModal) * {
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
  }
`;

const HideTemplateADivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateAuploadCSVModal) > hr {
    display: none !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAuploadCSVModal) {
    border-radius: 14px !important;
  }
`;

const WidenUploadModal = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateAuploadCSVModal) {
    width: 96% !important;
    max-width: 860px !important;
  }
`;

// Styles

const CancelButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  padding: 10px 18px;
  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;

const Cell = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;

  @media (max-width: 575px) {
    font-size: 13px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
`;

const Grid = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  display: grid;
  gap: 12px 18px;
  grid-template-columns: repeat(4, 1fr);
  padding: 14px;
`;

const Head = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
`;

const HeaderDivider = styled.div`
  width: 1px;
  height: 22px;
  background: ${DesignTokenColors.neutralUI100};
  margin: 0 12px;
  align-self: center;
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
  font-weight: 400;
  font-size: 17px;
  &:hover { background: ${DesignTokenColors.primary50}; }

  @media (max-width: 575px) {
    font-size: 14px;
    padding: 4px 6px;
    margin-left: 10px;
  }
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  padding: 0 12px 0 18px;

  @media (max-width: 575px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 8px 0 0;
  }
`;

const IntroList = styled.ul`
  color: ${DesignTokenColors.neutralUI700};
  line-height: 1.45;
  margin: 8px 0 18px;
  padding-left: 18px;

  @media (max-width: 575px) {
    font-size: 14px;
    margin: 0 0 18px;
  }
`;

const MobileGrid = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  padding: 4px 14px;
`;

const MobileRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${DesignTokenColors.neutralUI100};
  }
`;

const SelectButton = styled.button`
  background: ${DesignTokenColors.primary700};
  border: 1px solid ${DesignTokenColors.primary700};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  padding: 10px 18px;
  &:hover {
    background: ${DesignTokenColors.primary800};
    border-color: ${DesignTokenColors.primary800};
  }
`;

const StructureLabel = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-weight: 600;
  margin: 10px 0 6px;

  @media (max-width: 575px) {
    font-size: 14px;
  }
`;

const SuccessBanner = styled.div`
  align-items: center;
  background: ${DesignTokenColors.neutralUI50};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  color: ${DesignTokenColors.neutralUI900};
  display: flex;
  gap: 10px;
  margin: 8px 0 12px;
  padding: 10px 12px;

  @media (max-width: 575px) {
    font-size: 14px;
  }
`;

const SuccessIcon = styled.span`
  color: ${DesignTokenColors.confirmation500};
  display: inline-flex;
  line-height: 1;
`;

const TextFieldWrapper = styled.div`
  padding: 18px 18px 28px;

  @media (max-width: 575px) {
    padding: 9px 18px 28px;
  }
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;

  @media (max-width: 575px) {
    font-size: 22px;
    margin-left: 20px;
  }
`;

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { FileDownloadOutlined as DownloadIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';

export default function UploadCSVModal ({
  isOpen,
  onClose,
  onImport,
  notify,
}) {
  const fileInputRef = useRef(null);
  const [allColumnsOK, setAllColumnsOK] = useState(false);

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
      onImport(rows);
      setAllColumnsOK(false);
    } else {
      setAllColumnsOK(ok);
      if (!ok) {
        notify('We could not find all required columns (Name, Email, Mobile/Phone, Address). Please adjust and re-upload.', false);
      } else if (rows.length === 0) {
        notify('No rows found in this CSV.', false);
      }
    }

    e.target.value = '';
  };

  const handleClose = () => {
    setAllColumnsOK(false);
    onClose();
  };

  const dialogTitleJSX = (
    <HeaderRow>
      <Title>Upload CSV file</Title>
      <HeaderDivider />
      <HeaderLink type="button" onClick={handleDownloadSample}>
        <DownloadIcon fontSize="small" />
        <span>Download sample file</span>
      </HeaderLink>
    </HeaderRow>
  );

  const textFieldJSX = (
    <div style={{ padding: '18px 18px 28px' }}>
      <IntroList>
        <li>WeVote supports the data column structure below.</li>
        <li>
          If your document has info in separate columns (e.g., first and last name),
          please combine them into one column to ensure accurate importing.
        </li>
        <li>You’ll be able to change your column names to ours after uploading your file.</li>
      </IntroList>

      <StructureLabel>WeVote’s data column structure</StructureLabel>

      {allColumnsOK && (
        <SuccessBanner>
          <SuccessIcon><CheckIcon fontSize="small" /></SuccessIcon>
          <span>All of your columns will be imported.</span>
        </SuccessBanner>
      )}

      <Grid>
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
    </div>
  );

  return (
    <>
      <HideTemplateADivider />
      <WidenUploadModal />
      <SoftenCorners />
      <ModalDisplayTemplateA
        show={isOpen}
        toggleModal={handleClose}
        externalUniqueId="uploadCSVModal"
        dialogTitleJSX={dialogTitleJSX}
        tallMode={false}
        textFieldJSX={textFieldJSX}
      />
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
`;

const HeaderRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 12px 0 18px;
`;

const IntroList = styled.ul`
  color: ${DesignTokenColors.neutralUI700};
  line-height: 1.45;
  margin: 8px 0 18px;
  padding-left: 18px;
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
`;

const SuccessIcon = styled.span`
  color: ${DesignTokenColors.confirmation500};
  display: inline-flex;
  line-height: 1;
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

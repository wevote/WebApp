import React from 'react';
import {
  CheckCircle as CheckIcon,
  FileDownloadOutlined as DownloadIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ModalDisplayTemplateA from '../Widgets/ModalDisplayTemplateA';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export default function UploadCSVModal ({
  isOpen, // if modal is open
  columnsOK, // check if upload is successful
  selectCsvFunc, // handle choosing a csv file
  closeModalFunc, // handle closing modal
  downloadSampleFunc, // optional href for "Download sample CSV"
}) {
  const csvUploadDialogTitleJsx = (
    <UploadHeaderRow>
      <UploadHeaderLeft>
        <ModalTitle id="upload-title">Upload CSV file</ModalTitle>
        <HeaderDivider aria-hidden />
        <HeaderLink type="button" onClick={downloadSampleFunc}>
          <DownloadIcon fontSize="small" />
          <span>Download sample file</span>
        </HeaderLink>
      </UploadHeaderLeft>
    </UploadHeaderRow>
  );

  const csvUploadTextFieldJsx = (
    <>
      <UploadIntroList>
        <li>WeVote supports the data column structure below.</li>
        <li>
          If your document has info in separate columns (e.g., first and last name),
          please combine them into one column to ensure accurate importing.
        </li>
        <li>You’ll be able to change your column names to ours after uploading your file.</li>
      </UploadIntroList>

      <UploadStructureTitle>WeVote’s data column structure</UploadStructureTitle>
      {columnsOK && (
        <SuccessBanner role="status" aria-live="polite">
          <SuccessIcon><CheckIcon fontSize="small" /></SuccessIcon>
          <span>All of your columns will be imported.</span>
        </SuccessBanner>
      )}
      <UploadGrid aria-label="WeVote data column structure">
        <UploadGridHead>Name</UploadGridHead>
        <UploadGridHead>Email</UploadGridHead>
        <UploadGridHead>Mobile</UploadGridHead>
        <UploadGridHead>Address</UploadGridHead>

        <UploadGridCell>John Smith</UploadGridCell>
        <UploadGridCell>js@gmail.com</UploadGridCell>
        <UploadGridCell>(123) 456-7890</UploadGridCell>
        <UploadGridCell>
          123 State St
          <br />
          Anytown, CA 94117
        </UploadGridCell>
      </UploadGrid>

      <ModalFooter style={{ justifyContent: 'space-between' }}>
        <EditCloseButton type="button" onClick={closeModalFunc}>Cancel</EditCloseButton>
        <PrimarySaveBtn type="button" onClick={selectCsvFunc}>Select file</PrimarySaveBtn>
      </ModalFooter>
    </>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={csvUploadDialogTitleJsx}
      toggleModal={closeModalFunc}
      show={isOpen}
      textFieldJSX={csvUploadTextFieldJsx}
      tallMode
    />
  );
}

UploadCSVModal.propTypes = {
  isOpen: PropTypes.bool, // if modal is open
  columnsOK: PropTypes.bool, // check if upload is successful
  selectCsvFunc: PropTypes.func, // handle choosing a csv file
  closeModalFunc: PropTypes.func, // handle closing modal
  downloadSampleFunc: PropTypes.func, // optional href for "Download sample CSV"
};

const EditCloseButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  padding: 10px 18px;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }
`;


const HeaderDivider = styled.span`
  border-left: 1px solid ${DesignTokenColors.neutralUI200};
  height: 22px;
  margin: 0 4px;
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

  &:hover { background: ${DesignTokenColors.primary50}; }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 16px;
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  margin: 4px 0 8px;
`;

const PrimarySaveBtn = styled.button`
  background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border: 1px solid ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary700)};
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  padding: 10px 18px;

  &:hover {
    background: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
    border-color: ${({ disabled }) => (disabled ? DesignTokenColors.neutralUI200 : DesignTokenColors.primary800)};
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
`;

const SuccessIcon = styled.span`
  color: ${DesignTokenColors.confirmation500};
  display: inline-flex;
  line-height: 1;
`;

const UploadGrid = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  display: grid;
  gap: 12px 18px;
  grid-template-columns: repeat(4, 1fr);
  padding: 14px;
`;

const UploadGridCell = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
`;

const UploadGridHead = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
`;

const UploadHeaderLeft = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
`;

const UploadHeaderRow = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const UploadIntroList = styled.ul`
  color: ${DesignTokenColors.neutralUI700};
  line-height: 1.45;
  margin: 8px 0 10px;
  padding-left: 18px;
`;

const UploadStructureTitle = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-weight: 600;
  margin: 10px 0 6px;
`;

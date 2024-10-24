import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React from 'react';
import DesignTokenColors from '../Style/DesignTokenColors';
import ModalDisplayTemplateA, { templateAStyles, TextFieldWrapper } from '../../../components/Widgets/ModalDisplayTemplateA';

const ViewInviteeDetails = ({ show, setShow, setAnchorEl }) => {

 const handleClose = () => {
  setShow(false);
  setAnchorEl(null);
 };

 const dialogTitleText = "Jane's Invitation History";

 const textFieldJSX = (
  <TableContainer components={Paper} sx={{ paddingBottom: '5px' }}>
    <TableWrapper>
     <Table aria-label="simple table">
      <TableHead>
        <StyledTableRow>
          <StyledTableHeaderCell>STATUS</StyledTableHeaderCell>
          <StyledTableHeaderCell align="right">DATE</StyledTableHeaderCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        <TableRow >
          <StyledTableBodyCellLeft component="th" scope="row">
            Invitation sent
          </StyledTableBodyCellLeft>
          <StyledTableBodyCellRight align="right">Oct 1, 2024 - 11:06 AM</StyledTableBodyCellRight>
        </TableRow>
        <TableRow>
          <StyledTableBodyCellLeft component="th" scope="row">
            Challenge viewed
          </StyledTableBodyCellLeft>
          <StyledTableBodyCellRight align="right">Oct 1, 2024 - 11:06 AM</StyledTableBodyCellRight>
        </TableRow>
        <StyledTableRow>
          <StyledTableBodyCellLeft component="th" scope="row" styled={{fontFamily: 'inherit'}}>
            Challenge joined
          </StyledTableBodyCellLeft>
          <StyledTableBodyCellRight align="right">Oct 1, 2024 - 11:06 AM</StyledTableBodyCellRight>
        </StyledTableRow>
        </TableBody>
     </Table>
    </TableWrapper>
  </TableContainer>
  );

 return (
  <ModalDisplayTemplateA
    dialogTitleJSX={<TitleWrapper>{dialogTitleText}</TitleWrapper>}
    textFieldJSX={textFieldJSX}
    show={show}
    tallMode
    toggleModal={handleClose}
  />
 );
};

const StyledTableHeaderCell = styled(TableCell)`
  color: ${DesignTokenColors.neutral900};
  font-size: 10px;
  padding-top: 8px;
  font-weight: bold;
  font-family: inherit;
  padding: 4px;
`;

const StyledTableRow = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
  };
  border-color: ${DesignTokenColors.neutral100};
`
const StyledTableBodyCellLeft = styled(TableCell)`
  font-family: inherit;
  padding: 4px;
  padding-left: none;
  padding-right: 70px;
`;

const StyledTableBodyCellRight = styled(TableCell)`
  font-family: inherit;
  padding: 4px;
  padding-right: none;
`;

const TitleWrapper = styled('div')`
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 4px;
  padding-left: 4px;
  text-align: center;
  font-family: inherit;
`;

const TableWrapper = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutral100};
  margin-top: 4px; /* Adjust to give space below the title */
  margin-bottom: 4px;
  min-width: 300px;
  overflow-x: auto;
`;

export default withTheme(withStyles(templateAStyles)(ViewInviteeDetails));

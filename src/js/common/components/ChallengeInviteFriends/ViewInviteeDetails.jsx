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
     <Table sx={{ midWidth: 650 }} size="small" aria-label="simple table">
      <TableHead>
        <TableRow>
          <StyledTableCell>STATUS</StyledTableCell>
          <StyledTableCell align="right">DATE</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row">
            Invitation sent
          </TableCell>
          <TableCell align="right">Oct 1, 2024 - 11:06 AM</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Challenge viewed
          </TableCell>
          <TableCell align="right">Oct 1, 2024 - 11:06 AM</TableCell>
        </TableRow>
        <TableRow
           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            Challenge joined
          </TableCell>
          <TableCell align="right">Oct 1, 2024 - 11:06 AM</TableCell>
        </TableRow>
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

const StyledTableCell = styled(TableCell)`
  color: ${DesignTokenColors.neutral900};
  font-size: 10px;
  padding-top: 8px;
  font-weight: bold;
`;

const TitleWrapper = styled('div')`
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 4px;
  text-align: center;
  margin: 0;
`;

const TableWrapper = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutral300};
  width: 100%;
  margin-top: 8px; /* Adjust to give space below the title */
`;

export default withTheme(withStyles(templateAStyles)(ViewInviteeDetails));




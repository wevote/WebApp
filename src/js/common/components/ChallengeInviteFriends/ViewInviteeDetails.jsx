import React, { useState, useEffect } from 'react';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, DialogTitle } from '@mui/material';
import DesignTokenColors from '../Style/DesignTokenColors';
import ModalDisplayTemplateA, { templateAStyles } from '../../../components/Widgets/ModalDisplayTemplateA';
import ChallengeInviteeStore from '../../stores/ChallengeInviteeStore';

const ViewInviteeDetails = ({ inviteeId, show, setShow, setAnchorEl }) => {
  const [inviteeData, setInviteeData] = useState(null);

  useEffect(() => {
    const fetchInviteeData = async () => {
      const data = await ChallengeInviteeStore.getChallengeInviteeById(inviteeId);
      setInviteeData(data);
    };
    if (inviteeId) {
      fetchInviteeData();
    }
  }, [inviteeId]);

  const toggleModal = () => {
    setShow((prev) => !prev);
    if (!show) {
      setAnchorEl(null); // Handle anchor cleanup when closing
    }
  };

  const formatDate = (dateString, customMessage = 'Unavailable') => {
    if (!dateString) return customMessage;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    return `${formattedDate}`;
  };

  const dialogTitleJSX = (
    <>
      <StyledDialogTitle className="u-show-desktop-tablet">
        {inviteeData ? `${inviteeData.invitee_name}'s Invitation History` : 'Invitation History'}
      </StyledDialogTitle>
      <StyledDialogTitle className="u-show-mobile">
        {inviteeData ? 'Invitation History' : 'Invitation History'}
      </StyledDialogTitle>
    </>
    )

//   console.log('inviteeData:', inviteeData);
  const textFieldJSX = (
    <TableContainer components={Paper} sx={{ paddingBottom: '5px' }}>
      <TableWrapper>
        <StyledTable aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableHeaderCell>STATUS</StyledTableHeaderCell>
              <StyledTableHeaderCell align="right">DATE</StyledTableHeaderCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledTableBodyCellLeft component="th" scope="row">
                Invitation sent
              </StyledTableBodyCellLeft>
              <StyledTableBodyCellRight align="right">{inviteeData ? formatDate(inviteeData.date_invite_sent) : null}</StyledTableBodyCellRight>
            </TableRow>
            <TableRow>
              <StyledTableBodyCellLeft component="th" scope="row">
                Challenge viewed
              </StyledTableBodyCellLeft>
              <StyledTableBodyCellRight className="u-show-desktop-tablet" align="right">
                {inviteeData ? "Invitation hasn't been viewed" : null}
              </StyledTableBodyCellRight>
              <StyledTableBodyCellRight className="u-show-mobile" align="right">
                {inviteeData ? "Not viewed" : null}
              </StyledTableBodyCellRight>
            </TableRow>
            <StyledTableRow>
              <StyledTableBodyCellLeft component="th" scope="row" styled={{ fontFamily: 'inherit' }}>
                Challenge joined
              </StyledTableBodyCellLeft>
              <StyledTableBodyCellRight className="u-show-desktop-tablet" align="right">
                {inviteeData ? "Invitation hasn't been joined" : null}
              </StyledTableBodyCellRight>
              <StyledTableBodyCellRight className="u-show-mobile" align="right">
                {inviteeData ? "Not joined" : null}
              </StyledTableBodyCellRight>
            </StyledTableRow>
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </TableContainer>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={dialogTitleJSX}
      textFieldJSX={textFieldJSX}
      show={show}
      tallMode
      toggleModal={toggleModal}
    />
  );
};
ViewInviteeDetails.propTypes = {
  inviteeId: PropTypes.number,
  setShow: PropTypes.func,
  setAnchorEl: PropTypes.func,
  show: PropTypes.bool,
  uniqueExternalId: PropTypes.string,
};

const StyledDialogTitle = styled(DialogTitle)`
  padding: 12px 2px;
  padding-right: 55px;
`

const StyledTable = styled('table')`
  width: 100%;
  overflow: hidden;
`;

const StyledTableHeaderCell = styled(TableCell)`
  color: ${DesignTokenColors.neutral900};
  font-size: 10px;
  font-weight: bold;
  font-family: inherit;
  padding: 8px 4px 4px 4px;
  @media (max-width: 600px) {
    font-size: 8px; /* Reduce font size for smaller screens */
    padding: 4px; /* Adjust padding for smaller screens */
  }
`;

const StyledTableRow = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
  };
  border-color: ${DesignTokenColors.neutral100};
`;

const StyledTableBodyCellLeft = styled(TableCell)`
  font-family: inherit;
  padding: 4px;
  padding-right: 20px;
`;

const StyledTableBodyCellRight = styled(TableCell)`
  font-family: inherit;
  padding: 4px;
  padding-right: none;
`;

const TableWrapper = styled('div')`
  margin-bottom: 4px;
  min-width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

export default withTheme(withStyles(templateAStyles)(ViewInviteeDetails));

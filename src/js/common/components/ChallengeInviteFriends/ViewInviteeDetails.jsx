import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, DialogTitle, DialogActions, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import React, { Component, useState } from 'react';
import DesignTokenColors from '../Style/DesignTokenColors';
import ModalDisplayTemplateA, { templateAStyles, TextFieldWrapper } from '../../../components/Widgets/ModalDisplayTemplateA';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import CandidateStore from '../../../stores/CandidateStore';
import MeasureStore from '../../../stores/MeasureStore';
import SupportStore from '../../../stores/SupportStore';
import PayToPromoteProcess from '../CampaignSupport/PayToPromoteProcess';
import { isAndroid, isCordova } from '../../utils/isCordovaOrWebApp';

const ViewInviteeDetails = ({show, setShow, setAnchorEl}) => {

const handleClose = () => {
  setShow(false)
  setAnchorEl(null)
}

const dialogTitleText = "Jane's Invitation History"

const textFieldJSX = (
  <InvitationHistoryWrapper>
    <HorizontalLine/>
      <Table>
          <thead>
            <tr>
              <TableHeader>STATUS</TableHeader>
              <TableHeader>DATE</TableHeader>
            </tr>
          </thead>
          <tbody>
            <TableRow>
              <ColumnLeft>Invitation sent</ColumnLeft>
              <ColumnLeft>Oct 1, 2024 - 11:06 AM</ColumnLeft>
            </TableRow>
            <TableRow>
              <ColumnLeft>Challenge viewed</ColumnLeft>
              <ColumnLeft>Oct 1, 2024 - 4:32 PM</ColumnLeft>
            </TableRow>
            <TableRow>
              <ColumnLeft>Challenge joined</ColumnLeft>
              <ColumnLeft>Oct 1, 2024 - 5:02 PM</ColumnLeft>
            </TableRow>
          </tbody>
        </Table>
  </InvitationHistoryWrapper>
);

return (

  <ModalDisplayTemplateA
        dialogTitleJSX={<Title>{dialogTitleText}</Title>}
        textFieldJSX={textFieldJSX}
        show={show}
        tallMode
        toggleModal={handleClose}
      />
     );
 }


const InvitationHistoryWrapper = styled('div')`
  white-space: 2px;
`
const HorizontalLine = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutral300};
  padding: 0;
  margin: 0;

`
const Title = styled('div')`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  margin-top: 2px;
  padding-bottom: 8px;
  text-align: center;
`;

const Table = styled('table')`
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid ${DesignTokenColors.neutral300};
`;

const TableHeader = styled('th')`
  text-align: left;
  color: ${DesignTokenColors.neutral900};
  font-size: 10px;
  padding-top: 8px;
  &:nth-child(2) {
    text-align: right;
  }
`;

const TableRow = styled('tr')`
  background-color: white;
  &:last-child {
    td {
      border-bottom: none;
    }
`;

const ColumnLeft = styled('td')`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid ${DesignTokenColors.neutral300};
  &:nth-child(2) {
    text-align: right;
  }
`;


export default withTheme(withStyles(templateAStyles)(ViewInviteeDetails));





//
// class ViewInviteeDetails extends Component {
//   constructor (props) {
//     super(props);
//     this.state = {
//     };
//   }
//
//   componentDidMount () {
//     this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
//     // this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
//     this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
//     this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
//     const { ballotItemWeVoteId } = this.props;
//     const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
//     if (ballotItemStatSheet) {
//       const { voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet;
//       this.setState({
//         voterOpposesBallotItem,
//         voterSupportsBallotItem,
//       });
//     }
//
//     // const voter = VoterStore.getVoter();
//     // const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
//     // const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;
//
//     let ballotItemDisplayName = '';
//     // let ballotItemType;
//     let campaignXWeVoteId;
//     let isCandidate = false;
//     let isMeasure = false;
//     if (stringContains('cand', this.props.ballotItemWeVoteId)) {
//       const candidate = CandidateStore.getCandidateByWeVoteId(this.props.ballotItemWeVoteId);
//       ballotItemDisplayName = candidate.ballot_item_display_name || '';
//       // ballotItemType = 'CANDIDATE';
//       campaignXWeVoteId = candidate.linked_campaignx_we_vote_id || '';
//       isCandidate = true;
//     } else if (stringContains('meas', this.props.ballotItemWeVoteId)) {
//       const measure = MeasureStore.getMeasure(this.props.ballotItemWeVoteId);
//       ballotItemDisplayName = measure.ballot_item_display_name || '';
//       // ballotItemType = 'MEASURE';
//       isMeasure = true;
//     }
//     this.setState({
//       ballotItemDisplayName,
//       // ballotItemType,
//       campaignXWeVoteId,
//       isCandidate,
//       isMeasure,
//       // voterIsSignedIn,
//       // voterPhotoUrlMedium,
//     });
//   }
//
//   componentDidUpdate () {
//     const { initialFocusSet } = this.state;
//     if (this.positionInput) {
//       // Set the initial focus at the end of any existing text
//       if (!initialFocusSet) {
//         const { positionInput } = this;
//         const { length } = positionInput.value;
//         positionInput.focus();
//         positionInput.setSelectionRange(length, length);
//         this.setState({
//           initialFocusSet: true,
//         });
//       }
//     }
//   }
//
//   componentWillUnmount () {
//     this.candidateStoreListener.remove();
//     this.measureStoreListener.remove();
//     this.supportStoreListener.remove();
//     // this.voterStoreListener.remove();
//   }
//
//   onCandidateStoreChange () {
//     if (this.state.isCandidate) {
//       const { ballotItemWeVoteId } = this.props;
//       const candidate = CandidateStore.getCandidateByWeVoteId(ballotItemWeVoteId);
//       const ballotItemDisplayName = candidate.ballot_item_display_name || '';
//       const campaignXWeVoteId = candidate.linked_campaignx_we_vote_id || '';
//       this.setState({
//         ballotItemDisplayName,
//         campaignXWeVoteId,
//       });
//     }
//   }
//
//   onMeasureStoreChange () {
//     if (this.state.isMeasure) {
//       const { ballotItemWeVoteId } = this.props;
//       const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
//       const ballotItemDisplayName = measure.ballot_item_display_name || '';
//       this.setState({
//         ballotItemDisplayName,
//       });
//     }
//   }
//
//   onSupportStoreChange () {
//     const { ballotItemWeVoteId } = this.props;
//     const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
//     let voterOpposesBallotItem = '';
//     let voterSupportsBallotItem = '';
//     // let voterTextStatement = '';
//     // let voterPositionIsPublic = '';
//     if (ballotItemStatSheet) {
//       ({ voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet);
//     }
//     this.setState({
//       voterOpposesBallotItem,
//       voterSupportsBallotItem,
//     });
//
//     // if (ballotItemStatSheet) {
//     //   ({ voterPositionIsPublic, voterTextStatement } = ballotItemStatSheet);
//     // }
//     // this.setState({
//     //   voterTextStatement,
//     //   voterPositionIsPublic,
//     // });
//   }
//
//   // onVoterStoreChange () {
//   //   const voter = VoterStore.getVoter();
//   //   const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
//   //   const { voter_photo_url_medium: voterPhotoUrlMedium } = voter;
//   //   this.setState({
//   //     voterIsSignedIn,
//   //     voterPhotoUrlMedium,
//   //   });
//   // }
//

//
//     return (
//       <Dialog
// //         classes={{ paper: dialogPaperCombined }}
// //         onClose={() => this.props.toggleModal()}
//         open={show}
//         style={{ paddingTop: `${isCordova() ? '75px' : 'undefined'}` }}
//       >
//         <DialogTitle classes={{ root: classes.dialogTitle }}>
//           <DialogTitleInnerWrapper>
//             <Title>
// {/*               {dialogTitleJSX || <>&nbsp;</>} */}
//             </Title>
//             <IconButton
//               aria-label="Close"
//               classes={{ root: classes.closeButton }}
// //               onClick={() => this.props.toggleModal()}
//               id={`closeModalDisplayTemplateA${externalUniqueId}`}
//               size="large"
//             >
//               <Close />
//             </IconButton>
//           </DialogTitleInnerWrapper>
//         </DialogTitle>
//         <DialogContent
// //         classes={{ root: classes.dialogContent }}
//         >
//           <DialogContentInnerWrapper>
//             {textFieldJSX}
//           </DialogContentInnerWrapper>
//         </DialogContent>
//       </Dialog>
//     );
//   }
// }
// ViewInviteeDetails.propTypes = {
//   ballotItemWeVoteId: PropTypes.string.isRequired,
//   show: PropTypes.bool,
//   toggleModal: PropTypes.func.isRequired,
// };





//   <Dialog
//     open={show}
//     aria-label="view-invitee-details-modal"
//     onClose={handleClose}
//     style={{paddingTop: `${isCordova() ? '75px' : 'undefined'}` } }
//   >
//     <DialogTitle id="customized-dialog-title">
//       <DialogTitleInnerWrapper>
//         <Title>
//       Jane's invitation history
//         </Title>
//      <IconButton
//         aria-label="close"
//         onClick={handleClose}
//         size="large"
//         sx={{ marginLeft: 'auto' }}>
//        <Close />
//      </IconButton>
//      </DialogTitleInnerWrapper>
//     </DialogTitle>
//     <DialogContent dividers>
//       <Table>
//           <thead>
//             <tr>
//               <Th>STATUS</Th>
//               <Th>DATE</Th>
//             </tr>
//           </thead>
//           <tbody>
//             <Tr>
//               <Td>Invitation sent</Td>
//               <Td>Oct 1, 2024 - 11:06 AM</Td>
//             </Tr>
//             <Tr>
//               <Td>Challenge viewed</Td>
//               <Td>Oct 1, 2024 - 4:32 PM</Td>
//             </Tr>
//             <Tr>
//               <Td>Challenge joined</Td>
//               <Td>Oct 1, 2024 - 5:02 PM</Td>
//             </Tr>
//           </tbody>
//         </Table>
//     </DialogContent>
//   </Dialog>




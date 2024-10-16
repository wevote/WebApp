import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, DialogTitle, DialogActions, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import React, { Component, useState } from 'react';
import ModalDisplayTemplateA, { templateAStyles, TextFieldWrapper } from '../../../components/Widgets/ModalDisplayTemplateA';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import CandidateStore from '../../../stores/CandidateStore';
import MeasureStore from '../../../stores/MeasureStore';
import SupportStore from '../../../stores/SupportStore';
import PayToPromoteProcess from '../CampaignSupport/PayToPromoteProcess';
import { isAndroid, isCordova } from '../../utils/isCordovaOrWebApp';

// const PayToPromoteProcess = React.lazy(() => import(/* webpackChunkName: 'PayToPromoteProcess' */ './PayToPromoteProcess')); // eslint-disable-line import/no-cycle

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
// }));

const ViewInviteeDetails = ({show, setShow, setAnchorEl}) => {

  const handleClose = () => {
    setShow(false)
    setAnchorEl(null)}

   return (
      <Dialog
        open={show}
        aria-label="view-invitee-details-modal"
        onClose={handleClose}
        style={{paddingTop: `${isCordova() ? '75px' : 'undefined'}` } }
      >
        <DialogTitle id="customized-dialog-title">
          <DialogTitleInnerWrapper>
            <Title>
          Jane's invitation history
            </Title>
         <IconButton
            aria-label="close"
            onClick={handleClose}
            size="large"
            sx={{ marginLeft: 'auto' }}>
           <Close />
         </IconButton>
         </DialogTitleInnerWrapper>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Invitation sent
          </Typography>
          <Typography gutterBottom>
            Challenge viewed
          </Typography>
          <Typography gutterBottom>
            Challenge joined
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

const DialogTitleInnerWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
`;

const Title = styled('div')`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  margin-top: 2px;
  text-align: left;
  padding-left: 16px;
`;

export default withTheme(withStyles()(ViewInviteeDetails));

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
//   render () {
//     renderLog('ViewInviteeDetails');  // Set LOG_RENDER_EVENTS to log all renders
//     // const { ballotItemWeVoteId } = this.props;
//     const { show } = this.props;
//     // console.log('ViewInviteeDetails render, ballotItemWeVoteId: ', ballotItemWeVoteId, ', show: ', show);
//     const {
//       // ballotItemDisplayName,
//       campaignXWeVoteId,
//       // voterOpposesBallotItem, voterSupportsBallotItem,
//     } = this.state;
//
//     // const horizontalEllipsis = '\u2026';
//     let dialogTitleText = '';
//
//     // if (voterSupportsBallotItem) {
//     //   if (ballotItemDisplayName) {
//     //     dialogTitleText = `Why you chose ${ballotItemDisplayName}${horizontalEllipsis}`;
//     //   } else {
//     //     dialogTitleText = `Why you support${horizontalEllipsis}`;
//     //   }
//     // } else if (voterOpposesBallotItem) {
//     //   if (ballotItemDisplayName) {
//     //     dialogTitleText = `Why you oppose ${ballotItemDisplayName}${horizontalEllipsis}`;
//     //   } else {
//     //     dialogTitleText = `Why you oppose${horizontalEllipsis}`;
//     //   }
//     // } else if (ballotItemDisplayName) {
//     //   dialogTitleText = `Your thoughts about ${ballotItemDisplayName}${horizontalEllipsis}`;
//     // } else {
//     //   dialogTitleText = `Your thoughts${horizontalEllipsis}`;
//     // }
//     dialogTitleText = ''; // Overwrite until we can adjust
//
//     // console.log('ViewInviteeDetails render, voter_address_object: ', voter_address_object);
//     const textFieldJSX = (
//       <TextFieldWrapper>
//         Text
//       </TextFieldWrapper>
//     );
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

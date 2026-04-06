import { Checkbox, FormControlLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import AppObservableStore from '../../common/stores/AppObservableStore';
import { isIOS } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { handleNegativeAppReview } from '../../utils/appReviewFunctions';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';

/* global $ */

export default function ReviewAppModal (props) {
  const { initialEmail } = props;
  const [open, setOpen] = useState(true);
  const checkBoxInputRef = useRef(false);
  const emailInputRef = useRef('');
  const bodyInputRef = useRef('');

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    emailInputRef.current = props.initialEmail;
    const isShowing = AppObservableStore.getShowingNegativeFeedbackModal();
    if (isShowing) {
      return <></>;
    }
    AppObservableStore.setShowingNegativeFeedbackModal(true);
  }, []);

  const closeAnyOtherInstancesOfDialog = () => {
    $('#cancelReview').each((index, element) => {
      $(element).trigger('click');
    });
  };

  const handleClose = () => {
    // console.log('--- zzzz ----- ReviewAppModal handleClose()');
    AppObservableStore.setNegativeFeedbackPage('NONE');
    AppObservableStore.setShowingNegativeFeedbackModal(false);
    AppObservableStore.setShowNegativeFeedbackModal('NONE');
    closeAnyOtherInstancesOfDialog();
    setOpen(false);
  };

  const clickedSend = () => {
    const appReviewVersion = 'window.weVoteAppVersion';       // modified by buildSrcCordova.js
    const appReviewPlatform = isIOS() ? 'iOS' : 'Android';
    const appReviewBodyNegativeBypass = bodyInputRef.current.value;
    const okToSend = checkBoxInputRef.current.checked;
    const appReviewEmail = okToSend ?  emailInputRef.current : '';
    handleClose();
    handleNegativeAppReview(appReviewVersion, appReviewPlatform, appReviewBodyNegativeBypass, appReviewEmail);
  };

  renderLog('ReviewAppModal');  // Set LOG_RENDER_EVENTS to log all renders
  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{ '& .MuiDialog-paperScrollPaper': { margin: '2px' /* , maxWidth: '300px', maxHeight: '400px' */ } }}
        >
          <DialogTitle sx={{ '& .MuiDialogTitle-root': { padding: '16px 10px' } }}>
            Send feedback to WeVote
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>
                We would appreciate your feedback
              </span>
            </DialogContentText>
            <div id="feedback-form" style={{ paddingTop: '10px' }}>
              <TextField
                autoFocus
                type="text"
                id="outlined-basic"
                name="FormText"
                fullWidth
                multiline
                // increasing this to four caused the dialog to exceed page constraints on the VoterPositionEntryAndDisplay page
                rows={2}
                variant="outlined"
                // You can't have fontSize less than 16 on text fields in iOS or else it will auto-zoom for accessibility (and will stay zoomed)
                sx={isAndroid() && { '& .MuiOutlinedInput-input': { fontSize: '12px' } }}
                inputRef={bodyInputRef}
              />
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={initialEmail && initialEmail.length > 0}
                    color="primary"
                    id="statusOfferApprovedToBeSaved"
                    inputRef={checkBoxInputRef}
                    name="statusOfferApproved"
                  />
                )}
                label="WeVote can send me a reply at"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: isAndroid() ? '12px' : '14px', paddingBottom: '4px' } }}
              />
              <TextField id="outlined-basic"
                 name="EmailText"
                 type="email"
                 variant="outlined"
                 defaultValue={initialEmail}
                 sx={isAndroid() && { '& .MuiOutlinedInput-input': { fontSize: '12px' } }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="text" color="primary" id="cancelReview" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={clickedSend}>Send</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
ReviewAppModal.propTypes = {
  initialEmail: PropTypes.string,
};

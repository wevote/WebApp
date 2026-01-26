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
    const nfp = AppObservableStore.getNegativeFeedbackPage();
    if (isShowing) {
      return <></>;
    }
    const timeout = (['POSITION', 'ITEM'].includes(nfp)) ? 200 : 0;
    setTimeout(() => {
      AppObservableStore.setShowingNegativeFeedbackModal(true);
      console.log(`Cordova:    ReviewAppModal useEffect setShowingNegativeFeedbackModal: true, initialEmail: ${props.initialEmail}`);
    }, timeout);
  }, []);

  const handleClose = () => {
    // console.log('--- zzzz ----- ReviewAppModal handleClose()');
    AppObservableStore.setNegativeFeedbackPage('NONE');
    AppObservableStore.setShowingNegativeFeedbackModal(false);
    AppObservableStore.setShowNegativeFeedbackModal('NONE');
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
    setTimeout(() => {
      $(".cancelReview").each((index, element) => {
        $(element).trigger('click');
      });
    }, 1000);
  };

  renderLog('ReviewAppModal');  // Set LOG_RENDER_EVENTS to log all renders
  return (
    <>
      {open && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Send feedback to WeVote</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>
                We would appreciate your feedback
                {/* -- */}
                {/* {AppObservableStore.getNegativeFeedbackPage()} */}
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
                rows={2}  // increasing this to four caused the dialog to exceed page constraints on the VoterPositionEntryAndDisplay
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-input': { fontSize: '12px' } }}
                inputRef={bodyInputRef}
              />
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    id="statusOfferApprovedToBeSaved"
                    inputRef={checkBoxInputRef}
                    name="statusOfferApproved"
                  />
                )}
                label="WeVote can send me a reply at"
              />
              <TextField id="outlined-basic"
                 name="EmailText"
                 type="email"
                 variant="outlined"
                 defaultValue={initialEmail}
                 sx={{ '& .MuiOutlinedInput-input': { fontSize: '12px' } }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button class="cancelReview" onClick={handleClose}>Cancel</Button>
            <Button onClick={clickedSend}>Send</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
ReviewAppModal.propTypes = {
  initialEmail: PropTypes.string,
};

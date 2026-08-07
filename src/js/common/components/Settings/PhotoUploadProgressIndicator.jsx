import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export const PHOTO_UPLOAD_EARLY_MESSAGE = 'Uploading photo…';
export const PHOTO_UPLOAD_LONG_WAIT_MESSAGE = 'Still working. Large animations can take longer…';
export const PHOTO_UPLOAD_TOO_BIG_MESSAGE = 'This photo is too large. Please choose a file under 20 MB.';
export const PHOTO_UPLOAD_FAILED_MESSAGE = 'Couldn\'t upload photo. Please try again.';

const SHOW_DELAY_MS = 400;
const LONG_WAIT_MS = 10000;

/**
 * Time-based photo upload progress UI.
 * Shows after a short delay so fast uploads don't flash; escalates copy after ~10s.
 */
export default function PhotoUploadProgressIndicator ({ inProgress }) {
  const [visible, setVisible] = useState(false);
  const [longWait, setLongWait] = useState(false);

  useEffect(() => {
    if (!inProgress) {
      setVisible(false);
      setLongWait(false);
      return undefined;
    }
    const showTimer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    const longWaitTimer = setTimeout(() => setLongWait(true), LONG_WAIT_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(longWaitTimer);
    };
  }, [inProgress]);

  if (!inProgress || !visible) {
    return null;
  }

  return (
    <ProgressWrapper>
      <CircularProgress color="primary" size={32} />
      <ProgressText>
        {longWait ? PHOTO_UPLOAD_LONG_WAIT_MESSAGE : PHOTO_UPLOAD_EARLY_MESSAGE}
      </ProgressText>
    </ProgressWrapper>
  );
}
PhotoUploadProgressIndicator.propTypes = {
  inProgress: PropTypes.bool,
};

const ProgressWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 12px 0 4px 0;
  width: 100%;
`;

const ProgressText = styled('div')`
  color: #818181;
  font-family: 'Poppins', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-size: 16px;
  font-weight: 300;
  margin-top: 12px;
  text-align: center;
`;

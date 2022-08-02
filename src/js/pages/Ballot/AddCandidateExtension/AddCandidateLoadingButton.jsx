import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';


export default function AddCandidateLoadingButton (props) {
  const { loading, finished, text } = props;

  if (finished) {
    return (
      <Button
        disabled
        variant="contained"
        color="primary"
        type="submit"
        endIcon={<CheckIcon />}
      >
        Success
      </Button>
    );
  } else if (loading) {
    return (
      <LoadingButton
        loading
        loadingPosition="end"
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        type="submit"
      >
        {text}
      </LoadingButton>
    );
  } else {
    return (
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        type="submit"
      >
        {text}
      </Button>
    );
  }
}
AddCandidateLoadingButton.propTypes = {
  loading: PropTypes.bool,
  finished: PropTypes.bool,
  text: PropTypes.string,
};

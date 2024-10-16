import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ChallengeParticipantListRoot from '../ChallengeParticipantListRoot/ChallengeParticipantListRoot';

const YourRankModal = ({ challengeWeVoteId, classes, show, toggleModal }) => {
  // Consider including name of the challenge here
  // const challengeName = `Mr. Beast's "Get Out the Vote"`;
  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      onClose={() => toggleModal()}
      open={show}
    >
      <DialogTitle
        classes={{ root: classes.dialogTitle }}
      >
        <DialogTitleWrapper>
          <Title>
            Challenge Ranking
          </Title>
          <IconButton
            aria-label="Close"
            onClick={() => toggleModal()}
            size="large"
          >
            <Close />
          </IconButton>
        </DialogTitleWrapper>
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <ChallengeParticipantListRoot
          challengeWeVoteId={challengeWeVoteId}
        />
      </DialogContent>
    </Dialog>
  );
};
YourRankModal.propTypes = {
  challengeWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  dialogPaper: {
    borderRadius: '16px',
  },
  dialogTitle: {
    padding: '0px 0px 0px 10px',
  },
});

const DialogTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 30px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 0 0;
  text-align: left;
  padding-left: 0;
`;

export default withStyles(styles)(YourRankModal);

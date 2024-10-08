import { Close } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { withStyles } from '@mui/styles'
import React from 'react'
import styled from 'styled-components'
import ChallengeParticipantListRoot from '../ChallengeParticipantListRoot/ChallengeParticipantListRoot'


const YourRankModal = ({ classes, userRank, show, toggleModal }) => {
  const challengeName = `Mr. Beast's "Get Out the Vote"`
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
            Ranking -&nbsp;
            {challengeName}&nbsp;
            Challenge
          </Title>
          <IconButton
            aria-label='Close'
            onClick={() => toggleModal()}
            size='large'
          >
            <Close />
          </IconButton>
        </DialogTitleWrapper>
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <ChallengeParticipantListRoot />
      </DialogContent>
    </Dialog>
  );
};
const styles = (theme) => ({
  dialogPaper: {
    borderRadius: '16px',
  },
  dialogTitle: {
    padding: '0px 0px 0px 10px',
  }
})
const DialogTitleWrapper = styled.div`
  display: flex;
  min-height: 30px;
`

const Title = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  margin-top: 10px;
  text-align: left;
  padding-left: 0px;
`
export default withStyles(styles)(YourRankModal);
import React from 'react';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import JoinChallengeButton from './JoinChallengeButton'

const JoinChallengeAndLearnMoreButtons = ({ challengeWeVoteId, classes }) => {
  return (
    <JoinChallengeButtonWrapper>
      <Button
        classes={{ root: classes.joinChallengeButton }}
        color="primary"
        id={`challengeLearnMore-${challengeWeVoteId}`}
        variant="contained"
      >
       Join Challenge
      </Button>
      <Button
        classes={{ root: classes.learnMoreButton }}
        color="secondary"
        id={`challengeLearnMore-${challengeWeVoteId}`}
        variant="outlined"
      >
        Learn More
      </Button>
    </JoinChallengeButtonWrapper>
  );
};

const styles = () => ({
  joinChallengeButton: {
    borderRadius: 45,
    maxWidth: 300,
//     background: 'var(--Primary-600, #0858A1)',
//     border: '1px solid var(--Primary-400, #4187C6)',
//     color: 'var(--WhiteUI, #FFFFFF)',
    marginRight: '10px',
    marginTop: '10px',
  },
  learnMoreButton:{
    borderRadius: 45,
    maxWidth: 300,
//     background: 'white',
//     border: '1px solid var(--Primary-400, #4187C6)',
//     color: 'var(--Neutral-900, #2A2A2C)',
    marginTop: '10px',
//     '&:hover': {
//       backgroundColor: 'white',
//       color: 'var(--Neutral-900, #2A2A2C)',
//     },
  },
});

const JoinChallengeButtonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex;
`;

JoinChallengeAndLearnMoreButtons.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JoinChallengeAndLearnMoreButtons);



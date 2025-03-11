import React, { Suspense } from 'react';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import JoinChallengeButton from './JoinChallengeButton';

const JoinChallengeButton = React.lazy(() => import(/* webpackChunkName: 'JoinChallengeButton' */ '../../components/Challenge/JoinChallengeButton'));

const JoinChallengeAndLearnMoreButtons = ({ challengeWeVoteId, classes, inChallengeList }) => {
  return (
    <JoinChallengeButtonWrapper>
      <Suspense fallback={<></>}>
        <JoinChallengeButton
          // challengeSEOFriendlyPath={challengeSEOFriendlyPathForDisplay}
          challengeWeVoteId={challengeWeVoteId}
          inChallengeList={inChallengeList}
        />
      </Suspense>
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
    minWidth: 110,
    //    background: 'var(--Primary-600, #0858A1)',
    //     border: '1px solid var(--Primary-400, #4187C6)',
    //     color: 'var(--WhiteUI, #FFFFFF)',
  },
  learnMoreButton: {
    borderRadius: 45,
    maxWidth: 300,
    minWidth: 110,
    //     background: 'white',
    //     border: '1px solid var(--Primary-400, #4187C6)',
    //     color: 'var(--Neutral-900, #2A2A2C)',
    //     marginTop: '10px',
    fontSize: '14px',
    //     '&:hover': {
    //       backgroundColor: 'white',
    //       color: 'var(--Neutral-900, #2A2A2C)',
    //     },
  },
});

const JoinChallengeButtonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 250px;
`;

JoinChallengeAndLearnMoreButtons.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object.isRequired,
  inChallengeList: PropTypes.bool,
};

export default withStyles(styles)(JoinChallengeAndLearnMoreButtons);



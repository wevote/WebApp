import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import React, { Suspense, useEffect, useState } from 'react';
import { useReward } from 'react-rewards'; // react-rewards is a library for rewarding users with confetti
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import arrow from '../../../../img/global/icons/ph_arrow-up-bold.png';
import arrow1 from '../../../../img/global/icons/ph_arrow-up-bold_1.png';
import YourRankModal from './YourRankModal';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import FirstChallengeParticipantListController from '../ChallengeParticipantListRoot/FirstChallengeParticipantListController';

const YourRank = ({ classes, challengeWeVoteId }) => {
  const [clicked, setClicked] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [points, setPoints] = useState(0);
  // const [note, setNote] = useState("");
  const [arrowImage, setArrowImage] = useState(arrow);
  const [openYourRankModal, setOpenYourRankModal] = useState(false);
  const [rankOfVoter, setRankOfVoter] = React.useState(0);

  const { reward: triggerConfetti } = useReward('confettiReward', 'confetti', {
    elementCount: 50, // Number of confetti pieces
    spread: 80, // How far the confetti spreads
    elementSize: 8, // Size of the confetti
    zIndex: 10, // Z-index of the canvas
    springAnimation: true, // Should the confetti fall like spring animation
    colors: [
      DesignTokenColors.primary600, // Blue
      DesignTokenColors.caution800, // Yellow
      DesignTokenColors.confirmation700, // Green
      DesignTokenColors.accent500, // Orange
    ], // Colors of the confetti
    startVelocity: 20, // Higher velocity for a higher explosion
    decay: 0.9, // How quickly confetti falls back
    angle: 90, // Confetti moves straight up
  });

  const onAppObservableStoreChange = () => {
    setRankOfVoter(AppObservableStore.getChallengeParticipantRankOfVoterByChallengeWeVoteId(challengeWeVoteId));
  };

  const onChallengeParticipantStoreChange = () => {
    const sortedParticipantsWithRank = ChallengeParticipantStore.getChallengeParticipantList(challengeWeVoteId);
    setParticipantsCount(sortedParticipantsWithRank.length);
  };

  const handleClick = () => {
    setPoints((prevPoints) => {
      const newPoints = prevPoints + 1;
      setClicked(true);
      setArrowImage(arrow1);

      // triggerConfetti(); // Show confetti when the button is clicked (uncomment this line to show confetti when the button rank is clicked)

      setTimeout(() => {
        setClicked(false);
        setArrowImage(arrow);
      }, 3000);
      return newPoints;
    });
    setOpenYourRankModal(!openYourRankModal);
  };

  React.useEffect(() => {
    // console.log('Fetching participants for:', challengeWeVoteId);
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      challengeParticipantStoreListener.remove();
    };
  }, [challengeWeVoteId]);

  useEffect(() => {
    // Show confetti when the component mounts
    triggerConfetti();
    // Hide confetti after a short duration
    const timer = setTimeout(() => {
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <YourRankOuterWrapper>
      <YourRankInnerWrapper>
        <YourRankText>
          Your rank in the challenge:
        </YourRankText>
        <YourRankButtonWrapper clicked={clicked}>
          <Button
            id="confettiReward"
            onClick={handleClick}
            classes={{ root: classes.buttonDesktop }}
            style={{ color: clicked ? '#FFFFFF' : '#AC5204'}}
          >
            #
            {rankOfVoter}
            {' '}
            <span className="arrow">
              <img src={arrowImage} alt="arrow" classes={{ root: classes.arrow }} />
            </span>
          </Button>
        </YourRankButtonWrapper>
      </YourRankInnerWrapper>
      <Suspense fallback={<></>}>
        <FirstChallengeParticipantListController challengeWeVoteId={challengeWeVoteId} searchText="SEARCH TEXT HERE" />
      </Suspense>
      <Suspense fallback={<></>}>
        <YourRankModal
          challengeWeVoteId={challengeWeVoteId}
          show={openYourRankModal}
          toggleModal={() => setOpenYourRankModal(!openYourRankModal)}
        />
      </Suspense>
    </YourRankOuterWrapper>
  );
};
const styles = (theme) => ({
  buttonDesktop: {
    boxShadow: 'none !important',
    color: '#AC5204',
    height: '34px',
    border: '1px solid #AC5204',
    borderRadius: '20px 20px 20px 20px',
    transition: 'color 0.3s ease',
    textTransform: 'none',
    width: '105px',
  },
  desktopSimpleLink: {
    border: '2px solid #AC5204',
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: 250,
  },
  mobileSimpleLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  arrow: {
    width: '10.5px',
    height: '12.5px',
    top: '2.75px',
    left: '14.25px',
    gap: '0px',
    opacity: '0px',
    angle: '-90 deg',
  },
});

const YourRankInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  height: 70px;
  justify-content: center;
`;

const YourRankOuterWrapper = styled('div')`
  background-color: ${DesignTokenColors.neutralUI50};
  z-index: 100;
`;

const YourRankButtonWrapper = styled('div')`
  background-color: ${(props) => (props.clicked ? '#AC5204' : '#FFFFFF')};
  width: 105px;
  height: 34px;
  //top: 443px;
  //left: 234px;
  gap: 0px;
  border-radius: 20px;
  border: 1px solid #AC5204;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const YourRankText = styled('div')`
  margin-right: 10px;
`;

export default withStyles(styles)(YourRank);

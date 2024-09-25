import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import JoinedGreenCircle from '../../../../img/global/svg-icons/issues/joined-green-circle.svg';
import InfoOutlineIcon from '../../../../img/global/svg-icons/issues/material-symbols-info-outline.svg';
import ChallengeStore from '../../stores/ChallengeStore';
import daysUntil from '../../utils/daysUntil';

function JoinedAndDaysLeft ({ challengeWeVoteId }) {
  // eslint-disable-next-line no-unused-vars
  const [daysLeft, setDaysLeft] = React.useState(0);
  const [voterIsChallengeParticipant, setVoterIsChallengeParticipant] = React.useState(false);

  const onChallengeStoreChange = () => {
    const challenge = ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId);
    let challengeEndsDayText = '';
    if (challenge && challenge.challenge_ends_date_as_integer) {
      // TODO: Convert integer to date format
      challengeEndsDayText = '2024-11-05';
    } else {
      challengeEndsDayText = '2024-11-05';
    }
    const daysToChallengeEnds = daysUntil(challengeEndsDayText);
    // console.log('Days to challenge ends:', daysToChallengeEnds);
    setDaysLeft(daysToChallengeEnds);
    setVoterIsChallengeParticipant(ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteId));
  };

  React.useEffect(() => {
    // console.log('Fetching participants for:', challengeWeVoteId);
    const storeListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();

    return () => {
      storeListener.remove();
    };
  }, [challengeWeVoteId]);
  return (
    <InfoWrapper>
      {/* SVG, Joined, Dot, and Days Left */}
      <JoinedInfoWrapper>
        {voterIsChallengeParticipant ? (
          <>
            <JoinedIcon src={JoinedGreenCircle} alt="Joined" />
            <JoinedText>Joined</JoinedText>
            <DotSeparator>•</DotSeparator>
          </>
        ) : (
          <InfoIcon src={InfoOutlineIcon} alt="Info" />
        )}
        <DaysLeftText>
          {daysLeft}
          {' '}
          Days Left
        </DaysLeftText>
      </JoinedInfoWrapper>
    </InfoWrapper>
  );
}

JoinedAndDaysLeft.propTypes = {
  challengeWeVoteId: PropTypes.string.isRequired,
};

// Styled Components

const InfoIcon = styled('img')`
  height: 17px;
  margin-right: 5px;
  width: 17px;
`;

const InfoWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
`;

const JoinedInfoWrapper = styled('div')`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #d2d2d2;
  border-radius: 20px;
  display: flex;
  height: auto;
  justify-content: center;
  padding: 5px 10px;
  width: auto;
`;

const JoinedIcon = styled('img')`
  height: 17px;
  margin-right: 5px;
  width: 17px;
`;

const JoinedText = styled('span')`
  color: #2a2a2c;
  font-size: 13px;
  font-weight: 400;
`;

const DotSeparator = styled('span')`
  color: #6b6b6b;
  font-size: 13px;
  font-weight: 400;
  margin: 0 5px;
`;

const DaysLeftText = styled('span')`
  color: #2a2a2c;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

export default JoinedAndDaysLeft;

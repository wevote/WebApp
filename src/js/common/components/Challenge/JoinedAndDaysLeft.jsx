import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import JoinedGreenCircle from '../../../../img/global/svg-icons/joined-green-circle.svg';
import InfoOutlineIcon from '../../../../img/global/svg-icons/material-symbols-info-outline.svg';
import ChallengeStore from '../../stores/ChallengeStore';
import DesignTokenColors from '../Style/DesignTokenColors';

const ChallengeParticipantFirstRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeParticipantFirstRetrieveController' */ '../ChallengeParticipant/ChallengeParticipantFirstRetrieveController'));

function JoinedAndDaysLeft ({ challengeWeVoteId, borderSwitcher }) {
  // eslint-disable-next-line no-unused-vars
  const [daysLeft, setDaysLeft] = React.useState(0);
  const [voterIsChallengeParticipant, setVoterIsChallengeParticipant] = React.useState(false);

  const onChallengeStoreChange = () => {
    const daysToChallengeEnds = ChallengeStore.getDaysUntilChallengeEnds(challengeWeVoteId);
    // console.log('Days to challenge ends:', daysToChallengeEnds);
    setDaysLeft(daysToChallengeEnds);
    setVoterIsChallengeParticipant(ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteId));
  };

  React.useEffect(() => {
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();

    return () => {
      challengeStoreListener.remove();
    };
  }, [challengeWeVoteId]);
  return (
    <InfoWrapper>
      {/* SVG, Joined, Dot, and Days Left */}
      <JoinedInfoWrapper borderSwitcher={borderSwitcher}>
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
      <Suspense fallback={<span>&nbsp;</span>}>
        <ChallengeParticipantFirstRetrieveController challengeWeVoteId={challengeWeVoteId} />
      </Suspense>
    </InfoWrapper>
  );
}
JoinedAndDaysLeft.propTypes = {
  challengeWeVoteId: PropTypes.string.isRequired,
  borderSwitcher: PropTypes.bool,
};
JoinedAndDaysLeft.defaultProps = {
  borderSwitcher: true,  // Default true shows border around the joined and days left info
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

const JoinedInfoWrapper = styled('div', {
  shouldForwardProp: (prop) => !['borderSwitcher'].includes(prop),
})(({ borderSwitcher }) => `
  align-items: center;
  background-color: ${DesignTokenColors.whiteUI};
  border: ${borderSwitcher ? `1px solid ${DesignTokenColors.neutral100}` : 'none'};
  border-radius: 20px;
  display: flex;
  height: auto;
  justify-content: center;
  padding: 5px 10px;
  width: auto;
`);

const JoinedIcon = styled('img')`
  height: 17px;
  margin-right: 5px;
  width: 17px;
`;

const JoinedText = styled('span')`
  color: ${DesignTokenColors.neutral900};
  font-size: 13px;
  font-weight: 400;
`;

const DotSeparator = styled('span')`
  color: ${DesignTokenColors.neutral500};
  font-size: 13px;
  font-weight: 400;
  margin: 0 5px;
`;

const DaysLeftText = styled('span')`
  color: ${DesignTokenColors.neutral900};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

export default JoinedAndDaysLeft;

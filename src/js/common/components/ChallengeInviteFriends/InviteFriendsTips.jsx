import withStyles from '@mui/styles/withStyles';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import { renderLog } from '../../utils/logging';
import { CampaignProcessStepIntroductionText } from '../Style/CampaignProcessStyles';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';

function InviteFriendsTips ({ challengeWeVoteId, startingTipName }) {
  renderLog('InviteFriendsTips');
  const [challengeInviteesCount, setChallengeInviteesCount] = React.useState(0);
  const [challengeParticipantCount, setChallengeParticipantCount] = React.useState(0);
  const [participantNameWithHighestRank, setParticipantNameWithHighestRank] = React.useState('');
  const [tipToShow, setTipToShow] = React.useState('');

  const goToNextTip = async () => {
    if (tipToShow === 'nameEachFriend') {
      setTipToShow('sendMessage');
    } else if (tipToShow === 'sendMessage') {
      setTipToShow('youWillGetPoints');
    } else if (tipToShow === 'youWillGetPoints') {
      setTipToShow('nameEachFriend');
    }
  };

  const onAppObservableStoreChange = () => {
    setParticipantNameWithHighestRank(AppObservableStore.getChallengeParticipantNameWithHighestRankByChallengeWeVoteId(challengeWeVoteId));
  };

  const onChallengeStoreChange = () => {
    if (challengeInviteesCount < ChallengeStore.getNumberOfInviteesInChallenge(challengeWeVoteId)) {
      setChallengeInviteesCount(ChallengeStore.getNumberOfInviteesInChallenge(challengeWeVoteId));
    }
    if (challengeParticipantCount < ChallengeStore.getNumberOfParticipantsInChallenge(challengeWeVoteId)) {
      setChallengeParticipantCount(ChallengeStore.getNumberOfParticipantsInChallenge(challengeWeVoteId));
    }
  };

  const onChallengeParticipantStoreChange = () => {
    if (challengeParticipantCount < ChallengeParticipantStore.getNumberOfParticipantsInChallenge(challengeWeVoteId)) {
      setChallengeParticipantCount(ChallengeParticipantStore.getNumberOfParticipantsInChallenge(challengeWeVoteId));
    }
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
    };
  }, [challengeWeVoteId]);

  React.useEffect(() => {
    setTipToShow(startingTipName);
  }, [startingTipName]);

  let tipJsx = <></>;
  if (tipToShow === 'nameEachFriend') {
    tipJsx = (
      <CampaignProcessStepIntroductionText>
        <StyledChip label="TIP" />
        &nbsp;
        <strong>
          Name each friend
        </strong>
        {' '}
        and invite them
        {' '}
        <strong>
          separately
        </strong>
        , so we can give you the most boost points.
        &nbsp;&nbsp;
        <NextSpan onClick={goToNextTip}>next &gt;</NextSpan>
      </CampaignProcessStepIntroductionText>
    );
  } else if (tipToShow === 'sendMessage') {
    tipJsx = (
      <CampaignProcessStepIntroductionText>
        <StyledChip label="TIP" colorOptionNumber={1} />
        &nbsp;
        Send the copied message
        {' '}
        <strong>
          from your own phone or email
        </strong>
        {' '}
        to your friend, and then click the &quot;Confirm you sent invite&quot; button below.
        &nbsp;&nbsp;
        <NextSpan onClick={goToNextTip}>next &gt;</NextSpan>
      </CampaignProcessStepIntroductionText>
    );
  } else if (tipToShow === 'youWillGetPoints') {
    tipJsx = (
      <CampaignProcessStepIntroductionText>
        <StyledChip label="TIP" colorOptionNumber={2} />
        &nbsp;
        When your friend views or joins this challenge
        {' '}
        <strong>
          you will get points
        </strong>
        {' '}
        that boost your rank.
        &nbsp;&nbsp;
        <NextSpan onClick={goToNextTip}>next &gt;</NextSpan>
      </CampaignProcessStepIntroductionText>
    );
  }
  return (
    <InviteFriendsTipsWrapper>
      {tipJsx}
    </InviteFriendsTipsWrapper>
  );
}
InviteFriendsTips.propTypes = {
  challengeWeVoteId: PropTypes.string,
  startingTipName: PropTypes.string,
};

const styles = () => ({
  howToVoteRoot: {
    color: '#999',
    height: 18,
    width: 18,
  },
});

const InviteFriendsTipsWrapper = styled('div')`
`;

const NextSpan = styled('span')`
  color: ${DesignTokenColors.primary500};
  float: right;
  margin-right: 10px;
  text-decoration:underline;
`;

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => !['colorOptionNumber'].includes(prop),
})(({ colorOptionNumber }) => (`
  ${colorOptionNumber ? '' : `background-color: ${DesignTokenColors.confirmation700};`}
  ${colorOptionNumber === 1 ? `background-color: ${DesignTokenColors.warning800};` : ''}
  ${colorOptionNumber === 2 ? `background-color: ${DesignTokenColors.info900};` : ''}
  color: ${DesignTokenColors.whiteUI};
  height: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
`));

export default withStyles(styles)(InviteFriendsTips);

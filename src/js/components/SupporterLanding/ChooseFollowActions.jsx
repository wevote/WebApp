import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ActionCountLabel from './ActionCountLabel';
import ChooseButton from './ChooseButton';
import FollowButton from './FollowButton';

// The Choose / -OR- / Follow action row, with the running counts underneath each
// button. On mobile the two actions stack (Choose above, Follow below).
export default function ChooseFollowActions ({ chosen, following, chosenCount, followingCount, onChoose, onFollow }) {
  return (
    <ActionsWrapper>
      <ActionColumn>
        <ChooseButton chosen={chosen} onClick={onChoose} />
        <ActionCountLabel count={chosenCount} suffix="have chosen" />
      </ActionColumn>

      <OrDivider $chosen={chosen}>-OR-</OrDivider>

      <ActionColumn>
        <FollowButton following={following} onClick={onFollow} />
        <ActionCountLabel count={followingCount} suffix="are following" />
      </ActionColumn>
    </ActionsWrapper>
  );
}
ChooseFollowActions.propTypes = {
  chosen: PropTypes.bool,
  following: PropTypes.bool,
  chosenCount: PropTypes.number,
  followingCount: PropTypes.number,
  onChoose: PropTypes.func,
  onFollow: PropTypes.func,
};

const ActionColumn = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 160px;
`;

// Equal-width action columns with the "-OR-" between them via a plain flex gap, so the
// "-OR-" is equidistant from both buttons. The middle "-OR-" has a fixed width so its
// centre is deterministic (160 + 16 + 20 = 196px from the left), which the divider in
// ChooseExplainerColumns lines up under.
const ActionsWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 16px;
`;

const OrDivider = styled.span`
  color: ${DesignTokenColors.neutral500};
  font-size: 15px;
  font-weight: 400;
  padding-top: 10px;
  text-align: center;
  visibility: ${({ $chosen }) => ($chosen ? 'hidden' : 'visible')};
  width: 40px;
`;

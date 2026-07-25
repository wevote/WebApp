import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ShareOptionCard from './ShareOptionCard';

// Row of white share cards. Each card is weighted (per its label length) so labels wrap
// to at most 2 lines on desktop; on mobile the cards reflow to two per row (2 × 2).
export default function ShareOptionsGrid ({ groups, onShare }) {
  return (
    <Grid>
      {groups.map((group) => (
        <CardSlot key={group.key} $flex={group.flex} $single={group.options.length === 1}>
          <ShareOptionCard options={group.options} onShare={onShare} />
        </CardSlot>
      ))}
    </Grid>
  );
}
ShareOptionsGrid.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    flex: PropTypes.number,
    options: PropTypes.array,
  })),
  onShare: PropTypes.func,
};

const CardSlot = styled.div`
  display: flex;
  flex: ${({ $flex }) => $flex};
  min-width: 0;

  & > div {
    width: 100%;
  }

  /* Mobile: two cards per row (2 × 2) at a ~1:2 ratio, so the double-option cards stay
     wide enough to keep their labels to 2 lines */
  @media (max-width: 575px) {
    flex: 0 0 ${({ $single }) => ($single ? 'calc(33.333% - 6px)' : 'calc(66.667% - 6px)')};
  }
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// The two-column explainer under the buttons (only shown before choosing):
//   left  — what "Choose" does
//   right — the "Not ready to choose?" follow pitch, split by a vertical divider.
export default function ChooseExplainerColumns ({ candidateFirstName }) {
  return (
    <ColumnsWrapper>
      <ExplainerColumn>
        Choosing marks
        {' '}
        {candidateFirstName}
        {' '}
        on your WeVote digital ballot for the most impact.
      </ExplainerColumn>
      <ColumnDivider />
      <ExplainerColumn>
        <strong>Not ready to choose?</strong>
        {' '}
        Following
        {' '}
        {candidateFirstName}
        {' '}
        helps build public trust and lets WeVote suggest similar
        candidates and measures to help you complete your ballot.
        {' '}
        <InlineLink type="button">Learn more</InlineLink>
      </ExplainerColumn>
    </ColumnsWrapper>
  );
}
ChooseExplainerColumns.propTypes = {
  candidateFirstName: PropTypes.string,
};

const ColumnDivider = styled.span`
  align-self: stretch;
  background: ${DesignTokenColors.neutralUI200};
  justify-self: center;
  width: 1px;
`;

// The divider sits under the "-OR-" above it (centre at 196px = 160 action column + 16
// gap + 20 half of the 40px "-OR-"). Zero grid gap + fixed columns: left column 194px so
// the 4px divider column centres at 196; the right paragraph aligns with the Follow
// column via padding-left (track starts at 198, + 36 = 234). Only the left paragraph's
// width changes when tuning.
const ColumnsWrapper = styled.div`
  align-items: stretch;
  column-gap: 0;
  display: grid;
  grid-template-columns: 194px 4px 1fr;

  & > p:first-of-type {
    padding-right: 6px;
  }

  & > p:last-of-type {
    padding-left: 36px;
  }
`;

const ExplainerColumn = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;

const InlineLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 15px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

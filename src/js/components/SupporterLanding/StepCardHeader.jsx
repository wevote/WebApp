import { Check as CheckIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Shared header for the step cards, laid out as two side-by-side columns so the reason
// sits just to the right of the title (not flung to the card's far edge):
//   left column  — "STEP N" kicker over the icon + title
//   right column — "WHY?" kicker over the "-> reason" (WHY? hidden on mobile)
// The columns wrap on narrow screens, dropping the reason below the title. `titleIcon`
// is the glyph before the title (a check for Step 1, a chat bubble for Step 2); `chosen`
// adds the green completion check to the "STEP N" kicker.
export default function StepCardHeader ({ stepNumber, kickerSuffix = '', titleIcon, title, why, chosen = false, fontSize = 21, mobileFontSize = 17, reasonGap = 10 }) {
  return (
    <HeaderWrapper $reasonGap={reasonGap}>
      <LeftColumn>
        <Kicker>
          {chosen && <CheckCircleIcon style={{ fontSize: 18, color: DesignTokenColors.confirmation600 }} />}
          {`STEP ${stepNumber}${kickerSuffix}`}
        </Kicker>
        <TitleGroup>
          {titleIcon}
          <Title $size={fontSize} $mobileSize={mobileFontSize}>{title}</Title>
          {/* Desktop keeps the arrow at the end of the title */}
          <Arrow className="u-show-desktop-tablet">&rarr;</Arrow>
        </TitleGroup>
      </LeftColumn>

      <RightColumn>
        <WhyKicker>WHY?</WhyKicker>
        <ReasonGroup>
          {/* Mobile pairs the arrow with the reason on its own line */}
          <Arrow className="u-show-mobile">&rarr;</Arrow>
          <Why $size={fontSize} $mobileSize={mobileFontSize}>{why}</Why>
        </ReasonGroup>
      </RightColumn>
    </HeaderWrapper>
  );
}
StepCardHeader.propTypes = {
  stepNumber: PropTypes.number,
  kickerSuffix: PropTypes.string,
  titleIcon: PropTypes.node,
  title: PropTypes.node,
  why: PropTypes.string,
  chosen: PropTypes.bool,
  fontSize: PropTypes.number,
  mobileFontSize: PropTypes.number,
  reasonGap: PropTypes.number,
};
StepCardHeader.defaultProps = {
  titleIcon: <CheckIcon style={{ fontSize: 20 }} />,
};

const Arrow = styled.span`
  color: ${DesignTokenColors.neutral700};
  font-size: 26px;
`;

const HeaderWrapper = styled.div`
  align-items: flex-start;
  column-gap: ${({ $reasonGap }) => $reasonGap}px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 6px;

  @media (max-width: 575px) {
    row-gap: 0;
  }
`;

const Kicker = styled.div`
  align-items: center;
  color: ${DesignTokenColors.neutral500};
  display: flex;
  font-size: 18px;
  font-weight: 600;
  gap: 6px;
  height: 22px;
  letter-spacing: 0.04em;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ReasonGroup = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  min-height: 34px;

  /* Mobile: drop the height reservation and indent so the arrow lines up under the
     title text (past the checkmark), and sits tight beneath it */
  @media (max-width: 575px) {
    margin-left: 28px;
    min-height: 0;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.span`
  font-size: ${({ $size }) => $size}px;
  font-weight: 600;

  /* Shrink so the title stays on one line even on narrow phones */
  @media (max-width: 575px) {
    font-size: ${({ $mobileSize }) => $mobileSize}px;
  }
`;

const TitleGroup = styled.div`
  align-items: center;
  color: ${DesignTokenColors.neutral700};
  display: flex;
  gap: 8px;
  min-height: 34px;

  @media (max-width: 575px) {
    min-height: 0;
  }
`;

const Why = styled.span`
  color: ${DesignTokenColors.neutral700};
  font-size: ${({ $size }) => $size}px;
  font-style: italic;
  font-weight: 400;

  @media (max-width: 575px) {
    font-size: ${({ $mobileSize }) => $mobileSize}px;
  }
`;

const WhyKicker = styled.span`
  align-items: center;
  color: ${DesignTokenColors.neutral500};
  display: inline-flex;
  font-size: 16px;
  font-weight: 400;
  height: 22px;
  letter-spacing: 0.06em;

  @media (max-width: 575px) {
    display: none;
  }
`;

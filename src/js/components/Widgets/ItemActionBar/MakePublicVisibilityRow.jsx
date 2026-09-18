import { Language, MoreHoriz } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

/**
 * MakePublicVisibilityRow
 *
 * Shown inline after clicking the chat bubble.
 * Parent (VisibilityInlineWrapper) handles the left divider and spacing.
 *
 * isPublic=false  →  "Choice & opinion visible to WeVote friends only. ···"
 *                    "🌐 Make public to influence more people."
 *
 * isPublic=true   →  "Choice & opinion visible to public. ···"
 */

export default function MakePublicVisibilityRow ({ isPublic, onMakePublic, onDotsClick }) {
  return (
    <Wrapper>
      <TopRow>
        <VisibilityText isPublic={isPublic}>
          {isPublic ?
            'Choice & opinion visible to public.' :
            'Choice & opinion visible to WeVote friends only.'}
        </VisibilityText>
        <DotsButton aria-label="More options" onClick={onDotsClick} type="button">
          <MoreHoriz style={{ fontSize: 18 }} />
        </DotsButton>
      </TopRow>

      {!isPublic && (
        <MakePublicRow>
          <MakePublicButton
            onClick={onMakePublic}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMakePublic();
              }
            }}
          >
            <Language style={{ fontSize: 16, color: '#0075b8', marginRight: 4 }} />
            <MakePublicText>Make public</MakePublicText>
          </MakePublicButton>
          <MakePublicSuffix>&nbsp;to influence more people.</MakePublicSuffix>
        </MakePublicRow>
      )}
    </Wrapper>
  );
}

MakePublicVisibilityRow.propTypes = {
  isPublic: PropTypes.bool,
  onMakePublic: PropTypes.func,
  onDotsClick: PropTypes.func,
};

MakePublicVisibilityRow.defaultProps = {
  isPublic: false,
  onMakePublic: () => {},
  onDotsClick: () => {},
};

// Styled Components

const DotsButton = styled('button')`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: #555;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 1;

  &:hover { color: #111; }
  &:focus-visible {
    outline: 2px solid #0075b8;
    border-radius: 2px;
  }
`;

const MakePublicButton = styled('span').withConfig({
  shouldForwardProp: (prop) => !['label', 'labelPublic'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #0075b8;
    border-radius: 2px;
  }
`;

const MakePublicRow = styled('div')`
  display: flex;
  align-items: center;
`;

const MakePublicSuffix = styled('span')`
  color: #555;
  font-size: 13px;
  white-space: nowrap;
`;

const MakePublicText = styled('span')`
  color: #0075b8;
  font-size: 13px;
  white-space: nowrap;

  &:hover { color: #005a8e; }
`;

const TopRow = styled('div')`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
`;

const VisibilityText = styled('span').withConfig({
  shouldForwardProp: (prop) => prop !== 'isPublic',
})(({ isPublic }) => (`
  color: #555;
  white-space: nowrap;
  font-weight: ${isPublic ? 'normal' : '600'};
  font-style: ${isPublic ? 'normal' : 'italic'};
`));

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  font-size: 13px;
  line-height: 1.4;
  padding-right: 0;
`;

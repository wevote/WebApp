import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Collapsible "Personal message from <candidate>:" row. Collapsed shows a one-line
// preview; expanded reveals the full note.
export default function PersonalMessageCollapse ({ candidateName, message, previewText }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <MessageWrapper>
      <MessageToggle
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <ToggleArrow $expanded={expanded}>
          <ArrowDownIcon fontSize="small" />
        </ToggleArrow>
        <ToggleLabel>
          {`Personal message from ${candidateName}:`}
        </ToggleLabel>
        <Quote>
          {expanded ? `“${message}”` : `“${previewText}”`}
        </Quote>
      </MessageToggle>
    </MessageWrapper>
  );
}
PersonalMessageCollapse.propTypes = {
  candidateName: PropTypes.string,
  message: PropTypes.string,
  previewText: PropTypes.string,
};

const MessageToggle = styled.button`
  align-items: baseline;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  text-align: left;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

// One element for both the collapsed preview and the expanded full text, so the quote
// starts in exactly the same place either way (no shift when toggling).
const Quote = styled.span`
  color: ${DesignTokenColors.neutral600};
  font-style: italic;
  line-height: 1.5;
`;

const ToggleArrow = styled.span`
  align-self: center;
  color: ${DesignTokenColors.neutral700};
  display: inline-flex;
  transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
  transition: transform 0.15s ease;
`;

const ToggleLabel = styled.span`
  color: ${DesignTokenColors.neutral900};
  font-weight: 700;
  text-decoration: none;

  /* Hover treatment only on non-touch (desktop/tablet); avoids sticky blue+underline on mobile */
  @media (min-width: 576px) {
    &:hover {
      color: ${DesignTokenColors.primary600};
      text-decoration: underline;
    }
  }
`;

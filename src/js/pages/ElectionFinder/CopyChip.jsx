import { ContentCopy } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActionChip, DarkTooltip } from './electionFinderStyles';

const COPIED_DURATION_MS = 3000;

// Only one CopyChip on the page should show "Copied!" at a time. Each instance
// registers its reset; clicking a chip calls every other chip's reset first.
const resetCallbacks = new Set();

// getText is a function (not a string) so callers with side effects in the
// path computation (e.g. CandidateActions fetch) only run them on click.
export default function CopyChip ({ defaultLabel, getText }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setCopied(false);
  }, []);

  useEffect(() => {
    resetCallbacks.add(reset);
    return () => {
      resetCallbacks.delete(reset);
      clearTimeout(timeoutRef.current);
    };
  }, [reset]);

  const onClick = () => {
    resetCallbacks.forEach((r) => { if (r !== reset) r(); });
    navigator.clipboard.writeText(getText());
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
  };

  const label = copied ? 'Copied!' : defaultLabel;
  return (
    <DarkTooltip title={label}>
      <ActionChip onClick={onClick}>
        <ContentCopy sx={{ fontSize: 14, mr: 0.5 }} />
        {label}
      </ActionChip>
    </DarkTooltip>
  );
}

CopyChip.propTypes = {
  defaultLabel: PropTypes.string.isRequired,
  getText: PropTypes.func.isRequired,
};

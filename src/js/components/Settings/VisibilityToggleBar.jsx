import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'friends', label: 'WeVote friends' },
  { value: 'private', label: 'Private' },
];

function VisibilityToggleBar ({ value, onChange }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, right: 0 });
  const hasAnimated = useRef(false);

  const measureIndicator = useCallback(() => {
    const selectedIndex = OPTIONS.findIndex((opt) => opt.value === value);
    const button = buttonRefs.current[selectedIndex];
    const container = containerRef.current;
    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setIndicator({
        left: buttonRect.left - containerRect.left,
        right: containerRect.right - buttonRect.right,
      });
    }
  }, [value]);

  useEffect(() => {
    measureIndicator();
    if (!hasAnimated.current) {
      requestAnimationFrame(() => { hasAnimated.current = true; });
    }
  }, [value, measureIndicator]);

  // Re-measure on window resize
  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [measureIndicator]);

  return (
    <Container ref={containerRef} role="group" aria-label="Visibility setting">
      <SlidingIndicator
        style={{
          left: indicator.left,
          right: indicator.right,
        }}
        animate={hasAnimated.current}
      />
      {OPTIONS.map((opt, i) => (
        <ToggleButton
          key={opt.value}
          ref={(el) => { buttonRefs.current[i] = el; }}
          type="button"
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          data-label={opt.label}
        >
          {opt.label}
        </ToggleButton>
      ))}
    </Container>
  );
}

VisibilityToggleBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Container = styled('div')`
  border: 2px solid ${DesignTokenColors.neutralUI300};
  border-radius: 15px;
  display: inline-flex;
  margin-bottom: 1px;
  overflow: hidden;
  position: relative;
  width: fit-content;
`;

const SlidingIndicator = styled('div')`
  background-color: ${DesignTokenColors.info100};
  border-radius: 13px;
  bottom: 2px;
  position: absolute;
  top: 2px;
  transition: ${(props) => (props.animate ? 'left 0.3s ease, right 0.3s ease' : 'none')};
  z-index: 0;
`;

const ToggleButton = styled('button')`
  background: transparent;
  border: none;
  color: ${(props) => (props.selected ? DesignTokenColors.info800 : DesignTokenColors.neutralUI700)};
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 14px;
  font-weight: ${(props) => (props.selected ? '600' : '400')};
  padding: 4px 12px;
  position: relative;
  transition: color 0.2s ease, font-weight 0.2s ease;
  z-index: 1;


  /* Reserve bold width so layout doesn't shift */
  &::after {
    content: attr(data-label);
    font-weight: 600;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }

  &:hover {
    color: ${DesignTokenColors.info800};
  }
`;

export default VisibilityToggleBar;

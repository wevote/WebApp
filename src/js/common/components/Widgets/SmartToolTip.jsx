import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const SmartTooltip = ({ title, placement, triggerType, children, tooltipId }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [showTooltip, setShowTooltip] = useState(false);
  const wrapperRef = useRef(null);
  const idRef = useRef(tooltipId || `smartTooltip-${Math.random().toString(36).slice(2, 11)}`);

  // Determine effective mode (desktop: hover-only, mobile: click-only) based on prop.
  // "hover" -> desktop only, "click" -> mobile only, "both" -> hover desktop + click mobile.
  let effectiveMode = 'none';
  if (triggerType === 'both') {
    effectiveMode = isDesktop ? 'hover' : 'click';
  } else if (triggerType === 'hover') {
    effectiveMode = isDesktop ? 'hover' : 'none';
  } else if (triggerType === 'click') {
    effectiveMode = isDesktop ? 'none' : 'click';
  }

  // Mobile-only: close tooltip when clicking outside and close when another tooltip opens.
  useEffect(() => {
    if (effectiveMode !== 'click' || !showTooltip) {
      return undefined;
    }

    function handleClickOutside (e) {
      if (!e.target.closest('.smart-tooltip')) {
        setShowTooltip(false);
      }
    }

    function handleTooltipOpened (e) {
      if (wrapperRef.current && e.detail !== wrapperRef.current) {
        setShowTooltip(false);
      }
    }

    if (!isDesktop) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('smartTooltipOpened', handleTooltipOpened);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('smartTooltipOpened', handleTooltipOpened);
      };
    }
    return undefined;
  }, [effectiveMode, showTooltip, isDesktop]);

  if (effectiveMode === 'none') {
    return children;
  }
  const trigger = effectiveMode === 'hover' ? ['hover', 'focus'] : ['click'];

  const tooltipOverlay = (
    <Tooltip className="u-z-index-9020" id={idRef.current}>
      {title}
    </Tooltip>
  );

  // Render for hover trigger using OverlayTrigger (desktop)
  if (trigger.includes('hover')) {
    return (
      <OverlayTrigger
        placement={placement}
        overlay={tooltipOverlay}
        trigger={trigger}
      >
        {children}
      </OverlayTrigger>
    );
  }

  // Render for click trigger using OverlayTrigger controlled via `show` (mobile)
  const handleClick = () => {
    if (!showTooltip) {
      window.dispatchEvent(new CustomEvent('smartTooltipOpened', { detail: wrapperRef.current }));
    }
    setShowTooltip((prev) => !prev);
  };

  return (
    <OverlayTrigger overlay={tooltipOverlay} placement={placement} show={!isDesktop ? showTooltip : undefined}>
      <span ref={wrapperRef} className="smart-tooltip" onClick={!isDesktop ? handleClick : undefined} style={{ cursor: 'pointer', display: 'inline-block' }}>
        {children}
      </span>
    </OverlayTrigger>
  );
};

SmartTooltip.propTypes = {
  title: PropTypes.node.isRequired,
  placement: PropTypes.string,
  triggerType: PropTypes.oneOf(['hover', 'click', 'both']),
  children: PropTypes.node.isRequired,
  tooltipId: PropTypes.string,
};

SmartTooltip.defaultProps = {
  placement: 'top',
  triggerType: 'hover',
  tooltipId: undefined,
};

export default SmartTooltip;

import { MoreVert } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const ESTIMATED_MENU_HEIGHT = 220;

export default function RowKebabMenu ({ ariaLabel, items }) {
  const [open, setOpen] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setOpenAbove(rect.bottom + ESTIMATED_MENU_HEIGHT > window.innerHeight);
    }
    setOpen((prev) => !prev);
  };

  const handleItemClick = (handler) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    handler();
    setOpen(false);
  };

  return (
    <Wrap ref={wrapRef} className="u-show-mobile">
      <KebabButton
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleToggle}
      >
        <MoreVert fontSize="small" />
      </KebabButton>
      {open && (
        <MenuCard role="menu" $openAbove={openAbove}>
          {items.map((item) => {
            const Icon = item.icon;
            if (item.externalUrl) {
              return (
                <Suspense fallback={<></>} key={item.key}>
                  <OpenExternalWebSite
                    linkIdAttribute={item.externalUrl}
                    url={item.externalUrl}
                    target="_blank"
                    body={(
                      <MenuItem key={item.key}
                                role="menuitem"
                      >
                        <Icon fontSize="small" />
                        <span>{item.label}</span>
                      </MenuItem>
                    )}
                    trackingOn
                  />
                </Suspense>
              );
            } else if (item.onClick) {
              return (
                <MenuItem key={item.key}
                          onClick={handleItemClick(item.onClick)}
                          role="menuitem"
                >
                  <Icon fontSize="small" />
                  <span>{item.label}</span>
                </MenuItem>
              );
            } else {
              return (
                <MenuItem key={item.key} role="menuitem">
                  <Icon fontSize="small" />
                  <span>{item.label}</span>
                </MenuItem>
              );
            }
          })}
        </MenuCard>
      )}
    </Wrap>
  );
}

RowKebabMenu.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    externalUrl: PropTypes.string,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  })).isRequired,
};

const KebabButton = styled('button')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 999px;
  color: #555;
  cursor: pointer;
  padding: 0;
  &:hover {
    background: #f0f0f0;
  }
`;

const MenuCard = styled('div').withConfig({
  shouldForwardProp: (prop) => prop !== '$openAbove',
})`
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 200px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
  padding: 6px;
  z-index: 1000;
  ${({ $openAbove }) => $openAbove && `
    top: auto;
    bottom: calc(100% + 6px);
  `}
`;

const MenuItem = styled('button')`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: none;
  border: none;
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  white-space: nowrap;
  &:hover {
    background: #f5f5f5;
  }
`;

const Wrap = styled('div')`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

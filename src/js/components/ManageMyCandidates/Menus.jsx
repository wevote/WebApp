import React, { useCallback, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const menuOptionsPropType = PropTypes.arrayOf(PropTypes.shape({
  label: PropTypes.node,
  onClick: PropTypes.func,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
  info: PropTypes.bool,
}));

export function SelectAllCheckbox ({ checked, indeterminate, onClick, ariaLabel = 'Select all' }) {
  return (
    <input
      aria-label={ariaLabel}
      checked={!!checked}
      onChange={() => {}}
      onClick={onClick}
      // eslint-disable-next-line no-param-reassign
      ref={(el) => { if (el) el.indeterminate = !!indeterminate; }}
      type="checkbox"
    />
  );
}
SelectAllCheckbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export function CandidateActionsFilterMenu ({ selectAnchorEl, setSelectAnchorEl, checkedBoolean, indeterminateBoolean, handleSelectCheckboxClick, menuOptions = null }) {
  const selectMenuOpen = Boolean(selectAnchorEl);

  const openSelectMenu = useCallback((e) => setSelectAnchorEl(e.currentTarget), [setSelectAnchorEl]);
  const closeSelectMenu = useCallback(() => setSelectAnchorEl(null), [setSelectAnchorEl]);

  const onClickFunction = useCallback((optionOnClickFunction) => {
    optionOnClickFunction();
    closeSelectMenu();
  }, [closeSelectMenu]);

  return (
    <>
      <SelectControl
          aria-label="Selection options"
          aria-controls={selectMenuOpen ? 'select-by-action-menu' : undefined}
          aria-haspopup="menu"
          aria-expanded={selectMenuOpen ? 'true' : undefined}
      >
        <SelectAllCheckbox
          checked={checkedBoolean}
          indeterminate={indeterminateBoolean}
          onClick={handleSelectCheckboxClick}
        />
        <SelectAllLabel>Select all</SelectAllLabel>
        <CaretButton
          type="button"
          onClick={openSelectMenu}
          aria-label="Open selection menu"
        >
          <CaretIcon as={KeyboardArrowDownIcon} />
        </CaretButton>
      </SelectControl>

      <CandidateSubMenu
        id="select-by-action-menu"
        anchorEl={selectAnchorEl}
        open={selectMenuOpen}
        onClose={closeSelectMenu}
      >
        {menuOptions && menuOptions.map((option) => (
          <MenuItem key={option.label} onClick={() => onClickFunction(option.onClick)}>
            <MenuItemText>{option.label}</MenuItemText>
          </MenuItem>
        ))}
      </CandidateSubMenu>
    </>
  );
}
CandidateActionsFilterMenu.propTypes = {
  selectAnchorEl: PropTypes.object,
  setSelectAnchorEl: PropTypes.func,
  checkedBoolean: PropTypes.bool,
  indeterminateBoolean: PropTypes.bool,
  handleSelectCheckboxClick: PropTypes.func,
  menuOptions: menuOptionsPropType,
};

export function CandidateTraitsFilterMenu ({ filterAnchorEl, setFilterAnchorEl, filterLabel = 'Select Filter', menuOptions = null }) {
  const filterMenuOpen = Boolean(filterAnchorEl);

  const openFilterMenu = useCallback((e) => setFilterAnchorEl(e.currentTarget), [setFilterAnchorEl]);
  const closeFilterMenu = useCallback(() => setFilterAnchorEl(null), [setFilterAnchorEl]);


  const onClickFunction = useCallback((optionOnClickFunction) => {
    optionOnClickFunction();
    closeFilterMenu();
  }, [closeFilterMenu]);

  return (
    <>
      <AllButton
          type="button"
          onClick={openFilterMenu}
          aria-label="Filter options"
          aria-controls={filterMenuOpen ? 'all-filter-menu' : undefined}
          aria-haspopup="menu"
          aria-expanded={filterMenuOpen ? 'true' : undefined}
      >
        {filterLabel}
        <CaretIcon as={KeyboardArrowDownIcon} />
      </AllButton>

      <CandidateSubMenu
          id="all-filter-menu"
          anchorEl={filterAnchorEl}
          open={filterMenuOpen}
          onClose={closeFilterMenu}
      >
        {menuOptions && menuOptions.map((option) => (
          <MenuItem key={option.label} onClick={() => onClickFunction(option.onClick)}>
            <MenuItemText>{option.label}</MenuItemText>
          </MenuItem>
        ))}

      </CandidateSubMenu>
    </>
  );
}
CandidateTraitsFilterMenu.propTypes = {
  filterAnchorEl: PropTypes.object,
  setFilterAnchorEl: PropTypes.func,
  filterLabel: PropTypes.string,
  menuOptions: menuOptionsPropType,
};

export function DropdownMenu ({ anchorEl, onClose, menuOptions = [], align = 'right', menuId }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = 100;
    const spaceBelow = window.innerHeight - rect.bottom;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    setPosition({
      top: (spaceBelow < menuHeight ? rect.top - menuHeight - 6 : rect.bottom + 6) + scrollY,
      left: (align === 'right' ? rect.right - menuWidth : rect.left) + scrollX,
    });
  }, [anchorEl, align]);

  if (!anchorEl) return null;

  const handleClick = (option) => () => {
    if (option.disabled) return;
    if (option.onClick) option.onClick();
    onClose();
  };

  return createPortal(
    <>
      <ClickAwayOverlay onClick={onClose} />
      <RowMenuCard
        role="menu"
        id={menuId}
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        {menuOptions.map((option, idx) => {
          const Icon = option.icon;
          if (option.info) {
            return <DropdownInfo key={option.label || `info-${idx}`}>{option.label}</DropdownInfo>;
          }
          return (
            <RowMenuItem
              key={option.label}
              type="button"
              role="menuitem"
              disabled={option.disabled}
              onClick={handleClick(option)}
            >
              {Icon && <Icon fontSize="small" />}
              <span>{option.label}</span>
            </RowMenuItem>
          );
        })}
      </RowMenuCard>
    </>,
    document.body,
  );
}
DropdownMenu.propTypes = {
  anchorEl: PropTypes.object,
  onClose: PropTypes.func,
  menuOptions: menuOptionsPropType,
  align: PropTypes.oneOf(['left', 'right']),
  menuId: PropTypes.string,
};

export function CandidateRowMenu ({ rowMenuAnchorEl, setRowMenuAnchorEl, setRowMenuVoter, menuOptions = null }) {
  const closeRowMenu = useCallback(() => {
    setRowMenuAnchorEl(null);
    setRowMenuVoter(null);
  }, [setRowMenuAnchorEl, setRowMenuVoter]);

  return (
    <DropdownMenu
      anchorEl={rowMenuAnchorEl}
      onClose={closeRowMenu}
      menuOptions={menuOptions}
      align="right"
      menuId="voter-row-menu"
    />
  );
}
CandidateRowMenu.propTypes = {
  rowMenuAnchorEl: PropTypes.object,
  setRowMenuAnchorEl: PropTypes.func,
  setRowMenuVoter: PropTypes.func,
  menuOptions: menuOptionsPropType,
};

export const AllButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 14px;
  gap: 2px;
  line-height: 1;
  margin: 0;
  padding: 0;
`;

const CandidateSubMenu = styled(Menu).attrs({
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  transformOrigin: { vertical: 'top', horizontal: 'left' },
  PaperProps: {
    style: {
      borderRadius: 12,
      overflow: 'hidden',
    },
  },
})``;

export const CaretButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  margin: 0;
  padding: 0;
`;

export const CaretIcon = styled.span`
  align-items: center;
  color: ${DesignTokenColors.neutralUI600};
  display: inline-flex;
  font-size: 18px;
  padding: 0 2px;
`;

const ClickAwayOverlay = styled.div`
  background: transparent;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
`;

const DropdownInfo = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  padding: 6px 10px 8px;
`;

const MenuItemText = styled.span`
  color: #111827;
  font-size: 14px;
`;

const RowMenuCard = styled.div`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
  min-width: 220px;
  padding: 6px;
  position: absolute;
  z-index: 1000;
`;

const RowMenuItem = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: flex;
  font: inherit;
  font-size: 14px;
  gap: 8px;
  padding: 8px 10px;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }

  &:disabled {
    color: ${DesignTokenColors.neutralUI500};
    cursor: not-allowed;
  }
`;

const SelectAllLabel = styled.span`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;
  line-height: 1;
`;

export const SelectControl = styled(ButtonBase)`
  align-items: center;
  border-radius: 8px;
  display: inline-flex;
  gap: 6px;
  padding: 0 2px;
`;

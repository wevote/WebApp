import React, { useCallback } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styled from 'styled-components';

export function CandidateActionsFilterMenu({ selectAnchorEl, setSelectAnchorEl, checkedBoolean, indeterminateBoolean, handleSelectCheckboxClick, menuOptions = null}) {
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
        <Checkbox
          checked={checkedBoolean}
          indeterminate={indeterminateBoolean}
          tabIndex={-1}
          disableRipple
          sx={{ padding: 0 }}
          onClick={handleSelectCheckboxClick}
          onChange={() => {}}
        />
        <div>Select All</div>
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

export function CandidateTraitsFilterMenu({ filterAnchorEl, setFilterAnchorEl, filterLabel = 'Select Filter', menuOptions = null}) {
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
          variant="text"
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

export function CandidateRowMenu({ rowMenuAnchorEl, setRowMenuAnchorEl, setRowMenuVoter, menuOptions = null }) {
  const rowMenuOpen = Boolean(rowMenuAnchorEl);

  const closeRowMenu = useCallback(() => {
    setRowMenuAnchorEl(null);
    setRowMenuVoter(null);
  }, [setRowMenuAnchorEl, setRowMenuVoter]);

  const onClickFunction = useCallback((optionOnClickFunction) => {
    optionOnClickFunction();
    closeRowMenu();
  }, [closeRowMenu]);

  return (
    <CandidateRowSubMenu
          id="voter-row-menu"
          anchorEl={rowMenuAnchorEl}
          open={rowMenuOpen}
          onClose={closeRowMenu}
    >
      {menuOptions && menuOptions.map((option) => (
        <StyledMenuItem key={option.label} onClick={() => onClickFunction(option.onClick)}>
          <ListItemIcon>
            <option.icon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText primary={option.label} />
        </StyledMenuItem>
      ))}
    </CandidateRowSubMenu>
  );
}

export const SelectControl = styled(ButtonBase)`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border-radius: 8px;
`;

export const CaretButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`;


export const AllButton = styled(Button)`
  && {
    min-width: auto;
    padding: 0 0 0 4px;
    text-transform: none;
    font-size: 14px;
    color: #111827;
  }

  && .MuiButton-endIcon {
    margin-left: 4px;
    margin-right: 0;
  }
`;

export const CaretIcon = styled.span`
  font-size: 32px;
  padding: 0 4px;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
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

const CandidateRowSubMenu = styled(Menu).attrs({
  anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
  transformOrigin: { vertical: 'top', horizontal: 'right' },
  PaperProps: {
    style: {
      borderRadius: 12,
      overflow: 'hidden',
      minWidth: 220,
    },
  },
})``;


const MenuItemText = styled.span`
font-size: 14px;
color: #111827;
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    font-size: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

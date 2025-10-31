import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  MailOutline as MailIcon,
  SmsOutlined as SmsIcon,
  VisibilityOff as HideIcon,
  Search as SearchIcon,
  MoreVert as OverflowIcon,
} from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

/* utils */
function formatWhen (iso) {
  try {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleString();
  } catch {
    return '—';
  }
}
export default function ImportedVotersList ({
  voters,
  onInviteSelected,
  onInviteEmail,
  onInviteText,
  onHide,
  onHideSelected,
}) {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selected, setSelected] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return voters;
    return voters.filter((v) => [v.name, v.email, v.phone].some((f) => (f || '').toLowerCase().includes(q)));
  }, [query, voters]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((v) => selected.has(v.id || v._idx));
  const selectedList = useMemo(
    () => voters.filter((v) => selected.has(v.id || v._idx)),
    [voters, selected],
  );

  const toggleRow = (id) => setExpandedId((cur) => (cur === id ? null : id));

  const toggleOne = (id) => {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelected((cur) => {
      const next = new Set(cur);
      if (allVisibleSelected) {
        filtered.forEach((v) => next.delete(v.id || v._idx));
      } else {
        filtered.forEach((v) => next.add(v.id || v._idx));
      }
      return next;
    });
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function onDocClick (e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  return (
    <Card aria-label="Imported voters (not invited)">
      <Header>
        <Title>Imported voters (not invited)</Title>
        <HeaderRight>
          <SearchWrap>
            <SearchIcon aria-hidden />
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone"
              aria-label="Search imported voters"
            />
          </SearchWrap>
          <InviteButton
            type="button"
            disabled={selectedList.length === 0}
            onClick={() => onInviteSelected(selectedList)}
            aria-label={`Invite selected (${selectedList.length})`}
            title={
              selectedList.length ?
                `Invite selected (${selectedList.length})` :
                'Invite selected'
            }
          >
            Invite selected (
            {selectedList.length}
            )
          </InviteButton>
          <OverflowWrap
            ref={menuRef}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            className="overflow-menu"
          >
            <OverflowBtn
              type="button"
              aria-label="More options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              title="More options"
            >
              <OverflowIcon fontSize="small" />
            </OverflowBtn>
            {menuOpen && (
              <MenuCard role="menu">
                <MenuItem
                  role="menuitem"
                  disabled={selectedList.length === 0}
                  onClick={() => {
                    onHideSelected?.(selectedList);
                    setMenuOpen(false);
                  }}
                  title={
                    selectedList.length ? undefined : 'Select voters first'
                  }
                >
                  <HideIcon fontSize="small" />
                  {' '}
                  <span>Hide selected</span>
                </MenuItem>
                {/* Optional: wire up when handlers exist
       <MenuItem role="menuitem" onClick={() => props.onShowHidden?.()}>Show hidden</MenuItem>
       <MenuItem role="menuitem" onClick={() => props.onViewHistory?.()}>View history of imports</MenuItem>
       */}
              </MenuCard>
            )}
          </OverflowWrap>
        </HeaderRight>
      </Header>
      <Toolbar>
        <label>
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={toggleAllVisible}
          />
          <span>Select all</span>
        </label>
      </Toolbar>
      <Table role="table" aria-label="Imported voters table">
        <Thead role="rowgroup">
          <Tr role="row">
            <Th role="columnheader" aria-label="Select" />
            <Th role="columnheader" aria-label="Expand" />
            <Th role="columnheader">Name</Th>
            <Th role="columnheader">Email</Th>
            <Th role="columnheader">Phone</Th>
          </Tr>
        </Thead>

        <Tbody role="rowgroup">
          {filtered.map((v, idx) => {
            const id = v.id || v._idx || `row_${idx}`;
            const isOpen = expandedId === id;
            const isChecked = selected.has(id);
            return (
              <React.Fragment key={id}>
                <Tr role="row">
                  <Td role="cell">
                    <Checkbox
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(id)}
                    />
                    <ActionsInline className="row-actions">
                      <ActionPill
                        type="button"
                        onClick={() => onInviteEmail([v])}
                      >
                        <MailIcon fontSize="small" />
                        <span>Send email invite</span>
                      </ActionPill>
                      <ActionPill
                        type="button"
                        onClick={() => onInviteText([v])}
                      >
                        <SmsIcon fontSize="small" />
                        <span>Send text invite</span>
                      </ActionPill>
                      <ActionPill type="button" onClick={() => onHide(v)}>
                        <HideIcon fontSize="small" />
                        <span>Hide</span>
                      </ActionPill>
                    </ActionsInline>
                  </Td>
                  <Td role="cell" style={{ width: 34 }}>
                    <ExpandBtn
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                      onClick={() => toggleRow(id)}
                    >
                      {isOpen ? (
                        <CollapseIcon fontSize="small" />
                      ) : (
                        <ExpandIcon fontSize="small" />
                      )}
                    </ExpandBtn>
                  </Td>
                  <Td role="cell">
                    <Strong>{v.name || '—'}</Strong>
                  </Td>
                  <Td role="cell">{v.email || '—'}</Td>
                  <Td role="cell">{v.phone || '—'}</Td>
                </Tr>

                {isOpen && (
                  <TrDetails role="row">
                    <TdFull>
                      <DetailsGrid>
                        <DetailBlock>
                          <DetailLabel>Added via</DetailLabel>
                          <div>{v.source || 'One-by-one'}</div>
                        </DetailBlock>
                        <DetailBlock>
                          <DetailLabel>Added by</DetailLabel>
                          <div>{v.addedBy || 'You'}</div>
                        </DetailBlock>
                        <DetailBlock>
                          <DetailLabel>Added on</DetailLabel>
                          <div>{formatWhen(v.addedAt)}</div>
                        </DetailBlock>

                        <Actions>
                          <RowAction
                            type="button"
                            onClick={() => onInviteEmail([v])}
                          >
                            <MailIcon fontSize="small" />
                            {' '}
                            <span>Send email invite</span>
                          </RowAction>
                          <RowAction
                            type="button"
                            onClick={() => onInviteText([v])}
                          >
                            <SmsIcon fontSize="small" />
                            {' '}
                            <span>Send text invite</span>
                          </RowAction>
                          <RowAction type="button" onClick={() => onHide(v)}>
                            <HideIcon fontSize="small" />
                            {' '}
                            <span>Hide</span>
                          </RowAction>
                        </Actions>
                      </DetailsGrid>
                    </TdFull>
                  </TrDetails>
                )}
              </React.Fragment>
            );
          })}
        </Tbody>
      </Table>

      {selectedList.length > 0 && (
        <FooterBar>
          <span>
            {selectedList.length}
            {' '}
            selected
          </span>
          <FooterButtons>
            <SmallBtn
              type="button"
              onClick={() => onInviteSelected(selectedList)}
            >
              Invite selected
            </SmallBtn>
            <SmallBtn
              type="button"
              onClick={() => onHideSelected(selectedList)}
            >
              Hide selected
            </SmallBtn>
          </FooterButtons>
        </FooterBar>
      )}
    </Card>
  );
}

ImportedVotersList.propTypes = {
  voters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      source: PropTypes.string,
      addedBy: PropTypes.string,
      addedAt: PropTypes.string,
    }),
  ).isRequired,
  onInviteSelected: PropTypes.func.isRequired,
  onInviteEmail: PropTypes.func.isRequired,
  onInviteText: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onHideSelected: PropTypes.func.isRequired,
};

/* styles */
const Card = styled.div`
  margin-top: 14px;
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 12px;
  background: ${DesignTokenColors.whiteUI};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 600;
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${DesignTokenColors.neutralUI300};
  background: ${DesignTokenColors.whiteUI};
  border-radius: 10px;
  padding: 6px 10px;
  color: ${DesignTokenColors.neutralUI700};
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font: inherit;
  min-width: 220px;
  background: transparent;
  color: ${DesignTokenColors.neutralUI900};
`;

const InviteButton = styled.button`
  background: ${DesignTokenColors.primary700};
  color: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.primary700};
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  white-space: nowrap;
  &:disabled {
    background: ${DesignTokenColors.neutralUI200};
    border-color: ${DesignTokenColors.neutralUI200};
    cursor: not-allowed;
  }
`;

const Toolbar = styled.div`
  padding: 10px 14px;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;

  label {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }
`;

const Table = styled.div`
  width: 100%;
`;

const Thead = styled.div``;
const Tbody = styled.div``;

const Tr = styled.div`
  display: grid;
  grid-template-columns: 34px 34px 1.2fr 1.2fr 0.9fr;
  align-items: center;
  padding: 10px 14px;
  column-gap: 10px;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI100};
  &:hover .row-actions,
  &:focus-within .row-actions {
    opacity: 1;
    visibility: visible;
  }
`;

const TrDetails = styled(Tr)`
  background: ${DesignTokenColors.neutralUI50};
`;

const Th = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${DesignTokenColors.neutralUI600};
  padding: 10px 14px;
  &:first-child {
    padding-left: 14px;
  }
`;

const Td = styled.div`
  font-size: 14px;
  color: ${DesignTokenColors.neutralUI900};
`;

const Strong = styled.span`
  font-weight: 600;
`;

const Checkbox = styled.input``;

const ExpandBtn = styled.button`
  border: none;
  background: transparent;
  color: ${DesignTokenColors.neutralUI800};
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: ${DesignTokenColors.neutralUI100};
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr)) 1.4fr;
  gap: 10px 16px;
  padding: 8px 0;
  align-items: center;
`;

const DetailBlock = styled.div`
  color: ${DesignTokenColors.neutralUI800};
  font-size: 14px;
`;

const DetailLabel = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 12px;
`;
const ActionsInline = styled.div`
  display: inline-flex;
  gap: 10px;
  justify-content: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.12s ease-in-out;
`;

// Small pill button reused for inline actions
const ActionPill = styled.button`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  background: transparent;
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 999px;
  padding: 6px 10px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: ${DesignTokenColors.neutralUI100};
  }
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 10px;
  justify-content: flex-end;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;

  ${TrDetails}:hover & {
    opacity: 1;
    pointer-events: auto;
  }

  ${Tr}:hover + ${TrDetails} & {
    opacity: 1;
    pointer-events: auto;
  }

  ${TrDetails}:focus-within & {
    opacity: 1;
    pointer-events: auto;
  }
`;

const TdFull = styled(Td)`
  grid-column: 1 / -1;
`;

const RowAction = styled.button`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  background: transparent;
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 999px;
  padding: 6px 10px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  &:hover {
    background: ${DesignTokenColors.neutralUI100};
  }
`;

const FooterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-top: 1px solid ${DesignTokenColors.neutralUI200};
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;
`;

const FooterButtons = styled.div`
  display: inline-flex;
  gap: 8px;
`;

const SmallBtn = styled.button`
  background: ${DesignTokenColors.whiteUI};
  color: ${DesignTokenColors.neutralUI900};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 999px;
  padding: 6px 10px;
  cursor: pointer;
  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const OverflowBtn = styled.button`
  background: transparent;
  border: 0;
  padding: 6px;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;
const OverflowWrap = styled.div`
  position: relative;
`;

const MenuCard = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
  min-width: 220px;
  padding: 6px;
  z-index: 10;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI900};
  padding: 8px 10px;
  text-align: left;
  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
  &:disabled {
    color: ${DesignTokenColors.neutralUI500};
    cursor: not-allowed;
  }
`;

import React, { useMemo, useState, useRef } from 'react';
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
  Visibility as ShowIcon,
  History as HistoryIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

import InviteSelectedModal from '../More/InviteSelectedModal';

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
  onInviteEmail,
  onInviteText,
  onHide,
  onHideSelected,
  onOpenPreview,
  onShowHidden,
  onViewHistory,
  onDeleteSelected,
}) {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteList, setInviteList] = useState([]);

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

  return (
    <>
      <Card aria-label="Imported voters (not invited)">
        <ListTopBar>
          <TopBarLeft>
            <ListHeading>Imported voters (not invited)</ListHeading>
            <TopDivider aria-hidden />
            <SearchField aria-label="Search imported voters">
              <SearchIcon aria-hidden />
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </SearchField>
          </TopBarLeft>

          <TopBarRight>
            <InviteButton
              type="button"
              disabled={selectedList.length === 0}
              onClick={() => {
                setInviteList(selectedList);
                setInviteModalOpen(true);
              }}
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

            <OverflowWrap>
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
                <MenuCard role="menu" ref={menuRef}>
                  <MenuItem
                    role="menuitem"
                    onClick={() => {
                      onShowHidden?.();
                      setMenuOpen(false);
                    }}
                  >
                    <ShowIcon fontSize="small" />
                    <span>Show hidden</span>
                  </MenuItem>

                  <MenuItem
                    role="menuitem"
                    onClick={() => {
                      onViewHistory?.();
                      setMenuOpen(false);
                    }}
                  >
                    <HistoryIcon fontSize="small" />
                    <span>View history of imports</span>
                  </MenuItem>
                  <MenuDivider />

                  {selectedList.length > 0 ? (
                    <>
                      <MenuItem
                        role="menuitem"
                        onClick={() => {
                          onHideSelected?.(selectedList);
                          setMenuOpen(false);
                        }}
                      >
                        <HideIcon fontSize="small" />
                        <span>Hide</span>
                      </MenuItem>

                      <MenuItem
                        role="menuitem"
                        onClick={() => {
                          onDeleteSelected?.(selectedList);
                          setMenuOpen(false);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                        <span>Delete</span>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <TooltipWrap>
                        <MenuItem role="menuitem" disabled>
                          <HideIcon fontSize="small" />
                          <span>Hide</span>
                        </MenuItem>
                        <TooltipBubble>
                          Select voters to allow hiding or deleting.
                        </TooltipBubble>
                      </TooltipWrap>

                      <TooltipWrap>
                        <MenuItem role="menuitem" disabled>
                          <DeleteIcon fontSize="small" />
                          <span>Delete</span>
                        </MenuItem>
                        <TooltipBubble>
                          Select voters to allow hiding or deleting.
                        </TooltipBubble>
                      </TooltipWrap>
                    </>
                  )}
                </MenuCard>
              )}
            </OverflowWrap>
          </TopBarRight>
        </ListTopBar>

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
          <TrHead role="row">
            <ThCenter role="columnheader" aria-label="Select" />
            <ThCenter role="columnheader" aria-label="Expand" />
            <Th role="columnheader">Name</Th>
            <Th role="columnheader">Email</Th>
            <Th role="columnheader">Phone</Th>
            <ThRight role="columnheader" aria-label="Actions" />
          </TrHead>

          <Tbody role="rowgroup">
            {filtered.map((v, idx) => {
              const id = v.id || v._idx || `row_${idx}`;
              const isOpen = expandedId === id;
              const isChecked = selected.has(id);
              const showDetails = isOpen || isChecked; // no hover reveal

              return (
                <React.Fragment key={id}>
                  <Tr role="row" className={isChecked ? 'selected' : undefined}>
                    <TdCheck role="cell">
                      <Checkbox
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOne(id)}
                        aria-label={`Select ${v.name || 'voter'}`}
                      />
                    </TdCheck>

                    <TdExpand role="cell">
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
                    </TdExpand>

                    <Td role="cell" title={v.name || '—'}>
                      {v.name || '—'}
                    </Td>
                    <Td role="cell" title={v.email || '—'}>
                      {v.email || '—'}
                    </Td>
                    <Td role="cell" title={v.phone || '—'}>
                      {v.phone || '—'}
                    </Td>

                    <TdActions role="cell">
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
                    </TdActions>
                  </Tr>

                  {showDetails && (
                    <TrDetails role="row">
                      <TdFull>
                        <DetailsGrid>
                          <DetailBlock>
                            <DetailLabel>Added via</DetailLabel>
                            <div>{v.source || 'Manual entry'}</div>
                          </DetailBlock>
                          <DetailBlock>
                            <DetailLabel>Added by</DetailLabel>
                            <div>{v.addedBy || 'You'}</div>
                          </DetailBlock>
                          <DetailBlock>
                            <DetailLabel>Added on</DetailLabel>
                            <div>{formatWhen(v.addedAt)}</div>
                          </DetailBlock>
                        </DetailsGrid>
                      </TdFull>
                    </TrDetails>
                  )}
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </Card>

      {/* Invite selected modal */}
      <InviteSelectedModal
        isOpen={inviteModalOpen}
        toggleModal={() => setInviteModalOpen(false)}
        voters={inviteList}
        onInviteEmail={onInviteEmail}
        onInviteText={onInviteText}
        onOpenPreview={onOpenPreview}
        onRemove={(v) =>
          setInviteList(prev =>
            prev.filter(p => (p.id || p._idx) !== (v.id || v._idx))
          )
        }
      />
    </>
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
  onInviteEmail: PropTypes.func.isRequired,
  onInviteText: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onHideSelected: PropTypes.func.isRequired,
  onShowHidden: PropTypes.func,
  onOpenPreview: PropTypes.func,
  onViewHistory: PropTypes.func,
  onDeleteSelected: PropTypes.func,
};

/* styles */
const Card = styled.div`
  margin-top: 14px;
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 12px;
  background: ${DesignTokenColors.whiteUI};
`;

const ListTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
`;

const ListHeading = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${DesignTokenColors.neutralUI900};
`;

const TopBarRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const SearchField = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 320px;
  height: 36px;
  padding: 0 10px;
  border: none;
  border-radius: 0;
  background: transparent;
  color: ${DesignTokenColors.neutralUI700};
  svg {
    flex: 0 0 auto;
    transform: translateY(3px);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  color: ${DesignTokenColors.neutralUI900};
  &::placeholder {
    color: ${DesignTokenColors.neutralUI500};
  }
  line-height: 1;
  transform: translateY(3px);
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

const OverflowWrap = styled.div`
  position: relative;
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
  overflow-x: auto; /* if columns still can’t fit, scroll the table, not the page */
`;

const Tbody = styled.div``;
const gridCols = '34px 34px 1.2fr 1.2fr 0.9fr auto';

const Th = styled.div`
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: ${DesignTokenColors.neutralUI600};
  min-width: 0;
`;

const ThCenter = styled(Th)`
  text-align: center;
`;
const ThRight = styled(Th)`
  text-align: right;
`;

const Tr = styled.div`
  display: grid;
  grid-template-columns: ${gridCols};
  align-items: center;
  padding: 10px 14px;
  column-gap: 10px;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI100};
  box-sizing: border-box;

  &:hover .row-actions,
  &:focus-within .row-actions {
    opacity: 1;
    visibility: visible;
  }

  &.selected {
    background: ${DesignTokenColors.primary50 || DesignTokenColors.neutralUI50};
    border-left: 3px solid ${DesignTokenColors.primary700};
  }
  &.selected .row-actions {
    opacity: 1;
    visibility: visible;
  }
`;

const TrHead = styled(Tr)`
  background: ${DesignTokenColors.neutralUI50};
`;

const TrDetails = styled(Tr)`
  background: none;
`;

const Td = styled.div`
  padding: 10px 14px;
  font-size: 14px;
  color: ${DesignTokenColors.neutralUI900};
  min-width: 0; /* key: allow shrinking inside CSS grid */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TdCheck = styled(Td)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TdExpand = styled(Td)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TdActions = styled(Td)`
  display: flex;
  justify-content: flex-end;
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

const ActionsInline = styled.div`
  display: inline-flex;
  gap: 10px;
  justify-content: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.12s ease-in-out;
`;

const ActionPill = styled.button`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  background: transparent;
  border: none;
  padding: 6px 10px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
  white-space: nowrap;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr));
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

const TdFull = styled(Td)`
  grid-column: 1 / -1;
`;

const MenuDivider = styled.div`
  height: 1px;
  background: ${DesignTokenColors.neutralUI200};
  margin: 6px;
  border-radius: 1px;
`;

const TooltipWrap = styled.div`
  position: relative;
`;

const TooltipBubble = styled.div`
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  background: #111827;
  color: white;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.14);
  opacity: 0;
  pointer-events: none;

  ${TooltipWrap}:hover & {
    opacity: 1;
  }
`;

const TopBarLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const TopDivider = styled.span`
  width: 1px;
  height: 20px;
  background: ${DesignTokenColors.neutralUI200};
  display: inline-block;
`;

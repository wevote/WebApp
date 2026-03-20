import React, { useEffect, useMemo, useState, useRef } from 'react';
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
  MoreHoriz as MoreHorizIcon,
  Visibility as ShowIcon,
  History as HistoryIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  PersonAddAlt as AddVoterIcon,
} from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import InviteSelectedModal from '../More/InviteSelectedModal';
import ImportHistoryModal from '../More/ImportHistoryModal';
import VoterActionModal from '../More/VoterActionModal';

function formatWhen (iso) {
  try {
    const d = iso ? new Date(iso) : new Date();
    const date = d.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
    const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return `${date} ${time}`;
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
  onDeleteSelected,
  onUpdateVoter,
}) {
  const [isMobile, setIsMobile] = useState(isMobileScreenSize);

  useEffect(() => {
    const onResize = () => setIsMobile(isMobileScreenSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [importHistoryOpen, setImportHistoryOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteList, setInviteList] = useState([]);

  const [voterActionModalOpen, setVoterActionModalOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [voterModalTab, setVoterModalTab] = useState('details');

  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const [rowMenuAnchor, setRowMenuAnchor] = useState(null);
  const [rowMenuVoter, setRowMenuVoter] = useState(null);
  const [rowMenuPosition, setRowMenuPosition] = useState({ top: 0, left: 0 });
  const [hoveredRowId, setHoveredRowId] = useState(null);

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

  const handleRowMenuOpen = (event, voter) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 180; // approx: 4 items + divider + padding
    const spaceBelow = window.innerHeight - rect.bottom;
    const position = {
      top: spaceBelow < menuHeight ? rect.top - menuHeight - 6 : rect.bottom + 6,
      left: rect.right - menuWidth,
    };
    setRowMenuPosition(position);
    setRowMenuAnchor(event.currentTarget);
    setRowMenuVoter(voter);
  };

  const handleRowMenuClose = () => {
    setRowMenuAnchor(null);
    setRowMenuVoter(null);
  };

  const handleEditVoter = () => {
    setSelectedVoter(rowMenuVoter);
    setVoterModalTab('details');
    setVoterActionModalOpen(true);
    handleRowMenuClose();
  };

  const handleShowVoterHistory = () => {
    setSelectedVoter(rowMenuVoter);
    setVoterModalTab('history');
    setVoterActionModalOpen(true);
    handleRowMenuClose();
  };

  const handleSaveVoter = (updatedVoter) => {
    if (onUpdateVoter) {
      onUpdateVoter(updatedVoter);
    }
    // Update selectedVoter so modal shows updated data if reopened
    setSelectedVoter(updatedVoter);
  };

  return (
    <>
      <Card aria-label="Imported voters (not invited)">
        <ListTopBar>
          {!isMobile && (
            <TopBarLeft>
              <ListHeading>
                <HeadingBold>
                  {voters.length}
                  {' '}
                  imported voters
                </HeadingBold>
                {' '}
                <HeadingLight>(not invited)</HeadingLight>
              </ListHeading>
              <TopDivider aria-hidden />
              <SearchField aria-label="Search imported voters">
                <SearchIcon aria-hidden />
                <SearchInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </SearchField>
            </TopBarLeft>
          )}

          {isMobile && (
            <MobileTopBarRow>
              <MobileHeading>
                <HeadingBold>
                  {voters.length}
                  {' '}
                  imported voters
                </HeadingBold>
                {' '}
                <HeadingLight>(not invited)</HeadingLight>
              </MobileHeading>
              <MobileTopBarIcons>
                <OverflowBtn
                  type="button"
                  aria-label="More options"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                  title="More options"
                >
                  <MoreHorizIcon fontSize="small" />
                </OverflowBtn>
                <OverflowBtn type="button" aria-label="Search" title="Search">
                  <SearchIcon fontSize="small" />
                </OverflowBtn>
                <OverflowBtn type="button" aria-label="Add voter" title="Add voter">
                  <AddVoterIcon fontSize="small" />
                </OverflowBtn>
              </MobileTopBarIcons>
            </MobileTopBarRow>
          )}

          {!isMobile && (
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
                        setHistoryModalOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      <HistoryIcon fontSize="small" />
                      <span>View history of imports</span>
                    </MenuItem>

                  </MenuCard>
                )}
              </OverflowWrap>
            </TopBarRight>
          )}
        </ListTopBar>

        {!isMobile && (
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
        )}

        {!isMobile && (
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
              const showDetails = isOpen || isChecked;
              const isHovered = hoveredRowId === id;
              const isMenuOpen = rowMenuVoter && (rowMenuVoter.id || rowMenuVoter._idx) === id;

              return (
                <React.Fragment key={id}>
                  <Tr
                    role="row"
                    className={`${isChecked ? 'selected' : ''} ${isMenuOpen ? 'menu-open' : ''}`.trim()}
                    onMouseEnter={() => setHoveredRowId(id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                  >
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
                          title="Send email invite"
                          aria-label="Send email invite"
                          onClick={() => onInviteEmail([v])}
                        >
                          <MailIcon fontSize="inherit" />
                        </ActionPill>
                        <ActionPill
                          type="button"
                          title="Send text invite"
                          aria-label="Send text invite"
                          onClick={() => onInviteText([v])}
                        >
                          <SmsIcon fontSize="inherit" />
                        </ActionPill>
                        <ActionPill
                          type="button"
                          title="Hide voter"
                          aria-label="Hide voter"
                          onClick={() => onHide(v)}
                        >
                          <HideIcon fontSize="inherit" />
                        </ActionPill>

                        {/* Triple dot menu, only visible on hover or when menu is open */}
                        {(isHovered || isChecked || isMenuOpen) && (
                          <RowMenuButton
                            type="button"
                            onClick={(e) => handleRowMenuOpen(e, v)}
                            aria-label="More options for voter"
                          >
                            <OverflowIcon fontSize="small" />
                          </RowMenuButton>
                        )}
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
        )}

        {isMobile && (
        <MobileCardList>
          {filtered.map((v, idx) => {
            const id = v.id || v._idx || `row_${idx}`;
            const isOpen = expandedId === id;
            const isChecked = selected.has(id);

            return (
              <VoterCard key={id} $selected={isChecked}>
                <MobileCardTopRow>
                  <Checkbox
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOne(id)}
                    aria-label={`Select ${v.name || 'voter'}`}
                  />
                  <MobileCardName>{v.name || '—'}</MobileCardName>
                  <RowMenuButton
                    type="button"
                    onClick={(e) => handleRowMenuOpen(e, v)}
                    aria-label="More options for voter"
                    title="More options"
                  >
                    <MoreHorizIcon fontSize="small" />
                  </RowMenuButton>
                  <TopDivider aria-hidden />
                  <ExpandBtn
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                    onClick={() => toggleRow(id)}
                  >
                    {isOpen ? <CollapseIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
                  </ExpandBtn>
                </MobileCardTopRow>

                <MobileCardPillRow>
                  <MobileCardPill type="button" onClick={() => onInviteEmail([v])}>
                    <MailIcon sx={{ fontSize: 16 }} />
                    Send email invite
                  </MobileCardPill>
                  <MobileCardPill type="button" onClick={() => onInviteText([v])}>
                    <SmsIcon sx={{ fontSize: 16 }} />
                    Send text invite
                  </MobileCardPill>
                </MobileCardPillRow>

                {isOpen && (
                  <MobileCardDetails>
                    <DetailBlock>
                      <DetailLabel>Added via</DetailLabel>
                      <div>{v.source || 'Manual entry'}</div>
                    </DetailBlock>
                    <CardDetailDivider aria-hidden />
                    <DetailBlock>
                      <DetailLabel>Added by</DetailLabel>
                      <div>{v.addedBy || 'You'}</div>
                    </DetailBlock>
                    <CardDetailDivider aria-hidden />
                    <DetailBlock>
                      <DetailLabel>Added on</DetailLabel>
                      <div>{formatWhen(v.addedAt)}</div>
                    </DetailBlock>
                  </MobileCardDetails>
                )}
              </VoterCard>
            );
          })}
        </MobileCardList>
        )}
      </Card>

      {isMobile && (
      <MobileFooter>
        <MobileInviteButton
          type="button"
          disabled={selectedList.length === 0}
          onClick={() => {
            setInviteList(selectedList);
            setInviteModalOpen(true);
          }}
          aria-label={`Invite selected (${selectedList.length})`}
        >
          Invite selected (
          {selectedList.length}
          )
        </MobileInviteButton>
        <OverflowWrap>
          <OverflowBtn
            type="button"
            aria-label="More options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            title="More options"
          >
            <MoreHorizIcon fontSize="small" />
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
                  setHistoryModalOpen(true);
                  setMenuOpen(false);
                }}
              >
                <HistoryIcon fontSize="small" />
                <span>View history of imports</span>
              </MenuItem>
            </MenuCard>
          )}
        </OverflowWrap>
      </MobileFooter>
      )}

      {/* Row menu dropdown */}
      {rowMenuAnchor && (
        <>
          <ClickAwayOverlay onClick={handleRowMenuClose} />
          <RowMenuCard
            role="menu"
            style={{
              top: `${rowMenuPosition.top}px`,
              left: `${rowMenuPosition.left}px`,
            }}
          >
            <MenuItem
              role="menuitem"
              onClick={handleEditVoter}
            >
              <EditIcon fontSize="small" />
              <span>Edit voter</span>
            </MenuItem>
            <MenuItem
              role="menuitem"
              onClick={handleShowVoterHistory}
            >
              <HistoryIcon fontSize="small" />
              <span>Show history</span>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              role="menuitem"
              onClick={() => {
                onHide(rowMenuVoter);
                handleRowMenuClose();
              }}
            >
              <HideIcon fontSize="small" />
              <span>Hide</span>
            </MenuItem>
            <MenuItem
              role="menuitem"
              onClick={() => {
                onDeleteSelected?.([rowMenuVoter]);
                handleRowMenuClose();
              }}
            >
              <DeleteIcon fontSize="small" />
              <span>Delete</span>
            </MenuItem>
          </RowMenuCard>
        </>
      )}

      {/* Invite selected modal */}
      <InviteSelectedModal
        isOpen={inviteModalOpen}
        toggleModal={() => setInviteModalOpen(false)}
        voters={inviteList}
        onInviteEmail={onInviteEmail}
        onInviteText={onInviteText}
        onOpenPreview={onOpenPreview}
        onRemove={(v) => setInviteList((prev) => prev.filter((p) => (p.id || p._idx) !== (v.id || v._idx)))}
      />

      {/* Voter action modal */}
      <VoterActionModal
        show={voterActionModalOpen}
        toggleModal={() => setVoterActionModalOpen(false)}
        voter={selectedVoter}
        initialTab={voterModalTab}
        onSave={handleSaveVoter}
      />

      {/* Import history modal */}
      <ImportHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        voters={voters}
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
  onDeleteSelected: PropTypes.func,
  onUpdateVoter: PropTypes.func,
};

/* styles */
const Card = styled.div`
  margin-top: 14px;
  border-radius: 12px;
  background: ${DesignTokenColors.whiteUI};
  @media (min-width: 992px) {
    border: 1px solid ${DesignTokenColors.neutralUI200};
  }
`;

const ListTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
`;

const ListHeading = styled.div`
  font-size: 13px;
  color: ${DesignTokenColors.neutralUI900};
  white-space: nowrap;
`;

const HeadingBold = styled.span`
  font-weight: 600;
`;

const HeadingLight = styled.span`
  font-weight: 400;
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
  min-width: 180px;
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
  padding: 8px 24px;
  cursor: pointer;
  white-space: nowrap;
  &:disabled {
    background: ${DesignTokenColors.neutralUI200};
    border-color: ${DesignTokenColors.neutralUI200};
    cursor: not-allowed;
  }
`;

const MobileInviteButton = styled(InviteButton)`
  padding: 8px 48px;
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

const RowMenuButton = styled(OverflowBtn)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const MenuCard = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
  min-width: 250px;
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
const gridCols = '24px 24px 1.2fr 1.2fr 0.9fr 120px';

const Th = styled.div`
  padding: 10px 0;
  font-size: 12px;
  font-weight: 600;
  color: ${DesignTokenColors.neutralUI600};
  min-width: 0;
  text-align: left;
`;

const ThCenter = styled(Th)`
  text-align: center;
  padding: 10px 0;
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

  &.menu-open .row-actions {
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
  padding: 10px 0;
  font-size: 14px;
  color: ${DesignTokenColors.neutralUI900};
  min-width: 0; /* key: allow shrinking inside CSS grid */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;

const TdCheck = styled(Td)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`;

const TdExpand = styled(Td)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`;

const TdActions = styled(Td)`
  display: flex;
  justify-content: flex-end;
  padding: 10px 4px;
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
  gap: 6px;
  justify-content: flex-end;
  align-items: center;
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
  padding: 4px 2px;
  font-size: 16px;
  color: ${DesignTokenColors.neutralUI800};
  cursor: pointer;
`;

const ClickAwayOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
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
  font-size: 11px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DetailLabel = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 10px;
  white-space: nowrap;
`;

const RowMenuCard = styled.div`
  position: fixed;
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
  min-width: 180px;
  padding: 6px;
  z-index: 1000;
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

const MobileCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  padding-bottom: 128px;
`;

const VoterCard = styled.div`
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 16px;
  background: ${DesignTokenColors.neutralUI50};
  padding: 12px;
  ${({ $selected }) => $selected && `
    background: ${DesignTokenColors.primary50 || DesignTokenColors.neutralUI50};
    border-left: 3px solid ${DesignTokenColors.primary700};
  `}
`;

const MobileCardTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const MobileCardName = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: ${DesignTokenColors.neutralUI900};
`;

const MobileCardPillRow = styled.div`
  display: flex;
  gap: 12px;
  padding-left: 4px;
`;

const MobileCardPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #1976d2;
  border-radius: 999px;
  background: ${DesignTokenColors.whiteUI};
  padding: 4px 10px;
  font-size: 12px;
  color: #1976d2;
  cursor: pointer;
  white-space: nowrap;
`;

const MobileCardDetails = styled.div`
  display: grid;
  grid-template-columns: max-content 1px max-content 1px 1fr;
  column-gap: 12px;
  row-gap: 10px;
  padding-top: 10px;
  margin-top: 10px;
`;

const CardDetailDivider = styled.span`
  width: 1px;
  background: ${DesignTokenColors.neutralUI200};
  display: block;
  align-self: stretch;
`;

const MobileTopBarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MobileHeading = styled.div`
  font-size: 13px;
  color: ${DesignTokenColors.neutralUI900};
  white-space: nowrap;
`;

const MobileTopBarIcons = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const MobileFooter = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 56px;
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  background: ${DesignTokenColors.primary50};
`;

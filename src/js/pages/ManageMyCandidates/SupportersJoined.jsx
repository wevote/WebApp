import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Drawer from '@mui/material/Drawer';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const FILTERS = {
  ALL: 'all',
  HAS_INVITED: 'hasInvited',
  HAS_ENDORSED: 'hasEndorsed',
};

const DEFAULT_THANK_YOU_MESSAGE = `Dear Candidate,

Thank you so much. May the odds be ever in your favor. We love you.

From the developers at WeVote <3`;

export default function SupportersJoined ({ supporters }) {
  const [selected, setSelected] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
  const [thankYouMessage, setThankYouMessage] = useState(DEFAULT_THANK_YOU_MESSAGE);
  const [draftMessage, setDraftMessage] = useState(thankYouMessage);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendToast, setSendToast] = useState({ open: false, ok: true, msg: '' });
  const totalCount = supporters.length;
  const selectedCount = selected.size;

  // ----- checkbox dropdown menu state -----
  const [selectAnchorEl, setSelectAnchorEl] = useState(null);
  const selectMenuOpen = Boolean(selectAnchorEl);
  // ----- "All" dropdown menu state -----
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const filterMenuOpen = Boolean(filterAnchorEl);
  // ----- per-row "triple dot" menu state -----
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [rowMenuVoter, setRowMenuVoter] = useState(null);
  const rowMenuOpen = Boolean(rowMenuAnchorEl);
  // ----- candidate drawer open state -----
  const [candidateDrawerOpen, setCandidateDrawerOpen] = useState(false);
  const [candidateDrawerVoter, setCandidateDrawerVoter] = useState(null);
  // ----- thank you dropdown (mobile) -----
  const [thankYouAnchorEl, setThankYouAnchorEl] = useState(null);
  const thankYouMenuOpen = Boolean(thankYouAnchorEl);

  const openThankYouMenu = (e) => setThankYouAnchorEl(e.currentTarget);
  const closeThankYouMenu = () => setThankYouAnchorEl(null);

  // ----- helpers (single source of truth for "actions") -----
  const copyThankYouMessage = async () => {
    try {
      await navigator.clipboard.writeText(thankYouMessage);
      setCopyOpen(true);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const getPendingActions = (v) => ([
    !v.endorsed && 'Endorse',
    !v.publicOpinion && 'Write public opinion',
    v.friendsInvited === 0 && 'Invite friends',
  ].filter(Boolean));

  const getActionsLabel = (v) => getPendingActions(v).join(', ');

  // ----- derived data for selected voters, dropdown + counts -----
  const selectedVoters = useMemo(() => {
    const selectedIds = selected;
    return supporters.filter((v) => selectedIds.has(v.id));
  }, [supporters, selected]);

  const actionGroups = useMemo(() => {
    // key: actionsLabel, value: array of supporter ids
    const map = new Map();

    supporters.forEach((v) => {
      const actionsLabel = getActionsLabel(v);
      if (!actionsLabel) return; // no pending actions => don't appear in "Ask to:" menu
      const prev = map.get(actionsLabel) || [];
      prev.push(v.id);
      map.set(actionsLabel, prev);
    });

    // Sort by count desc, then label asc
    return Array.from(map.entries())
      .map(([label, ids]) => ({ label, ids, count: ids.length }))
      .sort((a, b) => (b.count - a.count) || a.label.localeCompare(b.label));
  }, [supporters]);

  const visibleSupporters = useMemo(() => {
    switch (activeFilter) {
      case FILTERS.HAS_INVITED:
        return supporters.filter((v) => (v.friendsInvited || 0) > 0);
      case FILTERS.HAS_ENDORSED:
        return supporters.filter((v) => !!v.endorsed);
      case FILTERS.ALL:
      default:
        return supporters;
    }
  }, [supporters, activeFilter]);
  useEffect(() => {
    const visibleIds = new Set(visibleSupporters.map((v) => v.id));
    setSelected((prev) => new Set([...prev].filter((id) => visibleIds.has(id))));
  }, [visibleSupporters]);

  const totalVisibleCount = visibleSupporters.length;
  const selectedVisibleCount = useMemo(
    () => visibleSupporters.filter((v) => selected.has(v.id)).length,
    [visibleSupporters, selected]
  );
  const checked = totalVisibleCount > 0 && selectedVisibleCount === totalVisibleCount;
  const indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < totalVisibleCount;

  // ----- "All" filter dropdown data (counts) -----
  const filterLabel = useMemo(() => {
    switch (activeFilter) {
      case FILTERS.HAS_INVITED: return 'Has invited friends';
      case FILTERS.HAS_ENDORSED: return 'Has endorsed';
      default: return 'All';
    }
  }, [activeFilter]);

  const filterGroups = useMemo(() => {
    const hasInvitedIds = [];
    const hasEndorsedIds = [];

    supporters.forEach((v) => {
      if ((v.friendsInvited || 0) > 0) hasInvitedIds.push(v.id);
      if (v.endorsed) hasEndorsedIds.push(v.id);
    });

    return {
      hasInvitedIds,
      hasInvitedCount: hasInvitedIds.length,
      hasEndorsedIds,
      hasEndorsedCount: hasEndorsedIds.length,
    };
  }, [supporters]);

  const toggleSelected = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = visibleSupporters.every((r) => next.has(r.id));
      if (allSelected) {
        visibleSupporters.forEach((r) => next.delete(r.id));
      } else {
        visibleSupporters.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  const handleSelectCheckboxClick = (e) => {
    e.stopPropagation(); // important: don't open the dropdown menu
    setSelected((prev) => {
      if (prev.size === 0) {
        // select all visible
        return new Set(visibleSupporters.map((v) => v.id));
      }
      // clear all selection
      return new Set();
    });
  };

  const openSelectMenu = (e) => setSelectAnchorEl(e.currentTarget);
  const closeSelectMenu = () => setSelectAnchorEl(null);

  const selectIds = (ids) => {
    setSelected(new Set(ids));
    closeSelectMenu();
  };

  const handleAll = () => {
    setSelected(new Set(supporters.map((v) => v.id)));
    closeSelectMenu();
  };

  const handleNone = () => {
    setSelected(new Set());
    closeSelectMenu();
  };

  const openFilterMenu = (e) => setFilterAnchorEl(e.currentTarget);
  const closeFilterMenu = () => setFilterAnchorEl(null);

  const setFilterAll = () => {
    setActiveFilter(FILTERS.ALL);
    closeFilterMenu();
  };

  const setFilterHasInvited = () => {
    setActiveFilter(FILTERS.HAS_INVITED);
    closeFilterMenu();
  };

  const setFilterHasEndorsed = () => {
    setActiveFilter(FILTERS.HAS_ENDORSED);
    closeFilterMenu();
  };

  const openRowMenu = (e, voter) => {
    e.stopPropagation();
    setRowMenuAnchorEl(e.currentTarget);
    setRowMenuVoter(voter);
  };

  const closeRowMenu = () => {
    setRowMenuAnchorEl(null);
    setRowMenuVoter(null);
  };

  const openCandidateDrawer = (voter) => {
    setCandidateDrawerVoter(voter);
    setCandidateDrawerOpen(true);
  };

  const closeCandidateDrawer = () => {
    setCandidateDrawerOpen(false);
    setCandidateDrawerVoter(null);
  };

  const handleEditVoter = () => {
    if (!rowMenuVoter) return;
    alert(`Edit voter: ${rowMenuVoter.name}`);
    closeRowMenu();
  };

  const handleSendMessage = () => {
    if (!rowMenuVoter) return;
    alert(`Send message to: ${rowMenuVoter.name}`);
    closeRowMenu();
  };

  const handleSendThankYou = async () => {
    if (selectedVoters.length === 0) return;

    setIsSending(true);
    try {
      // TODO: replace with real API call(s)
      // await sendThankYouMessage(selectedVoters, thankYouMessage);
      handleSendMessage();

      setSendToast({
        open: true,
        ok: true,
        msg: `Sent to ${selectedVoters.length} supporter${selectedVoters.length === 1 ? '' : 's'}.`,
      });

      // Optional: mark them as "messageSentCount + 1" in state once you have stateful supporters
      // Optional: clear selection after send
      // setSelected(new Set());
    } catch (err) {
      console.error(err);
      setSendToast({ open: true, ok: false, msg: 'Send failed. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container>
      <MessageContainer className="u-show-desktop-tablet">
        <InfoBox>
          <strong>
            Sentiments and opinions posted by WeVote members are private by default.
            You can view them only if the member chooses to make them public.
          </strong>
        </InfoBox>

        <VerticalBarWrapper>
          <VerticalBar />
        </VerticalBarWrapper>

        <ThankYouBox>
          <ThankYouLabelRow>
            <strong>Thank You message:</strong>
            <IconRow>
              <IconBtn
                type="button"
                title="View"
                onClick={() => setViewOpen(true)}
              >
                <VisibilityIcon />
              </IconBtn>

              <IconBtn
                type="button"
                title="Edit"
                onClick={() => {
                  setDraftMessage(thankYouMessage);
                  setEditOpen(true);
                }}
              >
                <EditOutlinedIcon />
              </IconBtn>

              <IconBtn
                type="button"
                title="Copy"
                onClick={copyThankYouMessage}
              >
                <ContentCopyIcon />
              </IconBtn>
            </IconRow>
          </ThankYouLabelRow>

          <ThankYouSubtext>(auto-sent after joining)</ThankYouSubtext>
        </ThankYouBox>
      </MessageContainer>

      <ToolbarRow>
        <LeftTools>
          <SelectControl
            aria-label="Selection options"
            aria-controls={selectMenuOpen ? 'select-by-action-menu' : undefined}
            aria-haspopup="menu"
            aria-expanded={selectMenuOpen ? 'true' : undefined}
          >
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              tabIndex={-1}
              disableRipple
              sx={{ padding: 0 }}
              onClick={handleSelectCheckboxClick}
              onChange={() => {}}
            />
            <CaretButton
              type="button"
              onClick={openSelectMenu}
              aria-label="Open selection menu"
            >
              <CaretIcon as={KeyboardArrowDownIcon} />
            </CaretButton>
          </SelectControl>

          <Menu
            id="select-by-action-menu"
            anchorEl={selectAnchorEl}
            open={selectMenuOpen}
            onClose={closeSelectMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                borderRadius: 12,
                overflow: 'hidden',
              },
            }}
          >
            <MenuItem onClick={handleAll}>
              <MenuItemText>All</MenuItemText>
            </MenuItem>

            {actionGroups.map((g) => (
              <MenuItem key={g.label} onClick={() => selectIds(g.ids)}>
                <MenuItemText>
                  Ask to: {g.label} - ({g.count})
                </MenuItemText>
              </MenuItem>
            ))}

            <MenuItem onClick={handleNone}>
              <MenuItemText>None</MenuItemText>
            </MenuItem>
          </Menu>

          <VerticalBarWrapper $tight>
            <VerticalBar />
          </VerticalBarWrapper>

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
          <Menu
            id="all-filter-menu"
            anchorEl={filterAnchorEl}
            open={filterMenuOpen}
            onClose={closeFilterMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                borderRadius: 12,
                overflow: 'hidden',
              },
            }}
          >
            <MenuItem onClick={setFilterAll}>
              <MenuItemText>All</MenuItemText>
            </MenuItem>

            <MenuItem onClick={setFilterHasInvited}>
              <MenuItemText>
                Has invited friends - ({filterGroups.hasInvitedCount})
              </MenuItemText>
            </MenuItem>

            <MenuItem onClick={setFilterHasEndorsed}>
              <MenuItemText>
                Has endorsed - ({filterGroups.hasEndorsedCount})
              </MenuItemText>
            </MenuItem>
          </Menu>
        </LeftTools>
        {/*
        <VerticalBarWrapper $tight className="u-show-mobile">
          <VerticalBar />
        </VerticalBarWrapper>
        */}
        {/* Thank you message dropdown (mobile) */}
        <ThankYouDropdownButton
          type="button"
          onClick={openThankYouMenu}
          className="u-show-mobile"
          aria-label="Thank you message options"
          aria-controls={thankYouMenuOpen ? 'thank-you-menu' : undefined}
          aria-haspopup="menu"
          aria-expanded={thankYouMenuOpen ? 'true' : undefined}
        >
          Thank You message
          <CaretIcon as={KeyboardArrowDownIcon} />
        </ThankYouDropdownButton>

        <Menu
          id="thank-you-menu"
          anchorEl={thankYouAnchorEl}
          open={thankYouMenuOpen}
          onClose={closeThankYouMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ style: { borderRadius: 12, overflow: 'hidden', minWidth: 260 } }}
        >
          <MenuItem disabled>
            <ListItemText primary="Thank You message is auto-sent after joining." />
          </MenuItem>

          <StyledMenuItem
            onClick={() => {
              closeThankYouMenu();
              setViewOpen(true);
            }}
          >
            <ListItemIcon>
              <VisibilityIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText primary="Preview" />
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              closeThankYouMenu();
              setDraftMessage(thankYouMessage);
              setEditOpen(true);
            }}
          >
            <ListItemIcon>
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </StyledMenuItem>

          <StyledMenuItem
            onClick={async () => {
              closeThankYouMenu();
              await copyThankYouMessage();
            }}
          >
            <ListItemIcon>
              <ContentCopyIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText primary="Copy" />
          </StyledMenuItem>
        </Menu>
        <SendButton
          variant="contained"
          className="u-show-desktop-tablet"
          disabled={selectedVoters.length === 0}
          onClick={handleSendThankYou}
        >
          Send Message to Selected ({selectedVoters.length})
        </SendButton>
      </ToolbarRow>

      <CardList>
        {visibleSupporters.map((v) => {
          const isChecked = selected.has(v.id);
          const isOpen = expanded.has(v.id);

          const actions = getActionsLabel(v);
          const needsAction = actions.length > 0;
          const hasMessageSent = !!v.messageSentCount;

          return (
            <Card key={v.id} $selected={isChecked}>
              <CardTopRow>
                <NameRow>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelected(v.id)}
                    aria-label={`Select ${v.name}`}
                  />
                  <NameText>{v.name}</NameText>

                  <Badges>
                    {v.endorsed && (
                      <BadgeOk className="u-show-desktop-tablet">
                        <DoneIcon sx={{ fontSize: 14 }} /> Endorsed
                      </BadgeOk>
                    )}

                    {!!v.friendsInvited && (
                      <BadgeNeutral className="u-show-desktop-tablet">
                        {v.friendsInvited} friends invited
                      </BadgeNeutral>
                    )}

                    <CandidateLink className="u-show-desktop-tablet" type="button" onClick={() => openCandidateDrawer(v)}>
                      View on candidate page
                    </CandidateLink>
                  </Badges>
                </NameRow>

                <RightOptions>
                  <BadgeNeutral className="u-show-mobile">
                    Friends invited: <b>{v.friendsInvited}</b>
                  </BadgeNeutral>
                  <VerticalBarWrapper className="u-show-mobile">
                    <VerticalBar />
                  </VerticalBarWrapper>
                  <KebabBtn
                    type="button"
                    aria-label="More options"
                    onClick={(e) => openRowMenu(e, v)}
                  >
                    <MoreHorizIcon sx={{ fontSize: 20 }} />
                  </KebabBtn>
                  <VerticalBarWrapper className="u-show-mobile">
                    <VerticalBar />
                  </VerticalBarWrapper>
                  <ExpandBtn
                    className="u-show-mobile"
                    type="button"
                    onClick={() => toggleExpanded(v.id)}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? (
                      <CaretIcon as={KeyboardArrowUpIcon} />
                    ) : (
                      <CaretIcon as={KeyboardArrowDownIcon} />
                    )}
                  </ExpandBtn>
                </RightOptions>
              </CardTopRow>

              <CardActionsAndOpinion>
                <CardActions>
                  {v.endorsed && (
                    <ActionPill
                      type="button"
                      onClick={() => alert(`Like endorsement/opinion for ${v.name}`)}
                    >
                      <MediumBoldText>
                        <ThumbUpIcon sx={{ fontSize: 14 }} /> Like endorsement/opinion
                      </MediumBoldText>
                    </ActionPill>
                  )}

                  {hasMessageSent ? (
                    <ActionLink>
                      <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />{' '}
                      Message sent ({v.messageSentCount})
                    </ActionLink>
                  ) : needsAction ? (
                    <ActionPill
                      type="button"
                      onClick={() => alert(`Send message & ask ${v.name} to ${actions}`)}
                    >
                      <MediumBoldText>Send message &amp; ask to:</MediumBoldText>
                      <br />
                      <em>{actions}</em>
                    </ActionPill>
                  ) : (
                    <ActionPill
                      type="button"
                      onClick={() => alert(`Send thanks to ${v.name}`)}
                    >
                      <MediumBoldText>Send thanks</MediumBoldText>
                    </ActionPill>
                  )}
                </CardActions>

                <VerticalBarWrapper className="u-show-desktop-tablet">
                  <VerticalBar />
                </VerticalBarWrapper>

                {v.publicOpinion && (
                  <div className="u-show-desktop-tablet">
                    <ExpandBtn
                      type="button"
                      onClick={() => toggleExpanded(v.id)}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? (
                        <CaretIcon as={KeyboardArrowDownIcon} />
                      ) : (
                        <CaretIcon as={KeyboardArrowRightIcon} />
                      )}
                    </ExpandBtn>
                  </div>
                )}

                <div className="u-show-desktop-tablet">
                  {v.publicOpinion ? (
                    <OpinionBox>{isOpen ? v.publicOpinion : '...'}</OpinionBox>
                  ) : (
                    <OpinionEmpty>No public opinion available.</OpinionEmpty>
                  )}
                </div>
              </CardActionsAndOpinion>

              {/* MOBILE: expanded details under the action buttons */}
              <div className="u-show-mobile">
                {isOpen && (
                  <MobileDetails>
                    <MobileOpinionLabel>Public sentiment/opinion</MobileOpinionLabel>
                    <MobileDetailsRow>
                      <MobileEndorsed>
                        {v.endorsed ? (
                          <>
                            <ThumbUpIcon color="success" sx={{ fontSize: 16 }} /> Endorsed
                          </>
                        ) : (
                          <>Not endorsed</>
                        )}
                      </MobileEndorsed>
                      {v.publicOpinion ? (
                        <MobileOpinionText>{v.publicOpinion}</MobileOpinionText>
                      ) : (
                        <MobileOpinionEmpty>No public opinion available.</MobileOpinionEmpty>
                      )}
                    </MobileDetailsRow>
                  </MobileDetails>
                )}
              </div>
            </Card>
          );
        })}
      </CardList>

      <MobileBottomBar className="u-show-mobile">
        <MobileSendButton
          variant="contained"
          disabled={selectedVoters.length === 0}
          onClick={handleSendThankYou}
        >
          Send Message to Selected ({selectedVoters.length})
        </MobileSendButton>
      </MobileBottomBar>

      <Menu
        id="voter-row-menu"
        anchorEl={rowMenuAnchorEl}
        open={rowMenuOpen}
        onClose={closeRowMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          style: {
            borderRadius: 12,
            overflow: 'hidden',
            minWidth: 220,
          },
        }}
      >
        <StyledMenuItem onClick={handleEditVoter}>
          <ListItemIcon>
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText primary="Edit voter" />
        </StyledMenuItem>

        <StyledMenuItem onClick={handleSendMessage}>
          <ListItemIcon>
            <MailOutlineIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText primary="Send message" />
        </StyledMenuItem>
      </Menu>

      {/* Drawer that opens with the candidate view of a voter, from "View on candidate page" link */}
      <Drawer
        anchor="right"
        open={candidateDrawerOpen}
        onClose={closeCandidateDrawer}
        PaperProps={{ sx: { width: 'min(920px, 92vw)' } }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
            <strong>Candidate page</strong>
            <button type="button" onClick={closeCandidateDrawer}>Close</button>
          </div>

          <div style={{ flex: 1 }}>
            {/* http://localhost:3000/shannon-d-dicus-politician-from-california/-/ */}
            <iframe
              title="Candidate page"
              src={candidateDrawerVoter?.candidateUrl || '/candidates/cs'}
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      </Drawer>

      {/* Pop up to display when a user views the Thank You message */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thank-you message</DialogTitle>

        <DialogContent>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
            {thankYouMessage}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Pop up to display when a user edits the Thank You message */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit thank-you message</DialogTitle>

        <DialogContent>
          <TextField
            multiline
            minRows={6}
            maxRows={16}
            fullWidth
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setThankYouMessage(draftMessage);
              setEditOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pop up to display when a user copies or sends the Thank You message */}
      <Snackbar
        open={copyOpen}
        autoHideDuration={2000}
        onClose={() => setCopyOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '&.MuiSnackbar-anchorOriginTopCenter': { top: 80 } }}
      >
        <Alert severity="success" variant="filled">
          Copied!
        </Alert>
      </Snackbar>
      <Snackbar
        open={sendToast.open}
        autoHideDuration={2500}
        onClose={() => setSendToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '&.MuiSnackbar-anchorOriginTopCenter': { top: 80 },
        }}
      >
        <Alert severity={sendToast.ok ? 'success' : 'error'} variant="filled">
          {sendToast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}

/* ===== Styled components ===== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Placeholder = styled.div`
  background: ${DesignTokenColors.neutralUI50};
  border: 1px dashed ${DesignTokenColors.neutralUI300};
  border-radius: 12px;
  color: ${DesignTokenColors.neutralUI600};
  padding: 24px;
  text-align: center;
`;

const MediumBoldText = styled.span`
  font-weight: 500;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InfoBox = styled.div`
  flex: 2;
  font-size: 13px;
  padding: 10px;
  border-radius: 12px;
  color: #374151;
`;

const ThankYouBox = styled.div`
  flex: 1;
  max-width: 420px;
  min-width: 160px;
  background: #ffffff;
  padding: 10px;
`;

const ThankYouLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
`;

const ThankYouSubtext = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const IconRow = styled.span`
  display: inline-flex;
  gap: 6px;
`;

const IconBtn = styled.button`
  border: none;
  background: #f9fafb;
  border-radius: 8px;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 10px;

  display: inline-flex;
  align-items: center;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const ThankYouDropdownButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: #111827;
  display: inline-flex;
  align-items: center;
  padding: 6px 6px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    border-radius: 10px;
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-left: 12px;
`;

const LeftTools = styled.div`
  display: flex;
  align-items: center;
`;

const SelectControl = styled(ButtonBase)`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border-radius: 8px;
`;

const CaretIcon = styled.span`
  font-size: 32px;
  padding: 0 4px;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
`;

const CaretButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`;

const AllButton = styled(Button)`
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

const MenuItemText = styled.span`
  font-size: 14px;
  color: #111827;
`;

const VerticalBarWrapper = styled.div`
  align-self: stretch;
  display: flex;
  align-items: center;
  margin: ${(p) => (p.$tight ? '0 4px' : '0 12px')};
`;

const VerticalBar = styled.div`
  width: 1px;
  height: 80%;
  background: #d1d5db;
  border-radius: 999px;
`;

const SendButton = styled(Button)`
  && {
    margin-left: 12px;
    text-transform: none;
    border-radius: 999px;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 575px) {
    padding-bottom: 72px;
  }
`;

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: ${DesignTokenColors.neutralUI50};
  padding: 12px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.02);
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const NameRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const NameText = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 12px;
`;

const BadgeOk = styled.span`
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  border-radius: 999px;
  padding: 2px 8px;
  font-weight: 700;

  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const BadgeNeutral = styled.span`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  border-radius: 999px;
  padding: 2px 8px;
`;

const CandidateLink = styled.button`
  color: #2563eb;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const KebabBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const RightOptions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    font-size: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

const CardActionsAndOpinion = styled.div`
  display: flex;
`;

const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media (max-width: 575px) {
    flex: 1;
    align-items: stretch;
  }
`;

const ActionPill = styled.button`
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    filter: brightness(0.98);
  }
  @media (max-width: 575px) {
    flex: 1;
  }
  @media (min-width: 576px) {
    min-width: 280px;
  }
`;

const ActionLink = styled.span`
  color: #2563eb;
  text-decoration: none;
  align-items: center;
  align-self: center;
  gap: 6px;
`;

const ExpandBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  padding: 2px 2px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    border-radius: 6px;
  }
`;

const OpinionBox = styled.div`
  font-size: 12px;
  color: #374151;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 12px;
  padding: 10px;
  margin: 4px 0;
`;

const OpinionEmpty = styled.div`
  font-size: 12px;
  color: #9ca3af;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  padding: 10px;
`;

const MobileDetails = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
`;

const MobileDetailsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #374151;
  margin-bottom: 6px;
`;

const MobileEndorsed = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
`;

const MobileOpinionLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
`;

const MobileOpinionText = styled.div`
  font-size: 12px;
  color: #374151;
`;

const MobileOpinionEmpty = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const MobileBottomBar = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1300; /* above most UI */
  padding: 10px 12px;
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
  background: ${DesignTokenColors.whiteUI};
  border-top: 1px solid #e5e7eb;
`;

const MobileSendButton = styled(Button)`
  && {
    border-radius: 999px;
    text-transform: none;
  }
`;

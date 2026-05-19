/* eslint-disable no-alert */
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Drawer from '@mui/material/Drawer';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ActionPill from '../../components/ManageMyCandidates/ActionPill';
import { CandidateActionsFilterMenu, CandidateRowMenu, CandidateTraitsFilterMenu, DropdownMenu, SelectAllCheckbox } from '../../components/ManageMyCandidates/Menus';
import { SendMessageButton, SendMessageButtonMobile } from '../../components/ManageMyCandidates/SendButtons';
import TrackingHeaderActionContext from './TrackingHeaderActionContext';
import { Card, CardList, CardTopRow, Container, KebabBtn, LeftTools, NameRow, NameText, RightOptions, ToolbarRow, VerticalBar, VerticalBarWrapper } from '../../components/Style/ManageMyCandidates';
import { MobileActionPill, MobileActions, MobileFieldLabel, MobileFieldValue, MobileToolbar, SearchBtn, SelectAllInline } from '../../components/Style/SupporterTrackingStyles';

const FILTERS = {
  ALL: 'all',
  HAS_INVITED: 'hasInvited',
  HAS_ENDORSED: 'hasEndorsed',
};

const DEFAULT_THANK_YOU_MESSAGE = `Dear Candidate,

Thank you so much. May the odds be ever in your favor. We love you.

From the developers at WeVote <3`;

function getPendingActions (v) {
  return [
    !v.endorsed && 'Endorse',
    !v.publicOpinion && 'Write public opinion',
    v.friendsInvited === 0 && 'Invite friends',
  ].filter(Boolean);
}

function getActionsLabel (v) {
  return getPendingActions(v).join(', ');
}

export default function SupportersJoined ({ supporters }) {
  const headerActionSlot = useContext(TrackingHeaderActionContext);
  const [selected, setSelected] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
  const [thankYouMessage, setThankYouMessage] = useState(DEFAULT_THANK_YOU_MESSAGE);
  const [draftMessage, setDraftMessage] = useState(thankYouMessage);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [, setIsSending] = useState(false);
  const [sendToast, setSendToast] = useState({ open: false, ok: true, msg: '' });

  const [selectAnchorEl, setSelectAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [rowMenuVoter, setRowMenuVoter] = useState(null);

  const [candidateDrawerOpen, setCandidateDrawerOpen] = useState(false);
  const [candidateDrawerVoter, setCandidateDrawerVoter] = useState(null);

  const [thankYouAnchorEl, setThankYouAnchorEl] = useState(null);
  const thankYouMenuOpen = Boolean(thankYouAnchorEl);
  const openThankYouMenu = (e) => setThankYouAnchorEl(e.currentTarget);
  const closeThankYouMenu = () => setThankYouAnchorEl(null);

  const copyThankYouMessage = async () => {
    try {
      await navigator.clipboard.writeText(thankYouMessage);
      setCopyOpen(true);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const selectedVoters = useMemo(
    () => supporters.filter((v) => selected.has(v.id)),
    [supporters, selected],
  );

  const actionGroups = useMemo(() => {
    const map = new Map();
    supporters.forEach((v) => {
      const actionsLabel = getActionsLabel(v);
      if (!actionsLabel) return;
      const prev = map.get(actionsLabel) || [];
      prev.push(v.id);
      map.set(actionsLabel, prev);
    });
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
    [visibleSupporters, selected],
  );
  const allChecked = totalVisibleCount > 0 && selectedVisibleCount === totalVisibleCount;
  const indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < totalVisibleCount;

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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectCheckboxClick = (e) => {
    e.stopPropagation();
    setSelected((prev) => (prev.size === 0 ? new Set(visibleSupporters.map((v) => v.id)) : new Set()));
  };

  const openCandidateDrawer = (voter) => {
    setCandidateDrawerVoter(voter);
    setCandidateDrawerOpen(true);
  };

  const closeCandidateDrawer = () => {
    setCandidateDrawerOpen(false);
    setCandidateDrawerVoter(null);
  };

  const openRowMenu = (e, voter) => {
    e.stopPropagation();
    setRowMenuAnchorEl(e.currentTarget);
    setRowMenuVoter(voter);
  };

  const handleSendThankYou = async () => {
    if (selectedVoters.length === 0) return;
    setIsSending(true);
    try {
      // TODO: replace with real API call(s)
      // await sendThankYouMessage(selectedVoters, thankYouMessage);
      setSendToast({
        open: true,
        ok: true,
        msg: `Sent to ${selectedVoters.length} supporter${selectedVoters.length === 1 ? '' : 's'}.`,
      });
    } catch (err) {
      console.error(err);
      setSendToast({ open: true, ok: false, msg: 'Send failed. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container>
      <TopPanel className="u-show-desktop-tablet">
        <PrivacyNote>
          Sentiments and opinions posted by WeVote members are private by default.
          You can view them only if the member chooses to make them public.
        </PrivacyNote>
        <VerticalBarWrapper><VerticalBar /></VerticalBarWrapper>
        <ThankYouCol>
          <ThankYouHead>
            <ThankYouHeading>Thank You message:</ThankYouHeading>
            <IconBtnRow>
              <IconBtn type="button" title="View" onClick={() => setViewOpen(true)}>
                <VisibilityIcon sx={{ fontSize: 17 }} />
              </IconBtn>
              <IconBtn
                type="button"
                title="Edit"
                onClick={() => { setDraftMessage(thankYouMessage); setEditOpen(true); }}
              >
                <EditOutlinedIcon sx={{ fontSize: 17 }} />
              </IconBtn>
              <IconBtn type="button" title="Copy" onClick={copyThankYouMessage}>
                <ContentCopyIcon sx={{ fontSize: 17 }} />
              </IconBtn>
            </IconBtnRow>
          </ThankYouHead>
          <Subtle>(auto-sent after joining)</Subtle>
        </ThankYouCol>
      </TopPanel>

      <ToolbarRow className="u-show-desktop-tablet">
        <LeftTools>
          <CandidateActionsFilterMenu
            selectAnchorEl={selectAnchorEl}
            setSelectAnchorEl={setSelectAnchorEl}
            checkedBoolean={allChecked}
            indeterminateBoolean={indeterminate}
            handleSelectCheckboxClick={handleSelectCheckboxClick}
            menuOptions={[
              { label: 'All', onClick: () => setSelected(new Set(supporters.map((v) => v.id))) },
              ...actionGroups.map((g) => ({
                label: `Ask to: ${g.label} - (${g.count})`,
                onClick: () => setSelected(new Set(g.ids)),
              })),
            ]}
          />
          <VerticalBarWrapper $tight><VerticalBar /></VerticalBarWrapper>
          <CandidateTraitsFilterMenu
            filterAnchorEl={filterAnchorEl}
            setFilterAnchorEl={setFilterAnchorEl}
            filterLabel={filterLabel}
            menuOptions={[
              { label: 'All', onClick: () => setActiveFilter(FILTERS.ALL) },
              { label: `Has invited friends - (${filterGroups.hasInvitedCount})`,
                onClick: () => setActiveFilter(FILTERS.HAS_INVITED) },
              { label: `Has endorsed - (${filterGroups.hasEndorsedCount})`,
                onClick: () => setActiveFilter(FILTERS.HAS_ENDORSED) },
            ]}
          />
        </LeftTools>
      </ToolbarRow>

      {headerActionSlot && createPortal(
        <SendMessageButton
          verb="Send thanks"
          count={selectedVoters.length}
          onClick={handleSendThankYou}
        />,
        headerActionSlot,
      )}

      <MobileToolbar className="u-show-mobile">
        <SelectAllInline>
          <SelectAllCheckbox
            checked={allChecked}
            indeterminate={indeterminate}
            onClick={handleSelectCheckboxClick}
          />
          Select all
        </SelectAllInline>
        <ThankYouTrigger
          type="button"
          onClick={openThankYouMenu}
          aria-haspopup="menu"
          aria-expanded={thankYouMenuOpen ? 'true' : undefined}
        >
          Thank You message
          <Caret as={KeyboardArrowDownIcon} />
        </ThankYouTrigger>
        <SearchBtn type="button" aria-label="Search" onClick={() => console.log('TODO: implement search feature')}>
          <SearchIcon sx={{ fontSize: 22 }} />
        </SearchBtn>
      </MobileToolbar>

      <DropdownMenu
        anchorEl={thankYouAnchorEl}
        onClose={closeThankYouMenu}
        align="left"
        menuId="thank-you-menu"
        menuOptions={[
          { info: true, label: 'Thank You message is auto-sent after joining.' },
          { icon: VisibilityIcon, label: 'Preview', onClick: () => setViewOpen(true) },
          { icon: EditOutlinedIcon,
            label: 'Edit',
            onClick: () => { setDraftMessage(thankYouMessage); setEditOpen(true); } },
          { icon: ContentCopyIcon, label: 'Copy', onClick: copyThankYouMessage },
        ]}
      />

      <CardList>
        {visibleSupporters.map((v) => {
          const isChecked = selected.has(v.id);
          const isOpen = expanded.has(v.id);
          const actions = getActionsLabel(v);
          const needsAction = actions.length > 0;
          const hasMessageSent = !!v.messageSentCount;
          const hasOpinion = !!v.publicOpinion;
          const showCandidateLink = v.endorsed || hasOpinion || !!v.friendsInvited;

          const renderPrimaryAction = () => {
            if (hasMessageSent) {
              return (
                <SentIndicator>
                  <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                  {' '}
                  Message sent (
                  {v.messageSentCount}
                  )
                </SentIndicator>
              );
            }
            if (needsAction) {
              return (
                <ActionPill
                  onClick={() => alert(`${v.endorsed ? 'Send thanks' : 'Send message'} & ask ${v.name} to ${actions}`)}
                  label={`${v.endorsed ? 'Send thanks' : 'Send message'} & ask to:`}
                  contentText={<em>{actions}</em>}
                />
              );
            }
            return (
              <ActionPill
                onClick={() => alert(`Send thanks to ${v.name}`)}
                label="Send thanks"
              />
            );
          };

          return (
            <Card key={v.id} $selected={isChecked}>
              <div className="u-show-desktop-tablet">
                <CardTopRow>
                  <NameRow>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelected(v.id)}
                      aria-label={`Select ${v.name}`}
                    />
                    <NameText>{v.name}</NameText>
                    {v.endorsed && (
                      <>
                        <NameDivider aria-hidden />
                        <Endorsed>
                          <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                          {' '}
                          Endorsed
                        </Endorsed>
                      </>
                    )}
                    {!!v.friendsInvited && (
                      <>
                        <NameDivider aria-hidden />
                        <Subtle>
                          {v.friendsInvited}
                          {' '}
                          friends invited
                        </Subtle>
                      </>
                    )}
                    {showCandidateLink && (
                      <>
                        <NameDivider aria-hidden />
                        <LinkBtn type="button" onClick={() => openCandidateDrawer(v)}>
                          View on candidate page
                        </LinkBtn>
                      </>
                    )}
                  </NameRow>
                  <RightOptions>
                    <KebabBtn type="button" aria-label="More options" onClick={(e) => openRowMenu(e, v)}>
                      <MoreHorizIcon sx={{ fontSize: 20 }} />
                    </KebabBtn>
                  </RightOptions>
                </CardTopRow>

                <CardOpinionRow
                  opinion={hasOpinion ? v.publicOpinion : null}
                  isOpen={isOpen}
                  onToggle={() => toggleExpanded(v.id)}
                >
                  {v.endorsed && (
                    <ActionPill
                      onClick={() => alert(`Like endorsement/opinion for ${v.name}`)}
                      label={(
                        <>
                          <ThumbUpIcon sx={{ fontSize: 14 }} />
                          {' '}
                          Like endorsement/opinion
                        </>
                      )}
                    />
                  )}
                  {renderPrimaryAction()}
                  {!v.endorsed && !hasMessageSent && (
                    <ReminderText>Send reminder message in 3 days</ReminderText>
                  )}
                </CardOpinionRow>
              </div>

              <div className="u-show-mobile">
                <CardTopRow>
                  <NameRow>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelected(v.id)}
                      aria-label={`Select ${v.name}`}
                    />
                    <NameText>{v.name}</NameText>
                  </NameRow>
                  <RightOptions>
                    <Subtle>
                      Friends invited:
                      {' '}
                      <b>{v.friendsInvited || 0}</b>
                    </Subtle>
                    <KebabBtn type="button" aria-label="More options" onClick={(e) => openRowMenu(e, v)}>
                      <MoreHorizIcon sx={{ fontSize: 20 }} />
                    </KebabBtn>
                    <ExpandBtn type="button" onClick={() => toggleExpanded(v.id)} aria-expanded={isOpen}>
                      <Caret as={isOpen ? KeyboardArrowUpIcon : KeyboardArrowDownIcon} />
                    </ExpandBtn>
                  </RightOptions>
                </CardTopRow>

                <MobileFieldLabel>What you can do</MobileFieldLabel>
                <MobileActions>
                  {v.endorsed && (
                    <MobileActionPill type="button" onClick={() => alert(`Give thumbs up on endorsement/opinion for ${v.name}`)}>
                      Give thumbs up on endorsement/opinion
                    </MobileActionPill>
                  )}
                  {hasMessageSent ? (
                    <MobileActionPill type="button" disabled>
                      Message sent (
                      {v.messageSentCount}
                      )
                    </MobileActionPill>
                  ) : (
                    <MobileActionPill
                      type="button"
                      onClick={() => (needsAction ?
                        alert(`${v.endorsed ? 'Send thanks' : 'Send message'} & ask ${v.name} to ${actions}`) :
                        alert(`Send thanks to ${v.name}`))}
                    >
                      {needsAction && !v.endorsed ? 'Send message' : 'Send thanks'}
                    </MobileActionPill>
                  )}
                </MobileActions>

                {isOpen && (
                  <>
                    <MobileFieldLabel>Public sentiment/opinion</MobileFieldLabel>
                    <MobileSentiment>
                      <MobileEndorsed $muted={!v.endorsed}>
                        {v.endorsed ? (
                          <>
                            <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                            {' '}
                            Endorsed
                          </>
                        ) : 'Not endorsed'}
                      </MobileEndorsed>
                      {hasOpinion ? (
                        <OpinionText>{v.publicOpinion}</OpinionText>
                      ) : (
                        <OpinionText $empty>No public opinion available.</OpinionText>
                      )}
                    </MobileSentiment>

                    {needsAction && (
                      <>
                        <MobileFieldLabel>What you can ask voters to do</MobileFieldLabel>
                        <MobileFieldValue>{actions}</MobileFieldValue>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </CardList>

      <SendMessageButtonMobile
        verb="Send message to selected"
        count={selectedVoters.length}
        onClick={handleSendThankYou}
      />

      <CandidateRowMenu
        rowMenuAnchorEl={rowMenuAnchorEl}
        setRowMenuAnchorEl={setRowMenuAnchorEl}
        setRowMenuVoter={setRowMenuVoter}
        menuOptions={[
          { icon: EditOutlinedIcon,
            label: 'Edit voter',
            onClick: () => rowMenuVoter && alert(`Edit voter: ${rowMenuVoter.name}`) },
          { icon: MailOutlineIcon,
            label: 'Send message',
            onClick: () => rowMenuVoter && alert(`Send message to: ${rowMenuVoter.name}`) },
        ]}
      />

      <Drawer
        anchor="right"
        open={candidateDrawerOpen}
        onClose={closeCandidateDrawer}
        PaperProps={{ sx: { width: 'min(920px, 92vw)' } }}
      >
        <DrawerLayout>
          <DrawerHeader>
            <strong>Candidate page</strong>
            <Button size="small" variant="outlined" onClick={closeCandidateDrawer}>Close</Button>
          </DrawerHeader>
          <DrawerIframe
            title="Candidate page"
            src={candidateDrawerVoter?.candidateUrl || '/candidates/cs'}
          />
        </DrawerLayout>
      </Drawer>

      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thank-you message</DialogTitle>
        <DialogContent>
          <ThankYouPreview>{thankYouMessage}</ThankYouPreview>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
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
          <Button variant="contained" onClick={() => { setThankYouMessage(draftMessage); setEditOpen(false); }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copyOpen}
        autoHideDuration={2000}
        onClose={() => setCopyOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '&.MuiSnackbar-anchorOriginTopCenter': { top: 80 } }}
      >
        <Alert severity="success" variant="filled">Copied!</Alert>
      </Snackbar>
      <Snackbar
        open={sendToast.open}
        autoHideDuration={2500}
        onClose={() => setSendToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '&.MuiSnackbar-anchorOriginTopCenter': { top: 80 } }}
      >
        <Alert severity={sendToast.ok ? 'success' : 'error'} variant="filled">
          {sendToast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
SupportersJoined.propTypes = {
  supporters: PropTypes.arrayOf(PropTypes.object),
};

function CardOpinionRow ({ children, opinion, isOpen, onToggle }) {
  const actionsRef = useRef(null);
  const [maxH, setMaxH] = useState(null);

  useLayoutEffect(() => {
    const el = actionsRef.current;
    if (!el) return undefined;
    const update = () => setMaxH(el.offsetHeight);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <CardBody>
      <ActionsCol ref={actionsRef}>{children}</ActionsCol>
      {opinion != null && (
        <>
          <VerticalBarWrapper><VerticalBar /></VerticalBarWrapper>
          <ExpandBtn
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse opinion' : 'Expand opinion'}
          >
            <Caret as={isOpen ? KeyboardArrowUpIcon : KeyboardArrowDownIcon} />
          </ExpandBtn>
          <OpinionText
            $open={isOpen}
            style={!isOpen && maxH != null ? { maxHeight: `${maxH}px` } : undefined}
          >
            {opinion}
          </OpinionText>
        </>
      )}
    </CardBody>
  );
}
CardOpinionRow.propTypes = {
  children: PropTypes.node,
  opinion: PropTypes.string,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

/* ===== Styled components ===== */

const ActionsCol = styled.div`
  align-items: stretch;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
`;

const Caret = styled.span`
  align-items: center;
  color: ${DesignTokenColors.neutralUI600};
  display: inline-flex;
  font-size: 18px;
`;

const CardBody = styled.div`
  align-items: flex-start;
  display: flex;
  margin-top: 10px;
`;

const DrawerHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  display: flex;
  justify-content: space-between;
  padding: 12px;
`;

const DrawerIframe = styled.iframe`
  border: 0;
  flex: 1;
  width: 100%;
`;

const DrawerLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Endorsed = styled.span`
  align-items: center;
  color: ${DesignTokenColors.neutralUI900};
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  gap: 4px;

  svg {
    color: ${DesignTokenColors.primary600};
  }
`;

const ExpandBtn = styled.button`
  align-items: flex-start;
  align-self: flex-start;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: ${DesignTokenColors.neutralUI600};
  cursor: pointer;
  display: inline-flex;
  padding: 4px 2px 0;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const IconBtn = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  margin: 0;
  padding: 2px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;

const IconBtnRow = styled.span`
  align-items: center;
  display: inline-flex;
  gap: 4px;
`;

const LinkBtn = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 0;

  &:hover {
    color: ${DesignTokenColors.primary700};
    text-decoration: underline;
  }
`;

const MobileEndorsed = styled.div`
  align-items: center;
  color: ${(p) => (p.$muted ? DesignTokenColors.neutralUI600 : DesignTokenColors.neutralUI900)};
  display: inline-flex;
  font-weight: 600;
  gap: 6px;
`;

const MobileSentiment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
`;

const NameDivider = styled.span`
  background: ${DesignTokenColors.neutralUI300};
  display: inline-block;
  height: 14px;
  width: 1px;
`;

const OpinionText = styled.div`
  color: ${(p) => (p.$empty ? DesignTokenColors.neutralUI500 : DesignTokenColors.neutralUI700)};
  flex: 1;
  font-size: 13px;
  font-style: ${(p) => (p.$empty ? 'italic' : 'normal')};
  line-height: 1.5;
  padding: 4px 0;

  ${(p) => p.$open === false && `
    overflow: hidden;
  `}
`;

const PrivacyNote = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  flex: 1 1 100%;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  min-width: 0;
`;

const ReminderText = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  text-align: center;
`;

const SentIndicator = styled.span`
  align-items: center;
  align-self: flex-start;
  color: ${DesignTokenColors.primary600};
  display: inline-flex;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
`;

const Subtle = styled.span`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 12px;
`;

const ThankYouCol = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 240px;
`;

const ThankYouHead = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`;

const ThankYouHeading = styled.span`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

const ThankYouPreview = styled.div`
  font-size: 14px;
  white-space: pre-wrap;
`;

const ThankYouTrigger = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 14px;
  padding: 6px 8px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const TopPanel = styled.div`
  align-items: flex-start;
  display: flex;
  margin-bottom: 12px;
`;

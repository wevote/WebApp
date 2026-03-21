import React, { useEffect, useMemo, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmailIcon from '@mui/icons-material/Email';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SmsIcon from '@mui/icons-material/Sms';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ActionPill from '../../components/ManageMyCandidates/ActionPill';
import { CandidateActionsFilterMenu, CandidateTraitsFilterMenu, CandidateRowMenu } from '../../components/ManageMyCandidates/Menus';
import { SendMessageButton, SendMessageButtonMobile } from '../../components/ManageMyCandidates/SendButtons';
import { CardList, Card, CardTopRow, CardActionsAndOpinion, CardInfo, CardInfoTitle, CardInfoValue, VerticalBarWrapper, VerticalBar, ToolbarRow, LeftTools } from '../../components/Style/ManageMyCandidates';

const FILTERS = {
  ALL: 'all',
  HAS_INVITED: 'hasInvited',
  HAS_ENDORSED: 'hasEndorsed',
};

export default function SupportersInvited ({ supporters }) {
  const [selected, setSelected] = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
  const [copyOpen, setCopyOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendToast, setSendToast] = useState({ open: false, ok: true, msg: '' });

  // ----- checkbox dropdown menu state -----
  const [selectAnchorEl, setSelectAnchorEl] = useState(null);
  // ----- "All" dropdown menu state -----
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  // ----- per-row "triple dot" menu state -----
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [rowMenuVoter, setRowMenuVoter] = useState(null);

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

  const actionGroups = useMemo(() => {
    // key: actionsLabel, value: array of supporter ids
    const map = new Map();

    visibleSupporters.forEach((v) => {
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
  }, [getActionsLabel, visibleSupporters]);

  useEffect(() => {
    const visibleIds = new Set(visibleSupporters.map((v) => v.id));
    setSelected((prev) => new Set([...prev].filter((id) => visibleIds.has(id))));
  }, [visibleSupporters]);

  const totalVisibleCount = visibleSupporters.length;
  const selectedVisibleCount = useMemo(
    () => visibleSupporters.filter((v) => selected.has(v.id)).length,
    [visibleSupporters, selected],
  );

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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
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

  const openRowMenu = (e, voter) => {
    e.stopPropagation();
    setRowMenuAnchorEl(e.currentTarget);
    setRowMenuVoter(voter);
  };

  const handleSendMessage = () => {
    if (rowMenuVoter) {
      alert(`Send message to: ${rowMenuVoter.name}`);
    }
  };

  const handleSendThankYou = async () => {
    console.log('selectedVoters', selectedVoters);
    if (selectedVoters.length === 0) {
      return;
    }

    setIsSending(true);
    try {
      // TODO: replace with real API call(s)
      // await sendThankYouMessage(selectedVoters, thankYouMessage);
      handleSendMessage();
      console.log('here');
      setSendToast({
        open: true,
        ok: true,
        msg: `Sent to ${selectedVoters.length} supporter${selectedVoters.length === 1 ? '' : 's'}.`,
      });
      console.log('here2');

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
      {/* <MessageContainer className="u-show-desktop-tablet">

      </MessageContainer> */}

      {/* Abstract Out */}
      <ToolbarRow>
        <LeftTools>

          <CandidateActionsFilterMenu
            selectAnchorEl={selectAnchorEl}
            setSelectAnchorEl={setSelectAnchorEl}
            checkedBoolean={totalVisibleCount > 0 && selectedVisibleCount === totalVisibleCount}
            indeterminateBoolean={selectedVisibleCount > 0 && selectedVisibleCount < totalVisibleCount}
            handleSelectCheckboxClick={handleSelectCheckboxClick}
            menuOptions={[
              { label: 'All', onClick: () => setSelected(new Set(visibleSupporters.map((v) => v.id)))},
              ...actionGroups.map((g) => ({
                label: `Ask to: ${g.label} - (${g.count})`,
                onClick: () => setSelected(new Set(g.ids)) })),
              { label: 'None', onClick: () => setSelected(new Set()) },
            ]}
          />

          <VerticalBarWrapper $tight>
            <VerticalBar />
          </VerticalBarWrapper>

          <CandidateTraitsFilterMenu
            filterAnchorEl={filterAnchorEl}
            setFilterAnchorEl={setFilterAnchorEl}
            filterLabel={filterLabel}
            menuOptions={[
              { label: "All", onClick: () => setActiveFilter(FILTERS.ALL) },
              { label: `Has invited friends - (${filterGroups.hasInvitedCount})`,
                onClick: () => setActiveFilter(FILTERS.HAS_INVITED) },
              { label: `Has endorsed - (${filterGroups.hasEndorsedCount})`,
                onClick: () => setActiveFilter(FILTERS.HAS_ENDORSED) },
            ]}
          />
        </LeftTools>

        <SendMessageButton
          disbaleBoolean={selectedVoters.length === 0}
          sendMessageFunction={handleSendThankYou}
          buttonText={`Resend Invitation to Selected (${selectedVoters.length})`}
        />
      </ToolbarRow>


      <CardList>
        {visibleSupporters.map((v) => {
          const isChecked = selected.has(v.id);

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

                </NameRow>

                <RightOptions>
                  <VerticalBarWrapper>
                    <VerticalBar />
                  </VerticalBarWrapper>
                  <KebabBtn
                    type="button"
                    aria-label="More options"
                    onClick={(e) => openRowMenu(e, v)}
                  >
                    <MoreHorizIcon sx={{ fontSize: 20 }} />
                  </KebabBtn>
                </RightOptions>
              </CardTopRow>

              <CardActionsAndOpinion>

                <CardInfo>
                  <CardInfoTitle>
                    Invited via
                  </CardInfoTitle>
                  <CardInfoValue>
                    <>
                      {!!v.emailInviteSent && <EmailIcon />}
                      {!!v.textInviteSent && <SmsIcon />}
                    </>
                  </CardInfoValue>
                </CardInfo>

                <VerticalBarWrapper><VerticalBar /></VerticalBarWrapper>

                <CardInfo>
                  <CardInfoTitle>
                    Link clicked
                  </CardInfoTitle>
                  <CardInfoValue>
                    {!!v.inviteLinkClicked ? (
                      <>
                        <CheckCircleIconGreenLarge />
                        Yes
                      </>
                    ) : (
                      'No'
                    )}
                  </CardInfoValue>
                </CardInfo>

                <VerticalBarWrapper><VerticalBar /></VerticalBarWrapper>

                <CardInfo>
                  <CardInfoTitle>
                    Joined
                  </CardInfoTitle>
                  <CardInfoValue>
                    {!!v.joined ? (
                      <>
                        <CheckCircleIconGreenLarge />
                        Yes
                      </>
                    ) : (
                      'No'
                    )}
                  </CardInfoValue>
                </CardInfo>

                <VerticalBarWrapper><VerticalBar /></VerticalBarWrapper>

                <CardInfo>
                  <CardInfoTitle>
                    Friends invited
                  </CardInfoTitle>
                  <CardInfoValue>
                    {!!v.friendsInvited ? (
                      <>
                        <CheckCircleIconGreenLarge />
                        {v.friendsInvited}
                      </>
                    ) : (
                      'None'
                    )}
                  </CardInfoValue>
                </CardInfo>

              </CardActionsAndOpinion>


              <div>
                {!v.emailInviteSent && (
                  <ActionPill
                    onClick={() => alert(`Send an email & ask ${v.name} to join WeVote`)}
                    label={(
                      <>
                        <EmailIcon sx={{ fontSize: 18 }} />
                        Send email invite
                      </>
                    )}
                  />
                )}

                {!v.textInviteSent && (
                  <ActionPill
                    onClick={() => alert(`Send a text & ask ${v.name} to join WeVote`)}
                    label={(
                      <>
                        <SmsIcon sx={{ fontSize: 18 }} />
                        Send text invite
                      </>
                    )}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </CardList>

      <SendMessageButtonMobile
        disbaleBoolean={selectedVoters.length === 0}
        sendThankYouFunction={handleSendThankYou}
        buttonText={`Resend Invitation to Selected (${selectedVoters.length})`}
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

const NameRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const NameText = styled.div`
  font-size: 16px;
  font-weight: 700;
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

const CheckCircleIconGreenLarge = styled(CheckCircleIcon)`
  color: green;
  font-size: large;
`;

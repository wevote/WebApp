/* eslint-disable no-alert */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MailOutlineIcon from '@mui/icons-material/Mail';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { CandidateRowMenu, SelectAllCheckbox } from '../../components/ManageMyCandidates/Menus';
import { SendMessageButton, SendMessageButtonMobile } from '../../components/ManageMyCandidates/SendButtons';
import TrackingHeaderActionContext from './TrackingHeaderActionContext';
import { CardTopRow, Container, KebabBtn, LeftTools, NameText, RightOptions, ToolbarRow } from '../../components/Style/ManageMyCandidates';
import { ActionLinkButton, DesktopGridHeader, DesktopGridRow, FlatCardList, FlatRowCard, MobileActionPill, MobileActions, MobileFieldLabel, MobileFieldValue, NameCell, SelectAllInline } from '../../components/Style/SupporterTrackingStyles';

const SUB_FILTERS = {
  INVITED: 'invited',
  JOINED: 'joined',
};

const REMIND_GRID_COLS = 'minmax(140px, 200px) minmax(70px, 0.4fr) minmax(340px, 1.8fr)';

export default function SupportersToRemind ({ supporters }) {
  const headerActionSlot = useContext(TrackingHeaderActionContext);
  const [selected, setSelected] = useState(() => new Set());
  const [subFilter, setSubFilter] = useState(SUB_FILTERS.INVITED);
  const [sendToast, setSendToast] = useState({ open: false, ok: true, msg: '' });

  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [rowMenuVoter, setRowMenuVoter] = useState(null);

  const visibleSupporters = useMemo(
    () => supporters.filter((v) => (v.reminderSubStatus || SUB_FILTERS.INVITED) === subFilter),
    [supporters, subFilter],
  );

  useEffect(() => {
    const visibleIds = new Set(visibleSupporters.map((v) => v.id));
    setSelected((prev) => new Set([...prev].filter((id) => visibleIds.has(id))));
  }, [visibleSupporters]);

  const totalVisibleCount = visibleSupporters.length;
  const selectedVisibleCount = useMemo(
    () => visibleSupporters.filter((v) => selected.has(v.id)).length,
    [visibleSupporters, selected],
  );

  const selectedVoters = useMemo(
    () => supporters.filter((v) => selected.has(v.id)),
    [supporters, selected],
  );

  const toggleSelected = (id) => {
    setSelected((prev) => {
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

  const openRowMenu = (e, voter) => {
    e.stopPropagation();
    setRowMenuAnchorEl(e.currentTarget);
    setRowMenuVoter(voter);
  };

  const handleResendSelected = () => {
    if (selectedVoters.length === 0) return;
    setSendToast({
      open: true,
      ok: true,
      msg: `Resent invitation to ${selectedVoters.length} voter${selectedVoters.length === 1 ? '' : 's'}.`,
    });
  };

  const getInvitedViaLabel = (v) => {
    const channels = [];
    if (v.emailInviteSent) channels.push('Email');
    if (v.textInviteSent) channels.push('text');
    if (channels.length === 0) return '—';
    channels[0] = channels[0].charAt(0).toUpperCase() + channels[0].slice(1);
    return channels.join(', ');
  };

  const getRecommendedActions = (v) => {
    const sends = [];
    const resends = [];
    if (!v.emailInviteSent) {
      sends.push({ key: 'send-email', label: 'Send email invite', icon: EmailOutlinedIcon, onClick: () => alert(`Send email invite to ${v.name}`) });
    }
    if (!v.textInviteSent) {
      sends.push({ key: 'send-text', label: 'Send text invite', icon: SmsOutlinedIcon, onClick: () => alert(`Send text invite to ${v.name}`) });
    }
    if (v.emailInviteSent) {
      resends.push({ key: 'resend-email', label: 'Re-send email invite', icon: MailOutlineIcon, onClick: () => alert(`Re-send email invite to ${v.name}`) });
    }
    if (v.textInviteSent) {
      resends.push({ key: 'resend-text', label: 'Re-send text invite', icon: SmsOutlinedIcon, onClick: () => alert(`Re-send text invite to ${v.name}`) });
    }
    return { sends, resends };
  };

  const allChecked = totalVisibleCount > 0 && selectedVisibleCount === totalVisibleCount;
  const indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < totalVisibleCount;

  return (
    <Container>
      <Subtitle>
        Re-invite voters who haven&apos;t joined WeVote after 7+ days. A second nudge can help boost engagement.
      </Subtitle>

      <SubFilterRow>
        <SubFilterPills>
          <SubFilterPill
            type="button"
            $active={subFilter === SUB_FILTERS.INVITED}
            onClick={() => setSubFilter(SUB_FILTERS.INVITED)}
          >
            Invited
          </SubFilterPill>
          <SubFilterPill
            type="button"
            $active={subFilter === SUB_FILTERS.JOINED}
            onClick={() => setSubFilter(SUB_FILTERS.JOINED)}
          >
            Joined WeVote
          </SubFilterPill>
        </SubFilterPills>

        <MobileRightTools className="u-show-mobile">
          <SelectAllInline>
            <SelectAllCheckbox
              checked={allChecked}
              indeterminate={indeterminate}
              onClick={handleSelectCheckboxClick}
            />
            Select all
          </SelectAllInline>
          <MobileToolsDivider />
          <SearchIconButton type="button" aria-label="Search">
            <SearchIcon sx={{ fontSize: 22 }} />
          </SearchIconButton>
        </MobileRightTools>
      </SubFilterRow>

      {/* Desktop toolbar (Select all + send) */}
      <ToolbarRow className="u-show-desktop-tablet">
        <LeftTools>
          <SelectAllInline>
            <SelectAllCheckbox
              checked={allChecked}
              indeterminate={indeterminate}
              onClick={handleSelectCheckboxClick}
            />
            Select all
          </SelectAllInline>
        </LeftTools>
      </ToolbarRow>

      {headerActionSlot && createPortal(
        <SendMessageButton
          verb="Resend invite"
          count={selectedVoters.length}
          onClick={handleResendSelected}
        />,
        headerActionSlot,
      )}

      {/* Desktop column headers */}
      <DesktopGridHeader className="u-show-desktop-tablet" $cols={REMIND_GRID_COLS}>
        <HeaderName>
          <CheckboxSpacer aria-hidden="true" />
          Name
        </HeaderName>
        <HeaderInvitedVia>Invited via</HeaderInvitedVia>
        <HeaderActions>Recommended staff actions</HeaderActions>
      </DesktopGridHeader>

      {visibleSupporters.length === 0 ? (
        <EmptyState>No voters to remind in this view.</EmptyState>
      ) : (
        <FlatCardList>
          {visibleSupporters.map((v) => {
            const isChecked = selected.has(v.id);
            const actions = getRecommendedActions(v);

            return (
              <FlatRowCard key={v.id} $selected={isChecked}>
                {/* Desktop row layout */}
                <DesktopGridRow className="u-show-desktop-tablet" $cols={REMIND_GRID_COLS}>
                  <NameCell>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelected(v.id)}
                      aria-label={`Select ${v.name}`}
                    />
                    <NameText>{v.name}</NameText>
                  </NameCell>

                  <InvitedViaCell>{getInvitedViaLabel(v)}</InvitedViaCell>

                  <ActionsCell>
                    <ActionsColumn>
                      {actions.sends.map((a) => (
                        <ActionLinkButton key={a.key} type="button" onClick={a.onClick}>
                          <a.icon sx={{ fontSize: 18 }} />
                          {a.label}
                        </ActionLinkButton>
                      ))}
                    </ActionsColumn>
                    <ActionsColumn>
                      {actions.resends.map((a) => (
                        <ActionLinkButton key={a.key} type="button" onClick={a.onClick}>
                          <AutorenewIcon sx={{ fontSize: 16 }} />
                          <a.icon sx={{ fontSize: 18 }} />
                          {a.label}
                        </ActionLinkButton>
                      ))}
                    </ActionsColumn>
                  </ActionsCell>
                </DesktopGridRow>

                {/* Mobile card layout */}
                <div className="u-show-mobile">
                  <CardTopRow>
                    <NameCell>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelected(v.id)}
                        aria-label={`Select ${v.name}`}
                      />
                      <NameText>{v.name}</NameText>
                    </NameCell>
                    <RightOptions>
                      <KebabBtn type="button" aria-label="More options" onClick={(e) => openRowMenu(e, v)}>
                        <MoreHorizIcon sx={{ fontSize: 20 }} />
                      </KebabBtn>
                    </RightOptions>
                  </CardTopRow>

                  <MobileFieldLabel>Invited via</MobileFieldLabel>
                  <MobileFieldValue>{getInvitedViaLabel(v)}</MobileFieldValue>

                  <MobileFieldLabel>What you can do</MobileFieldLabel>
                  <MobileActions>
                    {[...actions.sends, ...actions.resends].map((a) => (
                      <MobileActionPill key={a.key} type="button" onClick={a.onClick}>
                        {a.label}
                      </MobileActionPill>
                    ))}
                  </MobileActions>
                </div>
              </FlatRowCard>
            );
          })}
        </FlatCardList>
      )}

      <SendMessageButtonMobile
        verb="Resend invitation to selected"
        count={selectedVoters.length}
        onClick={handleResendSelected}
      />

      <CandidateRowMenu
        rowMenuAnchorEl={rowMenuAnchorEl}
        setRowMenuAnchorEl={setRowMenuAnchorEl}
        setRowMenuVoter={setRowMenuVoter}
        menuOptions={[
          { icon: EditOutlinedIcon, label: 'Edit voter', onClick: () => rowMenuVoter && alert(`Edit voter: ${rowMenuVoter.name}`) },
          { icon: MailOutlineIcon, label: 'Send message', onClick: () => rowMenuVoter && alert(`Send message to: ${rowMenuVoter.name}`) },
        ]}
      />

      <Snackbar
        open={Boolean(sendToast.open)}
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
SupportersToRemind.propTypes = {
  supporters: PropTypes.arrayOf(PropTypes.object),
};

const ActionsCell = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const ActionsColumn = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  max-width: 180px;
`;

/* Same width as the row checkbox so "Name" header aligns with the data row's name text */
const CheckboxSpacer = styled.span`
  display: inline-block;
  height: 13px;
  width: 13px;
`;

const EmptyState = styled.div`
  background: ${DesignTokenColors.neutralUI50};
  border: 1px dashed ${DesignTokenColors.neutralUI300};
  border-radius: 12px;
  color: ${DesignTokenColors.neutralUI600};
  padding: 24px;
  text-align: center;
`;

const HeaderActions = styled.div``;

const HeaderInvitedVia = styled.div``;

const HeaderName = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
`;

const InvitedViaCell = styled.div`
  color: ${DesignTokenColors.neutralUI800};
  font-size: 14px;
`;

const MobileRightTools = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
`;

const MobileToolsDivider = styled.span`
  background: ${DesignTokenColors.neutralUI300};
  border-radius: 999px;
  display: inline-block;
  height: 18px;
  width: 1px;
`;

const SearchIconButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  padding: 0;
  width: 24px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
    color: ${DesignTokenColors.neutralUI900};
  }
`;

const SubFilterPill = styled.button`
  background: ${(p) => (p.$active ? DesignTokenColors.primary50 : DesignTokenColors.whiteUI)};
  border: 1px solid ${(p) => (p.$active ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI300)};
  border-radius: 12px;
  color: ${(p) => (p.$active ? DesignTokenColors.primary700 : DesignTokenColors.neutralUI700)};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  padding: 4px 12px;

  &:hover {
    background: ${DesignTokenColors.primary50};
  }
`;

const SubFilterPills = styled.div`
  display: flex;
  gap: 8px;
`;

const SubFilterRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  color: ${DesignTokenColors.neutralUI700};
  font-size: 14px;
  margin: 4px 0 12px;
`;

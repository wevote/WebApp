import React, { useEffect, useMemo, useState } from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { CandidateRowMenu } from '../../components/ManageMyCandidates/Menus';
import { SendMessageButton, SendMessageButtonMobile } from '../../components/ManageMyCandidates/SendButtons';
import { CardList, Card, CardTopRow, ToolbarRow, LeftTools } from '../../components/Style/ManageMyCandidates';

const SUB_FILTERS = {
  INVITED: 'invited',
  JOINED: 'joined',
};

export default function SupportersToRemind ({ supporters }) {
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
    return channels.length ? channels.join(', ') : '—';
  };

  const getRecommendedActions = (v) => {
    const actions = [];
    if (!v.emailInviteSent) {
      actions.push({ key: 'send-email', label: 'Send email invite', icon: EmailOutlinedIcon, onClick: () => alert(`Send email invite to ${v.name}`) });
    }
    if (!v.textInviteSent) {
      actions.push({ key: 'send-text', label: 'Send text invite', icon: SmsOutlinedIcon, onClick: () => alert(`Send text invite to ${v.name}`) });
    }
    if (v.emailInviteSent) {
      actions.push({ key: 'resend-email', label: 'Re-send email invite', icon: MailOutlineIcon, isResend: true, onClick: () => alert(`Re-send email invite to ${v.name}`) });
    }
    if (v.textInviteSent) {
      actions.push({ key: 'resend-text', label: 'Re-send text invite', icon: SmsOutlinedIcon, isResend: true, onClick: () => alert(`Re-send text invite to ${v.name}`) });
    }
    return actions;
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
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              tabIndex={-1}
              disableRipple
              sx={{ padding: 0 }}
              onClick={handleSelectCheckboxClick}
              onChange={() => {}}
              inputProps={{ 'aria-label': 'Select all' }}
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
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              tabIndex={-1}
              disableRipple
              sx={{ padding: 0 }}
              onClick={handleSelectCheckboxClick}
              onChange={() => {}}
              inputProps={{ 'aria-label': 'Select all' }}
            />
            Select all
          </SelectAllInline>
        </LeftTools>

        <SendMessageButton
          disbaleBoolean={selectedVoters.length === 0}
          sendMessageFunction={handleResendSelected}
          buttonText={`Resend invitation to selected (${selectedVoters.length})`}
        />
      </ToolbarRow>

      {/* Desktop column headers */}
      <DesktopHeaderRow className="u-show-desktop-tablet">
        <HeaderName>
          <CheckboxSpacer aria-hidden="true" />
          Name
        </HeaderName>
        <HeaderInvitedVia>Invited via</HeaderInvitedVia>
        <HeaderActions>Recommended staff actions</HeaderActions>
      </DesktopHeaderRow>

      {visibleSupporters.length === 0 ? (
        <EmptyState>No voters to remind in this view.</EmptyState>
      ) : (
        <CardList>
          {visibleSupporters.map((v) => {
            const isChecked = selected.has(v.id);
            const actions = getRecommendedActions(v);

            return (
              <RemindCard key={v.id} $selected={isChecked}>
                {/* Desktop row layout */}
                <DesktopRow className="u-show-desktop-tablet">
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
                    {actions.map((a) => (
                      <ActionLinkButton key={a.key} type="button" onClick={a.onClick}>
                        {a.isResend && <AutorenewIcon sx={{ fontSize: 16 }} />}
                        <a.icon sx={{ fontSize: 18 }} />
                        {a.label}
                      </ActionLinkButton>
                    ))}
                  </ActionsCell>
                </DesktopRow>

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
                    {actions.map((a) => (
                      <MobileActionPill key={a.key} type="button" onClick={a.onClick}>
                        {a.label}
                      </MobileActionPill>
                    ))}
                  </MobileActions>
                </div>
              </RemindCard>
            );
          })}
        </CardList>
      )}

      <SendMessageButtonMobile
        disbaleBoolean={selectedVoters.length === 0}
        sendThankYouFunction={handleResendSelected}
        buttonText={`Resend invitation to selected (${selectedVoters.length})`}
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

const ActionLinkButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 500;
  gap: 6px;
  padding: 4px 0;
  white-space: nowrap;

  &:hover {
    color: ${DesignTokenColors.primary700};
    text-decoration: underline;
  }
`;

const ActionsCell = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 14px;
`;

/* Same width as the row checkbox so "Name" header aligns with the data row's name text */
const CheckboxSpacer = styled.span`
  display: inline-block;
  height: 13px;
  width: 13px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DesktopHeaderRow = styled.div`
  align-items: center;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  color: ${DesignTokenColors.neutralUI600};
  display: grid;
  font-size: 13px;
  gap: 12px;
  grid-template-columns: minmax(140px, 0.8fr) minmax(70px, 0.4fr) minmax(340px, 1.8fr);
  padding: 8px 14px;
`;

const DesktopRow = styled.div`
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(140px, 0.8fr) minmax(70px, 0.4fr) minmax(340px, 1.8fr);
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

const KebabBtn = styled.button`
  background: transparent;
  border: none;
  border-radius: 10px;
  color: ${DesignTokenColors.neutralUI600};
  cursor: pointer;
  padding: 2px 6px;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const MobileActionPill = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.primary600};
  border-radius: 9999px;
  color: ${DesignTokenColors.primary700};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  width: 100%;

  &:hover {
    background: ${DesignTokenColors.primary50};
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const MobileFieldLabel = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  margin-top: 8px;
`;

const MobileFieldValue = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 14px;
  font-weight: 500;
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

const NameCell = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
`;

const NameText = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 15px;
  font-weight: 600;
`;

const RemindCard = styled(Card)`
  background: ${(p) => (p.$selected ? DesignTokenColors.primary50 : DesignTokenColors.neutralUI50)};
  border: 1px solid ${(p) => (p.$selected ? DesignTokenColors.primary200 : DesignTokenColors.neutralUI200)};
  padding: 12px 14px;

  @media (min-width: 576px) {
    background: ${(p) => (p.$selected ? DesignTokenColors.primary50 : DesignTokenColors.whiteUI)};
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    box-shadow: none;
  }
`;

const RightOptions = styled.div`
  align-items: center;
  display: flex;
  margin-left: auto;
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

const SelectAllInline = styled.label`
  align-items: center;
  color: ${DesignTokenColors.neutralUI700};
  display: inline-flex;
  font-size: 14px;
  gap: 6px;
  line-height: 1;
  margin: 0;
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

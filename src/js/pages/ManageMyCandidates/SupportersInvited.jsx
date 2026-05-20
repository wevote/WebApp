/* eslint-disable no-alert */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
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
import { CardTopRow, Container, KebabBtn, NameRow, NameText, RightOptions } from '../../components/Style/ManageMyCandidates';
import { ActionLinkButton, DesktopGridHeader, DesktopGridRow, FlatCardList, FlatRowCard, MobileToolbar, NameCell, SearchBtn, SelectAllInline } from '../../components/Style/SupporterTrackingStyles';

const GRID_COLS = 'minmax(160px, 220px) minmax(140px, 1.1fr) minmax(140px, 1.1fr) minmax(110px, 0.7fr) minmax(70px, 0.4fr) minmax(110px, 0.6fr)';

export default function SupportersInvited ({ supporters }) {
  const headerActionSlot = useContext(TrackingHeaderActionContext);
  const [selected, setSelected] = useState(() => new Set());
  const [sendToast, setSendToast] = useState({ open: false, ok: true, msg: '' });
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [rowMenuVoter, setRowMenuVoter] = useState(null);

  useEffect(() => {
    const visibleIds = new Set(supporters.map((v) => v.id));
    setSelected((prev) => new Set([...prev].filter((id) => visibleIds.has(id))));
  }, [supporters]);

  const totalCount = supporters.length;
  const selectedCount = useMemo(
    () => supporters.filter((v) => selected.has(v.id)).length,
    [supporters, selected],
  );
  const allChecked = totalCount > 0 && selectedCount === totalCount;
  const indeterminate = selectedCount > 0 && selectedCount < totalCount;

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
    setSelected((prev) => (prev.size === 0 ? new Set(supporters.map((v) => v.id)) : new Set()));
  };

  const openRowMenu = (e, voter) => {
    e.stopPropagation();
    setRowMenuAnchorEl(e.currentTarget);
    setRowMenuVoter(voter);
  };

  const handleResendSelected = () => {
    if (selectedCount === 0) return;
    setSendToast({
      open: true,
      ok: true,
      msg: `Resent invitation to ${selectedCount} voter${selectedCount === 1 ? '' : 's'}.`,
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

  return (
    <Container>
      {headerActionSlot && createPortal(
        <SendMessageButton
          verb="Resend invite"
          count={selectedCount}
          onClick={handleResendSelected}
        />,
        headerActionSlot,
      )}

      {/* Mobile toolbar */}
      <MobileToolbar className="u-show-mobile">
        <SelectAllInline>
          <SelectAllCheckbox
            checked={allChecked}
            indeterminate={indeterminate}
            onClick={handleSelectCheckboxClick}
          />
          Select all
        </SelectAllInline>
        <SearchBtn
          type="button"
          aria-label="Search"
          onClick={() => console.log('TODO: implement search feature')}
        >
          <SearchIcon sx={{ fontSize: 22 }} />
        </SearchBtn>
      </MobileToolbar>

      {/* Desktop column headers (with Select all in the first cell) */}
      <DesktopGridHeader className="u-show-desktop-tablet" $cols={GRID_COLS}>
        <HeaderCell>
          <SelectAllInline>
            <SelectAllCheckbox
              checked={allChecked}
              indeterminate={indeterminate}
              onClick={handleSelectCheckboxClick}
            />
            Select all
          </SelectAllInline>
        </HeaderCell>
        <HeaderCell />
        <HeaderCell />
        <HeaderCell>Invite link clicked</HeaderCell>
        <HeaderCell>Joined</HeaderCell>
        <HeaderCell>Friends invited</HeaderCell>
      </DesktopGridHeader>

      <FlatCardList>
        {supporters.map((v) => {
          const isChecked = selected.has(v.id);
          return (
            <FlatRowCard key={v.id} $selected={isChecked}>
              {/* Desktop row */}
              <DesktopGridRow className="u-show-desktop-tablet" $cols={GRID_COLS}>
                <NameCell>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelected(v.id)}
                    aria-label={`Select ${v.name}`}
                  />
                  <NameText>{v.name}</NameText>
                </NameCell>

                <StatusCell>
                  {v.emailInviteSent ? (
                    <SentStatus>
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                      Email invite sent
                    </SentStatus>
                  ) : (
                    <ActionLinkButton type="button" onClick={() => alert(`Send email invite to ${v.name}`)}>
                      <EmailOutlinedIcon sx={{ fontSize: 18 }} />
                      Send email invite
                    </ActionLinkButton>
                  )}
                </StatusCell>

                <StatusCell>
                  {v.textInviteSent ? (
                    <SentStatus>
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                      Text invite sent
                    </SentStatus>
                  ) : (
                    <ActionLinkButton type="button" onClick={() => alert(`Send text invite to ${v.name}`)}>
                      <SmsOutlinedIcon sx={{ fontSize: 18 }} />
                      Send text invite
                    </ActionLinkButton>
                  )}
                </StatusCell>

                <StatusCell>
                  {v.inviteLinkClicked ? (
                    <YesStatus>
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                      Yes
                    </YesStatus>
                  ) : 'No'}
                </StatusCell>

                <StatusCell>
                  {v.joined ? (
                    <YesStatus>
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                      Yes
                    </YesStatus>
                  ) : 'No'}
                </StatusCell>

                <StatusCell>
                  {v.friendsInvited > 0 && (
                    <YesStatus>
                      <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                      {v.friendsInvited}
                    </YesStatus>
                  )}
                </StatusCell>
              </DesktopGridRow>

              {/* Mobile card */}
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
                    <KebabBtn type="button" aria-label="More options" onClick={(e) => openRowMenu(e, v)}>
                      <MoreHorizIcon sx={{ fontSize: 20 }} />
                    </KebabBtn>
                  </RightOptions>
                </CardTopRow>

                <FieldGrid>
                  <Field>
                    <FieldLabel>Invited via</FieldLabel>
                    <FieldValue>{getInvitedViaLabel(v)}</FieldValue>
                  </Field>
                  <Field>
                    <FieldLabel>Invite link clicked</FieldLabel>
                    <FieldValue>
                      {v.inviteLinkClicked ? (
                        <YesStatus>
                          <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                          Yes
                        </YesStatus>
                      ) : 'No'}
                    </FieldValue>
                  </Field>
                  <Field>
                    <FieldLabel>Joined</FieldLabel>
                    <FieldValue>
                      {v.joined ? (
                        <YesStatus>
                          <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                          Yes
                        </YesStatus>
                      ) : 'No'}
                    </FieldValue>
                  </Field>
                  <Field>
                    <FieldLabel>Friends invited</FieldLabel>
                    <FieldValue>
                      {v.friendsInvited > 0 ? (
                        <YesStatus>
                          <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                          {v.friendsInvited}
                        </YesStatus>
                      ) : 'None'}
                    </FieldValue>
                  </Field>
                </FieldGrid>

                {!v.emailInviteSent && (
                  <ActionLinkButton type="button" onClick={() => alert(`Send email invite to ${v.name}`)}>
                    <EmailOutlinedIcon sx={{ fontSize: 18 }} />
                    Send email invite
                  </ActionLinkButton>
                )}
                {!v.textInviteSent && (
                  <ActionLinkButton type="button" onClick={() => alert(`Send text invite to ${v.name}`)}>
                    <SmsOutlinedIcon sx={{ fontSize: 18 }} />
                    Send text invite
                  </ActionLinkButton>
                )}
              </div>
            </FlatRowCard>
          );
        })}
      </FlatCardList>

      <SendMessageButtonMobile
        verb="Resend invitation to selected"
        count={selectedCount}
        onClick={handleResendSelected}
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
SupportersInvited.propTypes = {
  supporters: PropTypes.arrayOf(PropTypes.object),
};

/* ===== Styled components ===== */

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 6px;
`;

const FieldLabel = styled.div`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 12px;
`;

const FieldValue = styled.div`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 13px;
  font-weight: 500;
`;

const HeaderCell = styled.div``;

const SentStatus = styled.span`
  align-items: center;
  color: ${DesignTokenColors.neutralUI800};
  display: inline-flex;
  font-size: 14px;
  gap: 4px;
`;

const StatusCell = styled.div`
  color: ${DesignTokenColors.neutralUI800};
  font-size: 14px;
`;

const YesStatus = styled.span`
  align-items: center;
  color: ${DesignTokenColors.neutralUI900};
  display: inline-flex;
  font-weight: 600;
  gap: 4px;
`;

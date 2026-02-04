import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import ModalDisplayTemplateC from '../Widgets/ModalDisplayTemplateC';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

function formatWhen (iso) {
  try {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

export default function ImportHistoryModal ({ isOpen, onClose, voters }) {
  const [query, setQuery] = useState('');

  const filtered = voters.filter((v) => [v.name, v.email, v.phone].some((f) => (f || '').toLowerCase().includes(query.toLowerCase())));

  const headerJSX = (
    <Header>
      <HeaderLeft>
        <Title>History of imported voters</Title>
        <Divider />
        <SearchField>
          <SearchIcon fontSize="small" />
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
          />
        </SearchField>
      </HeaderLeft>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
    </Header>
  );

  const bodyJSX = (
    <Body>
      <VoterList>
        {filtered.map((v, idx) => {
          const id = v.id || v._idx || `history_${idx}`;
          return (
            <VoterCard key={id}>
              <VoterName>{v.name || '—'}</VoterName>
              <InfoGrid className="u-show-desktop-tablet">
                <InfoItem>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{v.email || '—'}</InfoValue>
                </InfoItem>
                <InfoDivider />
                <InfoItem>
                  <InfoLabel>Phone</InfoLabel>
                  <InfoValue>{v.phone || '—'}</InfoValue>
                </InfoItem>
                <InfoDivider />
                <InfoItem>
                  <InfoLabel>Added via</InfoLabel>
                  <InfoValue>{v.source || 'Manual entry'}</InfoValue>
                </InfoItem>
                <InfoDivider />
                <InfoItem>
                  <InfoLabel>Added by</InfoLabel>
                  <InfoValue>{v.addedBy || 'You'}</InfoValue>
                </InfoItem>
                <InfoDivider />
                <InfoItem>
                  <InfoLabel>Added on</InfoLabel>
                  <InfoValue>{formatWhen(v.addedAt)}</InfoValue>
                </InfoItem>
              </InfoGrid>

              <InfoGrid className="u-show-mobile">
                <InfoRow>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{v.email || '—'}</InfoValue>
                  </InfoItem>
                  <InfoDivider />
                  <InfoItem>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoValue>{v.phone || '—'}</InfoValue>
                  </InfoItem>
                </InfoRow>

                <InfoRow>
                  <InfoItem>
                    <InfoLabel>Added via</InfoLabel>
                    <InfoValue>{v.source || 'Manual entry'}</InfoValue>
                  </InfoItem>
                  <InfoDivider />
                  <InfoItem>
                    <InfoLabel>Added by</InfoLabel>
                    <InfoValue>{v.addedBy || 'You'}</InfoValue>
                  </InfoItem>
                  <InfoDivider />
                  <InfoItem>
                    <InfoLabel>Added on</InfoLabel>
                    <InfoValue>{formatWhen(v.addedAt)}</InfoValue>
                  </InfoItem>
                </InfoRow>
              </InfoGrid>
            </VoterCard>
          );
        })}
      </VoterList>
    </Body>
  );

  return (
    <>
      <OverrideDesktopBackground />
      <ModalDisplayTemplateC
        show={isOpen}
        toggleModal={onClose}
        headerJSX={headerJSX}
        bodyJSX={bodyJSX}
      />
    </>
  );
}

ImportHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
};

// Global Styles

const OverrideDesktopBackground = createGlobalStyle`
  @media (min-width: 576px) {
    .MuiDialog-paper > div:nth-child(2) {
      background: ${DesignTokenColors.whiteUI} !important;
    }
  }
`;

// Styles

const Body = styled.div`
  padding: 20px;

  @media (max-width: 575px) {
    padding: 16px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: ${DesignTokenColors.neutralUI700};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${DesignTokenColors.neutralUI100};
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${DesignTokenColors.neutralUI200};
  flex-shrink: 0;

  @media (max-width: 575px) {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  @media (max-width: 575px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const InfoDivider = styled.div`
  width: 1px;
  background: ${DesignTokenColors.neutralUI200};
  flex-shrink: 0;
  height: 32px;

  @media (max-width: 575px) {
    height: auto;
    align-self: stretch;
  }
`;

const InfoGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 575px) {
    align-items: normal;
    flex-direction: column;
    gap: 12px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  @media (max-width: 575px) {
    gap: 4px;
  }
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${DesignTokenColors.neutralUI600};

  @media (max-width: 575px) {
    font-size: 11px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 575px) {
    align-items: flex-start;
  }
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${DesignTokenColors.neutralUI900};
  overflow-wrap: break-word;
  word-break: break-word;

  @media (max-width: 575px) {
    font-size: 13px;
  }
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 8px;
  background: ${DesignTokenColors.whiteUI};
  min-width: 240px;
  flex-shrink: 0;

  svg {
    color: ${DesignTokenColors.neutralUI600};
    flex-shrink: 0;
  }

  @media (max-width: 575px) {
    width: 100%;
    min-width: unset;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: ${DesignTokenColors.neutralUI900};
  min-width: 0;

  &::placeholder {
    color: ${DesignTokenColors.neutralUI500};
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${DesignTokenColors.neutralUI900};
  margin: 0;
  white-space: nowrap;

  @media (max-width: 575px) {
    font-size: 16px;
  }
`;

const VoterCard = styled.div`
  background: ${DesignTokenColors.neutralUI50};
  border-radius: 14px;
  padding: 18px 20px;

  @media (max-width: 575px) {
    background: ${DesignTokenColors.whiteUI};
    padding: 14px;
  }
`;

const VoterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 575px) {
    gap: 12px;
  }
`;

const VoterName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${DesignTokenColors.neutralUI900};
  margin-bottom: 12px;

  @media (max-width: 575px) {
    font-size: 15px;
    margin-bottom: 10px;
  }
`;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Close } from '@mui/icons-material';
import { Chip, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import styled, { createGlobalStyle } from 'styled-components';
import ChildSafetyBody from '../../common/components/ChildSafetyBody';
import PrivacyBody from '../../common/components/PrivacyBody';
import TermsOfServiceBody from '../../common/components/TermsOfServiceBody';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const TABS = [
  { key: 'terms', label: 'Terms of Service' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'childSafety', label: 'Child Safety Standards' },
];

export default function LegalPoliciesModal ({ isOpen, onClose, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'terms');

  return (
    <>
      <SoftenCorners />
      <Dialog
        className="u-z-index-9030"
        onClose={onClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <TitleRow>
            <ChipRow>
              {TABS.map(({ key, label }) => (
                <Chip
                  key={key}
                  label={label}
                  onClick={() => setActiveTab(key)}
                  color={activeTab === key ? 'primary' : 'default'}
                  variant={activeTab === key ? 'filled' : 'outlined'}
                />
              ))}
            </ChipRow>
            <IconButton
              aria-label="Close"
              onClick={onClose}
              id="closeLegalPoliciesModal"
              size="small"
            >
              <Close />
            </IconButton>
          </TitleRow>
        </DialogTitle>
        <DialogContent dividers>
          {activeTab === 'terms' && <TermsOfServiceBody />}
          {activeTab === 'privacy' && <PrivacyBody />}
          {activeTab === 'childSafety' && <ChildSafetyBody />}
        </DialogContent>
      </Dialog>
    </>
  );
}

LegalPoliciesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(['terms', 'privacy', 'childSafety']),
};

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeLegalPoliciesModal) {
    border-radius: 20px !important;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-right: 8px;

  .MuiChip-root {
    font-weight: 600;
  }

  .MuiChip-colorPrimary {
    background-color: ${DesignTokenColors.primary700};
  }
`;

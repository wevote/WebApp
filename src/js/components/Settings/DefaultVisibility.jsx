import * as React from 'react';
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButton as MuiToggleButton,
} from '@mui/material';
import styled, { keyframes } from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import webAppConfig from '../../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


/* ---------- Component ---------- */

const PrivacyData = () => {
  const [alignment, setAlignment] = React.useState('public');
  const [animKey, setAnimKey] = React.useState(0);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }

    // Trigger checkmark animation after saving
    setAnimKey(k => k + 1);
  };

  if (!nextReleaseFeaturesEnabled) {
    return null;
  }

  return (
    <div className="u-stack--md">
        <h4 className="h4" id="defaultVisibilityText">
          Default visibility for your future ballot choices &amp; opinions
        </h4>

        <PrivacyToggleButtonGroupContainer>
          <PrivacyToggleButtonGroup
            exclusive
            value={alignment}
            onChange={handleAlignment}
            aria-label="Privacy visibility"
            size="small"
          >
            <PrivacyToggleButton value="public">Public</PrivacyToggleButton>
            <PrivacyToggleButton value="friends">WeVote Friends</PrivacyToggleButton>
            <PrivacyToggleButton value="private">Private</PrivacyToggleButton>
            
          </PrivacyToggleButtonGroup>

          {animKey > 0 && (
          <CheckmarkContainer key={animKey}>
            ✓ SAVED
          </CheckmarkContainer>
          )}
        </PrivacyToggleButtonGroupContainer>

        <DataSettingText>
        <font style={{ fontStyle: 'italic' }}>
        Changing your default visibility won't affect past choices or opinions.
        You can still adjust the visibility for each new choice or opinion individually.
        </font>
          <ul
            style={{
              fontStyle: 'normal',
              paddingInlineStart: '20px',
              marginTop: '10px',
            }}
          >
            <li>
            <font style={{ fontWeight: 'bold', color: DesignTokenColors.neutralUI900 }}>Public (recommended): </font> 
            Expand your reach and influence beyond just your friends.
            </li>
            <li>
            <font style={{ fontWeight: 'bold', color: DesignTokenColors.neutralUI900 }}>Your WeVote friends: </font>
            People on the platform you've added as friends-so you can see and share opinions more easily.
            </li>
            <li>
            <font style={{ fontWeight: 'bold', color: DesignTokenColors.neutralUI900 }}>Private: </font>
            Ideal for personal reflection or when you're not ready to share publicly.
            </li>
          </ul>
        </DataSettingText>
    </div>
  );
};

/* ---------- Styled Components ---------- */

const DataSettingText = styled('div')`
  color: ${DesignTokenColors.neutralUI500};
  margin-bottom: 30px;
`;

const PrivacyToggleButtonGroup = muiStyled(MuiToggleButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const PrivacyToggleButton = muiStyled(MuiToggleButton)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: '15px',
  borderColor: DesignTokenColors.neutralUI500,
  color: DesignTokenColors.neutralUI700,
  minHeight: theme.spacing(4),
  padding: theme.spacing(0, 1),
  '&.Mui-selected': {
    color: DesignTokenColors.info800,
    fontWeight: 'bold',
    borderColor: DesignTokenColors.info800,
    borderTop: `2px solid ${theme.palette.primary.main}`,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

const PrivacyToggleButtonGroupContainer = styled('div')`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: left;
  vertical-align: middle;
`;

const checkmarkFade = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  30% {
    opacity: 1;
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`;

const CheckmarkContainer = styled.div`
  font-size: 16px;
  color: ${DesignTokenColors.confirmation500};
  padding-bottom: 14px;
  animation: ${checkmarkFade} 1.5s ease-in-out forwards;
`;

export default PrivacyData;
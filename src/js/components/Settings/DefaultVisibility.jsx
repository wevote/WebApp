import * as React from 'react';
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButton as MuiToggleButton,
} from '@mui/material';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import { grey as muiGrey, blue as muiBlue } from '@mui/material/colors';


/* ---------- Component ---------- */

const PrivacyData = () => {
  const [alignment, setAlignment] = React.useState('public');

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  return (
    <div className="u-stack--md">
        <h4 className="h4" id="defaultVisibilityText">
          Default visibility for your future ballot choices &amp; opinions
        </h4>

        <PrivacyToggleButtonGroup
          exclusive
          value={alignment}
          onChange={handleAlignment}
          aria-label="Privacy visibility"
          color="primary"
          size="small"
        >
          <PrivacyToggleButton value="public">Public</PrivacyToggleButton>
          <PrivacyToggleButton value="friends">WeVote Friends</PrivacyToggleButton>
          <PrivacyToggleButton value="private">Private</PrivacyToggleButton>
        </PrivacyToggleButtonGroup>

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
            <font style={{ fontWeight: 'bold', color: '#000' }}>Public (recommended): </font> 
            Expand your reach and influence beyond just your friends.
            </li>
            <li>
            <font style={{ fontWeight: 'bold', color: '#000' }}>Your WeVote friends: </font>
            People on the platform you've added as friends-so you can see and share opinions more easily.
            </li>
            <li>
            <font style={{ fontWeight: 'bold', color: '#000' }}>Private: </font>
            Ideal for personal reflection or when you're not ready to share publicly.
            </li>
          </ul>
        </DataSettingText>
    </div>
  );
};

/* ---------- Styled Components ---------- */

const DataSettingText = styled('div')`
  color: #808080;
  margin-bottom: 30px;
`;

const PrivacyToggleButtonGroup = muiStyled(MuiToggleButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const PrivacyToggleButton = muiStyled(MuiToggleButton)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: '15px',
  borderColor: muiGrey[500],
  color: muiGrey[700],
  minHeight: theme.spacing(4),
  padding: theme.spacing(0, 1),
  '&.Mui-selected': {
    color: muiBlue[800],
    fontWeight: 'bold',
    borderColor: muiBlue[800],
    borderTop: `2px solid ${theme.palette.primary.main}`,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

export default PrivacyData;
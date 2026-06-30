import PlaceIcon from '@mui/icons-material/Place';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { renderLog } from '../../common/utils/logging';

/* global $ */

export default function  GoogleSelectMenuReplica (props) {
  renderLog('GoogleAutoComplete  functional component');
  const { display, suggestions, clickHandler, inputText } = props;

  useEffect(() => {
    // Highlight the guesses with the inputText in bold font
    if (inputText && inputText.length > 0) {
      $('[class*="MuiTypography-root"]').each((index, item) => {
        const currentText = $(item).text();
        const oldHTML = $(item).html();
        if (currentText !== 'Enter Your Address') {
          const boldText = currentText.substring(0, inputText.length);
          const nonBoldText = currentText.substring(inputText.length);
          const newText = `<b>${boldText}</b>${nonBoldText}`;
          const newHTML = oldHTML.replace(currentText, newText);
          $(item).html(newHTML);
        }
      });
    }
  }, [props.inputText]);

  const localClickHandler = (address, index) => {
    console.log('----localClickHandler----', address, index);
    clickHandler(address);
  };
  return (
    <div id="GSMR-top-div" style={display ? { display: 'block'  } : { display: 'none' }}>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <nav aria-label="main mailbox folders">
          <List>
            {suggestions.map((address, index) => (
              <React.Fragment key={address.replace(' ', '')}>
                <ListItem disablePadding sx={{ width: '600px', transform: 'translateX(-23px)' }}>
                  <ListItemButton onClick={() => localClickHandler(address, index)} sx={{ padding: '0 16px' }}>
                    <PlaceIcon
                      fontSize="large"
                      sx={{ color: 'darkgray', paddingRight: '18px' }}
                      icon={address.replace(', USA', '')}
                      id="iconGoogleSelectMenuReplica"
                    />
                    <ListItemText
                      primary={address.replace(', USA', '')}
                      secondaryTypographyProps={{ fontSize: '14px', lineHeight: '.8' }}
                      primaryTypographyProps={{ sx: { whiteSpace: 'normal' } }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </nav>
      </Box>
    </div>
  );
}
GoogleSelectMenuReplica.propTypes = {
  display: PropTypes.bool.isRequired,
  suggestions: PropTypes.array.isRequired,
  clickHandler: PropTypes.func.isRequired,
  inputText: PropTypes.string,
};
